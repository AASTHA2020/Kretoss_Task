const express = require('express');
const router = express.Router();

// Simple test route
router.post('/login', (req, res) => {
  try {
    console.log('🔍 Simple login test - Request received');
    console.log('🔍 Body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }
    
    // Simple response for testing
    res.json({
      message: 'Login test successful',
      token: 'test-token-123',
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: email,
        role: 'user'
      }
    });
    
  } catch (error) {
    console.error('❌ Simple login error:', error);
    res.status(500).json({ 
      message: 'Server error: ' + error.message 
    });
  }
});

// Simple /me endpoint for testing
router.get('/me', (req, res) => {
  try {
    console.log('🔍 /me endpoint called');
    
    // For testing, return a mock user
    res.json({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@test.com',
        role: 'user'
      }
    });
    
  } catch (error) {
    console.error('❌ /me error:', error);
    res.status(500).json({ 
      message: 'Server error: ' + error.message 
    });
  }
});

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth route is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
