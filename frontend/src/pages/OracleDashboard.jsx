import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Eye,
  Zap,
  Clock,
  Shield,
  BarChart3,
  Search
} from 'lucide-react';
import RoleGuard from '../components/Auth/RoleGuard';

const OracleDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oracle Dashboard</h1>
        <p className="text-gray-600">
          Data verification and price oracle management for the relief network
        </p>
      </div>

      {/* Oracle Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Data Points Verified</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+23 today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Price Updates</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-blue-600">Last: 2 min ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Validations</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-yellow-600">Requires attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Network Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
              <p className="text-sm text-purple-600">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Data Verification Queue */}
        <RoleGuard permissions={['data:verify', 'validation:perform']} fallback={null}>
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-500" />
                Data Verification Queue
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Hurricane Impact Assessment</h4>
                      <p className="text-sm text-gray-600">Location: Florida Keys</p>
                      <p className="text-sm text-gray-500">Source: NOAA Weather Service</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                      High Priority
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Confidence Score: 94%</span>
                    <span className="text-sm text-gray-600">Sources: 3/3 verified</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Verify & Approve
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Request More Data
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Supply Price Update</h4>
                      <p className="text-sm text-gray-600">Item: Emergency Food Rations</p>
                      <p className="text-sm text-gray-500">Source: Multiple vendors</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Medium
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Avg Price: $12.50/unit</span>
                    <span className="text-sm text-gray-600">Price change: +5%</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Update Price
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Review History
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Vendor Location Verification</h4>
                      <p className="text-sm text-gray-600">Vendor: Relief Supply Co.</p>
                      <p className="text-sm text-gray-500">Location: Austin, TX</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">GPS Confirmed</span>
                    <span className="text-sm text-gray-600">Capacity: 10,000 units</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed text-sm">
                      Already Verified
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Damage Assessment</h4>
                      <p className="text-sm text-gray-600">Event: California Earthquake</p>
                      <p className="text-sm text-gray-500">Source: Satellite imagery</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">AI Analysis: 87%</span>
                    <span className="text-sm text-gray-600">Manual review needed</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Start Review
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      View Imagery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RoleGuard>

        {/* Oracle Tools */}
        <RoleGuard permissions={['price:update', 'data:verify']} fallback={null}>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Oracle Tools
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Price Feed Manager</p>
                    <p className="text-sm text-gray-500">Update commodity prices</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Data Source Monitor</p>
                    <p className="text-sm text-gray-500">Check feed reliability</p>
                  </div>
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Validation Rules</p>
                    <p className="text-sm text-gray-500">Configure verification</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Network Analytics</p>
                    <p className="text-sm text-gray-500">Performance metrics</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Data Search</p>
                    <p className="text-sm text-gray-500">Historical lookup</p>
                  </div>
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
              </button>
            </div>
          </div>
        </RoleGuard>
      </div>

      {/* Recent Oracle Activity */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Oracle Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Price Update</div>
                  <div className="text-sm text-gray-500">Emergency Food Rations</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Supply Pricing</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Verified
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  98%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2 minutes ago
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Data Validation</div>
                  <div className="text-sm text-gray-500">Hurricane damage report</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Weather Data</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    In Review
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  94%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15 minutes ago
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Location Verification</div>
                  <div className="text-sm text-gray-500">Vendor: Relief Supply Co.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">GPS Data</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Verified
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  100%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  1 hour ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OracleDashboard;
