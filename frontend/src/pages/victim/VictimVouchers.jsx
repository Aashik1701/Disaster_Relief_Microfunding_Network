import React from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, QrCode, Download } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VictimVouchers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Vouchers</h1>
              <p className="text-gray-600">View and manage your assistance vouchers</p>
            </div>
            <Link to="/victim">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Voucher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Voucher Cards */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">VCH-2024-001</h3>
                <p className="text-sm text-gray-600">Food assistance</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                active
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">$150</p>
              <p className="text-sm text-gray-600">Emergency food assistance</p>
            </div>
            
            <div className="mb-4 text-center">
              <div className="w-24 h-24 mx-auto border rounded bg-gray-100 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">Show to vendor</p>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>Issued: Aug 10, 2024</p>
              <p>Expires: Aug 20, 2024</p>
            </div>
            
            <div className="space-y-2">
              <Button size="sm" className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">VCH-2024-002</h3>
                <p className="text-sm text-gray-600">Medical supplies</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                active
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">$100</p>
              <p className="text-sm text-gray-600">Prescription medications</p>
            </div>
            
            <div className="mb-4 text-center">
              <div className="w-24 h-24 mx-auto border rounded bg-gray-100 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">Show to vendor</p>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>Issued: Aug 8, 2024</p>
              <p>Expires: Aug 25, 2024</p>
            </div>
            
            <div className="space-y-2">
              <Button size="sm" className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>

          {/* Add more voucher cards as needed */}
          <Card className="p-6 border-dashed border-2 border-gray-300">
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No More Vouchers
              </h3>
              <p className="text-gray-600 mb-4">
                Request additional assistance if needed
              </p>
              <Link to="/victim/requests">
                <Button>Request Aid</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VictimVouchers
