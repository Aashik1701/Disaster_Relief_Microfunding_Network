import React from 'react'
import { Users, Ticket, Gift } from 'lucide-react'

const VictimPortal = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Users className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Victim Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your relief vouchers and access essential aid services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <Ticket className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Vouchers
              </h3>
              <p className="text-gray-600">
                View and manage your available relief vouchers
              </p>
            </div>
            
            <div className="card text-center">
              <Gift className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Redeem Aid
              </h3>
              <p className="text-gray-600">
                Use vouchers at verified vendors for essential supplies
              </p>
            </div>
            
            <div className="card text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Support Services
              </h3>
              <p className="text-gray-600">
                Access additional support and assistance programs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VictimPortal
