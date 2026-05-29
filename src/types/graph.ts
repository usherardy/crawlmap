import type { Node, Edge } from '@xyflow/react'

export interface CrawlNodeData {
  label: string
  url: string
  path: string
  depth: number
  statusCode: number | null
  childCount: number
  isRoot: boolean
  nodeType: 'root' | 'section' | 'page' | 'external'
  [key: string]: unknown
}

export interface CrawlEdgeData {
  sourceDepth: number
  [key: string]: unknown
}

export type CrawlFlowNode = Node<CrawlNodeData>
export type CrawlFlowEdge = Edge<CrawlEdgeData>

export type LayoutDirection = 'TB' | 'LR'
export type ViewMode = 'graph' | 'tree' | 'table'
