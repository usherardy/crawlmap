export interface CrawlOptions {
  url: string
  maxDepth: number
  maxPages: number
  respectRobots: boolean
  includeExternal: boolean
}

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

export type CrawlStatus = 'idle' | 'crawling' | 'complete' | 'error'

export interface CrawlResult {
  rootUrl: string
  pages: PageNode[]
  totalLinks: number
  crawledAt: string
  durationMs: number
  status: CrawlStatus
  error?: string
}
