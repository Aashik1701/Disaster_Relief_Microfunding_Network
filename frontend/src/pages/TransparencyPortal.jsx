import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Activity,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Search,
  Download,
  ExternalLink
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import RealTimeStats from '../components/Charts/RealTimeStats'
import DonationChart from '../components/Charts/DonationChart'
import ImpactMetrics from '../components/Charts/ImpactMetrics'
import GeographicDistribution from '../components/Charts/GeographicDistribution'

const TransparencyPortal = () => {
  const [activeView, setActiveView] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    loadTransparencyData()
  }, [])

  const loadTransparencyData = async () => {
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock transaction data
    const mockTransactions = [
      {
        id: '1',
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        type: 'donation',
        amount: 1500,
        from: '0x742d35Cc6634C0532925a3b8D',
        to: 'Turkey Earthquake Relief',
        timestamp: new Date(Date.now() - 120000),
        status: 'confirmed',
        block: 15234567
      },
      {
        id: '2',
        hash: '0x2345678901bcdef12345678901cdef1234567890',
        type: 'distribution',
        amount: 750,
        from: 'Emergency Relief Fund',
        to: 'Local Food Bank',
        timestamp: new Date(Date.now() - 300000),
        status: 'confirmed',
        block: 15234560
      }
    ]
    
    setTransactions(mockTransactions)
    setLoading(false)
  }

  const views = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'transactions', name: 'Transactions', icon: Activity },
    { id: 'impact', name: 'Impact', icon: Users },
    { id: 'geographic', name: 'Geographic', icon: MapPin }
  ]

  const ViewButton = ({ view, active, onClick }) => {
    const Icon = view.icon
    return (
      <button
        onClick={() => onClick(view.id)}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          active
            ? 'bg-green-500 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        {view.name}
      </button>
    )
  }

  const TransactionRow = ({ transaction }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
    >
      <div className="font-mono text-sm text-blue-600 truncate">
        <a 
          href={`https://snowtrace.io/tx/${transaction.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:underline"
        >
          {transaction.hash.substring(0, 12)}...
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </div>
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        transaction.type === 'donation' 
          ? 'bg-green-100 text-green-800'
          : transaction.type === 'distribution'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-purple-100 text-purple-800'
      }`}>
        {transaction.type}
      </div>
      <div className="font-medium">${transaction.amount.toLocaleString()}</div>
      <div className="text-sm text-gray-600 truncate">{transaction.from}</div>
      <div className="text-sm text-gray-600 truncate">{transaction.to}</div>
      <div className="text-sm text-gray-500">
        {transaction.timestamp.toLocaleTimeString()}
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Loading transparency data..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  Transparency Portal
                </h1>
                <p className="text-gray-600">
                  Complete transparency of all donations and relief fund distribution
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Updates</span>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto">
              {views.map((view) => (
                <ViewButton
                  key={view.id}
                  view={view}
                  active={activeView === view.id}
                  onClick={setActiveView}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === 'overview' && (
                <div className="space-y-8">
                  <RealTimeStats />
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">$2.5M</div>
                          <div className="text-sm text-gray-600">Total Donations</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">45,230</div>
                          <div className="text-sm text-gray-600">Beneficiaries</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Activity className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">12,547</div>
                          <div className="text-sm text-gray-600">Transactions</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">98.7%</div>
                          <div className="text-sm text-gray-600">Efficiency</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeView === 'analytics' && (
                <div className="space-y-8">
                  <DonationChart />
                  <RealTimeStats />
                </div>
              )}

              {activeView === 'transactions' && (
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Transaction History
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                          <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="all">All Types</option>
                          <option value="donation">Donations</option>
                          <option value="distribution">Distributions</option>
                          <option value="verification">Verifications</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Transaction Table Header */}
                    <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-gray-600 border-b bg-gray-50">
                      <div>Transaction Hash</div>
                      <div>Type</div>
                      <div>Amount</div>
                      <div>From</div>
                      <div>To</div>
                      <div>Time</div>
                    </div>
                    
                    {/* Transaction Rows */}
                    <div className="overflow-y-auto max-h-96">
                      {transactions.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {activeView === 'impact' && (
                <ImpactMetrics />
              )}

              {activeView === 'geographic' && (
                <GeographicDistribution />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  )
}

export default TransparencyPortal
