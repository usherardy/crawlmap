import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'node-html-parser'

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

function getOrigin(url: string) { return new URL(url).origin }
function getPath(url: string) { try { return new URL(url).pathname || '/' } catch { return '/' } }

async function httpGet(url: string): Promise<{ status: number; text: string; finalUrl: string } | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,*/*' },
      redirect: 'follow',
    })
    const text = await res.text()
    return { status: res.status, text, finalUrl: res.url }
  } catch { return null }
}

async function httpHead(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5_000),
      headers: { 'User-Agent': UA },
      redirect: 'follow',
    })
    return res.status
  } catch { return null }
}

// ── Robots.txt ───────────────────────────────────────────────────────────────

async function fetchRobots(siteOrigin: string): Promise<{ disallowed: string[]; raw: string }> {
  const result = await httpGet(`${siteOrigin}/robots.txt`)
  if (!result || result.status !== 200) return { disallowed: [], raw: '' }
  const disallowed: string[] = []
  let relevant = false
  for (const line of result.text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    if (/^user-agent:/i.test(t)) { relevant = /\*/i.test(t.split(':')[1]!); continue }
    if (relevant && /^disallow:/i.test(t)) {
      const p = t.replace(/^disallow:\s*/i, '').trim()
      if (p) disallowed.push(p)
    }
  }
  return { disallowed, raw: result.text }
}

function isDisallowed(path: string, disallowed: string[]) {
  return disallowed.some((d) => d === '/' || path.startsWith(d))
}

// ── Sitemap ───────────────────────────────────────────────────────────────────

async function fetchSitemapUrls(siteOrigin: string, robotsRaw: string): Promise<string[]> {
  const candidates: string[] = []
  for (const line of robotsRaw.split('\n')) {
    const m = line.match(/^sitemap:\s*(.+)/i)
    if (m) candidates.push(m[1]!.trim())
  }
  candidates.push(`${siteOrigin}/sitemap.xml`, `${siteOrigin}/sitemap_index.xml`)

  const urls: string[] = []
  const seen = new Set<string>()

  async function parseSitemap(sitemapUrl: string): Promise<void> {
    if (seen.has(sitemapUrl)) return
    seen.add(sitemapUrl)
    const result = await httpGet(sitemapUrl)
    if (!result || result.status !== 200) return
    const xml = result.text
    for (const block of xml.match(/<sitemap>[\s\S]*?<\/sitemap>/g) ?? []) {
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim()
      if (loc) await parseSitemap(loc)
    }
    for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim()
      if (loc) {
        const n = normalizeUrl(loc, siteOrigin)
        if (n && getOrigin(n) === siteOrigin) urls.push(n)
      }
    }
  }

  for (const c of candidates) {
    await parseSitemap(c)
    if (urls.length > 0) break
  }
  return [...new Set(urls)]
}

// ── Crawler ───────────────────────────────────────────────────────────────────

async function runCrawl(options: CrawlOptions, onPage: OnPageCallback, isAborted: IsAbortedFn) {
  const startUrl = normalizeUrl(options.url, options.url)
  if (!startUrl) throw new Error('Invalid start URL')

  const siteOrigin = getOrigin(startUrl)
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

    if (isDisallowed(getPath(url), robotsRules)) continue

    const result = await httpGet(url)
    if (!result) continue

    const { status: statusCode, text: html, finalUrl } = result

    let title = ''
    let canonical: string | null = null
    const internalLinks: string[] = []
    const externalLinks: string[] = []

    if (statusCode < 400) {
      const root = parse(html)
      title = root.querySelector('title')?.text?.trim() || ''
      const canonHref = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null
      canonical = canonHref ? normalizeUrl(canonHref, finalUrl) : null

      root.querySelectorAll('a[href]').forEach((el) => {
        const href = el.getAttribute('href')
        if (!href || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return
        const resolved = normalizeUrl(href, finalUrl)
        if (!resolved) return
        try {
          if (getOrigin(resolved) === siteOrigin) {
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
      id: url, url, path: getPath(url), title, depth, statusCode,
      childCount: internalLinks.length, parentId,
      internalLinks, externalLinks, canonical, isExternal: false,
    })
    pagesFound++

    if (!isAborted() && queue.length > 0 && pagesFound < options.maxPages) {
      await sleep(100)
    }
  }

  // External link status check (after main BFS)
  if (options.includeExternal && !isAborted()) {
    for (const extUrl of [...externalQueue].slice(0, 50)) {
      if (isAborted()) break
      const statusCode = await httpHead(extUrl)
      onPage({
        id: extUrl, url: extUrl, path: getPath(extUrl),
        title: getOrigin(extUrl).replace(/^https?:\/\//, ''),
        depth: 1, statusCode, childCount: 0,
        parentId: [...visited][0] ?? null,
        internalLinks: [], externalLinks: [], canonical: null, isExternal: true,
      })
      await sleep(100)
    }
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

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
