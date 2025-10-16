# Event Booking Platform - MERN Stack

A modern event booking platform built with MERN stack (MongoDB, Express.js, React/Next.js, Node.js) featuring role-based authentication.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access (Admin/User)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🚀 Next.js 13 with App Router
- 📅 Event Management (Admin)
- 🖼️ Cloudinary Image Upload
- 📊 Event CRUD Operations
- ⚡ **Optimized Performance** - Smart loader system for slow API responses
- 🎯 **Enhanced UX** - Real-time progress indicators and timeout warnings
- 📈 **Performance Monitoring** - Request duration tracking and optimization

## Project Structure

```
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Server entry point
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js 13 app directory
│   │   ├── components/     # React components
│   │   ├── admin-dashboard/ # Admin dashboard page
│   │   ├── user-dashboard/ # User dashboard page
│   │   └── page.tsx        # Welcome page
│   ├── lib/                # Utility functions
│   └── package.json        # Frontend dependencies
└── README.md
```

## 🧪 **Testing Credentials**

### **✅ Admin Panel Testing:**
- **Email**: `missaastha11@gmail.com`
- **Password**: `Aastha@123`
- **Role**: Admin
- **Access**: Admin Dashboard, User Management, Event Management

### **✅ User Panel Testing:**
- **Email**: `peterparker@gmail.com`
- **Password**: `peterparker`
- **Role**: User
- **Access**: User Dashboard, Event Booking, Profile Management

## 🚀 **Quick Start (Recommended)**

### **Run Both Backend & Frontend Together:**
```bash
# Install all dependencies
npm run setup

# Start both servers
npm run dev
```

### **Access URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### **Test with Credentials:**
1. **Admin Login**: `missaastha11@gmail.com` / `Aastha@123`
2. **User Login**: `peterparker@gmail.com` / `peterparker`

## Getting Started (Manual Setup)

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000

# Cloudinary Configuration (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🧪 **Complete Testing Guide**

### **✅ Testing Credentials:**

**Admin Panel Testing:**
- **Email**: `missaastha11@gmail.com`
- **Password**: `Aastha@123`
- **Role**: Admin
- **Access**: Admin Dashboard, User Management, Event Management

**User Panel Testing:**
- **Email**: `peterparker@gmail.com`
- **Password**: `peterparker`
- **Role**: User
- **Access**: User Dashboard, Event Booking, Profile Management

### **✅ Step-by-Step Testing:**

**Admin Testing:**
1. **Go to**: http://localhost:3000
2. **Click**: "Login as Admin" button
3. **Enter**: `missaastha11@gmail.com` / `Aastha@1234`
4. **Click**: Login
5. **Expected**: Redirect to admin dashboard
6. **Features**: User management, event management, analytics

**User Testing:**
1. **Go to**: http://localhost:3000
2. **Click**: "Login as User" button
3. **Enter**: `peterparker@gmail.com` / `peterparker`
4. **Click**: Login
5. **Expected**: Redirect to user dashboard
6. **Features**: Event booking, profile management, bookings history

### **✅ Performance Testing:**
- **Loader System**: Click any button to see optimized loader
- **Duration Counter**: Shows elapsed time (e.g., "3s elapsed")
- **Timeout Warnings**: Appears after 3 seconds for slow responses
- **Console Logs**: Check browser console for performance metrics
- **Multiple Requests**: Handles concurrent API calls efficiently

### **✅ API Performance Optimizations:**
- **15-second timeout** for faster feedback
- **3-second timeout warnings** for slow responses
- **Request retry mechanism** for failed requests
- **Connection pooling** for better performance
- **Smart loader management** for concurrent requests

## Authentication Flow

### Welcome Page
- Two buttons: "Login as Admin" and "Login as User"
- Signup links for both roles

### Login Forms
- Email and password fields
- Role-specific validation
- Redirects to appropriate dashboard after login

### Signup Forms
- Name, email, password, and confirm password fields
- Role selection (admin/user)
- Automatic login after successful registration

### Dashboards
- **Admin Dashboard**: Management interface with stats and quick actions
- **User Dashboard**: User interface with bookings and event browsing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get single event (public)
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `PATCH /api/events/:id/status` - Update event status (admin only)

### Request/Response Format

#### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests

### Frontend
- Next.js 13 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- js-cookie for token management

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Next Steps

This is the foundation for the event booking platform. Future features to implement:

- Event management (CRUD operations)
- Event booking system
- Payment integration
- Email notifications
- File upload for event images
- Advanced search and filtering
- Real-time updates
- Admin analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
