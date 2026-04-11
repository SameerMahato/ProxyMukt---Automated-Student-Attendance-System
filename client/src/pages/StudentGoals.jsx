import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Target, 
  Flame, 
  Trophy, 
  Star, 
  Zap, 
  CheckCircle2, 
  TrendingUp,
  Award,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function StudentGoals() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get('/analytics/student');
      setData(response.data.data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader size="lg" />
    </div>
  );

  const streak = data?.overall.streak || 0;
  const attendancePercentage = data?.overall.percentage || 0;
  const points = data?.overall.points || 0;

  const goals = [
    { title: 'Maintain 75% Attendance', progress: attendancePercentage, target: 75, icon: Target, color: 'blue' },
    { title: 'Maintain 7-Day Streak', progress: streak, target: 7, icon: Flame, color: 'orange' },
    { title: 'Earn 1000 Points', progress: points, target: 1000, icon: Star, color: 'yellow' },
    { title: 'Perfect Weekly Record', progress: 80, target: 100, icon: CheckCircle2, color: 'green' }
  ];

  const badges = [
    { title: 'Early Bird', icon: Zap, active: true, desc: 'Marked attendance in first 5 mins' },
    { title: 'Unstoppable', icon: Flame, active: streak >= 5, desc: 'Maintain a 5-day streak' },
    { title: 'Scholar', icon: Award, active: attendancePercentage >= 90, desc: 'Maintain 90%+ attendance' },
    { title: 'Leader', icon: Trophy, active: activeRank <= 10, desc: 'Reach top 10 on leaderboard' }
  ];

  const activeRank = 5; // To be dynamic later

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
                Goals & Achievements
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Set your targets and celebrate your milestones</p>
            </motion.div>

            {/* Streak Hero Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center animate-pulse">
                    <Flame size={40} className="text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold dark:text-white">{streak} Day Streak!</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">You're on fire! Keep it up to level up.</p>
                  </div>
                </div>
                <div className="flex bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${i < streak ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Goals List */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Target size={24} className="text-indigo-600" />
                  Active Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal, i) => (
                    <GlassCard key={i} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl bg-${goal.color}-100 dark:bg-${goal.color}-900/30 text-${goal.color}-600 dark:text-${goal.color}-400`}>
                          <goal.icon size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target: {goal.target}%</span>
                      </div>
                      <h4 className="font-bold text-lg mb-4">{goal.title}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-indigo-600">{Math.round((goal.progress / goal.target) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                            className={`h-full bg-${goal.color}-600 rounded-full`}
                          />
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Badges / Achievements */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Award size={24} className="text-purple-600" />
                  Achievements
                </h3>
                <GlassCard className="p-6 space-y-6">
                  {badges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${badge.active ? 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800' : 'bg-slate-100 border-slate-200 text-slate-300 dark:bg-slate-800 dark:border-slate-700 grayscale'}`}>
                        <badge.icon size={24} className={badge.active ? 'animate-bounce' : ''} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${badge.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{badge.title}</h4>
                        <p className="text-xs text-slate-500">{badge.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  <button className="w-full py-3 mt-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    View All Achievements
                  </button>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
