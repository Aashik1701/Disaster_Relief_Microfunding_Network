import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import WalletDebugger from './components/Web3/WalletDebugger'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { useWeb3Store } from './store/web3Store'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const GovernmentDashboard = lazy(() => import('./pages/GovernmentDashboard'))
const TreasuryDashboard = lazy(() => import('./pages/TreasuryDashboard'))
const OracleDashboard = lazy(() => import('./pages/OracleDashboard'))
const VictimPortal = lazy(() => import('./pages/VictimPortal'))
const VendorPortal = lazy(() => import('./pages/VendorPortal'))
const TransparencyPortal = lazy(() => import('./pages/TransparencyPortal'))
const DisasterDetails = lazy(() => import('./pages/DisasterDetails'))
const ProofGallery = lazy(() => import('./pages/ProofGallery'))

// Import role-based router
const RoleBasedRouter = lazy(() => import('./components/Auth/RoleBasedRouter'))

function App() {
  const { isInitialized, initialize } = useWeb3Store()

  useEffect(() => {
    console.log('App component mounted, calling initialize...')
    initialize()
  }, [initialize])

  console.log('App render - isInitialized:', isInitialized)

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-avalanche-500 to-avalanche-600">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-8">
            <img 
              src="/avalanche-logo.png" 
              alt="Avalanche Logo" 
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-white mb-2">
              Disaster Relief Network
            </h1>
            <p className="text-avalanche-100">
              Initializing blockchain connection...
            </p>
          </div>
          <LoadingSpinner size="lg" color="white" />
        </motion.div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Suspense 
          fallback={
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  {/* Public pages accessible to all users */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/transparency" element={<TransparencyPortal />} />
                  <Route path="/disaster/:id" element={<DisasterDetails />} />
                  <Route path="/proof-gallery" element={<ProofGallery />} />
                  
                  {/* Role-based Protected Routes */}
                  
                  {/* Admin Dashboard - Admin role required */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Government Dashboard - Government role required */}
                  <Route 
                    path="/government" 
                    element={
                      <ProtectedRoute requiredRoles={['government']}>
                        <GovernmentDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Treasury Dashboard - Treasury role required */}
                  <Route 
                    path="/treasury" 
                    element={
                      <ProtectedRoute requiredRoles={['treasury']}>
                        <TreasuryDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Oracle Dashboard - Oracle role required */}
                  <Route 
                    path="/oracle" 
                    element={
                      <ProtectedRoute requiredRoles={['oracle']}>
                        <OracleDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Vendor Portal - Vendor role required */}
                  <Route 
                    path="/vendor" 
                    element={
                      <ProtectedRoute requiredRoles={['vendor']}>
                        <VendorPortal />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Victim Portal - Victim role required */}
                  <Route 
                    path="/victim" 
                    element={
                      <ProtectedRoute requiredRoles={['victim']}>
                        <VictimPortal />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Donor Dashboard - Donor role or authenticated user */}
                  <Route 
                    path="/donate" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <DonorDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Dashboard redirect based on role */}
                  <Route path="/dashboard" element={<RoleBasedRouter />} />
                  
                  {/* 404 Page */}
                  <Route path="*" element={
                    <div className="text-center py-16">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <a href="/" className="btn-primary">
                        Return Home
                      </a>
                    </div>
                  } />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Suspense>
        
        {/* Development Debug Tools */}
        <WalletDebugger />
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4ade80',
                secondary: '#166534',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ef4444',
                secondary: '#991b1b',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App
