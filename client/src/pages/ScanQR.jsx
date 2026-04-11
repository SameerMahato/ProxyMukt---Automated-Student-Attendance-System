import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosInstance from '../utils/axiosInstance';
import { Camera, CheckCircle, XCircle, MapPin, ShieldCheck, Smartphone, User } from 'lucide-react';
import { getDeviceInfo } from '../utils/deviceFingerprint';
import FaceVerification from '../components/FaceVerification';
import jsQR from 'jsqr';

export default function ScanQR() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('checking');
  const [locationError, setLocationError] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState(null);
  const scanIntervalRef = useRef(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Face, 2: QR Scan
  
  const startCamera = async () => {
    if (!faceVerified) {
      setMessage('❌ Please complete face verification first!');
      setMessageType('error');
      return;
    }
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setScanning(true);
        setMessage('');
        startQRScanning();
      }
    } catch (error) {
      setMessage('Camera access denied. Please enable camera permissions.');
      setMessageType('error');
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setScanning(false);
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };
  
  const startQRScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      scanQRCode();
    }, 500);
  };
  
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      if (code && code.data) {
        stopCamera();
        markAttendance(code.data);
      }
    }
  };

  const handleFaceVerified = (result) => {
    setFaceVerified(true);
    setShowFaceVerification(false);
    setCurrentStep(2);
    setMessage(`✓ Face verified! ${result.faceCount === 1 ? 'Single person confirmed.' : ''} Now scan the QR code.`);
    setMessageType('success');
  };

  const handleFaceFailed = () => {
    setFaceVerified(false);
    setShowFaceVerification(true);
    setCurrentStep(1);
    setMessage('❌ Face verification failed. Please try again.');
    setMessageType('error');
  };
  
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    // In production, use a QR scanner library like jsQR
    const qrToken = prompt('Enter QR code manually (for demo):');
    
    if (qrToken) {
      await markAttendance(qrToken);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationStatus('unavailable');
        setLocationError('Geolocation is not supported by your browser');
        reject(new Error('Geolocation not supported'));
        return;
      }

      setLocationStatus('checking');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(locationData);
          setLocationStatus('granted');
          resolve(locationData);
        },
        (error) => {
          setLocationStatus('denied');
          let errorMsg = 'Location access denied';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Location request timed out.';
              break;
            default:
              errorMsg = 'An unknown error occurred.';
          }
          
          setLocationError(errorMsg);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const markAttendance = async (qrToken) => {
    try {
      setMessage('Getting your location...');
      setMessageType('info');
      
      // Get current location
      let locationData = null;
      try {
        locationData = await getLocation();
      } catch (error) {
        // Try to mark attendance without location (backend will decide if it's required)
        console.warn('Location not available:', error);
      }
      
      setMessage('Marking attendance...');
      
      // Get device information
      const deviceInfo = getDeviceInfo();
      
      const { data } = await axiosInstance.post('/attendance/mark', {
        qrToken,
        location: locationData,
        deviceInfo,
      });
      
      setMessage(data.message);
      setMessageType('success');
      
      // Show location verification details if available
      if (data.data?.locationVerification) {
        const verification = data.data.locationVerification;
        if (verification.distance !== null) {
          setMessage(
            `${data.message} (Distance: ${verification.distance}m from session location)`
          );
        }
      }
      
      stopCamera();
      
      setTimeout(() => {
        navigate('/student');
      }, 2000);
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData?.requiresLocation) {
        setMessage('Location verification is required for this session. Please enable location access.');
      } else if (errorData?.details) {
        setMessage(`${errorData.message}: ${errorData.details.reason || JSON.stringify(errorData.details)}`);
      } else {
        setMessage(errorData?.message || 'Failed to mark attendance');
      }
      
      setMessageType('error');
    }
  };
  
  useEffect(() => {
    // Check location permission on mount
    getLocation().catch(() => {});
    
    // Get device fingerprint
    const deviceInfo = getDeviceInfo();
    setDeviceFingerprint(deviceInfo);
    
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Scan QR Code
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Mark your attendance by scanning the QR code
              </p>
            </div>

            {/* Multi-Layer Security Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-white" size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
                    Multi-Layer Security Active
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                        Faculty-Controlled Verification:
                      </div>
                      <ul className="space-y-0.5 ml-4 text-xs">
                        <li>✓ QR code scanning (always required)</li>
                        <li>✓ Face liveness detection (if enabled by faculty)</li>
                        <li>✓ GPS location verification (if enabled by faculty)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">
                        Background Security Checks:
                      </div>
                      <ul className="space-y-0.5 ml-4 text-xs">
                        <li>• Device fingerprinting (tracks your device)</li>
                        <li>• Proxy/VPN detection (prevents spoofing)</li>
                        <li>• IP reputation analysis (datacenter detection)</li>
                        <li>• Impossible travel detection (location consistency)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Information Card */}
            {deviceFingerprint && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm p-5 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                      Device Information Collected
                      <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="font-bold block mb-0.5 text-green-900 dark:text-green-300">Browser:</span>
                        <span className="text-green-800 dark:text-green-400">
                          {deviceFingerprint.userAgent.includes('Chrome') ? 'Chrome' : 
                           deviceFingerprint.userAgent.includes('Firefox') ? 'Firefox' : 
                           deviceFingerprint.userAgent.includes('Safari') ? 'Safari' : 'Other'}
                        </span>
                      </div>
                      <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="font-bold block mb-0.5 text-green-900 dark:text-green-300">Platform:</span>
                        <span className="text-green-800 dark:text-green-400">{deviceFingerprint.platform}</span>
                      </div>
                      <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="font-bold block mb-0.5 text-green-900 dark:text-green-300">Screen:</span>
                        <span className="text-green-800 dark:text-green-400">{deviceFingerprint.screenResolution}</span>
                      </div>
                      <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="font-bold block mb-0.5 text-green-900 dark:text-green-300">Timezone:</span>
                        <span className="text-green-800 dark:text-green-400">{deviceFingerprint.timezone}</span>
                      </div>
                      <div className="col-span-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="font-bold block mb-0.5 text-green-900 dark:text-green-300">Device ID:</span>
                        <code className="text-[10px] bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded text-green-800 dark:text-green-400">
                          {deviceFingerprint.fingerprint.substring(0, 24)}...
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location Status Card */}
            <div className={`mb-5 p-4 rounded-xl shadow-sm border flex items-center gap-3 ${
              locationStatus === 'granted'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : locationStatus === 'denied'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                locationStatus === 'granted'
                  ? 'bg-green-500'
                  : locationStatus === 'denied'
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              }`}>
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${
                  locationStatus === 'granted'
                    ? 'text-green-900 dark:text-green-300'
                    : locationStatus === 'denied'
                    ? 'text-red-900 dark:text-red-300'
                    : 'text-blue-900 dark:text-blue-300'
                }`}>
                  {locationStatus === 'granted' && 'Location Access Granted'}
                  {locationStatus === 'denied' && 'Location Access Denied'}
                  {locationStatus === 'checking' && 'Checking Location...'}
                  {locationStatus === 'unavailable' && 'Location Unavailable'}
                </p>
                {locationError && (
                  <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{locationError}</p>
                )}
              </div>
              {locationStatus === 'denied' && (
                <button
                  onClick={getLocation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>

            {/* Success/Error Message */}
            {message && (
              <div className={`mb-5 p-4 rounded-xl shadow-sm border flex items-start gap-3 ${
                messageType === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : messageType === 'info'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : messageType === 'info' ? (
                  <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${
                  messageType === 'success'
                    ? 'text-green-900 dark:text-green-300'
                    : messageType === 'info'
                    ? 'text-blue-900 dark:text-blue-300'
                    : 'text-red-900 dark:text-red-300'
                }`}>
                  {message}
                </span>
              </div>
            )}

            {/* Main Scanning Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentStep === 1 
                    ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500' 
                    : faceVerified 
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                    : 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300'
                }`}>
                  <User size={18} className={
                    faceVerified ? 'text-green-600 dark:text-green-400' : 
                    currentStep === 1 ? 'text-purple-600 dark:text-purple-400' : 
                    'text-gray-400'
                  } />
                  <span className={`text-sm font-semibold ${
                    faceVerified ? 'text-green-900 dark:text-green-300' : 
                    currentStep === 1 ? 'text-purple-900 dark:text-purple-300' : 
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    Step 1: Face Verification
                  </span>
                  {faceVerified && <CheckCircle size={16} className="text-green-600 dark:text-green-400" />}
                </div>
                
                <div className={`w-8 h-0.5 ${faceVerified ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentStep === 2 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500' 
                    : 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300'
                }`}>
                  <Camera size={18} className={
                    currentStep === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                  } />
                  <span className={`text-sm font-semibold ${
                    currentStep === 2 ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Step 2: Scan QR Code
                  </span>
                </div>
              </div>

              {/* Face Verification Section */}
              {showFaceVerification && currentStep === 1 && (
                <div className="mb-4">
                  <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                      <User size={18} />
                      Face Liveness Verification Required
                    </h3>
                    <p className="text-sm text-purple-800 dark:text-purple-400">
                      Before scanning the QR code, we need to verify that you are a real person. 
                      <strong> Only ONE face should be visible.</strong> Multiple faces will be rejected.
                    </p>
                  </div>
                  <FaceVerification
                    autoStart={true}
                    onVerified={handleFaceVerified}
                    onFailed={handleFaceFailed}
                  />
                </div>
              )}

              {/* Face Verified Confirmation */}
              {faceVerified && currentStep === 2 && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900 dark:text-green-300 text-sm">Face Verified Successfully</h4>
                    <p className="text-xs text-green-700 dark:text-green-400">Single live person confirmed. You can now scan the QR code.</p>
                  </div>
                </div>
              )}

              {/* Camera Section - Only show after face verification */}
              {currentStep === 2 && (
                <>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden mb-5 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0" />
                    
                    {!scanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                          <Camera size={32} className="text-white" />
                        </div>
                        <p className="text-white text-lg font-semibold">Camera not started</p>
                        <p className="text-gray-300 text-sm mt-2">Click "Start Camera" to scan QR code</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Start Camera Button */}
                  {!scanning ? (
                    <button
                      onClick={startCamera}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                      <Camera size={20} />
                      <span>Start Camera</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="w-full px-6 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      Stop Camera
                    </button>
                  )}
                  
                  {/* Instruction Text */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center flex items-center justify-center gap-2">
                    <Smartphone size={16} />
                    <span>Point your camera at the QR code displayed by your instructor</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
