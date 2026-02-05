
export const generateId = () =>
  Math.random().toString(36).substring(2, 15)

export const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}


const defaultPackages = [
  {
    id: '1',
    name: 'Starter Plan',
    description: 'Perfect for beginners looking to start their investment journey',
    minInvestment: 100,
    maxInvestment: 1000,
    dailyReturn: 0.5,
    duration: 30,
    totalReturn: 15,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Growth Plan',
    description: 'Ideal for investors seeking higher returns with moderate risk',
    minInvestment: 1000,
    maxInvestment: 10000,
    dailyReturn: 0.8,
    duration: 60,
    totalReturn: 48,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Premium Plan',
    description: 'For experienced investors maximizing their portfolio growth',
    minInvestment: 10000,
    maxInvestment: 100000,
    dailyReturn: 1.2,
    duration: 90,
    totalReturn: 108,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
]

const defaultAdmin = {
  id: 'admin-1',
  email: 'admin@financeapp.com',
  password: 'admin123',
  name: 'System Admin',
  phone: '+1234567890',
  role: 'admin',
  referralCode: 'ADMIN001',
  createdAt: new Date().toISOString(),
  kycStatus: 'verified',
}

const defaultSettings = {
  siteName: 'FinancePro',
  supportEmail: 'support@financepro.com',
  supportPhone: '+1-800-123-4567',
  minDeposit: 50,
  maxDeposit: 100000,
  minWithdrawal: 10,
  maxWithdrawal: 50000,
  referralBonus: 5,
  withdrawalFee: 2,
  maintenanceMode: false,
}

// setting operations

export const getSettings = () => {
  return getFromStorage('settings', defaultSettings)
}

export const updateSettings = (updates) => {
  const settings = getSettings()
  const updated = { ...settings, ...updates }
  setToStorage('settings', updated)
  return updated
}


/* =======================
   Storage helpers
======================= */

const getFromStorage = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue

  const stored = localStorage.getItem(key)
  if (!stored) return defaultValue

  try {
    return JSON.parse(stored)
  } catch {
    return defaultValue
  }
}

const setToStorage = (key, value) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

/* =======================
   Initialization
======================= */

export const initializeStorage = () => {
  const users = getFromStorage('users', [])
  if (users.length === 0) {
    setToStorage('users', [defaultAdmin])
  }

  const packages = getFromStorage('packages', [])
  if (packages.length === 0) {
    setToStorage('packages', defaultPackages)
  }

  const settings = getFromStorage('settings', null)
  if (!settings) {
    setToStorage('settings', defaultSettings)
  }
}

/* =======================
   User operations
======================= */

export const getUsers = () =>
  getFromStorage('users', [defaultAdmin])

export const getUserById = (id) =>
  getUsers().find(u => u.id === id)

export const getUserByEmail = (email) =>
  getUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase()
  )

export const createUser = (userData) => {
  const users = getUsers()

  const newUser = {
    ...userData,
    id: generateId(),
    referralCode: generateReferralCode(),
    createdAt: new Date().toISOString(),
    kycStatus: 'pending',
  }

  users.push(newUser)
  setToStorage('users', users)

  const wallets = getFromStorage('wallets', [])
  wallets.push({
    userId: newUser.id,
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalEarnings: 0,
    totalInvestments: 0,
  })

  setToStorage('wallets', wallets)
  return newUser
}

export const updateUser = (id, updates) => {
  const users = getUsers()
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return undefined

  users[index] = { ...users[index], ...updates }
  setToStorage('users', users)
  return users[index]
}

/* =======================
   Package operations
======================= */

export const getPackages = () =>
  getFromStorage('packages', defaultPackages)

export const getPackageById = (id) =>
  getPackages().find(p => p.id === id)

export const createPackage = (data) => {
  const packages = getPackages()

  const newPackage = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  packages.push(newPackage)
  setToStorage('packages', packages)
  return newPackage
}

export const updatePackage = (id, updates) => {
  const packages = getPackages()
  const index = packages.findIndex(p => p.id === id)
  if (index === -1) return undefined

  packages[index] = { ...packages[index], ...updates }
  setToStorage('packages', packages)
  return packages[index]
}

export const deletePackage = (id) => {
  const packages = getPackages()
  const filtered = packages.filter(p => p.id !== id)
  if (filtered.length === packages.length) return false
  setToStorage('packages', filtered)
  return true
}

/* =======================
   Wallet operations
======================= */

export const getWallet = (userId) => {
  const wallets = getFromStorage('wallets', [])
  return (
    wallets.find(w => w.userId === userId) || {
      userId,
      balance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalEarnings: 0,
      totalInvestments: 0,
    }
  )
}

export const updateWallet = (userId, updates) => {
  const wallets = getFromStorage('wallets', [])
  const index = wallets.findIndex(w => w.userId === userId)

  if (index >= 0) {
    wallets[index] = { ...wallets[index], ...updates }
  } else {
    wallets.push({
      userId,
      balance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalEarnings: 0,
      totalInvestments: 0,
      ...updates,
    })
  }

  setToStorage('wallets', wallets)
  return wallets[index >= 0 ? index : wallets.length - 1]
}

// investment operations
export const getInvestments = (userId) => {
  const investments = getFromStorage('investments', [])

  if (userId) {
    return investments.filter(i => i.userId === userId)
  }

  return investments
}


export const createInvestment = (data) => {
  const investments = getFromStorage('investments', [])

  const investment = {
    ...data,
    id: generateId(),
  }

  investments.push(investment)
  setToStorage('investments', investments)
  return investment
}



// Bank Operations

export const getBankDetails = (userId) => {
  const banks = getFromStorage('bankDetails', [])
  return banks.find(b => b.userId === userId)
}

export const getAllBankDetails = () => {
  return getFromStorage('bankDetails', [])
}

export const saveBankDetails = (details) => {
  const banks = getFromStorage('bankDetails', [])
  const existing = banks.findIndex(b => b.userId === details.userId)

  const bankDetail = {
    ...details,
    id: existing >= 0 ? banks[existing].id : generateId(),
    createdAt:
      existing >= 0
        ? banks[existing].createdAt
        : new Date().toISOString(),
    isVerified:
      existing >= 0
        ? banks[existing].isVerified
        : false,
  }

  if (existing >= 0) {
    banks[existing] = bankDetail
  } else {
    banks.push(bankDetail)
  }

  setToStorage('bankDetails', banks)
  return bankDetail
}

export const verifyBankDetails = (userId, verified) => {
  const banks = getFromStorage('bankDetails', [])
  const index = banks.findIndex(b => b.userId === userId)

  if (index === -1) return false

  banks[index].isVerified = verified
  setToStorage('bankDetails', banks)
  return true
}



// Referral operations
export const getReferrals = (userId) => {
  const users = getUsers()
  const user = users.find(u => u.id === userId)

  if (!user) return []

  return users.filter(
    u => u.referredBy === user.referralCode
  )
}

export const getUserByReferralCode = (code) => {
  const users = getUsers()

  return users.find(
    u => u.referralCode.toUpperCase() === code.toUpperCase()
  )
}


/* =======================
   Transactions
======================= */

export const getTransactions = (userId) => {
  const transactions = getFromStorage('transactions', [])

  const list = userId
    ? transactions.filter(t => t.userId === userId)
    : transactions

  return list.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export const createTransaction = (data) => {
  const transactions = getFromStorage('transactions', [])

  const transaction = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  transactions.push(transaction)
  setToStorage('transactions', transactions)
  return transaction
}

export const updateTransaction = (id, updates) => {
  const transactions = getFromStorage('transactions', [])
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) return undefined

  transactions[index] = { ...transactions[index], ...updates }
  setToStorage('transactions', transactions)
  return transactions[index]
}

/* =======================
   Notifications
======================= */

export const getNotifications = (userId) =>
  getFromStorage('notifications', [])
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

export const createNotification = (data) => {
  const notifications = getFromStorage('notifications', [])

  const notification = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    read: false,
  }

  notifications.push(notification)
  setToStorage('notifications', notifications)
  return notification
}

export const markNotificationRead = (id) => {
  const notifications = getFromStorage('notifications', [])
  const index = notifications.findIndex(n => n.id === id)
  if (index === -1) return false

  notifications[index].read = true
  setToStorage('notifications', notifications)
  return true
}

// Get full store object
export const getStore = () => {
  return {
    users: getFromStorage('users', [defaultAdmin]),
    packages: getFromStorage('packages', defaultPackages),
    transactions: getFromStorage('transactions', []),
    investments: getFromStorage('investments', []),
    notifications: getFromStorage('notifications', []),
    wallets: getFromStorage('wallets', []),
    bankDetails: getFromStorage('bankDetails', []),
    meetings: getFromStorage('meetings', []),
    settings: getFromStorage('settings', defaultSettings),
  }
}

// meetings operations
export const getMeetings = (userId) => {
  const meetings = getFromStorage('meetings', [])

  if (userId) {
    return meetings
      .filter(
        m => m.type === 'all' || m.targetUserId === userId
      )
      .sort(
        (a, b) =>
          new Date(b.scheduledAt) - new Date(a.scheduledAt)
      )
  }

  return meetings.sort(
    (a, b) =>
      new Date(b.scheduledAt) - new Date(a.scheduledAt)
  )
}

export const createMeeting = (data) => {
  const meetings = getFromStorage('meetings', [])

  const meeting = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  meetings.push(meeting)
  setToStorage('meetings', meetings)
  return meeting
}

export const updateMeeting = (id, updates) => {
  const meetings = getFromStorage('meetings', [])
  const index = meetings.findIndex(m => m.id === id)

  if (index === -1) return undefined

  meetings[index] = {
    ...meetings[index],
    ...updates,
  }

  setToStorage('meetings', meetings)
  return meetings[index]
}

export const deleteMeeting = (id) => {
  const meetings = getFromStorage('meetings', [])
  const filtered = meetings.filter(m => m.id !== id)

  if (filtered.length === meetings.length) return false

  setToStorage('meetings', filtered)
  return true
}

/* =======================
   Admin stats
======================= */

// Stats for admin
export const getAdminStats = () => {
  const users = getUsers().filter(u => u.role === 'user')
  const transactions = getTransactions()
  const investments = getInvestments()
  const wallets = getFromStorage('wallets', [])

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalInvestments = investments.reduce(
    (sum, i) => sum + i.amount,
    0
  )

  const pendingWithdrawals = transactions.filter(
    t => t.type === 'withdrawal' && t.status === 'pending'
  )

  const pendingKYC = users.filter(
    u => u.kycStatus === 'submitted'
  ).length

  return {
    totalUsers: users.length,
    totalDeposits,
    totalWithdrawals,
    totalInvestments,
    activeInvestments: investments.filter(
      i => i.status === 'active'
    ).length,
    pendingWithdrawals: pendingWithdrawals.length,
    pendingWithdrawalAmount: pendingWithdrawals.reduce(
      (sum, t) => sum + t.amount,
      0
    ),
    pendingKYC,
    totalBalance: wallets.reduce(
      (sum, w) => sum + w.balance,
      0
    ),
  }
}


