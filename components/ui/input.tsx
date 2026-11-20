import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-[11px] font-mono uppercase tracking-[1.2px] text-[#585858]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-[4px] border border-[#dedbd6] bg-[#ffffff] px-3.5 py-2.5 text-xs text-[#111111]',
            'placeholder:text-[#888888] outline-none transition-all',
            'focus:border-[#111111] focus:ring-1 focus:ring-[#111111]',
            'disabled:opacity-50 disabled:bg-[#f1eee9]',
            error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-100',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#888888]">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
