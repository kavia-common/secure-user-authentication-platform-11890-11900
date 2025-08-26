import React, { useState }

ForgotPassword.propTypes = {} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { validateEmail } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Alert, AlertDescription } from '../ui/Alert'

// PUBLIC_INTERFACE
export const ForgotPassword = () => {
  /**
   * Forgot password component for requesting password reset
   */
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { forgotPassword, error, clearError } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const next = e.target.value
    setEmail(next)
    
    // Clear field error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }))
    }
    
    // Clear global error
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await forgotPassword(email)
      try { if (typeof window !== 'undefined') window.localStorage.setItem('user_email', email) } catch {}
      setShowSuccess(true)
    } catch (err) {
      // error is normalized in context; no-op here
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
        <Card className="w-full max-w-md animate-bounce-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-blue-900">Check Your Email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to
              <br />
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-secondary-600 mb-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <p className="text-xs text-secondary-500 mb-2">
              Tip: If you don&apos;t see the email in a few minutes, check your spam folder.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Back to login
              </Link>
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Try again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
