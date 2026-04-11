import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  QrCode, 
  History, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

export default function StudentQRHistory() {
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetchQRHistory();
  }, []);

  const fetchQRHistory = async () => {
    try {
      // Reusing my-attendance but filtering for QR marked ones if needed, 
      // or fetching from a specific endpoint if implemented
      const response = await axiosInstance.get('/attendance/my-attendance');
      setScans(response.data.data.attendance || []);
    } catch (err) {
      console.error('Error fetching QR history:', err);
    } finally {
      setLoading(false);
    }
  };

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
                  QR History
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Log of all your QR code attendance markings</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400">
                  <Filter size={18} />
                  Filter
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search history..." 
                    className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* History Table/List */}
            <div className="space-y-4">
              {scans.map((scan, i) => (
                <motion.div
                  key={scan._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
                          <QrCode size={28} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{scan.class?.name || 'Unknown Class'}</h3>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{scan.class?.code}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-slate-400" />
                          <span>{new Date(scan.markedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-slate-400" />
                          <span>{new Date(scan.markedAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-slate-400" />
                          <span>Main Campus</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg tracking-widest border border-emerald-100 dark:border-emerald-800 uppercase flex items-center gap-1.5">
                          <CheckCircle2 size={12} />
                          Verified
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <ExternalLink size={20} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              {scans.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                  <History size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">No scan history found.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
