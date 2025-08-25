import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Loading } from '../ui/Loading'
import { Alert, AlertDescription } from '../ui/Alert'

// PUBLIC_INTERFACE
export const EmailVerification = () => {
  /**
   * Email verification component for verifying email with token
   */
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setStatus('error')
        setMessage('Invalid verification link. Please check your email for the correct link.')
        return
      }

      try {
        const result = await api.auth.verifyEmail(token, email)
        setStatus('success')
        setMessage(result.message || 'Email verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Email verified successfully! You can now log in to your account.'
            }
          })
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Failed to verify email. The link may be expired or invalid.')
      }
    }

    verifyEmail()
  }, [token, email, navigate])

  const getIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loading size="lg" />
      case 'success':
        return (
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verifying Email...'
      case 'success':
        return 'Email Verified!'
      case 'error':
        return 'Verification Failed'
      default:
        return 'Email Verification'
    }
  }

  const getVariant = () => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      default:
        return 'info'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="mb-4">
            {getIcon()}
          </div>
          <CardTitle className={
            status === 'success' ? 'text-green-900' : 
            status === 'error' ? 'text-red-900' : 'text-secondary-900'
          }>
            {getTitle()}
          </CardTitle>
          {status === 'verifying' && (
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={getVariant()} className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-secondary-600 mb-4">
                You will be redirected to the login page in a few seconds.
              </p>
              <Link 
                to="/login" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Go to login now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-2">
              <Link 
                to="/login" 
                className="block text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Back to login
              </Link>
              <Link 
                to="/signup" 
                className="block text-sm font-medium text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Create new account
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
