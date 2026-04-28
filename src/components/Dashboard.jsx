import React, { useMemo, useState } from 'react';
import { Info, TrendingUp, AlertTriangle, CheckCircle2, Clock, DollarSign, Sparkles, PlayCircle, ChevronDown, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import {
  INITIATIVES, PILLARS, STAGES, KPI_DEFINITIONS, STATUS_META,
  fmtMoney, pillarById, stageById
} from '../data/portfolioData.js';
import { STAGE_GATE_ARTIFACTS } from '../data/portfolioData.js';

function Tooltip({ text }) {
  return (
    <span className="relative group cursor-help inline-flex">
      <Info className="w-3.5 h-3.5 text-sfmuted" />
      <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute z-20 left-0 top-5 w-72 bg-sfnavy text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed">
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

// PRFAQ FAQs (compact — collapsed by default)
const PRFAQ_FAQS = [
  { q: 'What does the Sr Manager own — and what does the Director own?',
    a: 'The Sr Manager owns process governance, the team of 4 Pillar PMs, the data layer, the cadences, and the comms drafts. The Director owns strategy, sponsor relationships, and final calls on capital allocation. Every recommendation here is a draft for sponsor review, never a final decision.' },
  { q: 'Why a Recommendation Engine if the Sr Manager doesn\'t decide?',
    a: 'It generates a defensible draft. The Director adjusts based on context the data can\'t see. A draft that takes 30 minutes to refine is more valuable than a blank page.' },
  { q: 'How does this scale to coaching 4 direct reports?',
    a: 'The Team Cockpit auto-detects coaching opportunities (overdue 1:1s, leave-coverage, growth signals). AI-drafted weekly briefs free ~30 min/week per PM — at 4 reports, two extra hours of actual coaching per week.' },
  { q: 'Why mock data?',
    a: 'To enable open exploration without compromising any organization\'s portfolio. The schema maps to real connectors (Anaplan, ServiceNow, GUS, Quip) — real data is one connector per source system away.' }
];

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

export default function Dashboard({ navigateTo, activeTour, onStartTour, tourStep, onGoToStep, onCloseTour }) {
  const [pillarFilter, setPillarFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [prfaqOpen, setPrfaqOpen] = useState(false);
  const [openChip, setOpenChip] = useState(null);

  const filtered = useMemo(() => {
    return INITIATIVES.filter(i =>
      (pillarFilter === 'all' || i.pillar === pillarFilter) &&
      (statusFilter === 'all' || i.status === statusFilter)
    );
  }, [pillarFilter, statusFilter]);

  const kpiValues = useMemo(() => {
    const active = INITIATIVES.filter(i => i.status !== 'complete');
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
      count: INITIATIVES.filter(i => i.stage === s.id && i.status !== 'complete').length,
      budget: INITIATIVES.filter(i => i.stage === s.id && i.status !== 'complete').reduce((sum, i) => sum + i.budget, 0)
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
            <button onClick={() => onStartTour && onStartTour('2m')} className="bg-sflight text-white rounded-lg px-4 py-2.5 font-semibold hover:bg-sfblue transition flex items-center justify-center gap-2 text-sm shadow-lg ring-2 ring-white/30">
              <PlayCircle className="w-4 h-4" /> Start 2-min tour
              <span className="text-[10px] bg-white text-sflight rounded px-1.5 py-0.5 font-bold">BEST FOR DEMOS</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onStartTour && onStartTour('20s')} className="bg-white/10 text-white border border-white/30 rounded-lg px-3 py-2 font-medium hover:bg-white/20 transition flex items-center justify-center gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5" /> 20-sec scan
              </button>
              <button onClick={() => onStartTour && onStartTour('5m')} className="bg-white/10 text-white border border-white/30 rounded-lg px-3 py-2 font-medium hover:bg-white/20 transition text-xs">
                5-min deep dive
              </button>
            </div>
            <button onClick={() => setPrfaqOpen(o => !o)} className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-1.5 font-medium hover:bg-white/15 transition flex items-center justify-center gap-1.5 text-xs">
              <Lightbulb className="w-3.5 h-3.5" /> {prfaqOpen ? 'Hide' : 'Why'} this exists <ChevronDown className={`w-3 h-3 transition-transform ${prfaqOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="mt-auto pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
              <div><div className="text-xl font-serif font-bold leading-none">16</div><div className="text-[10px] uppercase text-white/60 mt-1">Initiatives</div></div>
              <div><div className="text-xl font-serif font-bold leading-none">$30M</div><div className="text-[10px] uppercase text-white/60 mt-1">Capital</div></div>
              <div><div className="text-xl font-serif font-bold leading-none">6</div><div className="text-[10px] uppercase text-white/60 mt-1">Pillars</div></div>
            </div>
          </div>

        </div>
      </section>

      {/* PRFAQ — only shown when toggled */}
      {prfaqOpen && (
        <section className="card border-l-4 border-sflight">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-sflight" />
            <h3 className="text-base font-serif font-bold text-sfnavy">How a Sr Manager runs strategic portfolio management</h3>
          </div>
          <p className="italic text-xs text-sfmuted mb-3">An operating-model description: the standards, frameworks, cadences, and team rhythms a Sr Manager owns so the Director can focus on strategy.</p>
          <div className="space-y-2 text-sm text-sfnavy leading-relaxed">
            <p>The Sr Manager is not the strategist. The Director is. The Sr Manager turns strategy into <em>observable, governed, repeatable practice</em> — and builds the team that runs the practice.</p>
            <blockquote className="border-l-4 border-sflight pl-3 py-1 italic text-sfmuted bg-sfbg rounded-r my-2 text-xs">
              "What I need from my Sr Manager isn't strategy. It's the discipline that lets me set strategy without worrying the day-to-day will fall apart." — <em className="not-italic">target user, Sr Director of Portfolio Management</em>
            </blockquote>
            <p>Every recommendation here is a <em>draft for sponsor review</em>, never a final decision. The Decision Engine produces analysis, not verdicts. The KPI Studio drafts a recommendation; the sponsor refines. The Workbench drafts the comms; the Director signs.</p>
          </div>
          <div className="mt-3 space-y-1.5">
            {PRFAQ_FAQS.map((f, i) => (
              <details key={i} className="bg-sfbg border border-slate-200 rounded p-2 text-xs">
                <summary className="font-semibold text-sfnavy cursor-pointer">{f.q}</summary>
                <p className="text-sfnavy mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}


      {/* KPI Strip */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiCard icon={TrendingUp}    label={KPI_DEFINITIONS[0].label} value={kpiValues.health}     sub={kpiValues.healthSub}     target={KPI_DEFINITIONS[0].target} tooltip={KPI_DEFINITIONS[0].tooltip} jdLink={KPI_DEFINITIONS[0].jdLink} />
        <KpiCard icon={DollarSign}    label={KPI_DEFINITIONS[1].label} value={kpiValues.capital}    sub={kpiValues.capitalSub}    target={KPI_DEFINITIONS[1].target} tooltip={KPI_DEFINITIONS[1].tooltip} jdLink={KPI_DEFINITIONS[1].jdLink} />
        <KpiCard icon={CheckCircle2}  label={KPI_DEFINITIONS[2].label} value={kpiValues.compliance} sub={kpiValues.complianceSub} target={KPI_DEFINITIONS[2].target} tooltip={KPI_DEFINITIONS[2].tooltip} jdLink={KPI_DEFINITIONS[2].jdLink} />
        <KpiCard icon={Clock}         label={KPI_DEFINITIONS[3].label} value={kpiValues.cycle}      sub={kpiValues.cycleSub}      target={KPI_DEFINITIONS[3].target} tooltip={KPI_DEFINITIONS[3].tooltip} jdLink={KPI_DEFINITIONS[3].jdLink} />
        <KpiCard icon={AlertTriangle} label={KPI_DEFINITIONS[4].label} value={kpiValues.alignment}  sub={kpiValues.alignmentSub}  target={KPI_DEFINITIONS[4].target} tooltip={KPI_DEFINITIONS[4].tooltip} jdLink={KPI_DEFINITIONS[4].jdLink} />
      </section>

      {/* Stage-Gate Pipeline — circular nodes with connector arrows */}
      <section className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-sfnavy">Stage-Gate Pipeline</h2>
            <p className="text-xs text-sfmuted mt-0.5">Active initiatives flowing through G0 → G5. Budget per stage.</p>
          </div>
          <Tooltip text="Counts and budget exclude Complete initiatives. Stage definitions are uniform across all Pillars per the master taxonomy." />
        </div>
        <div className="flex items-start justify-between gap-1 overflow-x-auto pb-2">
          {stageDistribution.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center text-center" style={{ minWidth: 100 }}>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full grid place-items-center border-2" style={{ background: 'rgba(103, 232, 249, 0.08)', borderColor: 'rgba(103, 232, 249, 0.4)' }}>
                    <span className="font-serif font-bold text-3xl text-white leading-none">{s.count}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold text-white" style={{ background: '#0B5CAB' }}>
                    {idx + 1}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-sflight font-bold mt-2.5 tracking-widest">{s.id}</div>
                <div className="text-xs font-semibold text-sfnavy mt-1">{s.name}</div>
                <div className="text-[10px] text-sfmuted mt-0.5">{fmtMoney(s.budget)}</div>
              </div>
              {idx < stageDistribution.length - 1 && (
                <div className="flex items-center pt-7 px-1 text-sfmuted text-2xl select-none" style={{ minWidth: 16 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Pillar Performance Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-sfnavy">Pillar Performance</h2>
          <span className="text-xs text-sfmuted">Click a pillar to filter the tracker below</span>
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

      {/* Initiative Tracker */}
      <section className="card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-sfnavy">Initiative Tracker</h2>
            <p className="text-xs text-sfmuted">{filtered.length} of {INITIATIVES.length} initiatives shown</p>
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
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-sfbg/60">
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
