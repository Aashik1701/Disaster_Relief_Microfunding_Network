import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MapPin,
  CreditCard,
  QrCode,
  User,
  Phone,
  Home,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Camera,
  Upload,
  Download,
  Star,
  Shield
} from 'lucide-react'
import { useWeb3Store } from '../store/web3Store'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const VictimPortal = () => {
  const { isConnected, account, userRole } = useWeb3Store()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [applications, setApplications] = useState([])
  
  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    familySize: '',
    disasterType: '',
    urgency: 'medium',
    description: '',
    documents: []
  })
  
  // Voucher request state
  const [voucherRequest, setVoucherRequest] = useState({
    category: 'food',
    amount: '',
    description: '',
    urgency: 'medium',
    vendor: ''
  })

  // Mock victim profile and data
  useEffect(() => {
    if (isConnected) {
      // Check if user is registered
      const isRegistered = localStorage.getItem(`victim_${account}`)
      
      if (isRegistered) {
        setProfile({
          fullName: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@email.com',
          address: '123 Relief Street, Austin, TX 78701',
          familySize: 4,
          registrationDate: '2024-08-01',
          verificationStatus: 'verified',
          totalAidReceived: 850.50,
          applications: 3,
          activeVouchers: 2
        })
        
        // Mock vouchers
        setVouchers([
          {
            id: 'VCH-2024-001',
            type: 'food',
            amount: 150.00,
            status: 'active',
            expiresAt: '2024-08-20',
            issuedAt: '2024-08-10',
            description: 'Emergency food assistance',
            qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0Y3RjhGQSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4='
          },
          {
            id: 'VCH-2024-002',
            type: 'medical',
            amount: 100.00,
            status: 'active',
            expiresAt: '2024-08-25',
            issuedAt: '2024-08-08',
            description: 'Medical supplies voucher',
            qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0Y3RjhGQSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4='
          },
          {
            id: 'VCH-2024-003',
            type: 'shelter',
            amount: 200.00,
            status: 'used',
            expiresAt: '2024-08-15',
            issuedAt: '2024-08-05',
            description: 'Emergency shelter assistance',
            usedAt: '2024-08-12',
            vendor: 'Relief Supply Co.'
          }
        ])
        
        // Mock applications
        setApplications([
          {
            id: 'APP-001',
            type: 'Emergency Food Assistance',
            status: 'approved',
            submittedAt: '2024-08-08',
            amount: 150.00,
            description: 'Family of 4 affected by flood damage'
          },
          {
            id: 'APP-002',
            type: 'Medical Support',
            status: 'approved',
            submittedAt: '2024-08-06',
            amount: 100.00,
            description: 'Medical supplies needed for elderly family member'
          },
          {
            id: 'APP-003',
            type: 'Housing Assistance',
            status: 'pending',
            submittedAt: '2024-08-10',
            amount: 300.00,
            description: 'Temporary housing due to home damage'
          }
        ])
      }
    }
  }, [isConnected, account])

  const handleRegistration = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save registration
      localStorage.setItem(`victim_${account}`, JSON.stringify(registrationData))
      
      // Create profile
      setProfile({
        ...registrationData,
        registrationDate: new Date().toISOString().split('T')[0],
        verificationStatus: 'pending',
        totalAidReceived: 0,
        applications: 0,
        activeVouchers: 0
      })
      
      setRegistrationData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        familySize: '',
        disasterType: '',
        urgency: 'medium',
        description: '',
        documents: []
      })
      
      setShowRegistrationModal(false)
      toast.success('Registration submitted successfully!')
      
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVoucherRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate voucher request
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newApplication = {
        id: `APP-${Date.now()}`,
        type: `${voucherRequest.category} assistance`,
        status: 'pending',
        submittedAt: new Date().toISOString().split('T')[0],
        amount: parseFloat(voucherRequest.amount),
        description: voucherRequest.description
      }
      
      setApplications(prev => [newApplication, ...prev])
      setVoucherRequest({
        category: 'food',
        amount: '',
        description: '',
        urgency: 'medium',
        vendor: ''
      })
      
      setShowVoucherModal(false)
      toast.success('Assistance request submitted!')
      
    } catch (error) {
      toast.error('Request submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Heart className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to access the victim portal.</p>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <User className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Registration Required</h2>
          <p className="text-gray-600 mb-6">You need to register to access assistance services.</p>
          <Button onClick={() => setShowRegistrationModal(true)} className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Register Now
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Victim Portal</h1>
              <p className="text-gray-600">Access disaster relief assistance and manage your aid</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowVoucherModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Request Assistance
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  {profile.fullName}
                  {profile.verificationStatus === 'verified' && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  )}
                  {profile.verificationStatus === 'pending' && (
                    <Clock className="w-5 h-5 text-yellow-500 ml-2" />
                  )}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.address}
                </p>
                <p className="text-sm text-gray-500">
                  Registered: {profile.registrationDate} | Family size: {profile.familySize}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile.applications}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">${profile.totalAidReceived.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Aid Received</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{profile.activeVouchers}</p>
                <p className="text-sm text-gray-600">Active Vouchers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Heart },
              { id: 'vouchers', label: 'My Vouchers', icon: CreditCard },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Assistance</h3>
                  <p className="text-gray-600 mb-4">Request immediate help for urgent needs</p>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => setShowVoucherModal(true)}
                  >
                    Request Now
                  </Button>
                </Card>
                
                <Card className="p-6 text-center">
                  <QrCode className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Vouchers</h3>
                  <p className="text-gray-600 mb-4">View and use your available vouchers</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('vouchers')}
                  >
                    View Vouchers
                  </Button>
                </Card>
                
                <Card className="p-6 text-center">
                  <FileText className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Status</h3>
                  <p className="text-gray-600 mb-4">Check your assistance application status</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('applications')}
                  >
                    Check Status
                  </Button>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Food assistance voucher approved</p>
                      <p className="text-sm text-gray-600">VCH-2024-001 • $150.00 • 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Medical supplies voucher used</p>
                      <p className="text-sm text-gray-600">VCH-2024-003 • $200.00 • Relief Supply Co. • 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">Housing assistance application pending</p>
                      <p className="text-sm text-gray-600">APP-003 • $300.00 • Under review</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'vouchers' && (
            <motion.div
              key="vouchers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vouchers.map(voucher => (
                  <Card key={voucher.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{voucher.id}</h3>
                        <p className="text-sm text-gray-600 capitalize">{voucher.type} assistance</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        voucher.status === 'active' ? 'bg-green-100 text-green-700' :
                        voucher.status === 'used' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {voucher.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">${voucher.amount}</p>
                      <p className="text-sm text-gray-600">{voucher.description}</p>
                    </div>
                    
                    {voucher.status === 'active' && voucher.qrCode && (
                      <div className="text-center mb-4">
                        <img 
                          src={voucher.qrCode} 
                          alt="QR Code"
                          className="w-24 h-24 mx-auto border rounded"
                        />
                        <p className="text-xs text-gray-500 mt-2">Show to vendor</p>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Issued: {voucher.issuedAt}</p>
                      {voucher.status === 'active' && (
                        <p>Expires: {voucher.expiresAt}</p>
                      )}
                      {voucher.status === 'used' && (
                        <>
                          <p>Used: {voucher.usedAt}</p>
                          <p>Vendor: {voucher.vendor}</p>
                        </>
                      )}
                    </div>
                    
                    {voucher.status === 'active' && (
                      <div className="mt-4 space-y-2">
                        <Button size="sm" className="w-full">
                          <QrCode className="w-4 h-4 mr-2" />
                          Show QR Code
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Assistance Applications</h3>
                  <Button onClick={() => setShowVoucherModal(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {applications.map(application => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{application.id}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              application.status === 'approved' ? 'bg-green-100 text-green-700' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{application.type}</p>
                          <p className="text-sm text-gray-500 mt-1">{application.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">${application.amount}</p>
                          <p className="text-sm text-gray-600">Submitted: {application.submittedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900">{profile.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Size</label>
                    <p className="text-gray-900">{profile.familySize} members</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900">{profile.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <p className="text-gray-900">{profile.registrationDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                    <div className="flex items-center">
                      <p className="text-gray-900 capitalize">{profile.verificationStatus}</p>
                      {profile.verificationStatus === 'verified' && (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                      )}
                      {profile.verificationStatus === 'pending' && (
                        <Clock className="w-4 h-4 text-yellow-500 ml-2" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Modal */}
        <Modal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          title="Victim Registration"
          size="lg"
        >
          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Size *
                </label>
                <input
                  type="number"
                  min="1"
                  value={registrationData.familySize}
                  onChange={(e) => setRegistrationData({ ...registrationData, familySize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Address *
              </label>
              <textarea
                value={registrationData.address}
                onChange={(e) => setRegistrationData({ ...registrationData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disaster Type *
                </label>
                <select
                  value={registrationData.disasterType}
                  onChange={(e) => setRegistrationData({ ...registrationData, disasterType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select disaster type</option>
                  <option value="flood">Flood</option>
                  <option value="hurricane">Hurricane</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="fire">Fire</option>
                  <option value="tornado">Tornado</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={registrationData.urgency}
                  onChange={(e) => setRegistrationData({ ...registrationData, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Situation Description *
              </label>
              <textarea
                value={registrationData.description}
                onChange={(e) => setRegistrationData({ ...registrationData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Please describe your current situation and immediate needs..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload ID, proof of address, or damage photos</p>
                <input type="file" multiple accept="image/*,.pdf" className="hidden" />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Registration'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Voucher Request Modal */}
        <Modal
          isOpen={showVoucherModal}
          onClose={() => setShowVoucherModal(false)}
          title="Request Assistance"
        >
          <form onSubmit={handleVoucherRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assistance Category
              </label>
              <select
                value={voucherRequest.category}
                onChange={(e) => setVoucherRequest({ ...voucherRequest, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="food">Food & Water</option>
                <option value="medical">Medical Supplies</option>
                <option value="shelter">Shelter & Clothing</option>
                <option value="transportation">Transportation</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={voucherRequest.amount}
                onChange={(e) => setVoucherRequest({ ...voucherRequest, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                value={voucherRequest.urgency}
                onChange={(e) => setVoucherRequest({ ...voucherRequest, urgency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description of Need
              </label>
              <textarea
                value={voucherRequest.description}
                onChange={(e) => setVoucherRequest({ ...voucherRequest, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Please describe what you need and why..."
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowVoucherModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default VictimPortal
