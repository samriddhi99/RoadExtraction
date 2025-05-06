import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  Check, 
  X, 
  Search 
} from 'lucide-react';

interface AccessRequest {
  id: number;
  full_name: string;
  department: string;
  locations: string;
  submitted_at: string;
  status: string;
}

interface UserAccess {
  id: number; // Assuming userAccesses have a unique identifier
  full_name: string;
  email: string;     // Changed from status to email to match table headers
  regions: string;   // Changed from optional to required to match table headers
  last_accessed: string; // Changed from submitted_at to last_accessed to match table headers
  status: string;    // Added status field to track approved/rejected
}

const AdminDashboard: React.FC = () => {
  const { isLoggedIn, isAdmin } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'access'>('requests');
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [userAccesses, setUserAccesses] = useState<UserAccess[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/access-requests", {  
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        console.log(jsonData);
        setAccessRequests(jsonData.accessRequests);
        setUserAccesses(jsonData.userAccesses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      navigate('/');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const filteredRequests = accessRequests.filter(request =>
    request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserAccess = userAccesses.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status?.toLowerCase().includes(searchTerm.toLowerCase()) // Added status to search fields
  );

  const handleApprove = async (requestId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve/${requestId}`, { // Fixed string interpolation
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to approve request");
  
      const data = await response.json();
      console.log(data.message); // "Request approved"
      // Update the local state after successful approval
      setAccessRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? {...req, status: 'approved'} : req
        )
      );
    } catch (error) {
      console.error("Approval error:", error);
    }
  };
  
  const handleReject = async (requestId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reject/${requestId}`, { // Fixed string interpolation
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to reject request");
  
      const data = await response.json();
      console.log(data.message); // "Request rejected"
      // Update the local state after successful rejection
      setAccessRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? {...req, status: 'rejected'} : req
        )
      );
    } catch (error) {
      console.error("Rejection error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-forest-green mb-4">Admin Dashboard</h1>
          <p className="text-dark-slate">Manage access requests and monitor user activities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-green">Pending Requests</h3>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                {accessRequests.filter(r => r.status === 'pending').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-green">Active Users</h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {userAccesses.filter(u => u.status === 'approved').length}
              </div>
            </div>
          </div>

          {/* Total Regions Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-green">Total Regions</h3>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {/* Insert total region count */}
                5 {/* Placeholder */}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                placeholder="Search by name, department, email, or status..."
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Regions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{request.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.locations || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.submitted_at}</td>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUserAccess.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.regions || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.last_accessed}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                          </span>
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