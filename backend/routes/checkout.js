const express = require('express');
const Stripe = require('stripe');
const { auth } = require('../middleware/auth');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout session
router.post('/create-session', auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.availableSeats <= 0) return res.status(400).json({ message: 'Event is sold out' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(event.ticketPrice * 100),
            product_data: {
              name: event.title,
              description: event.description.slice(0, 250)
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/cancel`,
      metadata: {
        eventId: event._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // Create a pending booking to track session
    await Booking.create({
      user: req.user._id,
      event: event._id,
      amount: event.ticketPrice,
      currency: 'usd',
      status: 'pending',
      sessionId: session.id
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook or success confirm route
router.post('/confirm', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const booking = await Booking.findOne({ sessionId }).populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'paid') return res.json({ message: 'Already confirmed' });

    // Decrement seats atomically if still available
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: booking.event._id, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    if (!updatedEvent) {
      booking.status = 'failed';
      await booking.save();
      return res.status(400).json({ message: 'No seats available' });
    }

    booking.status = 'paid';
    await booking.save();

    // Emit socket event for realtime update
    const io = req.app.get('io');
    if (io) {
      io.emit('event:updated', {
        eventId: updatedEvent._id.toString(),
        availableSeats: updatedEvent.availableSeats,
        isSoldOut: updatedEvent.availableSeats <= 0
      });
      io.emit('admin:stats-updated');
    }

    res.json({ success: true, bookingId: booking._id });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


