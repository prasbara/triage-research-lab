import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'muted' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    outline: 'bg-white text-slate-600 border border-slate-200/90 shadow-2xs',
    purple: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    muted: 'bg-slate-100/70 text-slate-500 border border-slate-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-tight select-none transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
