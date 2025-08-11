import React from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, QrCode, Camera } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VendorPayments = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
              <p className="text-gray-600">Process voucher redemptions and handle payments</p>
            </div>
            <Link to="/vendor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-8 text-center">
            <QrCode className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Scanner</h3>
            <p className="text-gray-600 mb-6">Scan victim voucher QR codes for instant processing</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Camera className="w-4 h-4 mr-2" />
              Open Scanner
            </Button>
          </Card>

          <Card className="p-8 text-center">
            <CreditCard className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual Entry</h3>
            <p className="text-gray-600 mb-6">Enter voucher details manually for processing</p>
            <Button variant="outline" className="w-full">
              Manual Processing
            </Button>
          </Card>
        </div>

        {/* Pending Payments */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payment Requests</h3>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Payment processing interface coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VendorPayments
