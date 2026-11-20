import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'muted' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    outline: 'bg-transparent border border-[var(--border)] text-[var(--text-secondary)]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    muted: 'bg-gray-100 text-gray-600 border border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
