import React, { useState } from "react";
import { useStore } from "./hooks/useStore";
import { LIGHT, DARK } from "./data/defaults";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Timeline from "./pages/Timeline";
import Goals from "./pages/Goals";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const { state, dark, updateGoal, updateTarget, setActual, setTasks, toggleDark } = useStore();
  const T = dark ? DARK : LIGHT;

  return (
    <div style={{
      minHeight:"100vh",
      background: T.bg,
      color: T.text,
      fontFamily:"'Nunito','Segoe UI',sans-serif",
      transition:"background 0.35s, color 0.35s",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: ${dark?"invert(0.8)":"none"}; cursor:pointer; }
        select option { background: ${T.surface}; color: ${T.text}; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius:3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        input::placeholder { color: ${T.textMuted}; }
      `}</style>

      <NavBar page={page} setPage={setPage} dark={dark} toggleDark={toggleDark} T={T}/>

      <main style={{ maxWidth:820, margin:"0 auto", padding:"28px 18px 80px" }}>
        {page==="dashboard" && (
          <Dashboard
            actuals={state.actuals} targets={state.targets} tasks={state.tasks}
            onActualSet={setActual} onTargetChange={updateTarget}
            setPage={setPage} T={T} dark={dark}
          />
        )}
        {page==="tasks" && (
          <Tasks tasks={state.tasks} setTasks={setTasks} T={T} dark={dark}/>
        )}
        {page==="timeline" && (
          <Timeline T={T} dark={dark}/>
        )}
        {page==="goals" && (
          <Goals
            goal={state.goal} targets={state.targets} actuals={state.actuals}
            updateGoal={updateGoal} updateTarget={updateTarget} T={T} dark={dark}
          />
        )}
      </main>
    </div>
  );
}
