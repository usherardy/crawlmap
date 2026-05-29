import type { PageNode } from '@/types/crawler'
import { TreeNode } from './TreeNode'

interface TreeViewProps {
  pages: PageNode[]
  selectedId: string | null
  onSelect: (page: PageNode) => void
}

export function TreeView({ pages, selectedId, onSelect }: TreeViewProps) {
  const roots = pages.filter((p) => p.parentId === null)

  return (
    <div className="p-2 overflow-y-auto h-full">
      {roots.map((root) => (
        <TreeNode
          key={root.id}
          page={root}
          children={pages.filter((p) => p.parentId === root.id)}
          allPages={pages}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={0}
        />
      ))}
    </div>
  )
}
