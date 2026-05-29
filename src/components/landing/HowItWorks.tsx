import { useRef } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { Globe, Network, FileDown, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Globe,
    title: 'Paste a URL',
    description: 'Enter any website URL and configure crawl depth, page limit, and export preferences.',
    accent: 'accent',
    visual: (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/4 border border-white/10 font-mono text-sm text-text-secondary max-w-xs">
        <Globe className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span className="text-accent">https://</span>
        <span className="text-text-primary">example.com</span>
        <ArrowRight className="w-3.5 h-3.5 ml-auto text-accent" />
      </div>
    ),
  },
  {
    number: '02',
    icon: Network,
    title: 'Crawl & Map Pages',
    description: 'CrawlMap discovers every internal page, captures metadata, and builds a complete site graph in seconds.',
    accent: 'accent-violet',
    visual: (
      <div className="flex flex-col gap-1.5 max-w-xs">
        {['/ (root)', '/about', '/pricing', '/blog', '/docs'].map((url, i) => (
          <motion.div
            key={url}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="flex items-center gap-2 text-xs font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
            <span className="text-text-secondary">{url}</span>
            <span className="ml-auto text-text-muted text-[10px]">200</span>
          </motion.div>
        ))}
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
          <span>Crawling...</span>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    icon: FileDown,
    title: 'Export & Use',
    description: 'Download your sitemap as TXT, CSV, JSON, XML, or AI-ready Markdown. Ready for SEO tools, codebases, and LLMs.',
    accent: 'success',
    visual: (
      <div className="flex flex-wrap gap-2 max-w-xs">
        {[
          { label: 'TXT', color: 'text-text-secondary border-white/15' },
          { label: 'CSV', color: 'text-blue-400 border-blue-500/30' },
          { label: 'JSON', color: 'text-yellow-400 border-yellow-500/30' },
          { label: 'XML', color: 'text-green-400 border-green-500/30' },
          { label: 'MD', color: 'text-violet-400 border-violet-500/30' },
        ].map(({ label, color }) => (
          <span
            key={label}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-white/4 border ${color}`}
          >
            {label}
          </span>
        ))}
      </div>
    ),
  },
]

function Step({
  step,
  index,
  isLast,
}: {
  step: (typeof STEPS)[number]
  index: number
  isLast: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-8"
    >
      {/* Left rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Step icon circle */}
        <div
          className={`
            relative w-14 h-14 rounded-2xl flex items-center justify-center z-10
            bg-accent/10 border border-accent/25 text-accent
            shadow-[0_0_20px_rgba(99,102,241,0.15)]
          `}
        >
          <Icon className="w-6 h-6" />
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center"
          >
            {index + 1}
          </span>
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 mt-3 bg-gradient-to-b from-accent/30 to-transparent min-h-[3rem]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-12 flex-1">
        <p className="text-xs font-mono text-accent/60 mb-2 font-semibold tracking-widest uppercase">
          Step {step.number}
        </p>
        <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
        <p className="text-text-secondary leading-relaxed mb-5 max-w-md">{step.description}</p>
        {step.visual}
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.6'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const lineHeight = useTransform(scaleY, [0, 1], ['0%', '100%'])

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent pointer-events-none" />

      <div className="section-container">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 block">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Three steps to full site visibility
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-lg">
            From URL to exportable sitemap in seconds. No account needed.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Scroll-driven vertical rail */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 pointer-events-none hidden lg:block">
            <motion.div
              className="w-full bg-gradient-to-b from-accent to-accent-violet rounded-full origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {STEPS.map((step, i) => (
            <Step
              key={step.number}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
