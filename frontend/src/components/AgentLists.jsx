import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { List, User, Phone, FileText, Calendar, Search, Filter, ChevronDown, ChevronRight } from 'lucide-react'

const AgentLists = () => {
  const [agentLists, setAgentLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('')
  const [expandedAgents, setExpandedAgents] = useState({})

  // Fetch agent lists
  const fetchAgentLists = async () => {
    try {
      setLoading(true)
      const response = await api.get('/lists')
      setAgentLists(response.data)
    } catch (error) {
      console.error('Error fetching agent lists:', error)
      toast.error('Failed to fetch agent lists')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgentLists()
  }, [])

  // Toggle agent expansion
  const toggleAgentExpansion = (agentId) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }))
  }

  // Filter lists based on search term and selected agent
  const filteredLists = agentLists.filter(list => {
    const matchesSearch = searchTerm === '' || 
      list.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.items.some(item => 
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesAgent = selectedAgent === '' || list.agentId === selectedAgent
    
    return matchesSearch && matchesAgent
  })

  // Get unique agents for filter dropdown
  const uniqueAgents = agentLists.reduce((acc, list) => {
    if (!acc.find(agent => agent.id === list.agentId)) {
      acc.push({ id: list.agentId, name: list.agentName })
    }
    return acc
  }, [])

  // Calculate total statistics
  const totalStats = agentLists.reduce((acc, list) => {
    acc.totalAgents = uniqueAgents.length
    acc.totalItems += list.items.length
    return acc
  }, { totalAgents: 0, totalItems: 0 })

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
        <h1 className="text-2xl font-semibold text-gray-900">Agent Lists</h1>
        <div className="text-sm text-gray-500">
          {totalStats.totalAgents} Agents • {totalStats.totalItems} Total Items
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalStats.totalAgents}</div>
              <div className="text-sm text-gray-500">Active Agents</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <List className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalStats.totalItems}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalStats.totalAgents > 0 ? Math.ceil(totalStats.totalItems / totalStats.totalAgents) : 0}
              </div>
              <div className="text-sm text-gray-500">Avg Items per Agent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by agent name, first name, phone, or notes..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="input-field pl-10"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">All Agents</option>
                {uniqueAgents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Lists */}
      {filteredLists.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <List className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No lists found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {agentLists.length === 0 
                ? 'No lists have been uploaded yet. Upload a CSV file to get started.'
                : 'No lists match your current search criteria.'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLists.map((list) => (
            <div key={list._id} className="card">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleAgentExpansion(list._id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{list.agentName}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Uploaded on {new Date(list.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {list.items.length} items
                    </div>
                    <div className="text-xs text-gray-500">assigned</div>
                  </div>
                  {expandedAgents[list._id] ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Items */}
              {expandedAgents[list._id] && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Assigned Items ({list.items.length})
                  </h4>
                  
                  {list.items.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No items assigned to this agent.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              First Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {list.items.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.firstName}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                  {item.phone}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {item.notes || (
                                    <span className="text-gray-400 italic">No notes</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchAgentLists}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Refreshing...
            </>
          ) : (
            'Refresh Lists'
          )}
        </button>
      </div>
    </div>
  )
}

export default AgentLists