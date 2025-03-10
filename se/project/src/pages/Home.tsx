import React, { useState } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import { MapPin, Shield, Loader as Road, FileCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

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

const Home: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const { isLoggedIn } = useUser();
  const [areas] = useState(['Area 1', 'Area 2', 'Area 3']);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-forest-green mb-4">
            Welcome to Our Real-Time Road Monitoring System
          </h1>
          <p className="text-dark-slate text-base md:text-lg max-w-3xl mx-auto">
            A comprehensive platform designed to help government officials monitor road conditions,
            track infrastructure projects, and ensure public safety through advanced technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Cards */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <Road className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Infrastructure Tracking</h3>
            </div>
            <p className="text-dark-slate">
              Monitor ongoing road construction and maintenance projects in real-time.
            </p>
          </div>

          {/* Add other feature cards... */}
        </div>

        {/* Alerts Section - Only visible when logged in */}
        {isLoggedIn && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
              Recent Alerts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Alerts List */}
              <div className="lg:col-span-1 space-y-4">
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

              {/* Alert Details */}
              <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6">
                {selectedAlert ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-playfair font-bold text-forest-green">
                      {selectedAlert.title}
                    </h3>
                    <p className="text-dark-slate">{selectedAlert.message}</p>
                    
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-forest-green">Coverage Area Coordinates:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium">Top Left:</p>
                          <p>Lat: {selectedAlert.coordinates.topLeft.lat}, Long: {selectedAlert.coordinates.topLeft.lng}</p>
                        </div>
                        <div>
                          <p className="font-medium">Top Right:</p>
                          <p>Lat: {selectedAlert.coordinates.topRight.lat}, Long: {selectedAlert.coordinates.topRight.lng}</p>
                        </div>
                        <div>
                          <p className="font-medium">Bottom Right:</p>
                          <p>Lat: {selectedAlert.coordinates.bottomRight.lat}, Long: {selectedAlert.coordinates.bottomRight.lng}</p>
                        </div>
                        <div>
                          <p className="font-medium">Bottom Left:</p>
                          <p>Lat: {selectedAlert.coordinates.bottomLeft.lat}, Long: {selectedAlert.coordinates.bottomLeft.lng}</p>
                        </div>
                        <div>
                          <p className="font-medium">Center:</p>
                          <p>Lat: {selectedAlert.coordinates.center.lat}, Long: {selectedAlert.coordinates.center.lng}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-forest-green mb-2">Road Information</h4>
                        <p>Width: {selectedAlert.roadWidth} meters</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-forest-green mb-2">Sensor Details</h4>
                        <p>Model: {selectedAlert.sensorInfo.model}</p>
                        <p>Mode: {selectedAlert.sensorInfo.imagingMode}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select an alert to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interested Locations Section - Only visible when logged in */}
        {isLoggedIn && (
          <div className="bg-forest-green rounded-xl shadow-md p-6 text-cream">
            <h2 className="text-2xl font-playfair font-bold mb-6">Interested Locations</h2>
            <p className="text-light-olive mb-6">*you have access to only ... region</p>
            
            <div className="space-y-4 mb-8">
              {areas.map((area, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Enter area ${index + 1}`}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-light-olive/30 text-cream placeholder-light-olive/50 focus:outline-none focus:border-light-olive"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="mb-4">To access another region</p>
              <Link
                to="/location-request"
                className="inline-block bg-white text-forest-green px-6 py-3 rounded-lg font-medium hover:bg-light-olive transition-colors"
              >
                Request for permission
              </Link>
            </div>
          </div>
        )}

        {/* Image Carousel */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-forest-green mb-8 text-center">
            Our Monitoring in Action
          </h2>
          <ImageCarousel />
        </div>

        {/* CTA Section */}
        <div className="bg-forest-green text-cream rounded-xl p-8 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join our platform to access real-time road monitoring data and contribute to
            better infrastructure management in your region.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-light-olive text-forest-green font-semibold py-3 px-6 rounded-lg hover:bg-light-olive/90 transition-colors"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;