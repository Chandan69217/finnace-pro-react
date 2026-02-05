import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAuth } from '../../lib/auth-context'
import styles from "./sidebar.module.css"
import {
  Home,
  User,
  Package,
  Wallet,
  Bell,
  Shield,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  X,
  Gift,
  Projector,
  ChartNoAxesCombined
} from '../../components/icons'

const userNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/packages', label: 'Packages', icon: Package },
  { to: '/dashboard/meetings', label: 'Meeting', icon: Projector },
  { to: '/dashboard/investments', label: 'My Investments', icon: BarChart3 },
  { to: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { to: '/dashboard/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/dashboard/referrals', label: 'Referrals', icon: Gift },
  { to: '/dashboard/kyc', label: 'KYC Verification', icon: Shield },
  { to: '/dashboard/reports', label: 'Reports', icon: ChartNoAxesCombined },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
]

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/meetings', label: 'Schedule Meeting', icon: Projector },
  { to: '/admin/packages', label: 'Manage Packages', icon: Package },
  { to: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/admin/withdrawals', label: 'Withdrawals', icon: Wallet },
  { to: '/admin/kyc', label: 'KYC Requests', icon: Shield },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r',
          'transform transition-transform duration-300',
          styles.noscrollbar,
          isOpen
            ? 'translate-x-0 pointer-events-auto'
            : '-translate-x-full pointer-events-none',
          'lg:translate-x-0 lg:pointer-events-auto'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
            <Link
              to={user?.role === 'admin' ? '/admin' : '/dashboard'}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  FP
                </span>
              </div>
              <span className="font-semibold text-sidebar-foreground">
                FinancePro
              </span>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={() => {
                logout()
                window.location.to = '/login'
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    
    </>
  )
}
