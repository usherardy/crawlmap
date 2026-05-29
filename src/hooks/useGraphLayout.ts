import dagre from 'dagre'
import type { CrawlFlowNode, CrawlFlowEdge, LayoutDirection } from '@/types/graph'

const NODE_WIDTH = 180
const NODE_HEIGHT = 52
const ROOT_WIDTH = 210
const ROOT_HEIGHT = 64

export function computeLayout(
  nodes: CrawlFlowNode[],
  edges: CrawlFlowEdge[],
  direction: LayoutDirection = 'TB'
): CrawlFlowNode[] {
  if (nodes.length === 0) return nodes

  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: direction,
    nodesep: direction === 'TB' ? 40 : 60,
    ranksep: direction === 'TB' ? 80 : 50,
    edgesep: 20,
    marginx: 40,
    marginy: 40,
  })
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach((node) => {
    const w = node.data.isRoot ? ROOT_WIDTH : NODE_WIDTH
    const h = node.data.isRoot ? ROOT_HEIGHT : NODE_HEIGHT
    g.setNode(node.id, { width: w, height: h })
  })

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    if (!pos) return node
    const w = node.data.isRoot ? ROOT_WIDTH : NODE_WIDTH
    const h = node.data.isRoot ? ROOT_HEIGHT : NODE_HEIGHT
    return {
      ...node,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
    }
  })
}
