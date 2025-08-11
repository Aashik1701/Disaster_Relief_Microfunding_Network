import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import WalletDebugger from './components/Web3/WalletDebugger'
import { AuthProvider } from './contexts/AuthContext'
import { useWeb3Store } from './store/web3Store'

// Public pages
const HomePage = lazy(() => import('./pages/HomePage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const TransparencyPortal = lazy(() => import('./pages/TransparencyPortal'))
const DisasterDetails = lazy(() => import('./pages/DisasterDetails'))
const ProofGallery = lazy(() => import('./pages/ProofGallery'))
const APITestPage = lazy(() => import('./pages/APITestPage'))

// Role-based route groups
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'))
const VendorRoutes = lazy(() => import('./routes/VendorRoutes'))
const VictimRoutes = lazy(() => import('./routes/VictimRoutes'))
const DonorRoutes = lazy(() => import('./routes/DonorRoutes'))
const GovernmentRoutes = lazy(() => import('./routes/GovernmentRoutes'))

// Simple role-based redirect component
const DashboardRedirect = lazy(() => import('./components/Auth/DashboardRedirect'))

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
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public Pages with Layout */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/transparency" element={<Layout><TransparencyPortal /></Layout>} />
            <Route path="/disaster/:id" element={<Layout><DisasterDetails /></Layout>} />
            <Route path="/proof-gallery" element={<Layout><ProofGallery /></Layout>} />
            
            {/* API Test - Development only */}
            {import.meta.env.DEV && (
              <Route path="/api-test" element={<Layout><APITestPage /></Layout>} />
            )}
            
            {/* Role-based Route Groups */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/vendor/*" element={<VendorRoutes />} />
            <Route path="/victim/*" element={<VictimRoutes />} />
            <Route path="/donor/*" element={<DonorRoutes />} />
            <Route path="/government/*" element={<GovernmentRoutes />} />
            
            {/* Legacy route redirects for backward compatibility */}
            <Route path="/donate" element={<Navigate to="/donor" replace />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
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
