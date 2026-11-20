import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-[#0071e3] text-white hover:bg-[#0077ed] active:bg-[#006edb] shadow-sm hover:shadow',
      secondary:
        'bg-[#f5f5f7] text-[#1d1d1f] border border-[#d6d6d6] hover:bg-[#e6e6e8] active:bg-[#d6d6d6]',
      outline:
        'bg-transparent text-[#1d1d1f] border border-[#d6d6d6] hover:bg-[#f5f5f7] active:bg-[#e6e6e8]',
      ghost:
        'bg-transparent text-[#0071e3] hover:bg-blue-50 active:bg-blue-100',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
      md: 'px-4 py-2 text-sm font-medium gap-2',
      lg: 'px-6 py-2.5 text-base font-medium gap-2.5',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-150 select-none cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
