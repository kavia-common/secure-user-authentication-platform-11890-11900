import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageLoading } from '../ui/Loading'

/**
 * Decide the best redirect target for an unauthenticated or partially authenticated user.
 * Preference order:
 * - If no user: to /login with return location.
 * - If user exists but email not verified: to /verify-email (keep return path as info).
 * - If 2FA not completed: to /verify-2fa.
 */

import PropTypes from 'prop-types'

// PUBLIC_INTERFACE
export const ProtectedRoute = ({ children }) => {
  /**
   * Protected route component that requires authentication, verified email, and completed 2FA
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components to render if fully authorized
   */
  const { user, loading, twoFactorRequired } = useAuth()
  const location = useLocation()

  // While auth state is being resolved, show a full page loader
  if (loading) {
    return <PageLoading />
  }

  // Not logged in => go to login and preserve intended route
  if (!user) {
    // Preserve intended destination when redirecting to login
    const from = location?.pathname ? { from: location } : undefined
    return <Navigate to="/login" state={from} replace />
  }

  // Email exists but not verified => force verification page
  if (user && user.email_verified === false) {
    return (
      <Navigate
        to="/verify-email/notice"
        state={{
          from: location,
          message: 'Please verify your email to continue.',
          email: user.email,
        }}
        replace
      />
    )
  }

  // If backend flagged 2FA requirement => go to 2FA flow
  if (twoFactorRequired) {
    return (
      <Navigate
        to="/verify-2fa"
        state={{ from: location, email: user?.email || localStorage.getItem('user_email') }}
        replace
      />
    )
  }

  // Fully authorized
  return <>{children}</>
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
