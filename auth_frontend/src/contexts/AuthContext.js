import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'

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
        error: null
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

const AuthContext = createContext()

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /**
   * Authentication context provider
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components
   */
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Session timeout handling
  useEffect(() => {
    let sessionTimer

    const startSessionTimer = () => {
      clearTimeout(sessionTimer)
      // 30 minutes session timeout
      sessionTimer = setTimeout(() => {
        logout()
      }, 30 * 60 * 1000)
    }

    const resetSessionTimer = () => {
      if (state.user && state.session) {
        startSessionTimer()
      }
    }

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetSessionTimer, true)
    })

    if (state.user && state.session) {
      startSessionTimer()
    }

    return () => {
      clearTimeout(sessionTimer)
      events.forEach(event => {
        document.removeEventListener(event, resetSessionTimer, true)
      })
    }
  }, [state.user, state.session])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.access_token) {
          localStorage.setItem('access_token', session.access_token)
          dispatch({ type: 'SET_SESSION', payload: session })
          
          // Get user profile from backend
          try {
            const userData = await api.user.getProfile()
            dispatch({ type: 'SET_USER', payload: userData })
          } catch (error) {
            console.error('Failed to fetch user profile:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user profile' })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Authentication initialization failed' })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('access_token', session.access_token)
          dispatch({ type: 'SET_SESSION', payload: session })
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('access_token')
          dispatch({ type: 'LOGOUT' })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
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
      const result = await api.auth.login(credentials)
      
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token)
        dispatch({ type: 'SET_2FA_REQUIRED', payload: true })
      }
      
      dispatch({ type: 'SET_LOADING', payload: false })
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // PUBLIC_INTERFACE
  const logout = async () => {
    /**
     * Log out the current user
     */
    try {
      await api.auth.logout()
      await supabase.auth.signOut()
      localStorage.removeItem('access_token')
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      localStorage.removeItem('access_token')
      dispatch({ type: 'LOGOUT' })
    }
  }

  // PUBLIC_INTERFACE
  const sendTwoFactorOtp = async (email) => {
    /**
     * Send two-factor authentication OTP
     * @param {string} email - User email
     */
    try {
      return await api.twoFactor.sendOtp(email)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
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
    
    try {
      const result = await api.twoFactor.verifyOtp(email, otpCode)
      
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token)
        dispatch({ type: 'SET_USER', payload: result.user })
        dispatch({ type: 'SET_2FA_REQUIRED', payload: false })
      }
      
      dispatch({ type: 'SET_LOADING', payload: false })
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // PUBLIC_INTERFACE
  const forgotPassword = async (email) => {
    /**
     * Request password reset
     * @param {string} email - User email
     */
    try {
      return await api.auth.forgotPassword(email)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // PUBLIC_INTERFACE
  const resetPassword = async (token, newPassword) => {
    /**
     * Reset password with token
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     */
    try {
      return await api.auth.resetPassword({ token, new_password: newPassword })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // PUBLIC_INTERFACE
  const clearError = () => {
    /**
     * Clear the current error state
     */
    dispatch({ type: 'CLEAR_ERROR' })
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
