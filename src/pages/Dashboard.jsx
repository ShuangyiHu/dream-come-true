import React from "react";
import { PHASES, METRIC_DEFS, getPhaseIdx, getDayOfMonth, getDaysInMonth, computeExpected, getToday, pc } from "../data/defaults";
import EditableMetric from "../components/EditableMetric";

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

function CalendarStrip({ tasks, pi, day, dim, now, T, dark }) {
  const ph=PHASES[pi], phc=pc(ph,dark);
  const month=now.getMonth(), year=now.getFullYear();
  const firstDay=new Date(year,month,1).getDay();
  const DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];
  const cells=[]; for(let i=0;i<firstDay;i++) cells.push(null); for(let d=1;d<=dim;d++) cells.push(d);
  const activity={};
  Object.entries(tasks).forEach(([date,dt])=>{
    const dd=new Date(date);
    if(dd.getMonth()===month){const n=dd.getDate();const total=dt.length,done=dt.filter(t=>t.completed).length;activity[n]=total>0?done/total:undefined;}
  });
  return (
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"16px 18px",marginBottom:16,boxShadow:T.shadow}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:13,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif"}}>{ph.month} {year}</span>
        <span style={{fontSize:10,color:phc,fontFamily:"'DM Mono',monospace",fontWeight:700,background:`${phc}18`,padding:"2px 8px",borderRadius:12}}>{ph.theme}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
        {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:9,color:T.textMuted,fontFamily:"'DM Mono',monospace",padding:"1px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={`e${i}`}/>;
          const isToday=d===day,isPast=d<day,act=activity[d];
          let bg=T.bgSub;
          if(act===1) bg=`${phc}55`; else if(act!==undefined&&act>0) bg=`${phc}25`; else if(isPast) bg=T.trackBg;
          return (
            <div key={d} style={{aspectRatio:"1",borderRadius:7,background:bg,
              border:isToday?`2px solid ${phc}`:isPast&&act!==undefined?`1px solid ${phc}33`:"1px solid transparent",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              boxShadow:isToday?`0 0 10px ${phc}55`:"none",transition:"all 0.2s"}}>
              <span style={{fontSize:10,fontWeight:isToday?900:400,color:isToday?phc:isPast?T.textSub:T.textMuted,fontFamily:isToday?"'Nunito',sans-serif":"'DM Mono',monospace"}}>{d}</span>
              {act!==undefined&&<div style={{width:3,height:3,borderRadius:"50%",background:act===1?phc:`${phc}bb`,marginTop:1}}/>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:12,marginTop:10,justifyContent:"flex-end"}}>
        {[{c:`${phc}55`,l:"Done"},{c:`${phc}25`,l:"Partial"},{c:T.trackBg,l:"None"}].map(({c:cc,l})=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:2,background:cc}}/>
            <span style={{fontSize:9,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ actuals, targets, tasks, onActualSet, onTargetChange, setPage, T, dark }) {
  const pi=getPhaseIdx(), ph=PHASES[pi], phc=pc(ph,dark);
  const day=getDayOfMonth(), now=new Date();
  const dim=getDaysInMonth(now.getFullYear(),now.getMonth());
  const exp=computeExpected(targets,pi,day);
  const today=getToday(), tt=tasks[today]||[];
  const doneCount=tt.filter(t=>t.completed).length, totalCount=tt.length;
  const todayPct=totalCount?Math.round((doneCount/totalCount)*100):0;
  const elapsed=pi*30+day;

  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:5}}>
          {now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).toUpperCase()}
        </div>
        <div style={{fontSize:26,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif",letterSpacing:"-0.5px"}}>Sprint Dashboard</div>
        <div style={{fontSize:13,color:T.textSub,marginTop:4}}>3 months to offer · Seattle · $150K+ · AI / SDE</div>
      </div>

      {/* Timeline Rail */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"18px 20px",marginBottom:16,boxShadow:T.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>DAY {elapsed} OF 120</span>
          <span style={{fontSize:10,color:phc,fontFamily:"'DM Mono',monospace",fontWeight:800}}>{Math.round((elapsed/120)*100)}% COMPLETE</span>
        </div>
        <div style={{display:"flex",gap:4,height:10,borderRadius:5,overflow:"hidden",marginBottom:14}}>
          {PHASES.map((p,i)=>{
            const isDone=i<pi,isCurr=i===pi,c=pc(p,dark);
            const pct=isDone?100:isCurr?(day/dim)*100:0;
            return <div key={p.id} style={{flex:1,background:T.trackBg,borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${c}aa,${c})`,transition:"width 0.8s",opacity:isDone?0.75:1}}/>
            </div>;
          })}
        </div>
        <div style={{display:"flex",gap:4}}>
          {PHASES.map((p,i)=>{
            const isDone=i<pi,isCurr=i===pi,c=pc(p,dark);
            return (
              <div key={p.id} style={{flex:1,display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,
                  background:isDone?c:isCurr?`${c}28`:T.trackBg,
                  border:`2.5px solid ${isDone||isCurr?c:"transparent"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,color:isDone?"#fff":isCurr?c:T.textMuted,fontWeight:800,
                  boxShadow:isCurr?`0 0 12px ${c}66`:isDone?`0 0 7px ${c}44`:"none",transition:"all 0.3s"}}>
                  {isDone?"✓":isCurr?"●":""}
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:isCurr?900:500,color:isCurr?c:isDone?T.textSub:T.textMuted,fontFamily:"'Nunito',sans-serif"}}>{p.month}</div>
                  <div style={{fontSize:9,color:isCurr?`${c}bb`:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{p.theme}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CalendarStrip tasks={tasks} pi={pi} day={day} dim={dim} now={now} T={T} dark={dark}/>

      {/* Today + Phase row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",gap:12,boxShadow:T.shadow}}>
          <div style={{position:"relative",flexShrink:0}}>
            <Ring pct={todayPct} color={phc} trackColor={T.trackBg} size={52} stroke={5}/>
            <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:phc,fontFamily:"'Nunito',sans-serif",transform:"rotate(90deg)"}}>{todayPct}%</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif"}}>Today</div>
            <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{doneCount}/{totalCount} tasks done</div>
            <button onClick={()=>setPage("tasks")} style={{marginTop:8,background:`${phc}20`,border:`1.5px solid ${phc}55`,borderRadius:20,padding:"4px 12px",color:phc,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
              Open Tasks →
            </button>
          </div>
        </div>
        <div style={{background:`${phc}12`,border:`2px solid ${phc}44`,borderRadius:18,padding:"16px 18px",boxShadow:T.shadow}}>
          <div style={{fontSize:10,fontWeight:800,color:phc,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:6}}>CURRENT PHASE</div>
          <div style={{fontSize:17,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif"}}>{ph.month}</div>
          <div style={{fontSize:12,fontWeight:700,color:phc,marginBottom:8}}>{ph.theme}</div>
          <div style={{fontSize:11,color:T.textSub,marginBottom:6}}>Day {day} of {dim}</div>
          <div style={{height:5,background:T.trackBg,borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${Math.round((day/dim)*100)}%`,height:"100%",background:phc,transition:"width 0.6s",borderRadius:3}}/>
          </div>
        </div>
      </div>

      {/* Pace Mirror */}
      <div style={{background:T.surface,border:`2px solid ${phc}44`,borderRadius:18,padding:"16px 20px",marginBottom:16,boxShadow:T.shadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:phc,boxShadow:`0 0 7px ${phc}`,animation:"pulse 2s infinite"}}/>
          <span style={{fontSize:10,fontWeight:800,color:phc,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>PACE MIRROR · DAY {day} OF {ph.month.toUpperCase()}</span>
        </div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:8}}>
          {Object.keys(METRIC_DEFS).map(k=>{
            const e2=exp[k]||0,a=actuals[k]||0;
            if(e2===0&&a===0) return null;
            const d2=a-e2,ahead=d2>=0,chip=ahead?T.chipGreen:T.chipRed;
            return (
              <div key={k} style={{display:"flex",alignItems:"center",gap:5,background:chip.bg,border:`1px solid ${chip.border}`,borderRadius:20,padding:"4px 10px"}}>
                <span style={{fontSize:11,color:chip.text}}>{ahead?"▲":"▼"}</span>
                <span style={{fontSize:11,fontWeight:700,color:chip.text,fontFamily:"'DM Mono',monospace"}}>
                  {METRIC_DEFS[k].label}: {ahead?"+":""}{d2}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>Expected by day {day} = your target ÷ 120 days × elapsed</div>
      </div>

      {/* Metrics */}
      <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>
        METRICS — CLICK NUMBERS TO EDIT · + / − TO LOG
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10}}>
        {Object.keys(METRIC_DEFS).map(k=>(
          <EditableMetric key={k} metricKey={k}
            actual={actuals[k]||0} target={targets[k]}
            onActualChange={(key,v)=>onActualSet(key,v)}
            onTargetChange={onTargetChange} T={T} dark={dark}/>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    </div>
  );
}
