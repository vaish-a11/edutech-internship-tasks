import { useState, useEffect } from "react";

// ─── Sub-component: individual todo item (demonstrates prop passing) ───────────
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        marginBottom: "8px",
        borderRadius: "8px",
        background: todo.completed ? "#e8f5e9" : "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        transition: "background 0.3s",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ accentColor: "#4caf50", width: 18, height: 18, cursor: "pointer" }}
      />
      <span
        style={{
          flex: 1,
          fontSize: "15px",
          textDecoration: todo.completed ? "line-through" : "none",
          color: todo.completed ? "#888" : "#222",
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: "#ff5252",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        Delete
      </button>
    </div>
  );
}

// ─── Sub-component: filter buttons (prop drilling example) ────────────────────
function FilterBar({ filter, setFilter, counts }) {
  const filters = ["all", "active", "completed"];
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            border: "2px solid #4caf50",
            background: filter === f ? "#4caf50" : "#fff",
            color: filter === f ? "#fff" : "#4caf50",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "capitalize",
          }}
        >
          {f} ({counts[f]})
        </button>
      ))}
    </div>
  );
}

// ─── Main App Component ────────────────────────────────────────────────────────
export default function TodoApp() {
  // useState: manage list of todos
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, text: "Learn React Hooks", completed: true },
          { id: 2, text: "Build a Todo App", completed: false },
          { id: 3, text: "Submit internship task", completed: false },
        ];
  });

  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all");

  // useEffect: sync todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // useEffect: update document title with pending count
  useEffect(() => {
    const pending = todos.filter((t) => !t.completed).length;
    document.title = pending > 0 ? `(${pending}) Todo App` : "Todo App";
  }, [todos]);

  // Derived counts for FilterBar
  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  // Filtered list
  const visibleTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // Handlers
  const addTodo = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    setInputText("");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos(todos.filter((t) => !t.completed));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8edea, #fed6e3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ margin: "0 0 4px", fontSize: "28px", color: "#333" }}>📝 Todo App</h1>
        <p style={{ margin: "0 0 24px", color: "#888", fontSize: "13px" }}>
          State managed with useState &amp; useEffect
        </p>

        {/* Input */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task…"
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "2px solid #ddd",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <button
            onClick={addTodo}
            style={{
              background: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Add
          </button>
        </div>

        {/* Filter bar — prop drilling: filter & setFilter passed down */}
        <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

        {/* Todo list */}
        {visibleTodos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "20px" }}>
            No tasks here!
          </p>
        ) : (
          visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}

        {/* Footer */}
        {counts.completed > 0 && (
          <div style={{ textAlign: "right", marginTop: "12px" }}>
            <button
              onClick={clearCompleted}
              style={{
                background: "none",
                border: "none",
                color: "#ff5252",
                cursor: "pointer",
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              Clear completed ({counts.completed})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
