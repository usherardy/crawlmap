import { X, ExternalLink, Link, Link2Off, Hash, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PageNode } from '@/types/crawler'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface DetailsPanelProps {
  page: PageNode | null
  onClose: () => void
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        {icon}
        {label}
      </div>
      <div className={cn('text-sm text-text-primary break-all', mono && 'font-mono text-xs')}>
        {value}
      </div>
    </div>
  )
}

export function DetailsPanel({ page, onClose }: DetailsPanelProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-l border-white/6 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-white/6 flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex-1">
          Page Details
        </span>
        {page && (
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!page ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center">
              <Layers className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Click any node in the graph to inspect its details.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Title */}
              <div>
                <p className="text-xs text-text-muted mb-1">Title</p>
                <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2">
                  {page.title}
                </p>
              </div>

              <Row
                icon={<Hash className="w-3 h-3" />}
                label="URL"
                value={page.url}
                mono
              />

              <Row
                icon={<Hash className="w-3 h-3" />}
                label="Path"
                value={page.path}
                mono
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-1.5">Status</p>
                  <StatusBadge code={page.statusCode} />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1.5">Depth</p>
                  <span className="text-sm font-mono font-semibold text-text-primary">
                    {page.depth}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Int. Links</p>
                  <div className="flex items-center gap-1">
                    <Link className="w-3 h-3 text-text-muted" />
                    <span className="text-sm font-mono text-text-primary tabular-nums">
                      {page.internalLinks.length}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Ext. Links</p>
                  <div className="flex items-center gap-1">
                    <Link2Off className="w-3 h-3 text-text-muted" />
                    <span className="text-sm font-mono text-text-primary tabular-nums">
                      {page.externalLinks.length}
                    </span>
                  </div>
                </div>
              </div>

              {page.canonical && (
                <Row
                  icon={<Hash className="w-3 h-3" />}
                  label="Canonical"
                  value={page.canonical}
                  mono
                />
              )}

              {page.internalLinks.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-2">Internal Links</p>
                  <div className="space-y-1">
                    {page.internalLinks.slice(0, 8).map((link) => (
                      <div
                        key={link}
                        className="text-xs font-mono text-text-secondary bg-white/3 rounded px-2 py-1 truncate"
                        title={link}
                      >
                        {link}
                      </div>
                    ))}
                    {page.internalLinks.length > 8 && (
                      <p className="text-xs text-text-muted">
                        +{page.internalLinks.length - 8} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/6">
              <a
                href={page.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 h-8 w-full glass glass-hover rounded-xl text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open URL
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
