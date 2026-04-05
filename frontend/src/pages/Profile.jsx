// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api"; 
// import "./Profile.css";

// const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

// export default function Profile() {
//   const navigate = useNavigate();
  
//   // --- USER DATA STATES ---
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [savedDetails, setSavedDetails] = useState({ name: "", email: "", profileImage: "" });

//   // --- IMAGE UPLOAD STATES ---
//   const [imageFile, setImageFile] = useState(null); 
//   const [preview, setPreview] = useState(DEFAULT_AVATAR); 
//   const [removeImage, setRemoveImage] = useState(false); 
//   const fileInputRef = useRef(null);

//   // --- OTP VERIFICATION STATES ---
//   const [isOtpStep, setIsOtpStep] = useState(false);
//   const [otp, setOtp] = useState("");

//   // --- ACCOUNT DELETION STATES ---
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletePassword, setDeletePassword] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const { data } = await API.get("/auth/me"); 
//         setName(data.name);
//         setEmail(data.email);
//         setSavedDetails({ name: data.name, email: data.email, profileImage: data.profileImage });
//         if (data.profileImage) setPreview(data.profileImage);
//       } catch (error) {
//         console.error("Could not load user data", error);
//       }
//     };
//     loadProfile();
//   }, []);

//   // Handle Image Selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file); 
//       setPreview(URL.createObjectURL(file)); 
//       setRemoveImage(false); 
//     }
//   };

//   // Handle Image Removal
//   const handleRemovePicture = () => {
//     setImageFile(null); 
//     setPreview(DEFAULT_AVATAR); 
//     setRemoveImage(true); 
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       // SCENARIO 1: Requesting an email change
//       if (email !== savedDetails.email && !isOtpStep) {
//         await API.post("/auth/send-profile-otp", { newEmail: email });
//         alert(`For your security, we sent a verification code to your CURRENT email (${savedDetails.email}).`);
//         setIsOtpStep(true);
//         setIsLoading(false);
//         return; 
//       }

//       // SCENARIO 2: Saving changes (FormData is required when sending files!)
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("removeImage", removeImage);
      
//       if (imageFile) {
//         formData.append("profileImage", imageFile);
//       }
      
//       if (email !== savedDetails.email) {
//         formData.append("newEmail", email);
//         formData.append("otp", otp); 
//       }

//       // Force Axios to send the image file properly!
//       const { data } = await API.put("/auth/profile", formData);
//       alert("Profile updated successfully!");
      
//       setSavedDetails({ name, email, profileImage: data.user.profileImage });
//       setRemoveImage(false);
//       setImageFile(null);
//       setIsOtpStep(false);
//       setOtp("");

//       if (data.user) {
//         localStorage.setItem("user", JSON.stringify(data.user));
//       }

//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteAccount = async (e) => {
//     e.preventDefault();
//     setDeleteLoading(true);
//     try {
//       await API.delete("/auth/profile", { data: { password: deletePassword } });
//       alert("Your account and all tasks have been permanently deleted.");
//       localStorage.clear(); 
//       window.location.href = "/"; 
//     } catch (error) {
//       alert(error.response?.data?.message || "Error deleting account. Check your password.");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const cancelEmailChange = () => {
//     setIsOtpStep(false);
//     setOtp("");
//     setEmail(savedDetails.email); 
//   };

//   return (
//     <div className="profile-wrapper">
//       <div className="profile-container">
        
//         {/* HEADER */}
//         <div className="profile-header">
//           <button type="button" className="back-btn" onClick={() => navigate("/dashboard")} style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#6b7280", fontWeight: "600" }}>
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
//               <line x1="19" y1="12" x2="5" y2="12"></line>
//               <polyline points="12 19 5 12 12 5"></polyline>
//             </svg>
//             Back to Dashboard
//           </button>
          
//           <div className="header-title" style={{ marginTop: "20px", textAlign: "center" }}>
//             <div className="header-icon pink-icon" style={{ width: "48px", height: "48px", backgroundColor: "#fce7f3", color: "#db2777", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "24px", height: "24px" }}>
//                 <circle cx="12" cy="12" r="3"></circle>
//                 <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
//               </svg>
//             </div>
//             <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Manage Profile</h1>
//           </div>
//         </div>

//         {/* PROFILE EDIT FORM */}
//         <form onSubmit={handleSave} className="profile-form" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px" }}>
          
//           {/* IMAGE UPLOADER */}
//           <div className="profile-image-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "8px" }}>
//             <img 
//               src={preview} 
//               alt="Profile Preview" 
//               onClick={() => !isOtpStep && fileInputRef.current.click()} 
//               style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", cursor: isOtpStep ? "default" : "pointer", border: "3px solid #fce7f3", opacity: isOtpStep ? 0.5 : 1 }}
//             />
            
//             {!isOtpStep && (
//               <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
//                 <button 
//                   type="button" 
//                   onClick={() => fileInputRef.current.click()}
//                   style={{ background: "#f3f4f6", border: "none", color: "#db2777", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
//                 >
//                   Change Picture
//                 </button>

//                 {preview !== DEFAULT_AVATAR && (
//                   <button 
//                     type="button" 
//                     onClick={handleRemovePicture}
//                     style={{ background: "#fee2e2", border: "none", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             )}

//             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} disabled={isOtpStep} />
//           </div>

//           <div className="input-group">
//             <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Full Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               disabled={isOtpStep} 
//               required
//               style={{ width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", boxSizing: "border-box", backgroundColor: isOtpStep ? "#f3f4f6" : "white" }}
//             />
//           </div>

//           <div className="input-group">
//             <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isOtpStep} 
//               required
//               style={{ width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", boxSizing: "border-box", backgroundColor: isOtpStep ? "#f3f4f6" : "white" }}
//             />
//           </div>

//           {/* OTP INPUT */}
//           {isOtpStep && (
//             <div className="input-group" style={{ animation: "fadeIn 0.3s" }}>
//               <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#db2777", marginBottom: "6px" }}>
//                 Enter the 6-Digit Code sent to your CURRENT email ({savedDetails.email})
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//                 maxLength="6"
//                 placeholder="e.g. 123456"
//                 style={{ width: "100%", padding: "12px", border: "2px solid #db2777", borderRadius: "8px", boxSizing: "border-box", letterSpacing: "2px", textAlign: "center", fontWeight: "bold" }}
//               />
//               <button 
//                 type="button" 
//                 onClick={cancelEmailChange}
//                 style={{ background: "transparent", border: "none", color: "#ef4444", marginTop: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", textDecoration: "underline" }}
//               >
//                 Cancel email change
//               </button>
//             </div>
//           )}

//           <div className="form-actions" style={{ marginTop: "16px" }}>
//             <button type="submit" className="save-btn" disabled={isLoading} style={{ width: "100%", background: "#db2777", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
//               {isLoading 
//                 ? "Processing..." 
//                 : isOtpStep 
//                   ? "Verify & Save Changes" 
//                   : "Save Changes"}
//             </button>
//           </div>
//         </form>

//         {/* --- DANGER ZONE --- */}
//         <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #fee2e2" }}>
//           <h3 style={{ color: "#ef4444", fontSize: "16px", marginBottom: "8px", margin: "0 0 8px 0" }}>Danger Zone</h3>
//           <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 16px 0" }}>
//             Once you delete your account, there is no going back. All your tasks and data will be permanently erased.
//           </p>
//           <button 
//             type="button"
//             onClick={() => setShowDeleteModal(true)}
//             style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
//           >
//             Delete Account
//           </button>
//         </div>

//         {/* --- DELETE CONFIRMATION MODAL --- */}
//         {showDeleteModal && (
//           <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//             <div style={{ background: "white", padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", margin: "0 20px" }}>
//               <h3 style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "18px" }}>Confirm Deletion</h3>
//               <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 20px 0", lineHeight: "1.5" }}>
//                 Please enter your password to verify it's you. This action cannot be undone.
//               </p>
              
//               <form onSubmit={handleDeleteAccount}>
//                 <input 
//                   type="password" 
//                   placeholder="Enter your password" 
//                   value={deletePassword}
//                   onChange={(e) => setDeletePassword(e.target.value)}
//                   required
//                   style={{ width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", marginBottom: "20px", boxSizing: "border-box" }}
//                 />
//                 <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
//                   <button type="button" onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }} style={{ background: "#f3f4f6", border: "none", color: "#4b5563", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
//                     Cancel
//                   </button>
//                   <button type="submit" disabled={deleteLoading} style={{ background: "#ef4444", border: "none", color: "white", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
//                     {deleteLoading ? "Deleting..." : "Permanently Delete"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; 
import "./Profile.css";

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

export default function Profile() {
  const navigate = useNavigate();
  
  // --- USER DATA STATES ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedDetails, setSavedDetails] = useState({ name: "", email: "", profileImage: "" });

  // --- IMAGE UPLOAD STATES ---
  const [imageFile, setImageFile] = useState(null); 
  const [preview, setPreview] = useState(DEFAULT_AVATAR); 
  const [removeImage, setRemoveImage] = useState(false); 
  const fileInputRef = useRef(null);

  // --- OTP VERIFICATION STATES ---
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  // --- ACCOUNT DELETION STATES ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await API.get("/auth/me"); 
        setName(data.name);
        setEmail(data.email);
        setSavedDetails({ name: data.name, email: data.email, profileImage: data.profileImage });
        if (data.profileImage) setPreview(data.profileImage);
      } catch (error) {
        console.error("Could not load user data", error);
      }
    };
    loadProfile();
  }, []);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
      setPreview(URL.createObjectURL(file)); 
      setRemoveImage(false); 
    }
  };

  // Handle Image Removal
  const handleRemovePicture = () => {
    setImageFile(null); 
    setPreview(DEFAULT_AVATAR); 
    setRemoveImage(true); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // SCENARIO 1: Requesting an email change
      if (email !== savedDetails.email && !isOtpStep) {
        await API.post("/auth/send-profile-otp", { newEmail: email });
        alert(`For your security, we sent a verification code to your CURRENT email (${savedDetails.email}).`);
        setIsOtpStep(true);
        setIsLoading(false);
        return; 
      }

      // SCENARIO 2: Saving changes (FormData is required when sending files!)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("removeImage", removeImage);
      
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }
      
      if (email !== savedDetails.email) {
        formData.append("newEmail", email);
        formData.append("otp", otp); 
      }

      // Force Axios to send the image file properly!
      const { data } = await API.put("/auth/profile", formData);
      alert("Profile updated successfully!");
      
      setSavedDetails({ name, email, profileImage: data.user.profileImage });
      setRemoveImage(false);
      setImageFile(null);
      setIsOtpStep(false);
      setOtp("");

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      await API.delete("/auth/profile", { data: { password: deletePassword } });
      alert("Your account and all tasks have been permanently deleted.");
      localStorage.clear(); 
      window.location.href = "/"; 
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting account. Check your password.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelEmailChange = () => {
    setIsOtpStep(false);
    setOtp("");
    setEmail(savedDetails.email); 
  };

  return (
    <div className="profile-wrapper">
      {/* 🧬 BACKGROUND ANIMATION */}
      <div className="bg-glow-circle circle-1"></div>
      <div className="bg-glow-circle circle-2"></div>

      <div className="profile-container">
        
        {/* HEADER */}
        <div className="profile-header">
          <button type="button" className="back-btn" onClick={() => navigate("/dashboard")} style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#6b7280", fontWeight: "600" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          
          <div className="header-title" style={{ marginTop: "20px", textAlign: "center" }}>
            <div className="header-icon pink-icon" style={{ width: "48px", height: "48px", backgroundColor: "#fce7f3", color: "#db2777", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "24px", height: "24px" }}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Manage Profile</h1>
          </div>
        </div>

        {/* PROFILE EDIT FORM */}
        <form onSubmit={handleSave} className="profile-form" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px" }}>
          
          {/* IMAGE UPLOADER */}
          <div className="profile-image-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "8px" }}>
            <img 
              src={preview} 
              alt="Profile Preview" 
              onClick={() => !isOtpStep && fileInputRef.current.click()} 
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", cursor: isOtpStep ? "default" : "pointer", border: "3px solid #fce7f3", opacity: isOtpStep ? 0.5 : 1 }}
            />
            
            {!isOtpStep && (
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  style={{ background: "#f3f4f6", border: "none", color: "#db2777", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                >
                  Change Picture
                </button>

                {preview !== DEFAULT_AVATAR && (
                  <button 
                    type="button" 
                    onClick={handleRemovePicture}
                    style={{ background: "#fee2e2", border: "none", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} disabled={isOtpStep} />
          </div>

          <div className="input-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isOtpStep} 
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", boxSizing: "border-box", backgroundColor: isOtpStep ? "#f3f4f6" : "white" }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isOtpStep} 
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", boxSizing: "border-box", backgroundColor: isOtpStep ? "#f3f4f6" : "white" }}
            />
          </div>

          {/* OTP INPUT */}
          {isOtpStep && (
            <div className="input-group" style={{ animation: "fadeIn 0.3s" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#db2777", marginBottom: "6px" }}>
                Enter the 6-Digit Code sent to your CURRENT email ({savedDetails.email})
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                placeholder="e.g. 123456"
                style={{ width: "100%", padding: "12px", border: "2px solid #db2777", borderRadius: "8px", boxSizing: "border-box", letterSpacing: "2px", textAlign: "center", fontWeight: "bold" }}
              />
              <button 
                type="button" 
                onClick={cancelEmailChange}
                style={{ background: "transparent", border: "none", color: "#ef4444", marginTop: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", textDecoration: "underline" }}
              >
                Cancel email change
              </button>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: "16px" }}>
            <button type="submit" className="save-btn" disabled={isLoading} style={{ width: "100%", background: "#db2777", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
              {isLoading 
                ? "Processing..." 
                : isOtpStep 
                  ? "Verify & Save Changes" 
                  : "Save Changes"}
            </button>
          </div>
        </form>

        {/* --- DANGER ZONE --- */}
        <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #fee2e2" }}>
          <h3 style={{ color: "#ef4444", fontSize: "16px", marginBottom: "8px", margin: "0 0 8px 0" }}>Danger Zone</h3>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 16px 0" }}>
            Once you delete your account, there is no going back. All your tasks and data will be permanently erased.
          </p>
          <button 
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
          >
            Delete Account
          </button>
        </div>

        {/* --- DELETE CONFIRMATION MODAL --- */}
        {showDeleteModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "white", padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", margin: "0 20px" }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "18px" }}>Confirm Deletion</h3>
              <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 20px 0", lineHeight: "1.5" }}>
                Please enter your password to verify it's you. This action cannot be undone.
              </p>
              
              <form onSubmit={handleDeleteAccount}>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", marginBottom: "20px", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }} style={{ background: "#f3f4f6", border: "none", color: "#4b5563", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={deleteLoading} style={{ background: "#ef4444", border: "none", color: "white", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
                    {deleteLoading ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}