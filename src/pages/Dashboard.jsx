import React, { useState } from "react";
import {
  APP_GOAL,
  START_DATE,
  TARGET_DATE,
  METRIC_DEFS,
  getTimelineProgress,
  formatDate,
  getSprintDefs,
  getCurrentSprintIdx,
  getDaysInSprint,
  getToday,
  getDailyEncouragement,
  getMetricColor,
  getMetricSoftColor,
} from "../data/defaults";

// ─── TIMELINE PROGRESS BAR ────────────────────────────────────────────────────
function TimelineBar({ T }) {
  const { pct, elapsed, remaining } = getTimelineProgress();
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: "22px 24px",
        marginBottom: 16,
        boxShadow: T.shadow,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.textMuted,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            YOUR TIMELINE
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: T.text,
              fontFamily: "'Fraunces', serif",
              lineHeight: 1.1,
            }}
          >
            {pct}% of the journey complete
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: T.accent,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {remaining}d left
          </div>
          <div
            style={{
              fontSize: 10,
              color: T.textMuted,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {elapsed}d elapsed
          </div>
        </div>
      </div>

      {/* Bar */}
      <div
        style={{
          position: "relative",
          height: 14,
          background: T.trackBg,
          borderRadius: 7,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${T.accent}cc, ${T.accent})`,
            borderRadius: 7,
            transition: "width 1s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
              animation: "shimmer 2.5s infinite",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.accent,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: T.textSub,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {formatDate(START_DATE)} — Start
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              fontSize: 11,
              color: T.accent,
              fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {formatDate(TARGET_DATE)} — Offer Day 🎯
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── SPRINT SECTION ───────────────────────────────────────────────────────────
function SprintSection({
  sprintGoals,
  sprintActuals,
  setSprintGoal,
  setSprintActual,
  T,
}) {
  const sprints = getSprintDefs();
  const currentIdx = getCurrentSprintIdx();
  const sprint = sprints[currentIdx];
  const sid = sprint.id;
  const goals = sprintGoals[sid] || {};
  const actuals = sprintActuals[sid] || {};

  // editing state for goals
  const [editingKey, setEditingKey] = useState(null);
  const [editVal, setEditVal] = useState("");

  // editing state for actuals
  const [editingActualKey, setEditingActualKey] = useState(null);
  const [editActualVal, setEditActualVal] = useState("");

  function commitGoal(key) {
    const v = parseInt(editVal, 10);
    if (!isNaN(v) && v >= 0) setSprintGoal(sid, key, v);
    setEditingKey(null);
  }

  function commitActual(key) {
    const v = parseInt(editActualVal, 10);
    if (!isNaN(v) && v >= 0) setSprintActual(sid, key, v);
    setEditingActualKey(null);
  }

  const totalGoal = METRIC_DEFS.reduce((s, m) => s + (goals[m.key] || 0), 0);
  const totalActual = METRIC_DEFS.reduce(
    (s, m) => s + (actuals[m.key] || 0),
    0,
  );
  const sprintPct =
    totalGoal > 0
      ? Math.min(100, Math.round((totalActual / totalGoal) * 100))
      : 0;

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: "22px 24px",
        marginBottom: 16,
        boxShadow: T.shadow,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.textMuted,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            CURRENT SPRINT
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: T.text,
              fontFamily: "'Fraunces', serif",
            }}
          >
            {sprint.label}
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.textSub,
                fontFamily: "'Nunito', sans-serif",
                marginLeft: 10,
              }}
            >
              {formatDate(sprint.start)} – {formatDate(sprint.end)}
            </span>
          </div>
        </div>
        <div
          style={{
            background: `${T.accent}18`,
            border: `1.5px solid ${T.accent}44`,
            borderRadius: 20,
            padding: "5px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: T.accent,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {sprintPct}%
          </span>
          <span
            style={{
              fontSize: 11,
              color: T.textSub,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            of sprint done
          </span>
        </div>
      </div>

      {/* Sprint progress bar */}
      <div
        style={{
          height: 6,
          background: T.trackBg,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: `${sprintPct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${T.accent}99, ${T.accent})`,
            borderRadius: 3,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
          gap: 10,
        }}
      >
        {METRIC_DEFS.map((m) => {
          const goal = goals[m.key] || 0;
          const actual = actuals[m.key] || 0;
          const pct =
            goal > 0 ? Math.min(100, Math.round((actual / goal) * 100)) : 0;
          const mc = getMetricColor(m.color, T);
          const mcs = getMetricSoftColor(m.color, T);
          const isEditing = editingKey === m.key;

          return (
            <div
              key={m.key}
              style={{
                background: T.surfaceAlt,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "12px 14px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = mc + "88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: mc,
                    fontFamily: "'DM Mono', monospace",
                    background: mcs,
                    padding: "2px 6px",
                    borderRadius: 10,
                  }}
                >
                  {pct}%
                </span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  fontFamily: "'DM Mono', monospace",
                  marginBottom: 6,
                }}
              >
                {m.label.toUpperCase()}
              </div>

              {/* actual / goal display */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                {editingActualKey === m.key ? (
                  <input
                    autoFocus
                    value={editActualVal}
                    onChange={(e) => setEditActualVal(e.target.value)}
                    onBlur={() => commitActual(m.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitActual(m.key);
                      if (e.key === "Escape") setEditingActualKey(null);
                    }}
                    style={{
                      width: 52,
                      fontSize: 22,
                      fontWeight: 900,
                      color: T.text,
                      background: T.inputBg,
                      border: `2px solid ${mc}`,
                      borderRadius: 8,
                      padding: "1px 6px",
                      outline: "none",
                      fontFamily: "'Fraunces', serif",
                      textAlign: "center",
                    }}
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingActualKey(m.key);
                      setEditActualVal(String(actual));
                    }}
                    title="Click to edit actual"
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: T.text,
                      fontFamily: "'Fraunces', serif",
                      cursor: "text",
                      borderBottom: `2px dashed ${T.border}`,
                    }}
                  >
                    {actual}
                  </span>
                )}
                <span style={{ fontSize: 12, color: T.textMuted }}>/</span>
                {editingKey === m.key ? (
                  <input
                    autoFocus
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onBlur={() => commitGoal(m.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitGoal(m.key);
                      if (e.key === "Escape") setEditingKey(null);
                    }}
                    style={{
                      width: 42,
                      fontSize: 14,
                      fontWeight: 700,
                      color: mc,
                      background: T.inputBg,
                      border: `1.5px solid ${mc}`,
                      borderRadius: 6,
                      padding: "1px 5px",
                      outline: "none",
                      fontFamily: "'Nunito', sans-serif",
                      textAlign: "center",
                    }}
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingKey(m.key);
                      setEditVal(String(goal));
                    }}
                    title="Click to set sprint goal"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: mc,
                      cursor: "text",
                      borderBottom: `1.5px dashed ${mc}55`,
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {goal}
                  </span>
                )}
              </div>

              {/* progress bar */}
              <div
                style={{
                  height: 4,
                  background: T.trackBg,
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: mc,
                    borderRadius: 2,
                    transition: "width 0.5s",
                  }}
                />
              </div>

              {/* ± buttons */}
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() =>
                    setSprintActual(sid, m.key, Math.max(0, actual - 1))
                  }
                  style={{
                    flex: 1,
                    padding: "4px 0",
                    borderRadius: 7,
                    border: `1px solid ${T.border}`,
                    background: T.bgSub,
                    color: T.textSub,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 800,
                    fontFamily: "monospace",
                  }}
                >
                  −
                </button>
                <button
                  onClick={() => setSprintActual(sid, m.key, actual + 1)}
                  style={{
                    flex: 1,
                    padding: "4px 0",
                    borderRadius: 7,
                    border: `1.5px solid ${mc}55`,
                    background: mcs,
                    color: mc,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 800,
                    fontFamily: "monospace",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 10,
          color: T.textMuted,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        Tip: click the big number to edit actual · click the small number to
        edit goal.
      </div>
    </div>
  );
}

// ─── DAILY SUMMARY ────────────────────────────────────────────────────────────
function DailySummary({ tasks, setPage, setSelectedDate, T }) {
  const today = getToday();
  const todayTasks = tasks[today] || [];
  const done = todayTasks.filter((t) => t.completed).length;
  const total = todayTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const encouragement = getDailyEncouragement();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 8,
      }}
    >
      {/* Today card */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          padding: "20px 22px",
          boxShadow: T.shadow,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.textMuted,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            TODAY'S TASKS
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: T.text,
              fontFamily: "'Fraunces', serif",
              lineHeight: 1,
            }}
          >
            {pct}
            <span style={{ fontSize: 18 }}>%</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.textSub,
              marginTop: 4,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {done} of {total} complete
          </div>
        </div>
        <div>
          <div
            style={{
              height: 6,
              background: T.trackBg,
              borderRadius: 3,
              overflow: "hidden",
              margin: "12px 0",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${T.green}99, ${T.green})`,
                borderRadius: 3,
                transition: "width 0.6s",
              }}
            />
          </div>
          <button
            onClick={() => {
              setSelectedDate(today);
              setPage("tasks");
            }}
            style={{
              background: T.accent,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "8px 18px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 3px 10px ${T.accent}44`,
              width: "100%",
            }}
          >
            Open Daily Tasks →
          </button>
        </div>
      </div>

      {/* Encouragement card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.accent}18, ${T.amber}10)`,
          border: `1.5px solid ${T.accent}33`,
          borderRadius: 20,
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: T.shadow,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>✦</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: T.text,
            fontFamily: "'Fraunces', serif",
            lineHeight: 1.5,
          }}
        >
          "{encouragement}"
        </div>
        <div
          style={{
            fontSize: 10,
            color: T.textMuted,
            marginTop: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {new Date()
            .toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
            .toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ─── SPRINT MINI-CALENDAR ─────────────────────────────────────────────────────
function SprintCalendar({ tasks, setPage, setSelectedDate, T }) {
  const sprints = getSprintDefs();
  const currentIdx = getCurrentSprintIdx();
  const sprint = sprints[currentIdx];
  const days = getDaysInSprint(currentIdx);
  const today = getToday();

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: "18px 22px",
        boxShadow: T.shadow,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: T.textMuted,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.08em",
          marginBottom: 14,
        }}
      >
        SPRINT CALENDAR — CLICK A DAY TO EDIT TASKS
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 5,
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: 9,
              color: T.textMuted,
              fontFamily: "'DM Mono', monospace",
              paddingBottom: 4,
            }}
          >
            {d}
          </div>
        ))}
        {/* empty leading cells */}
        {(() => {
          const firstDow = new Date(sprint.start + "T12:00:00").getDay();
          return Array(firstDow)
            .fill(null)
            .map((_, i) => <div key={`e${i}`} />);
        })()}
        {days.map((date) => {
          const dt = tasks[date] || [];
          const done = dt.filter((t) => t.completed).length;
          const total = dt.length;
          const pct = total ? done / total : null;
          const isToday = date === today;
          const isFuture = date > today;

          let bg = T.bgSub;
          if (pct === 1 && total > 0) bg = `${T.green}44`;
          else if (pct !== null && pct > 0) bg = `${T.accent}22`;
          else if (isToday) bg = `${T.accent}15`;

          return (
            <div
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setPage("tasks");
              }}
              title={date}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                background: bg,
                cursor: "pointer",
                border: isToday
                  ? `2px solid ${T.accent}`
                  : "1px solid transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isToday ? `0 0 10px ${T.accent}44` : "none",
                transition: "all 0.15s",
                opacity: isFuture ? 0.4 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isToday) e.currentTarget.style.borderColor = T.borderHov;
              }}
              onMouseLeave={(e) => {
                if (!isToday) e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isToday ? 800 : 400,
                  color: isToday ? T.accent : T.textSub,
                  fontFamily: isToday ? "'Nunito'" : "'DM Mono', monospace",
                }}
              >
                {new Date(date + "T12:00:00").getDate()}
              </span>
              {pct !== null && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: pct === 1 ? T.green : T.accent,
                    marginTop: 2,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function Dashboard({
  state,
  setSprintGoal,
  setSprintActual,
  setPage,
  setSelectedDate,
  T,
}) {
  return (
    <div>
      {/* Goal header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            color: T.textMuted,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          {new Date()
            .toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })
            .toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: T.text,
            fontFamily: "'Fraunces', serif",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          Sprint Dashboard
        </div>
      </div>

      <TimelineBar T={T} />
      <DailySummary
        tasks={state.tasks}
        setPage={setPage}
        setSelectedDate={setSelectedDate}
        T={T}
      />
      <SprintSection
        sprintGoals={state.sprintGoals}
        sprintActuals={state.sprintActuals}
        setSprintGoal={setSprintGoal}
        setSprintActual={setSprintActual}
        T={T}
      />
      <SprintCalendar
        tasks={state.tasks}
        setPage={setPage}
        setSelectedDate={setSelectedDate}
        T={T}
      />
    </div>
  );
}
