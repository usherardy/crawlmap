import { cn } from '@/utils/cn'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[14rem] grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
}

const colClass: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
}

const rowClass: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
}

export function BentoCard({ children, className, colSpan = 1, rowSpan = 1 }: BentoCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'glass border border-white/8',
        'transition-all duration-300',
        'hover:border-white/16 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]',
        colClass[colSpan],
        rowClass[rowSpan],
        className
      )}
    >
      {children}
    </div>
  )
}
