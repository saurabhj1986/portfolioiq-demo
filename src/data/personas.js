// Persona definitions — RBAC for the demo.
// In production, persona + pillar would be derived from the identity provider
// (Okta/Entra) at login. Here, we let the viewer switch manually to demonstrate
// how the same workspace adapts to different roles.
//
// Each persona defines:
//   hideTabs              — top-level tabs that disappear
//   pillarFilter          — null = all; or a pillar id (Pillar PM scope)
//   dashboardHideSections — sections that disappear from the Dashboard tab
//   decisionsHideSubs     — sub-tabs hidden in Decisions
//   dataHideSubs          — sub-tabs hidden in Source of Truth
//   focusSummary          — one-line description of what they see (for the RBAC banner)

export const PERSONAS = [
  {
    id: 'sr-manager',
    role: 'Sr Manager',
    label: 'Sr Manager · Strategic Portfolio Mgmt',
    desc: 'Default — full operating view. All initiatives, all calculators, all team coaching.',
    pillarFilter: null,
    pillarLabel: null,
    hideTabs: [],
    dashboardHideSections: [],
    decisionsHideSubs: [],
    dataHideSubs: [],
    readOnly: false,
    accent: 'text-sflight',
    focusSummary: 'Full operating view'
  },
  {
    id: 'director',
    role: 'Director',
    label: 'Director · Business Process',
    desc: 'Strategic lens — recommendations, trade-offs, exposure. Operational details hidden.',
    pillarFilter: null,
    pillarLabel: null,
    hideTabs: ['operate'],
    // Dashboard: hide tactical sections; keep decisions + cross-pillar + KPIs
    dashboardHideSections: ['stage-gate', 'pillar-grid', 'tracker'],
    // Decisions: keep strategic engines; hide tactical calculators
    decisionsHideSubs: ['rice', 'risk', 'gate', 'factors', 'health'],
    // Source of Truth: hide audit-trail (too operational)
    dataHideSubs: ['audit'],
    readOnly: false,
    accent: 'text-sgreen',
    focusSummary: 'Strategic summaries · 5 tactical Decisions sub-tabs hidden · 3 tactical Dashboard sections hidden · Audit Trail hidden'
  },
  {
    id: 'pillar-pm-dap',
    role: 'Pillar PM',
    label: 'Pillar PM · Data & AI Platform',
    desc: 'Scoped to Data & AI Platform initiatives only. Cross-pillar context shown but not editable.',
    pillarFilter: 'dap',
    pillarLabel: 'Data & AI Platform',
    hideTabs: ['operate'],
    dashboardHideSections: ['pillar-grid'],
    // Decisions: hide portfolio-level engines; keep tactical calculators for their initiatives
    decisionsHideSubs: ['investment', 'capital', 'compare', 'kpi-studio'],
    dataHideSubs: [],
    readOnly: false,
    accent: 'text-syellow',
    focusSummary: 'Scoped to dap pillar · 4 portfolio-level Decisions sub-tabs hidden · Pillar grid hidden (this is your pillar)'
  },
  {
    id: 'pillar-pm-ts',
    role: 'Pillar PM',
    label: 'Pillar PM · Trust & Security',
    desc: 'Scoped to Trust & Security initiatives only. Cross-pillar context shown but not editable.',
    pillarFilter: 'ts',
    pillarLabel: 'Trust & Security',
    hideTabs: ['operate'],
    dashboardHideSections: ['pillar-grid'],
    decisionsHideSubs: ['investment', 'capital', 'compare', 'kpi-studio'],
    dataHideSubs: [],
    readOnly: false,
    accent: 'text-syellow',
    focusSummary: 'Scoped to ts pillar · 4 portfolio-level Decisions sub-tabs hidden · Pillar grid hidden'
  },
  {
    id: 'pillar-pm-fe',
    role: 'Pillar PM',
    label: 'Pillar PM · Field Engagement',
    desc: 'Scoped to Field Engagement initiatives only.',
    pillarFilter: 'fe',
    pillarLabel: 'Field Engagement',
    hideTabs: ['operate'],
    dashboardHideSections: ['pillar-grid'],
    decisionsHideSubs: ['investment', 'capital', 'compare', 'kpi-studio'],
    dataHideSubs: [],
    readOnly: false,
    accent: 'text-syellow',
    focusSummary: 'Scoped to fe pillar · 4 portfolio-level Decisions sub-tabs hidden'
  },
  {
    id: 'pillar-pm-etr',
    role: 'Pillar PM',
    label: 'Pillar PM · Emerging Tech & R&D',
    desc: 'Scoped to Emerging Tech & R&D initiatives — agentic tooling, time tracking solidification, in-house AI workbench.',
    pillarFilter: 'etr',
    pillarLabel: 'Emerging Tech & R&D',
    hideTabs: ['operate'],
    dashboardHideSections: ['pillar-grid'],
    decisionsHideSubs: ['investment', 'capital', 'compare', 'kpi-studio'],
    dataHideSubs: [],
    readOnly: false,
    accent: 'text-syellow',
    focusSummary: 'Scoped to etr pillar (Joe & Zarillo direct sponsorship) · 4 portfolio-level Decisions sub-tabs hidden'
  },
  {
    id: 'sponsor',
    role: 'Sponsor',
    label: 'Executive Sponsor',
    desc: 'Read-only summary view. Decisions needed + Value at Risk + key KPIs only — no operational depth.',
    pillarFilter: null,
    pillarLabel: null,
    hideTabs: ['operate', 'decisions', 'data'],
    // Sponsor sees only: Hero · Decisions needed · 6 KPIs. Everything else hidden.
    dashboardHideSections: ['cross-org', 'stage-gate', 'pillar-grid', 'tracker'],
    decisionsHideSubs: [],
    dataHideSubs: [],
    readOnly: true,
    accent: 'text-sred',
    focusSummary: 'Read-only · Decisions Needed + KPIs only · 4 Dashboard sections hidden · 3 tabs hidden'
  }
];

export function getPersona(id) {
  return PERSONAS.find(p => p.id === id) || PERSONAS[0];
}
