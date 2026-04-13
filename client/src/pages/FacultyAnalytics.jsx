import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export default function FacultyAnalytics() {
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
              <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-gray-400">Attendance trends and performance insights</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="text-blue-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Overall Attendance</p>
                <p className="text-4xl font-bold text-white">87%</p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Trend</p>
                <p className="text-4xl font-bold text-green-500">+5%</p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Users className="text-purple-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Active Students</p>
                <p className="text-4xl font-bold text-white">245</p>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <Calendar className="text-orange-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">Sessions This Month</p>
                <p className="text-4xl font-bold text-white">42</p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Attendance Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart Component Here
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Class Performance</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart Component Here
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
