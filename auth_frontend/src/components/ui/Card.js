import React from 'react'
import { cn } from '../../lib/utils'

// PUBLIC_INTERFACE
export const Card = ({ className, children, ...props }) => {
  /**
   * Reusable card component
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Card content
   */
  return (
    <div
      className={cn(
        "rounded-lg border bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// PUBLIC_INTERFACE
export const CardHeader = ({ className, children, ...props }) => {
  /**
   * Card header component
   */
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// PUBLIC_INTERFACE
export const CardTitle = ({ className, children, ...props }) => {
  /**
   * Card title component
   */
  return (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

// PUBLIC_INTERFACE
export const CardDescription = ({ className, children, ...props }) => {
  /**
   * Card description component
   */
  return (
    <p
      className={cn("text-sm text-secondary-600", className)}
      {...props}
    >
      {children}
    </p>
  )
}

// PUBLIC_INTERFACE
export const CardContent = ({ className, children, ...props }) => {
  /**
   * Card content component
   */
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

// PUBLIC_INTERFACE
export const CardFooter = ({ className, children, ...props }) => {
  /**
   * Card footer component
   */
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}
