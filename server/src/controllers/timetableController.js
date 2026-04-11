import Timetable from '../models/Timetable.js';
import Class from '../models/Class.js';

/**
 * Get timetable for a student
 */
export const getStudentTimetable = async (req, res) => {
  try {
    // Get classes student is enrolled in
    const enrolledClasses = await Class.find({ students: req.user._id });
    const classIds = enrolledClasses.map(c => c._id);
    
    const timetable = await Timetable.find({ class: { $in: classIds } })
      .populate('class', 'name code')
      .populate('faculty', 'name')
      .sort('startTime');
    
    // Group by day of week
    const grouped = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };
    
    timetable.forEach(entry => {
      grouped[entry.dayOfWeek].push(entry);
    });
    
    res.json({
      success: true,
      data: { timetable: grouped }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get timetable for a faculty
 */
export const getFacultyTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find({ faculty: req.user._id })
      .populate('class', 'name code')
      .sort('startTime');
    
    const grouped = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };
    
    timetable.forEach(entry => {
      grouped[entry.dayOfWeek].push(entry);
    });
    
    res.json({
      success: true,
      data: { timetable: grouped }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create timetable entry (Admin)
 */
export const createTimetableEntry = async (req, res) => {
  try {
    const { classId, dayOfWeek, startTime, endTime, room, facultyId } = req.body;
    
    // Validate day of week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day of week'
      });
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM format (e.g., 09:00, 14:30)'
      });
    }
    
    // Validate end time is after start time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }
    
    const entry = await Timetable.create({
      class: classId,
      dayOfWeek,
      startTime,
      endTime,
      room,
      faculty: facultyId
    });
    
    res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: { entry }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete timetable entry (Admin)
 */
export const deleteTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const entry = await Timetable.findById(id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }
    
    await entry.deleteOne();
    
    res.json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
