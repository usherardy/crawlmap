import { AlertTriangle, RotateCcw, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  message: string | null
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/25 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-error" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-text-primary">Crawl failed</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {message ?? 'An unexpected error occurred.'}
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/3 border border-white/8 max-w-sm w-full">
        <Terminal className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        <code className="text-xs text-text-muted font-mono">npm run dev</code>
        <span className="text-xs text-text-muted ml-1">— starts both client and server</span>
      </div>

      <Button variant="secondary" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onRetry}>
        Try Again
      </Button>
    </div>
  )
}
