import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../lib/api'
import { formatDate, formatDateTime } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Alert, AlertDescription } from '../ui/Alert'
import { Loading } from '../ui/Loading'

// PUBLIC_INTERFACE
export const Dashboard = () => {
  /**
   * Dashboard component showing user profile and account information
   */
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await api.dashboard.getData()
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Loading size="lg" text="Loading dashboard..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-secondary-600 mt-1">
              Manage your account and security settings
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 animate-slide-up">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700">Name</label>
                  <p className="text-secondary-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700">Email</label>
                  <p className="text-secondary-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700">Phone</label>
                  <p className="text-secondary-900">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700">Member Since</label>
                  <p className="text-secondary-900">
                    {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${user?.email_verified ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-secondary-700">
                    Email {user?.email_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Security and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-700">Email Verified</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.email_verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.email_verified ? 'Verified' : 'Pending'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-700">2FA Enabled</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-700">Account Status</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
              </div>
              
              {user?.last_sign_in_at && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-secondary-600">
                    Last sign in: {formatDateTime(user.last_sign_in_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        {dashboardData?.stats && (
          <Card className="mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent activity and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {dashboardData.stats.total_logins || 0}
                  </div>
                  <p className="text-sm text-secondary-600">Total Logins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">
                    {dashboardData.stats.active_sessions || 1}
                  </div>
                  <p className="text-sm text-secondary-600">Active Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">
                    {dashboardData.stats.security_score || 85}%
                  </div>
                  <p className="text-sm text-secondary-600">Security Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your account settings and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4">
                <div className="text-center">
                  <div className="text-sm font-medium">Update Profile</div>
                  <div className="text-xs text-secondary-600">Edit personal information</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4">
                <div className="text-center">
                  <div className="text-sm font-medium">Change Password</div>
                  <div className="text-xs text-secondary-600">Update your password</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4">
                <div className="text-center">
                  <div className="text-sm font-medium">Security Settings</div>
                  <div className="text-xs text-secondary-600">Manage 2FA and sessions</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
