import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../../lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

// PUBLIC_INTERFACE
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  /**
   * Dialog content component
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Dialog content
   */
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 animate-slide-up sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

// PUBLIC_INTERFACE
const DialogHeader = ({ className, ...props }) => {
  /**
   * Dialog header component
   */
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

// PUBLIC_INTERFACE
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => {
  /**
   * Dialog title component
   */
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
})
DialogTitle.displayName = DialogPrimitive.Title.displayName

// PUBLIC_INTERFACE
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => {
  /**
   * Dialog description component
   */
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-secondary-600", className)}
      {...props}
    />
  )
})
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
