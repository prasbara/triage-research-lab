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
      // Modern Linear/Vercel Primary — Slate-900 with subtle ring & shadow
      primary:
        'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-xs border border-slate-900',
      // Outlined Button — Crisp white with delicate border
      outline:
        'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs',
      // Secondary Button — Subtle Slate surface
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/50',
      // Ghost Button — Transparent with hover background
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      // Modern Clinical Blue Accent Button
      accent:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs border border-blue-600',
      // Danger Action
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs border border-rose-600',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 h-8',
      md: 'px-4 py-2 text-xs font-medium gap-2 h-9',
      lg: 'px-5 py-2.5 text-sm font-medium gap-2.5 h-10',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 select-none cursor-pointer active:scale-[0.99]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
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
