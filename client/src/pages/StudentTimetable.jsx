import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Monitor,
  Layout
} from 'lucide-react';

export default function StudentTimetable() {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'Long' }));
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await axiosInstance.get('/timetable/student');
      setTimetable(response.data.data.timetable);
    } catch (err) {
      console.error('Error fetching timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader size="lg" />
    </div>
  );

  const currentDayClasses = timetable?.[activeDay] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Class Timetable
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Your weekly class schedule</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                  Export
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                  Sync with Google Calendar
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="mb-6 flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 w-fit">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">
                Week View
              </button>
              <button className="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                Month View
              </button>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-gray-700">
                {days.slice(0, 5).map((day) => (
                  <div key={day} className="bg-white dark:bg-gray-800 p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{day}</h3>
                    <div className="space-y-3">
                      {(timetable?.[day] || []).map((item) => (
                        <div
                          key={item._id}
                          className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={12} className="text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {item.startTime}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                            {item.class.name}
                          </h4>
                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <User size={10} />
                              <span>Room {item.room || 'TBD'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={10} />
                              <span>Prof. {item.faculty.name.split(' ')[0]}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
