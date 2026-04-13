import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { sessionAPI } from '../services/api';
import { Clock, Calendar, Users, Eye } from 'lucide-react';

export default function FacultySessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, live, completed

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data } = await sessionAPI.getSessions();
      setSessions(data.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    if (filter === 'live') return session.status === 'LIVE';
    if (filter === 'completed') return session.status === 'COMPLETED';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'COMPLETED':
        return 'bg-gray-800 text-gray-400';
      case 'SCHEDULED':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Sessions</h1>
                <p className="text-gray-400">View and manage your class sessions</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#1a1f2e] text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('live')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filter === 'live' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[#1a1f2e] text-gray-400 hover:text-white'
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filter === 'completed' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-[#1a1f2e] text-gray-400 hover:text-white'
                  }`}
                >
                  Completed
                </button>
              </div>
            </motion.div>

            <div className="space-y-4">
              {filteredSessions.length === 0 ? (
                <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-gray-800 text-center">
                  <Clock className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400">No sessions found</p>
                </div>
              ) : (
                filteredSessions.map((session, i) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Clock className="text-purple-500" size={24} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">
                            {session.class?.name || 'Unknown Class'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {session.attendanceCount || 0}/{session.totalStudents || 0}
                          </p>
                          <p className="text-gray-400 text-sm">Attendance</p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getStatusColor(session.status)}`}>
                          {session.status === 'LIVE' && (
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                          )}
                          {session.status}
                        </span>
                        <button
                          onClick={() => navigate(`/session/${session._id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
