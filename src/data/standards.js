// Standards content: Metric Catalog + Data Glossary.
// These define the canonical vocabulary and metric definitions used across
// every other tab. The Source of Truth tab is where ambiguity goes to die.

// ============================================================================
// METRIC CATALOG — Canonical definitions for every metric used in the portfolio.
// Different from KPI Studio (which is for configurable scoring). This is the
// authoritative reference: WHAT does this metric mean, WHO owns it, WHERE is
// it used, HOW often does it refresh.
// ============================================================================

export const METRIC_CATEGORIES = [
  { id: 'health',   label: 'Health',   color: 'sgreen',  desc: 'Are initiatives on track?' },
  { id: 'capital',  label: 'Capital',  color: 'sfdeep',  desc: 'Is money being spent well?' },
  { id: 'resource', label: 'Resource', color: 'syellow', desc: 'Are people allocated efficiently?' },
  { id: 'risk',     label: 'Risk',     color: 'sred',    desc: 'How exposed are we?' },
  { id: 'value',    label: 'Value',    color: 'sfblue',  desc: 'What outcomes are we generating?' },
  { id: 'process',  label: 'Process',  color: 'sflight', desc: 'How well does the portfolio process work?' }
];

export const METRIC_CATALOG = [
  // HEALTH
  { id: 'mc-01', name: 'Portfolio Health Score', category: 'health',
    definition: '% of active initiatives in on_track status. Excludes complete initiatives. The single most important leading indicator for portfolio reporting.',
    formula: 'COUNT(active initiatives WHERE status=on_track) / COUNT(active initiatives) × 100',
    target: '≥ 80%', currentValue: '69% (11/16 active)',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'initiative_inventory.status',
    refresh: 'Real-time', version: 'v1.2', lastReviewed: '2026-04-15',
    usedIn: ['Dashboard KPI strip', 'Monthly Exec Update', 'Quarterly Rebalance Memo', 'Process Health'],
    related: ['Stage-Gate Compliance', 'Strategic Alignment Score'] },

  { id: 'mc-02', name: 'Stage-Gate Compliance', category: 'health',
    definition: '% of active initiatives whose required stage-gate artifacts are approved AND not expired. Measures governance hygiene, not value.',
    formula: 'COUNT(initiatives WHERE all required artifacts.status=approved AND not_expired) / COUNT(active) × 100',
    target: '100%', currentValue: '88%',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'stage_gate_artifacts',
    refresh: 'Daily (auto-expire job at 06:00 PT)', version: 'v1.0', lastReviewed: '2026-04-01',
    usedIn: ['Dashboard KPI strip', 'Process Health', 'Stage-Gate Scorer'],
    related: ['Artifact Rework Rate', 'Cycle Time per Gate'] },

  { id: 'mc-03', name: 'Strategic Alignment Score', category: 'health',
    definition: '% of active initiatives mapped to one or more V25 OKRs. Unmapped initiatives are candidates for re-scoping or sunset.',
    formula: 'COUNT(initiatives WHERE okr_mapping IS NOT EMPTY) / COUNT(active) × 100',
    target: '≥ 90%', currentValue: '91%',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'initiative_inventory.okr_mapping',
    refresh: 'Real-time', version: 'v1.1', lastReviewed: '2026-04-10',
    usedIn: ['Dashboard KPI strip', 'Quarterly Rebalance', 'Sunset Playbook'],
    related: ['Portfolio Health Score'] },

  // CAPITAL
  { id: 'mc-04', name: 'Capital Utilization', category: 'capital',
    definition: 'Total $ spent vs total $ allocated across active initiatives. Below 70% mid-year suggests under-investment; above 90% suggests overrun risk.',
    formula: 'SUM(initiative.budget_spent) / SUM(initiative.budget_allocated) × 100',
    target: '70–90% mid-year', currentValue: '77%',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'initiative_inventory.budget_spent / budget_allocated',
    refresh: 'Weekly (Anaplan reconciliation)', version: 'v1.0', lastReviewed: '2026-04-08',
    usedIn: ['Dashboard KPI strip', 'Capital Optimizer', 'Margin-First Profile'],
    related: ['Net Value', 'ROI %', 'Budget Discipline'] },

  { id: 'mc-05', name: 'Net Value', category: 'capital',
    definition: 'Total benefit minus total TCO across the lifecycle. Absolute dollar value created. Positive = creates value.',
    formula: '(revenue + savings + risk_avoided + strategic) − (build + run3yr + change + opportunity)',
    target: 'Positive at portfolio level', currentValue: '+$48.6M',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'derived from initiative_inventory + financial models',
    refresh: 'Monthly', version: 'v1.3', lastReviewed: '2026-04-02',
    usedIn: ['Decision Engine Value & TCO Engine', 'KPI Studio', 'Quarterly Rebalance'],
    related: ['ROI %', 'Capital Utilization', 'Payback Period'] },

  { id: 'mc-06', name: 'ROI %', category: 'capital',
    definition: 'Lifetime return on investment. Below cost-of-capital (~10%) is suspect.',
    formula: '(Net Value / Total TCO) × 100',
    target: '≥ 50%', currentValue: 'Avg 87% across portfolio',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'derived',
    refresh: 'Monthly', version: 'v1.0', lastReviewed: '2026-03-15',
    usedIn: ['Decision Engine', 'KPI Studio', 'CFO Memo template'],
    related: ['Net Value', 'Payback Period', 'TCO Efficiency'] },

  // RESOURCE
  { id: 'mc-07', name: 'FTE Allocation', category: 'resource',
    definition: 'Total full-time equivalents committed to the active portfolio across all pillars and initiatives.',
    formula: 'SUM(active initiatives.ftes_allocated)',
    target: '≤ pillar capacity ceiling', currentValue: '183 FTE allocated against 186 FTE capacity (98%)',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'capacity_snapshots',
    refresh: 'Weekly (snapshot)', version: 'v1.0', lastReviewed: '2026-04-22',
    usedIn: ['Pillar Performance grid', 'Capacity Planning Playbook', 'Decision Engine'],
    related: ['Pillar Capacity Variance', 'Talent Risk Score'] },

  { id: 'mc-08', name: 'Pillar Capacity Variance', category: 'resource',
    definition: 'Difference between FTEs allocated and FTEs available per pillar. Positive variance = over-allocated (bad).',
    formula: '(fte_allocated − fte_capacity) for each pillar',
    target: '≤ 0% (no over-allocation)', currentValue: '2 of 6 pillars over-allocated (+10% each)',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'capacity_snapshots',
    refresh: 'Weekly', version: 'v1.0', lastReviewed: '2026-04-22',
    usedIn: ['Pillar Performance grid', 'PortfolioCopilot capacity answer'],
    related: ['FTE Allocation', 'Talent Risk Score'] },

  // RISK
  { id: 'mc-09', name: 'Risk Score', category: 'risk',
    definition: 'Probability × Impact for each initiative on a 1–5 scale each. Output 1–25. ≥16 = critical, ≥9 = high.',
    formula: 'Probability (1–5) × Impact (1–5)',
    target: '≤ 9 per initiative', currentValue: 'Avg 8.2 across portfolio; 4 above 12',
    owner: 'Pillar PM (per initiative)', sourceSystem: 'risk_register (not yet centralized)',
    refresh: 'Quarterly (per Risk Register Template)', version: 'v1.0', lastReviewed: '2026-03-18',
    usedIn: ['Risk Heatmap', 'KPI Studio', 'Decision Engine'],
    related: ['Dependency Risk Aggregate', 'Talent Risk Score'] },

  { id: 'mc-10', name: 'Dependency Risk Aggregate', category: 'risk',
    definition: 'Composite risk from upstream initiatives. An initiative blocked by a high-risk upstream inherits that risk.',
    formula: 'SUM over upstream deps: (high_risk × 25 + medium_risk × 10 + low_risk × 3)',
    target: '≤ 30 per initiative', currentValue: 'Highest: INI-101 = 50 (gated by INI-115)',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'dependencies + initiative_inventory.status',
    refresh: 'Real-time', version: 'v0.9', lastReviewed: '2026-04-20',
    usedIn: ['PortfolioCopilot dependencies answer', 'KPI Studio'],
    related: ['Risk Score'] },

  { id: 'mc-11', name: 'Talent Risk Score', category: 'risk',
    definition: 'Risk of execution failure due to key-person dependence, hiring gaps, or contractor concentration.',
    formula: 'Composite of key_person_risk + hiring_gap + contractor_pct (manual input, 1-5 scale)',
    target: '≤ 3 per initiative', currentValue: 'Highest: INI-110 CPQ = 5 (Renata sole owner; 50% contractor)',
    owner: 'Pillar PM', sourceSystem: 'manual entry (Influence Factors)',
    refresh: 'Quarterly', version: 'v0.8', lastReviewed: '2026-03-30',
    usedIn: ['Influence Factors', 'KPI Studio', 'Team Cockpit insights'],
    related: ['FTE Allocation'] },

  // VALUE
  { id: 'mc-12', name: 'Value Realization %', category: 'value',
    definition: '% of expected lifetime benefit captured to date. Tracked from G3 Validate onward.',
    formula: 'realized_benefit_to_date / total_expected_benefit × 100',
    target: '≥ 80% by 6 months post-launch', currentValue: 'Trust Center 2.0: 100%; Tableau Embedded: 92%',
    owner: 'Pillar PM (per initiative)', sourceSystem: 'benefits_realization (planned table — not yet built)',
    refresh: 'Quarterly', version: 'v0.7 Draft', lastReviewed: '2026-04-12',
    usedIn: ['Portfolio Journey value bar', 'Sunset Playbook'],
    related: ['ROI %', 'Time-to-Value', 'Adoption Rate'] },

  { id: 'mc-13', name: 'Time-to-Value', category: 'value',
    definition: 'Months from G4 Launch to first measurable benefit captured.',
    formula: 'launch_date → first_benefit_month',
    target: '≤ 3 months', currentValue: 'Avg 2.4 months across launched initiatives',
    owner: 'Pillar PM', sourceSystem: 'benefits_realization',
    refresh: 'Monthly post-launch', version: 'v0.6', lastReviewed: '2026-04-05',
    usedIn: ['Portfolio Journey', 'Sponsor Brief template'],
    related: ['Value Realization %', 'Adoption Rate'] },

  { id: 'mc-14', name: 'Adoption Rate', category: 'value',
    definition: '% of target audience actively using the initiative output (weekly active where applicable).',
    formula: 'active_users / target_users × 100',
    target: '≥ 60% by 6 months post-launch', currentValue: 'Avg 71% across post-launch initiatives',
    owner: 'Pillar PM', sourceSystem: 'product analytics (per-initiative)',
    refresh: 'Weekly', version: 'v1.0', lastReviewed: '2026-04-25',
    usedIn: ['Portfolio Journey', 'Launch Announcement template'],
    related: ['Time-to-Value', 'Value Realization %'] },

  // PROCESS
  { id: 'mc-15', name: 'Cycle Time per Gate', category: 'process',
    definition: 'Median days an initiative spends in each gate before advancing. Higher than target = process friction.',
    formula: 'MEDIAN(stage_history WHERE entered=Gx → exited=Gx+1)',
    target: 'G0:21d, G1:30d, G2:90d, G3:21d, G4:14d', currentValue: 'G1 over-target (32d vs 30d)',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'stage_history audit log',
    refresh: 'Real-time', version: 'v1.0', lastReviewed: '2026-04-15',
    usedIn: ['Process Health', 'Quarterly Rebalance'],
    related: ['Stage-Gate Compliance', 'Artifact Rework Rate'] },

  { id: 'mc-16', name: 'Artifact Rework Rate', category: 'process',
    definition: '% of artifacts sent back for revision before approval. High rework = unclear template, wrong audience, or process timing problem.',
    formula: 'COUNT(artifacts WHERE revision_count > 1) / COUNT(submitted) × 100',
    target: '≤ 20%', currentValue: 'PRD: 38% (worst); Capacity Plan: 52%',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'stage_gate_artifacts.revision_count',
    refresh: 'Daily', version: 'v0.9', lastReviewed: '2026-04-20',
    usedIn: ['Process Health', 'Anti-Patterns detector'],
    related: ['Cycle Time per Gate'] },

  { id: 'mc-17', name: 'Pillar PM NPS', category: 'process',
    definition: 'Net Promoter Score from Pillar PMs on the portfolio process itself. Pillar PMs are the customers of the Sr Mgr role.',
    formula: 'Quarterly survey: % promoters − % detractors',
    target: '≥ +20', currentValue: 'Avg +8 across pillars; 2 pillars negative',
    owner: 'Sr Mgr Strategic Portfolio Mgmt', sourceSystem: 'quarterly survey (manual)',
    refresh: 'Quarterly', version: 'v1.0', lastReviewed: '2026-04-10',
    usedIn: ['Process Health', 'Q3 friction-reduction sprint'],
    related: ['Cycle Time per Gate', 'Artifact Rework Rate'] }
];

// ============================================================================
// DATA GLOSSARY — Canonical vocabulary for the portfolio.
// When ambiguity creeps in ("Is this an initiative or a project?"), this is
// the reference everyone points to.
// ============================================================================

export const GLOSSARY_CATEGORIES = [
  { id: 'work',      label: 'Work Units' },
  { id: 'taxonomy',  label: 'Taxonomy & State' },
  { id: 'artifact',  label: 'Artifacts' },
  { id: 'role',      label: 'Roles' },
  { id: 'finance',   label: 'Financial' },
  { id: 'risk',      label: 'Risk & Dependency' },
  { id: 'capacity',  label: 'Capacity' }
];

export const DATA_GLOSSARY = [
  // WORK UNITS
  { term: 'Initiative', category: 'work',
    def: 'A funded body of work tied to one or more strategic OKRs, owned by a Pillar PM, advancing through stages G0–G5. Sized $50K to $5M+.',
    aliases: [], examples: ['INI-101 Agentforce Internal Rollout', 'INI-115 AI Governance Framework'],
    related: ['Program', 'Project', 'Pillar', 'OKR'],
    dontConfuse: 'Project = execution-scoped. Initiative = strategy-tied + funded + sponsor-owned.' },

  { term: 'Program', category: 'work',
    def: 'A coordinated collection of related initiatives sharing a common strategic goal, sponsor, or technical platform.',
    aliases: ['Initiative cluster'], examples: ['Agentforce Program (INI-101 + INI-108 + INI-114 + INI-115)'],
    related: ['Initiative', 'Strategic Theme'],
    dontConfuse: 'A single initiative ≠ a program. Programs aggregate 3+ initiatives.' },

  { term: 'Project', category: 'work',
    def: 'An execution-scoped body of work inside an initiative. Has a defined start, end, deliverable, and team.',
    aliases: ['Workstream'], examples: ['INI-101 has 4 underlying projects: model integration, eval harness, UX, rollout'],
    related: ['Initiative'],
    dontConfuse: 'Project ≠ Initiative. Multiple projects ladder up to one initiative.' },

  { term: 'Epic', category: 'work',
    def: 'Engineering-team-scoped unit of work, typically inside a project. Used in Jira/GUS for sprint planning.',
    aliases: [], examples: ['EPIC: Implement reasoning panel'],
    related: ['Project'],
    dontConfuse: 'Epic is engineering grain; Initiative is portfolio grain. Don\'t mix in exec reporting.' },

  // TAXONOMY & STATE
  { term: 'Pillar', category: 'taxonomy',
    def: 'A top-level functional grouping in DET. Each pillar is owned by a Pillar PM and has its own quarterly capacity + budget envelope.',
    aliases: ['DET Pillar'], examples: ['Customer Experience Tech', 'Data & AI Platform', 'Trust & Security'],
    related: ['Pillar Portfolio Manager', 'Capacity Snapshot'],
    dontConfuse: 'Pillar (org) ≠ Strategic Theme (cross-pillar storyline).' },

  { term: 'Stage Gate', category: 'taxonomy',
    def: 'A decision checkpoint between phases of an initiative. PortfolioIQ uses 6: G0 Concept → G1 Plan → G2 Build → G3 Validate → G4 Launch → G5 Sustain.',
    aliases: ['Phase Gate', 'Decision Gate'], examples: ['G2 Build', 'G4 Launch'],
    related: ['Stage-Gate Decision Playbook', 'Stage-Gate Scorer'],
    dontConfuse: 'Gate ≠ Milestone. Gates are governance checkpoints; milestones are project deliverables.' },

  { term: 'Status', category: 'taxonomy',
    def: 'Current state of an initiative: on_track | at_risk | off_track | complete. Set by Pillar PM, validated by Sr Mgr.',
    aliases: ['Health'], examples: ['INI-110 = off_track (Risk Register expired)'],
    related: ['Portfolio Health Score'],
    dontConfuse: 'Status ≠ Stage. An initiative in G2 Build can be on_track OR off_track.' },

  { term: 'OKR', category: 'taxonomy',
    def: 'Objective and Key Result — a top-level strategic goal. V25 OKRs are the current cycle (e.g., V25-Agentforce, V25-Trust, V25-Customer-360).',
    aliases: [], examples: ['V25-Agentforce: Ship internal Agentforce to 80% of employees'],
    related: ['Strategic Alignment Score'],
    dontConfuse: 'OKR ≠ KPI. OKR = direction + ambition; KPI = measurement.' },

  // ARTIFACTS
  { term: 'PRD', category: 'artifact',
    def: 'Product Requirements Document. Required at G1 Plan. Defines problem, hypothesis, success metrics, and scope.',
    aliases: ['Product Brief', 'Requirements Doc'], examples: ['INI-101 PRD v2.4'],
    related: ['Stage Gate', 'Initiative Intake Playbook'],
    dontConfuse: 'PRD ≠ Tech Design Doc. PRD = the WHAT/WHY; Tech Design = the HOW.' },

  { term: 'Capacity Plan', category: 'artifact',
    def: 'Signed declaration of FTE commitments for an initiative across upcoming quarters. Required at G2 Build.',
    aliases: [], examples: ['INI-101 Capacity Plan: 9 FTE across Q3-Q4'],
    related: ['Capacity Planning Playbook', 'FTE Allocation'],
    dontConfuse: 'Capacity Plan ≠ Resource Request. Plan is approved + signed; Request is initial ask.' },

  { term: 'Risk Register', category: 'artifact',
    def: 'Living document of identified risks, scores (P×I), mitigations, and owners. Required at G1, refreshed every 90 days through G4.',
    aliases: [], examples: ['INI-110 CPQ Risk Register (EXPIRED 2026-03-05)'],
    related: ['Risk Score', 'Risk Register Template'],
    dontConfuse: 'Risk Register ≠ Issues Log. Register = forward-looking risks; Log = realized issues.' },

  { term: 'Architecture Review', category: 'artifact',
    def: 'Approval of the technical architecture by the DET Architecture Council. Required at G1.',
    aliases: ['Tech Review'], examples: ['INI-116 Lakehouse — Architecture Review approved 2026-04-02'],
    related: ['PRD'],
    dontConfuse: 'Architecture Review ≠ Code Review. Architecture = design-level; Code = implementation-level.' },

  { term: 'Launch Readiness', category: 'artifact',
    def: 'Sign-off that an initiative is ready to enter G4 Launch. Includes security review, runbook, comms plan, rollback plan.',
    aliases: ['LR Doc'], examples: ['INI-103 Trust Center 2.0 — LR signed 2026-03-25'],
    related: ['Stage Gate'],
    dontConfuse: 'LR ≠ Go/No-Go decision. LR = readiness check; G/NG = the actual decision.' },

  // ROLES
  { term: 'Pillar Portfolio Manager', category: 'role',
    def: 'Owns the portfolio of initiatives within one DET pillar. Reports to Sr Mgr Strategic Portfolio Mgmt. Direct counterpart to engineering / product leads in their pillar.',
    aliases: ['Pillar PM'], examples: ['Jordan Reilly (Data & AI Platform)', 'Marcus Chen (Employee Productivity)'],
    related: ['Pillar', 'Sr Mgr Strategic Portfolio Mgmt'],
    dontConfuse: 'Pillar PM ≠ Initiative PM. Pillar PM owns the portfolio; per-initiative PM owns delivery.' },

  { term: 'Sr Mgr Strategic Portfolio Mgmt', category: 'role',
    def: 'Owns portfolio governance, taxonomy, frameworks, and exec reporting across all DET pillars. People-leader (4 direct reports). This role.',
    aliases: ['Sr Mgr SPM', 'Portfolio Lead'], examples: ['JR337298'],
    related: ['Pillar Portfolio Manager', 'Sr Director'],
    dontConfuse: 'Sr Mgr SPM ≠ Sr Mgr Engineering. SPM is process + governance; Eng is delivery.' },

  { term: 'Executive Sponsor', category: 'role',
    def: 'VP+ accountable for the strategic outcome of an initiative. Approves G1 + G4 gates. Funded.',
    aliases: ['Sponsor', 'Exec Sponsor'], examples: ['Srini K. (CIO) sponsors INI-101', 'Lena Wu (CTrO) sponsors INI-103'],
    related: ['Initiative'],
    dontConfuse: 'Sponsor ≠ Stakeholder. Sponsor has approval authority + budget control.' },

  { term: 'Pillar Lead', category: 'role',
    def: 'Senior engineering / product leader who owns a pillar\'s technical direction. Pairs with Pillar PM.',
    aliases: [], examples: ['Aarti Vyas (Data & AI Platform Pillar Lead)'],
    related: ['Pillar Portfolio Manager'],
    dontConfuse: 'Pillar Lead ≠ Pillar PM. Lead = technical / delivery; PM = portfolio / governance.' },

  // FINANCIAL
  { term: 'TCO', category: 'finance',
    def: 'Total Cost of Ownership. Full lifecycle cost: build + 3yr run + change management + opportunity cost. Not just build cost.',
    aliases: ['Total Cost of Ownership'], examples: ['INI-101 TCO = $5.2M ($2.4M build + $1.8M run + $0.4M change + $0.6M opportunity)'],
    related: ['ROI', 'Net Value'],
    dontConfuse: 'TCO ≠ Build Cost. Many initiatives look cheap to build but expensive to own.' },

  { term: 'ROI', category: 'finance',
    def: 'Return on Investment. (Net Value / TCO) × 100. Anything below cost-of-capital (~10%) is suspect.',
    aliases: [], examples: ['INI-101 expected ROI = 142%'],
    related: ['Net Value', 'TCO'],
    dontConfuse: 'ROI is over the lifecycle. Annualized ROI is a different number.' },

  { term: 'Payback Period', category: 'finance',
    def: 'Months until cumulative benefit exceeds cumulative cost. Faster = lower risk.',
    aliases: ['Payback'], examples: ['INI-103 Trust Center: 8 months'],
    related: ['ROI'],
    dontConfuse: 'Payback ≠ Break-even. Same concept, but Break-even is sometimes used for unit economics.' },

  { term: 'Net Value', category: 'finance',
    def: 'Total benefit minus total TCO over the lifecycle. Absolute dollar value created.',
    aliases: [], examples: ['INI-116 Lakehouse Net Value: +$8.0M'],
    related: ['TCO', 'ROI'],
    dontConfuse: 'Net Value is absolute $; ROI is relative %.' },

  { term: 'NPV', category: 'finance',
    def: 'Net Present Value. Net Value discounted to today\'s dollars using cost-of-capital.',
    aliases: ['Discounted Net Value'], examples: ['INI-101 NPV at 10% discount: $7.8M'],
    related: ['Net Value'],
    dontConfuse: 'NPV ≠ Net Value. NPV adjusts for time-value-of-money; Net Value does not.' },

  // RISK & DEPENDENCY
  { term: 'Risk Score', category: 'risk',
    def: 'Probability × Impact, each on a 1–5 scale. Output 1–25. ≥16 = critical; 9–15 = high; 4–8 = medium; <4 = low.',
    aliases: ['P×I Score'], examples: ['INI-110 CPQ Risk Score: 25 (critical)'],
    related: ['Probability', 'Severity', 'Mitigation'],
    dontConfuse: 'Risk Score ≠ Risk Exposure. Score is per-risk; Exposure is portfolio-aggregated $.' },

  { term: 'Dependency', category: 'risk',
    def: 'A relationship between two initiatives where one\'s state affects the other. Types: blocks, gates, informs, shares_resources.',
    aliases: [], examples: ['INI-115 GATES INI-101 (AI Governance must approve before Agentforce launch)'],
    related: ['Dependency Risk Aggregate'],
    dontConfuse: 'Dependency is between initiatives. Blocker is a temporary impediment within an initiative.' },

  { term: 'Mitigation', category: 'risk',
    def: 'A specific action with an owner and target date that reduces a risk\'s probability or impact.',
    aliases: ['Mitigation Action'], examples: ['Risk: AI Governance slip. Mitigation: pull review forward + sponsor escalation. Owner: Aisha. Target: 2026-05-15'],
    related: ['Risk Register'],
    dontConfuse: 'Mitigation reduces risk. Contingency is what you do AFTER the risk hits.' },

  // CAPACITY
  { term: 'FTE', category: 'capacity',
    def: 'Full-Time Equivalent. 1 FTE = 1 person\'s full work-week capacity. Contractors counted with their actual allocation %.',
    aliases: ['Headcount'], examples: ['INI-101 = 9 FTE allocated'],
    related: ['Capacity Plan', 'Pillar Capacity Variance'],
    dontConfuse: 'FTE ≠ Headcount. 2 half-time people = 1 FTE.' },

  { term: 'Allocation', category: 'capacity',
    def: 'Sum of FTE asks against a pillar\'s capacity for a given quarter. >100% = over-allocated.',
    aliases: [], examples: ['Employee Productivity pillar: 110% allocated Q3'],
    related: ['FTE', 'Capacity Snapshot'],
    dontConfuse: 'Allocation (planned) ≠ Utilization (actual time spent on initiatives).' },

  { term: 'Headroom', category: 'capacity',
    def: 'Unallocated capacity in a pillar. Headroom is the buffer for new initiatives, urgent work, or dependency rebalancing.',
    aliases: ['Slack'], examples: ['Trust & Security pillar: 14% headroom in Q3'],
    related: ['Allocation'],
    dontConfuse: 'Headroom ≠ Idleness. Healthy headroom is intentional buffer; idleness is wasted capacity.' }
];
