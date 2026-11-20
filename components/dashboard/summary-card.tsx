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
    default: 'text-[var(--color-ink)] bg-[var(--color-linen)]',
    blue: 'text-[var(--color-electric-violet)] bg-[#f3f3ff]',
    success: 'text-emerald-700 bg-emerald-50',
    warning: 'text-amber-700 bg-amber-50',
    purple: 'text-[var(--color-electric-violet)] bg-[#f3f3ff]',
  }

  return (
    <Card className={cn('flex flex-col justify-between border-[var(--color-hairline)] bg-[var(--color-pure-white)] rounded-[4px] shadow-none', small ? 'p-4' : 'p-6')}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono tracking-[1.2px] uppercase text-[var(--color-graphite)]">
          {title}
        </span>
        <div className={cn('p-1.5 rounded-[4px] border border-[var(--color-hairline)] transition-colors', accentColors[accent])}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <div
          className={cn(
            'font-light text-[var(--color-ink)] tracking-tight font-sans',
            small ? 'text-2xl' : 'text-3xl'
          )}
        >
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
        </div>
        {description && (
          <div className="text-xs text-[var(--color-graphite)] mt-1 font-normal">{description}</div>
        )}
      </div>
    </Card>
  )
}
