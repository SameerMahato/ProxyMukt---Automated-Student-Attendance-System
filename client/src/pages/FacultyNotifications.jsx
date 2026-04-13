import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Bell, Check } from 'lucide-react';

export default function FacultyNotifications() {
  const notifications = [
    { id: 1, title: 'New Leave Request', message: 'John Doe submitted a leave request', time: '5 min ago', read: false },
    { id: 2, title: 'Session Completed', message: 'Database Management session ended successfully', time: '1 hour ago', read: false },
    { id: 3, title: 'Low Attendance Alert', message: 'Student attendance below threshold', time: '2 hours ago', read: true },
  ];

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
                <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
                <p className="text-gray-400">Stay updated with system notifications</p>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
                <Check size={20} />
                Mark All Read
              </button>
            </motion.div>

            <div className="space-y-4">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-[#1a1f2e] rounded-2xl p-6 border ${notif.read ? 'border-gray-800' : 'border-blue-500/30 bg-blue-500/5'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notif.read ? 'bg-gray-800' : 'bg-blue-500/10'}`}>
                      <Bell className={notif.read ? 'text-gray-400' : 'text-blue-500'} size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-semibold">{notif.title}</h3>
                        {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
                      <p className="text-gray-500 text-xs">{notif.time}</p>
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
