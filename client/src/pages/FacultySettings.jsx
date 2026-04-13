import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { Settings, User, Bell, Lock, Save, X } from 'lucide-react';

export default function FacultySettings() {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axiosInstance.put('/auth/profile', profileData);
      setAuth(data.data.user, useAuthStore.getState().token);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setLoading(true);
      await axiosInstance.put('/auth/notifications', notifications);
      alert('Notification preferences updated!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      alert('Failed to update preferences: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </motion.div>

            {/* Profile Settings */}
            <form onSubmit={handleProfileUpdate} className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>

            {/* Notification Settings */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-purple-500" size={24} />
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white">Email Notifications</span>
                  <input 
                    type="checkbox" 
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    className="w-5 h-5 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white">Push Notifications</span>
                  <input 
                    type="checkbox" 
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    className="w-5 h-5 cursor-pointer" 
                  />
                </label>
                <button
                  onClick={handleNotificationUpdate}
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="text-red-500" size={24} />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
              >
                Change Password
              </button>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#1a1f2e] p-8 rounded-2xl max-w-md w-full border border-gray-800"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Change Password</h2>
                    <button 
                      onClick={() => setShowPasswordModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <X className="text-gray-400" size={24} />
                    </button>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
