import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function MiniGraph() {
  const nodes = [
    { id: 'r', label: '/', x: 50, y: 18, r: 4, fill: '#6366f1', glow: true },
    { id: 'a', label: '/about', x: 18, y: 45, r: 2.8, fill: '#8b5cf6', glow: false },
    { id: 'p', label: '/pricing', x: 38, y: 55, r: 2.8, fill: '#8b5cf6', glow: false },
    { id: 'b', label: '/blog', x: 62, y: 55, r: 3.2, fill: '#6366f1', glow: false },
    { id: 'd', label: '/docs', x: 82, y: 45, r: 2.8, fill: '#8b5cf6', glow: false },
    { id: 'bh', label: '/blog/how-it-works', x: 72, y: 80, r: 2.2, fill: 'rgba(255,255,255,0.3)', glow: false },
    { id: 'c', label: '/contact', x: 28, y: 80, r: 2.2, fill: 'rgba(255,255,255,0.3)', glow: false },
  ]
  const edges: [string, string][] = [
    ['r','a'],['r','p'],['r','b'],['r','d'],['b','bh'],['p','c']
  ]
  const nm = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="heroGlow2" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="45" rx="45" ry="40" fill="url(#heroGlow2)" />
      {edges.map(([s,t]) => {
        const a = nm[s], b = nm[t]
        return <line key={`${s}-${t}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      })}
      {nodes.map(n => (
        <g key={n.id}>
          {n.glow && <circle cx={n.x} cy={n.y} r={n.r + 3} fill="rgba(99,102,241,0.15)" />}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.fill} />
          <text x={n.x} y={n.y - n.r - 1.5} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="2.5" fontFamily="monospace">
            {n.label.length > 10 ? n.label.slice(0,9)+'…' : n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function DashboardPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/60 to-transparent pointer-events-none" />

      <div ref={ref} className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 block">
            Dashboard
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            See your site's full structure
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-lg">
            An interactive dashboard lets you explore, inspect, and export every discovered page.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute inset-x-16 -bottom-10 h-40 bg-accent/15 blur-3xl rounded-full pointer-events-none" />

          {/* Browser chrome */}
          <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top bar */}
            <div className="h-12 bg-surface/80 border-b border-white/6 flex items-center px-4 gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-error/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
              </div>
              <div className="flex-1 h-7 bg-white/5 rounded-lg flex items-center gap-2 px-3">
                <Globe className="w-3 h-3 text-text-muted" />
                <span className="text-xs font-mono text-text-muted">https://example.com</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-success/10 text-success rounded-full border border-success/20">
                  7 pages
                </span>
              </div>
              <div className="flex items-center gap-1">
                {['Graph', 'Tree', 'Table'].map((t, i) => (
                  <span
                    key={t}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${i === 0 ? 'bg-white/10 text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Main layout */}
            <div className="flex" style={{ height: '420px' }}>
              {/* Settings panel */}
              <div className="w-44 border-r border-white/6 bg-white/[0.015] flex flex-col flex-shrink-0">
                <div className="px-3 py-2.5 border-b border-white/6">
                  <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Settings</span>
                </div>
                <div className="p-3 flex flex-col gap-3 text-xs">
                  {[
                    { label: 'Max Depth', value: '3' },
                    { label: 'Max Pages', value: '100' },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <span className="text-[9px] text-text-muted">{s.label}</span>
                      <div className="h-6 bg-white/5 rounded-lg flex items-center px-2">
                        <span className="text-[10px] font-mono text-accent">{s.value}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 pt-1">
                    {['Respect robots.txt', 'Skip external links'].map((l) => (
                      <div key={l} className="flex items-center gap-2">
                        <div className="w-6 h-3.5 rounded-full bg-accent/20 border border-accent/30 flex items-center px-0.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-accent translate-x-2.5" />
                        </div>
                        <span className="text-[9px] text-text-muted leading-tight">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graph area */}
              <div className="flex-1 bg-base/60 relative overflow-hidden">
                {/* Dot bg */}
                <div className="absolute inset-0 bg-dots opacity-60" />
                <div className="relative w-full h-full">
                  <MiniGraph />
                </div>
                {/* Zoom controls */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 glass rounded-xl p-1">
                  {['+', '−', '⤢'].map((c) => (
                    <button key={c} className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] text-text-muted hover:text-text-primary hover:bg-white/5">
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details panel */}
              <div className="w-52 border-l border-white/6 bg-white/[0.015] flex flex-col flex-shrink-0">
                <div className="px-3 py-2.5 border-b border-white/6">
                  <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Selected Page</span>
                </div>
                <div className="p-3 flex flex-col gap-2.5 text-xs">
                  {[
                    ['URL', 'https://example.com'],
                    ['Title', 'Example Domain'],
                    ['Path', '/'],
                    ['Status', ''],
                    ['Depth', '0 (root)'],
                    ['Int. Links', '5'],
                    ['Ext. Links', '1'],
                    ['Canonical', 'https://example.com'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-text-muted">{k}</span>
                      {k === 'Status' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20 w-fit">
                          <span className="w-1 h-1 rounded-full bg-success" />200 OK
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-text-secondary truncate">{v}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export toolbar */}
            <div className="h-10 bg-surface/80 border-t border-white/6 flex items-center px-4 gap-3">
              <span className="text-[10px] text-text-muted">Export:</span>
              {['TXT', 'CSV', 'JSON', 'XML', 'Markdown'].map((f) => (
                <button key={f} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-secondary transition-colors font-mono">
                  {f}
                </button>
              ))}
              <span className="ml-auto text-[10px] text-text-muted">7 pages crawled</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Link to="/dashboard">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
