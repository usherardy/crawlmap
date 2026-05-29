import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import type { CrawlNodeData } from '@/types/graph'
import { cn } from '@/utils/cn'

export type CrawlNodeType = Node<CrawlNodeData, 'crawlNode'>

const nodeTypeStyles: Record<string, string> = {
  root: 'border-accent/60 bg-gradient-to-br from-accent/20 to-accent-violet/10',
  section: 'border-accent-violet/40 bg-white/[0.04]',
  page: 'border-white/10 bg-white/[0.03]',
  external: 'border-white/8 bg-white/[0.02]',
}

const nodeTypeDot: Record<string, string> = {
  root: 'bg-accent',
  section: 'bg-accent-violet',
  page: 'bg-text-muted',
  external: 'bg-text-muted/50',
}

function getStatusMeta(code: number | null): {
  color: string
  isDead: boolean
  isRedirect: boolean
} {
  if (code === null) return { color: 'text-text-muted', isDead: false, isRedirect: false }
  if (code >= 200 && code < 300) return { color: 'text-success', isDead: false, isRedirect: false }
  if (code >= 300 && code < 400) return { color: 'text-warning', isDead: false, isRedirect: true }
  return { color: 'text-error', isDead: true, isRedirect: false }
}

export const CrawlNode = memo(function CrawlNode({ data, selected }: NodeProps<CrawlNodeType>) {
  const { label, statusCode, childCount, nodeType, isRoot } = data
  const code = statusCode as number | null
  const { color, isDead, isRedirect } = getStatusMeta(code)

  // Dead/redirect nodes override base border+bg regardless of nodeType
  const deadStyles = isDead
    ? 'border-error/60 bg-error/[0.06] shadow-[0_0_10px_rgba(239,68,68,0.12)]'
    : isRedirect
    ? 'border-warning/50 bg-warning/[0.05]'
    : ''

  return (
    <div
      className={cn(
        'relative flex flex-col justify-center rounded-node border transition-all duration-150 cursor-pointer select-none',
        isRoot ? 'w-[220px] h-16 px-4' : 'w-[180px] h-[52px] px-3',
        deadStyles || (nodeTypeStyles[nodeType] ?? nodeTypeStyles.page),
        selected && 'ring-1 ring-accent ring-offset-0 shadow-glow-sm border-accent/60'
      )}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0 !h-0 !w-0" />

      {/* Dead link indicator badge */}
      {isDead && (
        <div className="absolute -top-2 -right-2 z-10 w-4 h-4 rounded-full bg-error flex items-center justify-center shadow-sm">
          <AlertTriangle className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      {isRedirect && !isDead && (
        <div className="absolute -top-2 -right-2 z-10 w-4 h-4 rounded-full bg-warning/80 flex items-center justify-center shadow-sm">
          <ArrowRight className="w-2.5 h-2.5 text-black" />
        </div>
      )}

      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            'flex-shrink-0 rounded-full',
            isRoot ? 'w-2 h-2' : 'w-1.5 h-1.5',
            isDead ? 'bg-error' : isRedirect ? 'bg-warning' : (nodeTypeDot[nodeType] ?? nodeTypeDot.page)
          )}
        />
        <span
          className={cn(
            'font-mono font-medium truncate',
            isRoot ? 'text-sm text-text-primary' : 'text-xs text-text-secondary'
          )}
          title={String(label)}
        >
          {String(label)}
        </span>
      </div>

      {isRoot && (
        <div className="flex items-center gap-2 mt-0.5 pl-3.5">
          <span className={cn('text-xs font-mono', color)}>
            {code ?? '—'}
          </span>
          {(childCount as number) > 0 && (
            <span className="text-xs text-text-muted">{String(childCount)} links</span>
          )}
        </div>
      )}

      {!isRoot && code !== null && (
        <div className="absolute bottom-1.5 right-2">
          <span className={cn('text-[9px] font-mono font-medium', color)}>
            {String(code)}
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!opacity-0 !h-0 !w-0" />
    </div>
  )
})
