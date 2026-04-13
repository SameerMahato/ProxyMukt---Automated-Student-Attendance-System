import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import GlassCard from '../components/GlassCard';
import StatsCard from '../components/StatsCard';
import AnimatedBackground from '../components/AnimatedBackground';
import LocationPicker from '../components/LocationPicker';
import axiosInstance from '../utils/axiosInstance';
import { 
  Plus, 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Settings, 
  MoreVertical,
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  LogOut,
  Video,
  MapPin
} from 'lucide-react';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showStartSession, setShowStartSession] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    semester: '',
  });
  
  const [sessionData, setSessionData] = useState({
    title: '',
    location: null,
    sessionType: 'offline',
    onlinePlatform: 'ZOOM',
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [classesRes, sessionsRes] = await Promise.all([
        axiosInstance.get('/classes'),
        axiosInstance.get('/sessions'),
      ]);
      
      const allClasses = classesRes.data.data.classes;
      const allSessions = sessionsRes.data.data.sessions;
      
      const liveSessionClassIds = allSessions
        .filter(s => s.status === 'LIVE')
        .map(s => s.class?._id || s.class);
      
      const classesWithLiveSessions = allClasses.filter(c => 
        liveSessionClassIds.includes(c._id)
      );
      const classesWithoutLiveSessions = allClasses.filter(c => 
        !liveSessionClassIds.includes(c._id)
      );
      
      setClasses([...classesWithLiveSessions, ...classesWithoutLiveSessions]);
      setSessions(allSessions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/classes', formData);
      setShowCreateClass(false);
      fetchData();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };
  
  const openStartSessionModal = (cls) => {
    setSelectedClass(cls);
    setSessionData({
      title: `${cls.name} - Lecture`,
      location: null,
      sessionType: 'offline',
      onlinePlatform: 'ZOOM',
    });
    setShowStartSession(true);
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/sessions', {
        classId: selectedClass._id,
        title: sessionData.title,
        date: new Date(),
        startTime: new Date(),
        location: sessionData.sessionType === 'offline' ? sessionData.location : null,
      });

      const sessionId = data.data.session._id;

      if (sessionData.sessionType === 'online') {
        if (sessionData.onlinePlatform === 'ZOOM') {
          try {
            const zoomRes = await axiosInstance.post('/zoom/create', {
              sessionId,
              topic: sessionData.title,
              duration: 60,
            });
            setShowStartSession(false);
            navigate(`/online-session-monitor/${zoomRes.data.data.onlineSession._id}`);
          } catch (zoomError) {
            const errorMsg = zoomError.response?.data?.message || 'Failed to create Zoom meeting';
            const useManual = confirm(
              `${errorMsg}\n\nWould you like to create a manual online session instead? You can add your Zoom link manually.`
            );
            if (useManual) {
              const onlineRes = await axiosInstance.post('/online-sessions', {
                sessionId,
                platform: 'ZOOM',
                meetingLink: '',
              });
              setShowStartSession(false);
              navigate(`/online-session-monitor/${onlineRes.data.data.onlineSession._id}`);
            } else {
              setShowStartSession(false);
              navigate(`/session/${sessionId}`);
            }
          }
        } else {
          const onlineRes = await axiosInstance.post('/online-sessions', {
            sessionId,
            platform: sessionData.onlinePlatform,
            meetingLink: '',
          });
          setShowStartSession(false);
          navigate(`/online-session-monitor/${onlineRes.data.data.onlineSession._id}`);
        }
      } else {
        setShowStartSession(false);
        navigate(`/session/${sessionId}`);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Faculty Control Room
              </h1>
              <p className="text-gray-400">Manage your classes, sessions and student performance</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="text-blue-500" size={24} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-500 font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Active Classes</p>
                <p className="text-4xl font-bold text-white">{classes.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Calendar className="text-purple-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Weekly Sessions</p>
                <p className="text-4xl font-bold text-white">{sessions.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Users className="text-green-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Students</p>
                <p className="text-4xl font-bold text-white">{classes.reduce((acc, c) => acc + (c.students?.length || 0), 0)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="text-orange-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Avg Attendance</p>
                <p className="text-4xl font-bold text-white">84</p>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('classes')}
                className={`px-8 py-3 rounded-xl text-sm font-bold uppercase transition-all ${
                  activeTab === 'classes' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Classes
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-8 py-3 rounded-xl text-sm font-bold uppercase transition-all ${
                  activeTab === 'sessions' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sessions
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-8 py-3 rounded-xl text-sm font-bold uppercase transition-all ${
                  activeTab === 'reports' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reports
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'classes' && (
                <motion.div
                  key="classes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {classes.map((cls, i) => (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <BookOpen className="text-blue-500" size={24} />
                        </div>
                        <span className="px-3 py-1 bg-gray-800 text-xs font-bold text-gray-400 uppercase rounded-lg">
                          {cls.code}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {cls.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Users size={16} />
                        <span>{cls.students?.length || 0} Students</span>
                        <span>•</span>
                        <span>{cls.department}</span>
                      </div>
                      <button
                        onClick={() => openStartSessionModal(cls)}
                        className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm uppercase hover:bg-gray-100 transition-all"
                      >
                        Start New Session
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'sessions' && (
                <motion.div
                  key="sessions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <GlassCard className="p-0 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Class</th>
                          <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date/Time</th>
                          <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                          <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Participants</th>
                          <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sessions.map((session) => (
                          <tr key={session._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="px-8 py-6">
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{session.class?.name}</h4>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase">{session.class?.code}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col text-sm font-bold text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(session.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2 mt-1"><Clock size={14} /> 09:00 AM</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 w-fit ${
                                session.status === 'LIVE' 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {session.status === 'LIVE' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                                {session.status}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <p className="font-bold text-lg text-slate-900 dark:text-white">
                                  {session.attendanceCount}/{session.totalStudents}
                                </p>
                                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-600"
                                    style={{ width: `${(session.attendanceCount / (session.totalStudents || 1)) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => navigate(`/session/${session._id}`)}
                                className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 rounded-xl transition-all"
                              >
                                <ChevronRight size={24} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modals remain similarly functional but integrated into the premium UI */}
            <AnimatePresence>
              {showStartSession && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Launch Session</h2>
                        <p className="text-slate-500 font-bold mt-1">Class: {selectedClass?.name}</p>
                      </div>
                      <button onClick={() => setShowStartSession(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <Activity className="rotate-45 text-slate-400" />
                      </button>
                    </div>

                    <form onSubmit={handleStartSession} className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Session Protocol</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setSessionData({ ...sessionData, sessionType: 'offline' })}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                              sessionData.sessionType === 'offline'
                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-lg shadow-indigo-500/10'
                                : 'border-slate-100 dark:border-slate-800'
                            }`}
                          >
                            <MapPin size={32} className={sessionData.sessionType === 'offline' ? 'text-indigo-600' : 'text-slate-400'} />
                            <div className="text-center">
                              <p className="font-bold text-slate-900 dark:text-white">Physical Class</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">QR + Location</p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSessionData({ ...sessionData, sessionType: 'online' })}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                              sessionData.sessionType === 'online'
                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-lg shadow-indigo-500/10'
                                : 'border-slate-100 dark:border-slate-800'
                            }`}
                          >
                            <Video size={32} className={sessionData.sessionType === 'online' ? 'text-indigo-600' : 'text-slate-400'} />
                            <div className="text-center">
                              <p className="font-bold text-slate-900 dark:text-white">Virtual Class</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">External Meet</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Session Designation</label>
                        <input
                          type="text"
                          required
                          className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all"
                          value={sessionData.title}
                          onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                        />
                      </div>

                      {sessionData.sessionType === 'offline' && (
                        <div className="space-y-4">
                           <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Geofence Location</label>
                           <LocationPicker
                            value={sessionData.location}
                            onChange={(location) => setSessionData({ ...sessionData, location })}
                          />
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] transition-all">
                          Initiate Session
                        </button>
                        <button type="button" onClick={() => setShowStartSession(false)} className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-3xl font-black uppercase tracking-widest">
                          Cancel
                        </button>
                      </div>
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

import { ChevronRight } from 'lucide-react';
