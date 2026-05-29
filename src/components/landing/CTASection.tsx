import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Github, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-base" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent-violet/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-accent opacity-40 pointer-events-none" />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />

      <div className="relative section-container flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/25 text-accent text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Free &amp; Open Source
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.08] text-balance">
            Map your site{' '}
            <span
              style={{
                background: 'linear-gradient(120deg, #6366f1, #8b5cf6, #a78bfa, #6366f1)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer-sweep 3s linear infinite',
              }}
            >
              in seconds.
            </span>
          </h2>

          <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
            No account. No limits. Just paste a URL and get a full visual sitemap
            with export-ready data for SEO, AI, and development.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow"
              >
                Start Mapping — Free
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Github className="w-4 h-4" />}
              >
                Star on GitHub
              </Button>
            </a>
          </div>

          <p className="text-xs text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            No signup required · MIT licensed · Runs in your browser
          </p>
        </motion.div>
      </div>
    </section>
  )
}
