import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Terminal, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const CMD = 'npx crawlmap https://example.com --max-pages 100 --max-depth 3'

const OUTPUT_FILES = [
  { name: 'links.txt', color: 'text-text-secondary', desc: '7 URLs' },
  { name: 'sitemap.xml', color: 'text-blue-400', desc: 'XML sitemap' },
  { name: 'site-structure.json', color: 'text-yellow-400', desc: 'Full metadata' },
  { name: 'ai-context.md', color: 'text-violet-400', desc: 'AI-ready' },
  { name: 'visual-map.html', color: 'text-green-400', desc: 'Interactive graph' },
]

function TerminalLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-2"
    >
      {children}
    </motion.div>
  )
}

export function CliSection() {
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const handleCopy = () => {
    navigator.clipboard.writeText(CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="cli" className="py-24 lg:py-32">
      <div ref={ref} className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 block">
              CLI
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              One command, full site map.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Run CrawlMap directly from your terminal with <code className="text-accent font-mono bg-accent/10 px-1.5 py-0.5 rounded">npx</code>. No installation required. Chain it into your CI/CD pipeline, scripts, or AI workflows.
            </p>
            <ul className="space-y-3">
              {[
                'Zero-install via npx',
                'Configurable depth and page limits',
                'All 5 export formats in one run',
                'Exit-code safe for CI pipelines',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="terminal shadow-2xl">
              {/* Terminal header */}
              <div className="terminal-header">
                <div className="terminal-dot bg-error/60" />
                <div className="terminal-dot bg-warning/60" />
                <div className="terminal-dot bg-success/60" />
                <span className="ml-2 text-xs text-text-muted flex items-center gap-1.5 flex-1">
                  <Terminal className="w-3 h-3" />
                  bash
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  {copied ? (
                    <><Check className="w-3 h-3 text-success" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
              </div>

              {/* Terminal content */}
              <div className="px-4 py-4 space-y-2 text-sm font-mono">
                <TerminalLine>
                  <span className="text-text-muted select-none">$</span>
                  <span className="text-text-primary">{' '}
                    <span className="text-accent">npx</span>{' '}
                    <span className="text-green-400">crawlmap</span>{' '}
                    <span className="text-yellow-300">https://example.com</span>{' '}
                    <span className="text-text-muted">--max-pages</span>{' '}
                    <span className="text-blue-400">100</span>{' '}
                    <span className="text-text-muted">--max-depth</span>{' '}
                    <span className="text-blue-400">3</span>
                  </span>
                </TerminalLine>

                <TerminalLine delay={0.3}>
                  <span className="text-text-muted">{'>'}</span>
                  <span className="text-text-secondary"> CrawlMap v1.0.0 — starting crawl...</span>
                </TerminalLine>

                {['/', '/about', '/pricing', '/blog', '/blog/how-it-works', '/docs', '/contact'].map((p, i) => (
                  <TerminalLine key={p} delay={0.4 + i * 0.06}>
                    <span className="text-text-muted">{'  '}✓</span>
                    <span className="text-green-400"> {p}</span>
                    <span className="text-text-muted"> 200</span>
                  </TerminalLine>
                ))}

                <TerminalLine delay={0.9}>
                  <span className="text-text-muted">{'>'}</span>
                  <span className="text-accent"> 7 pages crawled in 1.4s</span>
                </TerminalLine>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  {OUTPUT_FILES.map((f, i) => (
                    <TerminalLine key={f.name} delay={1.0 + i * 0.07}>
                      <span className="text-text-muted">{'  '}→</span>
                      <span className={f.color}> {f.name}</span>
                      <span className="text-text-muted text-xs"> ({f.desc})</span>
                    </TerminalLine>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
