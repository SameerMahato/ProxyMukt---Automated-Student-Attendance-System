import Class from '../models/Class.js';
import User from '../models/User.js';

/**
 * Create new class
 */
export const createClass = async (req, res) => {
  try {
    const { name, code, description, department, semester, schedule } = req.body;
    
    // Check if class code already exists
    const existingClass = await Class.findOne({ code: code.toUpperCase() });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'A class with this code already exists. Please use a different class code.',
      });
    }
    
    const newClass = await Class.create({
      name,
      code: code.toUpperCase(),
      description,
      faculty: req.user._id,
      department,
      semester,
      schedule,
    });
    
    await newClass.populate('faculty', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: { class: newClass },
    });
  } catch (error) {
    console.error('Error creating class:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A class with this code already exists. Please use a different class code.',
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create class',
    });
  }
};

/**
 * Get all classes (filtered by role)
 */
export const getClasses = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'FACULTY') {
      query.faculty = req.user._id;
    } else if (req.user.role === 'STUDENT') {
      query.students = req.user._id;
    }
    
    const classes = await Class.find(query)
      .populate('faculty', 'name email')
      .populate('students', 'name email studentId')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: { classes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get single class by ID
 */
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('faculty', 'name email')
      .populate('students', 'name email studentId');
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }
    
    res.json({
      success: true,
      data: { class: classData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update class
 */
export const updateClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }
    
    // Check authorization
    if (req.user.role === 'FACULTY' && classData.faculty.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this class',
      });
    }
    
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('faculty', 'name email');
    
    res.json({
      success: true,
      message: 'Class updated successfully',
      data: { class: updatedClass },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete class
 */
export const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }
    
    await Class.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add students to class
 */
export const addStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;
    
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }
    
    // Verify students exist
    const students = await User.find({
      _id: { $in: studentIds },
      role: 'STUDENT',
    });
    
    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some student IDs are invalid',
      });
    }
    
    // Add students (avoid duplicates)
    classData.students = [...new Set([...classData.students, ...studentIds])];
    await classData.save();
    
    await classData.populate('students', 'name email studentId');
    
    res.json({
      success: true,
      message: 'Students added successfully',
      data: { class: classData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove student from class
 */
export const removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }
    
    classData.students = classData.students.filter(
      (id) => id.toString() !== studentId
    );
    await classData.save();
    
    res.json({
      success: true,
      message: 'Student removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Student self-enrollment (join class by code)
 */
export const joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;
    
    if (!classCode) {
      return res.status(400).json({
        success: false,
        message: 'Class code is required',
      });
    }
    
    // Find class by code
    const classData = await Class.findOne({ code: classCode.toUpperCase() });
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found. Please check the class code.',
      });
    }
    
    // Check if student is already enrolled
    if (classData.students.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class',
      });
    }
    
    // Add student to class
    classData.students.push(req.user._id);
    await classData.save();
    
    await classData.populate('faculty', 'name email');
    
    res.json({
      success: true,
      message: 'Successfully joined the class!',
      data: { class: classData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all available classes (for students to browse and join)
 */
export const getAvailableClasses = async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (department) {
      query.department = department;
    }
    
    const classes = await Class.find(query)
      .populate('faculty', 'name email')
      .select('name code description department semester faculty students')
      .sort('-createdAt');
    
    // For students, add enrollment status
    if (req.user.role === 'STUDENT') {
      const classesWithStatus = classes.map(cls => ({
        ...cls.toObject(),
        isEnrolled: cls.students.some(s => s.toString() === req.user._id.toString()),
        studentCount: cls.students.length,
      }));
      
      return res.json({
        success: true,
        data: { classes: classesWithStatus },
      });
    }
    
    res.json({
      success: true,
      data: { classes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
