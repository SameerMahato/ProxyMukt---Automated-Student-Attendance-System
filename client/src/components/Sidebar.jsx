import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, QrCode, BarChart3, Radar, FileText, AlertTriangle, Users, BookOpen, Clock, Megaphone, Settings, Bell, Target, Trophy, UserPlus, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    fetchUnreadCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchUnreadCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCounts = async () => {
    try {
      const { data } = await notificationAPI.getNotifications();
      setUnreadNotifications(data.data.unreadCount || 0);
      // For alerts, we can use a similar count or set it based on notification types
      const alertCount = data.data.notifications?.filter(n => 
        !n.read && (n.type === 'alert' || n.type === 'warning' || n.type === 'error')
      ).length || 0;
      setUnreadAlerts(alertCount);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
      // Silently fail - don't show error to user for background updates
    }
  };
  
  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { path: '/admin', icon: Home, label: 'Dashboard' },
          { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
          { path: '/admin/reports', icon: FileText, label: 'Reports' },
          { path: '/admin/alerts', icon: AlertTriangle, label: 'Alerts', badge: unreadAlerts },
          { path: '/admin/users', icon: Users, label: 'User Management' },
          { path: '/admin/timetable', icon: Calendar, label: 'Timetable Manager' },
          { path: '/admin/leaves', icon: FileText, label: 'Leave Requests' },
          { path: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
          { path: '/admin/system', icon: Settings, label: 'System Management' },
          { path: '/admin/sessions', icon: Clock, label: 'Sessions' },
          { path: '/admin/notifications', icon: Bell, label: 'Notifications', badge: unreadNotifications },
        ];
      case 'FACULTY':
        return [
          { path: '/faculty', icon: Home, label: 'Dashboard' },
          { path: '/faculty/analytics', icon: BarChart3, label: 'Analytics' },
          { path: '/faculty/reports', icon: FileText, label: 'Reports' },
          { path: '/faculty/alerts', icon: AlertTriangle, label: 'Alerts', badge: unreadAlerts },
          { path: '/faculty/students', icon: Users, label: 'Students' },
          { path: '/faculty/classes', icon: BookOpen, label: 'Classes' },
          { path: '/faculty/leaves', icon: FileText, label: 'Leave & Appeals' },
          { path: '/faculty/announcements', icon: Megaphone, label: 'Announcements' },
          { path: '/faculty/sessions', icon: Clock, label: 'Sessions' },
          { path: '/faculty/notifications', icon: Bell, label: 'Notifications', badge: unreadNotifications },
          { path: '/faculty/settings', icon: Settings, label: 'Settings' },
        ];
      case 'STUDENT':
        return [
          { path: '/student', icon: Home, label: 'Dashboard' },
          { path: '/student/join-class', icon: UserPlus, label: 'Join Classes' },
          { path: '/scan', icon: QrCode, label: 'Scan QR' },
          { path: '/auto-attendance', icon: Radar, label: 'Auto-Attendance' },
          { path: '/student/attendance', icon: Calendar, label: 'My Attendance' },
          { path: '/student/performance', icon: BarChart3, label: 'Performance' },
          { path: '/student/goals', icon: Target, label: 'Goals & Streaks' },
          { path: '/student/leave', icon: FileText, label: 'Leave/Appeals' },
          { path: '/student/timetable', icon: Calendar, label: 'Timetable' },
          { path: '/student/leaderboard', icon: Trophy, label: 'Leaderboard' },
          { path: '/student/qr-history', icon: QrCode, label: 'QR History' },
          { path: '/student/sessions', icon: Clock, label: 'Sessions' },
          { path: '/student/announcements', icon: Megaphone, label: 'Announcements' },
          { path: '/student/notifications', icon: Bell, label: 'Notifications', badge: unreadNotifications },
          { path: '/student/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };
  
  const menuItems = getMenuItems();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <>
      {/* Mobile Menu Button - Fixed at top */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop: Always visible, Mobile: Slide in/out */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          w-64
          backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 
          border-r border-white/20 dark:border-gray-700/50
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 space-y-2 mt-16 lg:mt-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 hover:scale-105'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                )}
                
                {/* Icon with Animation */}
                <div className={`transition-transform duration-300 relative ${isActive ? '' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                  <Icon size={20} />
                  {/* Badge for unread counts */}
                  {item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <span className="font-medium flex-1 text-sm lg:text-base">{item.label}</span>
                
                {/* Badge next to label (alternative position) */}
                {item.badge > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                
                {/* Hover Shimmer Effect */}
                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
