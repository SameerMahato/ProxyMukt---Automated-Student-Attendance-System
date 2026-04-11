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
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  Calendar,
  Filter,
  Search,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

export default function FacultyLeaveManager() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/leaves/pending');
      setRequests(response.data.data.leaves || []);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (id, status) => {
    try {
      await axiosInstance.put(`/leaves/${id}/respond`, {
        status,
        response: responseMsg
      });
      setSelectedRequest(null);
      setResponseMsg('');
      fetchRequests();
    } catch (err) {
      console.error('Error responding to leave:', err);
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
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Leave & Appeals Management
                </h1>
                <p className="text-slate-500 font-medium">Review student absence requests and attendance appeals</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search student..." 
                    className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </motion.div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Requests List */}
              <div className="lg:col-span-2 space-y-4">
                {requests.filter(r => r.status === filter).length > 0 ? (
                  requests.filter(r => r.status === filter).map((req, i) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard 
                        className={`p-6 cursor-pointer transition-all border-l-4 ${
                          selectedRequest?._id === req._id ? 'border-l-indigo-600 scale-[1.02] shadow-xl' : 'border-l-transparent hover:border-l-slate-300'
                        }`}
                        onClick={() => setSelectedRequest(req)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                              <User size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{req.student?.name}</h3>
                              <p className="text-xs font-bold text-indigo-600 uppercase">{req.student?.studentId}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg ${
                            req.type === 'APPEAL' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {req.type}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(req.startDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14}/> {req.class?.code}</span>
                          <span className="flex items-center gap-1.5"><AlertCircle size={14}/> {req.status}</span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">No {filter.toLowerCase()} requests found</p>
                  </div>
                )}
              </div>

              {/* Request Detail Panel */}
              <div className="lg:col-span-1">
                <AnimatePresence mode="wait">
                  {selectedRequest ? (
                    <motion.div
                      key={selectedRequest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="sticky top-8"
                    >
                      <GlassCard className="p-8 space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Request Detail</h2>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <p className="text-sm font-bold text-slate-500 mb-1">Reason</p>
                            <p className="text-slate-900 dark:text-white leading-relaxed font-medium">
                              {selectedRequest.reason}
                            </p>
                          </div>
                        </div>

                        {selectedRequest.status === 'PENDING' && (
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase text-slate-400 ml-1">Official Response</label>
                            <textarea 
                              value={responseMsg}
                              onChange={(e) => setResponseMsg(e.target.value)}
                              placeholder="Write a comment or reason for approval/rejection..."
                              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none h-32 text-sm font-medium transition-all"
                            />
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleResponse(selectedRequest._id, 'APPROVED')}
                                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={18} />
                                Approve
                              </button>
                              <button 
                                onClick={() => handleResponse(selectedRequest._id, 'REJECTED')}
                                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                              >
                                <XCircle size={18} />
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedRequest.status !== 'PENDING' && (
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              {selectedRequest.status === 'APPROVED' ? <CheckCircle className="text-emerald-500" size={20} /> : <XCircle className="text-rose-500" size={20} />}
                              <span className="font-bold text-slate-900 dark:text-white">Request {selectedRequest.status}</span>
                            </div>
                            {selectedRequest.facultyResponse && (
                              <p className="text-sm text-slate-500 font-medium italic">"{selectedRequest.facultyResponse}"</p>
                            )}
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  ) : (
                    <div className="hidden lg:flex h-64 items-center justify-center bg-white/30 dark:bg-slate-900/30 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-slate-400 font-bold px-8 text-center">Select a request from the list to view details and respond</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
