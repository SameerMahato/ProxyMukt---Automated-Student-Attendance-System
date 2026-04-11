import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentAttendance from './pages/StudentAttendance';
import AdminDashboard from './pages/AdminDashboard';
import StartSession from './pages/StartSession';
import ScanQR from './pages/ScanQR';
import AutoAttendance from './pages/AutoAttendance';
import Analytics from './pages/Analytics';
import StudentAnalytics from './pages/StudentAnalytics';
import AuditLogs from './pages/AuditLogs';
import OnlineSession from './pages/OnlineSession';
import OnlineSessionMonitor from './pages/OnlineSessionMonitor';
import StudentPerformance from './pages/StudentPerformance';
import StudentGoals from './pages/StudentGoals';
import StudentLeave from './pages/StudentLeave';
import StudentTimetable from './pages/StudentTimetable';
import StudentLeaderboard from './pages/StudentLeaderboard';
import StudentQRHistory from './pages/StudentQRHistory';
import StudentSessions from './pages/StudentSessions';
import StudentAnnouncements from './pages/StudentAnnouncements';
import StudentNotifications from './pages/StudentNotifications';
import StudentSettings from './pages/StudentSettings';
import FacultyLeaveManager from './pages/FacultyLeaveManager';
import FacultyAnnouncementManager from './pages/FacultyAnnouncementManager';
import AdminTimetableManager from './pages/AdminTimetableManager';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const { user, isAuthenticated } = useAuthStore();
  
  const getDashboard = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    switch (user?.role) {
      case 'ADMIN':
        return <Navigate to="/admin" />;
      case 'FACULTY':
        return <Navigate to="/faculty" />;
      case 'STUDENT':
        return <Navigate to="/student" />;
      default:
        return <Navigate to="/login" />;
    }
  };
  
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={isAuthenticated ? getDashboard() : <Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/session/:id"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <StartSession />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/analytics"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAnalytics />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ScanQR />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/auto-attendance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <AutoAttendance />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/performance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentPerformance />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/goals"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentGoals />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/leave"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLeave />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentTimetable />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/leaderboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLeaderboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/qr-history"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentQRHistory />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/sessions"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentSessions />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/announcements"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAnnouncements />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentNotifications />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentSettings />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/online-session/:id"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}>
              <OnlineSession />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/online-session-monitor/:id"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <OnlineSessionMonitor />
            </ProtectedRoute>
          }
        />

        {/* Management Routes */}
        <Route
          path="/faculty/leaves"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyLeaveManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FacultyLeaveManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/announcements"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyAnnouncementManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FacultyAnnouncementManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminTimetableManager />
            </ProtectedRoute>
          }
        />
        
        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
