import React from "react"
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import { useAuth } from '../../lib/auth-context'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Eye, EyeOff, Loader2, Mail, Lock } from '../../components/icons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error || 'Login failed')
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-bold text-primary-foreground">FinancePro</span>
          </Link>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight text-balance">
            Grow Your Wealth with Smart Investments
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Join thousands of investors who trust FinancePro to manage and grow their investments securely.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">10K+</p>
              <p className="text-sm text-primary-foreground/70">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">$50M+</p>
              <p className="text-sm text-primary-foreground/70">Invested</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">99.9%</p>
              <p className="text-sm text-primary-foreground/70">Uptime</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-primary-foreground/60">
          Secure, reliable, and trusted by investors worldwide.
        </p>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">FP</span>
              </div>
              <span className="text-xl font-bold text-foreground">FinancePro</span>
            </Link>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{"Don't have an account?"} </span>
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </div>
              
              {/* Demo credentials */}
              {/* <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
                <div className="text-xs space-y-1">
                  <p><span className="text-muted-foreground">Admin:</span> admin@financeapp.com / admin123</p>
                </div>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )


}
