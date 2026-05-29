import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
}

export function BorderBeam({
  className,
  size = 120,
  duration = 2.5,
  colorFrom = '#6366f1',
  colorTo = '#8b5cf6',
  borderWidth = 1.5,
}: BorderBeamProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--border-beam-size', `${size}px`)
    el.style.setProperty('--border-beam-duration', `${duration}s`)
    el.style.setProperty('--border-beam-from', colorFrom)
    el.style.setProperty('--border-beam-to', colorTo)
    el.style.setProperty('--border-beam-width', `${borderWidth}px`)
  }, [size, duration, colorFrom, colorTo, borderWidth])

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [border-width:var(--border-beam-width)]',
        '[mask-clip:padding-box,border-box] [mask-composite:intersect]',
        '[mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        className
      )}
      style={{
        background: `
          linear-gradient(#0000, #0000) padding-box,
          conic-gradient(
            from calc(var(--border-beam-angle, 0deg) - 90deg),
            transparent 0deg,
            var(--border-beam-from) 60deg,
            var(--border-beam-to) 90deg,
            transparent 120deg,
            transparent 360deg
          ) border-box
        `,
        animation: `border-beam-spin var(--border-beam-duration) linear infinite`,
      }}
    />
  )
}
