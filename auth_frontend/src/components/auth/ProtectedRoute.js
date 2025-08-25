import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageLoading } from '../ui/Loading'

// PUBLIC_INTERFACE
export const ProtectedRoute = ({ children }) => {
  /**
   * Protected route component that requires authentication
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components to render if authenticated
   */
  const { user, loading, twoFactorRequired } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageLoading />
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (twoFactorRequired) {
    // Redirect to 2FA if not completed
    return <Navigate to="/verify-2fa" replace />
  }

  return children
}
