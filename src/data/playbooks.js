// Foundational playbooks every Pillar PM pulls from.
// Maps to JD #2: "Lead the creation and adoption of foundational playbooks and assets to ensure
// a seamless, consistent experience for all portfolio teams and stakeholders."
// Also satisfies Judette's literal 60-day milestone: "Establish documentation around taxonomy, process,
// and guidance for updated Portfolio Processes."

export const PLAYBOOKS = [
  {
    id: 'PB-01',
    name: 'Stage-Gate Decision Playbook',
    purpose: 'Standard criteria, approvers, and outputs for advancing an initiative G0 → G5',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'GA',          // GA | Pilot | Draft
    version: 'v1.4',
    lastUpdated: '2026-04-15',
    timeToUse: '20 min/gate',
    adoption: 88,           // % of pillars using this version
    jdLine: '#3 Establish comprehensive guardrails and stage-gate processes',
    when: 'Every time an initiative requests to advance to the next gate',
    steps: [
      'Pillar PM submits gate review request 5 business days ahead',
      'Stage-Gate Scorer (Decision Engine) auto-scores 4 dimensions',
      'Sr Mgr reviews any FAIL dimensions with named risks',
      'Approver signs (gate-specific): G1 = Pillar Lead; G2 = Sr Mgr; G3 = DET Director; G4 = CIO',
      'Outcome logged in audit trail; initiative advances or returns with action items'
    ],
    artifacts: ['Gate Review Request', 'Stage-Gate Scorer output', 'Approver signoff'],
    metrics: ['Gate cycle time (target <14d)', 'Approval rate (target 70-85%)']
  },
  {
    id: 'PB-02',
    name: 'Initiative Intake Playbook',
    purpose: 'Standard format for proposing a new initiative into the portfolio',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'GA',
    version: 'v2.1',
    lastUpdated: '2026-04-02',
    timeToUse: '4 hours (sponsor + PM)',
    adoption: 92,
    jdLine: '#5 Define and govern master taxonomy and metadata standards',
    when: 'Anyone proposing a net-new initiative',
    steps: [
      'Sponsor + PM fill the Intake Template (problem, hypothesis, value, ask)',
      'Sr Mgr triages within 5 business days — Accept, Defer, Decline with reason',
      'If Accept → assigned to a Pillar PM and stage = G0 Concept',
      'Quarterly portfolio review confirms or sunsets G0 initiatives'
    ],
    artifacts: ['Intake Template', 'Triage decision log', 'Pillar assignment'],
    metrics: ['Intake-to-triage cycle (target <5d)', 'Acceptance rate (insight signal, not target)']
  },
  {
    id: 'PB-03',
    name: 'Capacity Planning Playbook',
    purpose: 'How Pillar PMs declare FTE capacity per quarter and reconcile against initiatives',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'Pilot',
    version: 'v0.9',
    lastUpdated: '2026-04-22',
    timeToUse: '90 min/quarter',
    adoption: 50,
    jdLine: '#11 Anticipate dependencies, resource constraints; capacity planning across competing demands',
    when: 'Quarterly, 4 weeks before fiscal quarter starts',
    steps: [
      'Each Pillar PM declares FTE capacity (HC + contractor) for the upcoming quarter',
      'Initiative FTE asks aggregated by pillar via initiative_inventory.ftes_allocated',
      'Sr Mgr surfaces over-capacity pillars (>100% allocated) — proposes rebalance options',
      'Capacity Plan signed by each Pillar PM; published to capacity_snapshots',
      'Variance vs. plan reviewed monthly during portfolio review'
    ],
    artifacts: ['Capacity Declaration form', 'Rebalance proposal (if over-cap)', 'Signed Capacity Plan'],
    metrics: ['% pillars under 100% allocated (target 100%)', 'FTE forecast accuracy vs. actual (target ±5%)']
  },
  {
    id: 'PB-04',
    name: 'Risk Register Template',
    purpose: 'Standard format every initiative uses to log + track risks',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'GA',
    version: 'v1.2',
    lastUpdated: '2026-03-18',
    timeToUse: '30 min/refresh',
    adoption: 81,
    jdLine: '#4 Implement oversight mechanisms and audit trails for early risk detection',
    when: 'At G1 Plan, refreshed every 90 days through G4 Launch',
    steps: [
      'Identify risks across 4 categories: technical, capacity, compliance, market',
      'Score each: Probability (1–5) × Impact (1–5)',
      'Document mitigation owner + target date for any score ≥9',
      'Refresh every 90 days; expiration triggers automatic flag'
    ],
    artifacts: ['Risk Register (one per initiative)', 'Mitigation tracker'],
    metrics: ['% initiatives with current risk register (target 100%)', 'Risk closure rate (target 70% within 1 quarter)']
  },
  {
    id: 'PB-05',
    name: 'Quarterly Rebalance Playbook',
    purpose: 'How the portfolio is re-prioritised mid-year when conditions change',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'Draft',
    version: 'v0.3',
    lastUpdated: '2026-04-25',
    timeToUse: '2 days (Sr Mgr) + 60 min/Pillar PM',
    adoption: 0,
    jdLine: '#10 Support quarterly portfolio planning, prioritization, and rebalancing',
    when: 'Quarterly, weeks 10–12 of each fiscal quarter',
    steps: [
      'Sr Mgr prepares 3 candidate scenarios in Decision Engine (Status Quo, +10%, -10% baseline)',
      'Surface initiatives with declining RICE / rising risk / off-track status as candidates for action',
      'Pillar PMs review their pillars; propose specific deltas',
      'CFO + CIO review consolidated recommendation; approve or request iteration',
      'Decisions logged to audit trail; affected initiatives re-baselined'
    ],
    artifacts: ['Pre-read deck', '3 candidate scenarios', 'Decision log'],
    metrics: ['Rebalance cycle (target ≤3 weeks)', '% of decisions accepted by sponsor first review (target 80%)']
  },
  {
    id: 'PB-06',
    name: 'Portfolio Review Playbook',
    purpose: 'Standard agenda + format for the monthly DET portfolio review',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'GA',
    version: 'v1.0',
    lastUpdated: '2026-02-28',
    timeToUse: '90 min/month',
    adoption: 100,
    jdLine: '#8 Drive organizational excellence through regular evaluations of portfolio performance',
    when: 'Monthly, first Wednesday',
    steps: [
      'Pre-read sent 48h ahead: Dashboard snapshot + 3 decisions needed',
      'Standing agenda: KPIs (10m), at-risk drilldown (20m), 3 decisions (45m), Pillar PM open mic (15m)',
      'Decisions captured live in audit trail with owner + timeline',
      'Action items distributed within 4 hours of meeting end'
    ],
    artifacts: ['Pre-read deck (auto-generated)', 'Decision log', 'Action item tracker'],
    metrics: ['Decisions made per review (target ≥3)', 'Action item closure rate (target 80% by next review)']
  },
  {
    id: 'PB-07',
    name: 'Sunset / Kill Playbook',
    purpose: 'How to retire an initiative without losing the institutional learning',
    owner: 'Sr Mgr Strategic Portfolio Mgmt',
    status: 'Pilot',
    version: 'v0.7',
    lastUpdated: '2026-03-30',
    timeToUse: '4 hours (one-time per initiative)',
    adoption: 33,
    jdLine: '#9 Data-driven audits to provide strategic feedback to leadership',
    when: 'When an initiative scores Kill in RICE or fails consecutive gate reviews',
    steps: [
      'Sr Mgr proposes sunset; sponsor confirms within 10 business days',
      'Pillar PM writes 1-page retrospective: hypothesis, what we learned, would we do again?',
      'Capacity + budget released; reallocated via Quarterly Rebalance',
      'Retrospective archived; tagged for future similar proposals'
    ],
    artifacts: ['Sunset proposal', '1-page retrospective', 'Reallocation plan'],
    metrics: ['% sunset decisions completed within 30 days (target 90%)', 'Retrospective completion rate (target 100%)']
  }
];

export const PLAYBOOK_STATUS_META = {
  GA:    { label: 'GA',    pill: 'pill-green',  desc: 'In production use across all pillars' },
  Pilot: { label: 'Pilot', pill: 'pill-blue',   desc: 'Pilot phase with 1–2 pillars' },
  Draft: { label: 'Draft', pill: 'pill-yellow', desc: 'Drafted, not yet adopted' }
};

// Adoption funnel — what % of pillars use each playbook
export function adoptionTier(pct) {
  if (pct >= 80) return { label: 'Mature',     color: 'sgreen' };
  if (pct >= 50) return { label: 'Adopting',   color: 'sfblue' };
  if (pct >= 25) return { label: 'Early',      color: 'syellow' };
  return                { label: 'Not started', color: 'sred' };
}

// ============================================================================
// PROCESS HEALTH METRICS — JD #6 + #9
// ============================================================================

export const PROCESS_HEALTH = {
  cycleTimeByGate: [
    { gate: 'G0', name: 'Concept',  median: 18, target: 21, p90: 35 },
    { gate: 'G1', name: 'Plan',     median: 32, target: 30, p90: 58 },
    { gate: 'G2', name: 'Build',    median: 94, target: 90, p90: 168 },
    { gate: 'G3', name: 'Validate', median: 22, target: 21, p90: 42 },
    { gate: 'G4', name: 'Launch',   median: 14, target: 14, p90: 28 },
    { gate: 'G5', name: 'Sustain',  median: null, target: null, p90: null }  // continuous
  ],
  reworkRate: [
    { artifact: 'PRD',                rate: 38, target: 20, trend: 'down', trendPct: -8 },
    { artifact: 'Capacity Plan',      rate: 52, target: 25, trend: 'flat', trendPct: 1 },
    { artifact: 'Risk Register',      rate: 22, target: 15, trend: 'down', trendPct: -12 },
    { artifact: 'Architecture Review',rate: 18, target: 15, trend: 'down', trendPct: -3 },
    { artifact: 'Launch Readiness',   rate: 12, target: 10, trend: 'down', trendPct: -4 }
  ],
  pillarSatisfaction: [   // Pillar PM Net Promoter score on portfolio process
    { pillar: 'Customer Experience Tech',  nps: 22, change: '+8',  responses: 6 },
    { pillar: 'Employee Productivity',      nps: -14, change: '-2', responses: 5 },
    { pillar: 'Data & AI Platform',         nps: 38, change: '+12', responses: 7 },
    { pillar: 'Trust & Security',           nps: 18, change: '+4',  responses: 5 },
    { pillar: 'Finance & Operations Tech',  nps: -22, change: '-5', responses: 6 },
    { pillar: 'Field Engagement',           nps: 8,  change: '+2',  responses: 4 }
  ],
  complianceTrend: [   // last 6 months % of artifacts current
    { month: '2025-11', pct: 71 }, { month: '2025-12', pct: 74 },
    { month: '2026-01', pct: 79 }, { month: '2026-02', pct: 83 },
    { month: '2026-03', pct: 86 }, { month: '2026-04', pct: 88 }
  ],
  antiPatterns: [
    {
      id: 'AP-01',
      pattern: '3 initiatives entered G2 Build without a signed Capacity Plan in the last 60 days',
      severity: 'high',
      affectedInitiatives: ['INI-112', 'INI-110', 'INI-104'],
      rootCauseHypothesis: 'Capacity Planning Playbook is in Pilot (50% adoption) — Finance & Ops + Field Engagement haven\'t adopted yet.',
      recommendation: 'Move Capacity Planning Playbook to GA after one more pilot quarter; require it as a G2 entry artifact.'
    },
    {
      id: 'AP-02',
      pattern: 'PRD rework rate is 38% — nearly 2× target. Two pillars account for 80% of the rework.',
      severity: 'medium',
      affectedInitiatives: ['INI-104', 'INI-112', 'INI-115', 'INI-110'],
      rootCauseHypothesis: 'PRD template is too high-bar for early-stage initiatives; Pillar PMs draft-then-rewrite when scope shifts at G1.',
      recommendation: 'Split PRD into G1 (lightweight) + G2 (full) versions. Ship as Intake Playbook v3.0 by Q3.'
    },
    {
      id: 'AP-03',
      pattern: 'Finance & Ops + Employee Productivity have negative NPS on portfolio process; both have over-capacity allocations.',
      severity: 'high',
      affectedInitiatives: ['INI-102', 'INI-104', 'INI-112'],
      rootCauseHypothesis: 'Pillar PMs feel process burden without proportional value (Sr Mgr team is new). Negative NPS correlates with stress, not with bad process.',
      recommendation: 'Run a dedicated friction-reduction sprint with these two pillars in Q3. Co-create one process simplification per pillar.'
    },
    {
      id: 'AP-04',
      pattern: 'AI Governance Framework (INI-115) PRD has been "needs_review" for 43 days — gates Agentforce launch.',
      severity: 'critical',
      affectedInitiatives: ['INI-115', 'INI-101'],
      rootCauseHypothesis: 'No clear escalation when an artifact stays in needs_review > 21 days.',
      recommendation: 'Add automated 21-day escalation to sponsor + Sr Mgr. Wire as workflow automation in Team Cockpit.'
    }
  ]
};
