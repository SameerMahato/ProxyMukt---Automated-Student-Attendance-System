import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import VoiceToggle from './VoiceToggle';
import NotificationCenter from './NotificationCenter';
import voiceAnnouncer from '../utils/voiceAnnouncements';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    
    // Welcome announcement
    if (user) {
      voiceAnnouncer.announceWelcome(user.name, user.role);
    }
  }, [user]);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleLogout = async () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Hidden on mobile to make space for hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-12 lg:ml-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base sm:text-lg">A</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Smart Attendance
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Notification Center - Hidden on small mobile */}
            <div className="hidden sm:block">
              <NotificationCenter />
            </div>
            
            {/* Voice Toggle - Hidden on small mobile */}
            <div className="hidden sm:block">
              <VoiceToggle />
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="text-yellow-500" size={18} />
              ) : (
                <Moon className="text-indigo-600" size={18} />
              )}
            </button>
            
            {/* User Info - Responsive */}
            <div className="hidden md:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <User className="text-white" size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[100px]">{user?.name}</span>
                <span className="text-[10px] sm:text-xs text-indigo-600 dark:text-indigo-400 uppercase">{user?.role}</span>
              </div>
            </div>
            
            {/* Mobile User Icon */}
            <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
            
            {/* Logout Button - Responsive */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/50"
              aria-label="Logout"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="font-medium text-xs sm:text-sm hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
