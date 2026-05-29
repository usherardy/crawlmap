import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { NumberTicker } from '@/components/ui/number-ticker'

const STATS = [
  { value: 12000, suffix: '+', label: 'Sites Mapped', prefix: '' },
  { value: 5, suffix: '', label: 'Export Formats', prefix: '' },
  { value: 100, suffix: '%', label: 'Open Source (MIT)', prefix: '' },
]

export function StatsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div
      ref={ref}
      className="relative w-full border-y border-white/6 bg-white/[0.02] overflow-hidden"
    >
      {/* Gradient borders top/bottom */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent" />

      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 sm:divide-x sm:divide-white/8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center gap-1 sm:px-16 first:pl-0 last:pr-0"
            >
              <span className="text-3xl sm:text-4xl font-extrabold text-text-primary tabular-nums">
                {stat.prefix}
                <NumberTicker value={stat.value} suffix={stat.suffix} duration={1.6} />
              </span>
              <span className="text-sm text-text-muted font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
