import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await API.put(`/auth/resetpassword/${token}`, { password });
      setMessage("Password successfully reset! You can now log in.");

      setTimeout(() => navigate("/"), 3000); 
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#111827' }}>Create New Password</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="password" 
            placeholder="Enter new password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? "Saving..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '16px', fontSize: '14px', color: message.includes("Invalid") ? '#ef4444' : '#10b981', textAlign: 'center' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}