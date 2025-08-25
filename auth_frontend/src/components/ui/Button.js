import React from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = {
  default: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500",
  outline: "border border-primary-300 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
  ghost: "text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
}

const buttonSizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
}

// PUBLIC_INTERFACE
export const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "md",
  disabled,
  loading,
  children,
  ...props
}, ref) => {
  /**
   * Reusable button component with variants and states
   * @param {Object} props - Component props
   * @param {string} props.variant - Button variant
   * @param {string} props.size - Button size
   * @param {boolean} props.disabled - Whether button is disabled
   * @param {boolean} props.loading - Whether button is in loading state
   * @param {React.ReactNode} props.children - Button content
   */
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        buttonVariants[variant],
        buttonSizes[size],
        loading && "cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = "Button"
