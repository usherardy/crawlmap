import express from 'express'
import cors from 'cors'
import { runCrawl, type CrawlOptions } from './crawler.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// SSE crawl endpoint
app.get('/api/crawl', async (req, res) => {
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

  // Validate URL
  try {
    new URL(url)
  } catch {
    res.status(400).json({ error: 'Invalid URL' })
    return
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Disable nginx buffering
  res.flushHeaders()

  let aborted = false
  req.on('close', () => {
    aborted = true
  })

  const options: CrawlOptions = {
    url,
    maxDepth: Math.min(Math.max(parseInt(maxDepth, 10) || 3, 1), 10),
    maxPages: Math.min(Math.max(parseInt(maxPages, 10) || 100, 1), 500),
    respectRobots: respectRobots !== 'false',
    includeExternal: includeExternal === 'true',
  }

  function sendPage(page: object) {
    res.write(`data: ${JSON.stringify(page)}\n\n`)
  }

  function sendEvent(event: string, data: object = {}) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  try {
    await runCrawl(
      options,
      (page) => {
        if (!aborted) sendPage(page)
      },
      () => aborted
    )

    if (!aborted) {
      sendEvent('complete')
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Crawl failed'
    if (!aborted) {
      sendEvent('crawl-error', { message })
    }
  } finally {
    res.end()
  }
})

app.listen(PORT, () => {
  console.log(`CrawlMap server running on http://localhost:${PORT}`)
})
