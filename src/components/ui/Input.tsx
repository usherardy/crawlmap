import { cn } from '@/utils/cn'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  error?: string
  size?: 'md' | 'lg'
  label?: string
}

export function Input({
  value,
  onChange,
  onSubmit,
  leftIcon,
  rightElement,
  error,
  size = 'md',
  label,
  className,
  placeholder,
  disabled,
  ...props
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) onSubmit()
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      )}
      <div
        className={cn(
          'flex items-center glass rounded-xl transition-all duration-200',
          'focus-within:border-accent/60 focus-within:shadow-[0_0_0_1px_rgba(99,102,241,0.3)]',
          error && 'border-error/60 focus-within:border-error/80',
          disabled && 'opacity-50 cursor-not-allowed',
          size === 'lg' && 'rounded-2xl',
          className
        )}
      >
        {leftIcon && (
          <span className={cn('flex-shrink-0 text-text-muted', size === 'lg' ? 'pl-4' : 'pl-3')}>
            {leftIcon}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none',
            size === 'lg' ? 'h-12 px-4 text-base' : 'h-9 px-3 text-sm',
            leftIcon && 'pl-2',
            rightElement && 'pr-2'
          )}
          {...props}
        />
        {rightElement && (
          <span className={cn('flex-shrink-0', size === 'lg' ? 'pr-2' : 'pr-2')}>
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
}
