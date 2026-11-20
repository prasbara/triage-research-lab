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
      // Pricing Blue Pill — Filled conversion control with 9999px radius, zero shadow
      primary:
        'bg-[#0071e3] text-white hover:bg-[#0077ed] active:bg-[#006edb] tracking-[-0.12px]',
      // Secondary Pill — Studio mist with hairline outline
      secondary:
        'bg-[#f5f5f7] text-[#1d1d1f] border border-[#d6d6d6] hover:bg-[#e6e6e8] active:bg-[#d6d6d6] tracking-[-0.12px]',
      // Outlined Explore Pill — Transparent fill, 1px #86868b outline, 9999px radius
      outline:
        'bg-transparent text-[#1d1d1f] border border-[#86868b] hover:border-[#1d1d1f] hover:bg-[#f5f5f7] active:bg-[#e6e6e8] tracking-[-0.12px]',
      ghost:
        'bg-transparent text-[#0066cc] hover:bg-blue-50/50 active:bg-blue-100/50 tracking-[-0.12px]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 tracking-[-0.12px]',
    }
    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs font-normal gap-1.5 h-8',
      md: 'px-5 py-2 text-xs font-medium gap-2 h-9',
      lg: 'px-7 py-3 text-sm font-medium gap-2.5 h-11',
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
