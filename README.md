# JobTrack — 3-Month Job Search Sprint Tracker

A focused productivity tool that bridges long-term career goals with daily execution.

## Features

- **📅 Calendar Dashboard** — See exactly where you are in your 3-month sprint with a visual calendar, timeline rail, and pace mirror
- **🤖 Pace Mirror** — AI-computed daily expected pace vs. your actual progress, updated every day
- **✅ Daily Tasks** — TODO / DONE split with AI-generated templates per phase
- **🗺️ Timeline** — Phase-by-phase roadmap with weekly breakdowns
- **🎯 Goals** — Fully editable goal, metrics, and targets

## Editing Metrics

All numbers are editable:
- **Click any number** (actual or target) to type a new value
- **+ / −** buttons for quick increment/decrement
- In the Goals page, click the target number to set a new goal

When you change a target, the Pace Mirror automatically recalculates your daily expected pace.

## Quick Start

```bash
npm install
npm start
```

Then open http://localhost:3000

## Stack

- React 18 (Create React App)
- localStorage persistence (no backend needed)
- Fonts: Syne + DM Mono (Google Fonts)

## Folder Structure

```
src/
  data/
    defaults.js       — All constants, phase definitions, helpers
  hooks/
    useStore.js       — localStorage state management
  components/
    NavBar.jsx        — Top navigation with icons + labels
    EditableMetric.jsx — Click-to-edit metric card with progress ring
  pages/
    Dashboard.jsx     — Calendar, timeline rail, pace mirror, metrics
    Tasks.jsx         — Daily task tracker (TODO / DONE)
    Timeline.jsx      — 3-month roadmap
    Goals.jsx         — Goal & target configuration
  App.jsx             — Root component and routing
```

## Upgrading to Backend

When you're ready for multi-device sync:
1. Add FastAPI backend: `POST /tasks`, `GET /tasks/:date`, `PUT /metrics`
2. Replace `useStore` hook with `useSWR` + API calls
3. Add auth with Supabase or Clerk
4. Deploy to Vercel (frontend) + Railway (backend)
