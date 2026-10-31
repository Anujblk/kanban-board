import React, { useEffect, useState } from "react";

const initialTasks = [
  { id: 1, title: "Plan the project", description: "Write down the main features.", priority: "High", status: "Todo" },
  { id: 2, title: "Design the dashboard", description: "Create a clean and simple layout.", priority: "Medium", status: "In Progress" },
  { id: 3, title: "Set up React", description: "Create the Vite application.", priority: "Low", status: "Completed" }
];

const columns = ["Todo", "In Progress", "Completed"];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("easy-kanban-tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("easy-kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    if (editingId !== null) {
      setTasks(tasks.map(task => task.id === editingId
        ? { ...task, title: title.trim(), description: description.trim(), priority }
        : task
      ));
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "Todo"
      }]);
    }
    resetForm();
  }

  function editTask(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingId === id) resetForm();
  }

  function changeStatus(id, status) {
    setTasks(tasks.map(task => task.id === id ? { ...task, status } : task));
  }

  const visibleTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || task.priority === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand"><span className="brand-icon">✓</span><span>TaskFlow</span></div>
        <span className="top-note">Simple project management</span>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Kanban Board</h1>
          <p className="subheading">Keep your work moving, one task at a time.</p>
        </div>
        <div className="task-count"><strong>{tasks.length}</strong><span>Total tasks</span></div>
      </section>

      <section className="form-panel">
        <h2>{editingId !== null ? "Edit task" : "Add a new task"}</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Task title
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Prepare project presentation" required />
          </label>
          <label>
            Description
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a short description" />
          </label>
          <label className="priority-field">
            Priority
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary-btn" type="submit">{editingId !== null ? "Save changes" : "+ Add task"}</button>
            {editingId !== null && <button className="cancel-btn" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="toolbar">
        <div className="search-wrap">
          <span>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." />
        </div>
        <select aria-label="Filter by priority" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All priorities</option>
          <option value="High">High priority</option>
          <option value="Medium">Medium priority</option>
          <option value="Low">Low priority</option>
        </select>
      </section>

      <section className="board">
        {columns.map(column => {
          const columnTasks = visibleTasks.filter(task => task.status === column);
          return (
            <div className="column" key={column}>
              <div className="column-heading">
                <div className="column-name"><span className={`status-dot ${column.toLowerCase().replace(" ", "-")}`}></span><h2>{column}</h2></div>
                <span className="count">{columnTasks.length}</span>
              </div>
              <div className="task-list">
                {columnTasks.length === 0 ? <p className="empty">No tasks here yet.</p> : columnTasks.map(task => (
                  <article className="task-card" key={task.id}>
                    <div className="card-top">
                      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                      <button className="delete-btn" onClick={() => deleteTask(task.id)} aria-label="Delete task">×</button>
                    </div>
                    <h3>{task.title}</h3>
                    {task.description && <p className="description">{task.description}</p>}
                    <div className="card-bottom">
                      <button className="edit-btn" onClick={() => editTask(task)}>Edit</button>
                      <select value={task.status} onChange={e => changeStatus(task.id, e.target.value)} aria-label="Change task status">
                        {columns.map(status => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
      {visibleTasks.length === 0 && <p className="no-results">No matching tasks. Try another search or filter.</p>}
      <footer>TaskFlow · Your simple space to get things done</footer>
    </main>
  );
}

export default App;