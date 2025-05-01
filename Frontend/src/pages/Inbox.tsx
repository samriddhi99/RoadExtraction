import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'New Road Damage Detected',
    message: 'AI system has detected significant road damage on Highway 101, requiring immediate attention.',
    type: 'warning',
    date: '2024-03-15',
    read: false
  },
  {
    id: '2',
    title: 'Monthly Report Available',
    message: 'The February 2024 road condition report is now available for review.',
    type: 'info',
    date: '2024-03-14',
    read: true
  },
  {
    id: '3',
    title: 'Maintenance Complete',
    message: 'Scheduled maintenance on Bridge 45 has been completed successfully.',
    type: 'success',
    date: '2024-03-13',
    read: true
  }
];

const Inbox: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-playfair font-bold text-forest-green flex items-center">
            <Bell className="mr-3" size={28} />
            Inbox
          </h1>
          <span className="bg-forest-green text-cream px-3 py-1 rounded-full text-sm">
            {alerts.filter(a => !a.read).length} unread
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-forest-green text-cream">
              <h2 className="font-semibold">Notifications</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {alerts.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlert(alert);
                    markAsRead(alert.id);
                  }}
                  className={`w-full text-left p-4 hover:bg-light-olive/10 transition-colors ${
                    selectedAlert?.id === alert.id ? 'bg-light-olive/20' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {getAlertIcon(alert.type)}
                    <div className="ml-3">
                      <h3 className={`font-medium ${!alert.read ? 'text-forest-green' : 'text-gray-600'}`}>
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-500">{alert.date}</p>
                    </div>
                    {!alert.read && (
                      <span className="ml-2 w-2 h-2 bg-forest-green rounded-full"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            {selectedAlert ? (
              <div>
                <div className="flex items-center mb-6">
                  {getAlertIcon(selectedAlert.type)}
                  <h2 className="text-xl font-playfair font-bold text-forest-green ml-3">
                    {selectedAlert.title}
                  </h2>
                </div>
                <p className="text-dark-slate mb-4">{selectedAlert.message}</p>
                <div className="text-sm text-gray-500">
                  Received on {selectedAlert.date}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a notification to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;