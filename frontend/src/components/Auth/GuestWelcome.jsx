import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Heart, ShieldCheck, TrendingUp } from 'lucide-react'
import Card from '../UI/Card'
import Button from '../UI/Button'

const GuestWelcome = ({ 
  title = "Welcome to Disaster Relief Network",
  subtitle = "Join our community to access enhanced features",
  roleSpecific = null 
}) => {
  const features = [
    {
      icon: Heart,
      title: "Make Donations",
      description: "Support disaster relief efforts with secure blockchain donations",
      available: true
    },
    {
      icon: Users,
      title: "Track Impact",
      description: "See how your contributions help real people in need",
      available: false
    },
    {
      icon: ShieldCheck,
      title: "Verified Transactions",
      description: "All donations are transparently tracked on the blockchain",
      available: true
    },
    {
      icon: TrendingUp,
      title: "Personal Dashboard",
      description: "Manage your profile and view donation history",
      available: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-16 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 mb-8">{subtitle}</p>
          
          {roleSpecific && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-700">{roleSpecific}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    feature.available 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                      {feature.available && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Available
                        </span>
                      )}
                      {!feature.available && (
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Sign in required
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-8 bg-gradient-to-r from-avalanche-50 to-blue-50 border-avalanche-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of donors, vendors, and volunteers helping disaster victims worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donor/donate">
                <Button className="w-full sm:w-auto">
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </Link>
              <Link to="/transparency">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Transparency Portal
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default GuestWelcome
