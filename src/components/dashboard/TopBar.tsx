import { Link } from 'react-router-dom'
import { Network, Play, Square, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { CrawlStatus } from '@/types/crawler'

interface TopBarProps {
  url: string
  onUrlChange: (url: string) => void
  onCrawl: () => void
  onStop: () => void
  onReset: () => void
  status: CrawlStatus
  pageCount: number
  deadCount: number
}

export function TopBar({ url, onUrlChange, onCrawl, onStop, onReset, status, pageCount, deadCount }: TopBarProps) {
  const isCrawling = status === 'crawling'
  const isComplete = status === 'complete'

  return (
    <header className="h-14 border-b border-white/6 flex items-center px-4 gap-3 flex-shrink-0 bg-surface/80 backdrop-blur-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center shadow-glow-sm">
          <Network className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-text-primary hidden sm:block">CrawlMap</span>
      </Link>

      <div className="w-px h-5 bg-white/8 flex-shrink-0" />

      {/* URL Input */}
      <div className="flex-1 max-w-2xl">
        <Input
          value={url}
          onChange={onUrlChange}
          onSubmit={onCrawl}
          placeholder="https://example.com"
          disabled={isCrawling}
          leftIcon={
            <span className="text-text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
          }
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isCrawling ? (
          <Button variant="danger" size="sm" onClick={onStop} leftIcon={<Square className="w-3.5 h-3.5" />}>
            Stop
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onCrawl}
            disabled={!url.trim()}
            loading={isCrawling}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Crawl
          </Button>
        )}

        {isComplete && (
          <Button variant="ghost" size="icon" onClick={onReset} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {(isComplete || pageCount > 0) && pageCount > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge label={`${pageCount} pages`} variant="success" dot />
          {deadCount > 0 && (
            <Badge label={`${deadCount} dead`} variant="error" dot />
          )}
        </div>
      )}
    </header>
  )
}
