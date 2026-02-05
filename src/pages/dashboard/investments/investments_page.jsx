import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout'
import { useAuth } from '../../../lib/auth-context'
import { getInvestments, getPackages} from '../../../lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Progress } from '../../../components/ui/progress'
import {
  Package as PackageIcon,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from '../../../components/icons'



export default function InvestmentsPage() {
  const { user } = useAuth()
  const [investments, setInvestments] = useState([])
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalEarned: 0,
    activeCount: 0,
    completedCount: 0,
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) {
      const userInvestments = getInvestments(user.id)
      const packages = getPackages()

      const investmentsWithDetails = userInvestments.map(inv => {
        const pkg = packages.find(p => p.id === inv.packageId)
        const startDate = new Date(inv.startDate)
        const endDate = new Date(inv.endDate)
        const now = new Date()
        
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100))
        const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

        return {
          ...inv,
          package: pkg,
          progress,
          daysRemaining,
        }
      })

      setInvestments(investmentsWithDetails)

      const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0)
      const totalEarned = userInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0)
      const activeCount = userInvestments.filter(inv => inv.status === 'active').length
      const completedCount = userInvestments.filter(inv => inv.status === 'completed').length

      setStats({ totalInvested, totalEarned, activeCount, completedCount })
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
      year: 'numeric',
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
            <Activity className="w-3 h-3" />
            Active
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-chart-1/10 text-chart-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        )
    }
  }

  const filteredInvestments = investments.filter(inv => {
    if (filter === 'all') return true
    if (filter === 'active') return inv.status === 'active'
    if (filter === 'completed') return inv.status === 'completed'
    return true
  })

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Investments</h1>
            <p className="text-muted-foreground">Track and manage your investment portfolio</p>
          </div>
          <Link to="/dashboard/packages">
            <Button>New Investment</Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalInvested)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Earned</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(stats.totalEarned)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Plans</p>
                  <p className="text-lg font-bold text-foreground">{stats.activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-lg font-bold text-foreground">{stats.completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({investments.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({stats.activeCount})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed ({stats.completedCount})
          </Button>
        </div>

        {/* Investments list */}
        {filteredInvestments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <PackageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No investments found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all'
                  ? "You haven't made any investments yet"
                  : `You have no ${filter} investments`}
              </p>
              <Link to="/dashboard/packages">
                <Button>Browse Packages</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left side - Package info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <PackageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {investment.package?.name || 'Unknown Package'}
                          </h3>
                          {getStatusBadge(investment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Invested: {formatCurrency(investment.amount)} | Daily Return: {investment.dailyReturn}%
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Started: {formatDate(investment.startDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ends: {formatDate(investment.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Progress and earnings */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
                      {/* Progress */}
                      <div className="w-full sm:w-48">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{Math.round(investment.progress)}%</span>
                        </div>
                        <Progress value={investment.progress} className="h-2" />
                        {investment.status === 'active' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {investment.daysRemaining} days remaining
                          </p>
                        )}
                      </div>

                      {/* Earnings */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Earned</p>
                        <p className="text-xl font-bold text-success">
                          {formatCurrency(investment.totalEarned)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
