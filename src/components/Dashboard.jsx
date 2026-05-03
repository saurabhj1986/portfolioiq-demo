import React, { useMemo, useState } from 'react';
import { Info, TrendingUp, AlertTriangle, CheckCircle2, Clock, DollarSign, Sparkles, PlayCircle, ChevronDown, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import {
  INITIATIVES, PILLARS, STAGES, KPI_DEFINITIONS, STATUS_META,
  fmtMoney, pillarById, stageById
} from '../data/portfolioData.js';
import { STAGE_GATE_ARTIFACTS } from '../data/portfolioData.js';
import { RED_INITIATIVES, CROSS_ORG_BLOCKERS } from '../data/attentionData.js';

function Tooltip({ text }) {
  return (
    <span className="relative group cursor-help inline-flex">
      <Info className="w-3.5 h-3.5 text-sfmuted" />
      <span
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute z-30 right-0 top-6 w-80 text-sm rounded-lg p-3.5 shadow-2xl leading-relaxed pointer-events-none whitespace-pre-line"
        style={{ background: '#0F1623', color: '#F8FAFC', border: '1px solid #67E8F9', borderColor: 'rgba(103, 232, 249, 0.4)' }}
      >
        {text}
      </span>
    </span>
  );
}

function KpiCard({ label, value, sub, target, tooltip, jdLink }) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-5">
        <span className="kpi-label">{label}</span>
        <Tooltip text={`${tooltip}\n\nMaps to: "${jdLink}"`} />
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub mt-3 leading-snug">{sub}</div>
      <div className="kpi-sub mt-1 text-[10px]" style={{ color: '#5A6A85' }}>target {target}</div>
    </div>
  );
}

function ProgressBar({ pct, color }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

// PRFAQ removed from Dashboard — that content lives in the Guide tab now.

// =================== EXEC ATTENTION ===================
function ExecAttentionRow({ item, rank }) {
  const [open, setOpen] = useState(false);
  const isOff = item.status === 'off_track';
  return (
    <button
      onClick={() => setOpen(!open)}
      className={`w-full text-left rounded-lg border transition-all ${open ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/25'}`}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <span className="font-mono text-xs text-sfmuted w-6">#{rank}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{item.name}</span>
            <span className="text-[11px] text-sfmuted">{item.id} · {item.pillar}</span>
          </div>
          <div className="text-[11px] text-sfmuted mt-0.5">
            <span className={`text-${item.okrCritColor} font-semibold`}>{item.okrCriticality}</span> · {item.daysRed} days red · {item.spendVsPlan}
          </div>
        </div>
        <span className={`pill ${isOff ? 'pill-red' : 'pill-yellow'} flex-shrink-0`}>
          {isOff ? 'OFF TRACK' : 'AT RISK'}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/60 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold mb-1">Root cause</div>
            <p className="text-white/85 leading-relaxed">{item.rootCause}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold mb-1">Accountable</div>
            <p className="text-white/85"><strong>{item.accountable}</strong> ({item.accountableRole})</p>
            <p className="text-sfmuted mt-1">↳ Sponsor: {item.sponsor} ({item.sponsorRole})</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-sgreen font-bold mb-1">Path to green · by {item.decisionBy}</div>
            <p className="text-white/85 leading-relaxed">{item.pathToGreen}</p>
            <p className="text-sflight text-[11px] mt-1.5"><strong>Next:</strong> {item.nextStep}</p>
          </div>
        </div>
      )}
    </button>
  );
}

// =================== CROSS-ORG BLOCKERS ===================
function BlockerRow({ b }) {
  const tone = b.risk === 'high' ? 'sred' : 'syellow';
  const typeLabel = { gates: 'GATES', blocks: 'BLOCKS', shares_resources: 'SHARES FTE', informs: 'INFORMS' }[b.type] || b.type;
  return (
    <div className="bg-white/5 border border-white/15 rounded-lg p-3">
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sflight text-[11px]">{b.blocker.id}</span>
          <span className="text-white text-sm font-medium">{b.blocker.name}</span>
          <span className="text-[10px] text-sfmuted bg-white/5 rounded px-1.5 py-0.5">{b.blocker.pillar}</span>
        </div>
        <span className={`pill pill-${tone === 'sred' ? 'red' : 'yellow'} font-mono text-[10px]`}>{typeLabel}</span>
        <span className="text-sfmuted">→</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sflight text-[11px]">{b.blocked.id}</span>
          <span className="text-white text-sm font-medium">{b.blocked.name}</span>
          <span className="text-[10px] text-sfmuted bg-white/5 rounded px-1.5 py-0.5">{b.blocked.pillar}</span>
        </div>
        {b.daysOpen > 0 && (
          <span className={`text-[10px] ml-auto text-${tone}`}>{b.daysOpen}d open</span>
        )}
      </div>
      <p className="text-[11px] text-white/70 mt-2 leading-relaxed">{b.impact}</p>
    </div>
  );
}

// Persona-aware attention tiles (4 tiles + 3 quick stats) — adapts to who's logged in
function getPersonaAttention(persona) {
  const id = persona?.id || 'sr-manager';
  const pillarLabel = persona?.pillarLabel || '';

  if (id === 'sponsor') {
    return {
      title: 'For your sign-off.',
      sub: 'You\'re sponsoring 6 active initiatives. Here\'s what needs your attention.',
      tiles: [
        { kicker: 'Pending sign-off',     value: '3',          sub: '$32M ACV awaiting your decision', accent: 'red' },
        { kicker: 'Value at Risk',        value: '$50M',       sub: '8.3% of $600M top-line plan',     accent: 'red' },
        { kicker: 'Initiatives sponsored',value: '6',          sub: 'Across 3 pillars',                accent: 'amber' },
        { kicker: 'Latest ship',          value: 'Trust 2.0',  sub: 'Apr 22 · on time, on budget',     accent: 'green' }
      ],
      stats: [
        { value: 3, label: 'Awaiting you' },
        { value: 1, label: 'Blocked on you' },
        { value: 6, label: 'You sponsor' }
      ]
    };
  }

  if (id === 'director') {
    return {
      title: 'Strategic at a glance.',
      sub: 'What needs your call this week. Operational details hidden by your role.',
      tiles: [
        { kicker: 'Decisions due this week', value: '5',     sub: 'Sponsor escalations · need your call',                 accent: 'red' },
        { kicker: 'Value at Risk',           value: '$50M', sub: '$600M plan · 8.3% exposed',                            accent: 'red' },
        { kicker: 'Strategic drift',         value: '4',     sub: 'inits unmapped to V25 OKRs · sunset candidates',       accent: 'amber' },
        { kicker: 'Capital headroom',        value: '$5.2M', sub: 'uncommitted across portfolio',                         accent: 'orange' }
      ],
      stats: [
        { value: 5, label: 'Decisions due' },
        { value: 4, label: 'Strategic drift' },
        { value: 3, label: 'Sponsor briefs queued' }
      ]
    };
  }

  if (persona?.pillarFilter) {
    return {
      title: `${pillarLabel} at a glance.`,
      sub: 'Your pillar\'s scope only. Cross-portfolio context shown but not editable.',
      tiles: [
        { kicker: 'Initiatives at risk',  value: '2',    sub: 'In your pillar · 1 off-track',          accent: 'red' },
        { kicker: 'Overdue artifacts',    value: '2',    sub: 'Stale Risk Registers · refresh by 5/15', accent: 'orange' },
        { kicker: 'Capacity allocated',   value: '95%',  sub: '5% headroom · healthy',                  accent: 'amber' },
        { kicker: 'Cross-pillar deps',    value: '3',    sub: '2 high-risk · 1 medium',                 accent: 'orange' }
      ],
      stats: [
        { value: 4, label: 'Active inits' },
        { value: 2, label: 'Risk reviews due' },
        { value: 3, label: 'Cross-pillar deps' }
      ]
    };
  }

  // Default: Sr Manager
  return {
    title: 'Portfolio at a glance.',
    sub: 'What needs your attention this week. Switch personas in the top right to see how the view reshapes.',
    tiles: [
      { kicker: 'Decisions needed',     value: '5',     sub: '2 off-track · 3 at-risk · this week',     accent: 'red' },
      { kicker: 'Cross-pillar blockers',value: '5',     sub: '3 high-risk · 2 medium · escalate today', accent: 'orange' },
      { kicker: 'Value at Risk',        value: '$50M',  sub: 'of $600M plan · top: CPQ ($18M)',         accent: 'red' },
      { kicker: 'Burn anomalies',       value: '4',     sub: '3 hot · 1 cold · weekly forecast ready',  accent: 'amber' }
    ],
    stats: [
      { value: 4, label: 'Priorities' },
      { value: 3, label: 'Blocked' },
      { value: 3, label: 'Decisions due' }
    ]
  };
}

const TILE_COLORS = {
  red:    { dot: '#F87171', border: 'rgba(248, 113, 113, 0.45)', text: 'text-red-300'    },
  orange: { dot: '#FB923C', border: 'rgba(251, 146, 60, 0.45)',  text: 'text-orange-300' },
  amber:  { dot: '#FBBF24', border: 'rgba(251, 191, 36, 0.45)',  text: 'text-amber-300'  },
  green:  { dot: '#4ADE80', border: 'rgba(74, 222, 128, 0.45)',  text: 'text-emerald-300' }
};

function AttentionTile({ kicker, value, sub, accent }) {
  const c = TILE_COLORS[accent] || TILE_COLORS.amber;
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `3px solid ${c.border}` }}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
        <span className={`text-[10px] uppercase tracking-widest font-bold ${c.text}`}>{kicker}</span>
      </div>
      <div className="text-2xl font-serif font-bold text-white leading-none mt-1">{value}</div>
      <div className="text-[11px] text-white/60 mt-1.5 leading-snug">{sub}</div>
    </div>
  );
}

// Small section kicker for hierarchy
function SectionKicker({ num, label, sub, accent = 'sflight' }) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline gap-2">
        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-${accent}`}>{num}</span>
        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-${accent}`}>·</span>
        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-${accent}`}>{label}</span>
      </div>
      {sub && <p className="text-xs text-sfmuted mt-1">{sub}</p>}
    </div>
  );
}

// Hybrid chips for hero — always-visible captions + click-to-expand detail
const HERO_CHIPS = [
  {
    id: 'role',
    icon: '💼',
    label: 'The role',
    caption: 'Many initiatives, multiple teams, $30M+ budget, 4+ direct reports',
    detail: 'Sr Mgrs running tech portfolios coordinate dozens of initiatives, multiple teams, tens of millions in budget, and direct reports who run their own portfolios.'
  },
  {
    id: 'tax',
    icon: '🔧',
    label: 'The hidden tax',
    caption: 'Time lost chasing the same numbers across 4+ tools',
    detail: 'Most of the week goes to triangulating data across Anaplan, ServiceNow, Slack, spreadsheets — not making decisions, coaching the team, or governing the work.'
  },
  {
    id: 'workspace',
    icon: '📦',
    label: 'One workspace',
    caption: 'KPIs, decision drafts, coaching insights, exec comms',
    detail: 'Every portfolio KPI, decision draft, AI coaching insight, and weekly exec comm in one place — so context-switching across tools collapses to context-switching across tabs.'
  },
  {
    id: 'boundary',
    icon: '⚖️',
    label: 'The boundary',
    caption: 'Sr Managers run operations; Directors run strategy',
    detail: 'Every engine output is a draft for sponsor review — never a final call. Sr Managers prepare the conversation; the Director makes the decision.'
  }
];

export default function Dashboard({ navigateTo, activeTour, onStartTour, tourStep, onGoToStep, onCloseTour, persona }) {
  // If persona enforces a pillar filter, lock the dropdown to that pillar
  const personaPillar = persona?.pillarFilter || null;
  const [pillarFilter, setPillarFilter] = useState(personaPillar || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openChip, setOpenChip] = useState(null);

  // Update local filter when persona changes
  React.useEffect(() => {
    if (personaPillar) setPillarFilter(personaPillar);
    else setPillarFilter('all');
  }, [personaPillar]);

  // Restrict initiatives universe to persona's pillar (for KPIs + tracker)
  const SCOPED_INITIATIVES = personaPillar
    ? INITIATIVES.filter(i => i.pillar === personaPillar)
    : INITIATIVES;

  // Section visibility helper based on persona's dashboardHideSections
  const hideSection = (id) => persona?.dashboardHideSections?.includes(id);

  const filtered = useMemo(() => {
    return SCOPED_INITIATIVES.filter(i =>
      (pillarFilter === 'all' || i.pillar === pillarFilter) &&
      (statusFilter === 'all' || i.status === statusFilter)
    );
  }, [SCOPED_INITIATIVES, pillarFilter, statusFilter]);

  const kpiValues = useMemo(() => {
    const active = SCOPED_INITIATIVES.filter(i => i.status !== 'complete');
    const onTrack = active.filter(i => i.status === 'on_track').length;
    const totalBudget = active.reduce((s, i) => s + i.budget, 0);
    const totalSpent = active.reduce((s, i) => s + i.spent, 0);
    const compliantCount = active.filter(i => {
      const arts = STAGE_GATE_ARTIFACTS.filter(a => a.initiative === i.id);
      return arts.length > 0 && arts.every(a => a.status === 'approved');
    }).length;
    const aligned = active.filter(i => i.okrs && i.okrs.length > 0).length;
    return {
      health:     `${Math.round((onTrack / active.length) * 100)}%`,
      healthSub:  `${onTrack}/${active.length} initiatives on track`,
      capital:    `${Math.round((totalSpent / totalBudget) * 100)}%`,
      capitalSub: `${fmtMoney(totalSpent)} of ${fmtMoney(totalBudget)}`,
      compliance: `${Math.round((compliantCount / active.length) * 100)}%`,
      complianceSub: `${compliantCount}/${active.length} fully artifacted`,
      cycle:      '47d',
      cycleSub:   'avg across G1–G3',
      alignment:  `${Math.round((aligned / active.length) * 100)}%`,
      alignmentSub: `${aligned}/${active.length} mapped to V25 OKRs`
    };
  }, []);

  const stageDistribution = useMemo(() => {
    return STAGES.map(s => ({
      ...s,
      count: SCOPED_INITIATIVES.filter(i => i.stage === s.id && i.status !== 'complete').length,
      budget: SCOPED_INITIATIVES.filter(i => i.stage === s.id && i.status !== 'complete').reduce((sum, i) => sum + i.budget, 0)
    }));
  }, []);

  const pillarMetrics = useMemo(() => {
    return PILLARS.map(p => {
      const inis = INITIATIVES.filter(i => i.pillar === p.id);
      const active = inis.filter(i => i.status !== 'complete');
      const atRisk = inis.filter(i => i.status === 'at_risk' || i.status === 'off_track').length;
      const budget = inis.reduce((s, i) => s + i.budget, 0);
      const fteUtil = Math.round((p.allocatedFte / p.capacityFte) * 100);
      return { ...p, count: inis.length, activeCount: active.length, atRisk, budget, fteUtil };
    });
  }, []);

  // Persona-aware attention content (4 tiles + 3 quick stats)
  const attention = getPersonaAttention(persona);

  return (
    <div className="space-y-4">
      {/* Compact "at a glance" hero — flat dark surface, no blue gradient. Tiles + content adapt per persona. */}
      <section className="rounded-xl p-5" style={{ background: '#0F1623', border: '1px solid #1E2638' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* LEFT (3/5): kicker + title + 4 attention tiles */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sflight" />
              <span className="text-[10px] uppercase tracking-widest text-sflight font-bold">PortfolioIQ</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight tracking-tight">{attention.title}</h1>
            <p className="text-sm text-white/70 mt-1.5 max-w-2xl leading-relaxed">
              {attention.sub.split(/Switch personas/i).map((part, i, arr) => i < arr.length - 1
                ? <React.Fragment key={i}>{part}<span className="text-sflight">Switch personas</span></React.Fragment>
                : <React.Fragment key={i}>{part}</React.Fragment>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {attention.tiles.map((t, i) => <AttentionTile key={i} {...t} />)}
            </div>
          </div>

          {/* RIGHT (2/5): CTAs + 3 quick stats */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <button onClick={() => onStartTour && onStartTour('2m')} className="rounded-lg px-4 py-2.5 font-semibold text-white text-sm flex items-center justify-center gap-2 transition" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <PlayCircle className="w-4 h-4" /> Start 2-min tour
              <span className="text-[10px] bg-sflight/20 text-sflight rounded px-1.5 py-0.5 font-bold tracking-wider">BEST FOR DEMOS</span>
            </button>
            <button onClick={() => onStartTour && onStartTour('5m')} className="rounded-lg px-4 py-2.5 font-medium text-white text-sm flex items-center justify-center gap-2 transition" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <PlayCircle className="w-4 h-4 opacity-70" /> 5-min deep dive
            </button>
            <button onClick={() => navigateTo && navigateTo('guide')} className="rounded-lg px-4 py-2 font-medium text-white/90 text-xs flex items-center justify-center gap-1.5 transition" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <Lightbulb className="w-3.5 h-3.5" /> Open the Guide <ArrowRight className="w-3 h-3" />
            </button>
            <div className="mt-auto pt-3 border-t grid grid-cols-3 gap-2 text-center" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
              {attention.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-serif font-bold text-white leading-none">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RBAC banner — shows what content is filtered when persona ≠ Sr Manager */}
      {persona && persona.id !== 'sr-manager' && (
        <section className="bg-sfnavy/60 border border-sflight/30 rounded-lg px-4 py-3 flex flex-wrap items-start gap-x-3 gap-y-1 text-xs">
          <span className="text-[10px] uppercase tracking-widest text-sflight font-bold mt-0.5">RBAC</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={persona.accent + ' font-semibold'}>{persona.role}{persona.pillarLabel ? ` · ${persona.pillarLabel}` : ''}</span>
              <span className="text-white/70">{persona.desc}</span>
            </div>
            {persona.focusSummary && (
              <div className="text-[11px] text-white/60 mt-1 leading-snug">
                <strong className="text-white/80">What's filtered:</strong> {persona.focusSummary}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 01 · EXECUTIVE ATTENTION — top-of-page red items */}
      {(!persona || !persona.pillarFilter) && (
        <section className="card border-l-4" style={{ borderLeftColor: '#F87171' }}>
          <SectionKicker num="01" label="Decisions needed this week" sub="Stack-ranked by status × OKR criticality × days red. Click any row for path-to-green and accountable owner." accent="sred" />
          <div className="space-y-2">
            {RED_INITIATIVES.map((it, idx) => (
              <ExecAttentionRow key={it.id} item={it} rank={idx + 1} />
            ))}
          </div>
        </section>
      )}

      {/* 02 · CROSS-ORG BLOCKERS — hidden for Pillar PMs and Sponsors */}
      {(!persona || !persona.pillarFilter) && !hideSection('cross-org') && (
        <section className="card">
          <SectionKicker num="02" label="Active cross-pillar blockers" sub="Where a decision in one pillar is gating delivery in another. Roadblocks executives need to know about." accent="syellow" />
          <div className="space-y-2">
            {CROSS_ORG_BLOCKERS.map((b, i) => <BlockerRow key={i} b={b} />)}
          </div>
        </section>
      )}

      {/* 03 · KPI STRIP — 6 leading KPIs incl. Value at Risk · label adapts per persona */}
      <SectionKicker
        num="03"
        label={persona?.pillarFilter ? `${persona.pillarLabel} health · 6 KPIs` : (persona?.id === 'director' ? 'Strategic KPIs · 6 indicators' : (persona?.id === 'sponsor' ? 'Your sponsored portfolio · 6 KPIs' : 'Portfolio health · 6 leading KPIs'))}
      />
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          label="Value at Risk"
          value="$50M"
          sub="of $600M top-line plan · 8.3% exposed"
          target="< 10%"
          tooltip="Total $ value of strategic outcomes exposed by initiatives currently off-track or at-risk. Standard portfolio risk measure tied back to top-line P&L commitment."
          jdLink="Define and manage portfolio KPIs (risk exposure)"
        />
        <KpiCard icon={TrendingUp}    label={KPI_DEFINITIONS[0].label} value={kpiValues.health}     sub={kpiValues.healthSub}     target={KPI_DEFINITIONS[0].target} tooltip={KPI_DEFINITIONS[0].tooltip} jdLink={KPI_DEFINITIONS[0].jdLink} />
        <KpiCard icon={DollarSign}    label={KPI_DEFINITIONS[1].label} value={kpiValues.capital}    sub={kpiValues.capitalSub}    target={KPI_DEFINITIONS[1].target} tooltip={KPI_DEFINITIONS[1].tooltip} jdLink={KPI_DEFINITIONS[1].jdLink} />
        <KpiCard icon={CheckCircle2}  label={KPI_DEFINITIONS[2].label} value={kpiValues.compliance} sub={kpiValues.complianceSub} target={KPI_DEFINITIONS[2].target} tooltip={KPI_DEFINITIONS[2].tooltip} jdLink={KPI_DEFINITIONS[2].jdLink} />
        <KpiCard icon={Clock}         label={KPI_DEFINITIONS[3].label} value={kpiValues.cycle}      sub={kpiValues.cycleSub}      target={KPI_DEFINITIONS[3].target} tooltip={KPI_DEFINITIONS[3].tooltip} jdLink={KPI_DEFINITIONS[3].jdLink} />
        <KpiCard icon={AlertTriangle} label={KPI_DEFINITIONS[4].label} value={kpiValues.alignment}  sub={kpiValues.alignmentSub}  target={KPI_DEFINITIONS[4].target} tooltip={KPI_DEFINITIONS[4].tooltip} jdLink={KPI_DEFINITIONS[4].jdLink} />
      </section>

      {/* 04 · STAGE-GATE PIPELINE — hidden for Director and Sponsor (too tactical) */}
      {!hideSection('stage-gate') && (
      <section className="card">
        <SectionKicker
          num="04"
          label={persona?.pillarFilter ? `${persona.pillarLabel} · Stage-Gate Pipeline` : 'Stage-Gate Pipeline · G0 → G5'}
          sub={persona?.pillarFilter ? `Your pillar's initiatives flowing through the lifecycle. Hover any stage for definition.` : 'Initiatives flowing through the lifecycle. Hover any stage for definition.'}
        />
        <div className="flex items-start justify-around gap-2 flex-wrap pt-2 px-2">
          {stageDistribution.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center text-center" style={{ minWidth: 90 }}>
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full grid place-items-center border-2 cursor-help" style={{ background: 'rgba(103, 232, 249, 0.08)', borderColor: 'rgba(103, 232, 249, 0.4)' }}>
                    <span className="font-serif font-bold text-3xl text-white leading-none">{s.count}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold text-white" style={{ background: '#0B5CAB' }}>
                    {idx + 1}
                  </div>
                  {/* Hover tooltip explaining the stage */}
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute z-30 bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 bg-sfnavy text-white text-[11px] rounded-lg p-3 shadow-2xl leading-relaxed border border-sflight/30 pointer-events-none">
                    <div className="font-mono font-bold text-sflight mb-1">{s.id} · {s.name}</div>
                    <div className="text-white/85">{s.desc}</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-sflight font-bold mt-2.5 tracking-widest">{s.id}</div>
                <div className="text-xs font-semibold text-sfnavy mt-1">{s.name}</div>
                <div className="text-[10px] text-sfmuted mt-0.5">{fmtMoney(s.budget)}</div>
              </div>
              {idx < stageDistribution.length - 1 && (
                <div className="flex items-center pt-7 text-sfmuted text-xl select-none">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
      )}

      {/* 05 · PILLAR PERFORMANCE — hidden for Director, Sponsor, and Pillar PMs */}
      {!hideSection('pillar-grid') && (
      <section>
        <div className="flex items-center justify-between mb-3">
          <SectionKicker num="05" label="By pillar · capacity + risk" sub="Click any pillar card to filter the tracker below." />
          <span className="text-xs text-sfmuted hidden md:inline"></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pillarMetrics.map(p => {
            const isActive = pillarFilter === p.id;
            const utilColor =
              p.fteUtil > 100 ? 'bg-sred' :
              p.fteUtil > 95  ? 'bg-syellow' :
                                'bg-sgreen';
            return (
              <button
                key={p.id}
                onClick={() => setPillarFilter(isActive ? 'all' : p.id)}
                className={`text-left card card-hover ${isActive ? 'ring-2 ring-sfblue' : ''}`}
              >
                <div className="text-xs font-semibold text-sfnavy leading-tight">{p.name}</div>
                <div className="text-[11px] text-sfmuted mt-0.5">{p.lead}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-serif font-bold text-sfnavy">{p.activeCount}</span>
                  <span className="text-xs text-sfmuted">active</span>
                </div>
                <div className="text-xs text-sfmuted">{fmtMoney(p.budget)} allocated</div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-sfmuted mb-0.5">
                    <span>FTE util</span>
                    <span className="font-medium">{p.fteUtil}%</span>
                  </div>
                  <ProgressBar pct={p.fteUtil} color={utilColor} />
                </div>
                {p.atRisk > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-sred">
                    <AlertTriangle className="w-3 h-3" /> {p.atRisk} at risk
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
      )}

      {/* 06 · INITIATIVE TRACKER — hidden for Director and Sponsor (too tactical) */}
      {!hideSection('tracker') && (
      <section className="card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <SectionKicker
              num="06"
              label={persona?.pillarFilter ? `${persona.pillarLabel} initiatives · full table` : 'All initiatives · full table'}
              sub={`${filtered.length} of ${INITIATIVES.length} shown.`}
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <select
              value={pillarFilter}
              onChange={e => setPillarFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-2 py-1 bg-white"
            >
              <option value="all">All Pillars</option>
              {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-2 py-1 bg-white"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">ID</th>
                <th className="py-2 pr-3 font-semibold">Initiative</th>
                <th className="py-2 pr-3 font-semibold">Pillar</th>
                <th className="py-2 pr-3 font-semibold">Stage</th>
                <th className="py-2 pr-3 font-semibold">Status</th>
                <th className="py-2 pr-3 font-semibold">Budget · Spent</th>
                <th className="py-2 pr-3 font-semibold">FTE</th>
                <th className="py-2 pr-3 font-semibold">V25 OKRs</th>
                <th className="py-2 pr-3 font-semibold">Last Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const p = pillarById(i.pillar);
                const stage = stageById(i.stage);
                const status = STATUS_META[i.status];
                const spentPct = Math.round((i.spent / i.budget) * 100);
                const barColor =
                  i.status === 'off_track' ? 'bg-sred' :
                  i.status === 'at_risk'   ? 'bg-syellow' :
                                              'bg-sfblue';
                return (
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-white/5 transition-colors">
                    <td className="py-2 pr-3 font-mono text-xs text-sfmuted">{i.id}</td>
                    <td className="py-2 pr-3 font-medium text-sfnavy">{i.name}</td>
                    <td className="py-2 pr-3 text-xs text-sfmuted">{p.name}</td>
                    <td className="py-2 pr-3 text-xs"><span className="font-mono text-sfdeep font-semibold">{stage.id}</span> <span className="text-sfmuted">{stage.name}</span></td>
                    <td className="py-2 pr-3"><span className={status.pill}>{status.label}</span></td>
                    <td className="py-2 pr-3">
                      <div className="text-xs font-medium">{fmtMoney(i.spent)} <span className="text-sfmuted font-normal">/ {fmtMoney(i.budget)}</span></div>
                      <div className="mt-1 w-32"><ProgressBar pct={spentPct} color={barColor} /></div>
                    </td>
                    <td className="py-2 pr-3 text-sm">{i.fte}</td>
                    <td className="py-2 pr-3 text-[11px]">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {i.okrs.map(o => (
                          <span key={o} className="bg-sfblue/10 text-sfblue rounded px-1.5 py-0.5 font-mono">{o}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-xs text-sfmuted font-mono">{i.lastReviewed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      )}
    </div>
  );
}
