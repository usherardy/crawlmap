import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Network, Github, Menu, X, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Docs', href: '#' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-white/8'
            : 'bg-transparent'
        )}
      >
        <div className="section-container h-16 flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
              <Network className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-text-primary">
              CrawlMap
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Github className="w-3.5 h-3.5" />}
                rightIcon={<Star className="w-3 h-3 opacity-60" />}
              >
                GitHub
              </Button>
            </a>
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="ml-auto md:hidden p-2 text-text-muted hover:text-text-primary"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 inset-x-0 z-40 glass-strong border-b border-white/8 px-4 py-4 flex flex-col gap-2 md:hidden"
          >
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-xl hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <div className="mt-2 pt-2 border-t border-white/6 flex flex-col gap-2">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
