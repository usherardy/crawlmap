import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import type { PageNode } from '@/types/crawler'
import { StatusBadge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

type SortKey = 'path' | 'depth' | 'statusCode' | 'childCount'

interface TableViewProps {
  pages: PageNode[]
  selectedId: string | null
  onSelect: (page: PageNode) => void
}

export function TableView({ pages, selectedId, onSelect }: TableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('depth')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...pages].sort((a, b) => {
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-accent" />
    ) : (
      <ArrowDown className="w-3 h-3 text-accent" />
    )
  }

  const col = 'px-3 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider'
  const th = 'flex items-center gap-1 cursor-pointer hover:text-text-secondary transition-colors'

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-overlay/80 backdrop-blur-sm z-10">
          <tr className="border-b border-white/6">
            <th className={cn(col, 'w-1/2')}>
              <button className={th} onClick={() => handleSort('path')}>
                Path <SortIcon col="path" />
              </button>
            </th>
            <th className={col}>
              <button className={th} onClick={() => handleSort('depth')}>
                Depth <SortIcon col="depth" />
              </button>
            </th>
            <th className={col}>
              <button className={th} onClick={() => handleSort('statusCode')}>
                Status <SortIcon col="statusCode" />
              </button>
            </th>
            <th className={col}>
              <button className={th} onClick={() => handleSort('childCount')}>
                Links <SortIcon col="childCount" />
              </button>
            </th>
            <th className={cn(col, 'w-8')} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((page) => (
            <tr
              key={page.id}
              onClick={() => onSelect(page)}
              className={cn(
                'border-b border-white/[0.04] cursor-pointer transition-colors',
                'even:bg-white/[0.015]',
                selectedId === page.id
                  ? 'bg-accent/10 border-accent/20'
                  : 'hover:bg-white/5'
              )}
            >
              <td className="px-3 py-2.5 font-mono text-xs text-text-primary truncate max-w-0 w-1/2">
                <span title={page.path}>{page.path}</span>
              </td>
              <td className="px-3 py-2.5 text-xs text-text-secondary tabular-nums">{page.depth}</td>
              <td className="px-3 py-2.5">
                <StatusBadge code={page.statusCode} />
              </td>
              <td className="px-3 py-2.5 text-xs text-text-secondary tabular-nums">
                {page.internalLinks.length + page.externalLinks.length}
              </td>
              <td className="px-3 py-2.5">
                <a
                  href={page.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-text-muted hover:text-accent transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
