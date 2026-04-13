import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

export default function AdminReports() {
  const reports = [
    { name: 'System-wide Attendance Report', date: '2025-04-01', size: '5.2 MB', type: 'Monthly' },
    { name: 'Faculty Performance Summary', date: '2025-03-28', size: '3.1 MB', type: 'Quarterly' },
    { name: 'Student Enrollment Report', date: '2025-03-15', size: '2.8 MB', type: 'Monthly' },
    { name: 'Security Audit Report', date: '2025-03-10', size: '4.5 MB', type: 'Weekly' },
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
                <h1 className="text-4xl font-bold text-white mb-2">System Reports</h1>
                <p className="text-gray-400">Generate and download comprehensive reports</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                <Download size={20} />
                Generate New Report
              </button>
            </motion.div>

            {/* Filters */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <Filter className="text-gray-400" size={20} />
                <select className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700">
                  <option>All Report Types</option>
                  <option>Attendance Reports</option>
                  <option>Performance Reports</option>
                  <option>Security Reports</option>
                </select>
                <select className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                </select>
                <button className="ml-auto px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map((report, i) => (
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
                      <div className="flex items-center gap-3 text-gray-400 text-sm mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {report.date}
                        </span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all flex items-center gap-2">
                    <Download size={18} />
                    Download
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
