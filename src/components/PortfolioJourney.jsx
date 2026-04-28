import React, { useState, useEffect, useMemo } from 'react';
import {
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, FastForward,
  DollarSign, Users, AlertTriangle, TrendingUp, Target, GitBranch,
  CheckCircle2, Clock, Sparkles, Layers
} from 'lucide-react';
import { INITIATIVES, fmtMoney, pillarById } from '../data/portfolioData.js';

// =================== JOURNEY DATA ===================
// Lifecycle snapshots for INI-101 Agentforce Internal Rollout — the most
// instructive sample because it touches multiple pillars, has dependencies,
// and demonstrates risk peak-and-fall through the lifecycle.

const SAMPLE_INITIATIVE_ID = 'INI-101';

const JOURNEY = [
  {
    gate: 'G0', name: 'Concept', week: 1,
    capitalPct: 0, capitalSpent: 0, fteActive: 1,
    riskScore: 6, riskLabel: 'Low — idea phase',
    valueRealized: 0,
    pillarLoad: 2,
    description: 'Sponsor identifies the opportunity. PortfolioCopilot picks up the intake; portfolio team triages within 5 days.',
    events: [
      'Sponsor (Srini K., CIO) drafts brief',
      'Intake submitted via Initiative Intake Playbook',
      'Triage decision: ACCEPT, assigned to Data & AI Platform pillar',
      'Initial RICE estimate: 1.4 (Watch tier)'
    ],
    activeKpis: [],
    artifacts: { 'Intake brief': 'in-progress' },
    crossPillarLoad: [],
    dependencies: { activated: [], blocked: [] },
    sponsorMood: 'curious',
    color: 'sfblue'
  },
  {
    gate: 'G1', name: 'Plan', week: 4,
    capitalPct: 5, capitalSpent: 120000, fteActive: 4,
    riskScore: 9, riskLabel: 'Medium — unknowns surfacing',
    valueRealized: 0,
    pillarLoad: 8,
    description: 'PRD written, architecture reviewed, capacity locked. RICE re-scored with confidence boost. Risks named and owned. Dependencies discovered.',
    events: [
      'PRD drafted (using Initiative Intake Playbook v2.1)',
      'Architecture Review approved by Aarti Vyas',
      'Capacity Plan signed: 9 FTE for Q3-Q4',
      'Risk Register v1 baselined: 4 risks, 1 critical',
      'KPIs locked: RICE = 1.43 (Greenlight tier after re-score)',
      'Dependencies surfaced: gated by AI Governance Framework + Lakehouse'
    ],
    activeKpis: [
      { label: 'RICE Score', value: '1.43', trend: 'locked' },
      { label: 'Budget Allocated', value: '$2.4M', trend: 'locked' },
      { label: 'Stage-Gate Compliance', value: '100%', trend: 'green' }
    ],
    artifacts: { 'PRD': 'approved', 'Architecture Review': 'approved', 'Capacity Plan': 'approved', 'Risk Register': 'approved' },
    crossPillarLoad: [
      { pillar: 'Trust & Security', load: 'AI Governance Framework dependency activated' }
    ],
    dependencies: {
      activated: ['INI-115 AI Governance gates production launch', 'INI-116 Lakehouse provides grounding data'],
      blocked: []
    },
    sponsorMood: 'engaged',
    color: 'sfblue'
  },
  {
    gate: 'G2', name: 'Build', week: 18,
    capitalPct: 45, capitalSpent: 1080000, fteActive: 9,
    riskScore: 15, riskLabel: 'High — peak execution complexity',
    valueRealized: 8,
    pillarLoad: 24,
    description: 'Team at full strength. Capital burning at expected rate. Risk peaks here — execution surprises always emerge mid-build. Cross-pillar contention emerges.',
    events: [
      'Sprint 6 of 12 complete — 50% feature scope shipped',
      'Internal dogfooding with 30 power users',
      'Capital burn on plan: 45% spent, 50% timeline complete',
      'Risk Register refreshed: 1 risk closed, 2 new (vendor + capacity)',
      'AI Governance dependency status: PRD review running 2 weeks late',
      'INI-106 HR Data Cloud and INI-114 Slack Huddles slowed by shared FTE contention'
    ],
    activeKpis: [
      { label: 'Burn Rate', value: '45%', trend: 'on-plan' },
      { label: 'Velocity', value: '32 pts/sprint', trend: 'on-plan' },
      { label: 'Stage-Gate Compliance', value: '88%', trend: 'yellow' },
      { label: 'Pillar PM Sentiment', value: 'NPS +18', trend: 'green' }
    ],
    artifacts: { 'PRD': 'approved', 'Architecture Review': 'approved', 'Capacity Plan': 'approved', 'Risk Register': 'needs-refresh', 'Build Progress Reports': 'approved' },
    crossPillarLoad: [
      { pillar: 'Data & AI Platform', load: '24% pillar capacity (peak)' },
      { pillar: 'Trust & Security', load: 'AI Governance review overdue — escalation triggered' }
    ],
    dependencies: {
      activated: [],
      blocked: ['INI-106 HR Data Cloud (shared FTEs)', 'INI-114 Slack Huddles (lower priority queue)']
    },
    sponsorMood: 'watching closely',
    color: 'syellow'
  },
  {
    gate: 'G3', name: 'Validate', week: 35,
    capitalPct: 75, capitalSpent: 1800000, fteActive: 7,
    riskScore: 11, riskLabel: 'Medium — known quality, not unknown unknowns',
    valueRealized: 22,
    pillarLoad: 18,
    description: 'Build winding down, QA + pilot up. Risk drops as known issues replace unknowns. Pilot users start generating real value signal.',
    events: [
      'Pilot launched to 50 users across 5 teams',
      'Security review passed (Bishop Fox red team)',
      'Pilot adoption: 78% weekly active, 4.2/5 helpfulness',
      'AI Governance dependency CLEARED — PRD approved',
      'Capacity drop: 9 FTE → 7 FTE as build phases out',
      'Launch Readiness artifact ready for sponsor signoff'
    ],
    activeKpis: [
      { label: 'Pilot Adoption', value: '78% WAU', trend: 'green' },
      { label: 'User Helpfulness', value: '4.2 / 5', trend: 'green' },
      { label: 'Bug Rate', value: '0.4 / KLOC', trend: 'green' },
      { label: 'Stage-Gate Compliance', value: '100%', trend: 'green' }
    ],
    artifacts: { 'PRD': 'approved', 'Architecture Review': 'approved', 'Capacity Plan': 'approved', 'Risk Register': 'approved', 'Launch Readiness': 'approved' },
    crossPillarLoad: [
      { pillar: 'Data & AI Platform', load: '18% (winding down)' },
      { pillar: 'Customer Experience Tech', load: 'Pilot integration with C360 begins' }
    ],
    dependencies: {
      activated: [],
      blocked: []
    },
    sponsorMood: 'confident',
    color: 'sgreen'
  },
  {
    gate: 'G4', name: 'Launch', week: 41,
    capitalPct: 88, capitalSpent: 2110000, fteActive: 5,
    riskScore: 8, riskLabel: 'Low-medium — execution risk only',
    valueRealized: 55,
    pillarLoad: 12,
    description: 'Phased rollout. Launch ops + change management + comms heavy. Capital steady, FTE shifting from build to deploy. Value realization curve starts rising sharply.',
    events: [
      'Phased rollout to 500 users (week 1) → 2,000 users (week 4)',
      'Launch comms: all-hands demo, intranet article, manager toolkit',
      'Onboarding sessions: 12 sessions, 1,800 attendees',
      'Adoption: 64% of target audience by week 4',
      'Time-to-value: median 3.2 hours from access → first useful answer',
      'Sponsor briefed: ahead of plan on adoption, on plan on capital'
    ],
    activeKpis: [
      { label: 'Adoption Rate', value: '64%', trend: 'green' },
      { label: 'Time-to-Value', value: '3.2 hours', trend: 'green' },
      { label: 'CSAT', value: '4.4 / 5', trend: 'green' },
      { label: 'Cost per User', value: '$420', trend: 'on-plan' }
    ],
    artifacts: { 'All gate artifacts': 'approved', 'Launch report': 'approved' },
    crossPillarLoad: [
      { pillar: 'Data & AI Platform', load: '12% (deploy team)' },
      { pillar: 'Field Engagement', load: 'Sales team onboarding integration' }
    ],
    dependencies: {
      activated: ['INI-106 HR Data Cloud (now unblocked — FTE freed)', 'INI-114 Slack Huddles (now unblocked)'],
      blocked: []
    },
    sponsorMood: 'pleased',
    color: 'sgreen'
  },
  {
    gate: 'G5', name: 'Sustain', week: 52,
    capitalPct: 100, capitalSpent: 2400000, fteActive: 3,
    riskScore: 4, riskLabel: 'Low — operational',
    valueRealized: 100,
    pillarLoad: 6,
    description: 'Steady-state operations. Build team disbanded; lean ops team owns. Value fully realized — quarterly review confirms ROI. Capital reallocated to next initiatives.',
    events: [
      'Operations transition: Lean ops team (3 FTE) owns going forward',
      'Quarterly Value Review: ROI 142% (vs. 110% target)',
      'Adoption stable at 87% weekly active across 12,400 users',
      'Customer impact: $8.4M annualized cost savings (deflected support volume)',
      'Strategic value: Agentforce platform proven internally → external GTM accelerated',
      '6 FTE released back to pillar capacity → reallocated to INI-108 Customer 360 Voice'
    ],
    activeKpis: [
      { label: 'ROI Realized', value: '142%', trend: 'green' },
      { label: 'NPS', value: '+62', trend: 'green' },
      { label: 'Value Capture', value: '$8.4M / year', trend: 'green' },
      { label: 'Cost per User', value: '$192', trend: 'green' },
      { label: 'Stage-Gate Compliance', value: '100%', trend: 'green' }
    ],
    artifacts: { 'All gate artifacts': 'approved', 'Sustain runbook': 'approved', 'Value realization report': 'approved' },
    crossPillarLoad: [
      { pillar: 'Data & AI Platform', load: '6% (steady-state)' }
    ],
    dependencies: {
      activated: ['INI-108 Customer 360 Voice receives 6 FTE from this team'],
      blocked: []
    },
    sponsorMood: 'champion',
    color: 'sgreen'
  }
];

// =================== HELPERS ===================
const TONE_BG  = { sfblue: 'bg-sfblue/10',  syellow: 'bg-orange-50', sgreen: 'bg-emerald-50' };
const TONE_TXT = { sfblue: 'text-sfblue',   syellow: 'text-syellow', sgreen: 'text-sgreen' };
const TONE_BAR = { sfblue: 'bg-sfblue',     syellow: 'bg-syellow',   sgreen: 'bg-sgreen' };

function Tile({ icon: Icon, label, value, sub, accent = 'sfblue' }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg ${TONE_BG[accent]} grid place-items-center`}>
          <Icon className={`w-4 h-4 ${TONE_TXT[accent]}`} />
        </div>
        <span className="text-[11px] uppercase tracking-wide text-sfmuted font-semibold">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-serif font-bold text-sfnavy transition-all duration-700">{value}</div>
      {sub && <div className="text-xs text-sfmuted mt-0.5">{sub}</div>}
    </div>
  );
}

function StageNode({ stage, idx, currentIdx, onClick }) {
  const isCurrent = idx === currentIdx;
  const isPast    = idx < currentIdx;
  const isFuture  = idx > currentIdx;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center group"
      style={{ minWidth: 100 }}
    >
      <div className={`relative w-10 h-10 rounded-full grid place-items-center transition-all
        ${isCurrent ? `bg-sfblue text-white ring-4 ring-sfblue/20 scale-110 shadow-cardHover` :
         isPast    ? 'bg-sgreen text-white' :
                     'bg-slate-200 text-sfmuted'}`}>
        <span className="font-mono font-bold text-xs">{stage.gate}</span>
        {isCurrent && (
          <span className="absolute -inset-1 rounded-full border-2 border-sfblue animate-ping opacity-50" />
        )}
      </div>
      <div className={`mt-2 text-[11px] font-medium ${isCurrent ? 'text-sfblue' : isPast ? 'text-sgreen' : 'text-sfmuted'}`}>{stage.name}</div>
      <div className={`text-[10px] ${isCurrent ? 'text-sfblue' : 'text-sfmuted'}`}>Wk {stage.week}</div>
    </button>
  );
}

// =================== MAIN ===================
export default function PortfolioJourney() {
  const initiative = INITIATIVES.find(i => i.id === SAMPLE_INITIATIVE_ID);
  const pillar = pillarById(initiative.pillar);
  const [stageIdx, setStageIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(2500);

  // Auto-advance when playing
  useEffect(() => {
    if (!playing) return;
    if (stageIdx >= JOURNEY.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStageIdx(s => Math.min(JOURNEY.length - 1, s + 1)), speedMs);
    return () => clearTimeout(t);
  }, [playing, stageIdx, speedMs]);

  const stage = JOURNEY[stageIdx];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-sflight flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-serif font-bold">Portfolio Journey — End-to-End Lifecycle</h2>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">
              Watch a single initiative move from inception (G0) to value realization (G5) — and see how every stage ripples across <strong>KPIs</strong>, <strong>Pillars</strong>, <strong>Risks</strong>, <strong>Capital</strong>, and <strong>Resources</strong>. Press Play, step manually, or click any stage on the timeline to jump.
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-baseline justify-between text-xs">
          <span className="text-white/60">Tracking: <span className="text-white font-semibold">{initiative.name}</span> ({initiative.id})</span>
          <span className="text-white/60">Pillar: <span className="text-white font-semibold">{pillar.name}</span> · Sponsor: <span className="text-white">{initiative.sponsor}</span></span>
        </div>
      </div>

      {/* Controls */}
      <div className="card flex items-center gap-2 flex-wrap">
        <button onClick={() => { setStageIdx(0); setPlaying(false); }} className="px-3 py-2 rounded-lg bg-sfbg hover:bg-slate-200 text-sfnavy text-sm flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button onClick={() => setStageIdx(s => Math.max(0, s - 1))} disabled={stageIdx === 0} className="px-3 py-2 rounded-lg bg-sfbg hover:bg-slate-200 text-sfnavy text-sm flex items-center gap-1.5 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button onClick={() => setPlaying(p => !p)} className="px-4 py-2 rounded-lg bg-sfblue hover:bg-sfdeep text-white text-sm font-semibold flex items-center gap-1.5">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {playing ? 'Pause' : (stageIdx === JOURNEY.length - 1 ? 'Replay' : 'Play journey')}
        </button>
        <button onClick={() => setStageIdx(s => Math.min(JOURNEY.length - 1, s + 1))} disabled={stageIdx === JOURNEY.length - 1} className="px-3 py-2 rounded-lg bg-sfbg hover:bg-slate-200 text-sfnavy text-sm flex items-center gap-1.5 disabled:opacity-40">
          Next <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <FastForward className="w-4 h-4 text-sfmuted" />
          <span className="text-xs text-sfmuted">Speed</span>
          <input
            type="range" min={800} max={5000} step={200}
            value={5800 - speedMs}  // invert so right = faster
            onChange={(e) => setSpeedMs(5800 - Number(e.target.value))}
            className="accent-sfblue w-32"
          />
          <span className="text-xs text-sfmuted font-mono w-16">{(speedMs/1000).toFixed(1)}s/stage</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="relative">
          <div className="absolute top-5 left-12 right-12 h-0.5 bg-slate-200" />
          <div
            className="absolute top-5 left-12 h-0.5 bg-sgreen transition-all duration-700"
            style={{ width: `calc((100% - 96px) * ${stageIdx / (JOURNEY.length - 1)})` }}
          />
          <div className="relative flex justify-between">
            {JOURNEY.map((s, i) => (
              <StageNode key={s.gate} stage={s} idx={i} currentIdx={stageIdx} onClick={() => { setPlaying(false); setStageIdx(i); }} />
            ))}
          </div>
        </div>
      </div>

      {/* Stage Detail Card */}
      <div className={`card border-l-4 transition-all`} style={{ borderLeftColor: stage.color === 'sgreen' ? '#2E844A' : stage.color === 'syellow' ? '#FE9339' : '#0176D3' }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-sfmuted">
              <span className="font-mono font-bold text-sfdeep">{stage.gate}</span>
              <span>·</span>
              <span>Week {stage.week}</span>
              <span>·</span>
              <span className="italic">Sponsor mood: {stage.sponsorMood}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-sfnavy mt-1">{stage.name}</h3>
            <p className="text-sm text-sfnavy mt-1 leading-relaxed max-w-3xl">{stage.description}</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase font-semibold text-sfmuted">Stage</div>
            <div className="text-3xl font-serif font-bold text-sfnavy">{stageIdx + 1}<span className="text-sfmuted text-base">/{JOURNEY.length}</span></div>
          </div>
        </div>
      </div>

      {/* 5 STAT TILES — these animate as stage changes */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Tile icon={DollarSign}    label="Capital"    value={`${stage.capitalPct}%`}        sub={`${fmtMoney(stage.capitalSpent)} of $2.4M`}        accent="sfblue" />
        <Tile icon={Users}         label="Resources"  value={`${stage.fteActive} FTE`}      sub={`${stage.pillarLoad}% pillar load`}                 accent="sfblue" />
        <Tile icon={AlertTriangle} label="Risk"       value={`${stage.riskScore}/25`}       sub={stage.riskLabel}                                    accent={stage.riskScore >= 12 ? 'syellow' : stage.riskScore >= 7 ? 'sfblue' : 'sgreen'} />
        <Tile icon={TrendingUp}    label="Value"      value={`${stage.valueRealized}%`}     sub="of expected lifetime value"                          accent="sgreen" />
        <Tile icon={Target}        label="Active KPIs" value={`${stage.activeKpis.length}`} sub="measurable at this stage"                            accent="sfblue" />
      </div>

      {/* Capital + Risk + Value bars (animated) */}
      <div className="card">
        <h4 className="text-sm font-semibold text-sfnavy mb-3 flex items-center gap-2">Lifecycle curves <span className="text-[11px] text-sfmuted font-normal">(animate as stage changes)</span></h4>
        <div className="space-y-3">
          <BarTrack label="Capital deployed" value={stage.capitalPct} color="bg-sfblue" hint={fmtMoney(stage.capitalSpent)} />
          <BarTrack label="Risk exposure"     value={stage.riskScore * 4} color={stage.riskScore >= 12 ? 'bg-syellow' : 'bg-sgreen'} hint={`${stage.riskScore}/25`} />
          <BarTrack label="Value realized"    value={stage.valueRealized} color="bg-sgreen" hint={`${stage.valueRealized}% of lifetime`} />
          <BarTrack label="Resource load"     value={stage.pillarLoad * 4} color="bg-sflight" hint={`${stage.fteActive} FTE · ${stage.pillarLoad}% pillar`} />
        </div>
      </div>

      {/* Two-column: Events + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="text-sm font-semibold text-sfnavy mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-sfblue" />What's happening this stage</h4>
          <ul className="space-y-2">
            {stage.events.map((e, i) => (
              <li key={i} className="flex gap-2 text-sm text-sfnavy step-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <CheckCircle2 className="w-4 h-4 text-sgreen flex-shrink-0 mt-0.5" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h4 className="text-sm font-semibold text-sfnavy mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-sfblue" />Active KPIs at this stage</h4>
          {stage.activeKpis.length === 0 ? (
            <p className="text-sm text-sfmuted italic">No measurable KPIs yet — too early. KPIs lock at G1 Plan.</p>
          ) : (
            <div className="space-y-2">
              {stage.activeKpis.map((k, i) => {
                const tone = k.trend === 'green' ? 'text-sgreen' : k.trend === 'yellow' ? 'text-syellow' : k.trend === 'on-plan' ? 'text-sfblue' : 'text-sfmuted';
                return (
                  <div key={i} className="flex items-center justify-between p-2 bg-sfbg rounded-lg step-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-sm text-sfnavy font-medium">{k.label}</span>
                    <span className={`font-mono font-bold ${tone}`}>{k.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pillar Impact + Dependencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="text-sm font-semibold text-sfnavy mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-sfblue" />Pillar impact</h4>
          <div className="bg-sfblue/5 border border-sfblue/20 rounded-lg p-3 mb-3">
            <div className="text-xs text-sfmuted">Primary pillar</div>
            <div className="font-semibold text-sfnavy">{pillar.name}</div>
            <div className="text-xs text-sfmuted mt-1">Capacity load: <strong className="text-sfnavy">{stage.pillarLoad}%</strong> ({stage.fteActive} FTE)</div>
          </div>
          {stage.crossPillarLoad.length > 0 ? (
            <div>
              <div className="text-[11px] uppercase font-semibold text-sfmuted mb-1.5">Cross-pillar effects</div>
              <ul className="space-y-1.5">
                {stage.crossPillarLoad.map((c, i) => (
                  <li key={i} className="text-xs text-sfnavy step-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <strong>{c.pillar}:</strong> <span className="text-sfmuted">{c.load}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-sfmuted italic">No cross-pillar load yet.</p>
          )}
        </div>

        <div className="card">
          <h4 className="text-sm font-semibold text-sfnavy mb-3 flex items-center gap-2"><GitBranch className="w-4 h-4 text-sfblue" />Dependency ripple</h4>
          {stage.dependencies.activated.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] uppercase font-semibold text-sgreen mb-1.5">Activated this stage</div>
              <ul className="space-y-1">
                {stage.dependencies.activated.map((d, i) => (
                  <li key={i} className="text-xs text-sfnavy flex gap-1.5 step-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="text-sgreen">→</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stage.dependencies.blocked.length > 0 && (
            <div>
              <div className="text-[11px] uppercase font-semibold text-syellow mb-1.5">Blocked / contended</div>
              <ul className="space-y-1">
                {stage.dependencies.blocked.map((d, i) => (
                  <li key={i} className="text-xs text-sfnavy flex gap-1.5 step-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="text-syellow">⚠</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stage.dependencies.activated.length === 0 && stage.dependencies.blocked.length === 0 && (
            <p className="text-xs text-sfmuted italic">No dependency events at this stage.</p>
          )}
        </div>
      </div>

      {/* Artifacts strip */}
      <div className="card">
        <h4 className="text-sm font-semibold text-sfnavy mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sfblue" />Stage-gate artifacts state</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stage.artifacts).map(([name, status]) => {
            const pill = status === 'approved' ? 'pill-green' : status === 'in-progress' ? 'pill-blue' : status === 'needs-refresh' ? 'pill-yellow' : 'pill-gray';
            return <span key={name} className={pill}>{name} · {status}</span>;
          })}
        </div>
      </div>

      {/* Educational footer */}
      <div className="card bg-sfbg border-2 border-sfblue/20">
        <h4 className="text-sm font-semibold text-sfnavy mb-2">Why this view exists</h4>
        <p className="text-xs text-sfnavy leading-relaxed">
          Most portfolio dashboards show a static snapshot. But initiatives are <em>moving</em> — capital flows in, FTE pulses up and down, risk peaks mid-build then falls, KPIs become measurable in waves, and dependencies activate or block on a schedule. This view lets executives see one initiative as a system in motion — and understand why a "low-risk" initiative at G0 can be a "high-risk" initiative at G2 without anything going wrong.
        </p>
      </div>
    </div>
  );
}

function BarTrack({ label, value, color, hint }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-sfnavy font-medium">{label}</span>
        <span className="text-sfmuted font-mono">{hint}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700 ease-out`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
