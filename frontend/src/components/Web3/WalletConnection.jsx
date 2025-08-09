import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, AlertCircle, Download } from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import LoadingSpinner from '../UI/LoadingSpinner'
import Modal from '../UI/Modal'

const WalletConnection = () => {
  const { isConnecting, connectWallet } = useWeb3Store()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const walletOptions = [
    {
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: '/metamask-icon.svg',
      isInstalled: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
      installUrl: 'https://metamask.io/download/'
    },
    {
      name: 'Core Wallet',
      description: 'Avalanche native wallet with enhanced features',
      icon: '/core-wallet-icon.svg',
      isInstalled: typeof window !== 'undefined' && typeof window.avalanche !== 'undefined',
      installUrl: 'https://core.app/'
    },
    {
      name: 'WalletConnect',
      description: 'Connect using mobile wallet apps',
      icon: '/walletconnect-icon.svg',
      isInstalled: true, // WalletConnect is always available
      installUrl: null
    }
  ]

  const handleWalletSelect = async (wallet) => {
    try {
      if (!wallet.isInstalled && wallet.installUrl) {
        window.open(wallet.installUrl, '_blank')
        return
      }

      await connectWallet()
      setShowWalletModal(false)
    } catch (error) {
      console.error('Wallet connection error:', error)
    }
  }

  const ConnectButton = () => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowWalletModal(true)}
      disabled={isConnecting}
      className="btn-primary flex items-center space-x-2"
    >
      {isConnecting ? (
        <LoadingSpinner size="sm" color="white" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      <span>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </motion.button>
  )

  return (
    <>
      <ConnectButton />
      
      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Connect Your Wallet"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm mb-6">
            Choose how you'd like to connect to the Avalanche Disaster Relief Network
          </p>

          {walletOptions.map((wallet) => (
            <motion.button
              key={wallet.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWalletSelect(wallet)}
              disabled={isConnecting}
              className={`
                w-full p-4 border border-gray-200 rounded-lg text-left transition-all duration-200
                ${wallet.isInstalled 
                  ? 'hover:border-avalanche-300 hover:bg-avalanche-50' 
                  : 'opacity-75 hover:border-gray-300'
                }
                ${isConnecting ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {wallet.icon ? (
                      <img 
                        src={wallet.icon} 
                        alt={wallet.name}
                        className="w-6 h-6"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'block'
                        }}
                      />
                    ) : null}
                    <Wallet className="w-6 h-6 text-gray-400" style={{display: wallet.icon ? 'none' : 'block'}} />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {wallet.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {wallet.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  {!wallet.isInstalled ? (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <Download className="h-4 w-4" />
                      <span className="text-sm font-medium">Install</span>
                    </div>
                  ) : isConnecting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}

          {/* Network Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-blue-900">Network Information</h4>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Network:</strong> Avalanche Fuji Testnet</p>
              <p><strong>Chain ID:</strong> 43113</p>
              <p><strong>Currency:</strong> AVAX (Test tokens)</p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              New to crypto wallets?{' '}
              <a 
                href="/help/wallets" 
                className="text-avalanche-600 hover:text-avalanche-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn how to get started
              </a>
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default WalletConnection
