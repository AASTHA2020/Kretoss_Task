const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const query = status === 'all' ? {} : { status };

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
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
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'primaryImage', maxCount: 1 },
  { name: 'secondaryImages', maxCount: 10 }
]), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),
  body('ticketPrice').isFloat({ min: 0 }).withMessage('Ticket price must be a non-negative number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, totalSeats, ticketPrice } = req.body;

    // Check if primary image is uploaded
    if (!req.files || !req.files.primaryImage || req.files.primaryImage.length === 0) {
      return res.status(400).json({ message: 'Primary image is required' });
    }

    const primaryImage = req.files.primaryImage[0];
    const secondaryImages = req.files.secondaryImages || [];

    // Extract public_id from the path or filename
    const getPublicId = (image) => {
      return image.filename || image.path.split('/').pop().split('.')[0];
    };

    // Create event object
    const eventData = {
      title,
      description,
      date: new Date(date),
      location,
      totalSeats: parseInt(totalSeats),
      ticketPrice: parseFloat(ticketPrice),
      primaryImage: {
        publicId: getPublicId(primaryImage),
        url: primaryImage.path
      },
      secondaryImages: secondaryImages.map(img => ({
        publicId: getPublicId(img),
        url: img.path
      })),
      createdBy: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    // Emit socket event for realtime update
    const io = req.app.get('io');
    if (io) {
      io.emit('admin:stats-updated');
      io.emit('events:updated');
    }

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'primaryImage', maxCount: 1 },
  { name: 'secondaryImages', maxCount: 10 }
]), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('totalSeats').optional().isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),
  body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price must be a non-negative number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updateData = { ...req.body };

    // Extract public_id from the path or filename
    const getPublicId = (image) => {
      return image.filename || image.path.split('/').pop().split('.')[0];
    };

    // Handle primary image update
    if (req.files.primaryImage && req.files.primaryImage.length > 0) {
      // Delete old primary image
      if (event.primaryImage.publicId) {
        await cloudinary.uploader.destroy(event.primaryImage.publicId);
      }
      
      const primaryImage = req.files.primaryImage[0];
      updateData.primaryImage = {
        publicId: getPublicId(primaryImage),
        url: primaryImage.path
      };
    }

    // Handle secondary images update
    if (req.files.secondaryImages && req.files.secondaryImages.length > 0) {
      // Delete old secondary images
      for (const img of event.secondaryImages) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      
      updateData.secondaryImages = req.files.secondaryImages.map(img => ({
        publicId: getPublicId(img),
        url: img.path
      }));
    }

    // Update date if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Update numeric fields
    if (updateData.totalSeats) {
      updateData.totalSeats = parseInt(updateData.totalSeats);
    }
    if (updateData.ticketPrice) {
      updateData.ticketPrice = parseFloat(updateData.ticketPrice);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    // Emit socket event for realtime update
    const io = req.app.get('io');
    if (io) {
      io.emit('events:updated');
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete images from Cloudinary
    await cloudinary.uploader.destroy(event.primaryImage.publicId);
    for (const img of event.secondaryImages) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await Event.findByIdAndDelete(req.params.id);

    // Emit socket event for realtime update
    const io = req.app.get('io');
    if (io) {
      io.emit('admin:stats-updated');
      io.emit('events:updated');
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/events/:id/status
// @desc    Update event status
// @access  Private (Admin only)
router.patch('/:id/status', adminAuth, [
  body('status').isIn(['active', 'cancelled', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Emit socket event for realtime update
    const io = req.app.get('io');
    if (io) {
      io.emit('events:updated');
    }

    res.json(event);
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
