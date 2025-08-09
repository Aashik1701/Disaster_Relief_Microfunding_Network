import React from 'react'
import { Store, CreditCard, BarChart3 } from 'lucide-react'

const VendorPortal = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Store className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vendor Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Process relief payments and serve disaster-affected communities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Process Payments
              </h3>
              <p className="text-gray-600">
                Accept and process voucher payments from beneficiaries
              </p>
            </div>
            
            <div className="card text-center">
              <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transaction History
              </h3>
              <p className="text-gray-600">
                View your complete transaction and earnings history
              </p>
            </div>
            
            <div className="card text-center">
              <Store className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vendor Profile
              </h3>
              <p className="text-gray-600">
                Manage your vendor profile and verification status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorPortal
