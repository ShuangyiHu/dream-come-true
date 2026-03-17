import React, { useState, useRef } from "react";
import {
  getToday,
  getDailyEncouragement,
  TASK_TEMPLATES,
  getMetricColor,
  getMetricSoftColor,
} from "../data/defaults";

// ─── TASK ITEM ────────────────────────────────────────────────────────────────
function TaskItem({ task, onToggle, onDelete, onEdit, T }) {
  const [hov, setHov] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef(null);

  function commitEdit() {
    const v = draft.trim();
    if (v && v !== task.title) onEdit(task.id, v);
    else setDraft(task.title);
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: 12,
          marginBottom: 6,
          background: T.surface,
          border: `1.5px solid ${T.accent}`,
          boxShadow: T.shadow,
        }}
      >
        <input
          ref={inputRef}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") {
              setDraft(task.title);
              setEditing(false);
            }
          }}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            fontSize: 14,
            fontWeight: 600,
            color: T.text,
            fontFamily: "'Nunito', sans-serif",
          }}
        />
        <button
          onClick={commitEdit}
          style={{
            padding: "4px 12px",
            borderRadius: 8,
            border: "none",
            background: T.accent,
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            flexShrink: 0,
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            setDraft(task.title);
            setEditing(false);
          }}
          style={{
            padding: "4px 10px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.bgSub,
            color: T.textMuted,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        borderRadius: 12,
        marginBottom: 6,
        background: task.completed ? T.bgSub : T.surface,
        border: `1px solid ${hov && !task.completed ? T.borderHov : T.border}`,
        opacity: task.completed ? 0.65 : 1,
        transition: "all 0.15s",
        boxShadow: hov && !task.completed ? T.shadow : "none",
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          flexShrink: 0,
          cursor: "pointer",
          border: `2px solid ${task.completed ? T.green : T.border}`,
          background: task.completed ? T.green : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        {task.completed && (
          <span
            style={{
              color: "#fff",
              fontSize: 12,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ✓
          </span>
        )}
      </button>

      <span
        style={{
          flex: 1,
          fontSize: 14,
          color: task.completed ? T.textMuted : T.text,
          textDecoration: task.completed ? "line-through" : "none",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        {task.title}
      </span>

      {hov && !task.completed && (
        <button
          onClick={() => {
            setDraft(task.title);
            setEditing(true);
          }}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            cursor: "pointer",
            background: T.bgSub,
            border: `1px solid ${T.border}`,
            color: T.textSub,
            fontSize: 11,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Edit task"
        >
          ✎
        </button>
      )}
      {hov && (
        <button
          onClick={() => onDelete(task.id)}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            cursor: "pointer",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#dc2626",
            fontSize: 13,
            fontWeight: 800,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ─── EDITABLE NUMBER INLINE ───────────────────────────────────────────────────
function NumInput({ value, onChange, color, T, disabled }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(String(value));

  function commit() {
    const v = parseInt(tmp, 10);
    if (!isNaN(v) && v > 0) onChange(v);
    else setTmp(String(value));
    setEditing(false);
  }

  if (disabled) return <span style={{ fontWeight: 900, color }}>{value}</span>;

  return editing ? (
    <input
      autoFocus
      value={tmp}
      onChange={(e) => setTmp(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setTmp(String(value));
          setEditing(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: Math.max(30, String(tmp).length * 10 + 18),
        fontSize: 13,
        fontWeight: 900,
        color,
        background: T.surface,
        border: `1.5px solid ${color}`,
        borderRadius: 6,
        padding: "0 5px",
        outline: "none",
        fontFamily: "'Nunito', sans-serif",
        textAlign: "center",
        display: "inline-block",
        verticalAlign: "baseline",
      }}
    />
  ) : (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setTmp(String(value));
        setEditing(true);
      }}
      title="Click to edit number"
      style={{
        fontWeight: 900,
        color,
        cursor: "text",
        borderBottom: `2px dashed ${color}88`,
        padding: "0 1px",
        lineHeight: 1.2,
      }}
    >
      {value}
    </span>
  );
}

// ─── EDITABLE NAME INLINE ────────────────────────────────────────────────────
function NameInput({ value, onChange, color, T, disabled }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(value);

  function commit() {
    const v = tmp.trim();
    if (v) onChange(v);
    else setTmp(value);
    setEditing(false);
  }

  if (disabled) return <span style={{ fontWeight: 900, color }}>{value}</span>;

  return editing ? (
    <input
      autoFocus
      value={tmp}
      onChange={(e) => setTmp(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setTmp(value);
          setEditing(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: Math.max(60, tmp.length * 8 + 20),
        fontSize: 13,
        fontWeight: 900,
        color,
        background: T.surface,
        border: `1.5px solid ${color}`,
        borderRadius: 6,
        padding: "0 6px",
        outline: "none",
        fontFamily: "'Nunito', sans-serif",
        display: "inline-block",
        verticalAlign: "baseline",
      }}
    />
  ) : (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setTmp(value);
        setEditing(true);
      }}
      title="Click to edit project name"
      style={{
        fontWeight: 900,
        color,
        cursor: "text",
        borderBottom: `2px dashed ${color}88`,
        padding: "0 1px",
        lineHeight: 1.2,
      }}
    >
      {value}
    </span>
  );
}

// ─── TEMPLATE DETAIL ──────────────────────────────────────────────────────────
function TemplateDetail({ tpl, onBack, onLoad, T }) {
  const mc = getMetricColor(tpl.color, T);
  const mcs = getMetricSoftColor(tpl.color, T);

  const [nums, setNums] = useState(() => {
    const s = {};
    tpl.tasks.forEach((t) => {
      if (t.num !== undefined) s[t.id] = t.num;
    });
    return s;
  });
  const [names, setNames] = useState(() => {
    const s = {};
    tpl.tasks.forEach((t) => {
      if (t.name !== undefined) s[t.id] = t.name;
    });
    return s;
  });
  const [selected, setSelected] = useState(() => tpl.tasks.map((t) => t.id));

  function toggleSel(id) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  function buildTitle(task) {
    // supports: prefix + [name + midfix] + [num] + suffix
    // or:       prefix + [num] + suffix  (no name)
    let title = task.prefix || "";
    if (task.name !== undefined) {
      title += names[task.id] ?? task.name;
      title += task.midfix || "";
    }
    if (task.num !== undefined) {
      title += nums[task.id] ?? task.num;
    }
    title += task.suffix || "";
    return title;
  }

  function handleLoad() {
    const titles = tpl.tasks
      .filter((t) => selected.includes(t.id))
      .map((t) => buildTitle(t));
    onLoad(titles);
  }

  return (
    <div style={{ padding: "18px 20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: T.bgSub,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 11,
            color: T.textSub,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
          }}
        >
          ← Back
        </button>
        <span style={{ fontSize: 20 }}>{tpl.icon}</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: T.text,
            fontFamily: "'Fraunces', serif",
          }}
        >
          {tpl.label}
        </span>
      </div>

      <div
        style={{
          fontSize: 10,
          color: T.textMuted,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.08em",
          marginBottom: 12,
        }}
      >
        CLICK A NUMBER TO EDIT · UNCHECK TO SKIP A TASK
      </div>

      {/* Task rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
          marginBottom: 18,
        }}
      >
        {tpl.tasks.map((task) => {
          const isSel = selected.includes(task.id);
          return (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                background: isSel ? mcs : T.bgSub,
                border: `1.5px solid ${isSel ? mc + "55" : T.border}`,
                opacity: isSel ? 1 : 0.45,
                transition: "all 0.15s",
                cursor: "pointer",
              }}
              onClick={() => toggleSel(task.id)}
            >
              {/* checkbox */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  flexShrink: 0,
                  border: `2px solid ${isSel ? mc : T.border}`,
                  background: isSel ? mc : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {isSel && (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* title with inline editable fields */}
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: T.text,
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {task.prefix}
                {task.name !== undefined && (
                  <>
                    <NameInput
                      value={names[task.id] ?? task.name}
                      onChange={(v) =>
                        setNames((ns) => ({ ...ns, [task.id]: v }))
                      }
                      color={mc}
                      T={T}
                      disabled={!isSel}
                    />
                    {task.midfix}
                  </>
                )}
                {task.num !== undefined && (
                  <NumInput
                    value={nums[task.id] ?? task.num}
                    onChange={(v) => setNums((ns) => ({ ...ns, [task.id]: v }))}
                    color={mc}
                    T={T}
                    disabled={!isSel}
                  />
                )}
                {task.suffix}
              </span>
            </div>
          );
        })}
      </div>

      {/* Load button */}
      <button
        onClick={handleLoad}
        disabled={selected.length === 0}
        style={{
          width: "100%",
          padding: "13px 0",
          background: selected.length > 0 ? mc : T.trackBg,
          color: selected.length > 0 ? "#fff" : T.textMuted,
          border: "none",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 800,
          cursor: selected.length > 0 ? "pointer" : "default",
          fontFamily: "'Nunito', sans-serif",
          boxShadow: selected.length > 0 ? `0 4px 16px ${mc}44` : "none",
          transition: "all 0.2s",
        }}
      >
        + Load {selected.length} task{selected.length !== 1 ? "s" : ""} for
        today
      </button>
    </div>
  );
}

// ─── TEMPLATE PANEL (category list) ──────────────────────────────────────────
function TemplatePanel({ onLoad, T }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // tpl object or null
  const [justAdded, setJustAdded] = useState(null); // tpl.id

  function handleLoad(titles) {
    onLoad(titles);
    setJustAdded(active.id);
    setTimeout(() => setJustAdded(null), 2200);
    setActive(null);
    setOpen(false);
  }

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Toggle bar */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setActive(null);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          background: open ? `${T.accent}10` : T.surface,
          border: `1.5px solid ${open ? T.accent + "66" : T.border}`,
          borderRadius: 14,
          padding: "13px 18px",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: T.shadow,
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.borderColor = T.borderHov;
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = T.border;
        }}
      >
        <span style={{ fontSize: 17 }}>📋</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Task Templates
          </div>
          <div
            style={{
              fontSize: 11,
              color: T.textMuted,
              fontFamily: "'DM Mono', monospace",
              marginTop: 1,
            }}
          >
            5 categories — pick, edit numbers, load in one click
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            color: T.textMuted,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            marginTop: 6,
            background: T.surface,
            border: `1.5px solid ${T.border}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: T.shadowMd,
          }}
        >
          {!active ? (
            /* Category list */
            <div style={{ padding: "14px 16px" }}>
              <div
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                CHOOSE A CATEGORY
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {TASK_TEMPLATES.map((tpl) => {
                  const mc = getMetricColor(tpl.color, T);
                  const mcs = getMetricSoftColor(tpl.color, T);
                  const wasAdded = justAdded === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setActive(tpl)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        borderRadius: 12,
                        cursor: "pointer",
                        background: wasAdded ? mcs : T.surfaceAlt,
                        border: `1.5px solid ${wasAdded ? mc + "77" : T.border}`,
                        transition: "all 0.2s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = mcs;
                        e.currentTarget.style.borderColor = mc + "77";
                      }}
                      onMouseLeave={(e) => {
                        if (!wasAdded) {
                          e.currentTarget.style.background = T.surfaceAlt;
                          e.currentTarget.style.borderColor = T.border;
                        }
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{tpl.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: T.text,
                            fontFamily: "'Nunito', sans-serif",
                          }}
                        >
                          {tpl.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: T.textMuted,
                            marginTop: 2,
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {tpl.tasks.length} tasks · tap numbers to edit
                        </div>
                      </div>
                      {wasAdded ? (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: mc,
                            fontFamily: "'Nunito', sans-serif",
                          }}
                        >
                          ✓ Added!
                        </span>
                      ) : (
                        <span style={{ fontSize: 13, color: T.textMuted }}>
                          →
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <TemplateDetail
              tpl={active}
              onBack={() => setActive(null)}
              onLoad={handleLoad}
              T={T}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN TASKS PAGE ──────────────────────────────────────────────────────────
export default function Tasks({
  tasks,
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  initialDate,
  T,
}) {
  const today = getToday();
  const [selDate, setSel] = useState(initialDate || today);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const dayTasks = tasks[selDate] || [];
  const todo = dayTasks.filter((t) => !t.completed);
  const done = dayTasks.filter((t) => t.completed);
  const pct = dayTasks.length
    ? Math.round((done.length / dayTasks.length) * 100)
    : 0;
  const isToday = selDate === today;
  const allDone = todo.length === 0 && done.length > 0;

  function handleAdd() {
    addTask(selDate, input);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontSize: 10,
            color: T.textMuted,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          DAILY EXECUTION
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: T.text,
            fontFamily: "'Fraunces', serif",
            letterSpacing: "-0.5px",
          }}
        >
          Daily Tasks
        </div>
      </div>

      {/* Date picker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <input
          type="date"
          value={selDate}
          onChange={(e) => setSel(e.target.value)}
          style={{
            background: T.inputBg,
            border: `1.5px solid ${T.inputBorder}`,
            borderRadius: 10,
            padding: "7px 12px",
            color: T.text,
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
            outline: "none",
            cursor: "pointer",
          }}
        />
        {isToday && (
          <span
            style={{
              background: `${T.accent}20`,
              color: T.accent,
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 10,
              fontWeight: 800,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            TODAY
          </span>
        )}
        <span
          style={{
            fontSize: 12,
            color: T.textSub,
            marginLeft: "auto",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {pct}% · {todo.length} left · {done.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 5,
          background: T.trackBg,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${T.green}88, ${T.green})`,
            borderRadius: 3,
            transition: "width 0.4s",
          }}
        />
      </div>

      {/* All done banner */}
      {allDone && (
        <div
          style={{
            background: `linear-gradient(135deg, ${T.green}15, ${T.teal}10)`,
            border: `1.5px solid ${T.green}44`,
            borderRadius: 16,
            padding: "14px 18px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: T.text,
                fontFamily: "'Fraunces', serif",
              }}
            >
              All done for today!
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.textSub,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {getDailyEncouragement()}
            </div>
          </div>
        </div>
      )}

      {/* Template panel */}
      <TemplatePanel
        onLoad={(titles) => titles.forEach((t) => addTask(selDate, t))}
        T={T}
      />

      {/* Manual add */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          background: T.surface,
          border: `1.5px solid ${T.border}`,
          borderRadius: 14,
          padding: "8px 10px",
          boxShadow: T.shadow,
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Or type a custom task… Enter to save"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: T.text,
            fontSize: 13,
            fontFamily: "'Nunito', sans-serif",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: T.accent,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "7px 16px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            boxShadow: `0 3px 10px ${T.accent}44`,
          }}
        >
          + Add
        </button>
      </div>

      {/* TO DO */}
      {todo.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: T.amberSoft,
              border: `1px solid ${T.amber}44`,
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: T.amber,
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.06em",
              }}
            >
              TO DO — {todo.length}
            </span>
          </div>
          {todo.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={(id) => toggleTask(selDate, id)}
              onDelete={(id) => deleteTask(selDate, id)}
              onEdit={(id, title) => editTask(selDate, id, title)}
              T={T}
            />
          ))}
        </div>
      )}

      {/* DONE */}
      {done.length > 0 && (
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: T.greenSoft,
              border: `1px solid ${T.green}44`,
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: T.green,
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.06em",
              }}
            >
              DONE — {done.length}
            </span>
          </div>
          {done.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={(id) => toggleTask(selDate, id)}
              onDelete={(id) => deleteTask(selDate, id)}
              onEdit={(id, title) => editTask(selDate, id, title)}
              T={T}
            />
          ))}
        </div>
      )}

      {dayTasks.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "48px 0", color: T.textMuted }}
        >
          <div style={{ fontSize: 42, marginBottom: 12 }}>📋</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: T.textSub,
              fontFamily: "'Fraunces', serif",
            }}
          >
            Nothing here yet.
          </div>
          <div
            style={{
              fontSize: 13,
              marginTop: 5,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Pick a template above or type a custom task.
          </div>
        </div>
      )}
    </div>
  );
}
