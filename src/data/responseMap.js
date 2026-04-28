// PortfolioCopilot pre-built responses.
// Keyword match -> structured answer with reasoning steps, sources, and confidence.

export const SAMPLE_QUESTIONS = [
  'Which initiatives are at risk this quarter?',
  "What's our capital allocation by pillar?",
  'Show me dependencies for Agentforce Internal Rollout',
  'Which initiatives are overdue for stage-gate review?',
  'What if Q3 budget is cut by 15% — which initiatives are exposed?',
  'Which initiatives align with the Agentforce strategy?',
  'Where are we over-capacity?'
];

export const RESPONSES = [
  {
    keywords: ['at risk', 'risk this quarter', 'risky'],
    classify: { category: 'Risk & Health', subtopic: 'Status drill-down' },
    sources: ['initiative_inventory.status', 'stage_gate_artifacts.status'],
    reasoning: [
      'Filter initiative_inventory where status IN (at_risk, off_track)',
      'Join stage_gate_artifacts to surface root cause (expired, missing, needs_review)',
      'Compute exposed budget = SUM(budget_allocated - budget_spent)',
      'Rank by sponsor seniority + budget exposure'
    ],
    answer: `**5 of 16 initiatives are at risk or off track**, exposing **$8.5M in unspent budget**.

| Initiative | Status | Pillar | Root Cause |
|---|---|---|---|
| Workday HRIS Migration | OFF TRACK | Employee Productivity | Risk Register expired 2026-04-20; 85% spent, 50% built |
| CPQ Modernization | OFF TRACK | Field Engagement | Risk Register expired 2026-03-05; over-FTE allocated |
| Anaplan Capital Planning | AT RISK | Finance & Ops | PRD needs review since Feb; sponsor unblocked yet |
| ServiceNow Consolidation | AT RISK | Finance & Ops | Capacity plan MISSING; biggest capital exposure ($3.7M unspent) |
| AI Governance Framework | AT RISK | Trust & Security | PRD needs review; gates Agentforce Internal Rollout (DEP-03) |

**Recommended actions:**
1. Escalate ServiceNow Consolidation — missing capacity plan + $4.2M budget = governance breach
2. Force-refresh Risk Registers on Workday + CPQ before any further spend
3. Prioritize AI Governance review — it gates the org's #1 OKR (Agentforce)`,
    confidence: 0.94
  },
  {
    keywords: ['capital', 'allocation', 'budget by'],
    classify: { category: 'Capital Allocation', subtopic: 'Pillar breakdown' },
    sources: ['initiative_inventory.budget_allocated', 'initiative_inventory.pillar'],
    reasoning: [
      'Group initiative_inventory by pillar',
      'Aggregate SUM(budget_allocated), SUM(budget_spent), COUNT(initiative_id)',
      'Compute % of total portfolio capital by pillar',
      'Flag pillars where allocated > capacity'
    ],
    answer: `**Total active portfolio: $30.0M across 16 initiatives, 6 pillars.**

| Pillar | Initiatives | Allocated | % of Total | Spent % |
|---|---|---|---|---|
| Data & AI Platform | 4 | $9.3M | 31% | 41% |
| Finance & Ops Tech | 2 | $6.0M | 20% | 12% |
| Customer Experience | 2 | $3.1M | 10% | 31% |
| Field Engagement | 2 | $3.6M | 12% | 70% |
| Employee Productivity | 3 | $5.1M | 17% | 70% |
| Trust & Security | 3 | $2.9M | 10% | 39% |

**Observations:**
- Data & AI is the heaviest pillar — consistent with V25-Agentforce being the top OKR
- Field Engagement and Employee Productivity are >70% spent mid-year — watch for overruns in Q3
- Trust & Security is the lightest at 10% but gates 2 high-priority initiatives via dependencies`,
    confidence: 0.96
  },
  {
    keywords: ['dependencies', 'agentforce', 'INI-101'],
    classify: { category: 'Dependencies & Sequencing', subtopic: 'Initiative graph' },
    sources: ['dependencies', 'initiative_inventory'],
    reasoning: [
      'Lookup initiative_id for "Agentforce Internal Rollout" → INI-101',
      'Query dependencies WHERE downstream = INI-101 (upstream blockers)',
      'Query dependencies WHERE upstream = INI-101 (downstream consumers)',
      'Annotate with each blocker\'s status + risk level'
    ],
    answer: `**Agentforce Internal Rollout (INI-101)** has **2 high-risk upstream dependencies**:

**Blocked by:**
- 🔴 **INI-116 Data Lakehouse on Snowflake** (G2 Build, on_track) — provides grounding data; "blocks" type
- 🔴 **INI-115 AI Governance Framework** (G1 Plan, **AT RISK**) — gates production launch; "gates" type

**Risk note:** AI Governance Framework's PRD is in needs_review since 2026-02-15. If it slips, Agentforce launch slips. Recommend pulling INI-115's PRD review forward before sponsor escalation.

**Downstream impact:** INI-101 has no downstream blockers — it's a leaf initiative on the dependency graph, so a delay here doesn't cascade.`,
    confidence: 0.92
  },
  {
    keywords: ['overdue', 'stale', 'review', 'last reviewed'],
    classify: { category: 'Governance Hygiene', subtopic: 'Review cadence' },
    sources: ['initiative_inventory.last_reviewed', 'stage_gate_artifacts.expires'],
    reasoning: [
      'Filter initiatives where last_reviewed > 30 days ago (today: 2026-04-27)',
      'Cross-reference with stage_gate_artifacts.status IN (needs_review, expired, missing)',
      'Rank by days_overdue DESC'
    ],
    answer: `**4 initiatives are overdue for stage-gate review** (>30 days since last review):

| Initiative | Last Reviewed | Days Overdue | Artifact Issue |
|---|---|---|---|
| CPQ Modernization | 2026-03-12 | 46 | Risk Register EXPIRED |
| AI Governance Framework | 2026-03-15 | 43 | PRD needs review |
| ServiceNow Consolidation | 2026-03-25 | 33 | Capacity Plan MISSING |
| Anaplan Capital Planning | 2026-03-30 | 28 | PRD needs review |

**Stage-gate compliance score: 88%** (14/16 initiatives current)

**Suggested cadence:** Set automated nudge at day 21, escalate to sponsor at day 45. Schedule a 90-min portfolio review every other Tuesday to clear the backlog.`,
    confidence: 0.95
  },
  {
    keywords: ['cut', '15%', 'budget cut', 'exposure', 'scenario'],
    classify: { category: 'Scenario Planning', subtopic: 'Budget sensitivity' },
    sources: ['initiative_inventory.budget_allocated', 'initiative_inventory.okr_mapping', 'dependencies'],
    reasoning: [
      'Compute total allocated = $30.0M; 15% cut = $4.5M reduction',
      'Apply protect-list: V25-Agentforce + V25-Trust = untouchable',
      'Rank remaining initiatives by alignment_score ASC, then by budget DESC',
      'Run dependency check — cutting an upstream blocks downstream',
      'Surface 3 scenario options'
    ],
    answer: `**A 15% Q3 cut = $4.5M to find.** Three viable scenarios:

**Scenario A — "Stretch the slow":** Defer 3 G0/G1 initiatives by 1 quarter
- INI-108 Customer 360 Voice (-$1.2M)
- INI-104 Anaplan Migration (-$1.8M)
- INI-107 Privacy Vault (-$1.3M)
- **Total: -$4.3M** | Risk: legal team unhappy about Privacy Vault delay; CFO unhappy about Anaplan

**Scenario B — "Cut the bloat":** Right-size two struggling initiatives
- INI-110 CPQ Modernization (-$1.6M, scope down to MVP)
- INI-112 ServiceNow Consolidation (-$2.9M, defer phase 2)
- **Total: -$4.5M** | Risk: lowest if sponsors agree; recovers stalled budget

**Scenario C — "Across the board":** 15% haircut on every non-protected initiative
- **Total: -$4.5M** | Risk: signal of weak prioritization; every PM negotiates separately

**Recommendation: Scenario B.** Concentrates pain on two initiatives already off-track or missing artifacts — the org is already paying the cost; this just formalizes it.`,
    confidence: 0.89
  },
  {
    keywords: ['agentforce', 'aligned', 'okr', 'strategy', 'v25'],
    classify: { category: 'Strategic Alignment', subtopic: 'OKR mapping' },
    sources: ['initiative_inventory.okr_mapping'],
    reasoning: [
      'Filter initiatives where okr_mapping CONTAINS "V25-Agentforce"',
      'Sum budget by stage to show investment distribution',
      'Highlight initiatives that are NOT mapped — candidates for review'
    ],
    answer: `**5 initiatives map to V25-Agentforce** ($9.5M, 32% of portfolio):

| Initiative | Stage | Status | Budget |
|---|---|---|---|
| Agentforce Internal Rollout | G2 Build | on_track | $2.4M |
| Slack Huddles AI Summaries | G2 Build | on_track | $480K |
| AI Governance Framework | G1 Plan | **at_risk** | $850K |
| Customer 360 Voice (Genie+) | G0 Concept | on_track | $1.2M |
| Data Lakehouse on Snowflake | G2 Build | on_track | $5.2M |

**4 initiatives have NO V25 OKR mapping** ($3.5M, 12%) — candidates for re-scoping:
- INI-105 Slack Sales Elevate (only mapped to V25-Customer-360 — could add V25-Employee-AI)
- INI-109 Mulesoft API Hub — only V25-Margin
- INI-111 Tableau Embedded — only V25-Margin
- INI-114 Slack Huddles — already mapped, ignore

**Strategic alignment score: 91%** (target ≥90%) ✅`,
    confidence: 0.93
  },
  {
    keywords: ['over capacity', 'over-capacity', 'overallocated', 'capacity'],
    classify: { category: 'Capacity Planning', subtopic: 'FTE saturation' },
    sources: ['pillars.capacity_fte', 'initiative_inventory.fte'],
    reasoning: [
      'For each pillar, compute SUM(initiative.fte) where status != complete',
      'Compare to pillar.capacity_fte',
      'Flag pillars where allocated > capacity',
      'Identify shared-resource dependencies that compound the issue'
    ],
    answer: `**2 of 6 pillars are over-capacity:**

| Pillar | Capacity | Allocated | Variance |
|---|---|---|---|
| 🔴 Employee Productivity | 28 FTE | 31 FTE | **+3 (110%)** |
| 🔴 Finance & Ops Tech | 30 FTE | 33 FTE | **+3 (110%)** |
| 🟡 Data & AI Platform | 42 FTE | 40 FTE | 95% (near cap) |
| 🟢 Customer Experience | 38 FTE | 36 FTE | 95% |
| 🟢 Field Engagement | 26 FTE | 24 FTE | 92% |
| 🟢 Trust & Security | 22 FTE | 19 FTE | 86% |

**Compounding risk:** DEP-05 — Workday HRIS and HR Data Cloud share 4 FTEs in Q3 within Employee Productivity. The 110% allocation is partially double-counted.

**Options:** (a) Re-baseline EP capacity (hire 3 contractors), (b) sequence Workday and HR Data Cloud serially, (c) borrow 2 FTE from Trust & Security (under-allocated). Recommendation: option (b) — preserves headcount and acknowledges the dependency.`,
    confidence: 0.91
  }
];

export const FALLBACK = {
  classify: { category: 'Unmapped', subtopic: '—' },
  sources: ['initiative_inventory'],
  reasoning: [
    'No keyword match in response library',
    'Routing to human portfolio analyst',
    'Logging question as candidate for taxonomy expansion'
  ],
  answer: `I don't have a confident answer for that question yet — and I'd rather route it to a human analyst than guess.

In production, this question would: (1) be logged as an unmapped query, (2) get tagged for taxonomy expansion, and (3) route to the on-call portfolio analyst. Over time, low-confidence questions become inputs for expanding the response library — same pattern as TrustReply's CCF expansion model.

Try one of the suggested questions above to see how the agent reasons through governed data.`,
  confidence: 0.42
};

export function findResponse(text) {
  const q = (text || '').toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => q.includes(k))) return r;
  }
  return FALLBACK;
}
