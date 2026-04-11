import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'URGENT', 'SUCCESS'],
      default: 'INFO',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scope: {
      type: String,
      enum: ['GLOBAL', 'CLASS', 'FACULTY'],
      default: 'GLOBAL',
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId, // Could be Class ID or User ID
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ scope: 1, targetId: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
