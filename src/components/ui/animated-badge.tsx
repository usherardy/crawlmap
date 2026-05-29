import { cn } from '@/utils/cn'

interface AnimatedBadgeProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedBadge({ children, className }: AnimatedBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium',
        'relative overflow-hidden',
        'border border-accent/30 text-accent',
        'bg-gradient-to-r from-accent/10 via-accent-violet/10 to-accent/10',
        className
      )}
    >
      {/* Shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.18) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-sweep 2.5s linear infinite',
        }}
      />
      {/* Blinking dot */}
      <span className="relative w-1.5 h-1.5 rounded-full bg-accent">
        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
      </span>
      <span className="relative">{children}</span>
    </span>
  )
}
