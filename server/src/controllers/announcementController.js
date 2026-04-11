import Announcement from '../models/Announcement.js';
import { notifyNewAnnouncement } from '../utils/notificationService.js';

/**
 * Create an announcement
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, scope, targetId, expiresAt } = req.body;
    
    const announcement = await Announcement.create({
      title,
      content,
      type: type || 'INFO',
      scope: scope || 'GLOBAL',
      targetId,
      expiresAt,
      sender: req.user._id
    });
    
    // Trigger notification
    await notifyNewAnnouncement(announcement);
    
    // Emit notification via socket
    if (req.app.get('io')) {
      const room = scope === 'GLOBAL' ? 'global' : `class-${targetId}`;
      req.app.get('io').to(room).emit('new-announcement', announcement);
    }
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { announcement }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get announcements for a user
 */
export const getAnnouncements = async (req, res) => {
  try {
    const { classIds } = req.query; // Expecting comma-separated IDs
    
    let query = {
      $or: [
        { scope: 'GLOBAL' },
        { expiresAt: { $gt: new Date() } },
        { expiresAt: { $exists: false } }
      ]
    };
    
    if (classIds) {
      const ids = classIds.split(',');
      query.$or.push({ scope: 'CLASS', targetId: { $in: ids } });
    }
    
    const announcements = await Announcement.find(query)
      .populate('sender', 'name role')
      .sort('-createdAt')
      .limit(20);
    
    res.json({
      success: true,
      data: { announcements }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Only sender or admin can delete
    if (announcement.sender.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }
    
    await announcement.deleteOne();
    
    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
