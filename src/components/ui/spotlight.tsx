import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className, fill = 'rgba(99,102,241,0.08)' }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 70%)`
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [fill])

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none absolute inset-0 transition-opacity duration-300',
        className
      )}
    />
  )
}
