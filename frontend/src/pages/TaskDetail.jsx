import { useState, useEffect, useRef } from "react";
import API from "../services/api"; 
import "./TaskDetail.css";

export default function TaskDetail({ task, onClose, onRefresh }) {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [title, setTitle] = useState(task?.title || ""); 
  const [isCompleted, setIsCompleted] = useState(task?.completed || false); 
  const [priority, setPriority] = useState(task?.priority || "Priority"); 
  const [group, setGroup] = useState(task?.group || "No group");
  const [description, setDescription] = useState(task?.description || "");
  const [duration, setDuration] = useState(task?.duration || "");
  const initialDate = task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "";
  const [dueDate, setDueDate] = useState(initialDate);
  const safeSubtasks = Array.isArray(task?.subtasks) ? task.subtasks : [];
  const [subtasks, setSubtasks] = useState(safeSubtasks);
  
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const dropdownRef = useRef(null);
  const groupDropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsPriorityOpen(false);
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) setIsGroupOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false); 
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!task) return null; 

  const handleAddSubtask = (e) => {
    if (e.key === 'Enter' && newSubtask.trim() !== "") {
      setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
      setNewSubtask("");
      setIsAddingSubtask(false);
    }
  };

  const handleSubtaskToggle = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);
  };

  const handleDeleteSubtask = (indexToDelete) => {
    const updatedSubtasks = subtasks.filter((_, index) => index !== indexToDelete);
    setSubtasks(updatedSubtasks);
  };

  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/tasks/${task._id}`, { headers: { Authorization: `Bearer ${token}` } });
      onRefresh();
      onClose();
    } catch (error) { alert("Failed to delete task."); }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = { title, completed: isCompleted, description, priority, group, subtasks, duration, dueDate };

      await API.put(`/tasks/${task._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onRefresh();
      onClose();
    } catch (error) { alert("Failed to save changes. Please try again."); }
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="td-wrapper" onClick={onClose}>
      <div className={`td-container ${isFullScreen ? 'full-screen' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        <div className="td-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="td-icon-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
              {isFullScreen ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>}
            </button>
            <button className="td-btn-outline" onClick={() => setIsCompleted(!isCompleted)} style={isCompleted ? { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' } : {}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {isCompleted ? "Completed" : "Mark Complete"}
            </button>
          </div>
          
          <div className="td-header-actions">
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button className="td-icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </button>
              {isMenuOpen && (
                <div className="td-dropdown" style={{ right: 0, top: '100%', marginTop: '4px' }}>
                  <button className="td-dropdown-item" onClick={handleDeleteTask} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    Delete Task
                  </button>
                </div>
              )}
            </div>
            <button className="td-icon-btn" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
          </div>
        </div>

        <div className="td-title-row">
          <input 
            type="text" 
            className="td-title-input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Task Title..."
          />
          
          <div className="td-priority-wrapper" ref={dropdownRef}>
            <div className="td-priority-trigger" onClick={() => setIsPriorityOpen(!isPriorityOpen)}>
              {priority} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </div>
            {isPriorityOpen && (
              <div className="td-dropdown">
                <button className="td-dropdown-item" onClick={() => { setPriority("Low"); setIsPriorityOpen(false); }}>Low</button>
                <button className="td-dropdown-item" onClick={() => { setPriority("High"); setIsPriorityOpen(false); }}>High</button>
                <button className="td-dropdown-item" onClick={() => { setPriority("On Hold"); setIsPriorityOpen(false); }}>On Hold</button>
              </div>
            )}
          </div>
        </div>

        <div className="td-divider"></div>

        <div className="td-properties-grid">
          
          <div className="td-prop-row">
            <div className="td-prop-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
              Deadline
            </div>
            <div className="td-prop-value">
              <input 
                type="date" 
                value={dueDate} 
                min={today}
                onChange={(e) => setDueDate(e.target.value)} 
                className="td-date-input td-text-bold"
              />
            </div>
          </div>
          {/* --- NEW: TIME SPAN ROW --- */}
          <div className="td-prop-row">
            <div className="td-prop-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-right">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Time Span
            </div>
            <div className="td-prop-value">
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                placeholder="e.g., 2 hours"
                className="td-duration-input" 
              />
            </div>
          </div>
          <div className="td-prop-row">
            <div className="td-prop-label">Group</div>
            <div className="td-prop-value" style={{ position: 'relative' }} ref={groupDropdownRef}>
              <button className="td-pill-btn" onClick={() => setIsGroupOpen(!isGroupOpen)}>{group}</button>
              {isGroupOpen && (
                <div className="td-dropdown td-dropdown-left">
                  <button className="td-dropdown-item" onClick={() => { setGroup("Work"); setIsGroupOpen(false); }}>Work</button>
                  <button className="td-dropdown-item" onClick={() => { setGroup("Personal"); setIsGroupOpen(false); }}>Personal</button>
                  <button className="td-dropdown-item" onClick={() => { setGroup("Urgent"); setIsGroupOpen(false); }}>Urgent</button>
                </div>
              )}
            </div>
          </div>
          <div className="td-prop-row" style={{ alignItems: 'flex-start' }}>
            <div className="td-prop-label" style={{ marginTop: '6px' }}>{subtasks.length} Subtask{subtasks.length !== 1 ? 's' : ''}</div>
            <div className="td-prop-value" style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
              {subtasks.map((st, index) => (
                <div key={index} className="td-subtask-item">
                  <div className="td-subtask-content">
                    {st.completed ? <span className="td-subtask-completed-badge fade-in" onClick={() => handleSubtaskToggle(index)}>✓ Completed</span> : <input type="checkbox" className="td-subtask-check" checked={st.completed} onChange={() => handleSubtaskToggle(index)} />}
                    <span className={`td-subtask-text ${st.completed ? 'completed' : ''}`}>{st.title}</span>
                  </div>
                  {st.completed && <button className="td-subtask-delete-btn fade-in" onClick={() => handleDeleteSubtask(index)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>}
                </div>
              ))}
            {isAddingSubtask ? (
              <div className="subtask-input-wrapper fade-in">
                   <input 
                     type="text" 
                     className="td-subtask-input" 
                     placeholder="Type subtask & press Enter..." 
                     value={newSubtask} 
                     onChange={(e) => setNewSubtask(e.target.value)} 
                     maxLength={100} 
                     onKeyDown={handleAddSubtask} 
                     autoFocus 
                     onBlur={() => setIsAddingSubtask(false)} 
                   />
                   {/* The counter is placed AFTER the input, but INSIDE the wrapper div */}
                   <span className={`char-counter ${newSubtask.length >= 100 ? 'at-limit' : ''}`}> 
                     {newSubtask.length}/100
                   </span>
                 </div>
               ) : (
                 <button 
                   className="td-text-btn fade-in" 
                   onClick={() => setIsAddingSubtask(true)} 
                   style={{ marginTop: subtasks.length > 0 ? '8px' : '0' }}
                 >
                   + Add subtask
                 </button>
               )}               
              </div>
          </div>
        </div>

        <div className="td-section" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 className="td-section-title">Description</h3>
          <textarea className="td-textarea" style={{ flexGrow: 1 }} placeholder="Add description..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>

        <div className="td-footer">
          <button className="td-save-btn" onClick={handleSaveChanges}>Save Changes</button>
        </div>

      </div>
    </div>
  );
}