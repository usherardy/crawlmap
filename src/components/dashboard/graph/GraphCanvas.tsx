import { useCallback, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type NodeMouseHandler,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { CrawlFlowNode, CrawlFlowEdge, LayoutDirection } from '@/types/graph'
import { computeLayout } from '@/hooks/useGraphLayout'
import { GraphControls } from './GraphControls'
import { CrawlNode, type CrawlNodeType } from './CrawlNode'
import { CrawlEdge } from './CrawlEdge'

// Defined outside component to prevent node re-registration on every render
const nodeTypes: NodeTypes = { crawlNode: CrawlNode as NodeTypes[string] }
const edgeTypes: EdgeTypes = { crawlEdge: CrawlEdge as EdgeTypes[string] }

interface GraphCanvasProps {
  rawNodes: CrawlFlowNode[]
  rawEdges: CrawlFlowEdge[]
  selectedNodeId: string | null
  layoutDirection: LayoutDirection
  onNodeClick: (nodeId: string) => void
  onPaneClick: () => void
  onDirectionChange: (dir: LayoutDirection) => void
}

function GraphInner({
  rawNodes,
  rawEdges,
  selectedNodeId,
  layoutDirection,
  onNodeClick,
  onPaneClick,
  onDirectionChange,
}: GraphCanvasProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState<CrawlNodeType>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<CrawlFlowEdge>([])

  useEffect(() => {
    if (rawNodes.length === 0) {
      setNodes([])
      setEdges([])
      return
    }
    const positioned = computeLayout(rawNodes, rawEdges, layoutDirection)
    setNodes(positioned as CrawlNodeType[])
    setEdges(rawEdges)
    requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 400 })
    })
  }, [rawNodes, rawEdges, layoutDirection, setNodes, setEdges, fitView])

  const nodesWithSelection = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === selectedNodeId,
      })),
    [nodes, selectedNodeId]
  )

  const handleNodeClick: NodeMouseHandler<CrawlNodeType> = useCallback(
    (_, node) => {
      onNodeClick(node.id)
    },
    [onNodeClick]
  )

  const miniMapNodeColor = useCallback((node: CrawlNodeType) => {
    const code = node.data?.statusCode as number | null
    if (code !== null && code >= 400) return '#ef4444' // dead link — red
    if (code !== null && code >= 300) return '#f59e0b' // redirect — amber
    switch (node.data?.nodeType) {
      case 'root': return '#6366f1'
      case 'section': return '#8b5cf6'
      case 'external': return 'rgba(255,255,255,0.12)'
      case 'page': return 'rgba(255,255,255,0.22)'
      default: return 'rgba(255,255,255,0.1)'
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
        selectionKeyCode={null}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(255,255,255,0.06)"
          gap={24}
          size={1}
        />
        <MiniMap
          nodeColor={miniMapNodeColor as never}
          maskColor="rgba(10,10,15,0.85)"
          className="!bottom-4 !right-4"
          style={{ background: 'rgba(10,10,15,0.9)' }}
        />
      </ReactFlow>
      <GraphControls
        onFitView={() => fitView({ padding: 0.2, duration: 400 })}
        onZoomIn={() => zoomIn({ duration: 200 })}
        onZoomOut={() => zoomOut({ duration: 200 })}
        direction={layoutDirection}
        onDirectionChange={onDirectionChange}
      />
    </div>
  )
}

import { ReactFlowProvider } from '@xyflow/react'

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  )
}
