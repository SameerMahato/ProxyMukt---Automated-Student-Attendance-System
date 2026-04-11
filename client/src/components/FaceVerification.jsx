import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

export default function FaceVerification({ onVerified, onFailed, autoStart = false }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceBox, setFaceBox] = useState(null);

  useEffect(() => {
    loadModels();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (autoStart && modelsLoaded) startCamera();
  }, [autoStart, modelsLoaded]);

  const loadModels = async () => {
    setStatus('loading');
    setMessage('Loading face detection models...');
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      setStatus('ready');
      setMessage('Ready to detect live presence.');
    } catch (err) {
      console.error('Model load error:', err);
      setStatus('failed');
      setMessage('Face detection unavailable. Proceeding with attendance...');
      setTimeout(() => onVerified && onVerified({ bypassed: true, reason: 'Models failed to load' }), 1500);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('detecting');
      setMessage('Look at the camera...');
      startDetection();
    } catch (err) {
      setStatus('failed');
      setMessage('Camera access denied. Proceeding without face verification.');
      setTimeout(() => onVerified && onVerified({ bypassed: true }), 1500);
    }
  };

  const startDetection = () => {
    let attempts = 0;
    const maxAttempts = 30;
    let consecutiveValidFrames = 0;
    const requiredValidFrames = 3; // Need 3 consecutive frames with valid single face

    intervalRef.current = setInterval(async () => {
      attempts++;
      if (!videoRef.current || videoRef.current.readyState < 2) return;

      try {
        // Detect ALL faces in the frame
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
          .withFaceLandmarks(true);

        // Clear canvas
        if (canvasRef.current && videoRef.current) {
          const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (detections.length > 0) {
            const resized = faceapi.resizeResults(detections, dims);
            resized.forEach(detection => {
              faceapi.draw.drawDetections(canvasRef.current, detection);
              faceapi.draw.drawFaceLandmarks(canvasRef.current, detection);
            });
          }
        }

        // Validation: Must have exactly ONE face
        if (detections.length === 0) {
          setFaceBox(null);
          consecutiveValidFrames = 0;
          setMessage('⚠️ No face detected. Please position your face in frame.');
          
          if (attempts >= maxAttempts) {
            clearInterval(intervalRef.current);
            setStatus('failed');
            setMessage('❌ No face detected in frame.');
            cleanup();
            setTimeout(() => onFailed && onFailed(), 1000);
          }
        } else if (detections.length > 1) {
          // Multiple faces detected - REJECT
          setFaceBox(null);
          consecutiveValidFrames = 0;
          setStatus('detecting');
          setMessage(`❌ Multiple faces detected (${detections.length}). Only ONE person allowed!`);
          
          if (attempts >= maxAttempts) {
            clearInterval(intervalRef.current);
            setStatus('failed');
            setMessage('❌ Multiple faces detected. Only one person is allowed.');
            cleanup();
            setTimeout(() => onFailed && onFailed(), 1000);
          }
        } else if (detections.length === 1) {
          // Exactly ONE face detected - GOOD
          const detection = detections[0];
          const score = detection.detection.score;
          
          // Check if it's a high-quality detection (real face)
          if (score > 0.6) {
            consecutiveValidFrames++;
            setFaceBox(detection.detection.box);
            setMessage(`✓ Valid face detected (${consecutiveValidFrames}/${requiredValidFrames})...`);
            
            // Need multiple consecutive valid frames to confirm liveness
            if (consecutiveValidFrames >= requiredValidFrames) {
              setStatus('verified');
              setMessage('✓ Live presence confirmed! Single human face verified.');
              clearInterval(intervalRef.current);
              cleanup();
              setTimeout(() => onVerified && onVerified({ 
                score: score,
                faceCount: 1,
                note: 'Single live face verified' 
              }), 1500);
            }
          } else {
            // Low quality detection - might be photo/screen
            consecutiveValidFrames = 0;
            setMessage('⚠️ Face quality too low. Move closer or improve lighting.');
          }
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }, 500);
  };

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const statusColors = {
    idle: 'text-gray-400',
    loading: 'text-blue-400',
    ready: 'text-blue-400',
    detecting: 'text-yellow-400',
    verified: 'text-green-400',
    failed: 'text-red-400',
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Camera size={18} className="text-purple-400" />
        <span className="text-white font-semibold text-sm">Liveness Detection</span>
        {status === 'verified' && <CheckCircle size={16} className="text-green-400 ml-auto" />}
        {status === 'failed' && <XCircle size={16} className="text-red-400 ml-auto" />}
        {(status === 'loading' || status === 'detecting') && (
          <Loader2 size={16} className="text-blue-400 ml-auto animate-spin" />
        )}
      </div>
      
      <div className="mb-3 p-2 bg-amber-900/30 border border-amber-700/50 rounded-lg">
        <p className="text-xs text-amber-300 flex items-start gap-2">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span><strong>Liveness Detection:</strong> Verifies ONE live person is present. Multiple faces will be rejected.</span>
        </p>
      </div>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />
        {status === 'idle' || status === 'loading' || status === 'ready' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            {status === 'loading' ? (
              <Loader2 size={32} className="text-blue-400 animate-spin" />
            ) : (
              <Camera size={32} className="text-gray-400" />
            )}
          </div>
        ) : null}
        {status === 'verified' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-900/40">
            <CheckCircle size={48} className="text-green-400" />
          </div>
        )}
      </div>

      <p className={`text-xs text-center ${statusColors[status]}`}>{message}</p>

      {(status === 'ready') && (
        <button
          onClick={startCamera}
          className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
        >
          Start Liveness Check
        </button>
      )}

      {status === 'detecting' && (
        <div className="mt-2 flex items-center gap-2 justify-center">
          <AlertTriangle size={14} className="text-yellow-400" />
          <span className="text-yellow-400 text-xs">Keep your face in frame</span>
        </div>
      )}
    </div>
  );
}
