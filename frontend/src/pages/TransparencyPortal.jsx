import React from 'react'
import { Eye, BarChart3, Globe } from 'lucide-react'

const TransparencyPortal = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Eye className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Transparency Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Complete transparency of all donations and relief fund distribution.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Live Analytics
              </h3>
              <p className="text-gray-600">
                Real-time statistics and fund distribution metrics
              </p>
            </div>
            
            <div className="card text-center">
              <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transaction Explorer
              </h3>
              <p className="text-gray-600">
                Browse all transactions on the blockchain
              </p>
            </div>
            
            <div className="card text-center">
              <Eye className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Impact Reports
              </h3>
              <p className="text-gray-600">
                Detailed reports on aid distribution and impact
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransparencyPortal
