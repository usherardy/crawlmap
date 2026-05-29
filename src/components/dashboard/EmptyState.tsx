import { Network, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  onLoadExample: () => void
}

export function EmptyState({ onLoadExample }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center">
          <Network className="w-9 h-9 text-text-muted" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <span className="text-accent text-xs font-bold">?</span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1.5">
          No site crawled yet
        </h3>
        <p className="text-sm text-text-muted max-w-xs leading-relaxed">
          Enter a URL above and click Crawl, or try our demo with a pre-loaded example site.
        </p>
      </div>

      <Button
        variant="secondary"
        leftIcon={<Sparkles className="w-4 h-4" />}
        onClick={onLoadExample}
      >
        Try example.com
      </Button>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Visual graph
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
          Tree view
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          Table view
        </div>
      </div>
    </div>
  )
}
