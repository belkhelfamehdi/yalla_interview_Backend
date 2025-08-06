# Yalla Interview Backend

A secure REST API for the Yalla Interview application, providing user authentication, interview session management, and AI-powered question generation.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Session Management**: Create and manage interview preparation sessions
- **AI Integration**: Generate personalized interview questions using Google Gemini AI
- **File Uploads**: Secure profile image upload functionality
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Comprehensive validation for all endpoints

## 🛠️ Tech Stack

- **Node.js & Express**: Backend framework
- **MongoDB & Mongoose**: Database and ODM
- **Google Gemini AI**: AI question generation
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Multer**: File upload handling

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your .env file with required values

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

## � API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/upload-image` - Upload profile image

### Sessions
- `POST /api/sessions/create` - Create interview session (protected)
- `GET /api/sessions/my-sessions` - Get user sessions (protected)
- `GET /api/sessions/:id` - Get session details (protected)
- `DELETE /api/sessions/:id` - Delete session (protected)

### AI
- `POST /api/ai/generate-questions` - Generate interview questions (protected)
- `POST /api/ai/generate-explanations` - Get concept explanations (protected)

### Health
- `GET /api/health` - Server health check

## � Security Features

- Rate limiting on all endpoints
- Input validation and sanitization
- Secure file upload handling
- MongoDB injection protection
- CORS configuration
- Secure error handling
