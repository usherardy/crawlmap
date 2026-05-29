import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Network,
  Search,
  Download,
  Shield,
  Zap,
  Code2,
} from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  iconBg: string
}

const FEATURES: Feature[] = [
  {
    icon: <Network className="w-5 h-5" />,
    title: 'Visual Sitemap Graph',
    description: 'Interactive force-directed graph showing every page relationship. Click nodes to inspect details, zoom, pan, and toggle between vertical and horizontal layouts.',
    gradient: 'from-accent/10 to-accent-violet/5',
    iconBg: 'bg-accent/15 text-accent',
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Full Internal Discovery',
    description: 'Recursively follows every internal link up to your configured depth and page limits. Respects robots.txt directives for ethical crawling.',
    gradient: 'from-blue-500/10 to-accent/5',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: 'TXT / CSV / JSON / XML',
    description: 'Export every discovered URL in the format you need — plain text lists, structured CSV data, full JSON metadata, or valid XML sitemaps for search engines.',
    gradient: 'from-green-500/10 to-emerald-500/5',
    iconBg: 'bg-green-500/15 text-green-400',
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'AI-ready Markdown Context',
    description: 'Export a structured Markdown file of your site architecture — paste it directly into ChatGPT, Claude, Cursor, or any AI tool as context.',
    gradient: 'from-violet-500/10 to-purple-500/5',
    iconBg: 'bg-violet-500/15 text-violet-400',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Real-time Crawl Progress',
    description: 'Watch pages appear live as they\'re discovered. A live counter tracks crawled URLs so you always know the current state.',
    gradient: 'from-yellow-500/10 to-orange-500/5',
    iconBg: 'bg-yellow-500/15 text-yellow-400',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'CLI + Web UI',
    description: 'Use the web UI for visual exploration or run the CLI with a single command. Both share the same output formats and configuration options.',
    gradient: 'from-rose-500/10 to-pink-500/5',
    iconBg: 'bg-rose-500/15 text-rose-400',
  },
]

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass glass-hover rounded-card p-6 flex flex-col gap-4 bg-gradient-to-br ${feature.gradient}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.iconBg}`}>
        {feature.icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  )
}

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="section-container">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
