import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Moon, 
  Sun,
  Camera,
  Mail,
  Save,
  ChevronRight,
  LogOut
} from 'lucide-react';

// Simple toast notification function
const toast = {
  success: (message) => alert(message),
  error: (message) => alert(message)
};

export default function StudentSettings() {
  const { user, logout, updateProfile: updateStoreProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    studentId: user?.studentId || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/auth/update-profile', profileData);
      toast.success('Profile updated successfully!');
      // Update local store if needed
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await axiosInstance.put('/auth/update-password', passwordData);
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950">
      <AnimatedBackground />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Settings
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your account preferences and security</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      activeSection === section.id 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-2' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon size={20} />
                      <span>{section.label}</span>
                    </div>
                    <ChevronRight size={16} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
                
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all mt-8"
                >
                  <LogOut size={20} />
                  <span>Logout Account</span>
                </button>
              </div>

              {/* Main Form Area */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {activeSection === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <GlassCard className="p-8">
                        <div className="flex items-center gap-6 mb-8">
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-[32px] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl shadow-indigo-500/10">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                              <Camera size={16} />
                            </button>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Student ID: {user?.studentId || 'N/A'}</p>
                          </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                  type="text" 
                                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                                  value={profileData.name}
                                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                  type="email" 
                                  disabled 
                                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none opacity-50 font-medium"
                                  value={user?.email}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Department / Faculty</label>
                            <input 
                              type="text" 
                              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                              value={profileData.department}
                              onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                            />
                          </div>
                          <button 
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all ml-auto disabled:opacity-50"
                          >
                            {loading ? <Loader size="sm" /> : <Save size={20} />}
                            Save Changes
                          </button>
                        </form>
                      </GlassCard>
                    </motion.div>
                  )}

                  {activeSection === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <GlassCard className="p-8">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                          <Shield size={24} className="text-indigo-600" />
                          Security Settings
                        </h3>
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Current Password</label>
                            <input 
                              type="password" 
                              required
                              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                              <input 
                                type="password" 
                                required
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                              <input 
                                type="password" 
                                required
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              />
                            </div>
                          </div>
                          <button 
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all ml-auto flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {loading ? <Loader size="sm" /> : <Lock size={20} />}
                            Update Password
                          </button>
                        </form>
                      </GlassCard>
                    </motion.div>
                  )}
                  
                  {/* Additional sections would follow similar patterns */}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
