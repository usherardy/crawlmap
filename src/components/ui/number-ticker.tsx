import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'
import { cn } from '@/utils/cn'

interface NumberTickerProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  duration = 1.8,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setDisplayed(parseFloat(v.toFixed(decimalPlaces)))
      },
    })
    return () => controls.stop()
  }, [isInView, value, duration, decimalPlaces])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{displayed.toLocaleString()}{suffix}
    </span>
  )
}
