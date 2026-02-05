import { createContext, useContext, useState, useEffect } from 'react'
import {
  getUserByEmail,
  createUser,
  updateUser,
  initializeStorage,
} from './store'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeStorage()

    // Check for existing session
    const storedUserId = localStorage.getItem('currentUserId')
    if (storedUserId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const currentUser = users.find((u) => u.id === storedUserId)
      if (currentUser) {
        setUser(currentUser)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    const foundUser = getUserByEmail(email)

    if (!foundUser) {
      return { success: false, error: 'User not found' }
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid password' }
    }

    setUser(foundUser)
    localStorage.setItem('currentUserId', foundUser.id)

    return { success: true }
  }

  const register = async (data) => {
    const existingUser = getUserByEmail(data.email)

    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    // Validate referral code if provided
    let referredBy
    if (data.referralCode) {
      const referrer = JSON.parse(localStorage.getItem('users') || '[]').find(
        (u) =>
          u.referralCode?.toUpperCase() ===
          data.referralCode.toUpperCase()
      )

      if (!referrer) {
        return { success: false, error: 'Invalid referral code' }
      }

      referredBy = data.referralCode.toUpperCase()
    }

    const newUser = createUser({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: 'user',
      referredBy,
    })

    setUser(newUser)
    localStorage.setItem('currentUserId', newUser.id)

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUserId')
  }

  const updateProfile = async (updates) => {
    if (!user) return false

    const updatedUser = updateUser(user.id, updates)
    if (updatedUser) {
      setUser(updatedUser)
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
