import { cn } from '@/lib/utils'
import { type SelectHTMLAttributes, forwardRef } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-[11px] font-mono uppercase tracking-[1.2px] text-[#585858]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none rounded-[4px] border border-[#dedbd6] bg-[#ffffff] px-3.5 py-2.5 pr-8 text-xs text-[#111111]',
              'outline-none transition-all cursor-pointer',
              'focus:border-[#111111] focus:ring-1 focus:ring-[#111111]',
              'disabled:opacity-50 disabled:bg-[#f1eee9]',
              error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-100',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#585858]">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#888888]">{helperText}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
