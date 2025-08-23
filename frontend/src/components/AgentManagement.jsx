import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../services/api'
import { Plus, User, Mail, Phone, Eye, EyeOff } from 'lucide-react'

const AgentManagement = () => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddingAgent, setIsAddingAgent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  // Fetch all agents
  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/agents')
      setAgents(response.data)
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  // Add new agent
  const onSubmit = async (data) => {
    setIsAddingAgent(true)
    try {
      const response = await api.post('/agents', data)
      setAgents([...agents, response.data])
      toast.success('Agent added successfully!')
      reset()
      setShowPassword(false)
    } catch (error) {
      console.error('Error adding agent:', error)
      const errorMsg = error.response?.data?.msg || 
                      error.response?.data?.errors?.[0]?.msg || 
                      'Failed to add agent'
      toast.error(errorMsg)
    } finally {
      setIsAddingAgent(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Agent Management</h1>
        <div className="text-sm text-gray-500">
          Total Agents: {agents.length}
        </div>
      </div>

      {/* Add Agent Form */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add New Agent
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  className={`input-field pl-10 ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="Enter agent's full name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters long'
                    }
                  })}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="Enter email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="mobileNumber"
                  type="tel"
                  className={`input-field pl-10 ${errors.mobileNumber ? 'border-red-300' : ''}`}
                  placeholder="e.g., +1234567890"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[+]?[\d\s\-()]{10,}$/,
                      message: 'Please enter a valid mobile number with country code'
                    }
                  })}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pr-10 ${errors.password ? 'border-red-300' : ''}`}
                  placeholder="Enter password (min 6 characters)"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAddingAgent}
              className={`btn-primary ${isAddingAgent ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAddingAgent ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Agent...
                </>
              ) : (
                'Add Agent'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Agents List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Agents</h2>
        
        {agents.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No agents</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first agent.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent, index) => (
                  <tr key={agent._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {agent.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.mobileNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentManagement