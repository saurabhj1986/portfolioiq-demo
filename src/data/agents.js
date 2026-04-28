// Agentic operating layer — 12 niche agents running on Agentforce, connected
// primarily to Salesforce-native tools (GUS, Slack, Quip, Tableau, Data Cloud,
// MuleSoft, Einstein) with supporting external systems (Jira, Email, Okta,
// Snowflake, Workday, Anaplan) bridged via MCP.

export const AGENT_CATEGORIES = [
  { id: 'governance', label: 'Governance',       desc: 'Keep the audit trail clean and artifacts current' },
  { id: 'coaching',   label: 'Coaching · Team',  desc: 'Free up Sr Mgr time for actual coaching conversations' },
  { id: 'decision',   label: 'Decision Support', desc: 'Surface signals before they become problems' },
  { id: 'comms',      label: 'Comms · Workflow', desc: 'Route the right message to the right place automatically' }
];

// MCP fabric — Salesforce-native tools first, external supporting tools second.
export const MCP_SERVERS = [
  // ─── Salesforce-native (primary) ───
  { id: 'agentforce',  label: 'Agentforce',          icon: '🤖', salesforce: true,
    purpose: 'Agent runtime · where these portfolio agents actually execute' },
  { id: 'gus',         label: 'GUS',                 icon: '⚡', salesforce: true,
    purpose: 'Salesforce internal work-tracking · initiatives, epics, stories, releases' },
  { id: 'sfplatform',  label: 'Salesforce Platform', icon: '☁️', salesforce: true,
    purpose: 'Custom objects for portfolio metadata · sponsor records · audit logging' },
  { id: 'datacloud',   label: 'Data Cloud',          icon: '🌩️', salesforce: true,
    purpose: 'Unified data layer · initiative_inventory + cross-system rollups' },
  { id: 'einstein',    label: 'Einstein',            icon: '✨', salesforce: true,
    purpose: 'ML predictions · capital burn forecasting · RICE confidence scoring' },
  { id: 'tableau',     label: 'Tableau',             icon: '📊', salesforce: true,
    purpose: 'KPI dashboards · exec reports · embedded portfolio analytics' },
  { id: 'slack',       label: 'Slack',               icon: '💬', salesforce: true,
    purpose: 'DMs to PMs · pillar channels · escalation threads · intake forms' },
  { id: 'quip',        label: 'Quip',                icon: '📝', salesforce: true,
    purpose: 'PRDs · architecture reviews · launch readiness · sunset retros' },
  { id: 'mulesoft',    label: 'MuleSoft',            icon: '🔌', salesforce: true,
    purpose: 'API orchestration · bridges external systems into Data Cloud' },

  // ─── External supporting tools ───
  { id: 'jira',        label: 'Jira',                icon: '🎫', salesforce: false,
    purpose: 'Tickets for non-DET teams that haven\'t migrated to GUS' },
  { id: 'email',       label: 'Email',               icon: '✉️', salesforce: false,
    purpose: 'Sponsor + CFO + leadership communication' },
  { id: 'okta',        label: 'Okta',                icon: '🔐', salesforce: false,
    purpose: 'Identity · RBAC · audit-trail attribution' },
  { id: 'snowflake',   label: 'Snowflake',           icon: '❄️', salesforce: false,
    purpose: 'External data warehouse · cross-system queries (where Data Cloud isn\'t the source)' },
  { id: 'workday',     label: 'Workday',             icon: '👤', salesforce: false,
    purpose: 'FTE capacity · leave calendar · org structure' },
  { id: 'anaplan',     label: 'Anaplan',             icon: '📈', salesforce: false,
    purpose: 'Capital plans · financial forecasts' }
];

export const AGENTS = [
  // ─── GOVERNANCE ───
  {
    id: 'A-01', name: 'Stale Artifact Sentinel', category: 'governance', icon: '🛡️', status: 'active',
    description: 'Watches stage-gate artifacts approaching expiry. Nudges owners via Slack; escalates to sponsor; auto-creates a GUS work item if past expiry.',
    trigger: 'Artifact `expires_date` < 14 days from now',
    schedule: 'Hourly',
    integrations: ['agentforce', 'gus', 'slack', 'email', 'sfplatform'],
    actions: [
      'Read stage_gate_artifacts from Salesforce Platform every hour',
      'DM artifact owner on Slack with refresh template + 7-day SLA',
      'On day 7, escalate via email to sponsor + Sr Mgr',
      'On day 0, auto-create GUS work item and write to portfolio_audit_trail'
    ],
    lastRun: '2 hours ago',
    lastOutcome: 'Sent 3 nudges (CPQ Risk Register, Workday Risk Register, Anaplan PRD)',
    successMetric: '94% of artifacts refreshed before expiry · zero past-due since launch',
    monthlyActions: 47
  },
  {
    id: 'A-02', name: 'Risk Register Refresher', category: 'governance', icon: '📋', status: 'active',
    description: 'Every 90 days, picks initiatives whose Risk Register hasn\'t been refreshed; opens a GUS work item pre-filled with last quarter\'s risks; assigns to PM with 7-day SLA.',
    trigger: '90 days since last `risk_register.collected_date`',
    schedule: 'Daily check, action on cycle',
    integrations: ['agentforce', 'gus', 'datacloud', 'slack'],
    actions: [
      'Query Data Cloud for initiatives past 90-day refresh window',
      'Pull last quarter\'s risks from snapshot',
      'Create GUS work item pre-populated with prior risks + reflection prompts',
      'Slack DM the assigned PM with link to GUS + due date'
    ],
    lastRun: 'Yesterday, 06:00',
    lastOutcome: 'Created 2 GUS work items (INI-110 CPQ, INI-104 Anaplan); assigned to Renata + David',
    successMetric: 'Risk Register currency: 81% → 96% in 6 months',
    monthlyActions: 12
  },
  {
    id: 'A-03', name: 'Audit Trail Compliance Check', category: 'governance', icon: '🔍', status: 'active',
    description: 'Daily SOX-aligned check: every state change in initiative_inventory or stage_gate_artifacts must have an actor + timestamp + reason. Flags gaps for the Sr Mgr.',
    trigger: 'Daily at 06:00 PT',
    schedule: 'Daily',
    integrations: ['agentforce', 'sfplatform', 'okta', 'email'],
    actions: [
      'Query Salesforce Platform audit log for last 24h state changes',
      'Cross-check actor against Okta identity records',
      'Flag any change with missing actor / reason / before-after',
      'Email Sr Mgr a daily compliance report (zero gaps = no email)'
    ],
    lastRun: 'Today, 06:00',
    lastOutcome: '247 state changes audited · 0 gaps detected',
    successMetric: '99.97% audit-trail completeness · 0 SOX-relevant gaps in 6 months',
    monthlyActions: 30
  },

  // ─── COACHING / TEAM ───
  {
    id: 'A-04', name: 'Pillar PM Weekly Brief Drafter', category: 'coaching', icon: '📝', status: 'active',
    description: 'Friday at 16:00 PT — for each PM direct report, drafts a TL;DR weekly brief by pulling from Data Cloud. Brief lands as a Quip doc shared with Sr Mgr before Monday 1:1s.',
    trigger: 'Friday 16:00 PT',
    schedule: 'Weekly (Fri 16:00)',
    integrations: ['agentforce', 'datacloud', 'einstein', 'quip', 'email'],
    actions: [
      'For each PM in Team Cockpit, query their pillar\'s data from Data Cloud',
      'Use Einstein to summarize TL;DR + 3 asks + risks + 1 celebration',
      'Generate a Quip doc with all 4 PM briefs',
      'Email Sr Mgr the Quip link as Friday digest'
    ],
    lastRun: 'Last Friday, 16:00',
    lastOutcome: '4 weekly briefs drafted in one Quip doc; Sr Mgr edited 12% of words before sending',
    successMetric: 'Saves ~2 hrs/week of 1:1 prep · PM 1:1 satisfaction +8 NPS',
    monthlyActions: 16
  },
  {
    id: 'A-05', name: 'Sponsor Brief Agent', category: 'coaching', icon: '💼', status: 'active',
    description: 'When a sponsor 1:1 appears on calendar in next 24h, drafts the brief automatically by joining sponsor record in Salesforce Platform with their initiatives in Data Cloud.',
    trigger: 'Calendar event with `sponsor` tag, 24h before',
    schedule: 'Event-driven',
    integrations: ['agentforce', 'sfplatform', 'datacloud', 'quip', 'email'],
    actions: [
      'Detect upcoming sponsor 1:1 from Slack calendar integration',
      'Look up sponsor record in Salesforce Platform; pull all owned initiatives from Data Cloud',
      'Compose brief: Status · Last 2 weeks · Next 2 weeks · Where I need you · Risks',
      'Drop Quip doc; email Sr Mgr 24h ahead'
    ],
    lastRun: '4 hours ago',
    lastOutcome: 'Drafted Tom Harlow (CRO) 1:1 brief for 5/2 — 6 initiatives covered',
    successMetric: '~30 min saved per sponsor 1:1 · 12 sponsors × bi-weekly = 6 hrs/month',
    monthlyActions: 24
  },
  {
    id: 'A-06', name: 'Coaching Opportunity Scout', category: 'coaching', icon: '🎯', status: 'active',
    description: 'Daily scan for coaching signals: overdue 1:1s, leave coverage gaps, stretch-ready PMs, repeated scope-creep patterns. Posts findings into Team Cockpit.',
    trigger: 'Daily at 09:00 PT',
    schedule: 'Daily',
    integrations: ['agentforce', 'workday', 'datacloud', 'einstein', 'slack'],
    actions: [
      'Cross-reference last_1on1 dates against today',
      'Pull leave calendar from Workday; match against initiative ownership',
      'Use Einstein to detect pattern repetitions per PM (e.g., scope-creep)',
      'Post findings into Slack channel #portfolio-coaching for Sr Mgr review'
    ],
    lastRun: 'Today, 09:00',
    lastOutcome: '5 signals: 1 overdue 1:1 (Renata), 1 leave coverage need (Marcus), 1 stretch (Aisha), 2 patterns',
    successMetric: '~3 coaching moments per week that would otherwise be missed',
    monthlyActions: 30
  },

  // ─── DECISION SUPPORT ───
  {
    id: 'A-07', name: 'Capacity Conflict Detector', category: 'decision', icon: '⚖️', status: 'active',
    description: 'Weekly scan of capacity_snapshots; when two initiatives compete for the same FTE in the same week, flags both Pillar PMs and proposes a sequencing option.',
    trigger: 'Weekly Mon 08:00 PT',
    schedule: 'Weekly (Mon 08:00)',
    integrations: ['agentforce', 'anaplan', 'workday', 'datacloud', 'slack', 'gus'],
    actions: [
      'Compare initiative.fte_allocated against pillar.fte_capacity in Data Cloud',
      'Detect over-100% pillars + identify shared FTE conflicts',
      'Run sequencing proposal (which initiative leads, which trails)',
      'Slack DM both Pillar PMs with conflict summary; link relevant GUS items'
    ],
    lastRun: 'Monday, 08:00',
    lastOutcome: 'Detected: Workday + HR Data Cloud share 4 FTEs in Q3; proposed serial sequencing',
    successMetric: '6 conflicts detected in 6 months · 5 resolved without exec escalation',
    monthlyActions: 4
  },
  {
    id: 'A-08', name: 'Capital Burn Forecaster', category: 'decision', icon: '🔥', status: 'active',
    description: 'Monday morning: for each initiative, Einstein projects month-end spend vs plan. Trending hot (>10% over) or cold (>10% under)? Tableau dashboard updates + email digest.',
    trigger: 'Weekly Mon 06:30 PT',
    schedule: 'Weekly (Mon 06:30)',
    integrations: ['agentforce', 'anaplan', 'einstein', 'tableau', 'email'],
    actions: [
      'Pull burn-rate from Anaplan via MuleSoft',
      'Use Einstein to project month-end spend using rolling-7-day velocity',
      'Identify deviations >10% in either direction',
      'Refresh Tableau "Capital Burn Forecast" dashboard; email Sr Mgr a ranked digest'
    ],
    lastRun: 'Monday, 06:30',
    lastOutcome: '3 hot (CPQ +18%, ServiceNow -22%, Workday +12%); 1 cold (AI Governance -34%)',
    successMetric: 'Capital surprise events down 67% vs prior cycle',
    monthlyActions: 4
  },
  {
    id: 'A-09', name: 'Sunset Candidate Scout', category: 'decision', icon: '🌅', status: 'pilot',
    description: 'Monthly: runs the KPI Studio Recommendation Engine on Data Cloud; lists initiatives in "Sunset" tier; drafts a sunset proposal as a Quip doc + capital reallocation plan.',
    trigger: 'Monthly (1st Mon)',
    schedule: 'Monthly',
    integrations: ['agentforce', 'datacloud', 'einstein', 'quip', 'tableau', 'email'],
    actions: [
      'Run KPI Studio scoring profile on Data Cloud',
      'Identify Sunset-tier initiatives via Einstein-weighted ranking',
      'Draft a sunset proposal Quip doc using the Sunset Playbook template',
      'Email Sr Mgr the candidate list + Tableau view + draft proposals'
    ],
    lastRun: '3 weeks ago',
    lastOutcome: '2 candidates flagged (INI-104, INI-112); 1 proposal drafted; 1 referred to sponsor for context',
    successMetric: 'In pilot — first-month: 1 sunset confirmed, $1.6M capital released',
    monthlyActions: 2
  },

  // ─── COMMS / WORKFLOW ───
  {
    id: 'A-10', name: 'Off-Track Triage Agent', category: 'comms', icon: '🚨', status: 'active',
    description: 'When an initiative status flips to off_track, auto-drafts an escalation email, schedules a 30-min slot, posts a Slack thread, and opens a GUS work item.',
    trigger: 'initiative_inventory.status changes to `off_track`',
    schedule: 'Event-driven',
    integrations: ['agentforce', 'sfplatform', 'gus', 'slack', 'email'],
    actions: [
      'Detect status transition via Salesforce Platform audit trail',
      'Generate escalation draft using Off-Track Escalation Playbook',
      'Find next 30-min slot common to sponsor + Sr Mgr + PM',
      'Post Slack thread to pillar\'s channel; create GUS work item with the playbook checklist'
    ],
    lastRun: '6 days ago',
    lastOutcome: 'INI-110 CPQ went off-track → drafted escalation, scheduled 5/2 with CRO, opened GUS item',
    successMetric: 'Escalation lag: 4 days → 6 hours median',
    monthlyActions: 5
  },
  {
    id: 'A-11', name: 'Cross-Pillar Dependency Watcher', category: 'comms', icon: '🔗', status: 'active',
    description: 'Monitors the dependency graph in Data Cloud; when an upstream initiative goes off_track, auto-DMs the affected downstream PMs with cascade impact analysis.',
    trigger: 'Upstream initiative status changes',
    schedule: 'Event-driven',
    integrations: ['agentforce', 'datacloud', 'einstein', 'slack', 'gus'],
    actions: [
      'Walk dependencies graph upstream from each off-track initiative',
      'Use Einstein to score impact severity on each downstream initiative',
      'Compose impact summary per affected PM',
      'Slack DM each PM; link GUS items for the affected work'
    ],
    lastRun: '2 hours ago',
    lastOutcome: 'INI-115 AI Governance at-risk → DM\'d Jordan (INI-101 Agentforce gated)',
    successMetric: 'Downstream PMs notified within 1h vs prior 2-day average',
    monthlyActions: 8
  },
  {
    id: 'A-12', name: 'New Intake Triage Agent', category: 'comms', icon: '🔀', status: 'active',
    description: 'When a new initiative request arrives via Slack form, validates the intake template, Einstein auto-RICE-scores, then routes to the right Pillar PM and creates a GUS work item.',
    trigger: 'New row in `initiative_intake_requests` (Salesforce custom object)',
    schedule: 'Event-driven',
    integrations: ['agentforce', 'slack', 'sfplatform', 'einstein', 'gus'],
    actions: [
      'Parse Slack form submission against Intake Playbook',
      'Validate required fields (sponsor, problem, hypothesis, ask)',
      'Use Einstein to auto-score on RICE using sponsor seniority + scope hints',
      'Route to Pillar PM via Slack with triage recommendation; create GUS work item if accepted'
    ],
    lastRun: 'Yesterday, 14:02',
    lastOutcome: '3 new intakes processed; 2 routed (Recommend Accept), 1 returned for missing fields',
    successMetric: 'Intake-to-triage cycle: 5d → 4h median',
    monthlyActions: 18
  }
];

// Recent activity feed (last 24h sample)
export const AGENT_ACTIVITY = [
  { ts: '2026-04-28 14:23', agent: 'A-01', agentName: 'Stale Artifact Sentinel',          action: 'Slack DM',               target: 'Renata Oliveira',  via: 'slack',     detail: 'CPQ Risk Register expires in 12 days. Refresh template attached.' },
  { ts: '2026-04-28 14:08', agent: 'A-11', agentName: 'Cross-Pillar Dependency Watcher',  action: 'Slack DM + GUS link',    target: 'Jordan Reilly',    via: 'slack',     detail: 'INI-115 AI Governance at-risk → INI-101 Agentforce gate at risk. Cascade analysis attached; GUS item linked.' },
  { ts: '2026-04-28 13:55', agent: 'A-05', agentName: 'Sponsor Brief Agent',              action: 'Drafted Quip',           target: 'Sr Mgr',           via: 'quip',      detail: 'Briefing for Tom Harlow (CRO) 1:1 on 5/2 ready as Quip doc (6 initiatives covered).' },
  { ts: '2026-04-28 12:31', agent: 'A-12', agentName: 'New Intake Triage Agent',          action: 'Triaged + GUS routed',   target: 'Aisha Patel',      via: 'gus',       detail: 'New intake "DSAR Automation v2" → ACCEPT (Einstein RICE 1.8); GUS work item created in T&S pillar.' },
  { ts: '2026-04-28 09:00', agent: 'A-06', agentName: 'Coaching Opportunity Scout',       action: 'Posted to Slack',         target: '#portfolio-coaching', via: 'slack', detail: '5 coaching signals detected (overdue 1:1, leave coverage, stretch-ready, 2 patterns).' },
  { ts: '2026-04-28 06:30', agent: 'A-08', agentName: 'Capital Burn Forecaster',          action: 'Tableau refresh + email', target: 'Sr Mgr',           via: 'tableau',   detail: 'Weekly forecast: 3 hot (CPQ +18%, Workday +12%), 1 cold (AI Governance -34%). Tableau dashboard updated.' },
  { ts: '2026-04-28 06:00', agent: 'A-03', agentName: 'Audit Trail Compliance Check',     action: 'Compliance check',       target: '—',                via: 'sfplatform',detail: '247 state changes in Salesforce Platform audited · 0 gaps · no email needed.' },
  { ts: '2026-04-27 16:00', agent: 'A-04', agentName: 'Pillar PM Weekly Brief Drafter',   action: 'Quip doc + email',       target: 'Sr Mgr',           via: 'quip',      detail: '4 weekly briefs drafted in one Quip doc (Jordan, Marcus, Aisha, Renata); Einstein-summarized.' },
  { ts: '2026-04-27 11:42', agent: 'A-10', agentName: 'Off-Track Triage Agent',           action: 'Escalation + GUS item',  target: 'Tom Harlow (CRO)', via: 'email',     detail: 'INI-110 CPQ off-track → escalation drafted, 5/2 calendar slot booked, GUS work item opened.' },
  { ts: '2026-04-27 08:00', agent: 'A-07', agentName: 'Capacity Conflict Detector',       action: 'Conflict alert',         target: 'Marcus Chen',      via: 'slack',     detail: 'Workday + HR Data Cloud share 4 FTE in Q3. Proposed serial sequencing; relevant GUS items linked.' },
  { ts: '2026-04-26 06:00', agent: 'A-02', agentName: 'Risk Register Refresher',          action: 'Created GUS items',      target: 'Renata + David',   via: 'gus',       detail: '2 GUS work items created for stale Risk Registers (CPQ, Anaplan); pre-filled with last quarter\'s risks.' },
  { ts: '2026-04-26 06:00', agent: 'A-03', agentName: 'Audit Trail Compliance Check',     action: 'Compliance check',       target: '—',                via: 'sfplatform',detail: '203 state changes audited · 1 gap (manual override on INI-103, justified). Resolved.' }
];

// Aggregate stats
export function aggregateStats() {
  const monthly = AGENTS.reduce((s, a) => s + a.monthlyActions, 0);
  return {
    agents: AGENTS.length,
    active: AGENTS.filter(a => a.status === 'active').length,
    monthlyActions: monthly,
    weeklyActions: Math.round(monthly / 4.3),
    timeSaved: '~18 hrs/week saved across the team'
  };
}
