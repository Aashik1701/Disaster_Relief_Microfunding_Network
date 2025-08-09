import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Shield,
  Clock,
  CheckCircle2
} from 'lucide-react';
import RoleGuard from '../components/Auth/RoleGuard';

const TreasuryDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Treasury Management</h1>
        <p className="text-gray-600">
          Financial oversight and fund allocation for disaster relief operations
        </p>
      </div>

      {/* Treasury Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Treasury</p>
              <p className="text-2xl font-bold text-gray-900">$12.4M</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Allocated Funds</p>
              <p className="text-2xl font-bold text-gray-900">$8.7M</p>
              <p className="text-sm text-blue-600">70% of treasury</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Releases</p>
              <p className="text-2xl font-bold text-gray-900">$1.2M</p>
              <p className="text-sm text-yellow-600">5 approvals needed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disbursed Today</p>
              <p className="text-2xl font-bold text-gray-900">$342K</p>
              <p className="text-sm text-purple-600">12 transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fund Allocation */}
        <RoleGuard permissions={['treasury:allocate', 'funds:manage']} fallback={null}>
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-500" />
                Fund Allocation & Management
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Hurricane Relief - Florida</h4>
                      <p className="text-sm text-gray-500">Emergency: High Priority</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      Urgent
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Requested: $2.5M</span>
                    <span className="text-sm text-gray-600">Available: $3.7M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Approve $2.5M
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Review
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Earthquake Aid - California</h4>
                      <p className="text-sm text-gray-500">Medical supplies needed</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Medium
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Requested: $1.8M</span>
                    <span className="text-sm text-gray-600">Available: $3.7M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '49%' }}></div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Approve $1.8M
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Review
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Flood Recovery - Texas</h4>
                      <p className="text-sm text-gray-500">Infrastructure repair</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Approved
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Allocated: $3.2M</span>
                    <span className="text-sm text-gray-600">Disbursed: $2.1M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Release Next $500K
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Track
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RoleGuard>

        {/* Treasury Controls */}
        <RoleGuard permissions={['treasury:view', 'analytics:financial']} fallback={null}>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Treasury Controls
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Emergency Release</p>
                    <p className="text-sm text-gray-500">Quick fund deployment</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Budget Analysis</p>
                    <p className="text-sm text-gray-500">Financial reporting</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Audit Trail</p>
                    <p className="text-sm text-gray-500">Transaction history</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </button>

              <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Compliance Check</p>
                    <p className="text-sm text-gray-500">Regulatory review</p>
                  </div>
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
              </button>
            </div>
          </div>
        </RoleGuard>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Emergency Fund Release</div>
                  <div className="text-sm text-gray-500">Hurricane Relief - FL</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">$2,500,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Relief Coordinator FL</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Aug 10, 2024
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Medical Supply Fund</div>
                  <div className="text-sm text-gray-500">Earthquake Aid - CA</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">$850,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Medical Supply Network</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Aug 9, 2024
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TreasuryDashboard;
