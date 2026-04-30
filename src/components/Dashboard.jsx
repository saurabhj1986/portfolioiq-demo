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

  return (
    <div className="space-y-4">
      {/* Compact 2-col hero: story left, actions+stats right */}
      <section className="card bg-gradient-to-br from-sfnavy via-sfdeep to-sfblue text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-sflight/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: story (3/5) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sflight" />
              <span className="text-[10px] uppercase tracking-widest text-sflight font-bold">PortfolioIQ</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight">Operate the portfolio. Equip the leaders.</h1>
            <p className="text-sm text-white/80 mt-2 max-w-3xl leading-relaxed">
              An interactive workspace for portfolio leaders. <span className="text-sflight">Switch personas in the top right</span> to see how the same product adapts to a Sr Manager, Director, Pillar PM, or Sponsor.
            </p>

            {/* Hybrid chips: always-visible captions + click to expand detail */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HERO_CHIPS.map(c => {
                const isOpen = openChip === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setOpenChip(isOpen ? null : c.id)}
                    className={`text-left rounded-lg border transition-all ${isOpen ? 'bg-white/15 border-white/35 ring-1 ring-white/20' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}
                  >
                    <div className="px-3 py-2.5 flex items-start gap-2">
                      <span className="text-base flex-shrink-0 leading-none mt-0.5">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm leading-tight">{c.label}</div>
                        <div className="text-[11px] text-white/75 mt-0.5 leading-snug">{c.caption}</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-white/50 flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180 text-white/80' : ''}`} />
                    </div>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-2 border-t border-white/15 text-xs text-white/90 leading-relaxed">
                        {c.detail}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: actions + stats (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <button onClick={() => onStartTour && onStartTour('2m')} className="bg-sflight text-sfnavy rounded-lg px-4 py-2.5 font-semibold hover:bg-white transition flex items-center justify-center gap-2 text-sm shadow-lg">
              <PlayCircle className="w-4 h-4" /> Start 2-min tour
              <span className="text-[10px] bg-sfnavy text-sflight rounded px-1.5 py-0.5 font-bold">BEST FOR DEMOS</span>
            </button>
            <button onClick={() => onStartTour && onStartTour('5m')} className="bg-white/10 text-white border border-white/25 rounded-lg px-3 py-2 font-medium hover:bg-white/20 transition flex items-center justify-center gap-1.5 text-sm">
              5-min deep dive
            </button>
            <button onClick={() => navigateTo && navigateTo('guide')} className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-1.5 font-medium hover:bg-white/15 transition flex items-center justify-center gap-1.5 text-xs">
              <Lightbulb className="w-3.5 h-3.5" /> Open the Guide <ArrowRight className="w-3 h-3" />
            </button>
            <div className="mt-auto pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
              <div><div className="text-xl font-serif font-bold leading-none">16</div><div className="text-[10px] uppercase text-white/60 mt-1">Initiatives</div></div>
              <div><div className="text-xl font-serif font-bold leading-none">$30M</div><div className="text-[10px] uppercase text-white/60 mt-1">Capital</div></div>
              <div><div className="text-xl font-serif font-bold leading-none">6</div><div className="text-[10px] uppercase text-white/60 mt-1">Pillars</div></div>
            </div>
          </div>

        </div>
      </section>

      {/* RBAC banner — shows what's filtered when persona ≠ Sr Manager */}
      {persona && persona.id !== 'sr-manager' && (
        <section className="bg-sfnavy/60 border border-sflight/30 rounded-lg px-4 py-2.5 flex items-center gap-3 text-xs">
          <span className="text-[10px] uppercase tracking-widest text-sflight font-bold">RBAC</span>
          <span className={persona.accent + ' font-semibold'}>{persona.role}{persona.pillarLabel ? ` · ${persona.pillarLabel}` : ''}</span>
          <span className="text-white/70">{persona.desc}</span>
          {persona.hideTabs.length > 0 && (
            <span className="ml-auto text-[10px] text-white/50 font-mono">Hidden tabs: {persona.hideTabs.join(' · ')}</span>
          )}
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

      {/* 02 · CROSS-ORG BLOCKERS */}
      {(!persona || !persona.pillarFilter) && (
        <section className="card">
          <SectionKicker num="02" label="Active cross-pillar blockers" sub="Where a decision in one pillar is gating delivery in another. Roadblocks executives need to know about." accent="syellow" />
          <div className="space-y-2">
            {CROSS_ORG_BLOCKERS.map((b, i) => <BlockerRow key={i} b={b} />)}
          </div>
        </section>
      )}

      {/* 03 · KPI STRIP — 6 leading KPIs incl. Value at Risk */}
      <SectionKicker num="03" label="Portfolio health · 6 leading KPIs" />
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

      {/* 04 · STAGE-GATE PIPELINE */}
      <section className="card">
        <SectionKicker num="04" label="Stage-Gate Pipeline · G0 → G5" sub="Initiatives flowing through the lifecycle. Hover any stage for definition." />
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

      {/* 05 · PILLAR PERFORMANCE */}
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

      {/* 06 · INITIATIVE TRACKER */}
      <section className="card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <SectionKicker num="06" label="All initiatives · full table" sub={`${filtered.length} of ${INITIATIVES.length} shown.`} />
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
    </div>
  );
}
