import React, { useState, useEffect, useRef }

TwoFactorAuth.propTypes = {} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Alert, AlertDescription } from '../ui/Alert'

// PUBLIC_INTERFACE
export const TwoFactorAuth = () => {
  /**
   * Two-factor authentication component with OTP input
   */
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const inputRefs = useRef(new Array(6).fill(null))
  const { verifyTwoFactorOtp, sendTwoFactorOtp, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || (typeof window !== 'undefined' ? window.localStorage.getItem('user_email') : '')

  useEffect(() => {
    if (!email) {
      navigate('/login')
      return
    }

    // Auto-send OTP when component mounts
    const sendInitialOtp = async () => {
      try {
        await sendTwoFactorOtp(email)
        setResendTimer(60)
        // focus first box
        setTimeout(() => {
          inputRefs.current[0]?.focus()
        }, 0)
      } catch (_err) {
        // normalized error shown via error alert
      }
    }

    sendInitialOtp()
  }, [email, navigate, sendTwoFactorOtp])

  useEffect(() => {
    // Handle resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character

    setOtp(newOtp)

    // Clear error when user starts typing
    if (error) {
      clearError()
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (otpCode = null) => {
    const codeToVerify = otpCode || otp.join('')
    
    if (codeToVerify.length !== 6) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await verifyTwoFactorOtp(email, codeToVerify)
      setShowSuccess(true)
      
      // Redirect to dashboard after showing success
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (_err) {
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) {
      return
    }

    setIsResending(true)
    
    try {
      await sendTwoFactorOtp(email)
      setResendTimer(60) // 60 second cooldown
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (_err) {
      // normalized error will show in alert
    } finally {
      setIsResending(false)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
        <Card className="w-full max-w-md animate-bounce-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-green-900">Verification Successful!</CardTitle>
            <CardDescription>
              You're being redirected to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
            <br />
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="space-y-6">
            {error && (
              <Alert variant="error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div
              className="flex justify-center space-x-2"
              onPaste={(e) => {
                const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
                if (text.length === 6) {
                  e.preventDefault()
                  const next = text.split('')
                  setOtp(next)
                  // auto-submit after paste
                  handleSubmit(text)
                }
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting || otp.join('').length !== 6}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isResending}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:text-secondary-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? 'Sending...' : 
                   resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              Back to login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
