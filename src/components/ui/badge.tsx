import React from 'react'
import clsx from 'clsx'

export function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800', className)} {...props}>
      {children}
    </span>
  )
}

export default Badge
