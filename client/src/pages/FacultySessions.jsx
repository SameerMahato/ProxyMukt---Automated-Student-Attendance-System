import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Clock, Calendar, Users } from 'lucide-react';

export default function FacultySessions() {
  const sessions = [
    { id: 1, class: 'Database Management', date: '2025-04-11', time: '09:00 AM', status: 'LIVE', attendance: '42/45' },
    { id: 2, class: 'Data Structures', date: '2025-04-10', time: '02:00 PM', status: 'COMPLETED', attendance: '48/52' },
    { id: 3, class: 'Database Management', date: '2025-04-09', time: '09:00 AM', status: 'COMPLETED', attendance: '40/45' },
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
              <h1 className="text-4xl font-bold text-white mb-2">Sessions</h1>
              <p className="text-gray-400">View and manage your class sessions</p>
            </motion.div>

            <div className="space-y-4">
              {sessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Clock className="text-purple-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{session.class}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-semibold">{session.attendance}</p>
                        <p className="text-gray-400 text-sm">Attendance</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                        session.status === 'LIVE' 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {session.status === 'LIVE' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />}
                        {session.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
