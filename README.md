# PortfolioIQ — DET Strategic Portfolio Intelligence (Demo)

🌐 **Live demo:** https://portfolioiq-demo.vercel.app/
📁 **Repo:** https://github.com/saurabhj1986/portfolioiq-demo

Interview artifact for **Salesforce JR337298 — Senior Manager, Strategic Portfolio Management**.

An 8-tab React prototype (dark theme) — every feature maps to a portfolio leadership use case. Built for Senior Directors, Senior Managers, and Executives managing initiatives across multiple pillars.

## Tabs

1. **Portfolio Dashboard** — 5 KPIs (Health, Capital, Compliance, Cycle, Alignment), Stage-Gate Pipeline (G0–G5), Pillar Performance, Initiative Tracker (16 initiatives across 6 DET Pillars) — *JD #13*
2. **Decision Engine** — 8 sub-tabs of interactive calculators:
   - **RICE Prioritization** — *JD #10*
   - **Capital Optimizer** (knapsack with pin-to-protect) — *JD #12*
   - **5×5 Risk Heatmap** — *JD #4*
   - **Stage-Gate Scorer** — *JD #3*
   - **Value & TCO Engine** (build + run + change + opportunity vs revenue + savings + risk avoided + strategic) — *JD #13*
   - **Influence Factors** — 8 JD-aligned dimensions (Data Quality, Data Governance, Vendor & Tech Concentration, Talent & Capacity, Regulatory & Compliance, Tech Debt, Stakeholder Signal, Market Timing) — *JD #5, #6, #11*
   - **Process Health** — friction metrics, cycle time per gate, rework rate, Pillar PM NPS, anti-patterns with recommendations — *JD #6 + #9*
   - **Scenario Compare** — side-by-side of 4 DET scenarios with auto-generated decision rationale tied to Salesforce core values — *JD #10, #14*
3. **KPI Studio** — Configurable KPI catalog (17 KPIs across 7 categories: Value Creation, Business Impact, Resource, Capital, Risk, Sentiment, Strategic Fit) + Portfolio Recommendation Engine. Execs toggle KPIs on/off, adjust weights, switch between 5 pre-baked profiles (Balanced / Margin-First / Risk-Averse / Innovation-First / Trust-First). Engine scores every initiative and outputs **Accelerate / Continue / Watch / Restructure / Sunset** with auto-generated rationale per initiative — *JD #13 + #12*
4. **Playbooks** — 7 foundational playbooks (Stage-Gate Decision, Initiative Intake, Capacity Planning, Risk Register Template, Quarterly Rebalance, Portfolio Review, Sunset/Kill) with adoption tracked per pillar — *JD #2*
5. **Team Cockpit** — 4 portfolio manager direct reports, AI coaching feed, auto-drafted weekly briefs for 1:1 prep, 4 workflow automations — *JD #15 + people-leader role*
6. **PortfolioCopilot** — AI agent with transparent reasoning (classify → resolve → reason → confidence) answering 7 portfolio questions — *JD #14 + bonus AI qualification*
7. **Data Model** — 4 normalized tables (initiative_inventory, stage_gate_artifacts, dependencies, capacity_snapshots) with full DDL + **portfolio_audit_trail** showing append-only change log — *JD #1, #4, #5, #7*
8. **How I Built This** — JD Coverage Matrix (every JD line → feature attribution), design decisions, questions for stakeholders, honest gaps, 60–90 day plan, architecture transfer notes

## What was deliberately cut for scope discipline

- **Sustainability** and **Equality & Inclusion** factors — Salesforce core values per Kathrin's email, but not in JR337298. Easy to add when relevant; out of scope for the role as written.

## Quick start

```bash
cd "PortfolioIQ Demo"
npm install
npm run dev
# open http://localhost:5173
```

## Deploy to Vercel (recommended)

```bash
npx vercel
# follow prompts; subsequent deploys: npx vercel --prod
```

The local Windows-on-ARM + OneDrive combo can break the rollup native binary at `npm run build`. The source code is fine — Vercel builds on Linux x64 cleanly. To run locally without issues, either move the project out of OneDrive (e.g., `C:\dev\portfolioiq-demo`) or just deploy directly.

## JD-to-feature mapping

| JD requirement (verbatim) | Where it lives |
|---|---|
| "Define and govern the master taxonomy and metadata standards" | Data Model tab + initiative_inventory schema |
| "Act as the primary authority for data integrity, ensuring a reliable Source of Truth" | Data Model tab + every component joins back to initiative_inventory |
| "Establish comprehensive guardrails and stage-gate processes" | Stage-Gate Pipeline (Dashboard) + Stage-Gate Scorer (Decision Engine) |
| "Define and manage key portfolio performance indicators (value realization, time-to-market, resource utilization, risk exposure)" | 5-KPI strip with tooltips citing JD lines verbatim + Risk Heatmap |
| "Maintain a forward-looking view of the portfolio to anticipate dependencies, resource constraints" | dependencies table + Copilot's "show dependencies" answer + Capacity FTE bars |
| "Provide executive insights and recommendations to guide strategic trade-offs and capital allocation" | Capital Optimizer + Value & TCO Engine + Scenario Compare with auto-rationale |
| "Drive adoption of enterprise tools and analytics for portfolio visibility and scenario planning" | Tooltip-everywhere UX + Scenario Compare |
| "Build a collaborative teaming environment that champions creativity, innovation, and learning" | Team Cockpit AI Coaching Feed (growth-track items, not just risks) |
| **Bonus**: "Experience building portfolio tools with AI" | PortfolioCopilot tab + AI Coaching Feed in Team Cockpit |

## Recruiter-screening hooks

These details from Kathrin's screening notes are explicitly reflected in the demo:
- **4 direct reports** → Team Cockpit shows exactly 4 Portfolio Managers
- **Hiring urgency: maternity leave starting June** → Team Cockpit auto-detects Marcus's leave + proposes Aisha as backfill
- **Salesforce core values (Trust, Customer Success, Innovation, Equality, Sustainability)** → Scenario Compare scores each scenario against all 5 values
- **STAR framework / Round 1 with Judette** → "How I Built This" tab is structured as a STAR story for the prototype itself

## Tech stack

React 18 · Vite 5 · Tailwind 3 · Lucide React · Inter / Source Serif 4 / JetBrains Mono.

## File map

```
PortfolioIQ Demo/
├── CLAUDE_CODE_CONTEXT.md       — build spec
├── README.md                     — this file
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx                   — 6-tab shell
    ├── index.css
    ├── data/
    │   ├── portfolioData.js      — 16 initiatives, 6 pillars, 6 stages, artifacts, deps, KPIs
    │   ├── decisionData.js       — RICE / Risk / TCO / Benefit + 4 scenarios + helpers
    │   ├── influenceFactors.js   — 10 non-financial factors per initiative
    │   ├── teamData.js           — 4 PM reports, coaching feed, automations
    │   └── responseMap.js        — 7 PortfolioCopilot Q&A with reasoning steps
    └── components/
        ├── Dashboard.jsx
        ├── DecisionEngine.jsx    — 7 sub-tab calculators + scenario compare
        ├── TeamCockpit.jsx       — people leadership + AI coaching
        ├── PortfolioCopilot.jsx
        ├── DataModel.jsx
        └── HowIBuilt.jsx
```

## Companion artifact

Pattern transfer evidence: [trustreply-demo.vercel.app](https://trustreply-demo.vercel.app) — same architectural pattern (registry + lifecycle states + AI agent + transparent reasoning + reuse engine), different domain (Trust Intelligence for Harvey AI vs. Portfolio Intelligence for Salesforce DET).

## Notes for the interview

- All data is mock. No real Salesforce systems connected. Be honest about this when asked.
- The prototype is a demo, not a production portfolio platform. The "What I Don't Know Yet" section in HowIBuilt is your shield.
- Round 1 (Judette, Manage Ambiguity): reference HowIBuilt + Decision Engine's Scenario Compare as STAR stories.
- Round 2 (Kyle, Drive Innovation): screen-share the Decision Engine and PortfolioCopilot — 2-3 min walkthrough.
- Round 3 (Lauren, Build Trust): reference Team Cockpit's AI Coaching Feed as evidence of stakeholder/people-leadership thinking.
