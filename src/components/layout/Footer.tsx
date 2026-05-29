import { Link } from 'react-router-dom'
import { Network, Github, Twitter } from 'lucide-react'

const LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'CLI', href: '#cli' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Roadmap', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  'Open Source': [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'License (MIT)', href: '#' },
    { label: 'Contributing', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-surface/50">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow-sm">
                <Network className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-bold text-text-primary">CrawlMap</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Open-source visual website mapper. Map any site like a graph, export every page for SEO, development, and AI workflows.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg glass glass-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg glass glass-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} CrawlMap. Open-source under the MIT License.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Built for developers, SEOs &amp; AI builders.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
