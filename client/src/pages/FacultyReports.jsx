import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FileText, Download, Filter } from 'lucide-react';

export default function FacultyReports() {
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
                <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
                <p className="text-gray-400">Download and export attendance reports</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                <Download size={20} />
                Export All
              </button>
            </motion.div>

            {/* Filters */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <Filter className="text-gray-400" size={20} />
                <select className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700">
                  <option>All Classes</option>
                  <option>Database Management</option>
                  <option>Data Structures</option>
                </select>
                <select className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {[
                { name: 'Monthly Attendance Report', date: '2025-04-01', size: '2.4 MB' },
                { name: 'Class Performance Summary', date: '2025-03-28', size: '1.8 MB' },
                { name: 'Student Attendance Records', date: '2025-03-15', size: '3.2 MB' },
              ].map((report, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{report.name}</h3>
                      <p className="text-gray-400 text-sm">{report.date} • {report.size}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all">
                    <Download size={18} />
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
