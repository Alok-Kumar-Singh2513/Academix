# Academix

A full-stack Learning Management System built with React, Node.js, and MongoDB.

## Features

- User authentication (Student/Instructor roles)
- Course creation and management
- Video lectures with preview functionality
- Course enrollment system
- Student progress tracking
- Course search and filtering
- Responsive design

## Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Shadcn UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary (for media storage)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd LMS
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Setup:
   - Create a `.env` file in the server directory
   - Add the following variables:
```
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

## API Documentation

### Authentication
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - User login
- GET /api/v1/auth/me - Get current user

### Courses
- GET /api/v1/course/published-courses - Get all published courses
- POST /api/v1/course - Create new course
- GET /api/v1/course/:courseId - Get course details
- PUT /api/v1/course/:courseId - Update course
- DELETE /api/v1/course/:courseId - Delete course

### Lectures
- POST /api/v1/course/:courseId/lecture - Create lecture
- GET /api/v1/course/:courseId/lecture - Get course lectures
- PUT /api/v1/course/:courseId/lecture/:lectureId - Update lecture
- DELETE /api/v1/course/lecture/:lectureId - Delete lecture

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
