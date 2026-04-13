import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  FileText,
  Shield,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    try {
      const { data } = await axiosInstance.get('/attendance/analytics');
      setAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Admin Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  System-wide attendance and security insights
                </p>
              </div>
              <div className="flex gap-3">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                  <FileText size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 w-fit">
              {['Overview', 'Security', 'Performance', 'Reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'Overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-4 gap-6 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</span>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Users size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {analytics?.overview?.totalStudents || 0}
                      </div>
                      <p className="text-xs text-gray-500">Enrolled students</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Attendance</span>
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                          <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {analytics?.overview?.averageAttendance || 0}%
                      </div>
                      <p className="text-xs text-gray-500">System-wide average</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk Students</span>
                        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                          <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {analytics?.overview?.atRiskStudents || 0}
                      </div>
                      <p className="text-xs text-gray-500">Below 75% attendance</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</span>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                          <CheckCircle size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {analytics?.overview?.totalSessions || 0}
                      </div>
                      <p className="text-xs text-gray-500">This month</p>
                    </motion.div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          Attendance Trend (Last 30 Days)
                        </h3>
                      </div>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-center text-gray-400">
                          <TrendingUp size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Chart: Attendance Trend Over Time</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                        Class-wise Attendance
                      </h3>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-center text-gray-400">
                          <Users size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Chart: Class Attendance Comparison</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Security Stats */}
                  <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proxy Attempts</span>
                        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                          <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">24</div>
                      <p className="text-xs text-red-500">+3 from last week</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked IPs</span>
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                          <Shield size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">12</div>
                      <p className="text-xs text-gray-500">Suspicious activity</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Face Verification</span>
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">98.5%</div>
                      <p className="text-xs text-green-500">Success rate</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</span>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">A+</div>
                      <p className="text-xs text-gray-500">Excellent</p>
                    </div>
                  </div>

                  {/* Security Charts */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                        Fraud Detection Timeline
                      </h3>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-center text-gray-400">
                          <AlertTriangle size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Chart: Fraud Attempts Over Time</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                        Risk Score Distribution
                      </h3>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-center text-gray-400">
                          <Shield size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Chart: Risk Levels by Category</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Performance' && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Performance Stats */}
                  <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">API Response Time</span>
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                          <Activity size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">145ms</div>
                      <p className="text-xs text-green-500">-12ms from last week</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</span>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">99.9%</div>
                      <p className="text-xs text-gray-500">Last 30 days</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Database Queries</span>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                          <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">1.2M</div>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</span>
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                          <Users size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">342</div>
                      <p className="text-xs text-gray-500">Currently online</p>
                    </div>
                  </div>

                  {/* Performance Charts */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                        Response Time Trend
                      </h3>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-center text-gray-400">
                          <Activity size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Chart: API Response Times</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                        Server Load
                      </h3>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-center text-gray-400">
                          <TrendingUp size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Chart: CPU & Memory Usage</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Reports' && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Reports Stats */}
                  <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated Reports</span>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">156</div>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled Reports</span>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                          <FileText size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">24</div>
                      <p className="text-xs text-gray-500">Active schedules</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Export Requests</span>
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                          <FileText size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">89</div>
                      <p className="text-xs text-gray-500">Last 7 days</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Insights</span>
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                          <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">42</div>
                      <p className="text-xs text-gray-500">Key findings</p>
                    </div>
                  </div>

                  {/* Reports List */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                      Recent Reports
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Monthly Attendance Summary', date: '2026-04-01', type: 'PDF', size: '2.4 MB' },
                        { name: 'Security Audit Report', date: '2026-03-28', type: 'PDF', size: '1.8 MB' },
                        { name: 'Performance Metrics', date: '2026-03-25', type: 'CSV', size: '856 KB' },
                        { name: 'Student Analytics', date: '2026-03-20', type: 'XLSX', size: '3.2 MB' },
                      ].map((report, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                              <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{report.name}</h4>
                              <p className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
