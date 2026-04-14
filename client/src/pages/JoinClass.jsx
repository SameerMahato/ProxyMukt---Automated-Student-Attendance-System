import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { BookOpen, Search, Users, UserPlus, CheckCircle, Plus } from 'lucide-react';

export default function JoinClass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availableRes, myClassesRes] = await Promise.all([
        axiosInstance.get('/classes/available/all'),
        axiosInstance.get('/classes'),
      ]);
      
      setAvailableClasses(availableRes.data.data.classes);
      setMyClasses(myClassesRes.data.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) {
      alert('Please enter a class code');
      return;
    }

    setJoining(true);
    try {
      const { data } = await axiosInstance.post('/classes/join', {
        classCode: classCode.toUpperCase(),
      });
      
      alert(data.message || 'Successfully joined the class!');
      setShowJoinModal(false);
      setClassCode('');
      fetchData(); // Refresh the lists
    } catch (error) {
      console.error('Error joining class:', error);
      alert(error.response?.data?.message || 'Failed to join class');
    } finally {
      setJoining(false);
    }
  };

  const handleJoinClass = async (cls) => {
    if (cls.isEnrolled) {
      alert('You are already enrolled in this class');
      return;
    }

    setJoining(true);
    try {
      const { data } = await axiosInstance.post('/classes/join', {
        classCode: cls.code,
      });
      
      alert(data.message || 'Successfully joined the class!');
      fetchData(); // Refresh the lists
    } catch (error) {
      console.error('Error joining class:', error);
      alert(error.response?.data?.message || 'Failed to join class');
    } finally {
      setJoining(false);
    }
  };

  const filteredClasses = availableClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Join Classes</h1>
                <p className="text-gray-400">Browse and join available classes</p>
              </div>
              <button
                onClick={() => setShowJoinModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
              >
                <Plus size={20} />
                Join by Code
              </button>
            </motion.div>

            {/* My Classes Summary */}
            {myClasses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <CheckCircle className="text-indigo-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">You're enrolled in {myClasses.length} classes</h3>
                    <p className="text-gray-400">View them in your dashboard</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by class name, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1a1f2e] border border-gray-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none transition-all"
              />
            </motion.div>

            {/* Available Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.length === 0 ? (
                <div className="col-span-full bg-[#1a1f2e] rounded-2xl p-12 border border-gray-800 text-center">
                  <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400 mb-4">No classes found</p>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Join by Class Code
                  </button>
                </div>
              ) : (
                filteredClasses.map((cls, i) => (
                  <motion.div
                    key={cls._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-[#1a1f2e] rounded-2xl p-6 border transition-all ${
                      cls.isEnrolled
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-gray-800 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <BookOpen className="text-indigo-500" size={24} />
                      </div>
                      <span className="px-3 py-1 bg-gray-800 text-xs font-bold text-gray-400 uppercase rounded-lg">
                        {cls.code}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {cls.description || 'No description available'}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users size={16} />
                        <span>{cls.studentCount || 0} students enrolled</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-semibold">Faculty:</span> {cls.faculty?.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-semibold">Department:</span> {cls.department}
                      </div>
                    </div>

                    {cls.isEnrolled ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-semibold">
                        <CheckCircle size={18} />
                        Enrolled
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinClass(cls)}
                        disabled={joining}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                      >
                        <UserPlus size={18} />
                        Join Class
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Join by Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1f2e] rounded-2xl p-8 max-w-md w-full border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Join Class by Code</h2>
            <p className="text-gray-400 mb-6">Enter the class code provided by your instructor</p>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Class Code
                </label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="e.g., CS101"
                  className="w-full px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-xl text-white uppercase focus:border-indigo-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setClassCode('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {joining ? (
                    <>
                      <Loader size="sm" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Join
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
