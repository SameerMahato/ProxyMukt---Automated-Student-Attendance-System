import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Day of week is required'],
    },
    startTime: {
      type: String, // HH:mm format
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // HH:mm format
      required: [true, 'End time is required'],
    },
    room: {
      type: String,
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

timetableSchema.index({ class: 1, dayOfWeek: 1 });
timetableSchema.index({ faculty: 1 });

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;
