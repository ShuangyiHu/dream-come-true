import React, { useState } from "react";
import { useStore } from "./hooks/useStore";
import { LIGHT, DARK, APP_NAME, getToday } from "./data/defaults";
import NavBar from "./components/NavBar";
import GoalCard from "./components/GoalCard";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Progress from "./pages/Progress";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(getToday);
  const {
    state,
    dark,
    setSprintGoal,
    setSprintActual,
    setTotal,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    toggleDark,
  } = useStore();

  const T = dark ? DARK : LIGHT;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        transition: "background 0.35s, color 0.35s",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Nunito:wght@400;500;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: ${dark ? "invert(0.7)" : "none"}; cursor: pointer; }
        select option { background: ${T.surface}; color: ${T.text}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        input::placeholder { color: ${T.textMuted}; }
        button { transition: all 0.15s ease; }
        button:active { transform: scale(0.97); }
      `}</style>

      <NavBar
        page={page}
        setPage={setPage}
        dark={dark}
        toggleDark={toggleDark}
        T={T}
      />

      <main
        style={{ maxWidth: 860, margin: "0 auto", padding: "28px 18px 96px" }}
      >
        <GoalCard T={T} />
        {page === "dashboard" && (
          <Dashboard
            state={state}
            setSprintGoal={setSprintGoal}
            setSprintActual={setSprintActual}
            setPage={setPage}
            setSelectedDate={setSelectedDate}
            T={T}
          />
        )}
        {page === "tasks" && (
          <Tasks
            tasks={state.tasks}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}
            initialDate={selectedDate}
            T={T}
          />
        )}
        {page === "progress" && (
          <Progress state={state} setTotal={setTotal} T={T} />
        )}
      </main>
    </div>
  );
}
