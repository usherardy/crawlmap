import { memo } from 'react'
import { getSmoothStepPath, type EdgeProps, type Edge } from '@xyflow/react'
import type { CrawlEdgeData } from '@/types/graph'

export type CrawlEdgeType = Edge<CrawlEdgeData, 'crawlEdge'>

export const CrawlEdge = memo(function CrawlEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps<CrawlEdgeType>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 6,
  })

  const depth = (data?.sourceDepth as number | undefined) ?? 1
  const strokeWidth = depth === 0 ? 1.5 : 1
  const stroke = selected ? '#6366f1' : 'rgba(255,255,255,0.12)'

  return (
    <path
      d={edgePath}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      className="transition-colors duration-150"
    />
  )
})
