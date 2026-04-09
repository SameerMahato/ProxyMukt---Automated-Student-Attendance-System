import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const email = 'admin@example.com';
    const password = 'admin123';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }

    console.log('User found:', user.email);
    console.log('Stored hashed password:', user.password);

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid with bcrypt.compare?', isValid);

    const isValidMethod = await user.comparePassword(password);
    console.log('Is password valid with user.comparePassword?', isValidMethod);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

verify();
