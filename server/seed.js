import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Class from './src/models/Class.js';
import connectDB from './src/config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Class.deleteMany({});
    
    console.log('Creating users...');
    
    // Create owner/admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@proxymukt.com',
      password: 'Admin@123',
      role: 'ADMIN',
      department: 'Administration',
    });
    
    // Create faculty members
    const faculty1 = await User.create({
      name: 'Dr. John Smith',
      email: 'faculty1@gmail.com',
      password: 'faculty1',
      role: 'FACULTY',
      department: 'Computer Science',
    });
    
    const faculty2 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'faculty2@gmail.com',
      password: 'faculty2',
      role: 'FACULTY',
      department: 'Computer Science',
    });
    
    // Create students
    const students = await User.create([
      {
        name: 'Student One',
        email: 'student1@gmail.com',
        password: 'student1',
        role: 'STUDENT',
        studentId: 'STU001',
        department: 'Computer Science',
      },
      {
        name: 'Alice Johnson',
        email: 'student2@gmail.com',
        password: 'student2',
        role: 'STUDENT',
        studentId: 'STU002',
        department: 'Computer Science',
      },
      {
        name: 'Bob Williams',
        email: 'student3@gmail.com',
        password: 'student3',
        role: 'STUDENT',
        studentId: 'STU003',
        department: 'Computer Science',
      },
      {
        name: 'Charlie Brown',
        email: 'student4@gmail.com',
        password: 'student4',
        role: 'STUDENT',
        studentId: 'STU004',
        department: 'Computer Science',
      },
      {
        name: 'Diana Prince',
        email: 'student5@gmail.com',
        password: 'student5',
        role: 'STUDENT',
        studentId: 'STU005',
        department: 'Computer Science',
      },
    ]);
    
    console.log('Creating classes...');
    
    // Create classes
    await Class.create([
      {
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        description: 'Introduction to data structures',
        faculty: faculty1._id,
        department: 'Computer Science',
        semester: 'Spring 2026',
        students: students.map((s) => s._id),
      },
      {
        name: 'Database Management Systems',
        code: 'CS301',
        description: 'Relational databases and SQL',
        faculty: faculty1._id,
        department: 'Computer Science',
        semester: 'Spring 2026',
        students: students.map((s) => s._id),
      },
      {
        name: 'Web Development',
        code: 'CS401',
        description: 'Full-stack web development',
        faculty: faculty2._id,
        department: 'Computer Science',
        semester: 'Spring 2026',
        students: students.slice(0, 3).map((s) => s._id),
      },
    ]);
    
    console.log('✅ Database seeded successfully!');
    console.log('\n🔐 Login credentials:');
    console.log('👑 Admin: admin@proxymukt.com / Admin@123');
    console.log('👨‍🏫 Faculty: faculty1@gmail.com / faculty1');
    console.log('👨‍🎓 Student: student1@gmail.com / student1');
    console.log('\n📚 Created 3 classes with 5 students enrolled');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
