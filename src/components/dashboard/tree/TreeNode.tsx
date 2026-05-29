import { useState } from 'react'
import { ChevronRight, FileText, FolderOpen, Folder } from 'lucide-react'
import { cn } from '@/utils/cn'
import { StatusBadge } from '@/components/ui/Badge'
import type { PageNode } from '@/types/crawler'

interface TreeNodeProps {
  page: PageNode
  children: PageNode[]
  allPages: PageNode[]
  selectedId: string | null
  onSelect: (page: PageNode) => void
  depth?: number
}

export function TreeNode({ page, children, allPages, selectedId, onSelect, depth = 0 }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = children.length > 0

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-100 group',
          selectedId === page.id
            ? 'bg-accent/15 text-text-primary'
            : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(page)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((v) => !v)
            }}
            className="flex-shrink-0 text-text-muted hover:text-text-secondary transition-transform duration-150"
          >
            <ChevronRight
              className={cn('w-3 h-3 transition-transform duration-150', expanded && 'rotate-90')}
            />
          </button>
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        <span className="flex-shrink-0 text-text-muted">
          {hasChildren ? (
            expanded ? (
              <FolderOpen className="w-3.5 h-3.5" />
            ) : (
              <Folder className="w-3.5 h-3.5" />
            )
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
        </span>

        <span className="flex-1 text-xs font-mono truncate" title={page.path}>
          {page.path}
        </span>

        <StatusBadge code={page.statusCode} />
      </div>

      {hasChildren && expanded && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              page={child}
              children={allPages.filter((p) => p.parentId === child.id)}
              allPages={allPages}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
