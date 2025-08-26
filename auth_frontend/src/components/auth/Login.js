import React, { useState, useEffect }

Login.propTypes = {} from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { validateEmail } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Alert, AlertDescription } from '../ui/Alert'
import PropTypes from 'prop-types'

// PUBLIC_INTERFACE
export const Login = () => {
  /**
   * User login component with validation
   */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle messages from other routes (like successful signup)
  const successMessage = location.state?.message
  const emailFromState = location.state?.email

  useEffect(() => {
    if (emailFromState) {
      setFormData(prev => ({ ...prev, email: emailFromState }))
    }
  }, [emailFromState])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
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
      const result = await login({
        email: formData.email,
        password: formData.password,
      })
      try { if (typeof window !== 'undefined') window.localStorage.setItem('user_email', formData.email) } catch {}
      
      // If login successful, redirect to 2FA
      if (result?.access_token) {
        navigate('/verify-2fa', { 
          state: { email: formData.email }
        })
      }
    } catch (_err) {
      // error is normalized by context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

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
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
