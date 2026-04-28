// Executive Attention data — what a leader needs to see in the first 20 seconds.
// Stack-ranked by status × OKR criticality × days red.

export const RED_INITIATIVES = [
  {
    id: 'INI-110',
    name: 'CPQ Modernization',
    pillar: 'Field Engagement',
    status: 'off_track',
    daysRed: 47,
    spendVsPlan: '78% spent · 50% built',
    okrAlignment: 'V25-Customer-360',
    okrCriticality: 'High',
    okrCritColor: 'syellow',
    accountable: 'Renata Oliveira',
    accountableRole: 'Pillar PM',
    sponsor: 'Tom Harlow',
    sponsorRole: 'CRO',
    rootCause: 'Risk Register expired 2026-03-05; over-FTE; scope grew without re-baseline.',
    pathToGreen: 'MVP scope cut signed by CRO; 2 contractors hired; new launch date confirmed.',
    decisionBy: '2026-05-02',
    nextStep: 'Sponsor escalation meeting on 5/2 to choose: scope-cut OR re-baseline.'
  },
  {
    id: 'INI-115',
    name: 'AI Governance Framework',
    pillar: 'Trust & Security',
    status: 'at_risk',
    daysRed: 43,
    spendVsPlan: '19% spent · 35% built',
    okrAlignment: 'V25-Agentforce, V25-Trust',
    okrCriticality: 'CRITICAL — gates Agentforce launch',
    okrCritColor: 'sred',
    accountable: 'Aisha Patel',
    accountableRole: 'Pillar PM',
    sponsor: 'Lena Wu',
    sponsorRole: 'CTrO',
    rootCause: 'PRD review running 43 days late. Cross-pillar dependency to Agentforce launch.',
    pathToGreen: 'PRD review unblocked and signed; if not actioned by 5/3, escalate to CTrO.',
    decisionBy: '2026-05-03',
    nextStep: 'Pull PRD review forward this week; sponsor air-cover scheduled.'
  },
  {
    id: 'INI-102',
    name: 'Workday HRIS Migration',
    pillar: 'Employee Productivity',
    status: 'off_track',
    daysRed: 12,
    spendVsPlan: '85% spent · 50% built',
    okrAlignment: 'V25-Margin',
    okrCriticality: 'High',
    okrCritColor: 'syellow',
    accountable: 'Marcus Chen',
    accountableRole: 'Pillar PM',
    sponsor: 'Nina Burke',
    sponsorRole: 'CHRO',
    rootCause: 'Risk Register expired 2026-04-20. PM going on leave June 17 — coverage uncertain.',
    pathToGreen: 'Refresh Risk Register; scope cut decision; re-baseline capacity plan.',
    decisionBy: '2026-05-05',
    nextStep: 'Cover plan via Pillar PM Aisha during leave; CHRO sign-off on scope cut.'
  },
  {
    id: 'INI-112',
    name: 'ServiceNow Consolidation',
    pillar: 'Finance & Operations Tech',
    status: 'at_risk',
    daysRed: 33,
    spendVsPlan: '11% spent · 12% built',
    okrAlignment: 'V25-Margin',
    okrCriticality: 'Medium ($4.2M exposure)',
    okrCritColor: 'sfblue',
    accountable: 'David Lindqvist',
    accountableRole: 'Pillar PM',
    sponsor: 'Ravi Ahuja',
    sponsorRole: 'CFO',
    rootCause: 'Capacity Plan MISSING. Governance breach — biggest single capital exposure.',
    pathToGreen: 'Capacity plan documented + signed by 5/8; phase-2 deferral decision made.',
    decisionBy: '2026-05-08',
    nextStep: 'Defer phase 2 to FY27 (-$2.9M); consolidate into 2 instances first.'
  },
  {
    id: 'INI-104',
    name: 'Anaplan Capital Planning',
    pillar: 'Finance & Operations Tech',
    status: 'at_risk',
    daysRed: 28,
    spendVsPlan: '12% spent · 18% built',
    okrAlignment: 'V25-Margin',
    okrCriticality: 'Medium',
    okrCritColor: 'sfblue',
    accountable: 'David Lindqvist',
    accountableRole: 'Pillar PM',
    sponsor: 'Ravi Ahuja',
    sponsorRole: 'CFO',
    rootCause: 'PRD in needs_review since Feb. CFO sponsor unblock pending.',
    pathToGreen: 'PRD approval; sponsor unblock by 5/12.',
    decisionBy: '2026-05-12',
    nextStep: 'Sponsor 1:1 booked with CFO for 5/8.'
  }
];

// Cross-org dependencies that are active roadblocks.
// Where a decision in one pillar is gating delivery in another.
export const CROSS_ORG_BLOCKERS = [
  {
    blocker:    { id: 'INI-115', name: 'AI Governance Framework', pillar: 'Trust & Security' },
    blocked:    { id: 'INI-101', name: 'Agentforce Internal Rollout', pillar: 'Data & AI Platform' },
    type: 'gates',
    risk: 'high',
    daysOpen: 43,
    impact: 'AI Governance must approve Agentforce before production launch. Currently 43 days overdue. Org\'s #1 strategic bet exposed.'
  },
  {
    blocker:    { id: 'INI-116', name: 'Data Lakehouse', pillar: 'Data & AI Platform' },
    blocked:    { id: 'INI-101', name: 'Agentforce Internal Rollout', pillar: 'Data & AI Platform' },
    type: 'blocks',
    risk: 'high',
    daysOpen: 0,
    impact: 'Agentforce needs grounding data from Lakehouse. Lakehouse on track for May 30; tight margin if Agentforce sprint slips.'
  },
  {
    blocker:    { id: 'INI-116', name: 'Data Lakehouse', pillar: 'Data & AI Platform' },
    blocked:    { id: 'INI-106', name: 'HR Data Cloud', pillar: 'Employee Productivity' },
    type: 'blocks',
    risk: 'high',
    daysOpen: 0,
    impact: 'HR Data Cloud cannot productionize without Lakehouse pipeline. CHRO has been informed; targeting Q3 alignment.'
  },
  {
    blocker:    { id: 'INI-102', name: 'Workday Migration', pillar: 'Employee Productivity' },
    blocked:    { id: 'INI-106', name: 'HR Data Cloud', pillar: 'Employee Productivity' },
    type: 'shares_resources',
    risk: 'medium',
    daysOpen: 21,
    impact: '4 shared FTEs in Q3 — both initiatives competing for same engineers. Resource conflict needs Pillar PM resolution.'
  },
  {
    blocker:    { id: 'INI-110', name: 'CPQ Modernization', pillar: 'Field Engagement' },
    blocked:    { id: 'INI-105', name: 'Slack Sales Elevate', pillar: 'Field Engagement' },
    type: 'blocks',
    risk: 'medium',
    daysOpen: 47,
    impact: 'Slack Sales Elevate phase 2 needs CPQ APIs to stabilize. CPQ off-track means Sales Elevate roadmap shifts.'
  }
];
