import React from "react";
import { PHASES, getPhaseIdx, getDayOfMonth, pc } from "../data/defaults";

export default function Timeline({ T, dark }) {
  const pi=getPhaseIdx(), day=getDayOfMonth(), wk=Math.ceil(day/7);
  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:5}}>ROADMAP OVERVIEW</div>
        <div style={{fontSize:26,fontWeight:900,color:T.text,fontFamily:"'Nunito',sans-serif",letterSpacing:"-0.5px"}}>3-Month Sprint</div>
      </div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:23,top:30,bottom:0,width:2,background:T.trackBg,borderRadius:1}}/>
        {PHASES.map((p,i)=>{
          const isDone=i<pi,isCurr=i===pi,fut=i>pi,phc=pc(p,dark);
          return (
            <div key={p.id} style={{display:"flex",gap:18,marginBottom:22,position:"relative"}}>
              <div style={{width:48,height:48,borderRadius:"50%",flexShrink:0,
                background:isDone?phc:isCurr?`${phc}22`:T.bgSub,
                border:`2.5px solid ${isDone||isCurr?phc:T.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,zIndex:1,
                boxShadow:isCurr?`0 0 18px ${phc}55`:isDone?`0 0 10px ${phc}33`:"none",transition:"all 0.3s"}}>
                {isDone?"✓":isCurr?<div style={{width:10,height:10,borderRadius:"50%",background:phc,animation:"pulse 2s infinite"}}/>:<span style={{fontSize:11,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{i+1}</span>}
              </div>
              <div style={{flex:1,background:isCurr?`${phc}08`:T.surface,
                border:`1.5px solid ${isCurr?`${phc}44`:T.border}`,borderRadius:18,padding:"18px 20px",
                boxShadow:isCurr?`0 4px 20px ${phc}18`:T.shadow,transition:"all 0.3s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:17,fontWeight:900,color:fut?T.textMuted:T.text,fontFamily:"'Nunito',sans-serif"}}>{p.month}</div>
                    <div style={{fontSize:11,fontWeight:700,color:isCurr?phc:isDone?`${phc}99`:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{p.theme.toUpperCase()}</div>
                  </div>
                  {isCurr&&<div style={{background:`${phc}22`,border:`1.5px solid ${phc}55`,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:800,color:phc,fontFamily:"'DM Mono',monospace"}}>CURRENT · DAY {day}</div>}
                  {isDone&&<div style={{background:T.chipGreen.bg,border:`1px solid ${T.chipGreen.border}`,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:T.chipGreen.text,fontFamily:"'DM Mono',monospace"}}>DONE ✓</div>}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                  {p.tasks.map((t,j)=><span key={j} style={{background:isDone?`${phc}18`:isCurr?`${phc}10`:T.bgSub,color:isDone?phc:isCurr?T.textSub:T.textMuted,border:`1px solid ${isDone?`${phc}33`:T.border}`,borderRadius:8,padding:"4px 10px",fontSize:11,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{t}</span>)}
                </div>
                {Object.entries(p.dailyRates).filter(([,v])=>v>0).length>0&&(
                  <div style={{background:T.bgSub,borderRadius:10,padding:"8px 12px",display:"flex",gap:14,flexWrap:"wrap"}}>
                    {Object.entries(p.dailyRates).filter(([,v])=>v>0).map(([k,v])=>(
                      <span key={k} style={{fontSize:10,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>
                        <span style={{color:isCurr?phc:T.textSub,fontWeight:700}}>{v}/day</span> {k}
                      </span>
                    ))}
                  </div>
                )}
                {isCurr&&(
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:9,color:T.textMuted,fontFamily:"'DM Mono',monospace",marginBottom:6}}>WEEKLY BREAKDOWN</div>
                    <div style={{display:"flex",gap:5}}>
                      {[1,2,3,4].map(w=>{
                        const past=w<wk,curW=w===wk;
                        return <div key={w} style={{flex:1,padding:"7px 8px",borderRadius:10,background:past?`${phc}18`:curW?`${phc}10`:T.bgSub,border:`1px solid ${curW?`${phc}44`:T.border}`}}>
                          <div style={{fontSize:9,fontWeight:800,color:curW?phc:past?T.textSub:T.textMuted,fontFamily:"'DM Mono',monospace"}}>W{w}{curW?" ←":""}</div>
                          <div style={{fontSize:8,color:T.textMuted,marginTop:2,fontFamily:"'DM Mono',monospace"}}>D{(w-1)*7+1}–{w*7}</div>
                        </div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    </div>
  );
}
