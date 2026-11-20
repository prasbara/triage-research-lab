'use client'

import { cn } from '@/lib/utils'
import { createContext, useContext, useState, type ReactNode } from 'react'

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (val: string) => void
  children: ReactNode
  className?: string
}) {
  const [internalTab, setInternalTab] = useState(defaultValue || '')
  const activeTab = value !== undefined ? value : internalTab
  const setActiveTab = (val: string) => {
    if (value === undefined) setInternalTab(val)
    onValueChange?.(val)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-[var(--color-linen)] border border-[var(--color-hairline)] rounded-[4px]',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used inside Tabs')
  const isSelected = ctx.activeTab === value

  return (
    <button
      type="button"
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        'px-4 py-1.5 text-xs font-medium rounded-[4px] transition-all cursor-pointer select-none',
        isSelected
          ? 'bg-[var(--color-pure-white)] text-[var(--color-ink)] border border-[var(--color-hairline)]'
          : 'text-[var(--color-graphite)] hover:text-[var(--color-ink)]'
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used inside Tabs')
  if (ctx.activeTab !== value) return null

  return <div className={cn('mt-4 animate-in fade-in-50 duration-150', className)}>{children}</div>
}
