import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Star, GitFork, Code2, Terminal, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const PILLARS = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'Open Source',
    description: 'Every line of code is public. Fork it, audit it, contribute to it.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: <Terminal className="w-5 h-5" />,
    title: 'CLI-first',
    description: 'Designed for developers. Pipe it, script it, automate it.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Self-hostable',
    description: 'Deploy your own instance. Full control over data and infrastructure.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'MIT License',
    description: 'Use it commercially, modify it freely, no strings attached.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
]

export function OpenSourceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div ref={ref} className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 block">
            Open Source
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Built in the open. For everyone.
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            CrawlMap is free, MIT-licensed, and welcomes contributions. Whether you're an indie hacker, agency, or enterprise team — it's yours.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center gap-8 mb-12"
        >
          {[
            { icon: <Star className="w-4 h-4" />, value: '1.2k', label: 'GitHub Stars' },
            { icon: <GitFork className="w-4 h-4" />, value: '89', label: 'Forks' },
            { icon: <Code2 className="w-4 h-4" />, value: 'MIT', label: 'License' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-accent">
                {stat.icon}
                <span className="text-2xl font-bold text-text-primary tabular-nums">{stat.value}</span>
              </div>
              <span className="text-xs text-text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              className="glass glass-hover rounded-card p-5 flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center ${p.color}`}>
                {p.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{p.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Github className="w-4.5 h-4.5" />}
              rightIcon={<Star className="w-4 h-4" />}
            >
              Star on GitHub
            </Button>
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<GitFork className="w-4.5 h-4.5" />}
            >
              Fork &amp; Contribute
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
