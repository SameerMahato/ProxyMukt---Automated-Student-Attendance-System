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
  Plus, 
  Trash2, 
  Calendar, 
  Globe, 
  Users, 
  Send,
  AlertTriangle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';

export default function FacultyAnnouncementManager() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'INFO',
    scope: 'GLOBAL',
    targetId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [annRes, classRes] = await Promise.all([
        axiosInstance.get('/announcements'),
        axiosInstance.get('/classes')
      ]);
      setAnnouncements(annRes.data.data.announcements || []);
      setClasses(classRes.data.data.classes || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/announcements', formData);
      setShowCreate(false);
      setFormData({ title: '', content: '', type: 'INFO', scope: 'GLOBAL', targetId: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating announcement:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axiosInstance.delete(`/announcements/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting announcement:', err);
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
              className="flex justify-between items-center"
            >
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Announcement Center</h1>
                <p className="text-slate-500 font-medium">Manage broad and class-specific broadcasts</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20"
              >
                <Plus size={20} />
                Create Broadcast
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-6">
              {announcements.map((ann, i) => (
                <motion.div
                  key={ann._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-8">
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          ann.type === 'URGENT' ? 'bg-rose-50 text-rose-600' :
                          ann.type === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                          'bg-indigo-50 text-indigo-600'
                        }`}>
                          <Megaphone size={28} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg border ${
                              ann.type === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              ann.type === 'WARNING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-indigo-50 text-indigo-600 border-indigo-100'
                            }`}>
                              {ann.type}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black tracking-widest uppercase rounded-lg flex items-center gap-1.5">
                              {ann.scope === 'GLOBAL' ? <Globe size={12}/> : <Users size={12}/>}
                              {ann.scope}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{ann.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                            {ann.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 pt-2">
                            <span className="flex items-center gap-1.5 font-bold uppercase"><Calendar size={14}/> {new Date(ann.createdAt).toLocaleDateString()}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>By {ann.sender?.name || 'System'}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(ann._id)}
                        className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              {announcements.length === 0 && (
                <div className="text-center py-24 bg-white/50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                  <Megaphone size={64} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-400">No broadcasts found</h3>
                </div>
              )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
              {showCreate && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] max-w-2xl w-full shadow-2xl relative"
                  >
                    <button onClick={() => setShowCreate(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl transition-all">
                      <X className="text-slate-400" />
                    </button>
                    
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">New Broadcast</h2>
                    
                    <form onSubmit={handleCreate} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Headline</label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                          placeholder="Broadcast title..."
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Alert Level</label>
                          <select 
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                          >
                            <option value="INFO">Info</option>
                            <option value="WARNING">Warning</option>
                            <option value="URGENT">Urgent Success</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Audience Scope</label>
                          <select 
                             className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                             value={formData.scope}
                             onChange={(e) => setFormData({...formData, scope: e.target.value, targetId: e.target.value === 'GLOBAL' ? '' : formData.targetId})}
                          >
                            <option value="GLOBAL">Global</option>
                            <option value="CLASS">Class Specific</option>
                          </select>
                        </div>
                      </div>

                      {formData.scope === 'CLASS' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Class</label>
                          <select 
                             required={formData.scope === 'CLASS'}
                             className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                             value={formData.targetId}
                             onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                          >
                            <option value="">Choose a class...</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                          </select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Message Body</label>
                        <textarea 
                          required
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium h-32"
                          placeholder="What would you like to announce?"
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                      >
                        <Send size={20} />
                        Publish Now
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
