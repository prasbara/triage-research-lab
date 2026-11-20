import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }, ref) => {
    const variants = {
      // Intercom Filled Primary Button — Black block anchoring on warm cream canvas
      primary:
        'bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] active:bg-[#333333] border border-[#000000] tracking-normal',
      // Outlined CTA Button — White bg with crisp 1px solid #111111 border
      outline:
        'bg-[#ffffff] text-[#111111] border border-[#111111] hover:bg-[#f1eee9] active:bg-[#dedbd6] tracking-normal',
      // Secondary Button — Subtle hairline border on linen
      secondary:
        'bg-[#ffffff] text-[#111111] border border-[#dedbd6] hover:bg-[#f1eee9] active:bg-[#dedbd6] tracking-normal',
      // Ghost Text Button — No background, plain ink text
      ghost:
        'bg-transparent text-[#111111] hover:bg-[#f1eee9] active:bg-[#dedbd6] tracking-normal',
      // Electric Violet Accent Button (used sparingly for brand punctuation)
      accent:
        'bg-[#0007cb] text-[#ffffff] hover:bg-[#0006a8] active:bg-[#00058e] border border-[#0007cb] tracking-normal',
      // Danger Action
      danger:
        'bg-rose-700 text-[#ffffff] hover:bg-rose-800 active:bg-rose-900 border border-rose-700 tracking-normal',
    }
    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs font-normal gap-1.5 h-8',
      md: 'px-4 py-2 text-xs font-normal gap-2 h-9',
      lg: 'px-5 py-3 text-sm font-normal gap-2.5 h-11',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-[4px] transition-colors duration-150 select-none cursor-pointer',
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
