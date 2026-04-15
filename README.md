### Task Orbit | Production-Grade MERN Task Management
### Task Orbit is a full-stack productivity suite built with a focus on security, scalability, and seamless user experience. It implements a decoupled MERN architecture, utilizing JWT-based authentication, automated email workflows, and a mobile-optimized responsive frontend.

### 🌐 Live Links
- Frontend Interface: https://task-orbit-arundq52.vercel.app/

- Backend API Service: https://taskorbit-api-wi20.onrender.com/

### =====>System Architecture
- The application follows the MVC (Model-View-Controller) pattern on the backend to maintain a clean separation of concerns, while the frontend leverages a Component-Based Architecture with React.

### 🔹 Backend (Node.js & Express)
- Config Layer: Managed database connection logic in db.js.

- Controller Layer: Business logic for Auth and Task management (e.g., taskControllers.js).

- Model Layer: Schema definitions using Mongoose for Users, Tasks, and OTP entities.

- Routing Layer: RESTful endpoint definitions for modular code management.

- Middleware: Custom authentication and security handlers.

- Utils: Modularized services like sendEmail.js for SMTP integration.

### 🔹 Frontend (React & Vite)
- Pages: Organized into specific modules (Dashboard, Profile, TaskDetail).

- Services: Centralized API communication using Axios in the services/ directory.

- Styling: Modular CSS architecture for both Light and Dark modes.

### ======>Tech Stack & Key Dependencies
- Frontend: React 18, Vite (for ultra-fast builds), React Router DOM.

- Backend: Node.js, Express.js.

- Database: MongoDB Atlas (NoSQL).

- Security: Helmet.js (HTTP headers), Express Rate Limit (Brute-force protection).

- Communication: Nodemailer (SMTP for OTPs).

- DevOps: Git, Vercel (Frontend CI/CD), Render (Backend hosting).

### =====>Security Implementations
- Industry-standard security measures were a priority during development:

- CORS Policy: Restricted cross-origin requests to trusted Vercel subdomains only.

- Rate Limiting: Auth routes restricted to 20 attempts per 15-minute window.

- Proxy Trust: Configured trust proxy to correctly handle IP headers behind Render's load balancer.

- JWT Authentication: Stateless user sessions secured via JSON Web Tokens.

- Environment Isolation: Strict use of .env for secrets like API keys and DB strings.

### =====> Features & UX
- Responsive Engine: Custom Media Queries handle layout shifts from Desktop to Mobile.

- Client-Side Routing: Managed via vercel.json rewrites to support SPAs on page refresh.

- Smart Search & Filter: Real-time filtering by priority levels and task completion.

- Theming: Persistent Light/Dark mode based on localStorage.

### =====>Local Installation
- Clone & Backend Setup:
  - git clone https://github.com/arun979321/task-manager.git
  - cd backend
  - npm install
-  Add .env variables (MONGO_URI, JWT_SECRET, EMAIL_PASS)
   - npm start

- Frontend Setup:
  -  cd ../frontend
  -  npm install
-  Set VITE_API_URL in .env
    - npm run dev

### =====>Author
- Arun Kumar
- Computer Science & Engineering Undergraduate
- Galgotias University
