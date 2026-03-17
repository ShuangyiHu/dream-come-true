// ─── APP CONSTANTS ────────────────────────────────────────────────────────────
export const APP_NAME = "Dream Come True";
export const APP_GOAL = "Land a $150K+ base salary job in Seattle by June.";
export const START_DATE = "2026-03-11";
export const TARGET_DATE = "2026-06-15";
export const STORAGE_KEY = "dct_v1";

// ─── THEME TOKENS — Warm Melody palette ──────────────────────────────────────
// Extracted from the warm illustrated-desk reference image:
// cream book pages, terracotta flowers, botanical greens, dusty rose, warm shadows

export const LIGHT = {
  bg: "#FDF8F0", // warm cream — book page
  bgSub: "#F5EDD8", // parchment — shadow areas
  surface: "#FFFCF5", // near-white card
  surfaceAlt: "#F9F2E4", // slightly warmer card variant
  border: "#E8D9C0", // warm tan border
  borderHov: "#C4956A", // dusty brown hover

  text: "#3D2B1F", // deep warm brown — book spine shadow
  textSub: "#7A5C45", // mid brown
  textMuted: "#B09880", // light warm grey

  accent: "#D4714E", // terracotta — the hero color (orange daisy)
  accentSoft: "#F2C4A8", // light terracotta
  accentHov: "#BF5E3B",

  green: "#6B9E78", // botanical leaf green
  greenSoft: "#C8E6CC",
  teal: "#7BBFB5", // vase blue-green
  tealSoft: "#C2E4E0",
  lavender: "#B8A9C9", // soft purple shadow
  lavSoft: "#E8E0F0",
  amber: "#C49A3C", // warm golden
  amberSoft: "#F5E4B0",

  navBg: "rgba(253,248,240,0.95)",
  navBorder: "#E8D9C0",
  trackBg: "#EDE0CC",

  chipGood: { bg: "#E8F5E4", border: "#9BC99B", text: "#2D6A2D" },
  chipWarn: { bg: "#FEF3E0", border: "#E8C96A", text: "#7A5200" },
  chipBad: { bg: "#FCEAE4", border: "#E8967A", text: "#8B2A14" },

  inputBg: "#F5EDD8",
  inputBorder: "#D4B896",
  shadow: "0 2px 16px rgba(100,60,20,0.08)",
  shadowMd: "0 4px 24px rgba(100,60,20,0.12)",
  shadowHov: "0 6px 32px rgba(100,60,20,0.16)",
};

export const DARK = {
  bg: "#1C1208", // deep rich brown-black — strong tea
  bgSub: "#241808",
  surface: "#2C1E0E", // warm dark wood
  surfaceAlt: "#331F0A",
  border: "rgba(255,215,170,0.10)",
  borderHov: "rgba(196,149,106,0.45)",

  text: "#F5EDD8", // cream text
  textSub: "#D4B896",
  textMuted: "#8A7060",

  accent: "#E8896A", // slightly lighter terracotta on dark
  accentSoft: "rgba(212,113,78,0.20)",
  accentHov: "#F09070",

  green: "#7BB888",
  greenSoft: "rgba(107,158,120,0.20)",
  teal: "#8ECFC6",
  tealSoft: "rgba(123,191,181,0.20)",
  lavender: "#C4B8D4",
  lavSoft: "rgba(184,169,201,0.20)",
  amber: "#D4AA50",
  amberSoft: "rgba(196,154,60,0.20)",

  navBg: "rgba(28,18,8,0.96)",
  navBorder: "rgba(255,215,170,0.08)",
  trackBg: "rgba(255,215,170,0.08)",

  chipGood: {
    bg: "rgba(107,158,120,0.18)",
    border: "rgba(107,158,120,0.40)",
    text: "#9BC99B",
  },
  chipWarn: {
    bg: "rgba(196,154,60,0.18)",
    border: "rgba(196,154,60,0.40)",
    text: "#E8C96A",
  },
  chipBad: {
    bg: "rgba(212,113,78,0.18)",
    border: "rgba(212,113,78,0.40)",
    text: "#E8967A",
  },

  inputBg: "rgba(255,215,170,0.07)",
  inputBorder: "rgba(255,215,170,0.20)",
  shadow: "none",
  shadowMd: "none",
  shadowHov: "none",
};

// ─── SPRINT DEFINITIONS ───────────────────────────────────────────────────────
// 6 sprints × 2 weeks = 12 weeks ≈ March 11 – June 15
export function getSprintDefs() {
  const sprints = [];
  const start = new Date(START_DATE);
  for (let i = 0; i < 6; i++) {
    const s = new Date(start);
    s.setDate(s.getDate() + i * 14);
    const e = new Date(s);
    e.setDate(e.getDate() + 13);
    sprints.push({
      id: i + 1,
      label: `Sprint ${i + 1}`,
      start: s.toISOString().split("T")[0],
      end: e.toISOString().split("T")[0],
    });
  }
  return sprints;
}

export function getCurrentSprintIdx() {
  const today = getToday();
  const sprints = getSprintDefs();
  const i = sprints.findIndex((s) => today >= s.start && today <= s.end);
  return i >= 0 ? i : 0;
}

// ─── METRIC DEFINITIONS ───────────────────────────────────────────────────────
export const METRIC_DEFS = [
  { key: "applications", label: "Applications", icon: "📨", color: "accent" },
  { key: "leetcode", label: "LeetCode", icon: "💻", color: "green" },
  { key: "projects", label: "Projects", icon: "🚀", color: "teal" },
  { key: "referrals", label: "Referrals", icon: "🤝", color: "lavender" },
  { key: "interviews", label: "Interviews", icon: "🎙️", color: "amber" },
];

export function getMetricColor(colorKey, T) {
  return T[colorKey] || T.accent;
}
export function getMetricSoftColor(colorKey, T) {
  return T[colorKey + "Soft"] || T.accentSoft;
}

// ─── ENCOURAGEMENT MESSAGES ──────────────────────────────────────────────────
export const ENCOURAGEMENTS = [
  "You're making progress. Every step counts.",
  "Keep going — you're getting closer.",
  "Consistency is what separates dreamers from achievers.",
  "Today's effort is tomorrow's result.",
  "You're building something real. Stay the course.",
  "The job is out there. You're finding it.",
  "One more day of work. One day closer.",
  "Small wins compound into big results.",
  "Progress isn't always visible — but it's happening.",
  "Seattle is waiting. You've got this.",
];

export function getDailyEncouragement() {
  const day = Math.floor((new Date() - new Date(START_DATE)) / 86400000);
  return ENCOURAGEMENTS[Math.abs(day) % ENCOURAGEMENTS.length];
}

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

// Always use local date, never toISOString() which is UTC and wrong in PST
export function getToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse "YYYY-MM-DD" as local midnight (not UTC midnight)
function parseLocalDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Format a local Date object as "YYYY-MM-DD"
function toLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTimelineProgress() {
  const start = parseLocalDate(START_DATE).getTime();
  const end = parseLocalDate(TARGET_DATE).getTime();
  // Use local today's midnight for consistent day counting
  const todayMidnight = parseLocalDate(getToday()).getTime();
  const pct = Math.min(
    100,
    Math.max(0, ((todayMidnight - start) / (end - start)) * 100),
  );
  const elapsed = Math.max(0, Math.floor((todayMidnight - start) / 86400000));
  const remaining = Math.max(0, Math.ceil((end - todayMidnight) / 86400000));
  return { pct: Math.round(pct), elapsed, remaining };
}

export function formatDate(iso) {
  const d = parseLocalDate(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getDaysInSprint(sprintIdx) {
  const sprints = getSprintDefs();
  const s = sprints[sprintIdx];
  const days = [];
  const cur = parseLocalDate(s.start);
  const end = parseLocalDate(s.end);
  while (cur <= end) {
    days.push(toLocalISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

// ─── DEFAULT INITIAL STATE ────────────────────────────────────────────────────
export function buildDefaultSprintGoals() {
  // keyed by sprint id (1-6), each is a metric-key → number map
  return {
    1: {
      applications: 60,
      leetcode: 10,
      projects: 1,
      referrals: 5,
      interviews: 0,
    },
    2: {
      applications: 50,
      leetcode: 15,
      projects: 0,
      referrals: 5,
      interviews: 1,
    },
    3: {
      applications: 40,
      leetcode: 15,
      projects: 1,
      referrals: 5,
      interviews: 2,
    },
    4: {
      applications: 30,
      leetcode: 15,
      projects: 0,
      referrals: 5,
      interviews: 3,
    },
    5: {
      applications: 20,
      leetcode: 10,
      projects: 1,
      referrals: 5,
      interviews: 4,
    },
    6: {
      applications: 10,
      leetcode: 5,
      projects: 0,
      referrals: 3,
      interviews: 5,
    },
  };
}

export const DEFAULT_TASKS_SEED = [
  { id: 1, title: "Apply to 10 jobs on LinkedIn", completed: false },
  { id: 2, title: "Solve 2 LeetCode problems", completed: false },
  { id: 3, title: "Work on SpeakFlow for 1 hour", completed: false },
  { id: 4, title: "Reach out to 1 network connection", completed: false },
];

// ─── TASK TEMPLATES ───────────────────────────────────────────────────────────
// Each template has a label, icon, color key, and tasks.
// Tasks with a `num` field are editable numbers (e.g. "Apply to {num} jobs").
// `prefix` + num + `suffix` = full displayed title.
export const TASK_TEMPLATES = [
  {
    id: "applications",
    label: "Job Applications",
    icon: "📨",
    color: "accent",
    tasks: [
      {
        id: "a1",
        prefix: "Apply to ",
        num: 10,
        suffix: " jobs on LinkedIn / Indeed",
      },
    ],
  },
  {
    id: "leetcode",
    label: "LeetCode",
    icon: "💻",
    color: "green",
    tasks: [
      {
        id: "l1",
        prefix: "Solve ",
        num: 2,
        suffix: " LeetCode problems (Easy/Medium)",
      },
    ],
  },
  {
    id: "project",
    label: "Project Work",
    icon: "🚀",
    color: "teal",
    tasks: [
      {
        id: "p1",
        prefix: "Work on ",
        name: "SpeakFlow",
        midfix: " for ",
        num: 2,
        suffix: " hours",
      },
    ],
  },
  {
    id: "networking",
    label: "Networking",
    icon: "🤝",
    color: "lavender",
    tasks: [
      { id: "n1", prefix: "Message ", num: 3, suffix: " people for referrals" },
    ],
  },
  {
    id: "interview",
    label: "Interview Prep",
    icon: "🎙️",
    color: "amber",
    tasks: [
      {
        id: "i1",
        prefix: "Do ",
        num: 1,
        suffix: " mock behavioral interview (STAR)",
      },
    ],
  },
];
