import { useState, useCallback, useRef } from 'react'
import type { PageNode, CrawlOptions, CrawlStatus } from '@/types/crawler'
import type { ViewMode, LayoutDirection } from '@/types/graph'
import { DEFAULT_CRAWL_OPTIONS } from '@/constants/mockData'

interface CrawlerState {
  status: CrawlStatus
  pages: PageNode[]
  selectedPage: PageNode | null
  currentPath: string
  pagesFound: number
  options: CrawlOptions
  viewMode: ViewMode
  layoutDirection: LayoutDirection
  error: string | null
  crawlUrl: string
}

interface CrawlerActions {
  startCrawl: (url?: string) => void
  stopCrawl: () => void
  loadExample: () => void
  resetCrawl: () => void
  selectPage: (page: PageNode | null) => void
  setOptions: (opts: Partial<CrawlOptions>) => void
  setViewMode: (mode: ViewMode) => void
  setLayoutDirection: (dir: LayoutDirection) => void
}

const initialState: CrawlerState = {
  status: 'idle',
  pages: [],
  selectedPage: null,
  currentPath: '',
  pagesFound: 0,
  options: DEFAULT_CRAWL_OPTIONS,
  viewMode: 'graph',
  layoutDirection: 'TB',
  error: null,
  crawlUrl: '',
}

export function useCrawler(): CrawlerState & CrawlerActions {
  const [state, setState] = useState<CrawlerState>(initialState)
  const eventSourceRef = useRef<EventSource | null>(null)
  const completedRef = useRef(false)

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }

  const startCrawl = useCallback((url?: string) => {
    const targetUrl = url ?? state.options.url
    if (!targetUrl) return

    closeEventSource()
    completedRef.current = false

    setState((prev) => ({
      ...prev,
      status: 'crawling',
      pages: [],
      selectedPage: null,
      currentPath: targetUrl,
      pagesFound: 0,
      error: null,
      crawlUrl: targetUrl,
      options: { ...prev.options, url: targetUrl },
    }))

    const params = new URLSearchParams({
      url: targetUrl,
      maxDepth: String(state.options.maxDepth),
      maxPages: String(state.options.maxPages),
      respectRobots: String(state.options.respectRobots),
      includeExternal: String(state.options.includeExternal),
    })

    const source = new EventSource(`/api/crawl?${params.toString()}`)
    eventSourceRef.current = source

    source.onmessage = (e) => {
      try {
        const page: PageNode = JSON.parse(e.data)
        setState((prev) => ({
          ...prev,
          pages: [...prev.pages, page],
          pagesFound: prev.pagesFound + 1,
          currentPath: page.url,
        }))
      } catch {
        // Ignore malformed events
      }
    }

    source.addEventListener('complete', () => {
      completedRef.current = true
      source.close()
      eventSourceRef.current = null
      setState((prev) => ({ ...prev, status: 'complete', currentPath: '' }))
    })

    source.addEventListener('crawl-error', (e) => {
      completedRef.current = true
      source.close()
      eventSourceRef.current = null
      let message = 'Crawl failed'
      try {
        message = JSON.parse((e as MessageEvent).data).message
      } catch {
        // Use default message
      }
      setState((prev) => ({ ...prev, status: 'error', error: message }))
    })

    // SSE connection error (server down, network issue)
    // Guard: ignore if crawl already completed — browser fires onerror when server closes connection
    source.onerror = () => {
      if (completedRef.current) return
      source.close()
      eventSourceRef.current = null
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Could not connect to the crawl server. Make sure the server is running (`npm run dev`).',
      }))
    }
  }, [state.options])

  const stopCrawl = useCallback(() => {
    closeEventSource()
    setState((prev) => ({ ...prev, status: 'idle' }))
  }, [])

  const loadExample = useCallback(() => {
    startCrawl('https://example.com')
  }, [startCrawl])

  const resetCrawl = useCallback(() => {
    closeEventSource()
    setState((prev) => ({
      ...prev,
      status: 'idle',
      pages: [],
      selectedPage: null,
      currentPath: '',
      pagesFound: 0,
      error: null,
    }))
  }, [])

  const selectPage = useCallback((page: PageNode | null) => {
    setState((prev) => ({ ...prev, selectedPage: page }))
  }, [])

  const setOptions = useCallback((opts: Partial<CrawlOptions>) => {
    setState((prev) => ({ ...prev, options: { ...prev.options, ...opts } }))
  }, [])

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }))
  }, [])

  const setLayoutDirection = useCallback((dir: LayoutDirection) => {
    setState((prev) => ({ ...prev, layoutDirection: dir }))
  }, [])

  return {
    ...state,
    startCrawl,
    stopCrawl,
    loadExample,
    resetCrawl,
    selectPage,
    setOptions,
    setViewMode,
    setLayoutDirection,
  }
}
