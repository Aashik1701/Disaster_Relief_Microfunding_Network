import React from 'react'
import { Shield, Users, MapPin, Settings } from 'lucide-react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-avalanche-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Manage disaster zones, verify vendors, and oversee relief operations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Disaster Zones
              </h3>
              <p className="text-gray-600">
                Create and manage active disaster relief zones
              </p>
            </div>
            
            <div className="card text-center">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vendor Management
              </h3>
              <p className="text-gray-600">
                Verify and manage authorized vendors
              </p>
            </div>
            
            <div className="card text-center">
              <Settings className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                System Settings
              </h3>
              <p className="text-gray-600">
                Configure platform parameters and rules
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
