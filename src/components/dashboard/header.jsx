import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { useAuth } from '../../lib/auth-context'
import { getNotifications } from '../../lib/store'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from '../../components/icons'

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      const notifications = getNotifications(user.id)
      setUnreadCount(notifications.filter(n => !n.read).length)
    }
  }, [user])

  const basePath = user?.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-accent lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title - hidden on mobile */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-foreground">
            {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link to={`${basePath}/notifications`}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  to={`${basePath}/profile`}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>

              {user?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link
                    to="/admin/settings"
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  logout()
                  window.location.href = '/login'
                }}
                className="text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
