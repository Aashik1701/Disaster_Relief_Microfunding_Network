import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home,
  Heart, 
  Shield,
  Users,
  Store,
  Eye
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'

const MobileNavigation = () => {
  const location = useLocation()
  const { userRole, isConnected } = useWeb3Store()

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Home',
        href: '/',
        icon: Home
      },
      {
        name: 'Donate',
        href: '/donate',
        icon: Heart
      }
    ]

    // Add role-specific items
    if (isConnected) {
      switch (userRole) {
        case 'admin':
          baseItems.push({
            name: 'Admin',
            href: '/admin',
            icon: Shield
          })
          break
        case 'vendor':
          baseItems.push({
            name: 'Vendor',
            href: '/vendor', 
            icon: Store
          })
          break
        case 'victim':
          baseItems.push({
            name: 'Portal',
            href: '/victim',
            icon: Users
          })
          break
      }
    }

    baseItems.push({
      name: 'Transparency',
      href: '/transparency',
      icon: Eye
    })

    return baseItems
  }

  const navigationItems = getNavigationItems()

  const isActiveLink = (href) => {
    return location.pathname === href
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveLink(item.href)
          
          return (
            <motion.div
              key={item.name}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Link
                to={item.href}
                className={`
                  flex flex-col items-center justify-center h-full px-2 py-1 transition-all duration-200
                  ${isActive 
                    ? 'text-avalanche-600 bg-avalanche-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`
                  h-5 w-5 mb-1
                  ${isActive ? 'text-avalanche-600' : 'text-gray-400'}
                `} />
                <span className={`
                  text-xs font-medium truncate
                  ${isActive ? 'text-avalanche-600' : 'text-gray-500'}
                `}>
                  {item.name}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-avalanche-500"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNavigation
