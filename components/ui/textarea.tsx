import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-pure-white)] px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-smoke)] focus-visible:outline-none focus-visible:border-[var(--color-electric-violet)] focus-visible:ring-1 focus-visible:ring-[var(--color-electric-violet)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
