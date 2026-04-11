import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export default function StudentLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('Class');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get('/analytics/leaderboard');
      setLeaderboard(response.data.data.leaderboard);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader size="lg" />
    </div>
  );

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Attendance Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                See how you rank among your peers
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8 flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 w-fit">
              {['Class', 'Department', 'University'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Top 3 Podium */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="grid grid-cols-3 gap-6 items-end max-w-3xl mx-auto">
                {/* 2nd Place */}
                {topThree[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="relative inline-block mb-3">
                      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-gray-300 dark:border-gray-600 overflow-hidden mx-auto">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].name}`} alt={topThree[1].name} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-gray-400 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-800">
                        2
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{topThree[1].name}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{topThree[1].attendancePercentage}%</p>
                    <p className="text-xs text-gray-500">CS101</p>
                  </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="relative inline-block mb-3">
                      <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-4 border-yellow-400 overflow-hidden mx-auto shadow-lg">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].name}`} alt={topThree[0].name} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-800">
                        1
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{topThree[0].name}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{topThree[0].attendancePercentage}%</p>
                    <p className="text-xs text-gray-500">CS101</p>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="relative inline-block mb-3">
                      <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 border-4 border-orange-300 dark:border-orange-700 overflow-hidden mx-auto">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].name}`} alt={topThree[2].name} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-800">
                        3
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{topThree[2].name}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{topThree[2].attendancePercentage}%</p>
                    <p className="text-xs text-gray-500">CS101</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Full Rankings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Full Rankings</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((student, i) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      i < 3 ? 'bg-gray-50 dark:bg-gray-700/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center">
                        {i === 0 && <Trophy className="w-5 h-5 text-yellow-500 mx-auto" />}
                        {i === 1 && <Medal className="w-5 h-5 text-gray-400 mx-auto" />}
                        {i === 2 && <Award className="w-5 h-5 text-orange-500 mx-auto" />}
                        {i > 2 && <span className="text-lg font-bold text-gray-400">{student.rank}</span>}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{student.name}</h4>
                        <p className="text-sm text-gray-500">CS101</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {student.attendancePercentage}%
                      </div>
                      <p className="text-xs text-gray-500">
                        {student.attendanceCount || 0} sessions
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your Position (if not in top 10) */}
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">5</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=you`} alt="You" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">You</h4>
                      <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded">ME</span>
                    </div>
                    <p className="text-sm text-gray-500">CS101</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">87%</div>
                  <p className="text-xs text-gray-500">45 sessions</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
