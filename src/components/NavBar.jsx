import React from "react";
import { APP_NAME } from "../data/defaults";

const NAV = [
  { id: "dashboard", label: "Dashboard",        icon: "◎" },
  { id: "tasks",     label: "Daily Tasks",       icon: "✦" },
  { id: "progress",  label: "Long-Term Progress", icon: "▲" },
];

export default function NavBar({ page, setPage, dark, toggleDark, T }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200,
      background: T.navBg, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.navBorder}`,
      padding: "0 20px", transition: "background 0.35s",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", height: 56 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 28 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg, ${T.accent}, ${T.amber})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, boxShadow: `0 3px 10px ${T.accent}55`, flexShrink: 0,
          }}>✦</div>
          <span style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: "'Fraunces', serif", letterSpacing: "-0.2px", whiteSpace: "nowrap" }}>
            {APP_NAME}
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 13px", borderRadius: 10, border: "none",
                  background: active ? `${T.accent}18` : "transparent",
                  color: active ? T.accent : T.textMuted,
                  fontSize: 12, fontWeight: active ? 800 : 500,
                  cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "'Nunito', sans-serif", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = T.textSub; e.currentTarget.style.background = T.bgSub; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = "transparent"; } }}
              >
                <span style={{ fontSize: 11 }}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dark toggle */}
        <button onClick={toggleDark}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "transparent", border: `1.5px solid ${T.border}`,
            borderRadius: 20, padding: "4px 11px",
            cursor: "pointer", transition: "all 0.2s", outline: "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHov; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
        >
          <span style={{ fontSize: 13 }}>{dark ? "☀️" : "🌙"}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, fontFamily: "'Nunito', sans-serif" }}>
            {dark ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </nav>
  );
}
