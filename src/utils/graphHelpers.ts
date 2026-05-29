import type { PageNode } from '@/types/crawler'
import type { CrawlFlowNode, CrawlFlowEdge } from '@/types/graph'

function getNodeType(page: PageNode): 'root' | 'section' | 'page' | 'external' {
  if (page.isExternal) return 'external'
  if (page.depth === 0) return 'root'
  if (page.childCount > 0) return 'section'
  return 'page'
}

export function buildFlowNodes(pages: PageNode[]): CrawlFlowNode[] {
  return pages.map((page) => ({
    id: page.id,
    type: 'crawlNode',
    position: { x: 0, y: 0 },
    data: {
      label: page.path,
      url: page.url,
      path: page.path,
      depth: page.depth,
      statusCode: page.statusCode,
      childCount: page.childCount,
      isRoot: page.depth === 0,
      nodeType: getNodeType(page),
    },
  }))
}

export function buildFlowEdges(pages: PageNode[]): CrawlFlowEdge[] {
  const edges: CrawlFlowEdge[] = []
  const pageMap = new Map(pages.map((p) => [p.id, p]))

  for (const page of pages) {
    if (page.parentId && pageMap.has(page.parentId)) {
      const parent = pageMap.get(page.parentId)!
      edges.push({
        id: `${page.parentId}->${page.id}`,
        source: page.parentId,
        target: page.id,
        type: 'crawlEdge',
        data: { sourceDepth: parent.depth },
      })
    }
  }

  return edges
}
