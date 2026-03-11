import React from "react";
import { PHASES, getPhaseIdx, pc } from "../data/defaults";

const NAV = [
  { id:"dashboard", icon:"⚡", label:"Dashboard" },
  { id:"tasks",     icon:"✅", label:"Daily Tasks" },
  { id:"timeline",  icon:"🗺️", label:"Timeline" },
  { id:"goals",     icon:"🎯", label:"Goals" },
];

export default function NavBar({ page, setPage, dark, toggleDark, T }) {
  const phase = PHASES[getPhaseIdx()];
  const phc = pc(phase, dark);

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:200,
      background:T.navBg, backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${T.navBorder}`,
      padding:"0 20px", transition:"background 0.35s",
    }}>
      <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center", gap:2, height:58 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginRight:14 }}>
          <div style={{
            width:30, height:30, borderRadius:10,
            background:`linear-gradient(135deg,${phc},${phc}aa)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, boxShadow:`0 3px 12px ${phc}55`,
          }}>🚀</div>
          <span style={{ fontSize:14, fontWeight:900, color:T.text, fontFamily:"'Nunito',sans-serif", letterSpacing:"-0.3px" }}>
            JobTrack
          </span>
        </div>

        {/* Nav items */}
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"7px 12px", borderRadius:11, border:"none",
                background: active ? `${phc}20` : "transparent",
                color: active ? phc : T.textSub,
                fontSize:12, fontWeight: active ? 800 : 600,
                cursor:"pointer", transition:"all 0.15s",
                fontFamily:"'Nunito',sans-serif", whiteSpace:"nowrap",
              }}
              onMouseEnter={e => { if(!active){ e.currentTarget.style.background=T.bgSub; e.currentTarget.style.color=T.text; }}}
              onMouseLeave={e => { if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.textSub; }}}
            >
              <span style={{ fontSize:15 }}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          );
        })}

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          {/* Phase pill */}
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            background:`${phc}18`, border:`1.5px solid ${phc}44`,
            borderRadius:20, padding:"4px 12px",
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:phc, boxShadow:`0 0 7px ${phc}`, animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:9, fontWeight:800, color:phc, fontFamily:"'DM Mono',monospace" }}>
              {phase.month.toUpperCase()} · {phase.theme.toUpperCase()}
            </span>
          </div>

          {/* Theme toggle */}
          <button onClick={toggleDark}
            style={{
              display:"flex", alignItems:"center", gap:6,
              background: dark ? "rgba(255,255,255,0.09)" : T.bgSub,
              border:`1.5px solid ${T.border}`,
              borderRadius:20, padding:"5px 12px",
              cursor:"pointer", transition:"all 0.25s", outline:"none",
            }}>
            <span style={{ fontSize:14 }}>{dark ? "☀️" : "🌙"}</span>
            <span style={{ fontSize:11, fontWeight:700, color:T.textSub, fontFamily:"'Nunito',sans-serif" }}>
              {dark ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
