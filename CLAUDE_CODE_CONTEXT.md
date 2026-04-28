# PortfolioIQ — Build Spec

## Purpose

Interview artifact for Salesforce **Senior Manager, Strategic Portfolio Management (JR337298)** — Digital Enterprise Technology (DET). Maps verbatim to the JD: master taxonomy, stage-gate governance, Source of Truth, AI-enhanced portfolio tooling, value realization KPIs.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS 3
- **Icons:** Lucide React
- **Fonts:** Inter (body), Source Serif 4 (headings), JetBrains Mono (code/IDs)
- **Deploy:** Vercel (zero-config)

## App Shell — 4 Tabs

1. **Portfolio Dashboard** — 5 KPIs, Pillar Performance Grid, Initiative Tracker, Stage-Gate Pipeline
2. **PortfolioCopilot** — AI agent answering portfolio questions with transparent reasoning
3. **Data Model** — 4 normalized tables (initiatives, stage-gate artifacts, dependencies, capacity) + DDL
4. **How I Built This** — Decisions, questions for Judette, honest gaps, 60–90 day plan tied to prep guide

## Design System

```
Salesforce Navy (header):  #032D60
Deep Blue (panels):        #0B5CAB
Accent Blue:               #0176D3
Light Blue (highlight):    #00A1E0
Light BG:                  #F3F6FA
Card BG:                   #FFFFFF
Dark Text:                 #032D60
Muted Text:                #5C7290
Status Green (on_track):   #2E844A
Status Yellow (at_risk):   #FE9339
Status Red (off_track):    #BA0517
Status Blue (in_progress): #0176D3
Status Gray (complete):    #747474
```

## Domain Model

**Pillars (6):** Customer Experience Tech, Employee Productivity, Data & AI Platform, Trust & Security, Finance & Operations Tech, Field Engagement.

**Stage-gates (G0–G5):** Concept → Plan → Build → Validate → Launch → Sustain.

**Status:** on_track, at_risk, off_track, complete.

**OKR alignment (V25):** V25-Agentforce, V25-Trust, V25-Customer-360, V25-Margin, V25-Employee-AI.

## KPIs (5)

1. **Portfolio Health Score** — % initiatives on track (target: ≥80%)
2. **Capital Utilization** — $ spent / $ allocated (target: 70–90% mid-year)
3. **Stage-Gate Compliance** — % initiatives with current artifacts (target: 100%)
4. **Avg Time-in-Stage** — days (target: <60)
5. **Strategic Alignment Score** — % initiatives mapped to V25 OKRs (target: ≥90%)

Every KPI carries a tooltip with WHAT, TARGET, SOURCE, and the JD line it maps to.

## Build Order

1. Config (package.json, vite, tailwind, postcss, index.html)
2. src bootstrap (main.jsx, App.jsx, index.css)
3. Data (portfolioData.js, responseMap.js)
4. Dashboard
5. PortfolioCopilot
6. DataModel
7. HowIBuilt
8. README + deploy

## Run Locally

```bash
cd "PortfolioIQ Demo"
npm install
npm run dev
```

## Deploy

```bash
npx vercel
```
