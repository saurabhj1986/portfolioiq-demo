// Team Cockpit data: 4 Portfolio Manager direct reports.
// Reflects the JR337298 reality: Sr Manager grade, 4 direct reports (per recruiter screening notes).
// Hiring driver: maternity leave coverage starting June 2026 — backfill + growth mix.

export const DIRECT_REPORTS = [
  {
    id: 'PM-01',
    name: 'Jordan Reilly',
    role: 'Senior Portfolio Manager',
    pillarId: 'dap',
    pillarName: 'Data & AI Platform',
    avatar: 'JR',
    avatarColor: 'bg-sfblue',
    tenure: '2y 4mo',
    last1on1: '2026-04-22',
    workload: { initiatives: 4, budget: 9300000, fte: 34, atRisk: 0 },
    health: { onTrackPct: 100, lastReviewSlippage: 5, gateCompliance: 100 },
    insights: [
      { type: 'positive', text: 'Highest-performing pillar — 4/4 initiatives on track, 100% gate compliance.' },
      { type: 'note',     text: 'Owns Lakehouse (INI-116) which blocks Agentforce + HR Data Cloud — single point of failure. Recommend naming a backup.' },
      { type: 'growth',   text: 'Ready for stretch assignment: lead the Decision Engine pilot across Pillars in Q3.' }
    ],
    weeklyBrief: {
      tldr: 'On fire. All 4 initiatives green. Lakehouse hit G2 architecture review on time. Mulesoft consolidation entering G2 next sprint.',
      asks: ['Sponsor for Lakehouse backup-PM conversation', 'Permission to mentor a junior PM on Lakehouse architecture'],
      risks: ['Lakehouse delay would cascade — INI-101 + INI-106 both blocked'],
      celebrations: ['Tableau Embedded launched 2 weeks ahead of schedule, $28K under budget']
    },
    coachingFocus: 'Stretch into cross-pillar leadership. Strong technical depth; build executive narrative skills.'
  },
  {
    id: 'PM-02',
    name: 'Marcus Chen',
    role: 'Portfolio Manager',
    pillarId: 'ept',
    pillarName: 'Employee Productivity',
    avatar: 'MC',
    avatarColor: 'bg-syellow',
    tenure: '11mo',
    last1on1: '2026-04-15',
    workload: { initiatives: 3, budget: 5080000, fte: 31, atRisk: 1 },
    health: { onTrackPct: 67, lastReviewSlippage: 12, gateCompliance: 67 },
    insights: [
      { type: 'risk',     text: 'OVER CAPACITY — pillar at 110% FTE. Workday (INI-102) is OFF TRACK at 85% spent / 50% built.' },
      { type: 'risk',     text: 'Workday Risk Register expired 2026-04-20 — governance breach on Marcus\'s watch.' },
      { type: 'note',     text: 'Going on parental leave June 17 — coverage plan needed for Workday + HR Data Cloud.' },
      { type: 'growth',   text: '1:1 cadence has slipped — 12 days since last sync. Needs unblock conversation, not just status check.' }
    ],
    weeklyBrief: {
      tldr: 'Workday in crisis mode. Marcus needs immediate help — escalate Workday or pull Slack Huddles off his queue.',
      asks: ['Decision on Workday: scope cut, sponsor escalation, or both?', 'Cover plan for parental leave starting June 17'],
      risks: ['Workday runaway — 85% spent, behind schedule, expired risk register', 'Burnout risk — 110% allocated, off-track initiative on his watch'],
      celebrations: ['Slack Huddles AI Summaries on track + under budget']
    },
    coachingFocus: 'Crisis management + escalation skills. Help him say "I need help" earlier. Critical near-term: leave coverage transition.'
  },
  {
    id: 'PM-03',
    name: 'Aisha Patel',
    role: 'Senior Portfolio Manager',
    pillarId: 'ts',
    pillarName: 'Trust & Security',
    avatar: 'AP',
    avatarColor: 'bg-sgreen',
    tenure: '3y 1mo',
    last1on1: '2026-04-25',
    workload: { initiatives: 3, budget: 2870000, fte: 19, atRisk: 1 },
    health: { onTrackPct: 67, lastReviewSlippage: 8, gateCompliance: 67 },
    insights: [
      { type: 'risk',     text: 'AI Governance Framework (INI-115) PRD review overdue 43 days — gates Agentforce launch (DEP-03).' },
      { type: 'positive', text: 'Trust Center 2.0 (INI-103) launched on time, on budget. Strong execution evidence.' },
      { type: 'note',     text: 'Pillar is UNDER capacity (86%) — could absorb work from Marcus or run a stretch initiative.' },
      { type: 'growth',   text: 'Tenured + steady. Ideal candidate to mentor Marcus and cover Workday during his leave.' }
    ],
    weeklyBrief: {
      tldr: 'Steady operator. AI Governance review overdue is the only action item. Spare capacity available.',
      asks: ['Decision: pull AI Governance review forward or escalate to Lena Wu?', 'Permission to engage Marcus on Workday continuity'],
      risks: ['AI Governance slip cascades to Agentforce launch — high org-wide stakes'],
      celebrations: ['Trust Center 2.0 → first AI vendor to certify under new framework']
    },
    coachingFocus: 'Develop her as a peer mentor. Position for Sr Director track in 12-18 months.'
  },
  {
    id: 'PM-04',
    name: 'Renata Oliveira',
    role: 'Portfolio Manager',
    pillarId: 'fe',
    pillarName: 'Field Engagement',
    avatar: 'RO',
    avatarColor: 'bg-sred',
    tenure: '1y 8mo',
    last1on1: '2026-04-08',
    workload: { initiatives: 2, budget: 3600000, fte: 24, atRisk: 1 },
    health: { onTrackPct: 50, lastReviewSlippage: 19, gateCompliance: 50 },
    insights: [
      { type: 'risk',     text: 'CPQ Modernization (INI-110) OFF TRACK — Risk Register EXPIRED, over-FTE, 78% spent. This is the biggest people-management problem in the portfolio.' },
      { type: 'risk',     text: 'Last 1:1 was 19 days ago. Renata may be avoiding the CPQ conversation. Schedule unblock session this week.' },
      { type: 'note',     text: 'Slack Sales Elevate (INI-105) is healthy — proves she can run a clean program. CPQ may be a sponsor or scope problem, not a PM problem.' },
      { type: 'growth',   text: 'Needs coaching on saying "this scope is too big" earlier. Pattern: takes on more than capacity allows.' }
    ],
    weeklyBrief: {
      tldr: 'CPQ is a 5-alarm fire. Renata needs unblock conversation + CRO escalation, not status check.',
      asks: ['Sponsor permission to cut CPQ scope (Margin Push scenario)', 'Coaching on stakeholder push-back skills'],
      risks: ['CPQ failure = sales pipeline disruption', 'Renata burnout: managing off-track + sponsor friction'],
      celebrations: ['Slack Sales Elevate adoption beating internal target by 18%']
    },
    coachingFocus: 'Crisis-mode coaching. Co-create scope-cut narrative. Build her muscle for saying "no" to scope creep.'
  }
];

// AI Coaching Workflow — auto-detected actions across the team
export const COACHING_FEED = [
  {
    id: 'C-01',
    pmId: 'PM-04',
    severity: 'urgent',
    type: 'overdue_1on1',
    title: '1:1 with Renata overdue 19 days',
    detail: 'Last 1:1 was 2026-04-08. Combined with CPQ off-track status, this is the highest-priority human conversation in your queue.',
    suggestedAction: 'Schedule 60-min unblock session this week. Focus: CPQ scope cut, not status update. Pre-read: CPQ scenario from Decision Engine.',
    autoDraft: 'Hi Renata — I\'d like to set up 60 minutes this week, not as a status update but to co-create a path forward on CPQ. I have some scenarios from the Decision Engine I\'d like to walk through together. Tuesday or Thursday afternoon work?'
  },
  {
    id: 'C-02',
    pmId: 'PM-02',
    severity: 'urgent',
    type: 'leave_coverage',
    title: 'Marcus parental leave starting June 17 — coverage plan needed',
    detail: 'Workday (off-track) and HR Data Cloud (on-track but Lakehouse-dependent) are unowned during leave. Aisha has 14% capacity headroom and tenure to absorb.',
    suggestedAction: 'Propose Aisha as Workday acting-PM during leave. Pre-align with Marcus before formalizing.',
    autoDraft: 'Marcus — wanted to flag a coverage idea before your leave: Aisha has bandwidth and tenure to take Workday for 12 weeks. Want to grab 30 min Thursday to discuss handoff?'
  },
  {
    id: 'C-03',
    pmId: 'PM-03',
    severity: 'medium',
    type: 'stretch_opportunity',
    title: 'Aisha ready for stretch — Sr Director track candidate',
    detail: '3+ year tenure, 100% on-time delivery on Trust Center, mentor potential. Risk: under-utilized at 86% capacity.',
    suggestedAction: 'Surface in next talent review. Offer co-leadership of AI Governance task force.',
    autoDraft: null
  },
  {
    id: 'C-04',
    pmId: 'PM-01',
    severity: 'low',
    type: 'recognition',
    title: 'Jordan: Tableau Embedded launched 2 weeks early, $28K under',
    detail: 'Worth public recognition in next portfolio review. Reinforces "delivery on commitments" cultural signal.',
    suggestedAction: 'Call out in next exec readout. Add to Jordan\'s Q2 perf review.',
    autoDraft: 'Hi team — quick shout-out: Jordan and team shipped Tableau Embedded 2 weeks ahead of plan, $28K under budget. This is the standard.'
  },
  {
    id: 'C-05',
    pmId: 'PM-04',
    severity: 'medium',
    type: 'pattern_signal',
    title: 'Renata pattern: takes on more than capacity allows',
    detail: 'Second consecutive quarter where her primary initiative drifts off-track due to scope. Coaching opportunity, not perf issue (yet).',
    suggestedAction: 'In next 1:1, name the pattern explicitly. Co-create a scope-pushback playbook.',
    autoDraft: null
  }
];

// Workflow automation: 4 things the system can do without PM action
export const AUTOMATIONS = [
  {
    id: 'AUTO-01',
    name: 'Stale-1:1 auto-reminder',
    trigger: 'Days since last 1:1 > 14',
    action: 'Slack DM to manager + tentative calendar hold',
    impact: 'Eliminates the "I forgot to schedule" miss. Backstop for when humans drop the ball.',
    enabled: true
  },
  {
    id: 'AUTO-02',
    name: 'Stage-gate artifact expiration nudge',
    trigger: 'Artifact expires in <14 days',
    action: 'Email PM + auto-create refresh task',
    impact: 'Prevents the audit scramble. Same pattern as TrustReply\'s evidence lifecycle.',
    enabled: true
  },
  {
    id: 'AUTO-03',
    name: 'Off-track escalation routing',
    trigger: 'Initiative status changes to off_track',
    action: 'Auto-draft escalation email to sponsor + Slack notify Sr Mgr',
    impact: 'Cuts escalation lag from days to minutes. Sponsor sees the issue before the next exec review.',
    enabled: true
  },
  {
    id: 'AUTO-04',
    name: 'AI weekly brief generator',
    trigger: 'Every Friday at 4pm PT',
    action: 'Auto-generate per-PM brief (TL;DR, asks, risks, celebrations) + manager summary',
    impact: '30 min of Sr Mgr 1:1 prep eliminated per week. Frees time for actual coaching.',
    enabled: true
  }
];
