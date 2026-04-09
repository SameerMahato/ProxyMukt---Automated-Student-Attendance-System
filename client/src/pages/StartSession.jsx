import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import QRDisplay from '../components/QRDisplay';
import Loader from '../components/Loader';
import GlassCard from '../components/GlassCard';
import axiosInstance from '../utils/axiosInstance';
import { Users, Clock, StopCircle, Play, Pause, QrCode, MapPin, Eye, Fingerprint, Shield } from 'lucide-react';

export default function StartSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  
  useEffect(() => {
    fetchSession();
    
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    setSocket(newSocket);
    
    return () => {
      if (newSocket) {
        newSocket.emit('leave-session', id);
        newSocket.disconnect();
      }
    };
  }, [id]);
  
  useEffect(() => {
    if (socket && session?.status === 'LIVE') {
      socket.emit('join-session', id);
      
      socket.on('qr-update', (data) => {
        setQrToken(data.qrToken);
      });

      socket.on('attendance-marked', (data) => {
        setAttendanceList(prev => [data, ...prev]);
        setSession(prev => ({
          ...prev,
          attendanceCount: (prev.attendanceCount || 0) + 1
        }));
      });

      socket.on('verification-settings-updated', (data) => {
        setSession(prev => ({
          ...prev,
          verificationSettings: data.verificationSettings
        }));
      });
    }
  }, [socket, session, id]);
  
  const fetchSession = async () => {
    try {
      const { data } = await axiosInstance.get(`/sessions/${id}`);
      setSession(data.data.session);
      
      if (data.data.session.status !== 'LIVE') {
        try {
          await axiosInstance.post(`/sessions/${id}/start`);
          const updated = await axiosInstance.get(`/sessions/${id}`);
          setSession(updated.data.data.session);
        } catch (startError) {
          if (startError.response?.status === 400) {
            console.log('Session already live, continuing...');
          } else {
            throw startError;
          }
        }
      }

      // Fetch attendance list
      const attendanceRes = await axiosInstance.get(`/sessions/${id}/attendance`);
      setAttendanceList(attendanceRes.data.data.attendance || []);
    } catch (error) {
      console.error('Error fetching session:', error);
      if (error.response?.status === 404) {
        alert('Session not found. Redirecting to dashboard...');
        navigate('/faculty');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!confirm('Are you sure you want to end this session?')) return;
    
    try {
      await axiosInstance.post(`/sessions/${id}/end`);
      navigate('/faculty');
    } catch (error) {
      console.error('Error ending session:', error);
      alert('Failed to end session');
    }
  };

  const handleToggleQR = async () => {
    try {
      const { data } = await axiosInstance.post(`/sessions/${id}/toggle-qr`);
      setSession(prev => ({ ...prev, qrEnabled: data.data.qrEnabled }));
    } catch (error) {
      console.error('Error toggling QR:', error);
      alert('Failed to toggle QR code');
    }
  };

  const handleTogglePause = async () => {
    try {
      const { data } = await axiosInstance.post(`/sessions/${id}/toggle-pause`);
      setSession(prev => ({ ...prev, isPaused: data.data.isPaused }));
    } catch (error) {
      console.error('Error toggling pause:', error);
      alert('Failed to pause/resume session');
    }
  };

  const handleToggleVerification = async (field) => {
    try {
      const newValue = !session.verificationSettings[field];
      await axiosInstance.patch(`/sessions/${id}/verification`, {
        [field]: newValue
      });
      setSession(prev => ({
        ...prev,
        verificationSettings: {
          ...prev.verificationSettings,
          [field]: newValue
        }
      }));
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Failed to update verification settings');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{session?.title}</h1>
                <p className="text-gray-300 text-lg">{session?.class?.name}</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTogglePause}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    session?.isPaused
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  {session?.isPaused ? <Play size={20} /> : <Pause size={20} />}
                  <span>{session?.isPaused ? 'Resume' : 'Pause'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndSession}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <StopCircle size={20} />
                  <span>End Session</span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Users className="text-blue-400" size={24} />
                        <h3 className="text-lg font-semibold text-white">Attendance</h3>
                      </div>
                      <p className="text-4xl font-bold text-white">
                        {session?.attendanceCount || 0} / {session?.totalStudents || 0}
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        {session?.totalStudents > 0
                          ? `${((session.attendanceCount / session.totalStudents) * 100).toFixed(1)}%`
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="text-green-400" size={24} />
                    <h3 className="text-lg font-semibold text-white">Session Time</h3>
                  </div>
                  <p className="text-lg text-gray-300">
                    Started: {session?.startTime ? new Date(session.startTime).toLocaleTimeString() : 'N/A'}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    session?.isPaused 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'bg-green-500/20 text-green-400 border border-green-500/50'
                  }`}>
                    {session?.isPaused ? 'PAUSED' : 'LIVE'}
                  </span>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <QrCode className="text-purple-400" size={24} />
                    <h3 className="text-lg font-semibold text-white">QR Status</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleQR}
                    className={`w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all ${
                      session?.qrEnabled
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}
                  >
                    {session?.qrEnabled ? '✓ QR Enabled' : '✗ QR Disabled'}
                  </motion.button>
                </GlassCard>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* QR Code Display */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-white text-center">Attendance QR Code</h2>
                  <div className="flex justify-center mb-4">
                    {session?.qrEnabled && !session?.isPaused ? (
                      <QRDisplay token={qrToken} rotationInterval={20000} />
                    ) : (
                      <div className="w-64 h-64 bg-gray-800/50 rounded-xl flex items-center justify-center">
                        <p className="text-gray-400 text-center">
                          {session?.isPaused ? 'Session Paused' : 'QR Disabled'}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-sm text-gray-300">
                    {session?.qrEnabled && !session?.isPaused
                      ? 'Students should scan this QR code to mark attendance'
                      : 'Enable QR and resume session to show code'}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Verification Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">Verification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <MapPin className="text-blue-400" size={20} />
                        <div>
                          <p className="text-white font-semibold">Geofencing</p>
                          <p className="text-gray-400 text-xs">Location verification</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleVerification('requireGeofencing')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          session?.verificationSettings?.requireGeofencing ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            session?.verificationSettings?.requireGeofencing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <Eye className="text-purple-400" size={20} />
                        <div>
                          <p className="text-white font-semibold">Face Liveness</p>
                          <p className="text-gray-400 text-xs">Facial verification</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleVerification('requireFaceLiveness')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          session?.verificationSettings?.requireFaceLiveness ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            session?.verificationSettings?.requireFaceLiveness ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <Fingerprint className="text-yellow-400" size={20} />
                        <div>
                          <p className="text-white font-semibold">Device Check</p>
                          <p className="text-gray-400 text-xs">Device fingerprinting</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleVerification('requireDeviceCheck')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          session?.verificationSettings?.requireDeviceCheck ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            session?.verificationSettings?.requireDeviceCheck ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <Shield className="text-red-400" size={20} />
                        <div>
                          <p className="text-white font-semibold">Proxy Detection</p>
                          <p className="text-gray-400 text-xs">VPN/Proxy blocking</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleVerification('requireProxyCheck')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          session?.verificationSettings?.requireProxyCheck ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            session?.verificationSettings?.requireProxyCheck ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Recent Attendance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Recent Attendance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white font-semibold">Student</th>
                        <th className="text-left py-3 px-4 text-white font-semibold">Time</th>
                        <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.slice(0, 10).map((attendance, index) => (
                        <motion.tr
                          key={attendance._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-3 px-4 text-white">
                            {attendance.student?.name || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(attendance.markedAt).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                              {attendance.status || 'PRESENT'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {attendanceList.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No attendance marked yet</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
