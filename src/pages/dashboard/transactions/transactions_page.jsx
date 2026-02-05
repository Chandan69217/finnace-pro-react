import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout'
import { useAuth } from '../../../lib/auth-context'
import { getTransactions, } from '../../../lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Package,
  Users,
  Activity,
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
} from '../../../components/icons'

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (user) {
      const userTransactions = getTransactions(user.id)
      setTransactions(userTransactions)
      setFilteredTransactions(userTransactions)
    }
  }, [user])

  useEffect(() => {
    let filtered = transactions

    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, typeFilter, statusFilter, searchTerm])

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning-foreground">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
            <XCircle className="w-3 h-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
    }
  }

  const stats = {
    totalDeposits: transactions
      .filter((t) => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalEarnings: transactions
      .filter((t) => t.type === 'earning' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.length,
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
            <p className="text-muted-foreground">View all your account transactions</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Deposits</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalDeposits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Withdrawals</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalWithdrawals)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(stats.totalEarnings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Transactions</p>
                  <p className="text-lg font-bold text-foreground">{stats.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="investment">Investments</SelectItem>
                  <SelectItem value="earning">Earnings</SelectItem>
                  <SelectItem value="referral">Referrals</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions table */}
        <Card>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  {transactions.length === 0
                    ? "You haven't made any transactions yet"
                    : 'No transactions match your filters'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <span className="capitalize font-medium">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <span
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
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(transaction.createdAt)}
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
