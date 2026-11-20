import { type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  accent?: 'default' | 'blue' | 'success' | 'warning' | 'purple'
  small?: boolean
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  accent = 'default',
  small = false,
}: SummaryCardProps) {
  const accentColors = {
    default: 'text-[var(--text-secondary)] bg-[var(--surface)]',
    blue: 'text-[#0071e3] bg-blue-50/80',
    success: 'text-emerald-600 bg-emerald-50/80',
    warning: 'text-amber-600 bg-amber-50/80',
    purple: 'text-purple-600 bg-purple-50/80',
  }

  return (
    <Card className={cn('flex flex-col justify-between', small ? 'p-4' : 'p-6')}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
          {title}
        </span>
        <div className={cn('p-2 rounded-xl transition-colors', accentColors[accent])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div
          className={cn(
            'font-semibold text-[var(--text-primary)] tracking-tight font-sans',
            small ? 'text-2xl' : 'text-3xl'
          )}
        >
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
        </div>
        {description && (
          <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{description}</div>
        )}
      </div>
    </Card>
  )
}
