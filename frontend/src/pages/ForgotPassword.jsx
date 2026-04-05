import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Ensure this path matches your axios setup

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { data } = await API.post("/auth/forgotpassword", { email });
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch (error) {
      setMessage("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#111827' }}>Forgot Password</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p style={{ marginTop: '16px', fontSize: '14px', color: message.includes("Failed") ? '#ef4444' : '#10b981', textAlign: 'center' }}>{message}</p>}

        <button 
          onClick={() => navigate("/")} 
          style={{ marginTop: '24px', background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', width: '100%' }}
        >
          &larr; Back to Login
        </button>
      </div>
    </div>
  );
}