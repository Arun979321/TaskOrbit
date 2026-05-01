

## =====> Author
**Arun Kumar**
Computer Science & Engineering Undergraduate
Galgotias University
*   **GPA:** 7.6
*   **Stack:** MERN (MongoDB, Express, React, Node.js)



### **Final Checklist before saving:**
1.  **Vercel:** Ensure you have added the `VITE_API_BASE_URL` in your Vercel Environment Variables and **Redeployed**.
2.  **CORS:** Confirm `https://task-orbit-seven.vercel.app` is inside your `allowedOrigins` array in `server.js`.
3.  **Networking:** Confirm `family: 4` is added to your `nodemailer.createTransport` in `sendEmail.js`Your documentation is strong, but to reflect the recent fixes and ensure it’s "production-grade," you should update it to include the networking and deployment optimizations we just implemented.

Here is the suggested updated version. You can **copy-paste** this directly into your `README.md`.

---

# Task Orbit | Production-Grade MERN Task Management

Task Orbit is a full-stack productivity suite built with a focus on security, scalability, and seamless user experience. It implements a decoupled MERN architecture, utilizing JWT-based authentication, automated email workflows, and a mobile-optimized responsive frontend.

## 🌐 Live Links
*   **Frontend Interface:** [https://task-orbit-seven.vercel.app](https://task-orbit-seven.vercel.app) (Updated Primary Domain)
*   **Backend API Service:** [https://taskorbit-api-wi20.onrender.com](https://taskorbit-api-wi20.onrender.com)

---

## =====> System Architecture
The application follows the MVC (Model-View-Controller) pattern on the backend to maintain a clean separation of concerns, while the frontend leverages a Component-Based Architecture with React.

### 🔹 Backend (Node.js & Express)
*   **Config Layer:** Managed database connection logic in `db.js`.
*   **Controller Layer:** Business logic for Auth and Task management.
*   **Model Layer:** Schema definitions using Mongoose for Users, Tasks, and OTP entities.
*   **Middleware:** Custom authentication and security handlers, including `trust proxy` for Render load balancers.
*   **Utils:** Modularized services like `sendEmail.js` with **IPv4 enforcement** to ensure high deliverability.

### 🔹 Frontend (React & Vite)
*   **Pages:** Organized into specific modules (Dashboard, Profile, TaskDetail).
*   **Services:** Centralized API communication using Axios configured for multi-environment support.
*   **Styling:** Modular CSS architecture supporting persistent Light/Dark modes via `localStorage`.

---

## =====> Security Implementations
Industry-standard security measures were a priority during development:
*   **Dynamic CORS Policy:** Implemented a whitelist validator that supports local development and all trusted Vercel subdomains.
*   **Rate Limiting:** Auth routes restricted to 20 attempts per 15-minute window via `express-rate-limit`.
*   **Proxy Trust:** Configured `app.set("trust proxy", 1)` to accurately track client IPs behind Render's proxy.
*   **JWT Authentication:** Stateless user sessions secured via JSON Web Tokens.
*   **Environment Isolation:** Strict use of `.env` for secrets like API keys and DB strings.

---

## =====> Deployment & DevOps
*   **Frontend (Vercel):** Configured with a dedicated `Root Directory` in `/frontend` and `vercel.json` rewrites to support Single Page Application (SPA) routing on refresh.
*   **Backend (Render):** Hosted with automatic CI/CD from the main branch, utilizing custom health checks for maximum uptime.
*   **IPv6 Bypass:** Hardened SMTP transport layer by forcing IPv4 (`family: 4`) to resolve cloud-specific networking constraints.

---

## =====> Local Installation

### Clone & Backend Setup:
```bash
git clone [https://github.com/arun979321/task-manager.git](https://github.com/arun979321/task-manager.git)
cd backend
npm install
# Add .env variables (MONGO_URI, JWT_SECRET, EMAIL_USERNAME, EMAIL_PASSWORD)
npm start
Frontend Setup:
Bash
cd ../frontend
npm install
# Create .env and set VITE_API_BASE_URL=http://localhost:5000
npm run dev
=====> Author
Arun Kumar
Computer Science & Engineering Undergraduate
Galgotias University
Stack: MERN (MongoDB, Express, React, Node.js)
