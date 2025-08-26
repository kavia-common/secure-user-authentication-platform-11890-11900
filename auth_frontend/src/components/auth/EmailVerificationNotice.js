import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'

/**
 * PUBLIC_INTERFACE
 * A simple page prompting the user to verify their email after login,
 * used when we know the user is authenticated but email_verified is false.
 */
export const EmailVerificationNotice = () => {
  const { user } = useAuth()
  const emailHint = user?.email || ((typeof window !== 'undefined' && window.localStorage.getItem('user_email')) || 'your email')

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 19a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We sent a verification link to {emailHint}. Please check your inbox and click the link to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-secondary-600">
            Didn&apos;t receive an email? Check your spam folder or request a new link from your account settings.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Link to="/login" className="text-sm font-medium text-secondary-600 hover:text-secondary-800 transition-colors">
              Back to login
            </Link>
            <Button as="a" href="mailto:" variant="outline" size="sm">
              Open Email App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
