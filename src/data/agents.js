// Agentic operating layer — 12 niche agents that run portfolio workflows
// via MCP connections to Slack, Jira, email, calendar, and source systems.

export const AGENT_CATEGORIES = [
  { id: 'governance', label: 'Governance',       desc: 'Keep the audit trail clean and artifacts current' },
  { id: 'coaching',   label: 'Coaching · Team',  desc: 'Free up Sr Mgr time for actual coaching conversations' },
  { id: 'decision',   label: 'Decision Support', desc: 'Surface signals before they become problems' },
  { id: 'comms',      label: 'Comms · Workflow', desc: 'Route the right message to the right place automatically' }
];

export const MCP_SERVERS = [
  { id: 'slack',      label: 'Slack',       icon: '💬', purpose: 'DMs to PMs, posts to pillar channels, thread escalations' },
  { id: 'jira',       label: 'Jira',        icon: '🎫', purpose: 'Create + update tickets; comment on issues' },
  { id: 'servicenow', label: 'ServiceNow',  icon: '🔧', purpose: 'Stage-gate artifacts, change requests, incidents' },
  { id: 'email',      label: 'Email',       icon: '✉️', purpose: 'Draft + send to sponsors, CFO, leadership' },
  { id: 'calendar',   label: 'Calendar',    icon: '📅', purpose: 'Find slots, schedule 1:1s + portfolio reviews' },
  { id: 'anaplan',    label: 'Anaplan',     icon: '📊', purpose: 'Capital plans, budget actuals' },
  { id: 'workday',    label: 'Workday',     icon: '👤', purpose: 'FTE capacity, leave calendar, org structure' },
  { id: 'snowflake',  label: 'Snowflake',   icon: '❄️', purpose: 'Aggregated KPIs, semantic queries' },
  { id: 'quip',       label: 'Quip',        icon: '📝', purpose: 'PRDs, architecture reviews, launch readiness' },
  { id: 'okta',       label: 'Okta',        icon: '🔐', purpose: 'Identity, access control, audit-trail attribution' }
];

export const AGENTS = [
  // GOVERNANCE
  {
    id: 'A-01', name: 'Stale Artifact Sentinel', category: 'governance', icon: '🛡️', status: 'active',
    description: 'Watches stage-gate artifacts approaching expiry. Nudges owners; escalates to sponsor if ignored; auto-creates a ServiceNow ticket if past expiry.',
    trigger: 'Artifact `expires_date` < 14 days from now',
    schedule: 'Hourly',
    integrations: ['servicenow', 'slack', 'email'],
    actions: [
      'Read stage_gate_artifacts.expires_date hourly',
      'DM artifact owner via Slack with refresh template + 7-day SLA',
      'On day 7, escalate via email to sponsor + Sr Mgr',
      'On day 0, auto-create ServiceNow ticket and flag in audit trail'
    ],
    lastRun: '2 hours ago',
    lastOutcome: 'Sent 3 nudges (CPQ Risk Register, Workday Risk Register, Anaplan PRD)',
    successMetric: '94% of artifacts refreshed before expiry · zero past-due since launch',
    monthlyActions: 47
  },
  {
    id: 'A-02', name: 'Risk Register Refresher', category: 'governance', icon: '📋', status: 'active',
    description: 'Every 90 days, picks initiatives whose Risk Register hasn\'t been refreshed; opens a Jira ticket pre-filled with last quarter\'s risks; assigns to PM with 7-day SLA.',
    trigger: '90 days since last `risk_register.collected_date`',
    schedule: 'Daily check, action on cycle',
    integrations: ['jira', 'slack', 'snowflake'],
    actions: [
      'Query Snowflake for initiatives past 90-day refresh',
      'Pull last quarter\'s risks from snapshot',
      'Create Jira ticket pre-populated with prior risks + reflection prompts',
      'Slack DM the assigned PM with ticket link + due date'
    ],
    lastRun: 'Yesterday, 06:00',
    lastOutcome: 'Created 2 Jira tickets (INI-110 CPQ, INI-104 Anaplan); assigned to Renata + David',
    successMetric: 'Risk Register currency: 81% → 96% in 6 months',
    monthlyActions: 12
  },
  {
    id: 'A-03', name: 'Audit Trail Compliance Check', category: 'governance', icon: '🔍', status: 'active',
    description: 'Daily SOX-aligned check: every state change in initiative_inventory or stage_gate_artifacts must have an actor + timestamp + reason. Flags gaps for the Sr Mgr.',
    trigger: 'Daily at 06:00 PT',
    schedule: 'Daily',
    integrations: ['snowflake', 'okta', 'email'],
    actions: [
      'Query portfolio_audit_trail for last 24h state changes',
      'Cross-check actor against Okta identity',
      'Flag any change with missing actor / reason / before-after',
      'Email Sr Mgr a daily compliance report (zero gaps = no email)'
    ],
    lastRun: 'Today, 06:00',
    lastOutcome: '247 state changes audited · 0 gaps detected',
    successMetric: '99.97% audit-trail completeness · 0 SOX-relevant gaps in 6 months',
    monthlyActions: 30
  },

  // COACHING / TEAM
  {
    id: 'A-04', name: 'Pillar PM Weekly Brief Drafter', category: 'coaching', icon: '📝', status: 'active',
    description: 'Friday at 16:00 PT — for each PM direct report, drafts a TL;DR weekly brief (status, asks, risks, celebrations) by pulling from their pillar\'s data. Lands in Sr Mgr inbox before Monday 1:1s.',
    trigger: 'Friday 16:00 PT',
    schedule: 'Weekly (Fri 16:00)',
    integrations: ['snowflake', 'email', 'calendar'],
    actions: [
      'For each PM in Team Cockpit, query their pillar\'s data',
      'Generate TL;DR + 3 asks + risks + 1 celebration',
      'Add link to upcoming 1:1 from calendar',
      'Email to Sr Mgr as one digest with 4 sections'
    ],
    lastRun: 'Last Friday, 16:00',
    lastOutcome: '4 weekly briefs drafted; Sr Mgr edited 12% of words before sending',
    successMetric: 'Saves ~2 hrs/week of 1:1 prep · PM 1:1 satisfaction +8 NPS',
    monthlyActions: 16
  },
  {
    id: 'A-05', name: 'Sponsor Brief Agent', category: 'coaching', icon: '💼', status: 'active',
    description: 'When a sponsor 1:1 appears on calendar in next 24h, drafts the brief automatically (their initiatives\' status, asks, risks). Sr Mgr edits + sends.',
    trigger: 'Calendar event with `sponsor` tag, 24h before',
    schedule: 'Event-driven',
    integrations: ['calendar', 'snowflake', 'email'],
    actions: [
      'Detect upcoming sponsor 1:1 from calendar',
      'Pull all initiatives sponsored by that exec from initiative_inventory',
      'Compose brief: Status · Last 2 weeks · Next 2 weeks · Where I need you · Risks',
      'Send to Sr Mgr inbox 24h ahead of meeting'
    ],
    lastRun: '4 hours ago',
    lastOutcome: 'Drafted Tom Harlow (CRO) 1:1 brief for 5/2 — 6 initiatives covered',
    successMetric: '~30 min saved per sponsor 1:1; 12 sponsors × bi-weekly = 6 hrs/month',
    monthlyActions: 24
  },
  {
    id: 'A-06', name: 'Coaching Opportunity Scout', category: 'coaching', icon: '🎯', status: 'active',
    description: 'Daily scan for coaching signals: overdue 1:1s, upcoming leave with no coverage plan, stretch-ready PMs, repeated scope creep patterns. Surfaces in Team Cockpit.',
    trigger: 'Daily at 09:00 PT',
    schedule: 'Daily',
    integrations: ['calendar', 'workday', 'snowflake'],
    actions: [
      'Cross-reference last_1on1 dates against current date',
      'Pull leave calendar from Workday; match against initiative ownership',
      'Detect repeated patterns (e.g., scope creep) per PM via initiative_inventory history',
      'Post findings to Team Cockpit AI Coaching Feed'
    ],
    lastRun: 'Today, 09:00',
    lastOutcome: '5 signals: 1 overdue 1:1 (Renata), 1 leave coverage need (Marcus), 1 stretch (Aisha), 2 patterns',
    successMetric: '~3 coaching moments surfaced per week that would otherwise be missed',
    monthlyActions: 30
  },

  // DECISION SUPPORT
  {
    id: 'A-07', name: 'Capacity Conflict Detector', category: 'decision', icon: '⚖️', status: 'active',
    description: 'Weekly scan of capacity_snapshots; when two initiatives compete for the same FTE in the same week, flags both Pillar PMs and proposes a sequencing option.',
    trigger: 'Weekly Mon 08:00 PT',
    schedule: 'Weekly (Mon 08:00)',
    integrations: ['anaplan', 'workday', 'slack'],
    actions: [
      'Compare initiative.fte_allocated against pillar.fte_capacity per snapshot',
      'Detect over-100% pillars + identify shared FTE conflicts',
      'Run a sequencing proposal (which initiative leads, which trails)',
      'Slack DM both Pillar PMs with conflict summary + proposal'
    ],
    lastRun: 'Monday, 08:00',
    lastOutcome: 'Detected: Workday + HR Data Cloud share 4 FTEs in Q3; proposed serial sequencing',
    successMetric: '6 conflicts detected in 6 months · 5 resolved without exec escalation',
    monthlyActions: 4
  },
  {
    id: 'A-08', name: 'Capital Burn Forecaster', category: 'decision', icon: '🔥', status: 'active',
    description: 'Monday morning: for each active initiative, projects month-end spend vs plan. Trending hot (>10% over) or cold (>10% under)? Escalates with a recommended action.',
    trigger: 'Weekly Mon 06:30 PT',
    schedule: 'Weekly (Mon 06:30)',
    integrations: ['anaplan', 'snowflake', 'email'],
    actions: [
      'Pull burn-rate from Anaplan',
      'Project month-end spend vs plan using rolling-7-day velocity',
      'Identify deviations >10% in either direction',
      'Email Sr Mgr a forecast report ranked by deviation magnitude'
    ],
    lastRun: 'Monday, 06:30',
    lastOutcome: '3 hot (CPQ +18%, ServiceNow -22%, Workday +12%); 1 cold (AI Governance -34%)',
    successMetric: 'Capital surprise events down 67% vs prior cycle',
    monthlyActions: 4
  },
  {
    id: 'A-09', name: 'Sunset Candidate Scout', category: 'decision', icon: '🌅', status: 'pilot',
    description: 'Monthly: runs the KPI Studio Recommendation Engine; lists initiatives in "Sunset" tier; drafts a sunset proposal + capital reallocation plan for each.',
    trigger: 'Monthly (1st Mon)',
    schedule: 'Monthly',
    integrations: ['snowflake', 'quip', 'email'],
    actions: [
      'Run KPI Studio with current scoring profile',
      'Identify Sunset-tier initiatives',
      'Draft a sunset proposal (Quip doc) with retro template',
      'Email Sr Mgr the candidate list + draft proposals for review'
    ],
    lastRun: '3 weeks ago',
    lastOutcome: '2 candidates flagged (INI-104, INI-112); 1 proposal drafted; 1 referred to sponsor for context',
    successMetric: 'In pilot — first-month: 1 sunset confirmed, $1.6M capital released',
    monthlyActions: 2
  },

  // COMMS / WORKFLOW
  {
    id: 'A-10', name: 'Off-Track Triage Agent', category: 'comms', icon: '🚨', status: 'active',
    description: 'When an initiative status flips to off_track, auto-drafts an escalation email to sponsor, schedules a 30-min slot, and posts a Slack thread.',
    trigger: 'initiative_inventory.status changes to `off_track`',
    schedule: 'Event-driven',
    integrations: ['email', 'calendar', 'slack', 'jira'],
    actions: [
      'Detect status transition via audit trail',
      'Generate escalation draft using Off-Track Escalation Playbook',
      'Find next 30-min slot common to sponsor + Sr Mgr + PM (calendar)',
      'Post Slack thread to pillar\'s channel; create Jira ticket for tracking'
    ],
    lastRun: '6 days ago',
    lastOutcome: 'INI-110 CPQ went off-track → drafted escalation, scheduled 5/2 with CRO, opened Jira',
    successMetric: 'Escalation lag: 4 days → 6 hours median',
    monthlyActions: 5
  },
  {
    id: 'A-11', name: 'Cross-Pillar Dependency Watcher', category: 'comms', icon: '🔗', status: 'active',
    description: 'Monitors the dependency graph; when an upstream initiative goes off_track, auto-DMs the affected downstream PMs with cascade impact analysis.',
    trigger: 'Upstream initiative status changes',
    schedule: 'Event-driven',
    integrations: ['snowflake', 'slack'],
    actions: [
      'Walk dependencies graph upstream from each off-track initiative',
      'Identify all blocked downstream initiatives + impact severity',
      'Compose impact summary per affected PM',
      'Slack DM each PM with cascade analysis + suggested mitigation'
    ],
    lastRun: '2 hours ago',
    lastOutcome: 'INI-115 AI Governance at-risk → DM\'d Jordan (INI-101 Agentforce gated)',
    successMetric: 'Downstream PMs notified within 1h vs prior 2-day average',
    monthlyActions: 8
  },
  {
    id: 'A-12', name: 'New Intake Triage Agent', category: 'comms', icon: '🔀', status: 'active',
    description: 'When a new initiative request arrives via Slack form, validates the intake template, scores it on RICE (auto), and routes to the right Pillar PM with a triage decision.',
    trigger: 'New row in `initiative_intake_requests` table',
    schedule: 'Event-driven',
    integrations: ['slack', 'snowflake', 'jira'],
    actions: [
      'Parse Slack form submission against Intake Playbook',
      'Validate required fields (sponsor, problem, hypothesis, ask)',
      'Auto-score on RICE using sponsor seniority + scope hints',
      'Route to Pillar PM via Slack with triage recommendation (Accept / Defer / Decline)'
    ],
    lastRun: 'Yesterday, 14:02',
    lastOutcome: '3 new intakes processed; 2 routed (Recommend Accept), 1 returned for missing fields',
    successMetric: 'Intake-to-triage cycle: 5d → 4h median',
    monthlyActions: 18
  }
];

// Recent activity feed (last 24h sample)
export const AGENT_ACTIVITY = [
  { ts: '2026-04-28 14:23', agent: 'A-01', agentName: 'Stale Artifact Sentinel',          action: 'Slack DM',         target: 'Renata Oliveira',  via: 'slack',    detail: 'CPQ Risk Register expires in 12 days. Refresh template attached.' },
  { ts: '2026-04-28 14:08', agent: 'A-11', agentName: 'Cross-Pillar Dependency Watcher',  action: 'Slack DM',         target: 'Jordan Reilly',    via: 'slack',    detail: 'INI-115 AI Governance at-risk → INI-101 Agentforce gate at risk. Cascade analysis attached.' },
  { ts: '2026-04-28 13:55', agent: 'A-05', agentName: 'Sponsor Brief Agent',              action: 'Drafted email',    target: 'Sr Mgr',           via: 'email',    detail: 'Briefing for Tom Harlow (CRO) 1:1 on 5/2 ready for review (6 initiatives covered).' },
  { ts: '2026-04-28 12:31', agent: 'A-12', agentName: 'New Intake Triage Agent',          action: 'Triaged + routed', target: 'Aisha Patel',      via: 'slack',    detail: 'New intake "DSAR Automation v2" → ACCEPT (RICE 1.8); routed to Trust & Security pillar.' },
  { ts: '2026-04-28 09:00', agent: 'A-06', agentName: 'Coaching Opportunity Scout',       action: 'Posted to feed',   target: 'Sr Mgr',           via: 'snowflake',detail: '5 coaching signals detected (overdue 1:1, leave coverage, stretch-ready, 2 patterns).' },
  { ts: '2026-04-28 06:30', agent: 'A-08', agentName: 'Capital Burn Forecaster',          action: 'Email digest',     target: 'Sr Mgr',           via: 'email',    detail: 'Weekly forecast: 3 hot (CPQ +18%, Workday +12%), 1 cold (AI Governance -34%).' },
  { ts: '2026-04-28 06:00', agent: 'A-03', agentName: 'Audit Trail Compliance Check',     action: 'Compliance check', target: '—',               via: 'snowflake',detail: '247 state changes audited · 0 gaps · no email needed.' },
  { ts: '2026-04-27 16:00', agent: 'A-04', agentName: 'Pillar PM Weekly Brief Drafter',   action: 'Drafted briefs',   target: 'Sr Mgr',           via: 'email',    detail: '4 weekly briefs drafted (Jordan, Marcus, Aisha, Renata).' },
  { ts: '2026-04-27 11:42', agent: 'A-10', agentName: 'Off-Track Triage Agent',           action: 'Escalation draft', target: 'Tom Harlow (CRO)', via: 'email',    detail: 'INI-110 CPQ off-track → escalation drafted, 5/2 calendar slot booked, Jira ticket opened.' },
  { ts: '2026-04-27 08:00', agent: 'A-07', agentName: 'Capacity Conflict Detector',       action: 'Conflict alert',   target: 'Marcus + Marcus',  via: 'slack',    detail: 'Workday + HR Data Cloud share 4 FTE in Q3. Proposed serial sequencing.' },
  { ts: '2026-04-26 06:00', agent: 'A-02', agentName: 'Risk Register Refresher',          action: 'Created tickets',  target: 'Renata + David',   via: 'jira',     detail: '2 Jira tickets created for stale Risk Registers (CPQ, Anaplan).' },
  { ts: '2026-04-26 06:00', agent: 'A-03', agentName: 'Audit Trail Compliance Check',     action: 'Compliance check', target: '—',               via: 'snowflake',detail: '203 state changes audited · 1 gap (manual override on INI-103, justified). Resolved.' }
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
