import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runCrawl, type CrawlOptions } from '../server/crawler.js'

// Allow up to 60 seconds for a crawl (Vercel Hobby max)
export const config = { maxDuration: 60 }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    url,
    maxDepth = '3',
    maxPages = '100',
    respectRobots = 'true',
    includeExternal = 'false',
  } = req.query as Record<string, string>

  if (!url) {
    res.status(400).json({ error: 'Missing required query param: url' })
    return
  }

  try {
    new URL(url)
  } catch {
    res.status(400).json({ error: 'Invalid URL' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
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
