import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token')
    if (token) {
      // Set the token in API headers
      api.defaults.headers.common['x-auth-token'] = token
      setUser({ token }) // You could also validate the token with the server
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Set token in API headers
      api.defaults.headers.common['x-auth-token'] = token
      
      setUser({ token })
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.msg || 'Login failed. Please try again.'
      }
    }
  }

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token')
    
    // Remove token from API headers
    delete api.defaults.headers.common['x-auth-token']
    
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}