// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api"; 
// import "./Dashboard.css"; 

// // ==========================================
// // 🛡️ THE ERROR BOUNDARY (CATCHES CRASHES!)
// // ==========================================
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, errorMessage: '' };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, errorMessage: error.toString() };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("DASHBOARD CRASH DETAILS:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', backgroundColor: '#fee2e2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//           <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>⚠️ The Dashboard Crashed!</h2>
//           <p style={{ color: '#4b5563', marginBottom: '20px' }}>React caught an error. Here are the details:</p>
//           <div style={{ fontFamily: 'monospace', background: 'white', color: '#b91c1c', padding: '20px', borderRadius: '8px', border: '1px solid #fca5a5', maxWidth: '600px', width: '100%', wordWrap: 'break-word' }}>
//             {this.state.errorMessage}
//           </div>
//           <button 
//             onClick={() => { localStorage.clear(); window.location.href = '/'; }} 
//             style={{ padding: '12px 24px', marginTop: '30px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
//           >
//             Clear Local Data & Return to Login
//           </button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// // ==========================================
// // 🏠 DASHBOARD CONTENT
// // ==========================================
// function DashboardContent() {
//   const navigate = useNavigate();
//   const [urgentTasks, setUrgentTasks] = useState([]);
//   const [theme, setTheme] = useState(localStorage.getItem("app-theme") || "light");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  
//   // 🚀 INSTANT LOAD FIX: Grab local storage immediately so the image doesn't flash
//   const [user, setUser] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem("user");
//       return savedUser ? JSON.parse(savedUser) : { name: "", profileImage: "" };
//     } catch {
//       return { name: "", profileImage: "" };
//     }
//   });

//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//     localStorage.setItem("app-theme", theme);
//   }, [theme]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Still fetch in the background just to be 100% synced with the database
//   useEffect(() => {
//     const fetchFreshUserData = async () => {
//       try {
//         const { data } = await API.get("/auth/me");
//         if (data) {
//           setUser(data);
//           localStorage.setItem("user", JSON.stringify(data)); 
//         }
//       } catch (error) {
//         console.error("Failed to fetch fresh user data", error);
//       }
//     };
//     fetchFreshUserData();
//   }, []);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const { data } = await API.get("/tasks", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (Array.isArray(data)) {
//           const completedCount = data.filter(task => task?.completed).length;
          
//           setStats({
//             total: data.length,
//             completed: completedCount,
//             pending: data.length - completedCount
//           });

//           const pendingTasks = data.filter(t => !t?.completed);
//           const sortedTasks = pendingTasks.sort((a, b) => {
//             if (!a?.dueDate) return 1;
//             if (!b?.dueDate) return -1;
//             return new Date(a.dueDate) - new Date(b.dueDate);
//           }).slice(0, 3);
          
//           setUrgentTasks(sortedTasks);
//         }
//       } catch (error) {
//         console.error("Failed to fetch tasks for dashboard stats");
//       }
//     };

//     fetchStats();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/"); 
//   };

//   // Safely extract variables
//   const firstName = (user?.name && typeof user.name === 'string' && user.name.trim() !== '') 
//     ? user.name.split(' ')[0] 
//     : 'there';

//   const hasProfileImage = Boolean(user?.profileImage && typeof user.profileImage === 'string' && user.profileImage.startsWith('http'));

//   return (
//     <div className="dashboard-wrapper">
//       <div className="dashboard-container">
        
//         <div className="dashboard-header">
//           <div>
//             <h1>Dashboard</h1>
//             <p>Welcome back, {firstName}! Here is your productivity summary.</p>
//           </div>
          
//           <div className="header-actions">
//             <button 
//               className="theme-toggle-btn" 
//               onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//               title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
//             >
//               {theme === 'light' ? '🌙' : '☀️'}
//             </button>

//             <div className="profile-menu-container" ref={dropdownRef}>
//               <div 
//                 className="avatar-placeholder clickable"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 style={{ padding: hasProfileImage ? 0 : undefined, overflow: "hidden", border: "2px solid #e5e7eb" }}
//               >
//                 {hasProfileImage ? (
//                   <img 
//                     src={user.profileImage} 
//                     alt="Profile" 
//                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} 
//                   />
//                 ) : (
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                     <circle cx="12" cy="7" r="4"></circle>
//                   </svg>
//                 )}
//               </div>

//               {isDropdownOpen && (
//                 <div className="profile-dropdown fade-in">
//                   <div className="dropdown-header">
//                     <p className="dropdown-name">My Account</p>
//                   </div>
//                   <button onClick={() => navigate("/profile")} className="dropdown-item">
//                     <span>⚙️</span> Manage Profile
//                   </button>
//                   <button onClick={() => navigate("/tasks", { state: { tab: "show" } })} className="dropdown-item">
//                     <span>📝</span> My Tasks
//                   </button>
//                   <div className="dropdown-divider"></div>
//                   <button onClick={handleLogout} className="dropdown-item text-red">
//                     <span>🚪</span> Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-grid">
//           <div className="dashboard-card stat-card" onClick={() => navigate("/tasks", { state: { tab: "show" } })}>
//             <div className="card-icon blue-icon">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//                 <polyline points="14 2 14 8 20 8"></polyline>
//                 <line x1="16" y1="13" x2="8" y2="13"></line>
//                 <line x1="16" y1="17" x2="8" y2="17"></line>
//                 <polyline points="10 9 9 9 8 9"></polyline>
//               </svg>
//             </div>
//             <div className="card-content stat-content">
//               <h2>{stats?.total || 0}</h2>
//               <p>Total Tasks Created</p>
//             </div>
//           </div>

//           <div className="dashboard-card stat-card" onClick={() => navigate("/tasks", { state: { tab: "show" } })}>
//             <div className="card-icon purple-icon">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <polyline points="12 6 12 12 16 14"></polyline>
//               </svg>
//             </div>
//             <div className="card-content stat-content">
//               <h2>{stats?.pending || 0}</h2>
//               <p>Tasks Pending</p>
//             </div>
//           </div>

//           <div className="dashboard-card stat-card" onClick={() => navigate("/tasks", { state: { tab: "show" } })}>
//             <div className="card-icon green-icon">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//                 <polyline points="22 4 12 14.01 9 11.01"></polyline>
//               </svg>
//             </div>
//             <div className="card-content stat-content">
//               <h2 className="text-green">{stats?.completed || 0}</h2>
//               <p>Tasks Completed</p>
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-widget fade-in">
//           <div className="widget-header">
//             <h3>Urgent Tasks</h3>
//             <button onClick={() => navigate("/tasks", { state: { tab: "show" } })} className="widget-link">View All</button>
//           </div>

//           <div className="widget-list">
//             {!urgentTasks || urgentTasks.length === 0 ? (
//               <p className="widget-empty">You're all caught up! Enjoy your day.</p>
//             ) : (
//               urgentTasks.map(task => (
//                 <div key={task?._id || Math.random()} className="widget-task-item" onClick={() => navigate("/tasks", { state: { tab: "show" } })}>
//                   <div className="widget-task-info">
//                     <span className="widget-task-title">{task?.title || "Untitled Task"}</span>
//                     <span className="widget-task-date">
//                       {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
//                     </span>
//                   </div>
//                   <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '6px', background: '#f3f4f6', color: '#4b5563'}}>
//                     {task?.priority || "Priority"}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="dashboard-cta">
//           <button onClick={() => navigate("/tasks", { state: { tab: "add" } })} className="primary-btn">
//             Create a New Task
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="5" y1="12" x2="19" y2="12"></line>
//               <line x1="12" y1="5" x2="12" y2="19"></line>
//             </svg>
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// // ==========================================
// // 🚀 EXPORT THE WRAPPED DASHBOARD
// // ==========================================
// export default function Dashboard() {
//   return (
//     <ErrorBoundary>
//       <DashboardContent />
//     </ErrorBoundary>
//   );
// }




import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; 
import "./Dashboard.css"; 

// ==========================================
// 🛡️ THE ERROR BOUNDARY (CATCHES CRASHES!)
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DASHBOARD CRASH DETAILS:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', backgroundColor: '#fee2e2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>⚠️ The Dashboard Crashed!</h2>
          <p style={{ color: '#4b5563', marginBottom: '20px' }}>React caught an error. Here are the details:</p>
          <div style={{ fontFamily: 'monospace', background: 'white', color: '#b91c1c', padding: '20px', borderRadius: '8px', border: '1px solid #fca5a5', maxWidth: '600px', width: '100%', wordWrap: 'break-word' }}>
            {this.state.errorMessage}
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }} 
            style={{ padding: '12px 24px', marginTop: '30px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
          >
            Clear Local Data & Return to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 🏠 DASHBOARD CONTENT (Logic + Glass UI)
// ==========================================
function DashboardContent() {
  const navigate = useNavigate();
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("app-theme") || "light");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  
  // 🚀 USER STATE
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : { name: "", profileImage: "" };
    } catch {
      return { name: "", profileImage: "" };
    }
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchFreshUserData = async () => {
      try {
        const { data } = await API.get("/auth/me");
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data)); 
        }
      } catch (error) {
        console.error("Failed to fetch fresh user data", error);
      }
    };
    fetchFreshUserData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await API.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(data)) {
          const completedCount = data.filter(task => task?.completed).length;
          
          setStats({
            total: data.length,
            completed: completedCount,
            pending: data.length - completedCount
          });

          const pendingTasks = data.filter(t => !t?.completed);
          const sortedTasks = pendingTasks.sort((a, b) => {
            if (!a?.dueDate) return 1;
            if (!b?.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          }).slice(0, 3);
          
          setUrgentTasks(sortedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks for dashboard stats");
      }
    };

    fetchStats();
  }, []);

  // --- ACTIONS ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    document.body.classList.remove("dark-mode"); // Prevent dark mode bleeding to login
    navigate("/"); // Changed back to your correct "/" route!
  };

  const toggleTheme = (e) => {
    e.stopPropagation();
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navigateTo = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  // --- HELPERS ---
  const firstName = (user?.name && typeof user.name === 'string' && user.name.trim() !== '') 
    ? user.name.split(' ')[0] 
    : 'there';

  const hasProfileImage = Boolean(user?.profileImage && typeof user.profileImage === 'string' && user.profileImage.startsWith('http'));

  return (
    <div className="dashboard-wrapper">
      {/* 🧬 BACKGROUND GLOWS */}
      <div className="bg-glow-circle circle-1"></div>
      <div className="bg-glow-circle circle-2"></div>

      <div className="dashboard-container">
        {/* --- HEADER --- */}
        <header className="dashboard-header">
          <div className="header-info">
            <h1>Dashboard</h1>
            <p>Welcome back, {firstName}! Here's your summary.</p>
          </div>
          
          <div className="header-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div className="profile-menu-container" ref={dropdownRef}>
              <div 
                className="avatar-placeholder clickable" 
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              >
                {hasProfileImage ? (
                  <img src={user.profileImage} alt="Profile" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                  <span>{firstName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">Settings</div>
                  <button className="dropdown-item" onClick={() => navigateTo("/profile")}>👤 Manage Profile</button>
                  <button className="dropdown-item" onClick={() => navigateTo("/tasks")}>📋 My Tasks</button>
                  <div className="dropdown-divider"></div>
                  <button 
                     className="dropdown-item text-red" 
                     onClick={handleLogout}
                     style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >                   
                     <svg 
                       width="16" 
                       height="16" 
                       viewBox="0 0 24 24" 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth="2.5" 
                       strokeLinecap="round" 
                       strokeLinejoin="round"
                     >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                     </svg>
                     Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="dashboard-grid">
          <div className="stat-card blue-glow" onClick={() => navigate("/tasks")}>
            <div className="card-icon blue-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div className="stat-content">
              <h2>{stats.total}</h2>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="stat-card purple-glow" onClick={() => navigate("/tasks")}>
            <div className="card-icon purple-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="stat-content">
              <h2>{stats.pending}</h2>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card green-glow" onClick={() => navigate("/tasks")}>
            <div className="card-icon green-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="stat-content">
              <h2 className="text-success">{stats.completed}</h2>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* --- URGENT TASKS WIDGET (Using your map logic) --- */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3>Urgent Tasks</h3>
            <button className="widget-link" onClick={() => navigate("/tasks")}>View All</button>
          </div>
          <div className="widget-list">
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => (
                <div className="widget-task-item" key={task._id || Math.random()} onClick={() => navigate("/tasks")}>
                  <div className="widget-task-info">
                    <span className="widget-task-title">{task.title || "Untitled Task"}</span>
                    <span className="widget-task-date">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}
                    </span>
                  </div>
                  <span className="task-status-badge">Pending</span>
                </div>
              ))
            ) : (
              <p className="widget-empty" style={{color: '#64748b', fontStyle: 'italic', fontSize: '14px'}}>
                No urgent tasks pending. You're all caught up!
              </p>
            )}
          </div>
        </div>

        {/* --- CENTERED BUTTON --- */}
        <div className="dashboard-cta">
          <button className="primary-btn" onClick={() => navigate("/tasks")}>
            <span>Create a New Task</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Export with Error Boundary
export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}