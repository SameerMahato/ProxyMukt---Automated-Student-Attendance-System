import axiosInstance from '../utils/axiosInstance';

// Analytics APIs
export const analyticsAPI = {
  getAttendanceAnalytics: () => axiosInstance.get('/analytics/attendance'),
  getStudentAnalytics: (studentId) => 
    studentId 
      ? axiosInstance.get(`/analytics/student/${studentId}`)
      : axiosInstance.get('/analytics/student'),
  getClassAnalytics: (classId) => axiosInstance.get(`/analytics/class/${classId}`),
  getLeaderboard: () => axiosInstance.get('/analytics/leaderboard'),
  exportCSV: () => axiosInstance.get('/analytics/export/csv', { responseType: 'blob' }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
};

// Announcement APIs
export const announcementAPI = {
  getAnnouncements: () => axiosInstance.get('/announcements'),
  createAnnouncement: (data) => axiosInstance.post('/announcements', data),
  deleteAnnouncement: (id) => axiosInstance.delete(`/announcements/${id}`),
};

// Class APIs
export const classAPI = {
  getClasses: () => axiosInstance.get('/classes'),
  getClass: (id) => axiosInstance.get(`/classes/${id}`),
  createClass: (data) => axiosInstance.post('/classes', data),
  updateClass: (id, data) => axiosInstance.put(`/classes/${id}`, data),
  deleteClass: (id) => axiosInstance.delete(`/classes/${id}`),
  getStudents: (id) => axiosInstance.get(`/classes/${id}/students`),
  addStudent: (id, studentId) => axiosInstance.post(`/classes/${id}/students`, { studentId }),
  removeStudent: (id, studentId) => axiosInstance.delete(`/classes/${id}/students/${studentId}`),
};

// Session APIs
export const sessionAPI = {
  getSessions: () => axiosInstance.get('/sessions'),
  getSession: (id) => axiosInstance.get(`/sessions/${id}`),
  createSession: (data) => axiosInstance.post('/sessions', data),
  endSession: (id) => axiosInstance.put(`/sessions/${id}/end`),
  getQRCode: (id) => axiosInstance.get(`/sessions/${id}/qr`),
};

// Attendance APIs
export const attendanceAPI = {
  getMyAttendance: () => axiosInstance.get('/attendance/my-attendance'),
  markAttendance: (data) => axiosInstance.post('/attendance/mark', data),
  getSessionAttendance: (sessionId) => axiosInstance.get(`/attendance/session/${sessionId}`),
  getClassAttendance: (classId) => axiosInstance.get(`/attendance/class/${classId}`),
};

// Leave APIs
export const leaveAPI = {
  getLeaves: () => axiosInstance.get('/leaves'),
  createLeave: (data) => axiosInstance.post('/leaves', data),
  updateLeaveStatus: (id, status, remarks) => 
    axiosInstance.put(`/leaves/${id}`, { status, remarks }),
  deleteLeave: (id) => axiosInstance.delete(`/leaves/${id}`),
};

// Timetable APIs
export const timetableAPI = {
  getTimetable: () => axiosInstance.get('/timetable'),
  createTimetable: (data) => axiosInstance.post('/timetable', data),
  updateTimetable: (id, data) => axiosInstance.put(`/timetable/${id}`, data),
  deleteTimetable: (id) => axiosInstance.delete(`/timetable/${id}`),
};

// User APIs (for admin)
export const userAPI = {
  getUsers: (role) => axiosInstance.get('/auth/users', { params: { role } }),
  getUser: (id) => axiosInstance.get(`/auth/users/${id}`),
  updateUser: (id, data) => axiosInstance.put(`/auth/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/auth/users/${id}`),
  createUser: (data) => axiosInstance.post('/auth/register', data),
};

// Audit APIs
export const auditAPI = {
  getAuditLogs: (params) => axiosInstance.get('/audit', { params }),
};

export default {
  analytics: analyticsAPI,
  notifications: notificationAPI,
  announcements: announcementAPI,
  classes: classAPI,
  sessions: sessionAPI,
  attendance: attendanceAPI,
  leaves: leaveAPI,
  timetable: timetableAPI,
  users: userAPI,
  audit: auditAPI,
};
