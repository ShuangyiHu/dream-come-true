import { useState, useEffect, useCallback } from "react";
import {
  STORAGE_KEY,
  getToday,
  buildDefaultSprintGoals,
  DEFAULT_TASKS_SEED,
} from "../data/defaults";

function load() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
function save(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

function buildInitial() {
  const saved = load();
  if (saved) return saved;
  const today = getToday();
  return {
    // sprint goals: { [sprintId]: { applications, leetcode, ... } }
    sprintGoals: buildDefaultSprintGoals(),
    // sprint actuals: { [sprintId]: { applications, leetcode, ... } }
    sprintActuals: {
      1: {
        applications: 0,
        leetcode: 0,
        projects: 0,
        referrals: 0,
        interviews: 0,
      },
    },
    // cumulative totals (long-term progress)
    totals: {
      applications: 0,
      leetcode: 0,
      projects: 0,
      referrals: 0,
      interviews: 0,
    },
    // tasks by date: { "YYYY-MM-DD": [{ id, title, completed }] }
    tasks: { [today]: DEFAULT_TASKS_SEED.map((t) => ({ ...t })) },
    dark: false,
  };
}

export function useStore() {
  const [state, setState] = useState(buildInitial);
  const [dark, setDark] = useState(() => {
    const s = load();
    return s?.dark || false;
  });

  useEffect(() => {
    save({ ...state, dark });
  }, [state, dark]);

  // ── Sprint goals ──────────────────────────────────────────────────────────
  const setSprintGoal = useCallback((sprintId, key, value) => {
    setState((s) => ({
      ...s,
      sprintGoals: {
        ...s.sprintGoals,
        [sprintId]: {
          ...(s.sprintGoals[sprintId] || {}),
          [key]: Math.max(0, value),
        },
      },
    }));
  }, []);

  // ── Sprint actuals (increments) ───────────────────────────────────────────
  const setSprintActual = useCallback((sprintId, key, value) => {
    setState((s) => {
      const prev = s.sprintActuals[sprintId] || {};
      const prevVal = prev[key] || 0;
      const delta = Math.max(0, value) - prevVal;
      return {
        ...s,
        sprintActuals: {
          ...s.sprintActuals,
          [sprintId]: { ...prev, [key]: Math.max(0, value) },
        },
        // also update cumulative totals by the delta
        totals: {
          ...s.totals,
          [key]: Math.max(0, (s.totals[key] || 0) + delta),
        },
      };
    });
  }, []);

  // ── Direct total edit (for LTP tab) ──────────────────────────────────────
  const setTotal = useCallback((key, value) => {
    setState((s) => ({
      ...s,
      totals: { ...s.totals, [key]: Math.max(0, value) },
    }));
  }, []);

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const setTasks = useCallback((upd) => {
    setState((s) => ({
      ...s,
      tasks: typeof upd === "function" ? upd(s.tasks) : upd,
    }));
  }, []);

  const addTask = useCallback((date, title) => {
    if (!title.trim()) return;
    setState((s) => ({
      ...s,
      tasks: {
        ...s.tasks,
        [date]: [
          ...(s.tasks[date] || []),
          { id: Date.now(), title: title.trim(), completed: false },
        ],
      },
    }));
  }, []);

  const toggleTask = useCallback((date, id) => {
    setState((s) => ({
      ...s,
      tasks: {
        ...s.tasks,
        [date]: (s.tasks[date] || []).map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      },
    }));
  }, []);

  const deleteTask = useCallback((date, id) => {
    setState((s) => ({
      ...s,
      tasks: {
        ...s.tasks,
        [date]: (s.tasks[date] || []).filter((t) => t.id !== id),
      },
    }));
  }, []);

  const editTask = useCallback((date, id, title) => {
    setState((s) => ({
      ...s,
      tasks: {
        ...s.tasks,
        [date]: (s.tasks[date] || []).map((t) =>
          t.id === id ? { ...t, title } : t,
        ),
      },
    }));
  }, []);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  return {
    state,
    dark,
    setSprintGoal,
    setSprintActual,
    setTotal,
    setTasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    toggleDark,
  };
}
