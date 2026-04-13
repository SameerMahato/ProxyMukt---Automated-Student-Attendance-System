import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function FacultyAlerts() {
  const alerts = [
    { type: 'warning', title: 'Low Attendance Alert', message: 'Student John Doe has attendance below 75%', time: '2 hours ago' },
    { type: 'error', title: 'Proxy Detection', message: 'Suspicious activity detected in CS301 session', time: '5 hours ago' },
    { type: 'info', title: 'Session Reminder', message: 'Database Management class starts in 30 minutes', time: '1 day ago' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'error': return <AlertCircle className="text-red-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
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
            >
              <h1 className="text-4xl font-bold text-white mb-2">Alerts</h1>
              <p className="text-gray-400">System notifications and warnings</p>
            </motion.div>

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
                      <h3 className="text-white font-semibold mb-1">{alert.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{alert.message}</p>
                      <p className="text-gray-500 text-xs">{alert.time}</p>
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
