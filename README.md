Task Orbit | Production-Grade MERN Task Management

Task Orbit is a full stack productivity application built using the MERN stack with a strong focus on security scalability and seamless user experience It implements JWT based authentication task management workflows and a responsive user interface optimized for real world usage

🌐 Live Links

Frontend Interface
https://taskorbit-production.up.railway.app

Backend API Service
https://taskorbit-production.up.railway.app

=====> System Architecture

The application follows the MVC Model View Controller pattern on the backend to maintain clean separation of concerns while the frontend uses a component based architecture with React

🔹 Backend Node.js and Express

Config Layer
Database connection handled in db.js

Controller Layer
Business logic for authentication and task management

Model Layer
Mongoose schemas for Users Tasks and OTP

Middleware
Authentication security handling rate limiting and proxy trust configuration

Utils
Email utility for OTP and password reset with production aware handling

🔹 Frontend React and Vite

Pages
Structured modules such as Dashboard Profile Tasks and Authentication

Services
Centralized API communication using Axios with environment based configuration

Styling
Responsive design with clean layout and support for light and dark modes

=====> Security Implementations

CORS Policy
Configured to allow trusted origins for both development and production

Rate Limiting
Authentication endpoints protected against brute force attacks

JWT Authentication
Secure stateless session handling

Proxy Trust
Configured to correctly handle client IPs in cloud deployment

Environment Security
Sensitive data stored securely using environment variables

=====> Deployment and DevOps

Deployment Platform
Full application deployed on Railway with automatic CI CD

Architecture
Single domain deployment serving both frontend and backend

Networking Consideration
Handled real world cloud networking limitations such as blocked SMTP ports

Email Handling Note
Due to cloud platform restrictions on SMTP services email functionality is temporarily limited in production and is being migrated to API based solutions for reliability

=====> Features

User Authentication
Secure login registration and profile management

Task Management
Create update delete and track tasks with filtering

Responsive UI
Optimized for both desktop and mobile devices

Theme Support
Light and dark mode with persistent preferences

=====> Local Installation

Clone the repository
git clone https://github.com/arun979321/task-manager.git

Backend Setup
cd backend
npm install
Add environment variables such as MONGO_URI JWT_SECRET EMAIL_USERNAME EMAIL_PASSWORD
npm start

Frontend Setup
cd frontend
npm install
Create environment variable VITE_API_URL pointing to backend
npm run dev

=====> Author

Arun Kumar
Computer Science and Engineering Undergraduate
Galgotias University

GPA 7.6

Stack MERN MongoDB Express React Node.js
