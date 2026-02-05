import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout'
import { useAuth } from '../../../lib/auth-context'
import {
  getWallet,
  getBankDetails,
  saveBankDetails,
  createTransaction,
  updateWallet,
  createNotification,
} from '../../../lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  DollarSign,
  Loader2,
  CheckCircle,
  CreditCard,
  Edit,
} from '../../../components/icons'

export default function WalletPage() {
  const { user } = useAuth()
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalEarnings: 0,
  })
  const [bankDetails, setBankDetails] = useState(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    ifscCode: '',
  })

  useEffect(() => {
    if (user) {
      refreshData()
    }
  }, [user])

  const refreshData = () => {
    if (!user) return
    const wallet = getWallet(user.id)
    setWalletData(wallet)
    
    const bank = getBankDetails(user.id)
    if (bank) {
      setBankDetails(bank)
      setBankForm({
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountHolder: bank.accountHolder,
        ifscCode: bank.ifscCode,
      })
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleDeposit = async () => {
    if (!user || !amount) return
    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) return

    setIsProcessing(true)

    // Create deposit transaction
    createTransaction({
      userId: user.id,
      type: 'deposit',
      amount: depositAmount,
      status: 'completed',
      description: 'Wallet deposit',
    })

    // Update wallet
    const wallet = getWallet(user.id)
    updateWallet(user.id, {
      balance: wallet.balance + depositAmount,
      totalDeposits: wallet.totalDeposits + depositAmount,
    })

    // Create notification
    createNotification({
      userId: user.id,
      title: 'Deposit Successful',
      message: `${formatCurrency(depositAmount)} has been added to your wallet`,
      type: 'success',
    })

    setIsProcessing(false)
    setShowDepositModal(false)
    setAmount('')
    setSuccessMessage(`${formatCurrency(depositAmount)} has been deposited successfully!`)
    setShowSuccess(true)
    refreshData()
  }

  const handleWithdraw = async () => {
    if (!user || !amount) return
    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0 || withdrawAmount > walletData.balance) return

    if (!bankDetails) {
      setShowWithdrawModal(false)
      setShowBankModal(true)
      return
    }

    setIsProcessing(true)

    // Create withdrawal transaction (pending for admin approval)
    createTransaction({
      userId: user.id,
      type: 'withdrawal',
      amount: withdrawAmount,
      status: 'pending',
      description: 'Wallet withdrawal request',
    })

    // Create notification
    createNotification({
      userId: user.id,
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal request for ${formatCurrency(withdrawAmount)} is pending approval`,
      type: 'info',
    })

    setIsProcessing(false)
    setShowWithdrawModal(false)
    setAmount('')
    setSuccessMessage('Withdrawal request submitted. It will be processed within 24-48 hours.')
    setShowSuccess(true)
    refreshData()
  }

  const handleSaveBankDetails = async () => {
    if (!user) return
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolder || !bankForm.ifscCode) return

    setIsProcessing(true)

    const savedBank = saveBankDetails({
      userId: user.id,
      ...bankForm,
    })

    setBankDetails(savedBank)

    createNotification({
      userId: user.id,
      title: 'Bank Details Updated',
      message: 'Your bank details have been saved successfully',
      type: 'success',
    })

    setIsProcessing(false)
    setShowBankModal(false)
    setSuccessMessage('Bank details saved successfully!')
    setShowSuccess(true)
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and bank details</p>
        </div>

        {/* Wallet balance card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/80">Available Balance</p>
                  <p className="text-4xl font-bold">{formatCurrency(walletData.balance)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setShowDepositModal(true)}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  Add Money
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  onClick={() => setShowWithdrawModal(true)}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Deposits</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(walletData.totalDeposits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Withdrawals</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(walletData.totalWithdrawals)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(walletData.totalEarnings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Your linked bank account for withdrawals</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => setShowBankModal(true)}>
              <Edit className="w-4 h-4" />
              {bankDetails ? 'Edit' : 'Add'}
            </Button>
          </CardHeader>
          <CardContent>
            {bankDetails ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bank Name</p>
                    <p className="font-medium text-foreground">{bankDetails.bankName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-medium text-foreground font-mono">
                      {'****' + bankDetails.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Holder</p>
                    <p className="font-medium text-foreground">{bankDetails.accountHolder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">IFSC/Routing Code</p>
                    <p className="font-medium text-foreground font-mono">{bankDetails.ifscCode}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-4">No bank details added yet</p>
                <Button onClick={() => setShowBankModal(true)}>Add Bank Details</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deposit Modal */}
        <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>Enter the amount you want to deposit</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="depositAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>
              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(amt.toString())}
                  >
                    ${amt}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDepositModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Deposit'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Modal */}
        <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you want to withdraw. Min: $10, Max: {formatCurrency(walletData.balance)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    min="10"
                    max={walletData.balance}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: {formatCurrency(walletData.balance)}
                </p>
              </div>
              {!bankDetails && (
                <div className="p-4 rounded-lg bg-warning/10 text-warning-foreground text-sm">
                  Please add your bank details before withdrawing
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={
                  isProcessing ||
                  !amount ||
                  parseFloat(amount) < 10 ||
                  parseFloat(amount) > walletData.balance
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Request Withdrawal'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bank Details Modal */}
        <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{bankDetails ? 'Edit' : 'Add'} Bank Details</DialogTitle>
              <DialogDescription>
                Enter your bank account details for withdrawals
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input
                  id="accountHolder"
                  placeholder="Enter account holder name"
                  value={bankForm.accountHolder}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC/Routing Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="Enter IFSC or routing code"
                  value={bankForm.ifscCode}
                  onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBankModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveBankDetails}
                disabled={
                  isProcessing ||
                  !bankForm.bankName ||
                  !bankForm.accountNumber ||
                  !bankForm.accountHolder ||
                  !bankForm.ifscCode
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Details'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="text-center">
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <DialogTitle className="text-xl mb-2">Success!</DialogTitle>
              <DialogDescription>{successMessage}</DialogDescription>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button onClick={() => setShowSuccess(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
