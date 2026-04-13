import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Settings, User, Bell, Lock, Globe } from 'lucide-react';

export default function FacultySettings() {
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
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Faculty Name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="faculty@example.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-purple-500" size={24} />
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-white">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-white">Push Notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="text-red-500" size={24} />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>
              <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">
                Change Password
              </button>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
