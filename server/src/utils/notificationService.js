import Notification from '../models/Notification.js';
import Class from '../models/Class.js';
import User from '../models/User.js';
import { 
  sendSessionStartedEmail, 
  sendLeaveStatusEmail, 
  sendAnnouncementEmail,
  sendLowAttendanceWarning 
} from './emailService.js';

/**
 * Send notification to specific users
 */
export const sendNotification = async (userIds, type, title, message, data = {}) => {
  try {
    const notifications = userIds.map((userId) => ({
      user: userId,
      type,
      title,
      message,
      data,
    }));

    await Notification.insertMany(notifications);
    
    // Send email notifications to users
    try {
      const users = await User.find({ _id: { $in: userIds } }).select('email name');
      for (const user of users) {
        // Send emails based on notification type
        if (type === 'SESSION_STARTED' && data.className) {
          await sendSessionStartedEmail(user.email, user.name, data.className, title);
        } else if (type === 'LOW_ATTENDANCE' && data.percentage) {
          await sendLowAttendanceWarning(user.email, user.name, data.className, data.percentage);
        }
        // Add more email types as needed
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError.message);
      // Don't fail the whole operation if email fails
    }
    
    console.log(`✅ Sent ${notifications.length} notifications of type: ${type}`);
    
    return true;
  } catch (error) {
    console.error('Error sending notifications:', error);
    return false;
  }
};

/**
 * Notify students when session starts
 */
export const notifySessionStarted = async (session) => {
  try {
    const classData = await Class.findById(session.class).populate('students', '_id');
    
    if (!classData || !classData.students.length) {
      return;
    }

    const studentIds = classData.students.map((s) => s._id);

    await sendNotification(
      studentIds,
      'SESSION_STARTED',
      '🎓 Class Started!',
      `${classData.name} session has started. Join now to mark your attendance!`,
      {
        sessionId: session._id,
        classId: session.class,
        className: classData.name,
      }
    );
  } catch (error) {
    console.error('Error notifying session start:', error);
  }
};

/**
 * Notify students when session ends
 */
export const notifySessionEnded = async (session) => {
  try {
    const classData = await Class.findById(session.class).populate('students', '_id');
    
    if (!classData || !classData.students.length) {
      return;
    }

    const studentIds = classData.students.map((s) => s._id);

    await sendNotification(
      studentIds,
      'SESSION_ENDED',
      '⏰ Class Ended',
      `${classData.name} session has ended. Check your attendance status.`,
      {
        sessionId: session._id,
        classId: session.class,
        className: classData.name,
      }
    );
  } catch (error) {
    console.error('Error notifying session end:', error);
  }
};

/**
 * Notify student when leave status changes
 */
export const notifyLeaveStatusUpdate = async (leave) => {
  try {
    const statusText = leave.status === 'APPROVED' ? '✅ Approved' : '❌ Rejected';
    await sendNotification(
      [leave.student],
      'LEAVE_STATUS_UPDATE',
      `Leave Request ${leave.status}`,
      `Your leave request for class has been ${leave.status.toLowerCase()}. Check details on your dashboard.`,
      {
        leaveId: leave._id,
        status: leave.status,
      }
    );
    
    // Send email notification
    try {
      const user = await User.findById(leave.student).select('email name');
      if (user) {
        await sendLeaveStatusEmail(user.email, user.name, leave.status, leave.facultyResponse);
      }
    } catch (emailError) {
      console.error('Error sending leave status email:', emailError.message);
    }
  } catch (error) {
    console.error('Error notifying leave status update:', error);
  }
};

/**
 * Notify students when new announcement is created
 */
export const notifyNewAnnouncement = async (announcement) => {
  try {
    let studentIds = [];
    if (announcement.scope === 'GLOBAL') {
      // For global announcements, get all students
      const students = await User.find({ role: 'STUDENT' }).select('_id email name');
      studentIds = students.map(s => s._id);
      
      // Send emails to all students
      for (const student of students) {
        try {
          await sendAnnouncementEmail(
            student.email, 
            student.name, 
            announcement.title, 
            announcement.content,
            announcement.priority
          );
        } catch (emailError) {
          console.error(`Error sending announcement email to ${student.email}:`, emailError.message);
        }
      }
    } else if (announcement.scope === 'CLASS') {
      const classData = await Class.findById(announcement.targetId).populate('students', '_id email name');
      if (classData) {
        studentIds = classData.students.map(s => s._id);
        
        // Send emails to class students
        for (const student of classData.students) {
          try {
            await sendAnnouncementEmail(
              student.email, 
              student.name, 
              announcement.title, 
              announcement.content,
              announcement.priority
            );
          } catch (emailError) {
            console.error(`Error sending announcement email to ${student.email}:`, emailError.message);
          }
        }
      }
    }

    if (studentIds.length) {
      await sendNotification(
        studentIds,
        'NEW_ANNOUNCEMENT',
        '📢 New Announcement',
        `An announcement was posted: "${announcement.title}"`,
        {
          announcementId: announcement._id,
          type: announcement.type,
        }
      );
    }
  } catch (error) {
    console.error('Error notifying new announcement:', error);
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId, limit = 20) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true, readAt: new Date() }
    );
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );
    return true;
  } catch (error) {
    console.error('Error marking all as read:', error);
    return false;
  }
};

export default {
  sendNotification,
  notifySessionStarted,
  notifySessionEnded,
  notifyLeaveStatusUpdate,
  notifyNewAnnouncement,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
