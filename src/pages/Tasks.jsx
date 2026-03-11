import React, { useState } from "react";
import { CATEGORIES, PHASES, getPhaseIdx, getToday, generateDailyTemplate, pc } from "../data/defaults";

function TaskRow({ task, onToggle, onDelete, T, dark }) {
  const cat=CATEGORIES.find(c=>c.id===task.category)||CATEGORIES[4], catc=pc(cat,dark);
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:14,marginBottom:6,
        background:task.completed?T.bgSub:T.surface,
        border:`1px solid ${hov&&!task.completed?catc+"66":T.border}`,
        opacity:task.completed?0.6:1,transition:"all 0.15s",
        boxShadow:hov&&!task.completed?`0 2px 14px ${catc}22`:T.shadow}}>
      <button onClick={()=>onToggle(task.id)} style={{width:22,height:22,borderRadius:7,flexShrink:0,cursor:"pointer",
        border:`2px solid ${task.completed?catc:T.textMuted}`,background:task.completed?catc:"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
        {task.completed&&<span style={{color:"#fff",fontSize:11,fontWeight:900}}>✓</span>}
      </button>
      <span style={{flex:1,fontSize:13,color:task.completed?T.textMuted:T.text,textDecoration:task.completed?"line-through":"none",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{task.title}</span>
      <span style={{fontSize:9,fontWeight:800,padding:"3px 9px",borderRadius:20,background:`${catc}18`,color:catc,fontFamily:"'DM Mono',monospace"}}>{cat.icon} {cat.label}</span>
      {hov&&<button onClick={()=>onDelete(task.id)} style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:7,cursor:"pointer",color:"#dc2626",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>×</button>}
    </div>
  );
}

export default function Tasks({ tasks, setTasks, T, dark }) {
  const today=getToday();
  const [selDate,setSelDate]=useState(today);
  const [newTask,setNewTask]=useState("");
  const [newCat,setNewCat]=useState("applications");
  const pi=getPhaseIdx(), ph=PHASES[pi], phc=pc(ph,dark);
  const dayTasks=tasks[selDate]||[], todo=dayTasks.filter(t=>!t.completed), done=dayTasks.filter(t=>t.completed);
  const pct=dayTasks.length?Math.round((done.length/dayTasks.length)*100):0, isToday=selDate===today;

  function toggle(id){setTasks(p=>({...p,[selDate]:(p[selDate]||[]).map(t=>t.id===id?{...t,completed:!t.completed}:t)}));}
  function del(id){setTasks(p=>({...p,[selDate]:(p[selDate]||[]).filter(t=>t.id!==id)}));}
  function add(){
    if(!newTask.trim())return;
    setTasks(p=>({...p,[selDate]:[...(p[selDate]||[]),{id:Date.now(),title:newTask.trim(),category:newCat,completed:false}]}));
    setNewTask("");
  }
  function loadTemplate(){
    const tpl=generateDailyTemplate(pi);
    setTasks(p=>({...p,[selDate]:[...(p[selDate]||[]),...tpl]}));
  }

  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
          <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
            style={{background:T.inputBg,border:`1.5px solid ${T.inputBorder}`,borderRadius:12,padding:"8px 12px",color:T.text,fontSize:13,fontFamily:"'DM Mono',monospace",outline:"none",cursor:"pointer"}}/>
          {isToday&&<span style={{background:`${phc}22`,color:phc,borderRadius:20,padding:"4px 12px",fontSize:10,fontWeight:800,fontFamily:"'DM Mono',monospace"}}>TODAY</span>}
          <span style={{fontSize:12,color:T.textSub,marginLeft:"auto"}}>{pct}% · {todo.length} left · {done.length} done</span>
        </div>
        <div style={{height:5,background:T.trackBg,borderRadius:3,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${phc}88,${phc})`,transition:"width 0.4s",borderRadius:3}}/>
        </div>
      </div>

      {isToday&&(
        <div style={{background:`${phc}10`,border:`2px dashed ${phc}44`,borderRadius:16,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:800,color:phc,fontFamily:"'DM Mono',monospace"}}>🤖 AI TEMPLATE · {ph.theme.toUpperCase()}</div>
            <div style={{fontSize:11,color:T.textSub,marginTop:3}}>
              {[ph.dailyRates.applications>0&&`${ph.dailyRates.applications*2} apps`,ph.dailyRates.leetcode>0&&`${ph.dailyRates.leetcode} LC`,ph.dailyRates.networking>0&&`${ph.dailyRates.networking} networking`,ph.dailyRates.project>0&&"project"].filter(Boolean).join(" · ")}
            </div>
          </div>
          <button onClick={loadTemplate} style={{background:phc,color:"#fff",border:"none",borderRadius:12,padding:"8px 14px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap",boxShadow:`0 4px 12px ${phc}44`}}>+ Template</button>
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:18,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"9px 11px",boxShadow:T.shadow}}>
        <input value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Add a task… Enter to save"
          style={{flex:1,background:"none",border:"none",outline:"none",color:T.text,fontSize:13,fontFamily:"'Nunito',sans-serif"}}/>
        <select value={newCat} onChange={e=>setNewCat(e.target.value)} style={{background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:8,padding:"5px 8px",color:T.text,fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
          {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <button onClick={add} style={{background:phc,color:"#fff",border:"none",borderRadius:11,padding:"7px 16px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif",boxShadow:`0 3px 10px ${phc}44`}}>Add</button>
      </div>

      {todo.length>0&&(
        <div style={{marginBottom:18}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:T.chipYellow.bg,border:`1px solid ${T.chipYellow.border}`,borderRadius:20,padding:"3px 10px",marginBottom:10}}>
            <span style={{fontSize:9,fontWeight:800,color:T.chipYellow.text,fontFamily:"'DM Mono',monospace"}}>TODO — {todo.length}</span>
          </div>
          {todo.map(t=><TaskRow key={t.id} task={t} onToggle={toggle} onDelete={del} T={T} dark={dark}/>)}
        </div>
      )}
      {done.length>0&&(
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:T.chipGreen.bg,border:`1px solid ${T.chipGreen.border}`,borderRadius:20,padding:"3px 10px",marginBottom:10}}>
            <span style={{fontSize:9,fontWeight:800,color:T.chipGreen.text,fontFamily:"'DM Mono',monospace"}}>DONE — {done.length}</span>
          </div>
          {done.map(t=><TaskRow key={t.id} task={t} onToggle={toggle} onDelete={del} T={T} dark={dark}/>)}
        </div>
      )}
      {dayTasks.length===0&&(
        <div style={{textAlign:"center",padding:"48px 0",color:T.textMuted}}>
          <div style={{fontSize:40,marginBottom:10}}>📋</div>
          <div style={{fontSize:14,fontWeight:800,color:T.textSub,fontFamily:"'Nunito',sans-serif"}}>No tasks yet</div>
          <div style={{fontSize:12,marginTop:4}}>Add tasks or load AI template above</div>
        </div>
      )}
    </div>
  );
}
