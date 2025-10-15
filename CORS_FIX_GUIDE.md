# 🔧 **CORS Error Fix Guide**

## ✅ **CORS Configuration Updated**

### **🔧 Backend CORS Fix Applied:**

#### **1. Updated server.js with proper CORS configuration:**
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://kretoss-task.onrender.com',
    'https://kretoss-task.vercel.app',
    process.env.FRONTEND_BASE_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};
```

#### **2. Added preflight OPTIONS handler:**
```javascript
app.options('*', cors(corsOptions));
```

#### **3. Updated Socket.IO CORS:**
```javascript
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://kretoss-task.onrender.com',
      'https://kretoss-task.vercel.app',
      process.env.FRONTEND_BASE_URL
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }
});
```

## 🚀 **Deployment Steps**

### **1. Update Backend Environment Variables:**
Add to your backend `.env` file:
```env
FRONTEND_BASE_URL=https://kretoss-task.onrender.com
```

### **2. Update Frontend Environment Variables:**
Update your frontend environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

### **3. Redeploy Backend:**
```bash
cd backend
# Commit and push changes
git add .
git commit -m "Fix CORS configuration"
git push
```

### **4. Test CORS:**
After redeployment, test the API:
```bash
curl -H "Origin: https://kretoss-task.onrender.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS \
     https://your-backend-url.com/api/auth/login
```

## 🧪 **CORS Testing**

### **✅ Check CORS Headers:**
Look for these headers in the response:
- `Access-Control-Allow-Origin: https://kretoss-task.onrender.com`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Authorization,Accept,Origin,X-Requested-With`
- `Access-Control-Allow-Credentials: true`

### **✅ Test API Calls:**
1. **Login API:** Should work from frontend
2. **Events API:** Should load events
3. **Payment API:** Should process payments
4. **Socket.IO:** Should connect for real-time updates

## 🎯 **Common CORS Issues Fixed:**

### **✅ Origin Mismatch:**
- Added your exact domain to allowed origins
- Included both HTTP and HTTPS versions

### **✅ Credentials Support:**
- Enabled `credentials: true` for JWT tokens
- Proper cookie handling

### **✅ Preflight Requests:**
- Added OPTIONS handler for preflight requests
- Proper method and header handling

### **✅ Socket.IO CORS:**
- Updated Socket.IO CORS configuration
- Real-time updates will work

## 🚀 **Ready for Deployment!**

After applying these changes and redeploying your backend, the CORS errors should be resolved! 🎉

### **📋 Next Steps:**
1. **Commit and push** backend changes
2. **Redeploy** backend server
3. **Test** frontend API calls
4. **Verify** CORS headers in browser DevTools

**CORS issues should be completely resolved!** ✅
