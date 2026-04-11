import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosInstance from '../utils/axiosInstance';
import voiceAnnouncer from '../utils/voiceAnnouncements';
import { getDeviceInfo } from '../utils/deviceFingerprint';
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Radar,
  Navigation,
  Clock,
  AlertTriangle,
  Zap,
  Battery
} from 'lucide-react';

export default function AutoAttendance() {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbySession, setNearbySession] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, searching, found, marking, success, error
  const [message, setMessage] = useState('');
  const [distance, setDistance] = useState(null);
  const watchIdRef = useRef(null);
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setMessage('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    setStatus('searching');
    setMessage('Searching for nearby sessions...');

    // Watch position continuously
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        setLocation(newLocation);
        checkNearbySession(newLocation);
      },
      (error) => {
        setStatus('error');
        setMessage(`Location error: ${error.message}`);
        voiceAnnouncer.speak('Unable to get your location. Please check your settings.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Check for nearby sessions every 10 seconds
    checkIntervalRef.current = setInterval(() => {
      if (location) {
        checkNearbySession(location);
      }
    }, 10000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setStatus('idle');
    setMessage('');
    
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  };

  const checkNearbySession = async (currentLocation) => {
    try {
      const { data } = await axiosInstance.post('/attendance/check-nearby', {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });

      if (data.data.session) {
        setNearbySession(data.data.session);
        setDistance(data.data.distance);
        setStatus('found');
        setMessage(`Found session: ${data.data.session.title}`);
        voiceAnnouncer.speak(`Session found nearby. ${data.data.session.title}. Distance: ${Math.round(data.data.distance)} meters.`);

        // Auto-mark if within range
        if (data.data.withinRange && !data.data.alreadyMarked) {
          await autoMarkAttendance(data.data.session._id, currentLocation);
        } else if (data.data.alreadyMarked) {
          setStatus('success');
          setMessage('Attendance already marked for this session');
        }
      } else {
        setNearbySession(null);
        setDistance(null);
        setStatus('searching');
        setMessage('No active sessions nearby. Keep moving...');
      }
    } catch (error) {
      console.error('Error checking nearby sessions:', error);
    }
  };

  const autoMarkAttendance = async (sessionId, currentLocation) => {
    try {
      setStatus('marking');
      setMessage('Marking attendance automatically...');

      // Get device info
      const deviceInfo = getDeviceInfo();

      const { data } = await axiosInstance.post('/attendance/mark', {
        qrToken: nearbySession.qrToken,
        location: currentLocation,
        deviceInfo,
        autoMarked: true
      });

      setStatus('success');
      setMessage('Attendance marked successfully! ✓');
      voiceAnnouncer.announceAttendanceMarked('you');
      
      // Add notification
      if (window.addNotification) {
        window.addNotification({
          type: 'success',
          title: 'Auto-Attendance Marked!',
          message: `${nearbySession.title} - ${Math.round(distance)}m away`
        });
      }

      // Stop tracking after successful mark
      setTimeout(() => {
        stopTracking();
        navigate('/student');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to mark attendance');
      voiceAnnouncer.announceAttendanceError(error.response?.data?.message || 'Unknown error');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'searching': return 'from-blue-500 to-indigo-500';
      case 'found': return 'from-yellow-500 to-orange-500';
      case 'marking': return 'from-purple-500 to-pink-500';
      case 'success': return 'from-green-500 to-emerald-500';
      case 'error': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'searching': return <Radar className="animate-spin" size={48} />;
      case 'found': return <Navigation size={48} />;
      case 'marking': return <Zap className="animate-pulse" size={48} />;
      case 'success': return <CheckCircle size={48} />;
      case 'error': return <XCircle size={48} />;
      default: return <MapPin size={48} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Auto-Attendance
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Automatic attendance marking using geolocation
              </p>
            </div>

            {/* Main Tracking Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="text-center">
                {/* Status Icon */}
                <motion.div
                  animate={{ 
                    scale: isTracking ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg ${
                    status === 'idle' ? 'bg-gray-100 dark:bg-gray-700' :
                    status === 'searching' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    status === 'found' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    status === 'marking' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  <div className={`${
                    status === 'idle' ? 'text-gray-600 dark:text-gray-400' :
                    status === 'searching' ? 'text-blue-600 dark:text-blue-400' :
                    status === 'found' ? 'text-yellow-600 dark:text-yellow-400' :
                    status === 'marking' ? 'text-purple-600 dark:text-purple-400' :
                    status === 'success' ? 'text-green-600 dark:text-green-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {getStatusIcon()}
                  </div>
                </motion.div>

                {/* Status Message */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {status === 'idle' && 'Ready to Track'}
                      {status === 'searching' && 'Searching for Sessions...'}
                      {status === 'found' && 'Session Found!'}
                      {status === 'marking' && 'Marking Attendance...'}
                      {status === 'success' && 'Attendance Marked!'}
                      {status === 'error' && 'Error Occurred'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {message || 'Start tracking to automatically mark attendance when you enter a session area'}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Session Info */}
                {nearbySession && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl"
                  >
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                      {nearbySession.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {nearbySession.class?.name}
                    </p>
                    {distance !== null && (
                      <div className="flex items-center justify-center gap-2">
                        <Navigation size={16} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {Math.round(distance)}m away
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Location Info */}
                {location && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <MapPin size={16} />
                      <span>Location Accuracy: ±{Math.round(location.accuracy)}m</span>
                    </div>
                  </motion.div>
                )}

                {/* Control Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isTracking ? stopTracking : startTracking}
                  disabled={status === 'marking'}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${
                    isTracking
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status === 'marking' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Marking Attendance...</span>
                    </span>
                  ) : isTracking ? (
                    'Stop Tracking'
                  ) : (
                    'Start Auto-Tracking'
                  )}
                </motion.button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Radar className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Auto-Detection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically finds nearby sessions
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Zap className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Instant Marking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Marks attendance when in range
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Time Saving</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No need to scan QR codes
                </p>
              </div>
            </div>

            {/* Battery Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
              <Battery className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-yellow-800 dark:text-yellow-400">
                <p className="font-semibold mb-1">Battery Usage Notice</p>
                <p>Continuous location tracking may drain your battery. Stop tracking when not needed.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
