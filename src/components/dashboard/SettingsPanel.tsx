import { Settings2 } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import type { CrawlOptions } from '@/types/crawler'

interface SettingsPanelProps {
  options: CrawlOptions
  onChange: (opts: Partial<CrawlOptions>) => void
  disabled: boolean
}

export function SettingsPanel({ options, onChange, disabled }: SettingsPanelProps) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/6 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-white/6 flex items-center gap-2">
        <Settings2 className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Crawl Settings
        </span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-6">
        {/* Max Depth */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-text-secondary">Max Depth</label>
            <span className="text-xs font-mono font-semibold text-accent tabular-nums">
              {options.maxDepth}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={options.maxDepth}
            disabled={disabled}
            onChange={(e) => onChange({ maxDepth: Number(e.target.value) })}
            className="w-full accent-indigo-500 disabled:opacity-50 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Max Pages */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary block">Max Pages</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={500}
              value={options.maxPages}
              disabled={disabled}
              onChange={(e) => onChange({ maxPages: Math.max(1, Math.min(500, Number(e.target.value))) })}
              className="w-full h-8 bg-white/5 border border-white/8 rounded-lg px-3 text-sm font-mono text-text-primary placeholder-text-muted outline-none focus:border-accent/50 disabled:opacity-50 transition-colors"
            />
          </div>
          <p className="text-xs text-text-muted">Max 500 pages per crawl</p>
        </div>

        <div className="border-t border-white/6 pt-4 space-y-4">
          <Toggle
            checked={options.respectRobots}
            onChange={(v) => onChange({ respectRobots: v })}
            label="Respect robots.txt"
            description="Follow crawl directives"
            disabled={disabled}
          />

          <Toggle
            checked={options.includeExternal}
            onChange={(v) => onChange({ includeExternal: v })}
            label="Include external links"
            description="Detect outbound URLs"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="px-4 py-4 border-t border-white/6">
        <p className="text-xs text-text-muted leading-relaxed">
          Crawls run server-side. Depth and page limits are applied on every request.
        </p>
      </div>
    </aside>
  )
}
