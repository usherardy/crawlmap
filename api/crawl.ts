import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const config = { maxDuration: 60 }

// ── Types ────────────────────────────────────────────────────────────────────

interface PageNode {
  id: string
  url: string
  path: string
  title: string
  depth: number
  statusCode: number | null
  childCount: number
  parentId: string | null
  internalLinks: string[]
  externalLinks: string[]
  canonical: string | null
  isExternal: boolean
}

interface CrawlOptions {
  url: string
  maxDepth: number
  maxPages: number
  respectRobots: boolean
  includeExternal: boolean
}

type OnPageCallback = (page: PageNode) => void
type IsAbortedFn = () => boolean

// ── Helpers ──────────────────────────────────────────────────────────────────

const UA = 'CrawlMap/1.0 (+https://crawlmap.dev/bot)'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function normalizeUrl(href: string, base: string): string | null {
  try {
    const u = new URL(href, base)
    u.hash = ''
    if (u.pathname !== '/') u.pathname = u.pathname.replace(/\/$/, '')
    return u.href
  } catch { return null }
}

function origin(url: string) { return new URL(url).origin }
function pathname(url: string) { try { return new URL(url).pathname || '/' } catch { return '/' } }

// ── Robots.txt ───────────────────────────────────────────────────────────────

async function fetchRobots(siteOrigin: string): Promise<{ disallowed: string[]; raw: string }> {
  try {
    const res = await axios.get<string>(`${siteOrigin}/robots.txt`, {
      timeout: 5_000, responseType: 'text',
      headers: { 'User-Agent': UA }, validateStatus: (s) => s === 200,
    })
    const disallowed: string[] = []
    let relevant = false
    for (const raw of res.data.split('\n')) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      if (/^user-agent:/i.test(line)) { relevant = /\*/i.test(line.split(':')[1]!); continue }
      if (relevant && /^disallow:/i.test(line)) {
        const p = line.replace(/^disallow:\s*/i, '').trim()
        if (p) disallowed.push(p)
      }
    }
    return { disallowed, raw: res.data }
  } catch { return { disallowed: [], raw: '' } }
}

function isDisallowed(path: string, rules: { disallowed: string[] }) {
  return rules.disallowed.some((d) => d === '/' || path.startsWith(d))
}

// ── Sitemap discovery ────────────────────────────────────────────────────────

async function fetchSitemapUrls(siteOrigin: string, robotsRaw: string): Promise<string[]> {
  const candidates: string[] = []
  for (const line of robotsRaw.split('\n')) {
    const m = line.match(/^sitemap:\s*(.+)/i)
    if (m) candidates.push(m[1]!.trim())
  }
  candidates.push(
    `${siteOrigin}/sitemap.xml`,
    `${siteOrigin}/sitemap_index.xml`,
    `${siteOrigin}/sitemap/sitemap.xml`,
  )

  const urls: string[] = []
  const seen = new Set<string>()

  async function parse(sitemapUrl: string): Promise<void> {
    if (seen.has(sitemapUrl)) return
    seen.add(sitemapUrl)
    try {
      const res = await axios.get<string>(sitemapUrl, {
        timeout: 8_000, responseType: 'text',
        headers: { 'User-Agent': UA }, validateStatus: (s) => s === 200,
      })
      const xml = res.data
      for (const block of xml.match(/<sitemap>[\s\S]*?<\/sitemap>/g) ?? []) {
        const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim()
        if (loc) await parse(loc)
      }
      for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
        const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim()
        if (loc) {
          const n = normalizeUrl(loc, siteOrigin)
          if (n && origin(n) === siteOrigin) urls.push(n)
        }
      }
    } catch { /* skip */ }
  }

  for (const c of candidates) {
    await parse(c)
    if (urls.length > 0) break
  }
  return [...new Set(urls)]
}

// ── Crawler ──────────────────────────────────────────────────────────────────

async function runCrawl(options: CrawlOptions, onPage: OnPageCallback, isAborted: IsAbortedFn) {
  const startUrl = normalizeUrl(options.url, options.url)
  if (!startUrl) throw new Error('Invalid start URL')

  const siteOrigin = origin(startUrl)
  const { disallowed: robotsRules, raw: robotsRaw } = options.respectRobots
    ? await fetchRobots(siteOrigin)
    : { disallowed: [], raw: '' }

  const sitemapUrls = await fetchSitemapUrls(siteOrigin, robotsRaw)

  const visited = new Set<string>()
  const externalQueue = new Set<string>()
  const queue: Array<{ url: string; depth: number; parentId: string | null }> = [
    { url: startUrl, depth: 0, parentId: null },
  ]
  for (const u of sitemapUrls) {
    if (u !== startUrl) queue.push({ url: u, depth: 1, parentId: startUrl })
  }

  let pagesFound = 0

  while (queue.length > 0 && !isAborted()) {
    if (pagesFound >= options.maxPages) break

    const item = queue.shift()!
    const { url, depth, parentId } = item

    if (visited.has(url)) continue
    visited.add(url)

    if (isDisallowed(pathname(url), { disallowed: robotsRules })) continue

    let statusCode: number | null = null
    let html = ''
    let finalUrl = url

    try {
      const res = await axios.get<string>(url, {
        timeout: 10_000, responseType: 'text', maxRedirects: 5,
        headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
        validateStatus: () => true,
      })
      statusCode = res.status
      html = typeof res.data === 'string' ? res.data : ''
      finalUrl = (res.request as { res?: { responseUrl?: string } })?.res?.responseUrl ?? url
    } catch { continue }

    const $ = cheerio.load(html)
    const title = $('title').first().text().trim() || ''
    const canonicalHref = $('link[rel="canonical"]').attr('href') ?? null
    const canonical = canonicalHref ? normalizeUrl(canonicalHref, finalUrl) : null

    const internalLinks: string[] = []
    const externalLinks: string[] = []

    if (statusCode !== null && statusCode < 400) {
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')
        if (!href || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return
        const resolved = normalizeUrl(href, finalUrl)
        if (!resolved) return
        try {
          if (origin(resolved) === siteOrigin) {
            if (!visited.has(resolved) && !internalLinks.includes(resolved)) internalLinks.push(resolved)
          } else {
            if (!externalLinks.includes(resolved)) {
              externalLinks.push(resolved)
              if (options.includeExternal) externalQueue.add(resolved)
            }
          }
        } catch { /* skip */ }
      })
    }

    if (depth < options.maxDepth) {
      for (const link of internalLinks) {
        if (!visited.has(link) && queue.length + pagesFound < options.maxPages * 3) {
          queue.push({ url: link, depth: depth + 1, parentId: url })
        }
      }
    }

    onPage({
      id: url, url, path: pathname(url), title, depth, statusCode,
      childCount: internalLinks.length, parentId,
      internalLinks, externalLinks, canonical, isExternal: false,
    })
    pagesFound++

    if (!isAborted() && queue.length > 0 && pagesFound < options.maxPages) {
      await sleep(100)
    }
  }

  // External link status check
  if (options.includeExternal && !isAborted()) {
    for (const extUrl of [...externalQueue].slice(0, 50)) {
      if (isAborted()) break
      let statusCode: number | null = null
      try {
        const res = await axios.head(extUrl, {
          timeout: 5_000, maxRedirects: 3,
          headers: { 'User-Agent': UA }, validateStatus: () => true,
        })
        statusCode = res.status
      } catch { statusCode = null }

      onPage({
        id: extUrl, url: extUrl, path: pathname(extUrl),
        title: origin(extUrl).replace(/^https?:\/\//, ''),
        depth: 1, statusCode, childCount: 0,
        parentId: [...visited][0] ?? null,
        internalLinks: [], externalLinks: [], canonical: null, isExternal: true,
      })
      await sleep(100)
    }
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    url,
    maxDepth = '3',
    maxPages = '100',
    respectRobots = 'true',
    includeExternal = 'false',
  } = req.query as Record<string, string>

  if (!url) { res.status(400).json({ error: 'Missing url' }); return }
  try { new URL(url) } catch { res.status(400).json({ error: 'Invalid URL' }); return }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  let aborted = false
  req.on('close', () => { aborted = true })

  const options: CrawlOptions = {
    url,
    maxDepth: Math.min(Math.max(parseInt(maxDepth, 10) || 3, 1), 10),
    maxPages: Math.min(Math.max(parseInt(maxPages, 10) || 100, 1), 500),
    respectRobots: respectRobots !== 'false',
    includeExternal: includeExternal === 'true',
  }

  try {
    await runCrawl(
      options,
      (page) => { if (!aborted) res.write(`data: ${JSON.stringify(page)}\n\n`) },
      () => aborted,
    )
    if (!aborted) res.write('event: complete\ndata: {}\n\n')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Crawl failed'
    if (!aborted) res.write(`event: crawl-error\ndata: ${JSON.stringify({ message })}\n\n`)
  } finally {
    res.end()
  }
}
