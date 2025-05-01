import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  Users, 
  AlertTriangle, 
  Map, 
  Clock, 
  Settings,
  Check,
  X,
  ChevronRight,
  Search
} from 'lucide-react';

interface AccessRequest {
  id: string;
  userName: string;
  department: string;
  requestedRegions: string[];
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface UserAccess {
  userName: string;
  email: string;
  regions: string[];
  lastAccessed: string;
}

const mockAccessRequests: AccessRequest[] = [
  {
    id: '1',
    userName: 'John Smith',
    department: 'Transportation',
    requestedRegions: ['North Region', 'Central Region'],
    date: '2024-03-15',
    status: 'pending'
  },
  {
    id: '2',
    userName: 'Sarah Johnson',
    department: 'Urban Planning',
    requestedRegions: ['South Region'],
    date: '2024-03-14',
    status: 'approved'
  }
];

const mockUserAccess: UserAccess[] = [
  {
    userName: 'John Smith',
    email: 'john.smith@transport.gov',
    regions: ['North Region', 'Central Region'],
    lastAccessed: '2024-03-15 14:30'
  },
  {
    userName: 'Sarah Johnson',
    email: 'sarah.j@planning.gov',
    regions: ['South Region'],
    lastAccessed: '2024-03-14 09:15'
  }
];

const AdminDashboard: React.FC = () => {
  const { isLoggedIn, isAdmin } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'access'>('requests');

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      navigate('/');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const filteredRequests = mockAccessRequests.filter(request =>
    request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserAccess = mockUserAccess.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (requestId: string) => {
    // Handle approval logic
    console.log('Approved request:', requestId);
  };

  const handleReject = (requestId: string) => {
    // Handle rejection logic
    console.log('Rejected request:', requestId);
  };

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-forest-green mb-4">
            Admin Dashboard
          </h1>
          <p className="text-dark-slate">
            Manage access requests and monitor user activities
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-green">Pending Requests</h3>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                {mockAccessRequests.filter(r => r.status === 'pending').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-green">Active Users</h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {mockUserAccess.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-green">Total Regions</h3>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                6
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'requests'
                    ? 'border-b-2 border-forest-green text-forest-green'
                    : 'text-gray-500 hover:text-forest-green'
                }`}
                onClick={() => setActiveTab('requests')}
              >
                Access Requests
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'access'
                    ? 'border-b-2 border-forest-green text-forest-green'
                    : 'text-gray-500 hover:text-forest-green'
                }`}
                onClick={() => setActiveTab('access')}
              >
                User Access
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, department, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'requests' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested Regions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.department}
                        </td>
                        <td className="px-6 py-4">
                          {request.requestedRegions.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Regions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Accessed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUserAccess.map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          {user.regions.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.lastAccessed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;