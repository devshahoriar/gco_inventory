import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from './label'
import { Textarea } from './textarea'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

type Props =
  | {
      labelTitle?: string
      pClassName?: string
      isTextArea?: boolean
    } & React.ComponentProps<'input'>

const InputParent = ({
  labelTitle,
  pClassName,
  isTextArea = false,
  ...props
}: Props) => {
  return (
    <div className={cn('space-y-1', pClassName)}>
      {labelTitle && <Label>{labelTitle}</Label>}
      {isTextArea ? (
        <Textarea {...(props as React.ComponentProps<'textarea'>)} />
      ) : (
        <Input {...props} />
      )}
    </div>
  )
}

export { Input, InputParent }
