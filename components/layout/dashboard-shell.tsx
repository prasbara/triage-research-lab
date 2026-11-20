import { type ReactNode } from 'react'

interface DashboardShellProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function DashboardShell({ title, subtitle, actions, children }: DashboardShellProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-sans">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}
