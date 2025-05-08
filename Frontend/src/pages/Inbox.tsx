import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Alert {
  id: string;
  title: string;
  message: string;
  date: string; // This is datetime string from DB
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  user_id?: string | null;
}

const Index: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('"http://localhost:5000/api/user/notifications');
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data: Alert[] = await response.json();
        setAlerts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load alerts');
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-forest-green mb-4">
            Road Monitoring Index
          </h1>
          <p className="text-dark-slate">
            View and manage road monitoring alerts and location requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-playfair font-bold text-forest-green mb-4 flex items-center">
                <AlertCircle className="mr-2" size={24} />
                Active Alerts
              </h2>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedAlert?.id === alert.id ? 'bg-light-olive/20 border-forest-green' : 'bg-white border-light-olive hover:bg-light-olive/10'}`}
                  >
                    <div className="flex items-start">
                      <AlertCircle className="flex-shrink-0 text-yellow-500" size={20} />
                      <div className="ml-3">
                        <h3 className="font-medium text-forest-green">{alert.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(alert.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">{alert.location}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {selectedAlert ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-playfair font-bold text-forest-green">
                    {selectedAlert.title}
                  </h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-forest-green mb-3">Alert Details</h3>
                    <p><span className="font-medium">Message:</span> {selectedAlert.message}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedAlert.date).toLocaleString()}</p>
                  </div>

                  {/* Location Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-forest-green mb-3">Location Details</h3>
                    <p><span className="font-medium">Location:</span> {selectedAlert.location || 'N/A'}</p>
                    <p><span className="font-medium">Latitude:</span> {selectedAlert.latitude ?? 'N/A'}</p>
                    <p><span className="font-medium">Longitude:</span> {selectedAlert.longitude ?? 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                  <Info size={48} className="mb-4 opacity-50" />
                  <p>Select an alert to view detailed information</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Request Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-playfair font-bold text-forest-green mb-4 flex items-center">
            <MapPin className="mr-2" size={24} />
            Location Access
          </h2>
          <p className="text-dark-slate mb-4">
            Need access to additional locations? Submit a request for approval.
          </p>
          <Link
            to="/location-request"
            className="inline-block bg-forest-green text-cream px-6 py-3 rounded-lg hover:bg-forest-green/90 transition-colors"
          >
            Request New Location Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;