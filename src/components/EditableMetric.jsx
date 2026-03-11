import React, { useState, useRef, useEffect } from "react";
import { METRIC_DEFS, pc } from "../data/defaults";

function Ring({ pct, color, trackColor, size=52, stroke=5 }) {
  const r=(size-stroke)/2, c=2*Math.PI*r, f=c*Math.min(pct/100,1);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${f} ${c}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.7s ease"}}/>
    </svg>
  );
}

export function InlineEdit({ value, onSave, size=22, weight=800, color, bg, bc, width=65, isNum=false }) {
  const [e,setE]=useState(false), [t,setT]=useState(String(value)), ref=useRef(null);
  useEffect(()=>{ if(e&&ref.current) ref.current.focus(); },[e]);
  function commit() {
    const v=isNum?parseInt(t,10):t;
    if(isNum&&!isNaN(v)&&v>0) onSave(v);
    else if(!isNum&&t.trim()) onSave(t.trim());
    else setT(String(value));
    setE(false);
  }
  return e ? (
    <input ref={ref} value={t} onChange={ev=>setT(ev.target.value)} onBlur={commit}
      onKeyDown={ev=>{if(ev.key==="Enter")commit();if(ev.key==="Escape"){setT(String(value));setE(false);}}}
      style={{width,fontSize:size,fontWeight:weight,color,background:bg,border:`1.5px solid ${bc}`,borderRadius:8,padding:"1px 6px",outline:"none",fontFamily:"'Nunito',sans-serif",textAlign:"center"}}/>
  ) : (
    <span onClick={()=>{setT(String(value));setE(true);}} title="Click to edit"
      style={{fontSize:size,fontWeight:weight,color,cursor:"text",borderBottom:`2px dashed ${bc}55`,lineHeight:1.1,fontFamily:"'Nunito',sans-serif"}}>
      {value}
    </span>
  );
}

export default function EditableMetric({ metricKey, actual, target, onActualChange, onTargetChange, T, dark }) {
  const def = METRIC_DEFS[metricKey];
  const mc = pc(def, dark);
  const pct = target > 0 ? Math.round((actual / target) * 100) : 0;

  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`, borderRadius:18,
      padding:"14px 15px", transition:"all 0.2s", boxShadow:T.shadow,
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${mc}88`;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=T.shadowHov;}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=T.shadow;}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <div style={{position:"relative",flexShrink:0}}>
          <Ring pct={pct} color={mc} trackColor={T.trackBg} size={46} stroke={5}/>
          <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,transform:"rotate(90deg)"}}>{def.icon}</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:9,color:T.textMuted,fontFamily:"'DM Mono',monospace",marginBottom:4,letterSpacing:"0.06em"}}>{def.label.toUpperCase()}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:3}}>
            <InlineEdit value={actual} onSave={v=>onActualChange(metricKey,v)} size={20} weight={900} color={T.text} bg={T.inputBg} bc={mc} width={48} isNum/>
            <span style={{fontSize:12,color:T.textMuted}}>/</span>
            <InlineEdit value={target} onSave={v=>onTargetChange(metricKey,v)} size={13} weight={700} color={mc} bg={T.inputBg} bc={mc} width={42} isNum/>
          </div>
        </div>
      </div>
      <div style={{height:5,background:T.trackBg,borderRadius:3,overflow:"hidden",marginBottom:6}}>
        <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:mc,borderRadius:3,transition:"width 0.6s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,color:pct>=80?"#059669":pct>=50?"#d97706":"#dc2626",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{pct}%</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>onActualChange(metricKey,Math.max(0,actual-1))} style={{width:22,height:22,borderRadius:6,border:`1px solid ${T.border}`,background:T.bgSub,color:T.textSub,cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
          <button onClick={()=>onActualChange(metricKey,actual+1)} style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${mc}66`,background:`${mc}22`,color:mc,cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
        </div>
      </div>
    </div>
  );
}
