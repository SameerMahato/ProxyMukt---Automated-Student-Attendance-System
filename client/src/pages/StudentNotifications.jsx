import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Bell, 
  Inbox, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  Check,
  MoreVertical
} from 'lucide-react';

// Simple toast notification function
const toast = {
  success: (message) => alert(message),
  error: (message) => alert(message)
};

export default function StudentNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950">
      <AnimatedBackground />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center"
            >
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  Notification Center
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Keep track of your academic updates and alerts</p>
              </div>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllRead}
                  className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-800 font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all"
                >
                  <Check size={20} />
                  <span>Mark all as read</span>
                </motion.button>
              )}
            </motion.div>

            {/* Notification List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {notifications.map((notif, i) => (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard className={`p-6 border-l-4 transition-all ${
                      notif.read ? 'border-l-slate-200 dark:border-l-slate-800' : 'border-l-indigo-600 shadow-xl shadow-indigo-500/5'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl ${notif.read ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'}`}>
                          {notif.type === 'ATTENDANCE' ? <CheckCircle2 size={24} /> : 
                           notif.type === 'ALERT' ? <AlertCircle size={24} /> : 
                           notif.type === 'SYSTEM' ? <Calendar size={24} /> : 
                           <Bell size={24} />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-bold text-lg ${notif.read ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                              {notif.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {!notif.read && (
                                <button 
                                  onClick={() => markAsRead(notif._id)}
                                  className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all"
                                  title="Mark as read"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm font-medium ${notif.read ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(notif.createdAt).toLocaleString()}</span>
                            {notif.data?.sender && (
                              <span className="flex items-center gap-1.5"><User size={14} /> {notif.data.sender}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>

              {notifications.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Inbox size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Notifications</h3>
                  <p className="text-slate-500 font-medium">Your inbox is empty. We'll alert you when something happens!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
