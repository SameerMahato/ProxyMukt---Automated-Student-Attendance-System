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
import CreateSession from './pages/CreateSession';
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
import JoinClass from './pages/JoinClass';
import FacultyLeaveManager from './pages/FacultyLeaveManager';
import FacultyAnnouncementManager from './pages/FacultyAnnouncementManager';
import AdminTimetableManager from './pages/AdminTimetableManager';
import FacultyAnalytics from './pages/FacultyAnalytics';
import FacultyReports from './pages/FacultyReports';
import FacultyAlerts from './pages/FacultyAlerts';
import FacultyStudents from './pages/FacultyStudents';
import FacultyClasses from './pages/FacultyClasses';
import FacultySessions from './pages/FacultySessions';
import FacultyNotifications from './pages/FacultyNotifications';
import FacultySettings from './pages/FacultySettings';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReports from './pages/AdminReports';
import AdminAlerts from './pages/AdminAlerts';
import AdminUsers from './pages/AdminUsers';
import AdminSessions from './pages/AdminSessions';
import AdminSystem from './pages/AdminSystem';
import AdminNotifications from './pages/AdminNotifications';

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
          path="/session/new"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <CreateSession />
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
          path="/student/join-class"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <JoinClass />
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

        {/* Faculty Routes */}
        <Route
          path="/faculty/analytics"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/reports"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/alerts"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/students"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/classes"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/sessions"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultySessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/notifications"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/settings"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultySettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/leaves"
          element={
            <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
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
        
        {/* Admin Routes */}
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSystem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminNotifications />
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
