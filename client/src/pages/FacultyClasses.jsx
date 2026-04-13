import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BookOpen, Users, Plus } from 'lucide-react';

export default function FacultyClasses() {
  const classes = [
    { id: 1, name: 'Database Management Systems', code: 'CS301', students: 45, department: 'Computer Science' },
    { id: 2, name: 'Data Structures and Algorithms', code: 'CS201', students: 52, department: 'Computer Science' },
  ];

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
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                <Plus size={20} />
                Create Class
              </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((cls, i) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
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
                  <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <Users size={16} />
                    <span>{cls.students} Students</span>
                    <span>•</span>
                    <span>{cls.department}</span>
                  </div>
                  <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm uppercase hover:bg-gray-100 transition-all">
                    Manage Class
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
