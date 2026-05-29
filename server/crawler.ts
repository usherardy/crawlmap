import axios from 'axios'
import * as cheerio from 'cheerio'
import { fetchRobotsRules, isDisallowed } from './robots.js'

export interface PageNode {
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

export interface CrawlOptions {
  url: string
  maxDepth: number
  maxPages: number
  respectRobots: boolean
  includeExternal: boolean
}

export type OnPageCallback = (page: PageNode) => void
export type IsAbortedFn = () => boolean

const USER_AGENT = 'CrawlMap/1.0 (+https://crawlmap.dev/bot)'
const POLITE_DELAY_MS = 100

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeUrl(href: string, base: string): string | null {
  try {
    const resolved = new URL(href, base)
    resolved.hash = ''
    // Remove trailing slash except for root path
    if (resolved.pathname !== '/') {
      resolved.pathname = resolved.pathname.replace(/\/$/, '')
    }
    return resolved.href
  } catch {
    return null
  }
}

function getOrigin(url: string): string {
  return new URL(url).origin
}

function getPath(url: string): string {
  try { return new URL(url).pathname || '/' } catch { return '/' }
}

// ── Sitemap discovery ───────────────────────────────────────────────────────

async function fetchSitemapUrls(origin: string, robotsText: string): Promise<string[]> {
  const candidates: string[] = []

  // Honour Sitemap: directives from robots.txt
  for (const line of robotsText.split('\n')) {
    const match = line.match(/^sitemap:\s*(.+)/i)
    if (match) candidates.push(match[1].trim())
  }

  // Common fallback locations
  candidates.push(`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap/sitemap.xml`)

  const urls: string[] = []
  const seenSitemaps = new Set<string>()

  async function parseSitemap(sitemapUrl: string): Promise<void> {
    if (seenSitemaps.has(sitemapUrl)) return
    seenSitemaps.add(sitemapUrl)

    try {
      const res = await axios.get<string>(sitemapUrl, {
        timeout: 8_000,
        responseType: 'text',
        headers: { 'User-Agent': USER_AGENT },
        validateStatus: (s) => s === 200,
      })
      const xml = res.data

      // Sitemap index — recurse into child sitemaps
      const sitemapLocMatches = xml.match(/<sitemap>[\s\S]*?<\/sitemap>/g) ?? []
      for (const block of sitemapLocMatches) {
        const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim()
        if (loc) await parseSitemap(loc)
      }

      // Regular sitemap — collect <loc> entries
      const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? []
      for (const block of urlBlocks) {
        const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim()
        if (loc) {
          const normalized = normalizeUrl(loc, origin)
          if (normalized && getOrigin(normalized) === origin) {
            urls.push(normalized)
          }
        }
      }
    } catch {
      // Sitemap not found or parse error — skip silently
    }
  }

  for (const candidate of candidates) {
    await parseSitemap(candidate)
    if (urls.length > 0) break // Stop after first successful sitemap
  }

  return [...new Set(urls)]
}

// ── Main crawl ──────────────────────────────────────────────────────────────

export async function runCrawl(
  options: CrawlOptions,
  onPage: OnPageCallback,
  isAborted: IsAbortedFn
): Promise<void> {
  const startUrl = normalizeUrl(options.url, options.url)
  if (!startUrl) throw new Error('Invalid start URL')

  const origin = getOrigin(startUrl)

  // Fetch robots.txt once — reuse text for sitemap discovery
  let robotsText = ''
  const robotsRules = options.respectRobots
    ? await fetchRobotsRules(origin).then((rules) => {
        // Also grab raw text for Sitemap: directive parsing
        axios.get(`${origin}/robots.txt`, { timeout: 5_000, responseType: 'text' })
          .then((r) => { robotsText = r.data as string })
          .catch(() => {})
        return rules
      })
    : { disallowed: [] }

  // Sitemap discovery — seed BFS queue with all known pages
  const sitemapUrls = await fetchSitemapUrls(origin, robotsText)

  const visited = new Set<string>()
  const externalQueue = new Set<string>() // External links to status-check after BFS

  // BFS queue — root first, then sitemap pages at depth 1
  const queue: Array<{ url: string; depth: number; parentId: string | null }> = [
    { url: startUrl, depth: 0, parentId: null },
  ]

  // Add sitemap URLs that aren't the root
  for (const u of sitemapUrls) {
    if (u !== startUrl) {
      queue.push({ url: u, depth: 1, parentId: startUrl })
    }
  }

  let pagesFound = 0

  // ── BFS loop ──────────────────────────────────────────────────────────────
  while (queue.length > 0 && !isAborted()) {
    if (pagesFound >= options.maxPages) break

    const item = queue.shift()!
    const { url, depth, parentId } = item

    if (visited.has(url)) continue
    visited.add(url)

    // Check robots.txt
    try {
      if (isDisallowed(getPath(url), robotsRules)) continue
    } catch {
      continue
    }

    // Fetch page
    let statusCode: number | null = null
    let html = ''
    let finalUrl = url

    try {
      const res = await axios.get<string>(url, {
        timeout: 10_000,
        responseType: 'text',
        maxRedirects: 5,
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
        validateStatus: () => true,
      })
      statusCode = res.status
      html = typeof res.data === 'string' ? res.data : ''
      finalUrl = (res.request as { res?: { responseUrl?: string } })?.res?.responseUrl ?? url
    } catch {
      // Network error — skip page, continue BFS
      continue
    }

    // Parse HTML (even for error pages — title might be meaningful)
    const $ = cheerio.load(html)
    const title = $('title').first().text().trim() || ''
    const canonicalHref = $('link[rel="canonical"]').attr('href') ?? null
    const canonical = canonicalHref ? normalizeUrl(canonicalHref, finalUrl) : null

    const internalLinks: string[] = []
    const externalLinks: string[] = []

    // Only extract links from successful / redirect pages
    const isSuccess = statusCode !== null && statusCode < 400
    if (isSuccess) {
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')
        if (!href) return
        if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return

        const resolved = normalizeUrl(href, finalUrl)
        if (!resolved) return

        try {
          const resolvedOrigin = getOrigin(resolved)
          if (resolvedOrigin === origin) {
            if (!visited.has(resolved) && !internalLinks.includes(resolved)) {
              internalLinks.push(resolved)
            }
          } else {
            if (!externalLinks.includes(resolved)) {
              externalLinks.push(resolved)
              if (options.includeExternal) externalQueue.add(resolved)
            }
          }
        } catch {
          // Unparseable URL — ignore
        }
      })
    }

    // Enqueue unvisited internal links within depth limit
    if (depth < options.maxDepth) {
      for (const link of internalLinks) {
        if (!visited.has(link) && queue.length + pagesFound < options.maxPages * 3) {
          queue.push({ url: link, depth: depth + 1, parentId: url })
        }
      }
    }

    onPage({
      id: url,
      url,
      path: getPath(url),
      title,
      depth,
      statusCode,
      childCount: internalLinks.length,
      parentId,
      internalLinks,
      externalLinks,
      canonical,
      isExternal: false,
    })
    pagesFound++

    if (!isAborted() && queue.length > 0 && pagesFound < options.maxPages) {
      await sleep(POLITE_DELAY_MS)
    }
  }

  // ── External link status check ──────────────────────────────────────────
  // After BFS completes, HEAD-check each external URL and emit as a node.
  // Capped at 50 to avoid hammering external servers.
  if (options.includeExternal && !isAborted()) {
    const externalList = [...externalQueue].slice(0, 50)
    for (const extUrl of externalList) {
      if (isAborted()) break

      let statusCode: number | null = null
      try {
        const res = await axios.head(extUrl, {
          timeout: 5_000,
          maxRedirects: 3,
          headers: { 'User-Agent': USER_AGENT },
          validateStatus: () => true,
        })
        statusCode = res.status
      } catch {
        statusCode = null // Unreachable
      }

      // Try to find a parentId (the first internal page that linked to this URL)
      const parentPage = [...visited].find((v) => v !== extUrl) ?? null

      onPage({
        id: extUrl,
        url: extUrl,
        path: getPath(extUrl),
        title: getOrigin(extUrl).replace(/^https?:\/\//, ''),
        depth: 1,
        statusCode,
        childCount: 0,
        parentId: parentPage,
        internalLinks: [],
        externalLinks: [],
        canonical: null,
        isExternal: true,
      })

      await sleep(100)
    }
  }
}
