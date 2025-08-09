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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo and Title */}
            <Link to="/" className="flex items-center ml-0 lg:ml-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Mountain className="h-8 w-8 text-avalanche-500 mr-3" />
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
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="w-full">
              <input
                type="text"
                placeholder="Search disasters, transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-avalanche-500"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-400 ring-2 ring-white" />
            </motion.button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Balance Display */}
                <div className="hidden sm:block text-right">
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
                    className="flex items-center space-x-2 bg-avalanche-50 hover:bg-avalanche-100 rounded-lg px-3 py-2 text-sm font-medium text-avalanche-700 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {formatAddress(account)}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => useWeb3Store.getState().disconnect()}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
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
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search disasters, transactions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
