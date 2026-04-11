import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    type: {
      type: String,
      enum: ['LEAVE', 'APPEAL'],
      default: 'LEAVE',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    facultyResponse: {
      type: String,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attachment: {
      type: String, // URL to document/image
    },
  },
  {
    timestamps: true,
  }
);

leaveSchema.index({ student: 1, status: 1 });
leaveSchema.index({ class: 1, status: 1 });

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
