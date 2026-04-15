import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import StatsCard from '../components/StatsCard';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import axiosInstance from '../utils/axiosInstance';
import { 
  QrCode, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Clock, 
  Zap,
  LayoutDashboard,
  Bell,
  Settings
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    attendedSessions: 0,
    percentage: 0,
  });
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);
  
  const fetchData = async () => {
    try {
      const [classesRes, attendanceRes, statsRes] = await Promise.all([
        axiosInstance.get('/classes'),
        axiosInstance.get('/attendance/my-attendance'),
        axiosInstance.get('/analytics/student')
      ]);
      
      setClasses(classesRes.data.data.classes || []);
      setAttendance(attendanceRes.data.data.attendance || []);
      
      if (statsRes.data.success) {
        setStats({
          totalSessions: statsRes.data.data.overall.totalSessions,
          attendedSessions: statsRes.data.data.overall.totalAttended,
          percentage: statsRes.data.data.overall.percentage,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Student Dashboard
                </h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                  Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.name}</span>! Track your attendance
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/scan')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 min-h-[44px]"
              >
                <QrCode size={20} />
                <span className="font-bold">Scan QR</span>
              </motion.button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <StatsCard
                icon={BookOpen}
                title="Enrolled Classes"
                value={classes.length}
                subtitle="4 active courses"
                color="blue"
                delay={0}
                isLive
              />
              
              <StatsCard
                icon={Calendar}
                title="Sessions Attended"
                value={stats.attendedSessions}
                subtitle={`out of ${stats.totalSessions} total sessions`}
                color="green"
                delay={0.1}
                isLive
              />
              
              <StatsCard
                icon={TrendingUp}
                title="Attendance Rate"
                value={`${stats.percentage}%`}
                subtitle={stats.percentage >= 75 ? 'Above 75% - Keep it up!' : 'Below 75% - Needs attention'}
                color={stats.percentage >= 75 ? 'green' : 'orange'}
                delay={0.2}
                isLive
              />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {/* My Classes List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                <GlassCard className="p-4 sm:p-6 lg:p-8 h-full">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8 flex items-center justify-between">
                    <span>My Classes</span>
                    <Settings size={20} className="text-slate-400 cursor-pointer hover:text-indigo-500 transition-colors" />
                  </h2>
                  <div className="space-y-4">
                    {classes.map((cls, index) => (
                      <motion.div
                        key={cls._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 10 }}
                        className="p-4 sm:p-5 lg:p-6 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                              <BookOpen size={20} className="sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{cls.name}</h3>
                              <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{cls.code}</p>
                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                👨‍🏫 {cls.faculty?.name || 'Faculty/'}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.2 }}
                            className="p-2"
                          >
                            <Award className="text-yellow-500" size={28} />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
              
              {/* Recent Attendance */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <GlassCard className="p-4 sm:p-6 lg:p-8 h-full">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8 flex items-center justify-between">
                    <span>Recent Attendance</span>
                    <Clock size={20} className="text-slate-400" />
                  </h2>
                  <div className="space-y-4">
                    {attendance.slice(0, 5).map((record, index) => (
                      <motion.div
                        key={record._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 sm:p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate">{record.class?.name}</h3>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            📅 {new Date(record.markedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="px-3 sm:px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-[10px] rounded-lg tracking-widest flex items-center gap-1 whitespace-nowrap">
                          <CheckCircle size={12} />
                          <span className="hidden sm:inline">PRESENT</span>
                          <span className="sm:hidden">✓</span>
                        </div>
                      </motion.div>
                    ))}
                    {attendance.length === 0 && (
                      <div className="text-center py-12 text-slate-400 italic">
                        No recent attendance records
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
