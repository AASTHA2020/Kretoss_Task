const express = require('express');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalBookings] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Booking.countDocuments({ status: 'paid' })
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalBookings
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/events
// @desc    Get all events for admin dashboard
// @access  Private (Admin only)
router.get('/events', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const query = status === 'all' ? {} : { status };

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
