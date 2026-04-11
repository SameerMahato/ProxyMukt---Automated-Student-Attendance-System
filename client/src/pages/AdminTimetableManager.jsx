import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  BookOpen, 
  User, 
  MapPin, 
  ChevronRight,
  Filter,
  Search,
  Settings,
  X
} from 'lucide-react';

export default function AdminTimetableManager() {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState({});
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    room: '',
    facultyId: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tableRes, classRes, facultyRes] = await Promise.all([
        axiosInstance.get('/timetable/student'), // Reusing grouping logic
        axiosInstance.get('/classes'),
        axiosInstance.get('/users?role=FACULTY')
      ]);
      setTimetable(tableRes.data.data.timetable || {});
      setClasses(classRes.data.data.classes || []);
      setFaculty(facultyRes.data.data.users || []);
    } catch (err) {
      console.error('Error fetching timetable data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/timetable', formData);
      setShowAdd(false);
      setFormData({ classId: '', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: '', facultyId: '' });
      fetchData();
    } catch (err) {
      console.error('Error adding timetable entry:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this schedule entry?')) return;
    try {
      await axiosInstance.delete(`/timetable/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting entry:', err);
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-end"
            >
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Master Timetable</h1>
                <p className="text-slate-500 font-medium">Configure and manage academic schedules across all departments</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20"
              >
                <Plus size={20} />
                Add Schedule
              </motion.button>
            </motion.div>

            {/* Timetable Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {days.map((day) => (
                <div key={day} className="space-y-4">
                  <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{day}</h3>
                  </div>
                  <div className="space-y-3">
                    {timetable[day]?.map((entry) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative"
                      >
                        <GlassCard className="p-4 border-l-4 border-l-indigo-500">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                {entry.class?.name}
                              </h4>
                              <button 
                                onClick={() => handleDelete(entry._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                              <span className="flex items-center gap-1"><Clock size={10}/> {entry.startTime} - {entry.endTime}</span>
                              <span className="flex items-center gap-1 text-indigo-600"><MapPin size={10}/> {entry.room}</span>
                              <span className="flex items-center gap-1"><User size={10}/> {entry.faculty?.name}</span>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                    {(timetable[day]?.length || 0) === 0 && (
                      <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-300 uppercase">Free</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
              {showAdd && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] max-w-xl w-full shadow-2xl relative"
                  >
                    <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl transition-all">
                      <X className="text-slate-400" />
                    </button>
                    
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Schedule Entry</h2>
                    
                    <form onSubmit={handleAdd} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Day</label>
                          <select 
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                            value={formData.dayOfWeek}
                            onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                          >
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Classroom</label>
                          <input 
                             type="text" 
                             className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                             placeholder="e.g. Hall 402"
                             value={formData.room}
                             onChange={(e) => setFormData({...formData, room: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Subject / Class</label>
                        <select 
                           required
                           className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                           value={formData.classId}
                           onChange={(e) => setFormData({...formData, classId: e.target.value})}
                        >
                          <option value="">Choose Class...</option>
                          {classes.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Faculty Instructor</label>
                        <select 
                           required
                           className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                           value={formData.facultyId}
                           onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                        >
                          <option value="">Assign Faculty...</option>
                          {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Starts At</label>
                          <input 
                             type="time" 
                             required
                             className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                             value={formData.startTime}
                             onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ends At</label>
                          <input 
                             type="time" 
                             required
                             className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                             value={formData.endTime}
                             onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] transition-all"
                      >
                        Publish to Timetable
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
