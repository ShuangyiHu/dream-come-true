import React from "react";
import { APP_GOAL, TARGET_DATE, getTimelineProgress, formatDate } from "../data/defaults";

export default function GoalCard({ T }) {
  const { pct, remaining } = getTimelineProgress();

  return (
    <div style={{
      position: "relative",
      borderRadius: 22,
      padding: "26px 30px",
      marginBottom: 28,
      overflow: "hidden",
      background: `linear-gradient(130deg, ${T.accent} 0%, ${T.amber} 100%)`,
      boxShadow: `0 6px 32px ${T.accent}55`,
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "absolute", right: -40, top: -40,
        width: 180, height: 180, borderRadius: "50%",
        background: "rgba(255,255,255,0.08)", pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", right: 40, bottom: -60,
        width: 130, height: 130, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", pointerEvents: "none",
      }}/>

      {/* Label */}
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.75)",
        fontFamily: "'DM Mono', monospace",
        marginBottom: 10,
      }}>
        🎯 YOUR GOAL
      </div>

      {/* Goal text */}
      <div style={{
        fontSize: 22,
        fontWeight: 900,
        color: "#fff",
        fontFamily: "'Fraunces', serif",
        lineHeight: 1.3,
        marginBottom: 18,
        maxWidth: 480,
      }}>
        {APP_GOAL}
      </div>

      {/* Progress bar + stats row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            height: 8, borderRadius: 4,
            background: "rgba(255,255,255,0.25)",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: "#fff",
              borderRadius: 4,
              transition: "width 1s ease",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                animation: "shimmer 2.5s infinite",
              }}/>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>COMPLETE</div>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.25)" }}/>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{remaining}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>DAYS LEFT</div>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.25)" }}/>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{formatDate(TARGET_DATE)}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>TARGET DATE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
