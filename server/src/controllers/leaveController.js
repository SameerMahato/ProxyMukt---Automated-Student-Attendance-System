import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Session from '../models/Session.js';
import { notifyLeaveStatusUpdate } from '../utils/notificationService.js';

/**
 * Submit a leave request
 */
export const submitLeave = async (req, res) => {
  try {
    const { classId, sessionId, type, reason, startDate, endDate, attachment } = req.body;
    
    const leave = await Leave.create({
      student: req.user._id,
      class: classId,
      session: sessionId,
      type: type || 'LEAVE',
      reason,
      startDate,
      endDate,
      attachment
    });
    
    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: { leave }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get my leave requests (Student)
 */
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ student: req.user._id })
      .populate('class', 'name code')
      .populate('session', 'title date')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: { leaves }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get leave requests for review (Faculty/Admin)
 */
export const getPendingLeaves = async (req, res) => {
  try {
    const query = { status: 'PENDING' };
    
    // If faculty, only show leaves for their classes
    if (req.user.role === 'FACULTY') {
      // We would filter by classes taught by this faculty
      // For now, simpler:
    }
    
    const leaves = await Leave.find(query)
      .populate('student', 'name email studentId')
      .populate('class', 'name code')
      .populate('session', 'title date')
      .sort('createdAt');
    
    res.json({
      success: true,
      data: { leaves }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Respond to a leave request
 */
export const respondToLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
    
    // Validate status enum
    const validStatuses = ['APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be APPROVED or REJECTED'
      });
    }
    
    const leave = await Leave.findById(id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }
    
    if (leave.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Leave request has already been processed'
      });
    }
    
    leave.status = status;
    leave.facultyResponse = response;
    leave.respondedBy = req.user._id;
    
    await leave.save();
    
    // Trigger notification
    await notifyLeaveStatusUpdate(leave);
    
    // If approved, optionally update attendance
    // This could be complex, for now we just mark the status
    
    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()}`,
      data: { leave }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
