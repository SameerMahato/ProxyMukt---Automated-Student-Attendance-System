import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  FileText, 
  Send, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Plus,
  Paperclip,
  ChevronDown,
  History,
  Info
} from 'lucide-react';

// Simple toast notification function
const toast = {
  success: (message) => alert(message),
  error: (message) => alert(message)
};

export default function StudentLeave() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    classId: '',
    type: 'LEAVE',
    reason: '',
    startDate: '',
    endDate: '',
    attachment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, classesRes] = await Promise.all([
        axiosInstance.get('/leaves/my-leaves'),
        axiosInstance.get('/classes')
      ]);
      setLeaves(leavesRes.data.data.leaves);
      setClasses(classesRes.data.data.classes);
    } catch (err) {
      console.error('Error fetching leave data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/leaves/submit', formData);
      toast.success('Request submitted successfully!');
      setShowForm(false);
      setFormData({ classId: '', type: 'LEAVE', reason: '', startDate: '', endDate: '', attachment: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'REJECTED': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 size={16} />;
      case 'REJECTED': return <XCircle size={16} />;
      default: return <Clock size={16} />;
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
              className="flex justify-between items-center"
            >
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  Leave & Appeals
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Request permission for absences or appeal missed sessions</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-xl transition-all duration-300 ${showForm ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
              >
                {showForm ? <XCircle size={20} /> : <Plus size={20} />}
                <span className="font-bold">{showForm ? 'Cancel' : 'New Request'}</span>
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Submission Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:col-span-1 space-y-6"
                  >
                    <GlassCard className="p-8">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Send size={20} className="text-indigo-600" />
                        Application Form
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Request Type</label>
                          <select
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                          >
                            <option value="LEAVE">Leave of Absence</option>
                            <option value="APPEAL">Attendance Appeal</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject (Optional)</label>
                          <select
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                            value={formData.classId}
                            onChange={(e) => setFormData({...formData, classId: e.target.value})}
                          >
                            <option value="">All Subjects</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                            <input
                              type="date"
                              required
                              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                              value={formData.startDate}
                              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                            <input
                              type="date"
                              required
                              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                              value={formData.endDate}
                              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Reason</label>
                          <textarea
                            rows="4"
                            required
                            placeholder="Explain the reason for your request..."
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {submitting ? <Loader size="sm" /> : <Send size={18} />}
                          {submitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </form>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* History List */}
              <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <History size={24} className="text-indigo-600" />
                  Request History
                </h3>
                <div className="space-y-4">
                  {leaves.map((leave, i) => (
                    <motion.div
                      key={leave._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GlassCard className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${getStatusColor(leave.status)} flex items-center gap-1.5`}>
                                {getStatusIcon(leave.status)}
                                {leave.status}
                              </span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{leave.type}</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                              {leave.class ? leave.class.name : 'System-wide Leave'}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm italic">"{leave.reason}"</p>
                            <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
                              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1.5"><Clock size={14} /> Submitted {new Date(leave.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {leave.facultyResponse && (
                            <div className="md:w-64 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                              <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                                <Info size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Faculty Response</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {leave.facultyResponse}
                              </p>
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                  {leaves.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">No leave requests found.</p>
                      <button onClick={() => setShowForm(true)} className="text-indigo-600 font-bold mt-2 hover:underline">Submit your first request</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
