import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar, 
  PieChart as PieChartIcon, 
  BarChart2, 
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

export default function StudentPerformance() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const response = await axiosInstance.get('/analytics/student');
      setData(response.data.data);
    } catch (err) {
      console.error('Error fetching performance:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader size="lg" />
    </div>
  );

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const attendanceData = data?.monthlyTrend?.map(item => ({
    name: item.month,
    percentage: parseFloat(item.percentage)
  })) || [];

  const classData = data?.byClass?.map(cls => ({
    name: cls.classCode,
    attendance: parseFloat(cls.percentage),
    fullMark: 100
  })) || [];

  const pieData = [
    { name: 'Attended', value: data?.overall.totalAttended || 0 },
    { name: 'Missed', value: (data?.overall.totalSessions || 0) - (data?.overall.totalAttended || 0) }
  ];

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950">
      <AnimatedBackground />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 relative z-10 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Performance Analytics
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Detailed breakdown of your academic attendance and trends</p>
            </motion.div>

            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Overall Rate', value: `${data?.overall.percentage}%`, icon: TrendingUp, color: 'indigo' },
                { label: 'Classes Attended', value: data?.overall.totalAttended, icon: CheckCircle, color: 'green' },
                { label: 'Points Earned', value: data?.overall.points || 0, icon: Award, color: 'purple' },
                { label: 'Current Streak', value: `${data?.overall.streak} Days`, icon: Activity, color: 'orange' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center mb-4`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{stat.label}</p>
                  <h3 className="text-2xl font-bold dark:text-white mt-1">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Attendance Trend Line Chart */}
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-600" />
                  Attendance Trend (Monthly)
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceData}>
                      <defs>
                        <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPct)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Subject Wise Bar Chart */}
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart2 size={20} className="text-emerald-600" />
                  Subject Breakdown
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontWeight: 600, fontSize: 12}} width={80} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="attendance" radius={[0, 10, 10, 0]} barSize={20}>
                        {classData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Attendance Distribution Pie Chart */}
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <PieChartIcon size={20} className="text-purple-600" />
                  Overall Distribution
                </h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Risk Analysis Card */}
              <GlassCard className="p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-100 dark:border-red-900/30">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle size={20} />
                  Risk Analysis
                </h3>
                <div className="space-y-6">
                  {data?.byClass.filter(c => parseFloat(c.percentage) < 75).length > 0 ? (
                    <>
                      <p className="text-red-600 dark:text-red-300 font-medium">
                        You have {data?.byClass.filter(c => parseFloat(c.percentage) < 75).length} subjects below the required 75% threshold.
                      </p>
                      <div className="space-y-3">
                        {data?.byClass.filter(c => parseFloat(c.percentage) < 75).map(cls => (
                          <div key={cls.classCode} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-red-200 dark:border-red-800">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">{cls.className}</span>
                              <span className="ml-2 text-xs font-bold text-red-500">{cls.classCode}</span>
                            </div>
                            <span className="text-red-600 font-extrabold">{cls.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-green-700 dark:text-green-400">Low Risk Status</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Maintain your current attendance to avoid any academic hurdles.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Missing icon import fixes
import { CheckCircle } from 'lucide-react';
