import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { classAPI, analyticsAPI } from '../services/api';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

export default function FacultyReports() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [exporting, setExporting] = useState(false);

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

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const { data } = await analyticsAPI.exportCSV();
      
      // Create blob and download
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export report: ' + (error.response?.data?.message || error.message));
    } finally {
      setExporting(false);
    }
  };

  const generateReport = (className, period) => {
    const date = new Date();
    const reports = {
      month: {
        name: `${className} - Monthly Attendance Report`,
        date: date.toISOString().split('T')[0],
        size: '2.4 MB',
      },
      quarter: {
        name: `${className} - Quarterly Performance Summary`,
        date: date.toISOString().split('T')[0],
        size: '3.8 MB',
      },
      year: {
        name: `${className} - Annual Attendance Records`,
        date: date.toISOString().split('T')[0],
        size: '5.2 MB',
      },
    };
    return reports[period];
  };

  const filteredReports = classes
    .filter(cls => selectedClass === 'all' || cls._id === selectedClass)
    .map(cls => generateReport(cls.name, selectedPeriod));

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
                <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
                <p className="text-gray-400">Download and export attendance reports</p>
              </div>
              <button 
                onClick={handleExportCSV}
                disabled={exporting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                {exporting ? 'Exporting...' : 'Export All'}
              </button>
            </motion.div>

            {/* Filters */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-4">
                <Filter className="text-gray-400" size={20} />
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="bg-[#1a1f2e] rounded-2xl p-12 border border-gray-800 text-center">
                  <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400">No reports available</p>
                </div>
              ) : (
                filteredReports.map((report, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800 flex items-center justify-between hover:border-blue-500/30 transition-all"
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
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleExportCSV}
                      disabled={exporting}
                      className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Download size={18} />
                      Download
                    </button>
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
