import React from "react"

import { useState } from 'react'
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout'
import { useAuth } from '../../../lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Lock,
  Eye,
  EyeOff,
  Download,
  FileText,
  IdCard,
} from '../../../components/icons'

export default function AdminProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const success = await updateProfile(formData)
    
    if (success) {
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      setIsEditing(false)
    } else {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    }
    
    setIsLoading(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setPasswordLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setPasswordLoading(false)
      return
    }

    if (user?.password !== passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is incorrect' })
      setPasswordLoading(false)
      return
    }

    const success = await updateProfile({ password: passwordData.newPassword })
    
    if (success) {
      setMessage({ type: 'success', text: 'Password changed successfully' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setMessage({ type: 'error', text: 'Failed to change password' })
    }
    
    setPasswordLoading(false)
  }

  const getKycStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        )
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning-foreground">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
            <Shield className="w-3 h-3" />
            Not Submitted
          </span>
        )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {message.text}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="welcome">Welcome Letter</TabsTrigger>
          </TabsList>

          {/* View Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={user?.email || ''} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
                        <p className="text-muted-foreground">Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{user?.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Member Since</p>
                          <p className="font-medium text-foreground">
                            {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">KYC Status</p>
                          {getKycStatusBadge(user?.kycStatus || 'pending')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referral Code Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Code</CardTitle>
                <CardDescription>Share this code with friends to earn referral bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-4 rounded-lg bg-muted font-mono text-lg font-bold text-center tracking-widest">
                    {user?.referralCode}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.referralCode || '')
                      setMessage({ type: 'success', text: 'Referral code copied!' })
                      setTimeout(() => setMessage(null), 2000)
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Password Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Identity Card Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Card</CardTitle>
                <CardDescription>Download your digital identity card</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  {/* Identity Card Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 mb-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                          <span className="font-bold">FP</span>
                        </div>
                        <span className="font-semibold">FinancePro</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                          <User className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-primary-foreground/70">Member Name</p>
                          <p className="font-semibold text-lg">{user?.name}</p>
                          <p className="text-xs text-primary-foreground/70 mt-2">Member ID</p>
                          <p className="font-mono text-sm">{user?.id?.slice(0, 12).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-primary-foreground/20 flex justify-between text-xs">
                        <div>
                          <p className="text-primary-foreground/70">Joined</p>
                          <p>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary-foreground/70">Referral Code</p>
                          <p className="font-mono">{user?.referralCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Download Identity Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Welcome Letter Tab */}
          <TabsContent value="welcome" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Letter</CardTitle>
                <CardDescription>Your official welcome letter from FinancePro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl">
                  <div className="bg-muted/50 rounded-lg p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">FP</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">FinancePro</h3>
                        <p className="text-xs text-muted-foreground">Investment Platform</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-foreground">
                      <p className="text-lg font-semibold">Dear {user?.name},</p>
                      
                      <p className="leading-relaxed">
                        Welcome to FinancePro! We are thrilled to have you as a member of our growing community of smart investors.
                      </p>
                      
                      <p className="leading-relaxed">
                        Your account has been successfully created on {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}. 
                        As a valued member, you now have access to our exclusive investment packages designed to help you 
                        grow your wealth securely and efficiently.
                      </p>
                      
                      <p className="leading-relaxed">
                        Here are some key features available to you:
                      </p>
                      
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Multiple investment plans with competitive daily returns</li>
                        <li>Secure wallet for deposits and withdrawals</li>
                        <li>Real-time portfolio tracking and analytics</li>
                        <li>Referral program with attractive bonuses</li>
                        <li>24/7 customer support</li>
                      </ul>
                      
                      <p className="leading-relaxed">
                        Your unique referral code is <span className="font-mono font-bold">{user?.referralCode}</span>. 
                        Share it with friends and family to earn referral bonuses when they join and invest.
                      </p>
                      
                      <p className="leading-relaxed">
                        If you have any questions or need assistance, please {"don't"} hesitate to reach out to our support team.
                      </p>
                      
                      <p className="leading-relaxed">
                        Best regards,<br />
                        <span className="font-semibold">The FinancePro Team</span>
                      </p>
                    </div>
                  </div>
                  
                  <Button className="mt-4 gap-2">
                    <FileText className="w-4 h-4" />
                    Download as PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
