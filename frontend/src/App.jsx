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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-avalanche-500 to-avalanche-600">
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
            <h1 className="mb-2 text-3xl font-bold text-white">
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
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            {/* Public Routes without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes with Layout */}
            {/* Public pages accessible to all users */}
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            <Route path="/transparency" element={
              <Layout>
                <TransparencyPortal />
              </Layout>
            } />
            <Route path="/disaster/:id" element={
              <Layout>
                <DisasterDetails />
              </Layout>
            } />
            <Route path="/proof-gallery" element={
              <Layout>
                <ProofGallery />
              </Layout>
            } />
            
            {/* Role-based Protected Routes */}
            
            {/* Admin Dashboard - Admin role required */}
            <Route 
              path="/admin" 
              element={
                <Layout>
                  <ProtectedRoute requiredRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Government Dashboard - Government role required */}
            <Route 
              path="/government" 
              element={
                <Layout>
                  <ProtectedRoute requiredRoles={['government']}>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Treasury Dashboard - Treasury role required */}
            <Route 
              path="/treasury" 
              element={
                <Layout>
                  <ProtectedRoute requiredRoles={['treasury']}>
                    <TreasuryDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Oracle Dashboard - Oracle role required */}
            <Route 
              path="/oracle" 
              element={
                <Layout>
                  <ProtectedRoute requiredRoles={['oracle']}>
                    <OracleDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Vendor Portal - Vendor role required */}
            <Route 
              path="/vendor" 
              element={
                <Layout>
                  <ProtectedRoute requiredRoles={['vendor']}>
                    <VendorPortal />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Victim Portal - Victim role required */}
            <Route 
              path="/victim" 
              element={
                <Layout>
                  <ProtectedRoute requiredRoles={['victim']}>
                    <VictimPortal />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Donor Dashboard - Donor role or authenticated user */}
            <Route 
              path="/donate" 
              element={
                <Layout>
                  <ProtectedRoute requireAuth={true}>
                    <DonorDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            
            {/* Dashboard redirect based on role */}
            <Route path="/dashboard" element={
              <Layout>
                <RoleBasedRouter />
              </Layout>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={
              <Layout>
                <div className="py-16 text-center">
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
                  <p className="mb-8 text-gray-600">Page not found</p>
                  <a href="/" className="btn-primary">
                    Return Home
                  </a>
                </div>
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
