
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css"; 

export default function Login() {
  // Added 'otp' to the form state
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  
  const [isLogin, setIsLogin] = useState(true); 
  // NEW: State to track if we are on the OTP step during registration
  const [isOtpStep, setIsOtpStep] = useState(false); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- 1. LOGIN LOGIC ---
        const { data } = await API.post("/auth/login", { 
          email: form.email, 
          password: form.password 
        });
        localStorage.setItem("token", data.token);
        navigate("/dashboard");

      } else if (!isOtpStep) {
        // --- 2. REGISTRATION (STEP 1): SEND OTP ---
        const allowedDomainsRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;
        
        if (!allowedDomainsRegex.test(form.email)) {
          alert("Registration failed: Please use a supported email provider (Gmail, Yahoo, Outlook, or Hotmail).");
          setLoading(false);
          return;
        }

        await API.post("/auth/send-otp", { email: form.email });
        alert("OTP sent to your email! Please check your inbox.");
        setIsOtpStep(true); // Move to OTP input screen

      } else {
        // --- 3. REGISTRATION (STEP 2): VERIFY & CREATE ACCOUNT ---
        const { data } = await API.post("/auth/register", form); 
        alert("Account created successfully!");
        
        // Auto-login after successful verification
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Full Backend Error:", error);

      if (isLogin) {
        alert("Login Failed. Please check your credentials.");
      } else if (!isOtpStep) {
        // Errors while requesting OTP
        alert(error.response?.data?.message || "Account already exists or sign up failed.");
      } else {
        // Errors while verifying OTP
        alert(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to toggle modes and reset OTP step
  const handleToggleMode = (toLogin) => {
    setIsLogin(toLogin);
    setIsOtpStep(false);
    setForm({ name: "", email: "", password: "", otp: "" });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        {/* HEADER */}
        <div className="login-header">
          <div className="icon-container">
            {isLogin ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            )}
          </div>
          <h2>
            {isLogin 
              ? "Welcome back" 
              : isOtpStep 
                ? "Verify your email" 
                : "Create an account"}
          </h2>
          <p>
            {isLogin 
              ? "Please enter your details to sign in." 
              : isOtpStep 
                ? `Enter the code sent to ${form.email}`
                : "Fill in your details to get started."}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* FULL NAME (Hide if Login OR if on OTP Step) */}
          {!isLogin && !isOtpStep && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}

          {/* EMAIL ADDRESS (Always show, but lock it during OTP step) */}
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={isOtpStep}
              style={isOtpStep ? { backgroundColor: "#f3f4f6", color: "#6b7280", cursor: "not-allowed" } : {}}
            />
          </div>

          {/* PASSWORD (Hide if on OTP Step) */}
          {!isOtpStep && (
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength="6"
              />
            </div>
          )}

          {/* OTP INPUT (Show ONLY on OTP Step) */}
          {!isLogin && isOtpStep && (
            <div className="input-group">
              <label>Enter 6-Digit Code</label>
              <input
                type="text"
                placeholder="e.g. 123456"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                required
                maxLength="6"
                style={{ letterSpacing: "4px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}
              />
            </div>
          )}

          {/* UTILITIES (Forgot Password / Remember me) */}
          {isLogin && (
            <div className="form-utilities">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button 
                 type="button" 
                 onClick={() => navigate("/forgot-password")}
                 style={{
                   background: "transparent",
                   border: "none",
                   color: "#4f46e5",
                   fontSize: "14px",
                   fontWeight: "500",
                   cursor: "pointer",
                   padding: 0
                 }}
              >
                 Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading 
              ? "Processing..." 
              : isLogin 
                ? "Sign in" 
                : isOtpStep 
                  ? "Verify & Create Account" 
                  : "Send OTP"}
          </button>
        </form>

        {/* FOOTER TOGGLE & BACK BUTTON */}
        <div className="login-footer">
          {isOtpStep ? (
             <p>
               <span className="toggle-link" onClick={() => setIsOtpStep(false)}>
                 Wait, go back to edit details
               </span>
             </p>
          ) : isLogin ? (
            <p>
              Don't have an account?{" "}
              <span className="toggle-link" onClick={() => handleToggleMode(false)}>
                Sign up now
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span className="toggle-link" onClick={() => handleToggleMode(true)}>
                Sign in
              </span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}