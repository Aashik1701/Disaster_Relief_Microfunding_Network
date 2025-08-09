import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home,
  Heart,
  Shield,
  Users,
  Store,
  Eye,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  Mountain,
  Image
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const { userRole, isConnected } = useWeb3Store()

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      description: 'Overview and latest updates'
    },
    {
      name: 'Donate',
      href: '/donate', 
      icon: Heart,
      description: 'Make a donation'
    },
    {
      name: 'Transparency',
      href: '/transparency',
      icon: Eye,
      description: 'View all transactions'
    },
    {
      name: 'Proof Gallery',
      href: '/proof-gallery',
      icon: Image,
      description: 'Browse aid evidence'
    }
  ]

  // Add role-specific navigation items
  if (isConnected) {
    switch (userRole) {
      case 'admin':
        navigationItems.push(
          {
            name: 'Admin Dashboard',
            href: '/admin',
            icon: Shield,
            description: 'Manage disasters and vendors'
          },
          {
            name: 'Analytics',
            href: '/analytics',
            icon: BarChart3,
            description: 'View system analytics'
          }
        )
        break
      case 'vendor':
        navigationItems.push({
          name: 'Vendor Portal',
          href: '/vendor',
          icon: Store,
          description: 'Process payments'
        })
        break
      case 'victim':
        navigationItems.push({
          name: 'Victim Portal',
          href: '/victim',
          icon: Users,
          description: 'Manage vouchers'
        })
        break
    }
  }

  const bottomNavigation = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle
    }
  ]

  const isActiveLink = (href) => {
    return location.pathname === href
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:border-b-0">
        <Link to="/" className="flex items-center" onClick={onClose}>
          <Mountain className="w-8 h-8 text-avalanche-500" />
          <span className="ml-2 text-lg font-bold text-gray-900">
            Relief Network
          </span>
        </Link>
        
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveLink(item.href)
          
          return (
            <motion.div
              key={item.name}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                className={`
                  group flex items-center p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-avalanche-50 text-avalanche-700 border-l-4 border-avalanche-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`
                  h-5 w-5 mr-3 flex-shrink-0
                  ${isActive ? 'text-avalanche-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Role Badge */}
      {isConnected && userRole && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <div className={`
                w-3 h-3 rounded-full mr-2
                ${userRole === 'admin' ? 'bg-red-500' : 
                  userRole === 'vendor' ? 'bg-blue-500' :
                  userRole === 'victim' ? 'bg-purple-500' :
                  'bg-green-500'}
              `} />
              <span className="text-sm font-medium text-gray-900 capitalize">
                {userRole}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {userRole === 'admin' && 'Full system access'}
              {userRole === 'vendor' && 'Process payments'}
              {userRole === 'victim' && 'Manage vouchers'}
              {userRole === 'donor' && 'Make donations'}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="px-4 py-4 space-y-2 border-t border-gray-200">
        {bottomNavigation.map((item) => {
          const Icon = item.icon
          const isActive = isActiveLink(item.href)
          
          return (
            <motion.div
              key={item.name}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                className={`
                  group flex items-center p-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-avalanche-50 text-avalanche-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`
                  h-5 w-5 mr-3 flex-shrink-0
                  ${isActive ? 'text-avalanche-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Version Info */}
      <div className="px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          v1.0.0 - Avalanche Testnet
        </p>
      </div>
    </div>
  )
}

export default Sidebar
