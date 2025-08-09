import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Heart, 
  Users, 
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Transparent & Secure',
      description: 'All transactions recorded on Avalanche blockchain for complete transparency and security.',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second transaction finality with minimal fees on Avalanche network.',
      color: 'text-yellow-500'
    },
    {
      icon: Globe,
      title: 'Geo-Locked Spending',
      description: 'Funds can only be spent within designated disaster zones for maximum impact.',
      color: 'text-green-500'
    },
    {
      icon: Heart,
      title: 'Direct Impact',
      description: 'Connect directly with verified vendors and see real-time proof of aid delivery.',
      color: 'text-red-500'
    }
  ]

  const stats = [
    {
      icon: DollarSign,
      value: '$2.5M+',
      label: 'Funds Distributed',
      change: '+15% this month'
    },
    {
      icon: Users,
      value: '15,000+',
      label: 'Lives Impacted',
      change: '+23% this month'
    },
    {
      icon: MapPin,
      value: '50+',
      label: 'Active Zones',
      change: '+8 new zones'
    },
    {
      icon: TrendingUp,
      value: '99.8%',
      label: 'Fund Efficiency',
      change: 'Industry leading'
    }
  ]

  const recentDisasters = [
    {
      id: 1,
      name: 'Turkey Earthquake Relief',
      location: 'Kahramanmaraş, Turkey',
      raised: '$125,000',
      distributed: '$98,000',
      beneficiaries: 2500,
      status: 'active',
      image: '/disaster-1.jpg'
    },
    {
      id: 2,
      name: 'Flood Recovery Fund',
      location: 'Kerala, India',
      raised: '$87,500',
      distributed: '$75,200',
      beneficiaries: 1800,
      status: 'active',
      image: '/disaster-2.jpg'
    },
    {
      id: 3,
      name: 'Wildfire Support',
      location: 'California, USA',
      raised: '$156,000',
      distributed: '$156,000',
      beneficiaries: 3200,
      status: 'completed',
      image: '/disaster-3.jpg'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-avalanche-500 to-avalanche-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Blockchain-Powered
              <span className="block text-avalanche-100">
                Disaster Relief
              </span>
            </h1>
            <p className="text-xl text-avalanche-100 mb-8 max-w-3xl mx-auto">
              Transparent, efficient, and accountable disaster relief funding through 
              Avalanche blockchain technology. Every donation tracked, every impact verified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/donate"
                  className="inline-flex items-center px-8 py-4 bg-white text-avalanche-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
                >
                  Start Donating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/transparency"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-avalanche-600 transition-all duration-200"
                >
                  View Transparency
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-avalanche-50 rounded-full">
                      <Icon className="h-8 w-8 text-avalanche-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-success-600">
                    {stat.change}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on Avalanche blockchain for maximum transparency, efficiency, and impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Disasters Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Active Disaster Relief
              </h2>
              <p className="text-xl text-gray-600">
                See where your donations are making an immediate impact.
              </p>
            </div>
            <Link 
              to="/transparency"
              className="hidden sm:flex items-center text-avalanche-600 hover:text-avalanche-700 font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentDisasters.map((disaster, index) => (
              <motion.div
                key={disaster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
              >
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={disaster.image}
                    alt={disaster.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-full h-full bg-gradient-to-br from-avalanche-400 to-avalanche-600 hidden items-center justify-center"
                  >
                    <MapPin className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${disaster.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      {disaster.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {disaster.name}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {disaster.location}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Raised</span>
                      <span className="text-sm font-medium text-gray-900">
                        {disaster.raised}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Distributed</span>
                      <span className="text-sm font-medium text-gray-900">
                        {disaster.distributed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Beneficiaries</span>
                      <span className="text-sm font-medium text-gray-900">
                        {disaster.beneficiaries.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/disaster/${disaster.id}`}
                      className="w-full btn-primary text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link 
              to="/transparency"
              className="inline-flex items-center text-avalanche-600 hover:text-avalanche-700 font-medium"
            >
              View All Disasters
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent, and efficient disaster relief in four easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your Web3 wallet to the Avalanche network'
              },
              {
                step: '02', 
                title: 'Choose Disaster',
                description: 'Select an active disaster zone that needs support'
              },
              {
                step: '03',
                title: 'Make Donation',
                description: 'Send USDC donations with minimal transaction fees'
              },
              {
                step: '04',
                title: 'Track Impact',
                description: 'Monitor real-time spending and proof of aid delivery'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-avalanche-500 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-avalanche-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-avalanche-100 mb-8">
              Join thousands of donors who are creating transparent, 
              accountable disaster relief through blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/donate"
                  className="inline-flex items-center px-8 py-4 bg-white text-avalanche-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
                >
                  Start Donating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/how-it-works"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-avalanche-600 transition-all duration-200"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
