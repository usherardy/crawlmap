import { cn } from '@/utils/cn'

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
}

export function TextShimmer({ children, className }: TextShimmerProps) {
  return (
    <span
      className={cn('inline-block', className)}
      style={{
        background:
          'linear-gradient(120deg, #6366f1 0%, #8b5cf6 20%, #a78bfa 40%, #6366f1 60%, #8b5cf6 80%, #6366f1 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer-sweep 3s linear infinite',
      }}
    >
      {children}
    </span>
  )
}
