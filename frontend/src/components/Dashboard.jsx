import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AgentManagement from './AgentManagement'
import ListUpload from './ListUpload'
import AgentLists from './AgentLists'
import { Users, Upload, List, LogOut, Menu, X } from 'lucide-react'

const Dashboard = () => {
  const { logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
  }

  const navigation = [
    { name: 'Agents', href: '/dashboard/agents', icon: Users, current: location.pathname === '/dashboard/agents' },
    { name: 'Upload Lists', href: '/dashboard/upload', icon: Upload, current: location.pathname === '/dashboard/upload' },
    { name: 'Agent Lists', href: '/dashboard/lists', icon: List, current: location.pathname === '/dashboard/lists' },
  ]

  const NavLink = ({ item }) => (
    <Link
      to={item.href}
      className={`${
        item.current
          ? 'bg-blue-700 text-white'
          : 'text-blue-100 hover:bg-blue-600 hover:text-white'
      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
    >
      <item.icon
        className={`${
          item.current ? 'text-white' : 'text-blue-200 group-hover:text-white'
        } mr-3 flex-shrink-0 h-5 w-5`}
      />
      {item.name}
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-blue-800 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-white text-lg font-semibold">Admin Panel</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-blue-700 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-blue-100 hover:text-white group transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-blue-200 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-blue-700 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-blue-100 hover:text-white group transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-blue-200 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/agents" element={<AgentManagement />} />
                <Route path="/upload" element={<ListUpload />} />
                <Route path="/lists" element={<AgentLists />} />
                <Route path="/" element={<DashboardHome />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Dashboard home component
const DashboardHome = () => (
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link to="/dashboard/agents" className="card hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600 mr-4" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Manage Agents</h3>
            <p className="text-gray-600">Create and manage your agents</p>
          </div>
        </div>
      </Link>
      
      <Link to="/dashboard/upload" className="card hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center">
          <Upload className="h-8 w-8 text-green-600 mr-4" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upload Lists</h3>
            <p className="text-gray-600">Upload and distribute CSV files</p>
          </div>
        </div>
      </Link>
      
      <Link to="/dashboard/lists" className="card hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center">
          <List className="h-8 w-8 text-purple-600 mr-4" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">View Lists</h3>
            <p className="text-gray-600">View distributed agent lists</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
)