import React from 'react';
import { 
  Users, 
  Shield, 
  Database, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  Key,
  FileText
} from 'lucide-react';
import RoleGuard from '../components/Auth/RoleGuard';

const GovernmentDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Portal</h1>
        <p className="text-gray-600">
          Regulatory oversight and disaster management coordination
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Disasters</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Vendors</p>
              <p className="text-2xl font-bold text-gray-900">148</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aid Distributed</p>
              <p className="text-2xl font-bold text-gray-900">$2.4M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Disaster Management */}
        <RoleGuard permissions={['disaster:create', 'disaster:update']} fallback={null}>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Disaster Management
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">Create New Disaster Declaration</p>
                      <p className="text-sm text-gray-500">Declare a new disaster and allocate resources</p>
                    </div>
                    <div className="text-blue-500">+</div>
                  </div>
                </button>
                
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">Review Disaster Reports</p>
                      <p className="text-sm text-gray-500">Verify and update disaster information</p>
                    </div>
                    <div className="text-yellow-500">!</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </RoleGuard>

        {/* Vendor Approval */}
        <RoleGuard permissions={['vendor:approve']} fallback={null}>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Vendor Verification
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">Aid Supply Co.</p>
                      <p className="text-sm text-gray-500">Emergency food supplier</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">Medical Relief Inc.</p>
                      <p className="text-sm text-gray-500">Medical equipment supplier</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RoleGuard>

        {/* Analytics & Reports */}
        <RoleGuard permissions={['reports:generate', 'analytics:view']} fallback={null}>
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Analytics & Reporting
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="text-center">
                    <Eye className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <p className="font-medium text-gray-900">Fund Tracking</p>
                    <p className="text-sm text-gray-500">Monitor aid distribution</p>
                  </div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto text-green-500 mb-2" />
                    <p className="font-medium text-gray-900">Impact Reports</p>
                    <p className="text-sm text-gray-500">Generate impact analysis</p>
                  </div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                    <p className="font-medium text-gray-900">User Activity</p>
                    <p className="text-sm text-gray-500">Monitor platform usage</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </RoleGuard>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
