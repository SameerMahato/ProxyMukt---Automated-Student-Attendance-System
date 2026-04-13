import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { classAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Users, Plus, X } from 'lucide-react';

export default function FacultyClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    semester: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await classAPI.getClasses();
      setClasses(data.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    console.log('=== Creating Class ===');
    console.log('Form Data:', formData);
    console.log('User:', useAuthStore.getState().user);
    console.log('Token:', useAuthStore.getState().token ? 'Present' : 'Missing');
    
    try {
      setCreating(true);
      console.log('Sending request to API...');
      const response = await classAPI.createClass(formData);
      console.log('Class created successfully:', response.data);
      alert('Class created successfully!');
      setShowCreateModal(false);
      setFormData({ name: '', code: '', description: '', department: '', semester: '' });
      fetchClasses();
    } catch (error) {
      console.error('=== Error Creating Class ===');
      console.error('Full Error:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message;
      
      // Handle specific error cases
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique') || errorMessage.includes('already exists')) {
        alert('A class with this code already exists. Please use a different class code.');
      } else if (errorMessage.includes('required')) {
        alert('Please fill in all required fields.');
      } else if (errorMessage.includes('authorized') || errorMessage.includes('permission') || errorMessage.includes('Access denied')) {
        alert('You do not have permission to create classes. Please contact your administrator.');
      } else if (errorMessage.includes('token') || errorMessage.includes('Authentication')) {
        alert('Your session has expired. Please log in again.');
        // Optionally redirect to login
        // navigate('/login');
      } else {
        alert('Failed to create class: ' + errorMessage);
      }
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
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Classes</h1>
                <p className="text-gray-400">Manage your classes and enrollments</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                <Plus size={20} />
                Create Class
              </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.length === 0 ? (
                <div className="col-span-2 bg-[#1a1f2e] rounded-2xl p-12 border border-gray-800 text-center">
                  <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400 mb-4">No classes yet</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    Create Your First Class
                  </button>
                </div>
              ) : (
                classes.map((cls, i) => (
                  <motion.div
                    key={cls._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/session/new?classId=${cls._id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <BookOpen className="text-blue-500" size={24} />
                      </div>
                      <span className="px-3 py-1 bg-gray-800 text-xs font-bold text-gray-400 uppercase rounded-lg">
                        {cls.code}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{cls.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                      <Users size={16} />
                      <span>{cls.students?.length || 0} Students</span>
                      <span>•</span>
                      <span>{cls.department}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/session/new?classId=${cls._id}`);
                      }}
                      className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm uppercase hover:bg-gray-100 transition-all"
                    >
                      Start Session
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Create Class Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#1a1f2e] p-8 rounded-2xl max-w-2xl w-full border border-gray-800"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Create New Class</h2>
                    <button 
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <X className="text-gray-400" size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateClass} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Class Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g., Database Management Systems"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Class Code</label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g., CS301"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        rows="3"
                        placeholder="Brief description of the class"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Department</label>
                        <input
                          type="text"
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          placeholder="e.g., Computer Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Semester</label>
                        <input
                          type="text"
                          required
                          value={formData.semester}
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          placeholder="e.g., Fall 2025"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit"
                        disabled={creating}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creating ? 'Creating...' : 'Create Class'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        disabled={creating}
                        className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
