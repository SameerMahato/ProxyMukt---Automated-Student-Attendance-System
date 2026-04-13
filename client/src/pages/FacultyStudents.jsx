import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Users, Search, Filter } from 'lucide-react';

export default function FacultyStudents() {
  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', attendance: 92, class: 'CS301' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', attendance: 88, class: 'CS301' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', attendance: 75, class: 'CS201' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', attendance: 95, class: 'CS201' },
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
            >
              <h1 className="text-4xl font-bold text-white mb-2">Students</h1>
              <p className="text-gray-400">Manage student profiles and attendance</p>
            </motion.div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-12 pr-4 py-3 bg-[#1a1f2e] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="px-6 py-3 bg-[#1a1f2e] border border-gray-800 rounded-xl text-white flex items-center gap-2 hover:bg-gray-800 transition-all">
                <Filter size={20} />
                Filter
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Class</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Attendance</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Users className="text-blue-500" size={20} />
                          </div>
                          <span className="text-white font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className={`h-full ${student.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${student.attendance >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
