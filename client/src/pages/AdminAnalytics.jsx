import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, Users, Calendar, Activity } from 'lucide-react';

export default function AdminAnalytics() {
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
              <h1 className="text-4xl font-bold text-white mb-2">System Analytics</h1>
              <p className="text-gray-400">Comprehensive system-wide analytics and insights</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Users className="text-blue-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-4xl font-bold text-white">1,245</p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">System Uptime</p>
                <p className="text-4xl font-bold text-green-500">99.9%</p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Activity className="text-purple-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Active Sessions</p>
                <p className="text-4xl font-bold text-white">156</p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="text-orange-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Avg Attendance</p>
                <p className="text-4xl font-bold text-white">87%</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">User Growth Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart: User Registration Over Time
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Department-wise Distribution</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart: Students by Department
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Session Activity</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart: Sessions per Day
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Attendance Heatmap</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart: Attendance by Day/Time
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
