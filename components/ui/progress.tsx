import { cn } from '@/lib/utils'

export function Progress({
  value = 0,
  max = 100,
  className,
  indicatorColor = 'bg-[var(--accent)]',
}: {
  value?: number
  max?: number
  className?: string
  indicatorColor?: string
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-[4px] bg-[var(--color-linen)] border border-[var(--color-hairline)]', className)}
    >
      <div
        className={cn('h-full transition-all duration-300 ease-out rounded-[4px]', indicatorColor)}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
