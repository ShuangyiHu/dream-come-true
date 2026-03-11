// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
export const LIGHT = {
  bg:"#faf7ff", bgSub:"#f0eaff", surface:"#ffffff",
  border:"#e4d5ff", borderHov:"#b89aff",
  text:"#1a0a3d", textSub:"#5e4d85", textMuted:"#a490c8",
  navBg:"rgba(250,247,255,0.94)", navBorder:"#e4d5ff",
  trackBg:"#ede6ff",
  chipGreen:{bg:"#d1fae5",border:"#6ee7b7",text:"#065f46"},
  chipRed:{bg:"#ffe4e6",border:"#fca5a5",text:"#991b1b"},
  chipYellow:{bg:"#fef9c3",border:"#fde047",text:"#713f12"},
  inputBg:"#f5f0ff", inputBorder:"#c9aeff",
  shadow:"0 2px 14px rgba(120,80,220,0.07)",
  shadowHov:"0 4px 22px rgba(120,80,220,0.14)",
};

export const DARK = {
  bg:"#100b1f", bgSub:"#170e2c", surface:"#1d1438",
  border:"rgba(255,255,255,0.09)", borderHov:"rgba(180,140,255,0.4)",
  text:"#f0eaff", textSub:"#baaad8", textMuted:"#7a6898",
  navBg:"rgba(16,11,31,0.94)", navBorder:"rgba(255,255,255,0.07)",
  trackBg:"rgba(255,255,255,0.07)",
  chipGreen:{bg:"rgba(52,211,153,0.14)",border:"rgba(52,211,153,0.35)",text:"#6ee7b7"},
  chipRed:{bg:"rgba(248,113,113,0.14)",border:"rgba(248,113,113,0.35)",text:"#fca5a5"},
  chipYellow:{bg:"rgba(251,191,36,0.14)",border:"rgba(251,191,36,0.35)",text:"#fcd34d"},
  inputBg:"rgba(255,255,255,0.07)", inputBorder:"rgba(255,255,255,0.18)",
  shadow:"none", shadowHov:"none",
};

// ─── PHASE DEFINITIONS ────────────────────────────────────────────────────────
export const PHASES = [
  { id:"march",  month:"March",  monthNum:2, theme:"Build & Position",
    lc:"#f472b6", dc:"#f9a8d4",
    tasks:["Complete SpeakFlow","Update Resume","Polish GitHub","Send 200+ Apps"],
    dailyRates:{applications:7,leetcode:0,networking:0,project:1,interviews:0} },
  { id:"april",  month:"April",  monthNum:3, theme:"Interview Prep",
    lc:"#2dd4bf", dc:"#5eead4",
    tasks:["LeetCode 60–80","System Design","Project Storytelling","Networking"],
    dailyRates:{applications:3,leetcode:2,networking:1,project:0,interviews:0} },
  { id:"may",    month:"May",    monthNum:4, theme:"Interview Pipeline",
    lc:"#818cf8", dc:"#a5b4fc",
    tasks:["Coding Interviews","System Design Rounds","Behavioral Prep","Mock Interviews"],
    dailyRates:{applications:1,leetcode:1,networking:2,project:0,interviews:1} },
  { id:"june",   month:"June",   monthNum:5, theme:"Offer Conversion",
    lc:"#fb923c", dc:"#fdba74",
    tasks:["Final Interviews","Offer Negotiation","Background Check","Decision"],
    dailyRates:{applications:0,leetcode:0,networking:3,project:0,interviews:2} },
];

// ─── METRIC DEFINITIONS ───────────────────────────────────────────────────────
export const METRIC_DEFS = {
  applications:{ label:"Applications", icon:"📨", lc:"#f472b6", dc:"#f9a8d4", defaultTarget:300 },
  leetcode:    { label:"LeetCode",     icon:"💻", lc:"#2dd4bf", dc:"#5eead4", defaultTarget:80  },
  projects:    { label:"Projects",     icon:"🚀", lc:"#818cf8", dc:"#a5b4fc", defaultTarget:3   },
  referrals:   { label:"Referrals",    icon:"🤝", lc:"#fb923c", dc:"#fdba74", defaultTarget:10  },
  interviews:  { label:"Interviews",   icon:"🎙️", lc:"#a78bfa", dc:"#c4b5fd", defaultTarget:20  },
};

export const CATEGORIES = [
  { id:"applications", label:"Applications", lc:"#f472b6", dc:"#f9a8d4", icon:"📨" },
  { id:"leetcode",     label:"LeetCode",     lc:"#2dd4bf", dc:"#5eead4", icon:"💻" },
  { id:"networking",   label:"Networking",   lc:"#a78bfa", dc:"#c4b5fd", icon:"🤝" },
  { id:"project",      label:"Project",      lc:"#818cf8", dc:"#a5b4fc", icon:"🚀" },
  { id:"other",        label:"Other",        lc:"#94a3b8", dc:"#94a3b8", icon:"📌" },
];

export const DEFAULT_GOAL = {
  title:"Land a $150K+ AI/SDE Role in Seattle",
  targetDate:"2025-06-30",
  location:"Seattle",
  salary:"$150K+",
  role:"AI / SDE / Agent Engineer",
};

export const DEFAULT_METRICS_TARGETS = { applications:300, leetcode:80, projects:3, referrals:10, interviews:20 };
export const DEFAULT_METRICS_ACTUAL  = { applications:47,  leetcode:12, projects:1, referrals:3,  interviews:2  };

export const DEFAULT_TASKS_TODAY = [
  { id:1, title:"Send 10 job applications",       category:"applications", completed:false },
  { id:2, title:"Solve 2 LeetCode problems",      category:"leetcode",     completed:false },
  { id:3, title:"Work on SpeakFlow features",     category:"project",      completed:false },
  { id:4, title:"Reach out to 1 connection",      category:"networking",   completed:false },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const pc = (x, dark) => dark ? x.dc : x.lc;

export function getToday() { return new Date().toISOString().split("T")[0]; }
export function getPhaseIdx() { const m=new Date().getMonth(); const i=PHASES.findIndex(p=>p.monthNum===m); return i>=0?i:0; }
export function getDayOfMonth() { return new Date().getDate(); }
export function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }

export function computeExpected(targets, phaseIdx, day) {
  const r={};
  Object.keys(targets).forEach(k=>{ r[k]=Math.round((targets[k]/120)*(phaseIdx*30+day)); });
  return r;
}

export function generateDailyTemplate(phaseIdx) {
  const p=PHASES[phaseIdx], r=p.dailyRates, tpl=[];
  if(r.applications>0) tpl.push({id:Date.now()+1,title:`Send ${r.applications*2} job applications`,category:"applications",completed:false});
  if(r.leetcode>0)     tpl.push({id:Date.now()+2,title:`Solve ${r.leetcode} LeetCode problem${r.leetcode>1?"s":""}`,category:"leetcode",completed:false});
  if(r.networking>0)   tpl.push({id:Date.now()+3,title:`Reach out to ${r.networking} connection${r.networking>1?"s":""}`,category:"networking",completed:false});
  if(r.project>0)      tpl.push({id:Date.now()+4,title:"Work on project (1 hr)",category:"project",completed:false});
  tpl.push({id:Date.now()+5,title:"Review progress",category:"other",completed:false});
  return tpl;
}
