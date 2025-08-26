import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'

/**
 * Internal helper to read/write/remove access_token consistently
 */
const tokenStorage = {
  get() {
    try {
      if (typeof window === 'undefined') return null
      return window.localStorage.getItem('access_token')
    } catch {
      return null
    }
  },
  set(token) {
    try {
      if (typeof window === 'undefined') return
      if (token) window.localStorage.setItem('access_token', token)
    } catch {
      // ignore
    }
  },
  remove() {
    try {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem('access_token')
    } catch {
      // ignore
    }
  },
}

// Auth state reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    case 'SET_2FA_REQUIRED':
      return { ...state, twoFactorRequired: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        twoFactorRequired: false,
        loading: false,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  twoFactorRequired: false,
}

const AuthContext = createContext(null)
AuthContext.displayName = 'AuthContext'

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /**
   * Authentication context provider
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components
   */
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Helper: normalize and dispatch errors using api.normalizeError
  const handleError = useCallback((err, fallback = 'Something went wrong') => {
    const normalized = api.normalizeError(err, fallback)
    dispatch({ type: 'SET_ERROR', payload: normalized.message })
    return normalized
  }, [])

  // Define logout first so effects can reference it safely
  // PUBLIC_INTERFACE
  const logout = useCallback(async () => {
    /**
     * Log out the current user
     */
    try {
      try {
        await api.auth.logout()
      } catch (_e) {
        // ignore API logout failures
      }
      await supabase.auth.signOut()
    } finally {
      tokenStorage.remove()
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  // Reusable list of activity events
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']

  // Session timeout handling (30 mins inactivity)
  useEffect(() => {
    let sessionTimer

    const startSessionTimer = () => {
      if (sessionTimer) clearTimeout(sessionTimer)
      sessionTimer = setTimeout(() => {
        // best-effort async call; we don't await inside timer
        logout()
      }, 30 * 60 * 1000)
    }

    const resetSessionTimer = () => {
      if (state.user && tokenStorage.get()) {
        startSessionTimer()
      }
    }

    if (typeof document !== 'undefined') {
      activityEvents.forEach(event => {
        document.addEventListener(event, resetSessionTimer, true)
      })
    }

    if (state.user && tokenStorage.get()) {
      startSessionTimer()
    }

    return () => {
      if (sessionTimer) clearTimeout(sessionTimer)
      if (typeof document !== 'undefined') {
        activityEvents.forEach(event => {
          document.removeEventListener(event, resetSessionTimer, true)
        })
      }
    }
  }, [state.user, logout, dispatch, activityEvents])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // If a token exists from previous session, keep it for initial API fetch
        const existingToken = tokenStorage.get()

        // Prefer Supabase session if available for consistency
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
          tokenStorage.set(session.access_token)
          dispatch({ type: 'SET_SESSION', payload: session })
        } else if (existingToken) {
          // If we only have a raw token, keep it; backend will validate
          dispatch({ type: 'SET_SESSION', payload: { access_token: existingToken } })
        }

        // If we have any token, determine whether 2FA is completed and fetch profile accordingly
        if (tokenStorage.get()) {
          try {
            // Ask backend whether 2FA is complete
            let requires2FA = false
            try {
              const status = await api.twoFactor.status()
              // If backend returns success false or specific message, treat as requires 2FA
              requires2FA = status?.success === false
            } catch (_e) {
              // On error, assume profile fetch will clarify; continue
            }

            if (!requires2FA) {
              const userData = await api.user.getProfile()
              dispatch({ type: 'SET_USER', payload: userData })
              dispatch({ type: 'SET_2FA_REQUIRED', payload: false })
            } else {
              // Token exists but 2FA not completed yet
              dispatch({ type: 'SET_2FA_REQUIRED', payload: true })
              dispatch({ type: 'SET_LOADING', payload: false })
            }
          } catch (error) {
            const normalized = api.normalizeError(error)
            if (normalized.status === 401 || normalized.status === 403) {
              tokenStorage.remove()
              dispatch({ type: 'LOGOUT' })
            } else {
              dispatch({ type: 'SET_ERROR', payload: normalized.message })
              dispatch({ type: 'SET_LOADING', payload: false })
            }
          }
        } else {
          // No token, not logged in
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        handleError(error, 'Authentication initialization failed')
      }
    }

    initializeAuth()

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          tokenStorage.set(session.access_token)
          dispatch({ type: 'SET_SESSION', payload: session })
        } else if (event === 'SIGNED_OUT') {
          tokenStorage.remove()
          dispatch({ type: 'LOGOUT' })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [handleError])

  // PUBLIC_INTERFACE
  const signup = async (userData) => {
    /**
     * Sign up a new user
     * @param {Object} userData - User registration data
     */
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const result = await api.auth.signup(userData)
      dispatch({ type: 'SET_LOADING', payload: false })
      return result
    } catch (error) {
      const normalized = handleError(error, 'Failed to create account')
      throw normalized
    }
  }

  // PUBLIC_INTERFACE
  const login = async (credentials) => {
    /**
     * Log in a user
     * @param {Object} credentials - Login credentials
     */
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      // Backend returns an access_token intended for proceeding to 2FA
      const result = await api.auth.login(credentials)

      if (result?.access_token) {
        tokenStorage.set(result.access_token)
        // Gate access until 2FA completion
        dispatch({ type: 'SET_2FA_REQUIRED', payload: true })
        // Do not set user yet; will be set after 2FA verify returns user
      }

      dispatch({ type: 'SET_LOADING', payload: false })
      return result
    } catch (error) {
      const normalized = handleError(error, 'Login failed')
      throw normalized
    }
  }

  // (logout defined earlier)

  // PUBLIC_INTERFACE
  const sendTwoFactorOtp = async (email) => {
    /**
     * Send two-factor authentication OTP
     * @param {string} email - User email
     */
    dispatch({ type: 'CLEAR_ERROR' })
    try {
      return await api.twoFactor.sendOtp(email)
    } catch (error) {
      const normalized = handleError(error, 'Failed to send verification code')
      throw normalized
    }
  }

  // PUBLIC_INTERFACE
  const verifyTwoFactorOtp = async (email, otpCode) => {
    /**
     * Verify two-factor authentication OTP
     * @param {string} email - User email
     * @param {string} otpCode - OTP code
     */
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const result = await api.twoFactor.verifyOtp(email, otpCode)

      if (result?.access_token) {
        tokenStorage.set(result.access_token)
      }

      if (result?.user) {
        dispatch({ type: 'SET_USER', payload: result.user })
      } else {
        // If backend didn't return user, fetch profile as a fallback
        try {
          const userData = await api.user.getProfile()
          dispatch({ type: 'SET_USER', payload: userData })
        } catch (e) {
          // Non-fatal; surface message but keep token
          handleError(e, 'Failed to fetch user profile after verification')
        }
      }

      dispatch({ type: 'SET_2FA_REQUIRED', payload: false })
      dispatch({ type: 'SET_LOADING', payload: false })
      return result
    } catch (error) {
      const normalized = handleError(error, 'Verification failed')
      dispatch({ type: 'SET_LOADING', payload: false })
      throw normalized
    }
  }

  // PUBLIC_INTERFACE
  const forgotPassword = async (email) => {
    /**
     * Request password reset
     * @param {string} email - User email
     */
    dispatch({ type: 'CLEAR_ERROR' })
    try {
      return await api.auth.forgotPassword(email)
    } catch (error) {
      const normalized = handleError(error, 'Failed to send password reset instructions')
      throw normalized
    }
  }

  // PUBLIC_INTERFACE
  const resetPassword = async (token, newPassword) => {
    /**
     * Reset password with token
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     */
    dispatch({ type: 'CLEAR_ERROR' })
    try {
      return await api.auth.resetPassword({ token, new_password: newPassword })
    } catch (error) {
      const normalized = handleError(error, 'Failed to reset password')
      throw normalized
    }
  }

  // PUBLIC_INTERFACE
  const clearError = () => {
    /**
     * Clear the current error state
     */
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // PUBLIC_INTERFACE
  const refreshProfile = async () => {
    /**
     * Refresh the current user's profile from the backend
     */
    try {
      const userData = await api.user.getProfile()
      dispatch({ type: 'SET_USER', payload: userData })
      return userData
    } catch (error) {
      const normalized = handleError(error, 'Failed to refresh profile')
      throw normalized
    }
  }

  const value = {
    ...state,
    signup,
    login,
    logout,
    sendTwoFactorOtp,
    verifyTwoFactorOtp,
    forgotPassword,
    resetPassword,
    clearError,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// PUBLIC_INTERFACE
export const useAuth = () => {
  /**
   * Hook to access authentication context
   * @returns {Object} Authentication context value
   */
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
