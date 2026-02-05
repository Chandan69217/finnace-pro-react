'use client'

import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { DashboardLayout } from '../../components/dashboard/dashboard-layout'
import { useAuth } from '../../lib/auth-context'
import { getWallet, getInvestments, getTransactions, getPackages, getReferrals,} from '../../lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Users,
  Activity,
  ChevronRight,
} from '../../components/icons'



export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    balance: 0,
    totalInvestments: 0,
    totalEarnings: 0,
    activeInvestments: 0,
    referrals: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [activeInvestments, setActiveInvestments] = useState([])

  useEffect(() => {
    if (user) {
      const wallet = getWallet(user.id)
      const investments = getInvestments(user.id)
      const transactions = getTransactions(user.id)
      const packages = getPackages()
      const referrals = getReferrals(user.id)

      setStats({
        balance: wallet.balance,
        totalInvestments: wallet.totalInvestments,
        totalEarnings: wallet.totalEarnings,
        activeInvestments: investments.filter(i => i.status === 'active').length,
        referrals: referrals.length,
      })

      setRecentTransactions(transactions.slice(0, 5))

      const activeInvs = investments
        .filter(i => i.status === 'active')
        .slice(0, 3)
        .map(inv => ({
          ...inv,
          packageName: packages.find(p => p.id === inv.packageId)?.name || 'Unknown Package',
        }))
      setActiveInvestments(activeInvs)
    }
  }, [user])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-success" />
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-destructive" />
      case 'earning':
        return <TrendingUp className="w-4 h-4 text-success" />
      case 'investment':
        return <Package className="w-4 h-4 text-primary" />
      case 'referral':
        return <Users className="w-4 h-4 text-chart-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        {/* Welcome message */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {"Here's an overview of your investment portfolio."}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.balance)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalInvestments)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeInvestments}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/dashboard/wallet">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
              <ArrowDownLeft className="w-5 h-5 text-success" />
              <span className="text-sm">Add Funds</span>
            </Button>
          </Link>
          <Link to="/dashboard/packages">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-sm">Invest Now</span>
            </Button>
          </Link>
          <Link to="/dashboard/wallet">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
              <ArrowUpRight className="w-5 h-5 text-chart-3" />
              <span className="text-sm">Withdraw</span>
            </Button>
          </Link>
          <Link to="/dashboard/referrals">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Users className="w-5 h-5 text-chart-4" />
              <span className="text-sm">Refer & Earn</span>
            </Button>
          </Link>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active investments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Active Investments</CardTitle>
                <CardDescription>Your ongoing investment plans</CardDescription>
              </div>
              <Link to="/dashboard/investments">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeInvestments.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No active investments</p>
                  <Link to="/dashboard/packages">
                    <Button size="sm" className="mt-3">
                      Start Investing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeInvestments.map((investment) => (
                    <div
                      key={investment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{investment.packageName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(investment.amount)} invested
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-success">
                          +{formatCurrency(investment.totalEarned)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {investment.dailyReturn}% daily
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </div>
              <Link to="/dashboard/transactions">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-medium ${
                          transaction.type === 'withdrawal' || transaction.type === 'investment'
                            ? 'text-destructive'
                            : 'text-success'
                        }`}
                      >
                        {transaction.type === 'withdrawal' || transaction.type === 'investment'
                          ? '-'
                          : '+'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Referral banner */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Refer Friends & Earn Rewards</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Share your referral code and earn bonus on every referral
                  </p>
                </div>
              </div>
              <Link to="/dashboard/referrals">
                <Button variant="secondary" className="shrink-0">
                  Get Referral Link
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
