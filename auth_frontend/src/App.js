import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { SignUp } from './components/auth/SignUp'
import { Login } from './components/auth/Login'
import { TwoFactorAuth } from './components/auth/TwoFactorAuth'
import { ForgotPassword } from './components/auth/ForgotPassword'
import { ResetPassword } from './components/auth/ResetPassword'
import { EmailVerification } from './components/auth/EmailVerification'
import { EmailVerificationNotice } from './components/auth/EmailVerificationNotice'
import { Dashboard } from './components/dashboard/Dashboard'
import './App.css'

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component with routing and authentication context
   */
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/verify-email/notice" element={<EmailVerificationNotice />} />
            <Route path="/verify-2fa" element={<TwoFactorAuth />} />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
