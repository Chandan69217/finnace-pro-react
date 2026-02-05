import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout'
import { useAuth } from '../../../lib/auth-context'
import { getReferrals } from '../../../lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  Users,
  Copy,
  Share2,
  Gift,
  User as UserIcon,
  Calendar,
  CheckCircle,
} from '../../../components/icons'

export default function ReferralsPage() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user) {
      const userReferrals = getReferrals(user.id)
      setReferrals(userReferrals)
    }
  }, [user])

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${user?.referralCode}` 
    : ''

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join FinancePro',
        text: `Join FinancePro using my referral code ${user?.referralCode} and start investing today!`,
        url: referralLink,
      })
    } else {
      handleCopyLink()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Referral Program</h1>
          <p className="text-muted-foreground">
            Invite friends and earn rewards when they join and invest
          </p>
        </div>

        {/* Referral stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-3xl font-bold text-foreground">{referrals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Referrals</p>
                  <p className="text-3xl font-bold text-foreground">
                    {referrals.filter(r => r.kycStatus === 'verified').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Referral Earnings</p>
                  <p className="text-3xl font-bold text-success">$0.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral code card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Referral Code</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Share this code with friends to earn rewards
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-4 rounded-lg bg-primary-foreground/20 font-mono text-2xl font-bold text-center tracking-widest">
                    {user?.referralCode}
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={handleCopyCode}
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Referral Link</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Or share this link directly
                </p>
                <div className="flex items-center gap-3">
                  <Input
                    value={referralLink}
                    readOnly
                    className="bg-primary-foreground/20 border-0 text-primary-foreground placeholder:text-primary-foreground/60"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Simple steps to earn referral rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">1. Share Your Code</h4>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral code or link with friends and family
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-chart-2" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">2. Friends Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  When they register using your code, they become your referral
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-success" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">3. Earn Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Earn commission when your referrals make investments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals list */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>People who joined using your referral code</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No referrals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start sharing your referral code to invite friends
                </p>
                <Button onClick={handleShare}>Share Referral Link</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{referral.name}</p>
                              <p className="text-xs text-muted-foreground">{referral.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(referral.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              referral.kycStatus === 'verified'
                                ? 'bg-success/10 text-success'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {referral.kycStatus === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
