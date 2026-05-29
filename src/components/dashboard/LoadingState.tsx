import { motion } from 'framer-motion'
import { Spinner } from '@/components/ui/Spinner'

interface LoadingStateProps {
  url: string
  pagesFound: number
  currentPath: string
}

export function LoadingState({ url, pagesFound, currentPath }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
      <Spinner size="xl" />

      <div>
        <p className="text-sm font-medium text-text-primary mb-1">
          Crawling{' '}
          <span className="text-accent font-mono">
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        </p>
        <p className="text-xs text-text-muted">Discovering internal pages...</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">Pages found</span>
          <motion.span
            key={pagesFound}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-mono font-semibold text-accent tabular-nums"
          >
            {pagesFound}
          </motion.span>
        </div>
        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-accent rounded-full"
            initial={{ width: '5%' }}
            animate={{ width: `${Math.min(5 + pagesFound * 12, 90)}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {currentPath && (
        <motion.p
          key={currentPath}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-text-muted max-w-sm truncate"
        >
          {currentPath.replace(/^https?:\/\/[^/]+/, '') || '/'}
        </motion.p>
      )}
    </div>
  )
}
