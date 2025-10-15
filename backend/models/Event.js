const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Total seats must be at least 1'],
    max: [10000, 'Total seats cannot exceed 10000']
  },
  availableSeats: {
    type: Number,
    required: true,
    default: function() {
      return this.totalSeats;
    }
  },
  ticketPrice: {
    type: Number,
    required: [true, 'Ticket price is required'],
    min: [0, 'Ticket price cannot be negative']
  },
  primaryImage: {
    publicId: {
      type: String,
      required: [true, 'Primary image is required']
    },
    url: {
      type: String,
      required: [true, 'Primary image URL is required']
    }
  },
  secondaryImages: [{
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Update available seats when total seats change
eventSchema.pre('save', function(next) {
  if (this.isModified('totalSeats')) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

// Virtual for checking if event is fully booked
eventSchema.virtual('isFullyBooked').get(function() {
  return this.availableSeats === 0;
});

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
  return this.availableSeats <= 0;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
