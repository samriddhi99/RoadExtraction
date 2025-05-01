import React, { useState } from 'react';
import { AlertCircle, MapPin, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Alert {
  id: string;
  title: string;
  message: string;
  coordinates: {
    topLeft: { lat: number; lng: number };
    topRight: { lat: number; lng: number };
    bottomRight: { lat: number; lng: number };
    bottomLeft: { lat: number; lng: number };
    center: { lat: number; lng: number };
  };
  roadWidth: number;
  sensorInfo: {
    model: string;
    imagingMode: string;
  };
  sceneInfo: {
    identifier: string;
    path: string;
  };
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Road Damage Detected',
    message: 'Significant road damage detected in monitoring area',
    coordinates: {
      topLeft: { lat: 18.692135, lng: 77.0139 },
      topRight: { lat: 18.66562, lng: 78.7418 },
      bottomRight: { lat: 17.089724, lng: 78.7089 },
      bottomLeft: { lat: 17.113861, lng: 76.9961 },
      center: { lat: 17.892266, lng: 77.8652 }
    },
    roadWidth: 3.75,
    sensorInfo: {
      model: 'R2A_LIS3_-_F_L2',
      imagingMode: 'Satellite_Sensor_ImagingMode_Subscene_Product'
    },
    sceneInfo: {
      identifier: '025306_99 60',
      path: 'Not specified'
    },
    timestamp: '2024-03-15T10:30:00Z',
    severity: 'high'
  }
];

const Index: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

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
                {mockAlerts.map(alert => (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedAlert?.id === alert.id
                        ? 'bg-light-olive/20 border-forest-green'
                        : 'bg-white border-light-olive hover:bg-light-olive/10'
                    }`}
                  >
                    <div className="flex items-start">
                      <AlertCircle 
                        className={`flex-shrink-0 ${
                          alert.severity === 'high' ? 'text-red-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} 
                        size={20} 
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-forest-green">{alert.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleDateString()}</p>
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
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-playfair font-bold text-forest-green">
                      {selectedAlert.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedAlert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      selectedAlert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)} Priority
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-forest-green mb-3">Coverage Area Coordinates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="font-medium">Top Left</p>
                        <p>Latitude: {selectedAlert.coordinates.topLeft.lat}</p>
                        <p>Longitude: {selectedAlert.coordinates.topLeft.lng}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Top Right</p>
                        <p>Latitude: {selectedAlert.coordinates.topRight.lat}</p>
                        <p>Longitude: {selectedAlert.coordinates.topRight.lng}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Bottom Right</p>
                        <p>Latitude: {selectedAlert.coordinates.bottomRight.lat}</p>
                        <p>Longitude: {selectedAlert.coordinates.bottomRight.lng}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Bottom Left</p>
                        <p>Latitude: {selectedAlert.coordinates.bottomLeft.lat}</p>
                        <p>Longitude: {selectedAlert.coordinates.bottomLeft.lng}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Center</p>
                        <p>Latitude: {selectedAlert.coordinates.center.lat}</p>
                        <p>Longitude: {selectedAlert.coordinates.center.lng}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-forest-green mb-3">Road Information</h3>
                      <p>Width: {selectedAlert.roadWidth} meters</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-forest-green mb-3">Sensor Details</h3>
                      <p>Model: {selectedAlert.sensorInfo.model}</p>
                      <p>Mode: {selectedAlert.sensorInfo.imagingMode}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-forest-green mb-3">Scene Information</h3>
                    <p>Identifier: {selectedAlert.sceneInfo.identifier}</p>
                    <p>Path/Row: {selectedAlert.sceneInfo.path}</p>
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