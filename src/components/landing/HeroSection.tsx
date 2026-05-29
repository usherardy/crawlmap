import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, Github, Globe, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spotlight } from '@/components/ui/spotlight'
import { AnimatedBadge } from '@/components/ui/animated-badge'
import { TextShimmer } from '@/components/ui/text-shimmer'

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

function HeroGraphMockup() {
  const nodes = [
    { id: 'home', label: '/', x: 50, y: 20, type: 'root' },
    { id: 'about', label: '/about', x: 15, y: 55, type: 'page' },
    { id: 'pricing', label: '/pricing', x: 38, y: 65, type: 'page' },
    { id: 'blog', label: '/blog', x: 62, y: 65, type: 'section' },
    { id: 'docs', label: '/docs', x: 82, y: 55, type: 'page' },
    { id: 'blog-post', label: '/blog/post', x: 70, y: 88, type: 'page' },
    { id: 'contact', label: '/contact', x: 28, y: 88, type: 'page' },
  ]
  const edges = [
    ['home', 'about'], ['home', 'pricing'], ['home', 'blog'], ['home', 'docs'],
    ['blog', 'blog-post'], ['pricing', 'contact'],
  ]
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <div className="relative w-full aspect-[16/9] select-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="50" rx="44" ry="38" fill="url(#heroGlow)" />
        {edges.map(([s, t]) => {
          const src = nodeMap[s]
          const tgt = nodeMap[t]
          if (!src || !tgt) return null
          return (
            <line
              key={`${s}-${t}`}
              x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
              stroke="rgba(99,102,241,0.25)" strokeWidth="0.6"
            />
          )
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            {n.type === 'root' && (
              <circle cx={n.x} cy={n.y} r={8} fill="rgba(99,102,241,0.15)" />
            )}
            <circle
              cx={n.x} cy={n.y}
              r={n.type === 'root' ? 4 : n.type === 'section' ? 3 : 2.5}
              fill={n.type === 'root' ? '#6366f1' : n.type === 'section' ? '#8b5cf6' : 'rgba(255,255,255,0.3)'}
            />
            <text
              x={n.x} y={n.y + (n.type === 'root' ? -6 : -5)}
              textAnchor="middle"
              fill="rgba(255,255,255,0.65)"
              fontSize={n.type === 'root' ? '3.5' : '2.8'}
              fontFamily="monospace"
            >
              {n.label.length > 12 ? n.label.slice(0, 10) + '…' : n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function MagneticButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 25 })
  const springY = useSpring(y, { stiffness: 300, damping: 25 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.3)
    y.set((e.clientY - cy) * 0.3)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  )
}

export function HeroSection() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleGenerate = () => {
    navigate('/dashboard')
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-base bg-grid" />
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-radial-accent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-radial-violet opacity-35 pointer-events-none" />
      <Spotlight className="z-0" fill="rgba(99,102,241,0.09)" />

      <div className="relative z-10 section-container flex flex-col items-center text-center">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center gap-6 max-w-4xl"
        >
          {/* Animated badge */}
          <motion.div variants={fadeUp}>
            <AnimatedBadge>
              <Sparkles className="w-3.5 h-3.5" />
              Open-source visual site mapper
            </AnimatedBadge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-balance"
          >
            Turn any website into a{' '}
            <br className="hidden sm:block" />
            <TextShimmer>visual sitemap.</TextShimmer>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed text-balance"
          >
            Paste a URL and CrawlMap discovers every internal page, maps the site
            structure, and exports clean link files for{' '}
            <span className="text-text-primary font-medium">SEO</span>,{' '}
            <span className="text-text-primary font-medium">developers</span>, and{' '}
            <span className="text-text-primary font-medium">AI tools</span>.
          </motion.p>

          {/* URL Input */}
          <motion.div variants={fadeUp} className="w-full max-w-xl">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={setUrl}
                onSubmit={handleGenerate}
                placeholder="https://example.com"
                size="lg"
                leftIcon={<Globe className="w-4 h-4" />}
                className="flex-1"
              />
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="flex-shrink-0"
              >
                Generate Map
              </MagneticButton>
            </div>
          </motion.div>

          {/* Secondary actions */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">View Demo</Button>
            </Link>
            <span className="text-text-muted">·</span>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm" leftIcon={<Github className="w-3.5 h-3.5" />}>
                Star on GitHub
              </Button>
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-muted"
          >
            {[
              '✓  Open source · MIT',
              '✓  No signup required',
              '✓  Export 5 formats',
            ].map((item) => (
              <span key={item} className="text-text-secondary/70">{item}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 w-full max-w-5xl animate-float"
        >
          {/* Glow beneath */}
          <div className="absolute inset-x-16 -bottom-10 h-36 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

          {/* Browser chrome */}
          <div className="glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.025] border-b border-white/6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 h-7 bg-white/5 rounded-lg flex items-center px-3 gap-2">
                <Globe className="w-3 h-3 text-text-muted" />
                <span className="text-xs font-mono text-text-muted">crawlmap.dev/dashboard</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-success font-mono">Live</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="flex h-80 overflow-hidden">
              {/* Settings panel */}
              <div className="w-36 border-r border-white/6 bg-white/[0.015] p-3 flex flex-col gap-2 flex-shrink-0">
                <div className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-1">Settings</div>
                {['Max Depth: 3', 'Max Pages: 100', 'Robots.txt ✓'].map((s) => (
                  <div key={s} className="text-[9px] text-text-muted bg-white/3 rounded px-2 py-1">{s}</div>
                ))}
                <div className="mt-auto">
                  <div className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Export</div>
                  <div className="flex flex-wrap gap-1">
                    {['TXT', 'CSV', 'JSON', 'XML', 'MD'].map((f) => (
                      <span key={f} className="text-[8px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graph */}
              <div className="flex-1 relative bg-base/50">
                <HeroGraphMockup />
                {/* Crawl counter overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-mono text-text-secondary">7 pages · 2.1s</span>
                </div>
              </div>

              {/* Details */}
              <div className="w-44 border-l border-white/6 bg-white/[0.015] p-3 flex flex-col gap-2 flex-shrink-0">
                <div className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-1">Page Details</div>
                {[
                  ['URL', 'example.com'],
                  ['Title', 'Example Domain'],
                  ['Status', '200 OK'],
                  ['Depth', '0 (root)'],
                  ['Links', '5 internal'],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-text-muted">{k}</span>
                    <span className="text-[9px] text-text-secondary font-mono truncate">{v}</span>
                  </div>
                ))}
                <div className="mt-auto px-2 py-1 rounded-md bg-success/10 border border-success/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-[9px] text-success font-mono">200 OK</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
