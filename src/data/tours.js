// Tour definitions — shared by Dashboard's Welcome card and the persistent TourBar.
// Each step has an optional `sub` field for tabs that have sub-tabs.

export const TOURS = {
  '20s': {
    label: '20-second scan',
    description: 'The bare minimum understanding. 3 stops.',
    steps: [
      { tab: 'dashboard',                       title: 'The 5 KPIs',           lookFor: 'Health · Capital · Compliance · Cycle · Strategic Alignment. Hover any tile for what + target.' },
      { tab: 'decisions', sub: 'kpi-studio',    title: 'The recommendations',  lookFor: 'Every initiative bucketed: Accelerate / Continue / Watch / Restructure / Sunset.' },
      { tab: 'operate',   sub: 'workbench',     title: 'The output',           lookFor: 'How portfolio data becomes exec messaging — 8 templates, AI auto-draft.' }
    ]
  },
  '2m': {
    label: '2-minute narrative',
    description: 'The story of one initiative across 5 stops.',
    steps: [
      { tab: 'dashboard',                       title: 'Get the shape',                  lookFor: '16 initiatives, 6 pillars, $30M deployed. The Stage-Gate Pipeline shows where capital concentrates.' },
      { tab: 'journey',                         title: 'Press Play',                      lookFor: 'Watch Agentforce move G0→G5. Risk peaks at G2 Build then falls — by design.' },
      { tab: 'decisions', sub: 'capital',       title: 'Drag the budget slider',          lookFor: 'Capital Optimizer recomputes the optimal mix in real-time. Pin Trust initiatives to protect them.' },
      { tab: 'decisions', sub: 'kpi-studio',    title: 'Switch the profile',              lookFor: 'Pick "Margin-First" → see CPQ shift to Sunset. Pick "Innovation-First" → see Customer 360 Voice rise.' },
      { tab: 'operate',   sub: 'workbench',     title: 'Open a template',                 lookFor: 'Click Compose on "Monthly Exec Update" — 5 sections, AI auto-draft, distribution list ready.' }
    ]
  },
  '5m': {
    label: '5-minute deep dive',
    description: 'Every tab with one specific thing to notice.',
    steps: [
      { tab: 'dashboard',                       title: 'KPIs as governance signals',      lookFor: 'Stage-Gate Compliance at 88% — improving. Trend on Process Health shows +17pts in 6 months.' },
      { tab: 'journey',                         title: 'Cross-pillar ripple',              lookFor: 'At G2 Build, Trust & Security activates (AI Governance dependency). At G4 Launch, dependencies unblock.' },
      { tab: 'decisions', sub: 'health',        title: 'Process Health anti-patterns',     lookFor: '4 detected anti-patterns with recommendations — this is "data-driven audits to provide strategic feedback."' },
      { tab: 'decisions', sub: 'kpi-studio',    title: 'Per-initiative drill-down',         lookFor: 'Click any initiative row → see auto-rationale + per-KPI breakdown showing what dragged the score down.' },
      { tab: 'operate',   sub: 'playbooks',     title: 'Adoption gradient',                 lookFor: '4 playbooks at GA, 2 in Pilot, 1 in Draft. Adoption tracked per pillar.' },
      { tab: 'operate',   sub: 'team',          title: 'AI Coaching Feed',                  lookFor: 'Auto-detected: "Renata 1:1 overdue 19 days." "Marcus on leave June 17 — propose Aisha as backfill."' },
      { tab: 'operate',   sub: 'workbench',     title: 'Workbench composer',                lookFor: 'AI auto-draft button fills sections from PortfolioIQ data. Completeness % bar updates live.' },
      { tab: 'data',      sub: 'metrics',       title: 'Source of Truth — Metric Catalog', lookFor: '17 metrics with canonical formulas. Click any to see formula, owner, source system, refresh cadence.' }
    ]
  }
};
