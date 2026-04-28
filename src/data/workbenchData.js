// Workbench data: message templates, distribution lists, active drafts, recent sends.
// The Workbench is where Sr Managers compose portfolio-level communications.

export const MESSAGE_TEMPLATES = [
  {
    id: 'mt-exec-update',
    name: 'Monthly Exec Update',
    audience: 'DET Leadership Council',
    cadence: 'Monthly · 1st Wednesday',
    estimatedTime: '45 min draft + 15 min review',
    icon: '📊',
    structure: [
      { name: 'Headline',                       guidance: 'One sentence — the most important thing this month.' },
      { name: 'Portfolio Health Snapshot',       guidance: '5 KPIs (target vs actual) with 1-line commentary each.' },
      { name: 'Wins (3)',                        guidance: 'Specific wins with attribution. Numbers, not adjectives.' },
      { name: 'Risks Needing Exec Attention (3)',guidance: 'Top 3 risks with a specific ask each.' },
      { name: 'Decisions Needed',                guidance: 'Decisions you want from this group, with options + recommendation.' }
    ],
    aiAssist: 'Pulls headline + KPIs from Dashboard. Pulls risks from Process Health anti-patterns. Pulls wins from Team Cockpit weekly briefs.',
    sample: `**Headline:** Portfolio health at 69%; CPQ + ServiceNow concentrate the risk. Need go/no-go on Q3 -15% scenario.

**Portfolio Health Snapshot**
- Health Score: 69% (target ≥80%) — 5 of 16 active off-track or at-risk
- Capital Utilization: 77% — on plan
- Stage-Gate Compliance: 88% — improving (+2pts vs March)
- Avg Time-in-Stage: 47d — within range
- Strategic Alignment: 91% — green

**Wins**
- Trust Center 2.0 launched on time, on budget; first AI vendor under EU-US DPF
- Tableau Embedded shipped 2 weeks early, $28K under
- AI Governance PRD finally cleared (was the biggest cross-portfolio blocker)

**Risks Needing Exec Attention**
- INI-110 CPQ off-track (Risk Register expired, over-FTE) — ASK: CRO sign-off on scope cut to MVP
- INI-112 ServiceNow missing Capacity Plan ($4.2M exposure) — ASK: defer Phase 2 to FY27
- 2 pillars over-capacity (EP, FOT) — ASK: hire 3 contractors OR sequence Workday/HR Data Cloud serially

**Decisions Needed**
- Q3 -15% scenario (see Decision Engine → Scenario Compare): recommend Scenario B (Cut the Bloat)`,
    relatedSources: ['Dashboard', 'Process Health', 'Decision Engine', 'Team Cockpit']
  },

  {
    id: 'mt-sponsor-brief',
    name: 'Sponsor 1:1 Brief',
    audience: 'Single Executive Sponsor',
    cadence: 'Bi-weekly per sponsor',
    estimatedTime: '20 min',
    icon: '💼',
    structure: [
      { name: 'Initiative Status',     guidance: 'Stage, status, % complete, % budget spent.' },
      { name: 'Last 2 Weeks',          guidance: 'What shipped, what slipped, key decisions made.' },
      { name: 'Next 2 Weeks',          guidance: 'What\'s on the path, expected milestones.' },
      { name: 'Where I Need You',       guidance: 'One specific ask, framed as a decision.' },
      { name: 'Risks I\'m Tracking',     guidance: '2-3 risks, with mitigations in flight.' }
    ],
    aiAssist: 'Pulls per-initiative state from initiative_inventory. Pulls recent stage-gate events from audit trail. Pulls risks from Risk Register.',
    sample: `**INI-101 Agentforce Internal Rollout · for Srini K. (CIO)**

**Status:** G2 Build · on_track · 45% scope complete · 45% budget spent

**Last 2 Weeks:**
- Sprint 6 of 12 shipped (50% feature scope)
- Internal dogfood expanded to 30 power users; 4.2/5 helpfulness
- AI Governance dependency PRD finally approved (Aisha)

**Next 2 Weeks:**
- Sprint 7-8: tool-calling integration with Slack + Quip
- Mid-build review with security team (May 5)
- First customer-facing demo at AgentForce Summit (May 12)

**Where I Need You:**
- One ask: please confirm headcount for the post-G4 ops team (need 3 FTE for sustain). Decision needed by 2026-05-15 to avoid execution gap at launch.

**Risks I'm Tracking:**
- (1) Lakehouse delay would cascade — Jordan confirms on track for May 30
- (2) Vendor concentration on Azure OpenAI — Anthropic eval starting Q3 as backup`,
    relatedSources: ['initiative_inventory', 'audit trail', 'Risk Register']
  },

  {
    id: 'mt-all-hands',
    name: 'All-DET Hands Update',
    audience: 'Full DET org (~280 people)',
    cadence: 'Quarterly',
    estimatedTime: '90 min draft + 30 min review',
    icon: '📣',
    structure: [
      { name: 'What we shipped this quarter', guidance: '5-7 initiatives that crossed a gate. Make the team feel it.' },
      { name: 'What we learned',              guidance: '2 specific learnings (one win, one near-miss).' },
      { name: 'What\'s next quarter',           guidance: 'Top 3 strategic bets + how each pillar contributes.' },
      { name: 'Recognition',                  guidance: 'Specific shout-outs. People remember the names.' }
    ],
    aiAssist: 'Pulls launches + completions from initiative_inventory. Pulls retro learnings from sunset playbook archive.',
    sample: `Auto-draft available — click Compose →`,
    relatedSources: ['Dashboard', 'audit trail', 'Sunset retros']
  },

  {
    id: 'mt-escalation',
    name: 'Initiative Off-Track Escalation',
    audience: 'Sponsor + CRO/CFO/CIO + Pillar PM',
    cadence: 'On demand · within 48h of off_track flag',
    estimatedTime: '30 min',
    icon: '🚨',
    structure: [
      { name: 'TL;DR',          guidance: 'One paragraph: what\'s broken, what\'s at risk, what you propose.' },
      { name: 'How we got here',  guidance: 'Brief timeline. No blame. Just facts.' },
      { name: 'The fork in the road', guidance: 'Three options with trade-offs. Recommend one with rationale.' },
      { name: 'Decision needed by', guidance: 'Specific date. What\'s the cost of delay?' }
    ],
    aiAssist: 'Pulls initiative state + audit trail + risk register. Surfaces the Decision Engine scenario nearest to the situation.',
    sample: `**INI-110 CPQ Modernization — Off-Track Escalation**

**TL;DR:** CPQ is 78% spent / 50% built with an expired Risk Register. We need to either scope-cut to MVP (recover $1.6M) or fully re-baseline. Recommendation: scope cut.

**How we got here:** Scope grew from 4 to 7 product lines without a re-baseline at G2. Risk Register lapsed in March; over-FTE since Feb.

**Fork in the road:**
- A. Hold scope, add 2 contractors, push launch to Q4 (+$800K, +1 quarter)
- B. **Cut to MVP, ship Q3, defer 3 product lines (-$1.6M, +0 quarter)** ← recommend
- C. Pause and re-evaluate at next portfolio review (worst — capital keeps burning)

**Decision needed by:** 2026-05-02 (start of next sprint). Cost of delay: ~$240K/week.`,
    relatedSources: ['Decision Engine', 'Risk Register', 'audit trail']
  },

  {
    id: 'mt-launch',
    name: 'Milestone Launch Announcement',
    audience: 'All-DET + Stakeholders + Customers (where applicable)',
    cadence: 'On demand · per launch',
    estimatedTime: '60 min',
    icon: '🚀',
    structure: [
      { name: 'Headline',           guidance: 'What launched + the headline benefit.' },
      { name: 'What it does',        guidance: '2-3 sentences. No jargon.' },
      { name: 'Why it matters',      guidance: 'Connect to OKR + customer outcome.' },
      { name: 'How to use it',       guidance: 'Link to runbook + onboarding session calendar.' },
      { name: 'Recognition',         guidance: 'Name the team. Specifically.' }
    ],
    aiAssist: 'Pulls launch metadata from initiative_inventory + Launch Readiness artifact.',
    sample: 'Auto-draft available — click Compose →',
    relatedSources: ['Launch Readiness artifact', 'audit trail']
  },

  {
    id: 'mt-rebalance',
    name: 'Quarterly Rebalance Recommendation',
    audience: 'CFO + CIO + Pillar PMs',
    cadence: 'Quarterly · weeks 10-12 of each fiscal quarter',
    estimatedTime: '2 days draft + 4h review',
    icon: '⚖️',
    structure: [
      { name: 'Proposed shape of the portfolio', guidance: 'What stays, what flexes, what drops.' },
      { name: 'Three candidate scenarios',         guidance: 'Status Quo + Up 10% + Down 10%, with deltas.' },
      { name: 'Recommendation + rationale',        guidance: 'Pick one. Explain the trade-offs.' },
      { name: 'Implementation plan',               guidance: 'Who does what, by when.' }
    ],
    aiAssist: 'Auto-generates from Decision Engine → Scenario Compare with KPI Studio recommendations layered in.',
    sample: 'Auto-draft via Decision Engine + KPI Studio',
    relatedSources: ['Decision Engine', 'KPI Studio', 'Quarterly Rebalance Playbook']
  },

  {
    id: 'mt-pm-digest',
    name: 'Pillar PM Weekly Digest',
    audience: 'All Pillar Portfolio Managers',
    cadence: 'Weekly · Friday afternoon',
    estimatedTime: '15 min',
    icon: '📋',
    structure: [
      { name: 'This week\'s ask',         guidance: 'One thing you need from Pillar PMs this week.' },
      { name: 'Cross-pillar items',      guidance: 'Things that affect more than one pillar.' },
      { name: 'Process change spotlight', guidance: 'Any new playbook / framework / template.' },
      { name: 'Recognition',             guidance: 'Specific Pillar PM win to amplify.' }
    ],
    aiAssist: 'Pulls cross-pillar items from dependencies + Process Health anti-patterns.',
    sample: 'Auto-draft available — click Compose →',
    relatedSources: ['Process Health', 'dependencies', 'Playbooks']
  },

  {
    id: 'mt-cfo-memo',
    name: 'CFO Capital Allocation Memo',
    audience: 'CFO + Finance Partners',
    cadence: 'Per major capital request',
    estimatedTime: '2 hours',
    icon: '🏦',
    structure: [
      { name: 'The ask',                     guidance: 'Specific $ amount, specific use, specific outcome.' },
      { name: 'TCO breakdown',                guidance: 'Build + Run + Change + Opportunity (use Value & TCO Engine).' },
      { name: 'Expected return',              guidance: 'Net Value + ROI + Payback. Use Decision Engine numbers.' },
      { name: 'Alternatives considered',     guidance: 'Build vs buy, in-house vs vendor, scoped MVP.' },
      { name: 'Risk-adjusted decision criteria', guidance: 'What would make us cancel? Specific gates.' }
    ],
    aiAssist: 'Pulls TCO + benefit decomposition from Decision Engine → Value & TCO Engine.',
    sample: 'Auto-draft via Decision Engine',
    relatedSources: ['Decision Engine Value & TCO Engine', 'KPI Studio']
  }
];

export const DISTRIBUTION_LISTS = [
  {
    id: 'dl-leadership',
    name: 'DET Leadership Council',
    purpose: 'Sr Director + Directors across DET; final escalation point',
    memberCount: 12,
    sampleMembers: ['Judette Platz (Sr Director)', 'Lauren Hudson (Business Process Lead)', 'Aarti Vyas (Architecture)'],
    channels: ['Email', 'Quip canvas']
  },
  {
    id: 'dl-pillar-pms',
    name: 'Pillar Portfolio Managers',
    purpose: 'All 4 Pillar PM direct reports + 2 peer Sr Managers',
    memberCount: 6,
    sampleMembers: ['Jordan Reilly', 'Marcus Chen', 'Aisha Patel', 'Renata Oliveira'],
    channels: ['Slack #det-portfolio-pms', 'Weekly digest email']
  },
  {
    id: 'dl-sponsors',
    name: 'Executive Sponsors',
    purpose: 'VPs sponsoring active DET initiatives',
    memberCount: 9,
    sampleMembers: ['Srini K. (CIO)', 'Lena Wu (CTrO)', 'Ravi Ahuja (CFO)', 'Tom Harlow (CRO)', 'Nina Burke (CHRO)'],
    channels: ['Targeted email', 'Bi-weekly 1:1s']
  },
  {
    id: 'dl-all-det',
    name: 'All-DET Function Heads',
    purpose: 'All 280 DET employees, every functional lead',
    memberCount: 47,
    sampleMembers: ['VPs across DET', 'Eng Directors', 'Product Directors', 'Design Directors'],
    channels: ['Quarterly all-hands', 'Quip channel']
  },
  {
    id: 'dl-cross-fn',
    name: 'Cross-Functional Stakeholders',
    purpose: 'Sales, Customer Success, Marketing, Finance leadership touched by DET',
    memberCount: 18,
    sampleMembers: ['Sales Ops VP', 'CS VP', 'Finance Partner Director', 'Marketing Tech VP'],
    channels: ['Targeted email per topic']
  }
];

export const ACTIVE_DRAFTS = [
  { id: 'd-01', template: 'Monthly Exec Update',                title: 'April 2026 Portfolio Update',                       status: 'in-review', owner: 'Sr Mgr', dueDate: '2026-04-29', distributionId: 'dl-leadership',  reviewers: 'Judette Platz', wordCount: 612, completeness: 90 },
  { id: 'd-02', template: 'Initiative Off-Track Escalation',     title: 'INI-110 CPQ Q3 Re-baseline',                        status: 'draft',     owner: 'Sr Mgr', dueDate: '2026-05-02', distributionId: 'dl-sponsors',    reviewers: '—',           wordCount: 380, completeness: 65 },
  { id: 'd-03', template: 'Quarterly Rebalance Recommendation',  title: 'Q3 Rebalance — 3 scenarios',                        status: 'sponsor-review', owner: 'Sr Mgr', dueDate: '2026-05-12', distributionId: 'dl-leadership', reviewers: 'Aarti Vyas', wordCount: 1240, completeness: 75 },
  { id: 'd-04', template: 'Milestone Launch Announcement',       title: 'Agentforce Internal Soft Launch (May 12)',          status: 'drafting',  owner: 'Sr Mgr', dueDate: '2026-05-08', distributionId: 'dl-all-det',     reviewers: '—',           wordCount: 280, completeness: 40 },
  { id: 'd-05', template: 'CFO Capital Allocation Memo',         title: 'INI-115 AI Governance — incremental $400K request', status: 'needs-write', owner: 'Sr Mgr', dueDate: '2026-05-05', distributionId: 'dl-sponsors',    reviewers: '—',           wordCount: 0,   completeness: 0 }
];

export const RECENT_SENDS = [
  { id: 's-01', title: 'INI-110 CPQ Off-Track Escalation',         template: 'Off-Track Escalation', sent: '2026-04-22', audience: 'CRO + Pillar PMs',     readRate: 100, replies: 4, signal: 'high engagement; 4 follow-up meetings booked' },
  { id: 's-02', title: 'Pillar PM Weekly Digest #16',               template: 'PM Weekly Digest',     sent: '2026-04-19', audience: 'Pillar PMs',           readRate: 100, replies: 1, signal: 'normal cadence' },
  { id: 's-03', title: 'March Monthly Exec Update',                 template: 'Monthly Exec Update',  sent: '2026-04-02', audience: 'Leadership Council',   readRate: 100, replies: 3, signal: 'AI Governance question came up — addressed in INI-115 ask' },
  { id: 's-04', title: 'Trust Center 2.0 Launch Announcement',      template: 'Launch Announcement',  sent: '2026-03-26', audience: 'All-DET + Customers',  readRate: 92,  replies: 12, signal: 'strong external pickup; cited in 3 customer renewals' },
  { id: 's-05', title: 'Q2 Capacity Plan Lock-in',                  template: 'Custom',                sent: '2026-03-15', audience: 'Pillar PMs + Sponsors', readRate: 100, replies: 8, signal: 'capacity-plan adoption rose to 100% post-send' }
];

export const STATUS_META = {
  'draft':         { pill: 'pill-gray',    label: 'Draft',          desc: 'Initial draft, not ready for review' },
  'drafting':      { pill: 'pill-blue',    label: 'Drafting',       desc: 'Actively being written' },
  'in-review':     { pill: 'pill-yellow',  label: 'In Review',      desc: 'Sent for peer / SME review' },
  'sponsor-review':{ pill: 'pill-yellow',  label: 'Sponsor Review', desc: 'Awaiting sponsor sign-off' },
  'needs-write':   { pill: 'pill-red',     label: 'Needs Write',    desc: 'Not started; due soon' },
  'sent':          { pill: 'pill-green',   label: 'Sent',           desc: 'Distributed' }
};
