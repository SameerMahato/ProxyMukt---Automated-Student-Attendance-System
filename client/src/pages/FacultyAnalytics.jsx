import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export default function FacultyAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/analytics/attendance');
      setAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
                <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-gray-400">Attendance trends and performance insights</p>
              </div>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-[#1a1f2e] border border-gray-800 rounded-xl text-white"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="text-blue-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Overall Attendance</p>
                <p className="text-4xl font-bold text-white">
                  {analytics?.overview?.averageAttendance || 0}%
                </p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Trend</p>
                <p className="text-4xl font-bold text-green-500">
                  +{analytics?.trend || 5}%
                </p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Users className="text-purple-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Active Students</p>
                <p className="text-4xl font-bold text-white">
                  {analytics?.overview?.totalStudents || 0}
                </p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <Calendar className="text-orange-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Sessions This Month</p>
                <p className="text-4xl font-bold text-white">
                  {analytics?.overview?.totalSessions || 0}
                </p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Attendance Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart Component Here
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Class Performance</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart Component Here
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
