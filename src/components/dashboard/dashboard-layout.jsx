import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth-context'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Loader2 } from '../../components/icons'

export function DashboardLayout({ children, requiredRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login')
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard if role doesn't match
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, isLoading, navigate, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
