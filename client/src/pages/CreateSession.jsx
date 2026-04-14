import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { Calendar, Clock, MapPin, BookOpen, ArrowRight } from 'lucide-react';

export default function CreateSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId');
  
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: new Date().toISOString().slice(0, 16),
    location: {
      room: '',
      building: '',
    },
  });

  useEffect(() => {
    if (classId) {
      fetchClass();
    } else {
      navigate('/faculty/classes');
    }
  }, [classId]);

  const fetchClass = async () => {
    try {
      const { data } = await axiosInstance.get(`/classes/${classId}`);
      setClassData(data.data.class);
      setFormData(prev => ({
        ...prev,
        title: `${data.data.class.name} - Lecture`,
      }));
    } catch (error) {
      console.error('Error fetching class:', error);
      alert('Failed to load class details');
      navigate('/faculty/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const sessionData = {
        classId: classId,
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        location: formData.location.room || formData.location.building ? formData.location : undefined,
      };

      const { data } = await axiosInstance.post('/sessions', sessionData);
      const sessionId = data.data.session._id;
      
      // Navigate to the session page
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert(error.response?.data?.message || 'Failed to create session');
    } finally {
      setCreating(false);
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
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Create New Session</h1>
              <p className="text-gray-400">Start a new attendance session for your class</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800"
            >
              {/* Class Info */}
              <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{classData?.name}</h3>
                    <p className="text-gray-400">{classData?.code} • {classData?.students?.length || 0} students</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="e.g., Introduction to React"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Calendar className="inline mr-2" size={16} />
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Clock className="inline mr-2" size={16} />
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Location (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.location.room}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, room: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Room number"
                    />
                    <input
                      type="text"
                      value={formData.location.building}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, building: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Building name"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/faculty/classes')}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <Loader size="sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create & Start Session
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
