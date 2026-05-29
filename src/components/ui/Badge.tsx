import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-white/8 text-text-secondary border border-white/10',
        accent: 'bg-accent/15 text-accent border border-accent/25',
        success: 'bg-success/12 text-success border border-success/25',
        error: 'bg-error/12 text-error border border-error/25',
        warning: 'bg-warning/12 text-warning border border-warning/25',
        info: 'bg-info/12 text-info border border-info/25',
        violet: 'bg-accent-violet/12 text-accent-violet border border-accent-violet/25',
      },
      size: {
        sm: 'h-5 px-2 text-xs',
        md: 'h-6 px-2.5 text-xs',
        lg: 'h-7 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label?: string
  dot?: boolean
  className?: string
  children?: React.ReactNode
}

export function Badge({ label, dot, variant, size, className, children }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'error' && 'bg-error',
            variant === 'warning' && 'bg-warning',
            variant === 'info' && 'bg-info',
            variant === 'accent' && 'bg-accent',
            (!variant || variant === 'default') && 'bg-text-muted',
            variant === 'violet' && 'bg-accent-violet'
          )}
        />
      )}
      {children ?? label}
    </span>
  )
}

export function StatusBadge({ code }: { code: number | null }) {
  if (!code) return <Badge label="?" variant="default" />
  if (code >= 200 && code < 300) return <Badge label={String(code)} variant="success" dot />
  if (code >= 300 && code < 400) return <Badge label={String(code)} variant="warning" dot />
  if (code >= 400) return <Badge label={String(code)} variant="error" dot />
  return <Badge label={String(code)} variant="default" />
}
