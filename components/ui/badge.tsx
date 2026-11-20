import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'muted' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    // Intercom Linen tag
    default: 'bg-[#f1eee9] text-[#111111] border border-[#dedbd6]',
    // Outlined tag
    outline: 'bg-transparent border border-[#dedbd6] text-[#585858]',
    // Electric Violet Accent tag
    purple: 'bg-[#0007cb]/10 text-[#0007cb] border border-[#0007cb]/30',
    // Muted Stone tag
    muted: 'bg-[#f1eee9] text-[#888888] border border-[#dedbd6]',
    // Clinical indicators
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-mono tracking-[1.2px] uppercase select-none transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
