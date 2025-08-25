import React from 'react'
import { cn } from '../../lib/utils'

// PUBLIC_INTERFACE
export const Input = React.forwardRef(({
  className,
  type = "text",
  error,
  label,
  hint,
  ...props
}, ref) => {
  /**
   * Reusable input component with validation states
   * @param {Object} props - Component props
   * @param {string} props.type - Input type
   * @param {string} props.error - Error message
   * @param {string} props.label - Input label
   * @param {string} props.hint - Hint text
   */
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "block w-full rounded-lg border px-3 py-2 text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "placeholder:text-secondary-400",
          error
            ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
            : "border-secondary-300 focus:border-primary-500 focus:ring-primary-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 animate-fade-in">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-secondary-500">{hint}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"
