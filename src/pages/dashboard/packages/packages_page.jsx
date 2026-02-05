import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout'
import { useAuth } from '../../../lib/auth-context'
import {
  getPackages,
  getWallet,
  createInvestment,
  createTransaction,
  updateWallet,
  createNotification,
} from '../../../lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import {
  Package as PackageIcon,
  TrendingUp,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle,
  Zap,
  Award,
  Target,
} from '../../../components/icons'

export default function PackagesPage() {
  const { user } = useAuth()
  const [packages, setPackages] = useState([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [investAmount, setInvestAmount] = useState('')
  const [isInvesting, setIsInvesting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const allPackages = getPackages().filter(p => p.status === 'active')
    setPackages(allPackages)
    
    if (user) {
      const wallet = getWallet(user.id)
      setWalletBalance(wallet.balance)
    }
  }, [user])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleInvest = async () => {
    if (!user || !selectedPackage) return

    const amount = parseFloat(investAmount)
    
    if (isNaN(amount) || amount < selectedPackage.minInvestment || amount > selectedPackage.maxInvestment) {
      return
    }

    if (amount > walletBalance) {
      return
    }

    setIsInvesting(true)

    // Calculate investment details
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + selectedPackage.duration)
    const dailyReturn = selectedPackage.dailyReturn

    // Create investment
    createInvestment({
      userId: user.id,
      packageId: selectedPackage.id,
      amount,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      totalEarned: 0,
      dailyReturn,
    })

    // Create transaction
    createTransaction({
      userId: user.id,
      type: 'investment',
      amount,
      status: 'completed',
      description: `Invested in ${selectedPackage.name}`,
    })

    // Update wallet
    const wallet = getWallet(user.id)
    updateWallet(user.id, {
      balance: wallet.balance - amount,
      totalInvestments: wallet.totalInvestments + amount,
    })

    // Create notification
    createNotification({
      userId: user.id,
      title: 'Investment Successful',
      message: `You have successfully invested ${formatCurrency(amount)} in ${selectedPackage.name}`,
      type: 'success',
    })

    setWalletBalance(wallet.balance - amount)
    setShowSuccess(true)
    setIsInvesting(false)
  }

  const closeDialogs = () => {
    setSelectedPackage(null)
    setInvestAmount('')
    setShowSuccess(false)
  }

  const getPackageIcon = (index) => {
    const icons = [Target, TrendingUp, Zap, Award]
    const Icon = icons[index % icons.length]
    return <Icon className="w-6 h-6" />
  }

  const getPackageColor = (index) => {
    const colors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4']
    return colors[index % colors.length]
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Investment Packages</h1>
          <p className="text-muted-foreground">
            Choose a package that fits your investment goals
          </p>
        </div>

        {/* Wallet balance banner */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-primary-foreground/80">Available Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(walletBalance)}</p>
              </div>
              <Button variant="secondary" asChild>
                <a href="/dashboard/wallet">Add Funds</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Packages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <Card key={pkg.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`absolute top-0 left-0 right-0 h-1 ${getPackageColor(index)}`} />
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${getPackageColor(index)}/10 flex items-center justify-center`}>
                    <div className={`${getPackageColor(index).replace('bg-', 'text-')}`}>
                      {getPackageIcon(index)}
                    </div>
                  </div>
                  {index === 2 && (
                    <span className="px-2 py-1 text-xs font-medium bg-chart-3/10 text-chart-3 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle className="mt-4">{pkg.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Investment Range</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(pkg.minInvestment)} - {formatCurrency(pkg.maxInvestment)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Daily Return</span>
                    <span className="font-medium text-success">{pkg.dailyReturn}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{pkg.duration} Days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="font-medium text-success">{pkg.totalReturn}%</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedPackage(pkg)}
                    disabled={walletBalance < pkg.minInvestment}
                  >
                    {walletBalance < pkg.minInvestment ? 'Insufficient Balance' : 'Invest Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Modal */}
        <Dialog open={!!selectedPackage && !showSuccess} onOpenChange={() => closeDialogs()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invest in {selectedPackage?.name}</DialogTitle>
              <DialogDescription>
                Enter the amount you want to invest in this package
              </DialogDescription>
            </DialogHeader>

            {selectedPackage && (
              <div className="space-y-6 py-4">
                {/* Package summary */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Return</span>
                    <span className="font-medium text-success">{selectedPackage.dailyReturn}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedPackage.duration} Days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="font-medium text-success">{selectedPackage.totalReturn}%</span>
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="pl-10"
                      min={selectedPackage.minInvestment}
                      max={Math.min(selectedPackage.maxInvestment, walletBalance)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Min: {formatCurrency(selectedPackage.minInvestment)} | Max: {formatCurrency(Math.min(selectedPackage.maxInvestment, walletBalance))} | Balance: {formatCurrency(walletBalance)}
                  </p>
                </div>

                {/* Estimated earnings */}
                {investAmount && !isNaN(parseFloat(investAmount)) && (
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm text-muted-foreground">Estimated Total Earnings</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(parseFloat(investAmount) * (selectedPackage.totalReturn / 100))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Daily: {formatCurrency(parseFloat(investAmount) * (selectedPackage.dailyReturn / 100))}
                    </p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={closeDialogs}>
                Cancel
              </Button>
              <Button
                onClick={handleInvest}
                disabled={
                  isInvesting ||
                  !investAmount ||
                  isNaN(parseFloat(investAmount)) ||
                  parseFloat(investAmount) < (selectedPackage?.minInvestment || 0) ||
                  parseFloat(investAmount) > Math.min(selectedPackage?.maxInvestment || 0, walletBalance)
                }
              >
                {isInvesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Investment'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={() => closeDialogs()}>
          <DialogContent className="text-center">
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <DialogTitle className="text-xl mb-2">Investment Successful!</DialogTitle>
              <DialogDescription>
                Your investment of {formatCurrency(parseFloat(investAmount || '0'))} in {selectedPackage?.name} has been confirmed.
              </DialogDescription>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button onClick={closeDialogs}>
                View My Investments
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
