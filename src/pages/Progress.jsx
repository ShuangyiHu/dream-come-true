import React, { useState } from "react";
import { METRIC_DEFS, START_DATE, TARGET_DATE, getMetricColor, getMetricSoftColor, getSprintDefs, formatDate } from "../data/defaults";

// ─── COUNTER CARD ──────────────────────────────────────────────────────────────
function CounterCard({ metric, total, setTotal, T }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp]         = useState(String(total));
  const mc  = getMetricColor(metric.color, T);
  const mcs = getMetricSoftColor(metric.color, T);

  function commit() {
    const v = parseInt(tmp, 10);
    if (!isNaN(v) && v >= 0) setTotal(metric.key, v);
    else setTmp(String(total));
    setEditing(false);
  }

  // milestone celebrations
  const milestones = { applications: [50, 100, 150, 200], leetcode: [20, 50, 80], projects: [1, 2, 3], referrals: [5, 10, 15], interviews: [1, 3, 5, 10] };
  const mlist  = milestones[metric.key] || [];
  const nextM  = mlist.find(m => m > total);
  const lastM  = [...mlist].reverse().find(m => m <= total);
  const hitM   = mlist.includes(total) && total > 0;

  return (
    <div style={{
      background: T.surface, border: `1.5px solid ${hitM ? mc + "88" : T.border}`,
      borderRadius: 20, padding: "22px 24px",
      boxShadow: hitM ? `0 4px 24px ${mc}22` : T.shadow,
      transition: "all 0.3s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = T.shadowHov; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = hitM ? `0 4px 24px ${mc}22` : T.shadow; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{metric.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'Fraunces', serif" }}>{metric.label}</span>
        </div>
        {hitM && (
          <span style={{ fontSize: 16 }} title={`Milestone hit: ${total}!`}>🎉</span>
        )}
      </div>

      {/* Big count */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
        {editing ? (
          <input
            autoFocus value={tmp}
            onChange={e => setTmp(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setTmp(String(total)); setEditing(false); } }}
            style={{ width: 90, fontSize: 44, fontWeight: 900, color: mc, background: T.inputBg, border: `2px solid ${mc}`, borderRadius: 10, padding: "0 8px", outline: "none", fontFamily: "'Fraunces', serif" }}
          />
        ) : (
          <span
            onClick={() => { setTmp(String(total)); setEditing(true); }}
            title="Click to edit"
            style={{ fontSize: 44, fontWeight: 900, color: mc, fontFamily: "'Fraunces', serif", cursor: "text", lineHeight: 1 }}
          >
            {total}
          </span>
        )}
        <span style={{ fontSize: 14, color: T.textMuted, fontFamily: "'Nunito', sans-serif" }}>completed</span>
      </div>

      {/* Milestone progress */}
      {nextM && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'DM Mono', monospace" }}>
              {lastM ? `Last: ${lastM}` : "Starting out"}
            </span>
            <span style={{ fontSize: 10, color: mc, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
              Next: {nextM} ({nextM - total} to go)
            </span>
          </div>
          <div style={{ height: 6, background: T.trackBg, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(100, (total / nextM) * 100)}%`, height: "100%",
              background: mc, borderRadius: 3, transition: "width 0.6s",
            }}/>
          </div>
        </div>
      )}
      {!nextM && total > 0 && (
        <div style={{ marginBottom: 14, background: mcs, borderRadius: 10, padding: "6px 10px" }}>
          <span style={{ fontSize: 11, color: mc, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
            🏆 All milestones reached!
          </span>
        </div>
      )}

      {/* Increment buttons */}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => setTotal(metric.key, Math.max(0, total - 1))}
          style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgSub, color: T.textSub, cursor: "pointer", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>−</button>
        <button
          onClick={() => setTotal(metric.key, total + 1)}
          style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `1.5px solid ${mc}55`, background: mcs, color: mc, cursor: "pointer", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>+</button>
        <button
          onClick={() => setTotal(metric.key, total + 5)}
          style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `1.5px solid ${mc}33`, background: T.surfaceAlt, color: T.textSub, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>+5</button>
      </div>
    </div>
  );
}

// ─── SPRINT HISTORY ────────────────────────────────────────────────────────────
function SprintHistory({ sprintGoals, sprintActuals, T }) {
  const sprints    = getSprintDefs();
  const today      = new Date().toISOString().split("T")[0];

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "22px 24px", marginTop: 8, boxShadow: T.shadow }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 16 }}>
        SPRINT HISTORY
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sprints.map((s, i) => {
          const goals   = sprintGoals[s.id]   || {};
          const actuals = sprintActuals[s.id] || {};
          const tGoal   = METRIC_DEFS.reduce((sum, m) => sum + (goals[m.key]   || 0), 0);
          const tActual = METRIC_DEFS.reduce((sum, m) => sum + (actuals[m.key] || 0), 0);
          const pct     = tGoal > 0 ? Math.min(100, Math.round((tActual / tGoal) * 100)) : 0;
          const isPast  = today > s.end;
          const isCurr  = today >= s.start && today <= s.end;
          const isFuture = today < s.start;

          return (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 14px", borderRadius: 12,
              background: isCurr ? `${T.accent}0d` : T.surfaceAlt,
              border: `1px solid ${isCurr ? T.accent + "33" : T.border}`,
              opacity: isFuture ? 0.4 : 1,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: isPast ? T.green : isCurr ? T.accent : T.trackBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isPast ? 14 : 12, color: isPast || isCurr ? "#fff" : T.textMuted,
                fontWeight: 800, fontFamily: "'Fraunces', serif",
                boxShadow: isCurr ? `0 0 12px ${T.accent}44` : "none",
              }}>
                {isPast ? "✓" : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isCurr ? T.accent : T.text, fontFamily: "'Fraunces', serif" }}>
                    {s.label} {isCurr ? "← current" : ""}
                  </span>
                  <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'DM Mono', monospace" }}>
                    {formatDate(s.start)} – {formatDate(s.end)}
                  </span>
                </div>
                <div style={{ height: 4, background: T.trackBg, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: isPast ? T.green : T.accent, borderRadius: 2, transition: "width 0.5s" }}/>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: isPast ? T.green : isCurr ? T.accent : T.textMuted, fontFamily: "'DM Mono', monospace", minWidth: 36, textAlign: "right" }}>
                {isFuture ? "–" : `${pct}%`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
export default function Progress({ state, setTotal, T }) {
  const totalItems = METRIC_DEFS.reduce((s, m) => s + (state.totals[m.key] || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 5 }}>
          CUMULATIVE TOTALS
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: T.text, fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}>
          Long-Term Progress
        </div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 5, fontFamily: "'Nunito', sans-serif" }}>
          {totalItems} total actions logged since March 11.
        </div>
      </div>

      {/* Summary banner */}
      <div style={{
        background: `linear-gradient(135deg, ${T.accent}12, ${T.amber}08)`,
        border: `1.5px solid ${T.accent}30`,
        borderRadius: 20, padding: "16px 22px", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        boxShadow: T.shadow,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>GOAL</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Fraunces', serif", lineHeight: 1.3 }}>
            Land a $150K+ job in Seattle by {formatDate(TARGET_DATE)}.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: T.accent, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{totalItems}</div>
          <div style={{ fontSize: 11, color: T.textSub, fontFamily: "'Nunito', sans-serif" }}>actions logged</div>
        </div>
      </div>

      {/* Counter cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12, marginBottom: 8 }}>
        {METRIC_DEFS.map(m => (
          <CounterCard key={m.key} metric={m} total={state.totals[m.key] || 0} setTotal={setTotal} T={T}/>
        ))}
      </div>

      <SprintHistory sprintGoals={state.sprintGoals} sprintActuals={state.sprintActuals} T={T}/>
    </div>
  );
}
