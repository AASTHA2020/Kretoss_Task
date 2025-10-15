require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);

// SIMPLIFIED CORS - Allow everything
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Socket.IO with simple CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

// Test route before other routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes - Using simple auth for testing
app.use('/api/auth', require('./routes/auth-simple'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/checkout', require('./routes/checkout'));
// app.use('/api/admin', require('./routes/admin'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Event Booking API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('❌ Stack:', err.stack);
  res.status(500).json({ 
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

// Add error handling for server
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Add process error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('Environment variables loaded:');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗');
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓' : '✗');
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓' : '✗');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓' : '✗');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓' : '✗');
});
