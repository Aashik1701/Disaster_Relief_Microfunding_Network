import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Bell, 
  Wallet, 
  ChevronDown, 
  Mountain,
  Settings,
  LogOut,
  User
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import WalletConnection from '../Web3/WalletConnection'
import NetworkStatus from '../Web3/NetworkStatus'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const { isConnected, account, userRole, balance } = useWeb3Store()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4)
  }

  const getPageTitle = () => {
    const path = location.pathname
    const titles = {
      '/': 'Disaster Relief Network',
      '/donate': 'Donation Dashboard',
      '/admin': 'Admin Dashboard', 
      '/victim': 'Victim Portal',
      '/vendor': 'Vendor Portal',
      '/transparency': 'Transparency Portal',
      '/proof-gallery': 'Proof Gallery'
    }
    return titles[path] || 'Disaster Relief Network'
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo and Title */}
            <Link to="/" className="flex items-center ml-0 lg:ml-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Mountain className="w-8 h-8 mr-3 text-avalanche-500" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Blockchain-Powered Relief
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Center Section - Search (Hidden on mobile) */}
          <div className="flex-1 hidden max-w-md mx-8 md:flex">
            <div className="w-full">
              <input
                type="text"
                placeholder="Search disasters, transactions..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 block w-3 h-3 bg-red-400 rounded-full ring-2 ring-white" />
            </motion.button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Network Status */}
                <NetworkStatus />
                
                {/* Balance Display */}
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {formatBalance(balance)} AVAX
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </p>
                </div>

                {/* Account Dropdown */}
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center px-3 py-2 space-x-2 text-sm font-medium rounded-lg bg-avalanche-50 hover:bg-avalanche-100 text-avalanche-700 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {formatAddress(account)}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 z-50 invisible w-48 mt-2 transition-all duration-200 bg-white rounded-md shadow-lg opacity-0 ring-1 ring-black ring-opacity-5 group-hover:opacity-100 group-hover:visible">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => useWeb3Store.getState().disconnect()}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <WalletConnection />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-4 md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search disasters, transactions..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
