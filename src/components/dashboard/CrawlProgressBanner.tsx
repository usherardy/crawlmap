import { Loader2, X } from 'lucide-react'

interface CrawlProgressBannerProps {
  pagesFound: number
  currentPath: string
  onStop: () => void
}

export function CrawlProgressBanner({ pagesFound, currentPath, onStop }: CrawlProgressBannerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-accent/8 border-b border-accent/20 flex-shrink-0">
      <Loader2 className="w-3.5 h-3.5 text-accent animate-spin flex-shrink-0" />

      <span className="text-xs font-semibold text-accent tabular-nums">
        {pagesFound} {pagesFound === 1 ? 'page' : 'pages'} found
      </span>

      {currentPath && (
        <>
          <span className="text-white/20">·</span>
          <span className="text-xs text-text-muted font-mono truncate min-w-0">
            {currentPath}
          </span>
        </>
      )}

      <button
        onClick={onStop}
        className="ml-auto flex-shrink-0 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/8 transition-colors"
        title="Stop crawl"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
