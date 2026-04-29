import React, { useState } from 'react';
import {
  Compass, PlayCircle, ArrowRight, ChevronDown, BookOpen, Calculator,
  Briefcase, Bot, Database, Hammer, LayoutDashboard, Target, Zap, Lightbulb,
  Users, Workflow, Clock, TrendingUp, AlertCircle, Lock, User
} from 'lucide-react';

// =================== PERSONA-SPECIFIC FRAMING ===================
const PERSONA_FRAMING = {
  'sr-manager': {
    bannerLabel: 'Default · full operating view',
    valueIntro: 'You\'ll save ~18 hrs/week that goes back to governance, coaching, and judgment work.',
    quickStartHint: 'Start with the 2-min tour to see the full operating loop end-to-end.'
  },
  'director': {
    bannerLabel: 'Strategic lens · operational details hidden',
    valueIntro: 'Your Sr Mgr team frees up ~18 hrs/week — that capacity comes back to strategy work and sponsor relationships.',
    quickStartHint: 'Start with the Dashboard\'s "Decisions needed this week" — the 20-second leadership scan.'
  },
  'pillar-pm-dap': {
    bannerLabel: 'Scoped to Data & AI Platform',
    valueIntro: 'Your pillar\'s initiatives, KPIs, capacity, and risks in one filtered view. Cross-pillar context shown but not editable.',
    quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.'
  },
  'pillar-pm-ts': {
    bannerLabel: 'Scoped to Trust & Security',
    valueIntro: 'Your pillar\'s initiatives, KPIs, capacity, and risks in one filtered view. Cross-pillar context shown but not editable.',
    quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.'
  },
  'pillar-pm-fe': {
    bannerLabel: 'Scoped to Field Engagement',
    valueIntro: 'Your pillar\'s initiatives, KPIs, capacity, and risks in one filtered view. Cross-pillar context shown but not editable.',
    quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.'
  },
  'sponsor': {
    bannerLabel: 'Read-only summary',
    valueIntro: 'A read-only snapshot of the initiatives you sponsor — health, capital, milestones — without operational depth.',
    quickStartHint: 'Start with the Dashboard for the leadership scan; the rest of the workspace is hidden for your role.'
  }
};

// =================== PROBLEM / VALUE DATA ===================
const HERO_STATS = [
  { value: '~18',  unit: 'hrs/wk',     label: 'Time saved across team' },
  { value: '4d → 6h', unit: '',         label: 'Off-track decision lag' },
  { value: '71→88',  unit: '%',         label: 'Stage-gate compliance' },
  { value: '12',   unit: 'agents',     label: 'Running on Agentforce' },
  { value: '6→1',  unit: 'systems',    label: 'Tools collapsed into one workspace' }
];

const BEFORE_AFTER = [
  { task: 'Compile portfolio status across pillars',     before: '3–4 hrs/wk',          after: '20 min',           win: 'Tableau-fed Dashboard, single source' },
  { task: 'Prep for sponsor 1:1',                         before: '45 min',              after: '15 min review',     win: 'Sponsor Brief Agent drafts a Quip doc 24h ahead' },
  { task: 'Detect & escalate an off-track initiative',    before: '4-day median lag',    after: '6 hours',           win: 'Off-Track Triage Agent fires on status change' },
  { task: 'Draft the monthly exec update',                before: '4–6 hrs',             after: '~1 hr review',      win: 'Workbench AI auto-draft pulls live KPIs' },
  { task: 'Refresh a Risk Register',                      before: 'Often skipped',       after: 'Auto-nudged at 90d', win: 'Risk Register Refresher Agent opens GUS work item' },
  { task: 'Stage-gate review prep',                       before: '2 days · manual',     after: 'Real-time scorer',  win: 'Stage-Gate Scorer reads artifact lifecycle directly' },
  { task: 'Capital-burn forecast',                        before: 'Reactive · monthly',  after: 'Weekly + projected', win: 'Capital Burn Forecaster · Einstein projection · Tableau dashboard' },
  { task: 'Cross-pillar dependency awareness',            before: 'Tribal · word-of-mouth', after: '<1h notification', win: 'Dependency Watcher walks the graph in Data Cloud' }
];

const SYSTEM_LANDSCAPE = [
  { sys: 'Anaplan',           used: 'Capital plans, budgets',           freq: 'Daily' },
  { sys: 'ServiceNow / GUS',  used: 'Tickets, change requests',          freq: 'Daily' },
  { sys: 'Slack',             used: 'Status, escalations, intake',       freq: 'Hourly' },
  { sys: 'Quip',              used: 'PRDs, architecture reviews',        freq: 'Several/wk' },
  { sys: 'Workday',           used: 'FTE capacity, leave',               freq: 'Weekly' },
  { sys: 'Spreadsheets',      used: 'Anything not in the above',         freq: 'Constantly' }
];

// =================== TAB GUIDE CONTENT ===================
const TAB_GUIDES = [
  {
    id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, ord: '01',
    purpose: 'The 20-second leadership scan: what\'s red, what\'s blocked, what\'s the portfolio shape.',
    sections: [
      { name: 'Hero', what: 'Headline + 4 click-to-expand chips (role / hidden tax / one workspace / boundary). Tour CTAs in the right column.' },
      { name: 'Decisions needed this week', what: 'Stack-ranked red initiatives. Each row expands to show **root cause · accountable owner · path to green · next step · decision-by date**.' },
      { name: 'Cross-pillar blockers', what: 'Where one pillar\'s decision is gating another\'s delivery. Risk level + days open + impact narrative.' },
      { name: '5 KPIs', what: 'Health · Capital · Compliance · Cycle · Strategic Alignment. Hover the `i` for the definition + target + source.' },
      { name: 'Stage-Gate Pipeline (G0→G5)', what: 'Circular nodes show count of initiatives at each gate. Hover any circle for the stage definition.' },
      { name: 'Pillar Performance', what: 'Click a pillar card to filter the tracker below.' },
      { name: 'Initiative Tracker', what: '16 initiatives, sortable + filterable. Status pills, FTE, OKR mapping, last-reviewed date.' }
    ]
  },
  {
    id: 'guide', label: 'Guide (this tab)', icon: Compass, ord: '02',
    purpose: 'You are here. Orientation guide for the rest of the workspace.',
    sections: []
  },
  {
    id: 'journey', label: 'Journey', icon: PlayCircle, ord: '03',
    purpose: 'Watch one initiative move G0→G5. See how each stage ripples through KPIs, capital, risk, FTE, dependencies.',
    sections: [
      { name: 'Press Play', what: 'Animates the initiative through all 6 stages with timing controls (0.8s–5s/stage).' },
      { name: 'Stat tiles', what: 'Capital, FTEs, risk score, value realized — all animate as the stage advances.' },
      { name: 'Cross-pillar effects', what: 'Shows how downstream pillars activate or block as the initiative progresses.' }
    ]
  },
  {
    id: 'decisions', label: 'Decisions', icon: Calculator, ord: '04',
    purpose: '9 sub-tabs of analysis tools. Calculators turn data into draft trade-offs for sponsor review.',
    sections: [
      { name: 'RICE Prioritization', what: 'Score every initiative on Reach × Impact × Confidence ÷ Effort.' },
      { name: 'Capital Optimizer', what: 'Drag the budget slider; knapsack solver picks the optimal mix. Pin must-keep initiatives.' },
      { name: 'Risk Heatmap', what: '5×5 Probability × Impact grid. Initiatives plotted; click for mitigation drill-down.' },
      { name: 'Stage-Gate Scorer', what: '4-dimension readiness check (artifacts / sponsor / capacity / dependencies).' },
      { name: 'Value & TCO Engine', what: 'Build + Run + Change + Opportunity vs Revenue + Savings + Risk-avoided + Strategic.' },
      { name: 'Influence Factors', what: '8 non-financial dimensions: data quality, governance, vendor, talent, regulatory, tech debt, sentiment, market timing.' },
      { name: 'Process Health', what: 'Cycle time per gate · rework rate · Pillar PM NPS · 4 anti-patterns detected.' },
      { name: 'Scenario Compare', what: 'Pick 2–4 of (Status Quo / Margin Push / Agentforce Bet / Trust First). Auto-rationale generated.' },
      { name: 'KPI Studio', what: '17 configurable KPIs · 5 weighting profiles · Recommendation Engine outputs Accelerate/Continue/Watch/Restructure/Sunset.' }
    ]
  },
  {
    id: 'operate', label: 'Operate', icon: Briefcase, ord: '05',
    purpose: 'The Sr Manager\'s daily workspace: standardized playbooks, team coaching, and comms drafting.',
    sections: [
      { name: 'Playbooks', what: '7 foundational playbooks (Stage-Gate Decision · Initiative Intake · Capacity Planning · Risk Register · Quarterly Rebalance · Portfolio Review · Sunset/Kill). Adoption tracked per pillar.' },
      { name: 'Team Cockpit', what: '4 Pillar PM direct reports. Auto-detected coaching opportunities, weekly briefs, workflow automations.' },
      { name: 'Workbench', what: '8 message templates (Monthly Exec · Sponsor 1:1 · All-Hands · Off-Track Escalation · Launch Announcement · Quarterly Rebalance · PM Digest · CFO Memo). AI auto-fill from live data.' }
    ]
  },
  {
    id: 'agents', label: 'Agents', icon: Bot, ord: '06',
    purpose: '12 niche agents on Agentforce — automate the routine governance and comms work.',
    sections: [
      { name: 'MCP fabric', what: 'Salesforce-native (Agentforce, GUS, Data Cloud, Einstein, Tableau, Slack, Quip, MuleSoft) + supporting external (Jira, Email, Okta, Snowflake, Workday, Anaplan).' },
      { name: 'Agent catalog', what: 'Filter by category (Governance / Coaching / Decision / Comms). Click any card for full detail (trigger · schedule · what-it-does · last outcome · success metric).' },
      { name: 'Live activity feed', what: 'Sticky right-rail. Append-only stream of every agent action in last 24h.' }
    ]
  },
  {
    id: 'data', label: 'Source of Truth', icon: Database, ord: '07',
    purpose: 'The authoritative reference. Where number disagreements get resolved.',
    sections: [
      { name: 'Schema', what: '4 normalized tables: initiative_inventory · stage_gate_artifacts · dependencies · capacity_snapshots. Full DDL + sample data.' },
      { name: 'Metric Catalog', what: '17 canonical metric definitions. Each has formula, owner, source system, refresh cadence, target, current value, version.' },
      { name: 'Data Glossary', what: '33 portfolio terms. Each has definition, aliases, examples, related terms, "Don\'t confuse with."' },
      { name: 'Audit Trail', what: 'Append-only event log. Every state change with actor, timestamp, before/after, reason. SOX-aligned.' },
      { name: 'Copilot', what: 'AI agent grounded in this data. Transparent reasoning panel: classify → resolve → reason → confidence.' }
    ]
  },
  {
    id: 'about', label: 'About', icon: Hammer, ord: '08',
    purpose: 'How this was built — design decisions, system architecture, integration points, POCs to production, risks.',
    sections: [
      { name: '01 · Design decisions', what: '9 trade-offs that shape the product, each with What I chose / Why.' },
      { name: '02 · System architecture', what: '4 layers: Experience · Logic · Data · Source systems.' },
      { name: '03 · Integration points', what: '8 production connectors with refresh cadence and notes.' },
      { name: '04 · POCs to production', what: '5 progressive proof-of-concepts. Each isolates one risk.' },
      { name: '05 · Risks & mitigations', what: '8 production risks with likelihood × impact × mitigation.' }
    ]
  }
];

// =================== COMMON WORKFLOWS ===================
const WORKFLOWS = [
  {
    n: 1,
    title: 'I have a sponsor 1:1 tomorrow',
    icon: '💼',
    steps: [
      { text: 'Operate → Workbench', tab: 'operate', sub: 'workbench' },
      { text: 'Click "Sponsor 1:1 Brief" template' },
      { text: 'Click Compose → AI auto-draft' },
      { text: 'Review the 5 sections, edit, send' }
    ]
  },
  {
    n: 2,
    title: 'My CFO asked me to find $4M',
    icon: '💰',
    steps: [
      { text: 'Decisions → Capital Optimizer', tab: 'decisions', sub: 'capital' },
      { text: 'Drag the budget slider down to your target' },
      { text: 'Pin must-keep initiatives (Trust, AI Governance)' },
      { text: 'See what gets cut + value lost' },
      { text: 'Switch to Scenario Compare for full trade-off rationale' }
    ]
  },
  {
    n: 3,
    title: 'An initiative just went off-track',
    icon: '🚨',
    steps: [
      { text: 'Off-Track Triage Agent fires automatically (Agents tab)', tab: 'agents' },
      { text: 'OR manually: Operate → Workbench → "Off-Track Escalation"', tab: 'operate', sub: 'workbench' },
      { text: 'Use Decisions → KPI Studio to draft a recommendation', tab: 'decisions', sub: 'kpi-studio' },
      { text: 'Send draft to sponsor for review' }
    ]
  },
  {
    n: 4,
    title: 'I\'m onboarding a new Pillar PM',
    icon: '👋',
    steps: [
      { text: 'Switch persona to "Pillar PM" (top-right) so they see what they\'ll see' },
      { text: 'Operate → Playbooks: 7 standardized playbooks', tab: 'operate', sub: 'playbooks' },
      { text: 'Source of Truth → Glossary: 33 canonical terms', tab: 'data', sub: 'glossary' },
      { text: 'Source of Truth → Metric Catalog: 17 metric definitions', tab: 'data', sub: 'metrics' }
    ]
  },
  {
    n: 5,
    title: 'Quarterly portfolio review next week',
    icon: '📊',
    steps: [
      { text: 'Decisions → Scenario Compare → build 3 scenarios', tab: 'decisions', sub: 'compare' },
      { text: 'Operate → Workbench → "Quarterly Rebalance Recommendation"', tab: 'operate', sub: 'workbench' },
      { text: 'AI auto-draft pulls live numbers from Decision Engine' },
      { text: 'Edit and send to leadership council' }
    ]
  },
  {
    n: 6,
    title: 'I want to see who\'s red and what\'s blocked',
    icon: '🔴',
    steps: [
      { text: 'Just open Dashboard — section 01 stack-ranks the red items', tab: 'dashboard' },
      { text: 'Section 02 shows active cross-pillar blockers' },
      { text: 'Each red item expands → path-to-green + accountable owner + decision-by date' }
    ]
  },
  {
    n: 7,
    title: 'I need to draft the monthly exec update',
    icon: '✉️',
    steps: [
      { text: 'Operate → Workbench → "Monthly Exec Update"', tab: 'operate', sub: 'workbench' },
      { text: 'Click Compose → AI auto-draft' },
      { text: 'Reviews KPIs from Dashboard, risks from Process Health, wins from Team Cockpit briefs' }
    ]
  },
  {
    n: 8,
    title: 'I want to scope to one pillar only',
    icon: '🎯',
    steps: [
      { text: 'Top-right: change persona to "Pillar PM · [your pillar]"' },
      { text: 'Dashboard, KPIs, and tracker all filter automatically' },
      { text: 'Some tabs hide (Operate, Workbench) — Pillar PMs don\'t own those' }
    ]
  }
];

// =================== TIPS ===================
const TIPS = [
  { tip: 'Use the persona switcher (top-right)', detail: 'See how RBAC adapts the workspace — Director loses Operate, Pillar PM scopes to their pillar, Sponsor goes read-only.' },
  { tip: 'The floating tour bar persists across tabs', detail: 'Once you start a tour, the bar at the bottom follows you everywhere. Prev / Next / All steps / Exit.' },
  { tip: 'Hover any KPI for full definition', detail: 'Every KPI tile has an `i` icon top-right. Hover for what + target + source.' },
  { tip: 'Hover any pipeline circle for stage definition', detail: 'G0 Concept · G1 Plan · G2 Build · G3 Validate · G4 Launch · G5 Sustain.' },
  { tip: 'Click any chip on the Dashboard hero', detail: '4 chips (Role / Hidden tax / One workspace / Boundary) expand for full detail.' },
  { tip: 'Recommendations are drafts, never decisions', detail: 'Every output is framed for sponsor review. Sr Mgr prepares; Director decides.' },
  { tip: 'Every state change is in the Audit Trail', detail: 'Source of Truth → Audit Trail. Append-only, SOX-aligned, 7-year retention.' },
  { tip: 'Click the "Back to All Steps" in Tour Bar', detail: 'Returns you to the Welcome panel with all steps visible — useful if you lose context.' }
];

// =================== FAQs ===================
const FAQS = [
  { q: 'Why is some content gated by persona?',
    a: 'RBAC simulation. In production, persona derives from your identity provider login (Okta). Here you can switch manually to see how the experience adapts. Director doesn\'t see Operate (people management is the Sr Mgr\'s job). Pillar PM scopes to their pillar. Sponsor is read-only.' },
  { q: 'What does "Sustain" mean (G5)?',
    a: 'The final stage. The initiative is live, monitored, and value is being tracked. The build team has disbanded; a lean ops team owns going forward. Quarterly value reviews confirm ROI.' },
  { q: 'Why agents instead of just dashboards?',
    a: 'Dashboards tell you what happened. Agents do something about it — nudge stale artifacts, draft sponsor briefs, detect capacity conflicts, escalate off-track initiatives. Routine work automated; humans focus on judgment.' },
  { q: 'Can I switch back to Sr Manager view anytime?',
    a: 'Yes — the persona dropdown in the top-right. First entry is "Sr Manager · Strategic Portfolio Mgmt" (default, full view).' },
  { q: 'How do I reset the demo?',
    a: 'Refresh the page. State resets to defaults: Sr Manager persona, Dashboard tab, no active tour. The data is mock so nothing actually persists.' },
  { q: 'Is this connected to real systems?',
    a: 'No — all data is mock. The schema is production-quality so the path to real is one connector per source system (Anaplan, ServiceNow / GUS, Quip, Slack, Workday, Okta).' }
];

// =================== UI COMPONENTS ===================
function Kicker({ ord, label }) {
  return (
    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">{ord}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">·</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">{label}</span>
    </div>
  );
}

function QuickStartCard({ icon: Icon, label, sub, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl p-4 transition-all border ${primary ? 'bg-sflight/15 border-sflight/40 hover:bg-sflight/20' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg grid place-items-center ${primary ? 'bg-sflight text-sfnavy' : 'bg-sflight/15 text-sflight'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-serif font-bold ${primary ? 'text-sflight' : 'text-white'}`}>{label}</span>
      </div>
      <p className="text-xs text-sfmuted leading-relaxed">{sub}</p>
      <span className={`text-xs mt-3 inline-flex items-center gap-1 font-semibold ${primary ? 'text-sflight' : 'text-white/80'}`}>
        Go <ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
}

function TabGuideCard({ guide, navigateTo }) {
  const Icon = guide.icon;
  const [open, setOpen] = useState(false);
  const isCurrentTab = guide.id === 'guide';
  return (
    <div className="rounded-xl bg-white/5 border border-white/15 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-4 hover:bg-white/[0.07] transition">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-sflight/15 grid place-items-center flex-shrink-0">
            <Icon className="w-5 h-5 text-sflight" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-sfmuted">{guide.ord}</span>
              <h4 className="font-serif font-bold text-white">{guide.label}</h4>
              {isCurrentTab && <span className="pill pill-blue text-[10px]">YOU ARE HERE</span>}
            </div>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">{guide.purpose}</p>
          </div>
          {guide.sections.length > 0 && (
            <ChevronDown className={`w-4 h-4 text-white/50 flex-shrink-0 mt-2 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>
      {open && guide.sections.length > 0 && (
        <div className="px-4 pb-4 pt-0 space-y-2 border-t border-white/10">
          {guide.sections.map((s, i) => (
            <div key={i} className="text-xs">
              <span className="text-sflight font-semibold">{s.name}.</span>
              <span className="text-white/80 ml-1" dangerouslySetInnerHTML={{ __html: s.what.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
            </div>
          ))}
          {!isCurrentTab && (
            <button onClick={() => navigateTo(guide.id)} className="text-xs text-sflight hover:underline mt-2 inline-flex items-center gap-1">
              Open {guide.label} <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function WorkflowCard({ wf, navigateTo }) {
  return (
    <article className="rounded-xl bg-white/5 border border-white/15 p-4">
      <header className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl">{wf.icon}</span>
        <h4 className="font-serif font-bold text-white">{wf.title}</h4>
      </header>
      <ol className="space-y-1.5">
        {wf.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <span className="font-mono text-sflight font-bold flex-shrink-0">{i + 1}.</span>
            <span className="flex-1 text-white/85">{step.text}</span>
            {step.tab && (
              <button
                onClick={() => navigateTo(step.tab)}
                className="text-[10px] text-sflight hover:underline flex-shrink-0 inline-flex items-center gap-0.5"
              >
                Go <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

// =================== HELPERS ===================
// A workflow is visible to a persona if every tab it navigates to is visible to that persona.
function workflowVisibleTo(workflow, persona) {
  if (!persona) return true;
  const usedTabs = workflow.steps.filter(s => s.tab).map(s => s.tab);
  return usedTabs.every(t => !persona.hideTabs.includes(t));
}

// =================== MAIN ===================
export default function Guide({ navigateTo, onStartTour, persona }) {
  const personaId = persona?.id || 'sr-manager';
  const framing = PERSONA_FRAMING[personaId] || PERSONA_FRAMING['sr-manager'];

  // Filter content based on persona's RBAC
  const visibleTabGuides = TAB_GUIDES.filter(g => g.id === 'guide' || !persona?.hideTabs?.includes(g.id));
  const visibleWorkflows = WORKFLOWS.filter(w => workflowVisibleTo(w, persona));

  // Quick start cards — filter by tab visibility
  const allQuickStart = [
    { id: 'tour', icon: PlayCircle, label: 'Take the 2-min tour',
      sub: 'Five stops walking through the demo\'s narrative arc. Floating tour bar auto-navigates between tabs.',
      action: () => onStartTour('2m'), primary: true, requiresTab: null },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Jump to Dashboard',
      sub: 'The 20-second leadership scan: red items ranked, cross-pillar blockers, 5 KPIs, stage-gate pipeline.',
      action: () => navigateTo('dashboard'), primary: false, requiresTab: 'dashboard' },
    { id: 'agents', icon: Bot, label: 'See the Agents',
      sub: '12 niche agents on Agentforce, connected to GUS, Slack, Quip, Tableau, Data Cloud, Einstein.',
      action: () => navigateTo('agents'), primary: false, requiresTab: 'agents' },
    { id: 'decisions', icon: Calculator, label: 'Try the Decision Engine',
      sub: '9 calculators including the KPI Studio Recommendation Engine. Drafts for sponsor review.',
      action: () => navigateTo('decisions'), primary: false, requiresTab: 'decisions' }
  ];
  const visibleQuickStart = allQuickStart.filter(q => !q.requiresTab || !persona?.hideTabs?.includes(q.requiresTab)).slice(0, 3);

  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* HERO */}
      <header>
        <Kicker ord="Guide" label="How to use this app" />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight tracking-tight">A 5-minute orientation.</h1>
        <p className="text-base text-white/80 mt-3 leading-relaxed max-w-3xl">
          PortfolioIQ is a Sr Manager's operating workspace for strategic portfolio management. This page tells you what each tab does, how to do common tasks, and how to get the most out of the experience.
        </p>
      </header>

      {/* PERSONA BANNER — shows when viewing as anything other than Sr Manager */}
      {persona && persona.id !== 'sr-manager' && (
        <div className="rounded-lg bg-sflight/10 border border-sflight/30 px-4 py-3 flex items-start gap-3">
          <User className="w-4 h-4 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="text-[10px] uppercase tracking-widest text-sflight font-bold">Viewing as · {persona.role}</span>
            <span className="text-white/90 ml-2">{framing.bannerLabel}</span>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              The Guide below is filtered to your role. Workflows you can't act on (because their tabs are hidden) are removed. Switch persona in the top-right to see how a different role experiences the same product.
            </p>
          </div>
          {persona.hideTabs.length > 0 && (
            <span className="text-[10px] text-white/50 font-mono whitespace-nowrap"><Lock className="w-3 h-3 inline mr-0.5" />Hidden: {persona.hideTabs.join(' · ')}</span>
          )}
        </div>
      )}

      {/* 01 · PROBLEM & VALUE — landscape snapshot */}
      <section>
        <Kicker ord="01" label="Problem & value" />
        <h2 className="text-xl font-serif font-bold text-white mb-2">Why this exists — and what it changes</h2>
        {persona && persona.id !== 'sr-manager' && (
          <p className="text-sm text-sflight italic mb-3">
            <strong>For your role:</strong> {framing.valueIntro}
          </p>
        )}

        {/* Problem + Context row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-300" />
              <span className="text-[10px] uppercase tracking-widest text-red-300 font-bold">Problem</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              A Sr Mgr running a $30M tech portfolio touches <strong>6+ systems daily</strong>. Every status answer requires triangulating across Anaplan, ServiceNow / GUS, Slack, Quip, Workday, and spreadsheets.
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">Business need</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              Portfolio leaders need <strong>one operating workspace</strong> where every KPI, decision draft, coaching insight, and exec comm is live and grounded — so the Sr Manager spends time on judgment, not data triangulation.
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Value</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              <strong>~18 hrs/week saved</strong> across the team. Off-track decision lag drops <strong>4 days → 6 hours</strong>. Stage-gate compliance up <strong>+17 pts</strong> in 6 months. Sr Manager runs operations; Director runs strategy.
            </p>
          </div>
        </div>

        {/* Hero stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {HERO_STATS.map((s, i) => (
            <div key={i} className="rounded-lg bg-sflight/10 border border-sflight/30 p-3 text-center">
              <div className="text-2xl font-serif font-bold text-sflight leading-none">
                {s.value}<span className="text-xs ml-1 text-white/70">{s.unit}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wide text-white/70 mt-1.5 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* SNAPSHOT VIEW IN LANDSCAPE — Before vs After table */}
        <div className="rounded-xl bg-white/5 border border-white/15 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Workflow className="w-4 h-4 text-sflight" />
            <h3 className="text-sm font-serif font-bold text-white">Snapshot — what's different in 8 portfolio tasks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-sfmuted border-b border-white/10">
                  <th className="py-3 px-4 font-bold">Task</th>
                  <th className="py-3 px-4 font-bold text-red-300">Before · time + friction</th>
                  <th className="py-3 px-4 font-bold text-emerald-300">After · with PortfolioIQ</th>
                  <th className="py-3 px-4 font-bold text-sflight">How</th>
                </tr>
              </thead>
              <tbody>
                {BEFORE_AFTER.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 align-top">
                    <td className="py-3 px-4 text-white font-medium">{row.task}</td>
                    <td className="py-3 px-4 text-red-200/85 font-mono text-xs">{row.before}</td>
                    <td className="py-3 px-4 text-emerald-200 font-mono text-xs">{row.after}</td>
                    <td className="py-3 px-4 text-sfmuted text-xs">{row.win}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Systems-collated landscape */}
        <div className="mt-4 rounded-xl bg-white/5 border border-white/15 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Database className="w-4 h-4 text-sflight" />
            <h3 className="text-sm font-serif font-bold text-white">The systems a Sr Mgr collates info from today</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-0 divide-x divide-white/10">
            {SYSTEM_LANDSCAPE.map((s, i) => (
              <div key={i} className="p-3">
                <div className="text-sm font-serif font-bold text-white">{s.sys}</div>
                <div className="text-[11px] text-sfmuted mt-0.5 leading-snug">{s.used}</div>
                <div className="text-[10px] uppercase tracking-wider text-sflight font-bold mt-2">{s.freq}</div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 bg-sflight/5 border-t border-sflight/20 text-xs text-white/85">
            <strong className="text-sflight">→</strong> PortfolioIQ collapses these into <strong>one Source of Truth</strong> via MuleSoft + Data Cloud. Every other tab reads from the same place.
          </div>
        </div>
      </section>

      {/* 02 · QUICK START */}
      <section>
        <Kicker ord="02" label="Quick start" />
        <h2 className="text-xl font-serif font-bold text-white mb-1">{visibleQuickStart.length === 1 ? 'Best place to start' : visibleQuickStart.length === 2 ? 'Two ways to start' : 'Three ways to start'}</h2>
        <p className="text-sm text-sfmuted mb-3">{framing.quickStartHint}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visibleQuickStart.map(q => (
            <QuickStartCard key={q.id} icon={q.icon} label={q.label} sub={q.sub} onClick={q.action} primary={q.primary} />
          ))}
        </div>
      </section>

      {/* 03 · TAB-BY-TAB GUIDE */}
      <section>
        <Kicker ord="03" label="What's in each tab" />
        <h2 className="text-xl font-serif font-bold text-white mb-3">{visibleTabGuides.length} tabs, one purpose each</h2>
        <p className="text-sm text-sfmuted mb-4">Click any card to expand. {persona && persona.hideTabs.length > 0 && <span className="text-sflight">Tabs hidden by your role aren't shown.</span>}</p>
        <div className="space-y-2">
          {visibleTabGuides.map(g => <TabGuideCard key={g.id} guide={g} navigateTo={navigateTo} />)}
        </div>
      </section>

      {/* 04 · WORKFLOWS — filtered to those whose tabs are all visible to this persona */}
      <section>
        <Kicker ord="04" label="Common workflows" />
        <h2 className="text-xl font-serif font-bold text-white mb-3">"I need to…" — task-oriented playbook</h2>
        <p className="text-sm text-sfmuted mb-4">
          {visibleWorkflows.length} workflow{visibleWorkflows.length === 1 ? '' : 's'} you can act on with your current role.
          {WORKFLOWS.length > visibleWorkflows.length && <span className="text-sflight"> {WORKFLOWS.length - visibleWorkflows.length} more available to other roles — switch persona to see them.</span>}
        </p>
        {visibleWorkflows.length === 0 ? (
          <div className="rounded-lg bg-white/5 border border-white/15 p-4 text-sm text-sfmuted text-center">
            No workflows are actionable from your current role. Switch persona in the top-right to see role-specific tasks.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleWorkflows.map(wf => <WorkflowCard key={wf.n} wf={wf} navigateTo={navigateTo} />)}
          </div>
        )}
      </section>

      {/* 05 · TIPS */}
      <section>
        <Kicker ord="05" label="Tips & tricks" />
        <h2 className="text-xl font-serif font-bold text-white mb-3">Power moves</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TIPS.map((t, i) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/15 p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-sflight flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-white">{t.tip}</div>
                  <p className="text-xs text-sfmuted mt-0.5 leading-relaxed">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 · FAQ */}
      <section>
        <Kicker ord="06" label="FAQ" />
        <h2 className="text-xl font-serif font-bold text-white mb-3">Common questions</h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <details key={i} className="rounded-lg bg-white/5 border border-white/15 p-3 text-sm cursor-pointer">
              <summary className="font-semibold text-white">{f.q}</summary>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CLOSING NOTE */}
      <section className="rounded-xl bg-sflight/10 border border-sflight/30 p-4">
        <p className="text-sm text-white/90 leading-relaxed">
          <strong className="text-sflight">Designed to be cold-start-able.</strong> If a colleague opens this URL with no context, the 2-min tour + this Guide should take them from "what is this?" to "I can navigate this on my own" in under 10 minutes. If something is unclear, that's a documentation gap to fix — not a feature to remove.
        </p>
      </section>

    </div>
  );
}
