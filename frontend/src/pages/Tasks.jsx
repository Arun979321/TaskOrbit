// import { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "./Tasks.css";
// import calendarIcon from "../assets/calendar.png";
// import folderIcon from "../assets/folder.png";
// import subtaskIcon from "../assets/subtask.png";

// // CRITICAL: Make sure your file is actually named TaskDetail.jsx (case sensitive!)
// import TaskDetail from "./TaskDetail"; 

// const getLocalToday = () => {
//   const d = new Date();
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// export default function Tasks() {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState({ title: "", dueDate: "", duration: "", description: "" });
//   const [toastMessage, setToastMessage] = useState("");
  
//   const location = useLocation(); 
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState(location.state?.tab || "show"); 
//   const token = localStorage.getItem("token");

//   // DRAWER STATE
//   const [selectedTask, setSelectedTask] = useState(null);

//   // THEME STATE
//   const [theme, setTheme] = useState(localStorage.getItem("app-theme") || "light");

//   // TOOLBAR STATES
//   const [viewMode, setViewMode] = useState("list"); 
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState({ incomplete: false, completed: false, overdue: false, dueToday: false });
//   const [searchQuery, setSearchQuery] = useState("");

//   const viewRef = useRef(null);
//   const filterRef = useRef(null);

//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//     localStorage.setItem("app-theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light");
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (viewRef.current && !viewRef.current.contains(event.target)) setIsViewOpen(false);
//       if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const { data } = await API.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
//       // Safety check: Make sure we only set an array
//       setTasks(Array.isArray(data) ? data : []);
//     } catch (error) { console.error("Failed to fetch tasks", error); }
//   };

//   const addTask = async () => {
//     if (!newTask.title || !newTask.dueDate) return alert("Please provide both a task title and a deadline!");
//     if (newTask.dueDate < getLocalToday()) return alert("Please select a deadline that is today or in the future!");

//     try {
//       await API.post("/tasks", newTask, { headers: { Authorization: `Bearer ${token}` } });
//       setNewTask({ title: "", dueDate: "", duration: "", description: "" });
//       fetchTasks();
//       setToastMessage("Task added successfully! 🎉");
//       setTimeout(() => setToastMessage(""), 3000);
//     } catch (error) { alert("Failed to add task. Please try again."); }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await API.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       fetchTasks();
//     } catch (error) { console.error("Failed to delete task", error); }
//   };

//   const toggleTask = async (task) => {
//     try {
//       await API.put(`/tasks/${task._id}`, { completed: !task.completed }, { headers: { Authorization: `Bearer ${token}` } });
//       fetchTasks();
//     } catch (error) { console.error("Failed to toggle task", error); }
//   };

//   useEffect(() => { fetchTasks(); }, []);

//   const today = getLocalToday();

//   // Safety check: Only filter if tasks is an array
//   const safeTasksArray = Array.isArray(tasks) ? tasks : [];
  
//   const filteredTasks = safeTasksArray.filter(task => {
//   let progressMatch = true;
//   if (filters.completed && !task.completed) progressMatch = false;
//   if (filters.incomplete && task.completed) progressMatch = false;

//   let dateMatch = true;
//   if (filters.dueToday || filters.overdue) {
//     if (!task.dueDate) dateMatch = false; 
//     else {
//       const taskDate = task.dueDate.split("T")[0]; 
//       if (filters.dueToday && taskDate !== today) dateMatch = false;
//       if (filters.overdue && (taskDate >= today || task.completed)) dateMatch = false;
//     }
//   }

//   // --- NEW SEARCH LOGIC ---
//   let searchMatch = true;
//   if (searchQuery.trim() !== "") {
//     const query = searchQuery.toLowerCase();
//     searchMatch = task.title.toLowerCase().includes(query) || 
//                   (task.description && task.description.toLowerCase().includes(query));
//   }

//   return progressMatch && dateMatch && searchMatch;
// });

//   const handleFilterChange = (filterName) => {
//     setFilters(prev => {
//       const newFilters = { ...prev, [filterName]: !prev[filterName] };
//       if (filterName === 'incomplete' && newFilters.incomplete) newFilters.completed = false;
//       if (filterName === 'completed' && newFilters.completed) newFilters.incomplete = false;
//       if (filterName === 'overdue' && newFilters.overdue) newFilters.dueToday = false;
//       if (filterName === 'dueToday' && newFilters.dueToday) newFilters.overdue = false;
//       return newFilters;
//     });
//   };

//   return (
//     <div className="tasks-wrapper">
//       <div className="tasks-container" style={{ position: 'relative' }}>
        
//         <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
//           {theme === 'light' ? '🌙' : '☀️'}
//         </button>

//         <button className="back-to-dashboard-btn" onClick={() => navigate("/dashboard")}>
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 5"></polyline></svg>
//           Back to Dashboard
//         </button>

//         <div className="tasks-header">
//           <div className="header-icon">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
//           </div>
//           <h1>Task Manager</h1>
//           <p>Organize your day efficiently.</p>
//         </div>

//         <div className="tabs-container">
//           <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add Task</button>
//           <button className={`tab-btn ${activeTab === 'show' ? 'active' : ''}`} onClick={() => setActiveTab('show')}>Show Tasks</button>
//         </div>

//         <div className="tab-content">
//           {activeTab === "add" && (
//             <form className="task-input-form fade-in" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
//               <div className="input-group-small">
//                 <label>Task Title <span style={{ color: '#ef4444' }}>*</span></label>
//                 <input type="text" className="task-input primary-input" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="What do you want to do today?" autoFocus required />
//               </div>
//               <div className="input-row">
//                 <div className="input-group-small">
//                   <label>Deadline <span style={{ color: '#ef4444' }}>*</span></label>
//                   <input type="date" className="task-input" value={newTask.dueDate} min={today} required onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
//                 </div>
//                 <div className="input-group-small">
//                   <label>Time Span</label>
//                   <input type="number" className="task-input" placeholder="e.g., 2 hours" value={newTask.duration} onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })} />
//                 </div>
//               </div>
//               <button type="submit" className="add-btn full-width">Save Task</button>
//             </form>
//           )}

//           {activeTab === "show" && (
//             <div className="tasks-list fade-in">
//               <div className="tasks-toolbar">
//                 <div className="toolbar-count">{filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}</div>
//                 <div className="toolbar-actions">
//                   <div style={{ position: 'relative' }}>
//                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#6b7280' }}>
//                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                  </svg>
//                  <input 
//                    type="text" 
//                    placeholder="Search tasks..." 
//                    value={searchQuery} 
//                    onChange={(e) => setSearchQuery(e.target.value)} 
//                    className="toolbar-search-input" 
//                  />
//                </div>
//                   <div className="toolbar-dropdown-container" ref={viewRef}>
//                     <button className="toolbar-btn" onClick={() => setIsViewOpen(!isViewOpen)}>
//                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
//                       {viewMode === 'list' ? 'List' : 'Tiles'}
//                     </button>
//                     {isViewOpen && (
//                       <div className="toolbar-dropdown-menu">
//                         <button className={`dropdown-menu-item ${viewMode === 'list' ? 'active' : ''}`} onClick={() => { setViewMode('list'); setIsViewOpen(false); }}>List</button>
//                         <button className={`dropdown-menu-item ${viewMode === 'tiles' ? 'active' : ''}`} onClick={() => { setViewMode('tiles'); setIsViewOpen(false); }}>Tiles</button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="toolbar-dropdown-container" ref={filterRef}>
//                     <button className={`toolbar-btn ${(filters.incomplete || filters.completed || filters.overdue || filters.dueToday) ? 'active-filter' : ''}`} onClick={() => setIsFilterOpen(!isFilterOpen)}>
//                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Filter
//                     </button>
//                     {isFilterOpen && (
//                       <div className="toolbar-dropdown-menu filter-menu">
//                         <div className="filter-group-title">Progress</div>
//                         <label className="filter-checkbox-label"><input type="checkbox" checked={filters.incomplete} onChange={() => handleFilterChange('incomplete')} /> ⭕ Incomplete tasks</label>
//                         <label className="filter-checkbox-label"><input type="checkbox" checked={filters.completed} onChange={() => handleFilterChange('completed')} /> ✅ Completed tasks</label>
//                         <div className="filter-divider"></div>
//                         <div className="filter-group-title">Due date</div>
//                         <label className="filter-checkbox-label"><input type="checkbox" checked={filters.overdue} onChange={() => handleFilterChange('overdue')} /> ⚠️ Overdue</label>
//                         <label className="filter-checkbox-label"><input type="checkbox" checked={filters.dueToday} onChange={() => handleFilterChange('dueToday')} /> 📅 Due today</label>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {filteredTasks.length === 0 ? (
//                 <div className="empty-state"><p>No tasks match your current filters!</p></div>
//               ) : (
//                 <>
//                   {['High', 'Low', 'On Hold', 'Priority'].map(priorityLevel => {
//                     const priorityTasks = filteredTasks.filter(t => (t.priority || "Priority") === priorityLevel);
//                     if (priorityTasks.length === 0) return null;

//                     return (
//                       <div key={priorityLevel} className="priority-section" style={{ marginBottom: '24px' }}>
//                         <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//                           {priorityLevel === 'Priority' ? 'Unassigned Priority' : `${priorityLevel} Priority`}
//                         </h3>

//                         <div className={`tasks-layout-container ${viewMode}`}>
//                           {priorityTasks.map((task) => (
//                             <div key={task._id} className={`task-item ${task.completed ? "completed" : ""}`}>
                              
//                               <div className="task-main-content">
//                                 {task.completed ? (
//                                   <div className="task-completed-badge fade-in" onClick={(e) => { e.stopPropagation(); toggleTask(task); }} title="Click to mark incomplete">✓ Completed</div>
//                                 ) : (
//                                   <div onClick={(e) => { e.stopPropagation(); toggleTask(task); }} className="checkbox"></div>
//                                 )}

//                                 <div className="task-details" onClick={() => setSelectedTask(task)}>
//                                   <span className="task-title">{task.title}</span>
//                                   {task.description && <p className="task-list-description">{task.description}</p>}
//                                   <div className="task-meta-badges">
//                                        {task.subtasks && task.subtasks.length > 0 && (
//                                          <span className="badge detail-badge">
//                                            <img src={subtaskIcon} alt="Subtasks" className="custom-badge-icon" />
//                                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks
//                                          </span>
//                                        )}
                                       
//                                        {task.dueDate && (
//                                          <span className="badge detail-badge">
//                                            <img src={calendarIcon} alt="Deadline" className="custom-badge-icon" />
//                                            {new Date(task.dueDate).toLocaleDateString()}
//                                          </span>
//                                        )}
                                       
//                                       {task.group && task.group !== "No group" && (
//                                         <span className="badge status-badge pending">
//                                           <img src={folderIcon} alt="Group" className="custom-badge-icon" />
//                                           {task.group}
//                                         </span>
//                                       )}
//                                       {task.duration && (
//                                       <span className="badge detail-badge">
//                                         {/* Using a sleek inline SVG clock icon */}
//                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginRight: '4px', opacity: 0.7 }}>
//                                           <circle cx="12" cy="12" r="10"></circle>
//                                           <polyline points="12 6 12 12 16 14"></polyline>
//                                         </svg>
//                                         {task.duration}
//                                       </span>
//                                     )}
//                                    </div>
//                                 </div>
//                               </div>

//                               <button onClick={() => deleteTask(task._id)} className="delete-btn">Delete</button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {toastMessage && <div className="toast-notification">{toastMessage}</div>}

    
//       {selectedTask && (
//         <TaskDetail 
//           task={selectedTask} 
//           onClose={() => setSelectedTask(null)} 
//           onRefresh={fetchTasks} 
//         />
//       )}
      
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Tasks.css";
import calendarIcon from "../assets/calendar.png";
import folderIcon from "../assets/folder.png";
import subtaskIcon from "../assets/subtask.png";

// CRITICAL: Make sure your file is actually named TaskDetail.jsx (case sensitive!)
import TaskDetail from "./TaskDetail"; 

const getLocalToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "", duration: "", description: "" });
  const [toastMessage, setToastMessage] = useState("");
  
  const location = useLocation(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "show"); 
  const token = localStorage.getItem("token");

  // --- STATES ---
  // Opens the Edit form (TaskDetail.jsx)
  const [selectedTask, setSelectedTask] = useState(null);
  // NEW: Opens the Read-Only Details Pop-up
  const [viewingTask, setViewingTask] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem("app-theme") || "light");
  const [viewMode, setViewMode] = useState("list"); 
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ incomplete: false, completed: false, overdue: false, dueToday: false });
  const [searchQuery, setSearchQuery] = useState("");

  const viewRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewRef.current && !viewRef.current.contains(event.target)) setIsViewOpen(false);
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Failed to fetch tasks", error); }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.dueDate) return alert("Please provide both a task title and a deadline!");
    if (newTask.dueDate < getLocalToday()) return alert("Please select a deadline that is today or in the future!");

    try {
      await API.post("/tasks", newTask, { headers: { Authorization: `Bearer ${token}` } });
      setNewTask({ title: "", dueDate: "", duration: "", description: "" });
      fetchTasks();
      setToastMessage("Task added successfully! 🎉");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) { alert("Failed to add task. Please try again."); }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (error) { console.error("Failed to delete task", error); }
  };

  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { completed: !task.completed }, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (error) { console.error("Failed to toggle task", error); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const today = getLocalToday();
  const safeTasksArray = Array.isArray(tasks) ? tasks : [];
  
  const filteredTasks = safeTasksArray.filter(task => {
    let progressMatch = true;
    if (filters.completed && !task.completed) progressMatch = false;
    if (filters.incomplete && task.completed) progressMatch = false;

    let dateMatch = true;
    if (filters.dueToday || filters.overdue) {
      if (!task.dueDate) dateMatch = false; 
      else {
        const taskDate = task.dueDate.split("T")[0]; 
        if (filters.dueToday && taskDate !== today) dateMatch = false;
        if (filters.overdue && (taskDate >= today || task.completed)) dateMatch = false;
      }
    }

    let searchMatch = true;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      searchMatch = task.title.toLowerCase().includes(query) || 
                    (task.description && task.description.toLowerCase().includes(query));
    }

    return progressMatch && dateMatch && searchMatch;
  });

  const handleFilterChange = (filterName) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: !prev[filterName] };
      if (filterName === 'incomplete' && newFilters.incomplete) newFilters.completed = false;
      if (filterName === 'completed' && newFilters.completed) newFilters.incomplete = false;
      if (filterName === 'overdue' && newFilters.overdue) newFilters.dueToday = false;
      if (filterName === 'dueToday' && newFilters.dueToday) newFilters.overdue = false;
      return newFilters;
    });
  };

  return (
    <div className="tasks-wrapper">
      <div className="bg-glow-circle circle-1"></div>
      <div className="bg-glow-circle circle-2"></div>

      <div className="tasks-container">
        
        <div className="tasks-top-row">
          <button className="back-to-dashboard-btn" onClick={() => navigate("/dashboard")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch Mode`}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="tasks-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <h1>Task Manager</h1>
          <p>Organize your day efficiently.</p>
        </div>

        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add Task</button>
          <button className={`tab-btn ${activeTab === 'show' ? 'active' : ''}`} onClick={() => setActiveTab('show')}>Show Tasks</button>
        </div>

        <div className="tab-content">
          {activeTab === "add" && (
            <form className="task-input-form fade-in" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
              <div className="input-group-small">
                <label>Task Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="task-input primary-input" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="What do you want to do today?" autoFocus required />
              </div>
              <div className="input-row">
                <div className="input-group-small">
                  <label>Deadline <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="date" className="task-input" value={newTask.dueDate} min={today} required onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                </div>
                <div className="input-group-small">
                  <label>Time Span</label>
                  <input type="number" className="task-input" placeholder="e.g., 2 hours" value={newTask.duration} onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="add-btn full-width">Save Task</button>
            </form>
          )}

          {activeTab === "show" && (
            <div className="tasks-list fade-in">
              <div className="tasks-toolbar">
                <div className="toolbar-count">{filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}</div>
                <div className="toolbar-actions">
                  <div style={{ position: 'relative' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#6b7280' }}>
                      <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search tasks..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="toolbar-search-input" 
                    />
                  </div>
                  <div className="toolbar-dropdown-container" ref={viewRef}>
                    <button className="toolbar-btn" onClick={() => setIsViewOpen(!isViewOpen)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                      {viewMode === 'list' ? 'List' : 'Tiles'}
                    </button>
                    {isViewOpen && (
                      <div className="toolbar-dropdown-menu">
                        <button className={`dropdown-menu-item ${viewMode === 'list' ? 'active' : ''}`} onClick={() => { setViewMode('list'); setIsViewOpen(false); }}>List</button>
                        <button className={`dropdown-menu-item ${viewMode === 'tiles' ? 'active' : ''}`} onClick={() => { setViewMode('tiles'); setIsViewOpen(false); }}>Tiles</button>
                      </div>
                    )}
                  </div>
                  <div className="toolbar-dropdown-container" ref={filterRef}>
                    <button className={`toolbar-btn ${(filters.incomplete || filters.completed || filters.overdue || filters.dueToday) ? 'active-filter' : ''}`} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Filter
                    </button>
                    {isFilterOpen && (
                      <div className="toolbar-dropdown-menu filter-menu">
                        <div className="filter-group-title">Progress</div>
                        <label className="filter-checkbox-label"><input type="checkbox" checked={filters.incomplete} onChange={() => handleFilterChange('incomplete')} /> ⭕ Incomplete tasks</label>
                        <label className="filter-checkbox-label"><input type="checkbox" checked={filters.completed} onChange={() => handleFilterChange('completed')} /> ✅ Completed tasks</label>
                        <div className="filter-divider"></div>
                        <div className="filter-group-title">Due date</div>
                        <label className="filter-checkbox-label"><input type="checkbox" checked={filters.overdue} onChange={() => handleFilterChange('overdue')} /> ⚠️ Overdue</label>
                        <label className="filter-checkbox-label"><input type="checkbox" checked={filters.dueToday} onChange={() => handleFilterChange('dueToday')} /> 📅 Due today</label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="empty-state"><p>No tasks match your current filters!</p></div>
              ) : (
                <>
                  {['High', 'Low', 'On Hold', 'Priority'].map(priorityLevel => {
                    const priorityTasks = filteredTasks.filter(t => (t.priority || "Priority") === priorityLevel);
                    if (priorityTasks.length === 0) return null;

                    return (
                      <div key={priorityLevel} className="priority-section" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {priorityLevel === 'Priority' ? 'Unassigned Priority' : `${priorityLevel} Priority`}
                        </h3>

                        <div className={`tasks-layout-container ${viewMode}`}>
                          {priorityTasks.map((task) => (
                            
                            // ROW CLICK: OPENS VIEW MODAL
                            <div 
                              key={task._id} 
                              className={`task-item ${task.completed ? "completed" : ""}`}
                              onClick={() => setViewingTask(task)}
                              style={{ cursor: "pointer" }}
                            >
                              
                              <div className="task-main-content">
                                {task.completed ? (
                                  <div className="task-completed-badge fade-in" onClick={(e) => { e.stopPropagation(); toggleTask(task); }} title="Click to mark incomplete">✓ Completed</div>
                                ) : (
                                  <div onClick={(e) => { e.stopPropagation(); toggleTask(task); }} className="checkbox"></div>
                                )}

                                <div className="task-details">
                                  <span className="task-title">{task.title}</span>
                                  {task.description && <p className="task-list-description">{task.description}</p>}
                                  <div className="task-meta-badges">
                                       {task.subtasks && task.subtasks.length > 0 && (
                                         <span className="badge detail-badge">
                                           <img src={subtaskIcon} alt="Subtasks" className="custom-badge-icon" />
                                           {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks
                                         </span>
                                       )}
                                       {task.dueDate && (
                                         <span className="badge detail-badge">
                                           <img src={calendarIcon} alt="Deadline" className="custom-badge-icon" />
                                           {new Date(task.dueDate).toLocaleDateString()}
                                         </span>
                                       )}
                                      {task.group && task.group !== "No group" && (
                                        <span className="badge status-badge pending">
                                          <img src={folderIcon} alt="Group" className="custom-badge-icon" />
                                          {task.group}
                                        </span>
                                      )}
                                      {task.duration && (
                                      <span className="badge detail-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginRight: '4px', opacity: 0.7 }}>
                                          <circle cx="12" cy="12" r="10"></circle>
                                          <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        {task.duration}
                                      </span>
                                    )}
                                   </div>
                                </div>
                              </div>

                              <div className="task-actions">
                                {/* EDIT CLICK: OPENS EDIT INTERFACE (TaskDetail.jsx) */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }} 
                                  className="edit-btn"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }} 
                                  className="delete-btn"
                                >
                                  Delete
                                </button>
                              </div>                             
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* --- TASK EDIT INTERFACE (Your existing component) --- */}
      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onRefresh={fetchTasks} 
        />
      )}

    {/* --- NEW: TASK VIEW ONLY POP-UP --- */}
      {viewingTask && (
        <div className="task-view-modal-overlay" onClick={() => setViewingTask(null)}>
          <div className="task-view-modal" onClick={e => e.stopPropagation()}>
            
            {/* LOCKED HEADER */}
            <button className="close-modal-btn" onClick={() => setViewingTask(null)}>✕</button>
            <div className="modal-header">
              <h2>{viewingTask.title}</h2>
              <span className={`badge ${viewingTask.completed ? 'badge-success' : 'badge-pending'}`}>
                {viewingTask.completed ? '✓ Completed' : '⭕ Pending'}
              </span>
            </div>
            
            {/* SCROLLABLE BODY */}
            <div className="modal-body-scrollable">
              
              <div className="modal-section">
                <h4>Description</h4>
                {viewingTask.description ? (
                  <p>{viewingTask.description}</p>
                ) : (
                  <p className="empty-text">No description provided for this task.</p>
                )}
              </div>

              {/* NEW: SUBTASKS SECTION */}
              {viewingTask.subtasks && viewingTask.subtasks.length > 0 && (
                <div className="modal-section">
                  <h4>Subtasks ({viewingTask.subtasks.filter(s => s.completed).length}/{viewingTask.subtasks.length})</h4>
                  <div className="subtasks-view-list">
                    {viewingTask.subtasks.map((sub, idx) => (
                      <div key={idx} className={`subtask-view-item ${sub.completed ? 'completed' : ''}`}>
                        <span className="subtask-icon">{sub.completed ? '✅' : '⭕'}</span>
                        <span className="subtask-text">{sub.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="modal-grid">
                <div className="modal-grid-item">
                  <span className="label">Due Date</span>
                  <span className="value">
                    {viewingTask.dueDate ? new Date(viewingTask.dueDate).toLocaleDateString() : 'None'}
                  </span>
                </div>
                <div className="modal-grid-item">
                  <span className="label">Time Span</span>
                  <span className="value">
                    {viewingTask.duration ? `${viewingTask.duration} hrs` : 'None'}
                  </span>
                </div>
                <div className="modal-grid-item">
                  <span className="label">Group / Tag</span>
                  <span className="value">
                    {viewingTask.group && viewingTask.group !== "No group" ? viewingTask.group : 'Unassigned'}
                  </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}