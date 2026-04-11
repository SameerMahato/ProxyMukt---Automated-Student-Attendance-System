import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Megaphone, 
  Bell, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';

export default function StudentAnnouncements() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Get student's classes to fetch relevant announcements
      const classesRes = await axiosInstance.get('/classes');
      const classIds = classesRes.data.data.classes.map(c => c._id).join(',');
      
      const response = await axiosInstance.get(`/announcements?classIds=${classIds}`);
      setAnnouncements(response.data.data.announcements);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (type) => {
    switch (type) {
      case 'URGENT': return { icon: AlertCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800' };
      case 'WARNING': return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
      case 'SUCCESS': return { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
      default: return { icon: Info, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
    }
  };

  const filteredAnnouncements = filter === 'ALL' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader size="lg" />
    </div>
  );

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
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  Announcements
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Stay informed with the latest updates from your campus</p>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search announcements..." 
                  className="pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-w-[300px] shadow-sm"
                />
              </div>
            </motion.div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {['ALL', 'URGENT', 'INFO', 'WARNING', 'SUCCESS'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border ${
                    filter === type 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Feed */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredAnnouncements.map((item, i) => {
                  const config = getStatusConfig(item.type);
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard className="p-0 overflow-hidden group hover:border-indigo-500/30 transition-all">
                        <div className="p-8">
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl ${config.color}`}>
                                <config.icon size={24} />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                  <span className="flex items-center gap-1.5"><User size={14} /> {item.sender.name}</span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${config.color}`}>
                              {item.type}
                            </span>
                          </div>
                          
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                              {item.content}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex -space-x-2">
                              {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                                </div>
                              ))}
                              <div className="px-3 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                +{Math.floor(Math.random() * 50)} more
                              </div>
                            </div>
                            <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all">
                              Read more <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredAnnouncements.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Megaphone size={40} className="text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Announcements</h3>
                  <p className="text-slate-500 font-medium">You're all caught up! No new updates at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
