import React from 'react'
import { Link } from 'react-router-dom'
import { Mountain, Github, Twitter, Globe, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Features', href: '/features' },
      { name: 'Security', href: '/security' },
      { name: 'API Docs', href: '/docs' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Status', href: '/status' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  }

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/avalanche-disaster-relief',
      icon: Github
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/avalanche_relief',
      icon: Twitter
    },
    {
      name: 'Website',
      href: 'https://avalanche-disaster-relief.com',
      icon: Globe
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Mountain className="h-8 w-8 text-avalanche-500" />
              <span className="ml-2 text-lg font-bold text-gray-900">
                Relief Network
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Transparent, efficient, and accountable disaster relief funding through blockchain technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">$2.5M+</div>
              <div className="text-sm text-gray-600">Funds Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">15,000+</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">250+</div>
              <div className="text-sm text-gray-600">Verified Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">50+</div>
              <div className="text-sm text-gray-600">Active Zones</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <span>© {currentYear} Avalanche Disaster Relief Network.</span>
              <span className="ml-1">Built with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" fill="currentColor" />
              <span>for humanitarian causes.</span>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>All systems operational</span>
              </div>
              <div className="text-sm text-gray-500">
                Powered by Avalanche
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This platform operates on the Avalanche blockchain. Please ensure you understand the risks associated with cryptocurrency transactions. 
            All donations are recorded on the blockchain for complete transparency.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
