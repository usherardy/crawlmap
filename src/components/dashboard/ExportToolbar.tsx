import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { PageNode } from '@/types/crawler'
import { useExport } from '@/hooks/useExport'

interface ExportToolbarProps {
  pages: PageNode[]
  rootUrl: string
  disabled: boolean
}

const FORMATS = [
  { id: 'txt', label: 'TXT' },
  { id: 'csv', label: 'CSV' },
  { id: 'json', label: 'JSON' },
  { id: 'xml', label: 'XML' },
  { id: 'md', label: 'Markdown' },
] as const

export function ExportToolbar({ pages, rootUrl, disabled }: ExportToolbarProps) {
  const { exportData } = useExport(pages, rootUrl)

  return (
    <div className="h-11 border-t border-white/6 flex items-center px-4 gap-3 flex-shrink-0">
      <div className="flex items-center gap-1.5 text-xs text-text-muted flex-shrink-0">
        <Download className="w-3.5 h-3.5" />
        <span>Export:</span>
      </div>

      <div className="flex items-center gap-1">
        {FORMATS.map((f) => (
          <Button
            key={f.id}
            variant="ghost"
            size="xs"
            disabled={disabled || pages.length === 0}
            onClick={() => exportData(f.id)}
            className="font-mono"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {pages.length > 0 && (
        <span className="ml-auto text-xs text-text-muted tabular-nums">
          {pages.length} page{pages.length !== 1 ? 's' : ''} crawled
        </span>
      )}
    </div>
  )
}
