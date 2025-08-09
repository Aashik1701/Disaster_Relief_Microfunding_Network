import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import WalletDebugger from './components/Web3/WalletDebugger'
import { useWeb3Store } from './store/web3Store'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const VictimPortal = lazy(() => import('./pages/VictimPortal'))
const VendorPortal = lazy(() => import('./pages/VendorPortal'))
const TransparencyPortal = lazy(() => import('./pages/TransparencyPortal'))
const DisasterDetails = lazy(() => import('./pages/DisasterDetails'))
const ProofGallery = lazy(() => import('./pages/ProofGallery'))

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
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Suspense 
          fallback={
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donate" element={<DonorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/victim" element={<VictimPortal />} />
            <Route path="/vendor" element={<VendorPortal />} />
            <Route path="/transparency" element={<TransparencyPortal />} />
            <Route path="/disaster/:id" element={<DisasterDetails />} />
            <Route path="/proof-gallery" element={<ProofGallery />} />
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
        </Suspense>
      </Layout>
      
      {/* Development Debug Tools */}
      <WalletDebugger />
    </div>
  )
}

export default App
