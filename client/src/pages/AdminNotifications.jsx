import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Bell, Check, Send } from 'lucide-react';

export default function AdminNotifications() {
  const notifications = [
    { id: 1, title: 'System Maintenance Scheduled', message: 'System maintenance on Sunday 2 AM - 4 AM', time: '10 min ago', read: false, priority: 'high' },
    { id: 2, title: 'New Faculty Registration', message: 'Dr. Emily Johnson registered as new faculty', time: '1 hour ago', read: false, priority: 'normal' },
    { id: 3, title: 'Bulk Student Import Completed', message: '150 students imported successfully', time: '2 hours ago', read: true, priority: 'normal' },
    { id: 4, title: 'Security Alert Resolved', message: 'Security breach attempt blocked and logged', time: '5 hours ago', read: true, priority: 'high' },
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
                <h1 className="text-4xl font-bold text-white mb-2">System Notifications</h1>
                <p className="text-gray-400">Manage system-wide notifications and announcements</p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
                  <Send size={20} />
                  Send Notification
                </button>
                <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center gap-2">
                  <Check size={20} />
                  Mark All Read
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Unread</p>
                    <p className="text-3xl font-bold text-blue-500">2</p>
                  </div>
                  <Bell className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">High Priority</p>
                    <p className="text-3xl font-bold text-red-500">2</p>
                  </div>
                  <Bell className="text-red-500" size={32} />
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Today</p>
                    <p className="text-3xl font-bold text-white">4</p>
                  </div>
                  <Bell className="text-gray-400" size={32} />
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-[#1a1f2e] rounded-2xl p-6 border ${
                    notif.read 
                      ? 'border-gray-800' 
                      : notif.priority === 'high'
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-blue-500/30 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      notif.read 
                        ? 'bg-gray-800' 
                        : notif.priority === 'high'
                        ? 'bg-red-500/10'
                        : 'bg-blue-500/10'
                    }`}>
                      <Bell className={
                        notif.read 
                          ? 'text-gray-400' 
                          : notif.priority === 'high'
                          ? 'text-red-500'
                          : 'text-blue-500'
                      } size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-semibold">{notif.title}</h3>
                          {notif.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded font-bold uppercase">
                              High Priority
                            </span>
                          )}
                        </div>
                        {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs">{notif.time}</p>
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-all">
                              Mark as Read
                            </button>
                          )}
                          <button className="px-3 py-1 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-all">
                            View Details
                          </button>
                        </div>
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
