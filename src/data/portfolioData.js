// Mock data — no real Salesforce systems connected.
// All names, budgets, and statuses are fabricated for demo purposes.
//
// CONTEXT: This represents the Digital Enterprise Technology (DET) portfolio under
// Joe & Zarillo's leadership. The full org runs ~250 initiatives across 7 pillars;
// 16 illustrative initiatives are loaded here to keep the demo legible without
// losing the shape of the real portfolio.

export const PILLARS = [
  { id: 'cxt',  name: 'Customer Experience Tech', lead: 'Priya Sundaram',   capacityFte: 38, allocatedFte: 36 },
  { id: 'ept',  name: 'Employee Productivity',    lead: 'Marcus Chen',      capacityFte: 28, allocatedFte: 31 },
  { id: 'dap',  name: 'Data & AI Platform',       lead: 'Jordan Reilly',    capacityFte: 42, allocatedFte: 40 },
  { id: 'ts',   name: 'Trust & Security',         lead: 'Aisha Patel',      capacityFte: 22, allocatedFte: 19 },
  { id: 'fot',  name: 'Finance & Operations Tech',lead: 'David Lindqvist',  capacityFte: 30, allocatedFte: 33 },
  { id: 'fe',   name: 'Field Engagement',         lead: 'Renata Oliveira',  capacityFte: 26, allocatedFte: 24 },
  { id: 'etr',  name: 'Emerging Tech & R&D',      lead: 'Hiro Tanaka',      capacityFte: 18, allocatedFte: 16 }
];

// Reflects Judith's "renovation phase" framing — DET org charter was refocused
// 6 weeks ago toward a data-driven approach. These 4 data pillars are the
// foundation we're rebuilding underneath the portfolio.
export const DATA_PILLARS = [
  {
    id: 'planning',
    name: 'Planning data',
    state: 'in_flight',
    blurb: 'Annual + quarterly planning cycles, intake taxonomy, OKR linkage. Single source for what we said we\'d do.',
    owner: 'Sr Mgr · Strategic Portfolio Mgmt',
    nextMilestone: 'Charter v2 published — Day 30'
  },
  {
    id: 'portfolio',
    name: 'Portfolio data',
    state: 'in_flight',
    blurb: '~250 initiatives across 7 pillars. Status, stage, sponsor, OKR mapping, dependencies. The thing you\'re looking at right now.',
    owner: 'Sr Mgr · Strategic Portfolio Mgmt',
    nextMilestone: 'Schema v2 in Data Cloud — Day 45'
  },
  {
    id: 'capacity',
    name: 'Capacity planning',
    state: 'rebuild',
    blurb: 'FTE supply vs demand by pillar. Today: spreadsheets + Anaplan + tribal knowledge. Target: live in Workday + Data Cloud.',
    owner: 'Sr Mgr + Director',
    nextMilestone: 'Re-architecture proposal — Day 60'
  },
  {
    id: 'time',
    name: 'Time tracking',
    state: 'solidify',
    blurb: 'Already set up in DET — needs solidification and consistent adoption. Powers capacity truth and per-initiative cost.',
    owner: 'Sr Mgr · Strategic Portfolio Mgmt',
    nextMilestone: 'Adoption ≥ 90% across 7 pillars — Day 60'
  }
];

// 60-day plan reflecting Judith's stated priorities (the renovation work).
// Used by the Guide and About tabs to ground the demo in the real role.
export const SIXTY_DAY_PLAN = [
  {
    horizon: 'Days 0–15',
    headline: 'Listen, observe, document the renovation',
    items: [
      'Shadow each of the 7 Pillar Portfolio Managers · 1 hr each',
      'Read the 6-week-old charter refresh + every artifact in Quip',
      'Map the as-is: which data lives where, who owns it, refresh cadence',
      'No new processes. No new tools. Just observe and document.'
    ]
  },
  {
    horizon: 'Days 15–30',
    headline: 'Backbone for processes',
    items: [
      'Documentation standard: every process has a 1-pager (Process Excellence model)',
      'Stage-gate definitions standardized across all 7 pillars',
      'GUS becomes the single intake — work item → portfolio entry, automatic',
      'First version of charter v2 shared with Joe & Zarillo for input'
    ]
  },
  {
    horizon: 'Days 30–45',
    headline: 'Data governance re-architecture',
    items: [
      'Data Cloud schema for portfolio + capacity + planning data',
      'Time tracking adoption push — close the gaps on the 7 pillars',
      'Glossary: 33+ canonical terms agreed across DET',
      'Audit trail live for portfolio mutations'
    ]
  },
  {
    horizon: 'Days 45–60',
    headline: 'Robust tooling — built in-house with AI',
    items: [
      'PortfolioIQ as the operating workspace (this prototype, but real)',
      '12 niche agents on Agentforce for the routine governance loops',
      'Tableau-fed leadership dashboards reading from one schema',
      'Hire: leader for agentic strategy and tooling — JD drafted'
    ]
  }
];

export const STAGES = [
  { id: 'G0', name: 'Concept',  desc: 'Ideation & business case' },
  { id: 'G1', name: 'Plan',     desc: 'PRD, architecture, capacity locked' },
  { id: 'G2', name: 'Build',    desc: 'In active development' },
  { id: 'G3', name: 'Validate', desc: 'Pilot, UAT, security review' },
  { id: 'G4', name: 'Launch',   desc: 'Rollout & adoption' },
  { id: 'G5', name: 'Sustain',  desc: 'Live, monitored, value tracked' }
];

export const STATUS_META = {
  on_track:    { label: 'On Track',    pill: 'pill-green'  },
  at_risk:     { label: 'At Risk',     pill: 'pill-yellow' },
  off_track:   { label: 'Off Track',   pill: 'pill-red'    },
  in_progress: { label: 'In Progress', pill: 'pill-blue'   },
  complete:    { label: 'Complete',    pill: 'pill-gray'   }
};

export const INITIATIVES = [
  { id: 'INI-101', name: 'Agentforce Internal Rollout',     pillar: 'dap', stage: 'G2', status: 'on_track',  budget: 2400000, spent: 1080000, fte: 9, sponsor: 'Srini K. (CIO)',   pm: 'Jordan Reilly',   okrs: ['V25-Agentforce', 'V25-Employee-AI'], lastReviewed: '2026-04-21', target: '2026-09-30' },
  { id: 'INI-102', name: 'Workday HRIS Migration',           pillar: 'ept', stage: 'G2', status: 'off_track', budget: 3100000, spent: 2640000, fte: 12, sponsor: 'Nina Burke (CHRO)', pm: 'Marcus Chen',     okrs: ['V25-Margin'], lastReviewed: '2026-04-12', target: '2026-07-15' },
  { id: 'INI-103', name: 'Trust Center 2.0',                pillar: 'ts',  stage: 'G4', status: 'complete',  budget: 720000,  spent: 685000,  fte: 4, sponsor: 'Lena Wu (CTrO)',   pm: 'Aisha Patel',     okrs: ['V25-Trust', 'V25-Customer-360'], lastReviewed: '2026-04-25', target: '2026-03-30' },
  { id: 'INI-104', name: 'Anaplan Capital Planning Migration',pillar: 'fot',stage: 'G1', status: 'at_risk',   budget: 1800000, spent: 220000,  fte: 6, sponsor: 'Ravi Ahuja (CFO)', pm: 'David Lindqvist', okrs: ['V25-Margin'], lastReviewed: '2026-03-30', target: '2026-12-31' },
  { id: 'INI-105', name: 'Slack Sales Elevate',             pillar: 'fe',  stage: 'G2', status: 'on_track',  budget: 900000,  spent: 410000,  fte: 5, sponsor: 'Tom Harlow (CRO)', pm: 'Renata Oliveira', okrs: ['V25-Customer-360'], lastReviewed: '2026-04-22', target: '2026-08-31' },
  { id: 'INI-106', name: 'Data Cloud for HR Analytics',     pillar: 'ept', stage: 'G2', status: 'on_track',  budget: 1500000, spent: 720000,  fte: 7, sponsor: 'Nina Burke (CHRO)', pm: 'Marcus Chen',    okrs: ['V25-Employee-AI'], lastReviewed: '2026-04-19', target: '2026-10-15' },
  { id: 'INI-107', name: 'Privacy Vault & DSAR Automation', pillar: 'ts',  stage: 'G1', status: 'on_track',  budget: 1300000, spent: 290000,  fte: 5, sponsor: 'Lena Wu (CTrO)',   pm: 'Aisha Patel',     okrs: ['V25-Trust'], lastReviewed: '2026-04-20', target: '2026-11-30' },
  { id: 'INI-108', name: 'Customer 360 Voice (Genie+)',     pillar: 'cxt', stage: 'G0', status: 'on_track',  budget: 1200000, spent: 80000,   fte: 3, sponsor: 'Srini K. (CIO)',   pm: 'Priya Sundaram',  okrs: ['V25-Customer-360', 'V25-Agentforce'], lastReviewed: '2026-04-23', target: '2027-02-28' },
  { id: 'INI-109', name: 'Mulesoft API Hub Consolidation',  pillar: 'dap', stage: 'G1', status: 'on_track',  budget: 1100000, spent: 320000,  fte: 6, sponsor: 'Srini K. (CIO)',   pm: 'Jordan Reilly',   okrs: ['V25-Margin'], lastReviewed: '2026-04-15', target: '2026-12-15' },
  { id: 'INI-110', name: 'CPQ Modernization',                pillar: 'fe',  stage: 'G2', status: 'off_track', budget: 2700000, spent: 2100000, fte: 11, sponsor: 'Tom Harlow (CRO)', pm: 'Renata Oliveira', okrs: ['V25-Customer-360'], lastReviewed: '2026-03-12', target: '2026-06-30' },
  { id: 'INI-111', name: 'Tableau Embedded for Exec Dashboards', pillar: 'dap', stage: 'G4', status: 'complete', budget: 640000, spent: 612000, fte: 3, sponsor: 'Ravi Ahuja (CFO)', pm: 'Jordan Reilly', okrs: ['V25-Margin'], lastReviewed: '2026-04-26', target: '2026-04-15' },
  { id: 'INI-112', name: 'ServiceNow Consolidation',         pillar: 'fot', stage: 'G1', status: 'at_risk',   budget: 4200000, spent: 480000,  fte: 14, sponsor: 'Ravi Ahuja (CFO)', pm: 'David Lindqvist', okrs: ['V25-Margin'], lastReviewed: '2026-03-25', target: '2027-03-31' },
  { id: 'INI-113', name: 'Marketing Cloud Personalization',  pillar: 'cxt', stage: 'G2', status: 'on_track',  budget: 1900000, spent: 870000,  fte: 8, sponsor: 'Sarah Holt (CMO)', pm: 'Priya Sundaram',  okrs: ['V25-Customer-360'], lastReviewed: '2026-04-24', target: '2026-09-30' },
  { id: 'INI-114', name: 'Slack Huddles AI Summaries',       pillar: 'ept', stage: 'G2', status: 'on_track',  budget: 480000,  spent: 220000,  fte: 3, sponsor: 'Nina Burke (CHRO)', pm: 'Marcus Chen',    okrs: ['V25-Employee-AI', 'V25-Agentforce'], lastReviewed: '2026-04-18', target: '2026-08-15' },
  { id: 'INI-115', name: 'AI Governance Framework (CC-18)',  pillar: 'ts',  stage: 'G1', status: 'at_risk',   budget: 850000,  spent: 165000,  fte: 4, sponsor: 'Lena Wu (CTrO)',   pm: 'Aisha Patel',     okrs: ['V25-Trust', 'V25-Agentforce'], lastReviewed: '2026-03-15', target: '2026-10-31' },
  { id: 'INI-116', name: 'Data Lakehouse on Snowflake',      pillar: 'dap', stage: 'G2', status: 'on_track',  budget: 5200000, spent: 2300000, fte: 16, sponsor: 'Srini K. (CIO)',  pm: 'Jordan Reilly',   okrs: ['V25-Margin', 'V25-Agentforce'], lastReviewed: '2026-04-22', target: '2026-12-31' },
  { id: 'INI-117', name: 'Agentic Tooling Strategy POC',     pillar: 'etr', stage: 'G1', status: 'on_track',  budget: 680000,  spent: 110000,  fte: 4, sponsor: 'Joe & Zarillo',    pm: 'Hiro Tanaka',     okrs: ['V25-Agentforce', 'V25-Employee-AI'], lastReviewed: '2026-04-26', target: '2026-09-15' },
  { id: 'INI-118', name: 'Time Tracking Solidification (DET-wide)', pillar: 'etr', stage: 'G2', status: 'at_risk', budget: 320000, spent: 145000, fte: 3, sponsor: 'Joe & Zarillo', pm: 'Hiro Tanaka', okrs: ['V25-Margin', 'V25-Employee-AI'], lastReviewed: '2026-04-24', target: '2026-07-01' },
  { id: 'INI-119', name: 'Emerging Tech Scout Lab',          pillar: 'etr', stage: 'G0', status: 'on_track',  budget: 450000,  spent: 30000,   fte: 2, sponsor: 'Joe & Zarillo',    pm: 'Hiro Tanaka',     okrs: ['V25-Agentforce'], lastReviewed: '2026-04-20', target: '2026-12-31' },
  { id: 'INI-120', name: 'In-house AI Coding Workbench',     pillar: 'etr', stage: 'G2', status: 'on_track',  budget: 540000,  spent: 240000,  fte: 4, sponsor: 'Joe & Zarillo',    pm: 'Hiro Tanaka',     okrs: ['V25-Margin', 'V25-Agentforce'], lastReviewed: '2026-04-25', target: '2026-08-30' }
];

export const STAGE_GATE_ARTIFACTS = [
  { id: 'ART-001', initiative: 'INI-101', gate: 'G2', type: 'Architecture Review',  status: 'approved',     approver: 'Aarti Vyas',     collected: '2026-03-12', expires: '2026-09-12', source: 'Confluence' },
  { id: 'ART-002', initiative: 'INI-101', gate: 'G2', type: 'Capacity Plan',        status: 'approved',     approver: 'Marcus Chen',    collected: '2026-03-15', expires: '2026-06-15', source: 'Anaplan' },
  { id: 'ART-003', initiative: 'INI-102', gate: 'G2', type: 'Risk Register',        status: 'needs_review', approver: 'David Lindqvist',collected: '2026-01-20', expires: '2026-04-20', source: 'ServiceNow' },
  { id: 'ART-004', initiative: 'INI-104', gate: 'G1', type: 'PRD',                  status: 'needs_review', approver: 'Ravi Ahuja',     collected: '2026-02-04', expires: '2026-05-04', source: 'Quip' },
  { id: 'ART-005', initiative: 'INI-110', gate: 'G2', type: 'Risk Register',        status: 'expired',      approver: 'Renata Oliveira',collected: '2025-12-05', expires: '2026-03-05', source: 'ServiceNow' },
  { id: 'ART-006', initiative: 'INI-112', gate: 'G1', type: 'Capacity Plan',        status: 'missing',      approver: '—',              collected: '—',          expires: '—',          source: 'Anaplan' },
  { id: 'ART-007', initiative: 'INI-115', gate: 'G1', type: 'PRD',                  status: 'needs_review', approver: 'Aisha Patel',    collected: '2026-02-15', expires: '2026-05-15', source: 'Quip' },
  { id: 'ART-008', initiative: 'INI-116', gate: 'G2', type: 'Architecture Review',  status: 'approved',     approver: 'Aarti Vyas',     collected: '2026-04-02', expires: '2026-10-02', source: 'Confluence' },
  { id: 'ART-009', initiative: 'INI-103', gate: 'G4', type: 'Launch Readiness',     status: 'approved',     approver: 'Lena Wu',        collected: '2026-03-25', expires: '2026-09-25', source: 'GUS' },
  { id: 'ART-010', initiative: 'INI-113', gate: 'G2', type: 'PRD',                  status: 'approved',     approver: 'Sarah Holt',     collected: '2026-03-30', expires: '2026-09-30', source: 'Quip' }
];

export const DEPENDENCIES = [
  { id: 'DEP-01', upstream: 'INI-116', downstream: 'INI-101', type: 'blocks',           risk: 'high',   note: 'Agentforce internal rollout depends on Lakehouse for grounding data.' },
  { id: 'DEP-02', upstream: 'INI-116', downstream: 'INI-106', type: 'blocks',           risk: 'high',   note: 'Data Cloud for HR cannot productionize without Lakehouse pipeline.' },
  { id: 'DEP-03', upstream: 'INI-115', downstream: 'INI-101', type: 'gates',            risk: 'high',   note: 'Agentforce launch gated on AI Governance Framework approval.' },
  { id: 'DEP-04', upstream: 'INI-109', downstream: 'INI-113', type: 'informs',          risk: 'medium', note: 'Marketing Cloud Personalization integrates via Mulesoft hub.' },
  { id: 'DEP-05', upstream: 'INI-102', downstream: 'INI-106', type: 'shares_resources', risk: 'medium', note: 'Workday migration and HR Data Cloud share 4 FTEs in Q3.' },
  { id: 'DEP-06', upstream: 'INI-110', downstream: 'INI-105', type: 'blocks',           risk: 'medium', note: 'Slack Sales Elevate phase 2 needs CPQ APIs to stabilize.' },
  { id: 'DEP-07', upstream: 'INI-104', downstream: 'INI-112', type: 'informs',          risk: 'low',    note: 'Anaplan capital planning informs ServiceNow demand intake redesign.' }
];

export const KPI_DEFINITIONS = [
  {
    id: 'health',
    label: 'Portfolio Health',
    target: '≥ 80%',
    jdLink: 'Define and manage key portfolio performance indicators (e.g., value realization, risk exposure)',
    tooltip: '% of active initiatives in on_track status. Initiatives in at_risk or off_track count against the score. Target: ≥80%. Source: live initiative_inventory.status field.'
  },
  {
    id: 'capital',
    label: 'Capital Utilization',
    target: '70–90%',
    jdLink: 'Expertise managing multimillion-dollar budget lifecycles and capital allocation',
    tooltip: '$ spent / $ allocated across active initiatives. Below 70% mid-year suggests under-investment; above 90% suggests overrun risk. Source: initiative_inventory.budget_spent / budget_allocated.'
  },
  {
    id: 'compliance',
    label: 'Stage-Gate Compliance',
    target: '100%',
    jdLink: 'Establish comprehensive guardrails and stage-gate processes to maintain portfolio integrity',
    tooltip: '% of active initiatives whose required stage-gate artifacts (PRD, Architecture Review, Capacity Plan, Risk Register) are approved and not expired. Target: 100%. Source: stage_gate_artifacts.status.'
  },
  {
    id: 'cycle',
    label: 'Avg Time-in-Stage',
    target: '< 60 days',
    jdLink: 'Maintain a forward-looking view of the portfolio to anticipate dependencies and resource constraints',
    tooltip: 'Average days an initiative has been in its current gate. Higher values flag stalled initiatives. Target: <60 days. Source: derived from stage_history audit log.'
  },
  {
    id: 'alignment',
    label: 'Strategic Alignment',
    target: '≥ 90%',
    jdLink: 'Architect and evangelize a unified framework for initiative data management',
    tooltip: '% of active initiatives mapped to one or more V25 OKRs. Unmapped initiatives surface as candidates for re-scoping or sunset. Target: ≥90%. Source: initiative_inventory.okr_mapping.'
  }
];

export function fmtMoney(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function pillarById(id)      { return PILLARS.find(p => p.id === id); }
export function initiativeById(id)  { return INITIATIVES.find(i => i.id === id); }
export function stageById(id)       { return STAGES.find(s => s.id === id); }
