import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AlertTriangle, AlertCircle, Info, Shield, XCircle } from 'lucide-react';

export default function AdminAlerts() {
  const alerts = [
    { type: 'critical', title: 'Security Breach Attempt', message: 'Multiple failed login attempts detected from IP 192.168.1.100', time: '10 min ago' },
    { type: 'warning', title: 'System Resource Alert', message: 'Database storage usage above 85%', time: '1 hour ago' },
    { type: 'error', title: 'Proxy Detection', message: 'Suspicious proxy activity detected in multiple sessions', time: '2 hours ago' },
    { type: 'info', title: 'System Update Available', message: 'New security patch available for installation', time: '5 hours ago' },
    { type: 'warning', title: 'Low Attendance Alert', message: '15 students have attendance below 75%', time: '1 day ago' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'critical': return <XCircle className="text-red-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'error': return <AlertCircle className="text-orange-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-orange-500/10 border-orange-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">System Alerts</h1>
                <p className="text-gray-400">Critical system notifications and warnings</p>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                Mark All as Read
              </button>
            </motion.div>

            {/* Alert Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Critical</p>
                    <p className="text-3xl font-bold text-red-500">1</p>
                  </div>
                  <XCircle className="text-red-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Errors</p>
                    <p className="text-3xl font-bold text-orange-500">1</p>
                  </div>
                  <AlertCircle className="text-orange-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Warnings</p>
                    <p className="text-3xl font-bold text-yellow-500">2</p>
                  </div>
                  <AlertTriangle className="text-yellow-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Info</p>
                    <p className="text-3xl font-bold text-blue-500">1</p>
                  </div>
                  <Info className="text-blue-500" size={32} />
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-[#1a1f2e] rounded-2xl p-6 border ${getBgColor(alert.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      {getIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold">{alert.title}</h3>
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg uppercase font-bold">
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs">{alert.time}</p>
                        <button className="px-4 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-all">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
