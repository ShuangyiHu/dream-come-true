import { useState, useEffect, useCallback } from "react";
import { DEFAULT_GOAL, DEFAULT_METRICS_TARGETS, DEFAULT_METRICS_ACTUAL, DEFAULT_TASKS_TODAY, getToday } from "../data/defaults";

const KEY = "jobtrack_v4";

function load() { try { const r=localStorage.getItem(KEY); return r?JSON.parse(r):null; } catch { return null; } }
function save(s) { try { localStorage.setItem(KEY,JSON.stringify(s)); } catch {} }

function buildInitial() {
  const saved=load(); if(saved) return saved;
  return {
    goal: { ...DEFAULT_GOAL },
    targets: { ...DEFAULT_METRICS_TARGETS },
    actuals: { ...DEFAULT_METRICS_ACTUAL },
    tasks: { [getToday()]: DEFAULT_TASKS_TODAY },
    dark: false,
  };
}

export function useStore() {
  const [state, setState] = useState(buildInitial);
  const [dark, setDark] = useState(() => { const s=load(); return s?.dark||false; });

  useEffect(() => { save({ ...state, dark }); }, [state, dark]);

  const updateGoal   = useCallback(patch => setState(s=>({...s,goal:{...s.goal,...patch}})),[]);
  const updateTarget = useCallback((k,v)  => setState(s=>({...s,targets:{...s.targets,[k]:Math.max(1,v)}})),[]);
  const setActual    = useCallback((k,v)  => setState(s=>({...s,actuals:{...s.actuals,[k]:Math.max(0,v)}})),[]);
  const setTasks     = useCallback(upd    => setState(s=>({...s,tasks:typeof upd==="function"?upd(s.tasks):upd})),[]);
  const toggleDark   = useCallback(()     => setDark(d=>!d), []);

  return { state, dark, updateGoal, updateTarget, setActual, setTasks, toggleDark };
}
