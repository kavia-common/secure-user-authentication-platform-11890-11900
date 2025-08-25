import React from 'react'
import { cn } from '../../lib/utils'

const alertVariants = {
  default: "bg-secondary-50 text-secondary-900 border-secondary-200",
  success: "bg-green-50 text-green-900 border-green-200",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
  error: "bg-red-50 text-red-900 border-red-200",
  info: "bg-blue-50 text-blue-900 border-blue-200",
}

// PUBLIC_INTERFACE
export const Alert = ({ className, variant = "default", children, ...props }) => {
  /**
   * Alert component for displaying notifications
   * @param {Object} props - Component props
   * @param {string} props.variant - Alert variant
   * @param {React.ReactNode} props.children - Alert content
   */
  return (
    <div
      className={cn(
        "rounded-lg border p-4 animate-fade-in",
        alertVariants[variant],
        className
      )}
      role="alert"
      {...props}
    >
      {children}
    </div>
  )
}

// PUBLIC_INTERFACE
export const AlertTitle = ({ className, children, ...props }) => {
  /**
   * Alert title component
   */
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  )
}

// PUBLIC_INTERFACE
export const AlertDescription = ({ className, children, ...props }) => {
  /**
   * Alert description component
   */
  return (
    <div
      className={cn("text-sm opacity-90", className)}
      {...props}
    >
      {children}
    </div>
  )
}
