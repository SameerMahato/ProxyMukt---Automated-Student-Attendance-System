import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { notificationAPI } from '../services/api';
import { Bell, Check } from 'lucide-react';

export default function FacultyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await notificationAPI.getNotifications();
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

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
              <button 
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={20} />
                Mark All Read ({unreadCount})
              </button>
            </motion.div>

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-gray-800 text-center">
                  <Bell className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif, i) => (
                  <motion.div
                    key={notif._id}
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
                        <div className="flex items-center justify-between">
                          <p className="text-gray-500 text-xs">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkAsRead(notif._id)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-all"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
