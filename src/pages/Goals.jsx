import React, { useState } from "react";
import { METRIC_DEFS, PHASES, getPhaseIdx, pc } from "../data/defaults";
import { InlineEdit } from "../components/EditableMetric";

function FieldRow({ label, value, onSave, type="text", T }) {
  const [editing,setEditing]=useState(false), [tmp,setTmp]=useState(value);
  function commit(){if(tmp.trim())onSave(tmp.trim());else setTmp(value);setEditing(false);}
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:9,color:T.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>{label.toUpperCase()}</div>
      {editing?(
        <div style={{display:"flex",gap:6}}>
          <input autoFocus type={type} value={tmp} onChange={e=>setTmp(e.target.value)}
            onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setTmp(value);setEditing(false);}}}
            style={{flex:1,background:T.inputBg,border:`1.5px solid ${T.inputBorder}`,borderRadius:10,padding:"8px 12px",color:T.text,fontSize:14,outline:"none",fontFamily:"'Nunito',sans-serif"}}/>
          <button onClick={commit} style={{background:"#10b981",border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:12}}>✓</button>
        </div>
      ):(
        <div onClick={()=>{setTmp(value);setEditing(true);}}
          style={{padding:"9px 13px",background:T.bgSub,border:`1.5px dashed ${T.border}`,borderRadius:12,cursor:"text",fontSize:14,color:T.textSub,fontFamily:"'Nunito',sans-serif",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"border-color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHov}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          <span>{value}</span>
          <span style={{fontSize:10,color:T.textMuted}}>✏️</span>
        </div>
      )}
    </div>
  );
}

export default function Goals({ goal, targets, actuals, updateGoal, updateTarget, T, dark }) {
  const pi=getPhaseIdx();
  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:5}}>GOAL CONFIGURATION</div>
        <div style={{fontSize:26,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif",letterSpacing:"-0.5px"}}>Your Goal</div>
      </div>

      <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:20,padding:"22px 24px",marginBottom:22,boxShadow:T.shadow}}>
        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",marginBottom:14}}>PRIMARY GOAL — CLICK ANY FIELD TO EDIT</div>
        {[
          {label:"Title",field:"title",val:goal.title},
          {label:"Target Date",field:"targetDate",val:goal.targetDate,type:"date"},
          {label:"Location",field:"location",val:goal.location},
          {label:"Salary",field:"salary",val:goal.salary},
          {label:"Role",field:"role",val:goal.role},
        ].map(({label,field,val,type="text"})=>(
          <FieldRow key={field} label={label} value={val} type={type} onSave={v=>updateGoal({[field]:v})} T={T}/>
        ))}
      </div>

      <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>SUCCESS METRICS — CLICK TARGET TO EDIT</div>
      {Object.entries(METRIC_DEFS).map(([k,def])=>{
        const tgt=targets[k], a=actuals[k]||0, pct=Math.min((a/tgt)*100,100), mc=pc(def,dark);
        const daily=(Math.max(0,tgt-a)/90).toFixed(1);
        return (
          <div key={k} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10,boxShadow:T.shadow}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{def.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:"'Nunito',sans-serif"}}>{def.label}</div>
                  <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>~{daily}/day needed</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,background:`${mc}14`,border:`1.5px dashed ${mc}55`,borderRadius:12,padding:"5px 12px"}}>
                <span style={{fontSize:20,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif"}}>{a}</span>
                <span style={{fontSize:12,color:T.textMuted}}> / </span>
                <InlineEdit value={tgt} onSave={v=>updateTarget(k,v)} size={15} weight={700} color={mc} bg={T.inputBg} bc={mc} width={48} isNum/>
                <span style={{fontSize:9,color:T.textMuted,marginLeft:2}}>✏️</span>
              </div>
            </div>
            <div style={{height:5,background:T.trackBg,borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${mc}77,${mc})`,borderRadius:3,transition:"width 0.6s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
              <span style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{a} done</span>
              <span style={{fontSize:10,color:mc,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{Math.round(pct)}%</span>
            </div>
          </div>
        );
      })}

      <div style={{marginTop:22,fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",marginBottom:14}}>MONTHLY PLANS</div>
      {PHASES.map((p,i)=>{
        const phc=pc(p,dark);
        return (
          <div key={p.id} style={{background:T.surface,borderLeft:`4px solid ${phc}`,borderRadius:"0 16px 16px 0",padding:"14px 18px",marginBottom:10,opacity:i>pi?0.4:1,boxShadow:T.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:14,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif"}}>{p.month}</div>
              <div style={{fontSize:10,color:phc,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{p.theme.toUpperCase()}</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {p.tasks.map((t,j)=><span key={j} style={{background:`${phc}14`,color:phc,border:`1px solid ${phc}30`,borderRadius:8,padding:"4px 10px",fontSize:11,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>• {t}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
