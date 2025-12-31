import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'primary'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors'
  const variants: Record<string, string> = {
    default: 'bg-white border text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    outline: 'bg-white border text-gray-700 hover:bg-gray-50',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  }
  return <button className={clsx(base, variants[variant], className)} {...props} />
}

export default Button
