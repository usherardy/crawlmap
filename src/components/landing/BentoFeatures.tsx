import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Network, Search, Download, Code2, Zap, Terminal } from 'lucide-react'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { BorderBeam } from '@/components/ui/border-beam'

/* Mini graph reused from hero */
function MiniGraph() {
  const nodes = [
    { x: 50, y: 22, type: 'root' },
    { x: 20, y: 52, type: 'page' },
    { x: 40, y: 65, type: 'page' },
    { x: 62, y: 62, type: 'section' },
    { x: 80, y: 48, type: 'page' },
    { x: 68, y: 84, type: 'page' },
  ]
  const edges = [[0,1],[0,2],[0,3],[0,4],[3,5]]
  return (
    <svg className="w-full h-full opacity-90" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bento-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="52" rx="40" ry="34" fill="url(#bento-glow)" />
      {edges.map(([s, t], i) => (
        <line
          key={i}
          x1={nodes[s].x} y1={nodes[s].y}
          x2={nodes[t].x} y2={nodes[t].y}
          stroke="rgba(99,102,241,0.35)" strokeWidth="0.8"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x} cy={n.y}
          r={n.type === 'root' ? 5 : n.type === 'section' ? 3.5 : 2.8}
          fill={n.type === 'root' ? '#6366f1' : n.type === 'section' ? '#8b5cf6' : 'rgba(255,255,255,0.3)'}
        />
      ))}
    </svg>
  )
}

const FEATURES = [
  {
    icon: Network,
    title: 'Visual Sitemap Graph',
    description: 'Interactive force-directed graph showing every page relationship. Click nodes, zoom, pan, and switch between layouts.',
    gradient: 'from-accent/10 via-accent/5 to-transparent',
    iconColor: 'text-accent',
    iconBg: 'bg-accent/15',
    colSpan: 2 as const,
    rowSpan: 2 as const,
    visual: <MiniGraph />,
  },
  {
    icon: Search,
    title: 'Full Internal Discovery',
    description: 'Recursively follows every internal link up to your configured depth. Respects robots.txt for ethical crawling.',
    gradient: 'from-blue-500/10 to-transparent',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
    colSpan: 1 as const,
    rowSpan: 1 as const,
  },
  {
    icon: Code2,
    title: 'AI-ready Markdown',
    description: 'Export structured Markdown and paste directly into ChatGPT, Claude, or Cursor as site context.',
    gradient: 'from-violet-500/10 to-transparent',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
    colSpan: 1 as const,
    rowSpan: 1 as const,
  },
  {
    icon: Zap,
    title: 'Real-time Progress',
    description: 'Watch pages appear live as they\'re discovered with a live counter.',
    gradient: 'from-yellow-500/10 to-transparent',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/15',
    colSpan: 1 as const,
    rowSpan: 1 as const,
  },
  {
    icon: Download,
    title: 'TXT / CSV / JSON / XML / MD',
    description: 'Export every URL in the format you need — plain text, structured CSV, full JSON, valid XML sitemaps, or Markdown.',
    gradient: 'from-green-500/10 to-transparent',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/15',
    colSpan: 1 as const,
    rowSpan: 1 as const,
  },
  {
    icon: Terminal,
    title: 'CLI + Web UI',
    description: 'Use the web UI for visual exploration or run the CLI with a single command. Same config, same output.',
    gradient: 'from-rose-500/10 to-transparent',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15',
    colSpan: 1 as const,
    rowSpan: 1 as const,
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="h-full group"
    >
      <BentoCard colSpan={feature.colSpan} rowSpan={feature.rowSpan} className="h-full">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-60`} />

        {/* Border beam on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <BorderBeam duration={2} />
        </div>

        <div className="relative z-10 flex flex-col h-full p-6">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg} ${feature.iconColor} flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Text */}
          <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>

          {/* Visual for large card */}
          {feature.visual && (
            <div className="mt-auto pt-4 flex-1 min-h-0">
              {feature.visual}
            </div>
          )}
        </div>
      </BentoCard>
    </motion.div>
  )
}

export function BentoFeatures() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Everything you need to map a site
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            From visual graph exploration to AI-ready exports — CrawlMap covers every workflow.
          </p>
        </div>

        {/* Desktop bento grid */}
        <div className="hidden lg:block">
          <BentoGrid className="grid-cols-4 auto-rows-[13rem]">
            {/* Large card: Visual Graph */}
            <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl glass border border-white/8 transition-all duration-300 hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/12 via-accent/5 to-transparent opacity-60" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <BorderBeam duration={2} />
              </div>
              <div className="relative z-10 flex flex-col h-full p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-accent/15 text-accent flex-shrink-0">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">Visual Sitemap Graph</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Interactive force-directed graph showing every page relationship. Click nodes to inspect details, zoom, pan, and toggle layouts.
                </p>
                <div className="mt-auto flex-1 min-h-0 pt-2">
                  <MiniGraph />
                </div>
              </div>
            </div>

            {/* Row 1, col 3: Discovery */}
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-2xl glass border border-white/8 transition-all duration-300 hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-60" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><BorderBeam duration={2} colorFrom="#3b82f6" colorTo="#6366f1" /></div>
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-blue-500/15 text-blue-400 flex-shrink-0"><Search className="w-4 h-4" /></div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">Full Internal Discovery</h3>
                <p className="text-xs text-text-secondary leading-relaxed">Recursively follows every internal link. Respects robots.txt for ethical crawling.</p>
              </div>
            </div>

            {/* Row 1, col 4: AI Markdown */}
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-2xl glass border border-white/8 transition-all duration-300 hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-60" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><BorderBeam duration={2} colorFrom="#8b5cf6" colorTo="#a78bfa" /></div>
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-violet-500/15 text-violet-400 flex-shrink-0"><Code2 className="w-4 h-4" /></div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">AI-ready Markdown</h3>
                <p className="text-xs text-text-secondary leading-relaxed">Export structured Markdown and paste directly into ChatGPT, Claude, or Cursor.</p>
              </div>
            </div>

            {/* Row 2, col 3: Real-time */}
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-2xl glass border border-white/8 transition-all duration-300 hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-60" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><BorderBeam duration={2} colorFrom="#eab308" colorTo="#f59e0b" /></div>
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-yellow-500/15 text-yellow-400 flex-shrink-0"><Zap className="w-4 h-4" /></div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">Real-time Progress</h3>
                <p className="text-xs text-text-secondary leading-relaxed">Watch pages appear live as they're discovered with a live counter and status feed.</p>
              </div>
            </div>

            {/* Row 2, col 4: CLI */}
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-2xl glass border border-white/8 transition-all duration-300 hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-60" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><BorderBeam duration={2} colorFrom="#f43f5e" colorTo="#fb7185" /></div>
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-rose-500/15 text-rose-400 flex-shrink-0"><Terminal className="w-4 h-4" /></div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">CLI + Web UI</h3>
                <p className="text-xs text-text-secondary leading-relaxed">Same config, same output — use the visual UI or run a single CLI command.</p>
              </div>
            </div>

            {/* Bottom row: Export formats — full width */}
            <div className="col-span-4 row-span-1 group relative overflow-hidden rounded-2xl glass border border-white/8 transition-all duration-300 hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-transparent to-emerald-500/5 opacity-60" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><BorderBeam duration={3} colorFrom="#22c55e" colorTo="#10b981" /></div>
              <div className="relative z-10 h-full flex items-center px-8 gap-8">
                <div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 bg-green-500/15 text-green-400"><Download className="w-4 h-4" /></div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">5 Export Formats</h3>
                  <p className="text-xs text-text-secondary max-w-xs">Plain text lists, structured CSV, full JSON metadata, valid XML sitemaps, or AI-ready Markdown.</p>
                </div>
                <div className="flex gap-3 ml-auto">
                  {[
                    { label: 'TXT', desc: 'Plain list' },
                    { label: 'CSV', desc: 'Spreadsheet' },
                    { label: 'JSON', desc: 'Full metadata' },
                    { label: 'XML', desc: 'Sitemap' },
                    { label: 'MD', desc: 'AI context' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-green-500/30 hover:bg-green-500/5 transition-colors">
                      <span className="text-sm font-bold text-text-primary font-mono">{label}</span>
                      <span className="text-[10px] text-text-muted">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoGrid>
        </div>

        {/* Mobile fallback: simple 2-col grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
