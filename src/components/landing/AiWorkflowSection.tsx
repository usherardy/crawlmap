import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, ArrowRight, Bot, FileText, Zap } from 'lucide-react'

const TOOLS = [
  { name: 'ChatGPT', color: '#10b981' },
  { name: 'Claude', color: '#8b5cf6' },
  { name: 'Cursor', color: '#3b82f6' },
  { name: 'Perplexity', color: '#6366f1' },
  { name: 'Notion AI', color: '#94a3b8' },
]

const PIPELINE = [
  {
    icon: <FileText className="w-5 h-5" />,
    label: 'ai-context.md',
    sublabel: 'Your site structure',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: 'Paste as context',
    sublabel: 'Into any AI tool',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: <Bot className="w-5 h-5" />,
    label: 'AI understands your site',
    sublabel: 'Ask anything about it',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
]

const MD_EXAMPLE = `# Site Map: https://example.com
> Total pages: 7

## Pages

- [/](https://example.com) — Example Domain
  - [/about](https://example.com/about) — About Us
  - [/pricing](https://example.com/pricing) — Pricing
  - [/blog](https://example.com/blog) — Blog
    - [/blog/how-it-works](…) — How It Works
  - [/docs](https://example.com/docs) — Documentation
  - [/contact](https://example.com/contact) — Contact`

export function AiWorkflowSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-violet/5 pointer-events-none" />

      <div ref={ref} className="section-container">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 block">
            AI Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Built for the AI era.
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            CrawlMap exports an AI-ready Markdown file with your entire site structure — pages, paths, titles, and hierarchy — so any LLM instantly understands your codebase or competitor's site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: pipeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Pipeline steps */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {PIPELINE.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`glass rounded-xl p-4 flex flex-col items-center gap-2 text-center border ${step.border} flex-1 sm:flex-none sm:w-36`}>
                    <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center ${step.color}`}>
                      {step.icon}
                    </div>
                    <span className="text-xs font-semibold text-text-primary">{step.label}</span>
                    <span className="text-[10px] text-text-muted">{step.sublabel}</span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            {/* Compatible tools */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-semibold">Works with</p>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((tool) => (
                  <span
                    key={tool.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl text-sm text-text-secondary border border-white/8"
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tool.color }} />
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-accent/15">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-primary font-medium">Tip:</span> Paste your <code className="text-accent bg-accent/10 px-1 py-0.5 rounded text-xs font-mono">ai-context.md</code> into Claude or ChatGPT and ask "What pages does this site have about pricing?" — it just works.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: markdown preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="terminal shadow-2xl">
              <div className="terminal-header">
                <div className="terminal-dot bg-error/60" />
                <div className="terminal-dot bg-warning/60" />
                <div className="terminal-dot bg-success/60" />
                <span className="ml-2 text-xs text-text-muted flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  ai-context.md
                </span>
                <span className="ml-auto text-[10px] px-2 py-0.5 bg-violet-500/15 text-violet-400 rounded-full border border-violet-500/25">
                  AI-ready
                </span>
              </div>
              <pre className="px-4 py-4 text-xs font-mono text-text-secondary leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {MD_EXAMPLE}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
