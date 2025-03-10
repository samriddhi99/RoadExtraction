import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { BarChart, Users, AlertTriangle, Map, Clock, Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isLoggedIn, userRole } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoggedIn || userRole !== 'Admin') {
      navigate('/');
    }
  }, [isLoggedIn, userRole, navigate]);

  if (!isLoggedIn || userRole !== 'Admin') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-forest-green">
            Admin Dashboard
          </h1>
          <p className="text-dark-slate">
            Welcome to the administrative control panel for the Road Monitoring System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-forest-green">Pending Approvals</h3>
              <div className="bg-light-olive/20 text-forest-green font-bold px-3 py-1 rounded-full">
                12
              </div>
            </div>
            <p className="text-dark-slate mb-4">New user registrations awaiting approval</p>
            <button className="w-full bg-forest-green text-cream py-2 rounded-lg hover:bg-forest-green/90 transition-colors">
              Review Requests
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-forest-green">Active Users</h3>
              <div className="bg-light-olive/20 text-forest-green font-bold px-3 py-1 rounded-full">
                87
              </div>
            </div>
            <p className="text-dark-slate mb-4">Currently active users on the platform</p>
            <button className="w-full bg-forest-green text-cream py-2 rounded-lg hover:bg-forest-green/90 transition-colors">
              Manage Users
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-forest-green">System Alerts</h3>
              <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full">
                3
              </div>
            </div>
            <p className="text-dark-slate mb-4">Critical system alerts requiring attention</p>
            <button className="w-full bg-forest-green text-cream py-2 rounded-lg hover:bg-forest-green/90 transition-colors">
              View Alerts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-playfair font-bold text-forest-green mb-4">
              System Activity Overview
            </h2>
            <div className="h-64 flex items-center justify-center bg-light-olive/10 rounded-lg mb-4">
              <BarChart size={48} className="text-forest-green opacity-50" />
              <p className="ml-4 text-dark-slate">Activity chart visualization would appear here</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-light-olive/10 p-4 rounded-lg text-center">
                <p className="text-sm text-dark-slate">Data Queries</p>
                <p className="text-2xl font-bold text-forest-green">1,284</p>
              </div>
              <div className="bg-light-olive/10 p-4 rounded-lg text-center">
                <p className="text-sm text-dark-slate">Reports Generated</p>
                <p className="text-2xl font-bold text-forest-green">347</p>
              </div>
              <div className="bg-light-olive/10 p-4 rounded-lg text-center">
                <p className="text-sm text-dark-slate">Alerts Triggered</p>
                <p className="text-2xl font-bold text-forest-green">28</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-playfair font-bold text-forest-green mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors">
                <Users className="mr-3 text-forest-green" size={20} />
                <span>Manage User Permissions</span>
              </button>
              <button className="w-full flex items-center p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors">
                <Map className="mr-3 text-forest-green" size={20} />
                <span>Update Region Boundaries</span>
              </button>
              <button className="w-full flex items-center p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors">
                <AlertTriangle className="mr-3 text-forest-green" size={20} />
                <span>Configure Alert Thresholds</span>
              </button>
              <button className="w-full flex items-center p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors">
                <Clock className="mr-3 text-forest-green" size={20} />
                <span>Schedule System Maintenance</span>
              </button>
              <button className="w-full flex items-center p-3 bg-light-olive/10 hover:bg-light-olive/20 rounded-lg transition-colors">
                <Settings className="mr-3 text-forest-green" size={20} />
                <span>System Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-playfair font-bold text-forest-green mb-4">
            Recent User Registrations
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-light-olive/30">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-slate uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-slate uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-slate uppercase tracking-wider">Requested Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-slate uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-slate uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-slate uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-light-olive/30">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap">Transportation</td>
                  <td className="px-6 py-4 whitespace-nowrap">North Region</td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-06-15</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-green">
                    <button className="mr-2 hover:underline">Approve</button>
                    <button className="hover:underline">Reject</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Sarah Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap">Public Works</td>
                  <td className="px-6 py-4 whitespace-nowrap">Central Region</td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-06-14</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-green">
                    <button className="hover:underline">View Details</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Michael Brown</td>
                  <td className="px-6 py-4 whitespace-nowrap">Urban Planning</td>
                  <td className="px-6 py-4 whitespace-nowrap">South Region</td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-06-13</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rejected
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-green">
                    <button className="hover:underline">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;