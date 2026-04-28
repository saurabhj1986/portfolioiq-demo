import React, { useState, useMemo } from 'react';
import {
  Calculator, Scale, AlertTriangle, CheckSquare, GitCompare, DollarSign,
  Info, Lock, X, ArrowRight, Layers, Activity, TrendingDown, TrendingUp, Search, Settings
} from 'lucide-react';
import { INITIATIVES, fmtMoney, pillarById, STAGE_GATE_ARTIFACTS } from '../data/portfolioData.js';
import {
  SCORING, riceScore, riceRecommendation, riskScore, riskZone,
  totalTCO, totalBenefit, netValue, roiPercent,
  optimizeBudget, gateReadiness, SCENARIOS, summarizeScenario, compareScenarios
} from '../data/decisionData.js';
import { INFLUENCE_FACTORS, FACTOR_META, avgInfluenceScore } from '../data/influenceFactors.js';
import { PROCESS_HEALTH } from '../data/playbooks.js';
import KPIStudio from './KPIStudio.jsx';

const SUB_TABS = [
  { id: 'rice',       label: 'RICE Prioritization', icon: Calculator,   blurb: 'Score and rank every initiative on a single comparable number' },
  { id: 'capital',    label: 'Capital Optimizer',    icon: Scale,        blurb: 'Given a budget cap, pick the highest-value mix' },
  { id: 'risk',       label: 'Risk Heatmap',         icon: AlertTriangle,blurb: 'Plot probability × impact for every initiative' },
  { id: 'gate',       label: 'Stage-Gate Scorer',    icon: CheckSquare,  blurb: 'Objective check before passing an initiative to the next gate' },
  { id: 'value',      label: 'Value & TCO Engine',   icon: DollarSign,   blurb: 'Total cost of ownership vs. full benefit decomposition' },
  { id: 'factors',    label: 'Influence Factors',    icon: Layers,       blurb: '8 non-financial dimensions including data quality + governance' },
  { id: 'health',     label: 'Process Health',       icon: Activity,     blurb: 'Friction metrics, cycle times, anti-patterns detected' },
  { id: 'compare',    label: 'Scenario Compare',     icon: GitCompare,   blurb: 'Side-by-side with auto-generated decision rationale' },
  { id: 'kpi-studio', label: 'KPI Studio',           icon: Settings,     blurb: 'Configurable KPI catalog + portfolio recommendation engine' }
];

function Tip({ children }) {
  return (
    <span className="relative group inline-flex">
      <Info className="w-3.5 h-3.5 text-sfmuted cursor-help" />
      <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute z-30 left-0 top-5 w-80 bg-sfnavy text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed normal-case font-normal">
        {children}
      </span>
    </span>
  );
}

function Header({ title, blurb, framework }) {
  const [showFramework, setShowFramework] = React.useState(false);
  return (
    <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-serif font-bold">{title}</h2>
          <p className="text-sm text-white/80 mt-1">{blurb}</p>
        </div>
        {framework && (
          <button onClick={() => setShowFramework(s => !s)} className="text-[11px] text-sflight hover:text-white border border-sflight/40 rounded px-2 py-1 flex-shrink-0 flex items-center gap-1">
            {showFramework ? 'Hide' : 'What is this?'} <Info className="w-3 h-3" />
          </button>
        )}
      </div>
      {showFramework && framework && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/80 leading-relaxed">
          {framework}
        </div>
      )}
    </div>
  );
}

// -------------------- RICE --------------------
function RiceMatrix() {
  const [sortBy, setSortBy] = useState('score');
  const rows = useMemo(() => {
    return INITIATIVES.map(i => {
      const s = riceScore(i.id);
      const r = riceRecommendation(s);
      const sc = SCORING[i.id]?.rice;
      return { ...i, score: s, rec: r, ...sc };
    }).sort((a, b) => sortBy === 'score' ? b.score - a.score : a.name.localeCompare(b.name));
  }, [sortBy]);

  return (
    <div className="space-y-4">
      <Header
        title="RICE Prioritization Matrix"
        blurb="Stack-rank every initiative on one comparable number"
        framework="RICE = (Reach × Impact × Confidence) / Effort. Created by Intercom in 2017. Forces every PM to score on the same dimensions instead of arguing in metaphors."
      />

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-xs">
          <div className="bg-sfbg p-3 rounded-lg">
            <div className="font-semibold text-sfnavy mb-1 flex items-center gap-1">Reach <Tip>How many users / teams / customers benefit. Score 1–10. Higher = wider impact across the org.</Tip></div>
            <div className="text-sfmuted">1 (one team) → 10 (entire company)</div>
          </div>
          <div className="bg-sfbg p-3 rounded-lg">
            <div className="font-semibold text-sfnavy mb-1 flex items-center gap-1">Impact <Tip>How much it moves the needle for those reached. Massive=3, High=2, Medium=1, Low=0.5. Discrete by design — forces a real conversation.</Tip></div>
            <div className="text-sfmuted">0.5 (low) → 3 (massive)</div>
          </div>
          <div className="bg-sfbg p-3 rounded-lg">
            <div className="font-semibold text-sfnavy mb-1 flex items-center gap-1">Confidence <Tip>How sure are we the score is right? 50% = guessing, 80% = good evidence, 100% = data-backed. Penalises over-claiming.</Tip></div>
            <div className="text-sfmuted">50% (hunch) → 100% (proven)</div>
          </div>
          <div className="bg-sfbg p-3 rounded-lg">
            <div className="font-semibold text-sfnavy mb-1 flex items-center gap-1">Effort <Tip>Person-months to deliver. The denominator. Big initiatives need to clear a higher bar to be worth it.</Tip></div>
            <div className="text-sfmuted">In person-months</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-sfnavy">All 16 initiatives, scored</h3>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs border border-slate-300 rounded px-2 py-1">
            <option value="score">Sort: RICE score</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3">Initiative</th>
                <th className="py-2 pr-3">Reach</th>
                <th className="py-2 pr-3">Impact</th>
                <th className="py-2 pr-3">Confidence</th>
                <th className="py-2 pr-3">Effort</th>
                <th className="py-2 pr-3">RICE</th>
                <th className="py-2 pr-3">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-medium text-sfnavy">{r.name}</td>
                  <td className="py-2 pr-3 font-mono">{r.reach}</td>
                  <td className="py-2 pr-3 font-mono">{r.impact}</td>
                  <td className="py-2 pr-3 font-mono">{Math.round(r.confidence * 100)}%</td>
                  <td className="py-2 pr-3 font-mono">{r.effort}mo</td>
                  <td className="py-2 pr-3 font-mono font-bold text-sfnavy">{r.score}</td>
                  <td className="py-2 pr-3"><span className={`pill bg-${r.rec.color}/10 text-${r.rec.color} border border-${r.rec.color}/30`}>{r.rec.label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------- CAPITAL OPTIMIZER --------------------
function CapitalOptimizer() {
  const [budget, setBudget] = useState(25000000);
  const [protectedIds, setProtectedIds] = useState(['INI-103', 'INI-107', 'INI-115']); // Trust default
  const result = useMemo(() => optimizeBudget(budget, protectedIds), [budget, protectedIds]);

  const togglePin = (id) => setProtectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="space-y-4">
      <Header
        title="Capital Allocation Optimizer"
        blurb="If you only had $X to spend, what would you fund?"
        framework="The 'knapsack problem' — given a budget constraint, pick the subset that maximises value. We rank by value-per-dollar and pack greedily. Pinning lets you protect must-haves (e.g., compliance work) before optimising the rest."
      />

      <div className="card">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex-1 min-w-[260px]">
            <label className="text-xs font-semibold text-sfnavy flex items-center gap-1 mb-1">
              Budget cap <Tip>Drag to set the available capital. The optimizer immediately recomputes the best portfolio fit.</Tip>
            </label>
            <input
              type="range" min={10000000} max={50000000} step={500000}
              value={budget} onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-sfblue"
            />
            <div className="flex justify-between text-[11px] text-sfmuted mt-1">
              <span>$10M</span><span className="font-bold text-sfnavy text-sm">{fmtMoney(budget)}</span><span>$50M</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-sfmuted">Spent / Headroom</div>
            <div className="text-2xl font-serif font-bold text-sfnavy">{fmtMoney(result.spent)} <span className="text-sm text-sfmuted">/ {fmtMoney(result.headroom)}</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs text-sfmuted">Value captured</div>
            <div className="text-2xl font-serif font-bold text-sgreen">{fmtMoney(result.valueCaptured)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-sfmuted">Value cut</div>
            <div className="text-2xl font-serif font-bold text-sred">{fmtMoney(result.valueLost)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-sgreen mb-2">✓ Funded ({result.selected.length})</h3>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {result.selected.sort((a,b) => b.valuePerDollar - a.valuePerDollar).map(s => (
                <div key={s.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-sfnavy">{s.name}</div>
                    <div className="text-sfmuted">{fmtMoney(s.cost)} · ${(s.valuePerDollar).toFixed(2)}/$ · RICE {s.rice}</div>
                  </div>
                  <button onClick={() => togglePin(s.id)} className={`p-1 rounded ${s.isProtected ? 'bg-sfblue text-white' : 'text-sfmuted hover:bg-white'}`} title={s.isProtected ? 'Pinned' : 'Pin to protect'}>
                    <Lock className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sred mb-2">✗ Cut ({result.cut.length})</h3>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {result.cut.map(c => (
                <div key={c.id} className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-sfnavy">{c.name}</div>
                    <div className="text-sfmuted">{fmtMoney(c.cost)} · ${(c.valuePerDollar).toFixed(2)}/$ · RICE {c.rice}</div>
                  </div>
                  <button onClick={() => togglePin(c.id)} className="p-1 rounded text-sfmuted hover:bg-white" title="Pin to force-include">
                    <Lock className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {result.cut.length === 0 && <div className="text-xs text-sfmuted italic p-2">No cuts at this budget level.</div>}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-sfmuted mt-3 leading-relaxed">
          <strong>How to read this:</strong> The optimizer protects pinned initiatives first (default: 3 Trust & Security initiatives), then fills the remaining budget by value-per-dollar ranking. Lower the budget to see what gets cut first; raise it to see what comes off the bench.
        </p>
      </div>
    </div>
  );
}

// -------------------- RISK HEATMAP --------------------
function RiskHeatmap() {
  const [selected, setSelected] = useState(null);

  const grid = useMemo(() => {
    const g = {};
    INITIATIVES.forEach(i => {
      const r = SCORING[i.id]?.risk;
      if (!r) return;
      const key = `${r.probability}-${r.impact}`;
      g[key] = g[key] || [];
      g[key].push({ ...i, ...r });
    });
    return g;
  }, []);

  const cellColor = (p, i) => {
    const score = p * i;
    if (score >= 16) return 'bg-red-100 border-red-300 text-sred';
    if (score >= 9)  return 'bg-orange-100 border-orange-300 text-syellow';
    if (score >= 4)  return 'bg-sky-100 border-sky-300 text-sfblue';
    return                'bg-emerald-100 border-emerald-300 text-sgreen';
  };

  const probLabels = { 1: 'Very Low', 2: 'Low', 3: 'Possible', 4: 'Likely', 5: 'Almost Certain' };
  const impactLabels = { 1: 'Negligible', 2: 'Minor', 3: 'Moderate', 4: 'Major', 5: 'Severe' };

  return (
    <div className="space-y-4">
      <Header
        title="5×5 Risk Heatmap"
        blurb="Plot every initiative on Probability × Impact"
        framework="Standard PMO practice (ISO 31000). Risk score = Probability × Impact (1–25). Anything red (≥16) needs executive attention this week. Yellow (9–15) needs a mitigation plan. Green/blue = monitor only."
      />

      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <div className="flex">
              <div className="flex flex-col justify-around mr-2 text-right text-[11px] text-sfmuted py-2">
                <span className="-rotate-90 origin-center text-sfnavy font-semibold whitespace-nowrap">Probability →</span>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-5 gap-1">
                  {[5,4,3,2,1].map(p => (
                    <React.Fragment key={p}>
                      {[1,2,3,4,5].map(i => {
                        const cell = grid[`${p}-${i}`] || [];
                        return (
                          <div key={`${p}-${i}`} className={`aspect-square border-2 rounded-md ${cellColor(p,i)} p-1 relative`}>
                            <div className="text-[9px] font-mono opacity-50 absolute top-0.5 right-1">{p*i}</div>
                            <div className="flex flex-wrap gap-0.5 mt-2">
                              {cell.map(c => (
                                <button
                                  key={c.id}
                                  onClick={() => setSelected(c)}
                                  className="text-[9px] font-mono bg-white/80 hover:bg-white rounded px-1 border border-slate-300"
                                  title={c.name}
                                >
                                  {c.id.slice(4)}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-1 mt-1 text-[10px] text-sfmuted text-center">
                  {[1,2,3,4,5].map(i => <div key={i}>{impactLabels[i]}</div>)}
                </div>
                <div className="text-[11px] text-sfnavy font-semibold text-center mt-1">Impact →</div>
              </div>
              <div className="ml-2 flex flex-col justify-around text-[10px] text-sfmuted">
                {[5,4,3,2,1].map(p => <div key={p}>{probLabels[p]}</div>)}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 text-[11px] flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"/>Critical (16-25)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-100 border border-orange-300 rounded-sm"/>High (9-15)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-sky-100 border border-sky-300 rounded-sm"/>Medium (4-8)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-sm"/>Low (1-3)</span>
            </div>
          </div>

          {/* Detail panel */}
          <div className="bg-sfbg rounded-lg p-3 border border-slate-200">
            {selected ? (
              <div>
                <div className="text-[11px] font-mono text-sfmuted">{selected.id}</div>
                <h4 className="font-serif font-semibold text-sfnavy text-sm">{selected.name}</h4>
                <div className="mt-2 text-xs">
                  <div className="flex justify-between"><span className="text-sfmuted">Probability:</span> <span className="font-mono">{selected.probability}/5 ({probLabels[selected.probability]})</span></div>
                  <div className="flex justify-between"><span className="text-sfmuted">Impact:</span> <span className="font-mono">{selected.impact}/5 ({impactLabels[selected.impact]})</span></div>
                  <div className="flex justify-between mt-1 pt-1 border-t border-slate-200"><span className="text-sfnavy font-semibold">Score:</span> <span className="font-mono font-bold">{selected.probability * selected.impact}/25</span></div>
                </div>
                <div className="mt-3 text-xs">
                  <div className="text-[10px] uppercase font-semibold text-sfmuted mb-1">Mitigation</div>
                  <div className="text-sfnavy leading-relaxed">{selected.mitigation}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-sfmuted italic">Click an initiative ID in the heatmap to see its risk detail.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- STAGE-GATE SCORER --------------------
function GateScorer() {
  const [pickedId, setPickedId] = useState(INITIATIVES[0].id);
  const result = useMemo(() => gateReadiness(pickedId, STAGE_GATE_ARTIFACTS), [pickedId]);
  const ini = INITIATIVES.find(i => i.id === pickedId);

  const checkLabel = {
    artifactsApproved: 'Required artifacts approved & current',
    sponsorAligned:    'Executive sponsor named & engaged',
    capacityLocked:    'Capacity plan signed for next gate',
    depsCleared:       'Upstream dependencies cleared (status not at_risk/off_track)'
  };

  return (
    <div className="space-y-4">
      <Header
        title="Stage-Gate Readiness Scorer"
        blurb="Objective check before passing an initiative to the next gate"
        framework="Stage gates are decision checkpoints between phases. They prevent initiatives from advancing without meeting criteria. We check 4 dimensions; 4/4 = Pass, 3/4 = Conditional with named risks, <3 = Block. Removes opinion from the conversation."
      />

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-semibold text-sfnavy">Initiative</label>
          <select value={pickedId} onChange={e => setPickedId(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm flex-1 max-w-md">
            {INITIATIVES.map(i => <option key={i.id} value={i.id}>{i.id} — {i.name}</option>)}
          </select>
          <Tip>Pick any initiative. The scorer checks live data: artifact status, sponsor presence, capacity plan signoff, dependency health.</Tip>
        </div>

        {ini && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-2">
              {Object.entries(result.checks).map(([k, v]) => (
                <div key={k} className={`flex items-center gap-3 p-3 rounded-lg border ${v ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <CheckSquare className={`w-5 h-5 flex-shrink-0 ${v ? 'text-sgreen' : 'text-sred opacity-30'}`} />
                  <div className="flex-1 text-sm">
                    <div className={`font-medium ${v ? 'text-sgreen' : 'text-sred'}`}>{v ? 'PASS' : 'FAIL'}</div>
                    <div className="text-xs text-sfnavy">{checkLabel[k]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-sfbg rounded-lg p-4 border border-slate-200">
              <div className="text-[10px] uppercase font-semibold text-sfmuted">Verdict</div>
              <div className={`text-2xl font-serif font-bold mt-1 text-${result.verdict.color}`}>{result.passed}/4</div>
              <div className={`text-sm font-medium mt-1 text-${result.verdict.color}`}>{result.verdict.label}</div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-sfmuted leading-relaxed">
                {ini.name} is currently in <strong className="text-sfnavy font-mono">{ini.stage}</strong> with status <strong className="text-sfnavy">{ini.status}</strong>. Sponsor: {ini.sponsor}.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------- VALUE & TCO --------------------
function ValueEngine() {
  const [pickedId, setPickedId] = useState('INI-101');
  const ini = INITIATIVES.find(i => i.id === pickedId);
  const s = SCORING[pickedId];
  const tco = totalTCO(pickedId);
  const ben = totalBenefit(pickedId);
  const roi = roiPercent(pickedId);

  if (!ini || !s) return null;

  return (
    <div className="space-y-4">
      <Header
        title="Value & TCO Engine"
        blurb="What does it really cost — and what value does it really return?"
        framework="TCO (Total Cost of Ownership) is the full lifecycle cost: build + 3yr run + change management + opportunity cost. Benefit is decomposed into 4 categories: revenue uplift, cost savings, risk avoided, and strategic optionality. Net value & ROI tell the real story — many initiatives look cheap to build but expensive to own."
      />

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-semibold text-sfnavy">Initiative</label>
          <select value={pickedId} onChange={e => setPickedId(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 text-sm flex-1 max-w-md">
            {INITIATIVES.map(i => <option key={i.id} value={i.id}>{i.id} — {i.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-sred">Total Cost of Ownership</h3>
              <span className="text-2xl font-mono font-bold text-sred">{fmtMoney(tco)}</span>
            </div>
            <div className="space-y-2 text-sm">
              <CostRow label="Build cost"           value={s.tco.build}       tip="Engineering, design, PM time to ship v1." />
              <CostRow label="Run cost (3yr)"       value={s.tco.run3yr}      tip="Hosting, licensing, ongoing support headcount over the next 3 years." />
              <CostRow label="Change management"    value={s.tco.change}      tip="Training, documentation, communications, change-resistance work. Often underestimated." />
              <CostRow label="Opportunity cost"     value={s.tco.opportunity} tip="The value of the next-best initiative this team could have done instead." />
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-sgreen">Benefit Decomposition</h3>
              <span className="text-2xl font-mono font-bold text-sgreen">{fmtMoney(ben)}</span>
            </div>
            <div className="space-y-2 text-sm">
              <CostRow label="Revenue uplift"       value={s.benefit.revenue}     positive tip="Net new revenue attributable to this initiative." />
              <CostRow label="Cost savings"         value={s.benefit.savings}     positive tip="Direct OpEx reduction (e.g., legacy system retirement)." />
              <CostRow label="Risk avoided"         value={s.benefit.riskAvoided} positive tip="Fines, breach cost, reputation damage that doesn't happen because of this work. Trust & Security is mostly here." />
              <CostRow label="Strategic optionality" value={s.benefit.strategic}  positive tip="Future revenue / cost reduction this enables but doesn't directly create. Hardest to quantify, often the biggest." />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Stat label="Net value" value={fmtMoney(ben - tco)} tone={ben > tco ? 'positive' : 'negative'} tip="Total benefit minus total cost. Positive = creates value. Negative = destroys value." />
          <Stat label="ROI" value={`${roi}%`} tone={roi > 0 ? 'positive' : 'negative'} tip="Return on investment. (Net value / TCO) × 100. Anything below cost-of-capital (~10%) is suspect." />
          <Stat label="Payback period" value={`${s.benefit.paybackMonths} mo`} tone="neutral" tip="Months until cumulative benefit exceeds cumulative cost. Shorter = lower risk." />
        </div>

        <p className="text-[11px] text-sfmuted mt-4 leading-relaxed">
          <strong>Why this matters for the JD:</strong> "Provide executive insights and recommendations to guide strategic trade-offs and capital allocation." A capital allocator who can’t decompose value beyond build cost gets manipulated by the loudest sponsor. This view forces an honest conversation.
        </p>
      </div>
    </div>
  );
}
function CostRow({ label, value, tip, positive }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-sfnavy flex items-center gap-1">{label} <Tip>{tip}</Tip></span>
      <span className={`font-mono text-sm ${positive ? 'text-sgreen' : 'text-sred'}`}>{positive ? '+' : '−'}{fmtMoney(value)}</span>
    </div>
  );
}
function Stat({ label, value, tone, tip }) {
  const color = tone === 'positive' ? 'text-sgreen' : tone === 'negative' ? 'text-sred' : 'text-sfnavy';
  return (
    <div className="bg-white rounded-lg p-3 border border-slate-200">
      <div className="text-[10px] uppercase font-semibold text-sfmuted flex items-center gap-1">{label} <Tip>{tip}</Tip></div>
      <div className={`text-2xl font-serif font-bold ${color}`}>{value}</div>
    </div>
  );
}

// -------------------- INFLUENCE FACTORS (10-dimension scorecard) --------------------
function InfluenceFactors() {
  const [picked, setPicked] = useState('INI-101');
  const [view, setView] = useState('matrix'); // 'matrix' | 'detail'
  const f = INFLUENCE_FACTORS[picked];
  const ini = INITIATIVES.find(i => i.id === picked);

  const cellTone = (score) => {
    if (score >= 4) return 'bg-emerald-100 text-sgreen border-emerald-300';
    if (score >= 3) return 'bg-sky-100 text-sfblue border-sky-300';
    if (score >= 2) return 'bg-orange-100 text-syellow border-orange-300';
    return            'bg-red-100 text-sred border-red-300';
  };

  return (
    <div className="space-y-4">
      <Header
        title="360° Influence Factors"
        blurb="The 10 non-financial dimensions every Sr Portfolio Manager actually weighs"
        framework="RICE and TCO answer 'is this initiative valuable?' These 10 factors answer 'will it actually succeed, and at what cultural/governance cost?' Together they prevent the classic mistake: greenlighting a high-RICE initiative built on bad data, with one specialist, in a regulatory minefield."
      />

      <div className="card">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button onClick={() => setView('matrix')} className={`text-xs px-3 py-1.5 rounded ${view==='matrix' ? 'bg-sfnavy text-white' : 'bg-sfbg text-sfnavy'}`}>Matrix view (all initiatives)</button>
          <button onClick={() => setView('detail')} className={`text-xs px-3 py-1.5 rounded ${view==='detail' ? 'bg-sfnavy text-white' : 'bg-sfbg text-sfnavy'}`}>Detail view (one initiative)</button>
          {view === 'detail' && (
            <select value={picked} onChange={e => setPicked(e.target.value)} className="text-xs border border-slate-300 rounded px-2 py-1.5 ml-auto max-w-md">
              {INITIATIVES.map(i => <option key={i.id} value={i.id}>{i.id} — {i.name}</option>)}
            </select>
          )}
        </div>

        {view === 'matrix' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 sticky left-0 bg-white border-b border-slate-200 font-semibold text-sfnavy">Initiative</th>
                  {FACTOR_META.map(m => (
                    <th key={m.key} className="p-2 border-b border-slate-200 font-semibold text-sfnavy">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-base">{m.icon}</span>
                        <span className="flex items-center gap-1 text-[10px] leading-tight text-center">{m.label} <Tip>{m.tip}</Tip></span>
                      </div>
                    </th>
                  ))}
                  <th className="p-2 border-b border-slate-200 font-semibold text-sfnavy text-center">Avg</th>
                </tr>
              </thead>
              <tbody>
                {INITIATIVES.map(i => {
                  const fac = INFLUENCE_FACTORS[i.id];
                  if (!fac) return null;
                  const avg = avgInfluenceScore(i.id);
                  return (
                    <tr key={i.id}>
                      <td className="p-2 sticky left-0 bg-white border-b border-slate-100 font-medium text-sfnavy text-xs whitespace-nowrap">
                        <div className="font-mono text-[10px] text-sfmuted">{i.id}</div>
                        <div className="leading-tight">{i.name}</div>
                      </td>
                      {FACTOR_META.map(m => {
                        const cell = fac[m.key];
                        if (!cell) return <td key={m.key} className="p-1 border-b border-slate-100"></td>;
                        return (
                          <td key={m.key} className="p-1 border-b border-slate-100 text-center">
                            <div className={`relative group cursor-help w-full aspect-square max-w-[40px] mx-auto rounded border ${cellTone(cell.score)} grid place-items-center font-bold`}>
                              {cell.score}
                              <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute z-30 left-1/2 -translate-x-1/2 top-full mt-1 w-64 bg-sfnavy text-white text-[11px] rounded-lg p-2 shadow-lg leading-relaxed font-normal text-left normal-case">
                                <strong>{m.label}: {cell.score}/5</strong><br />
                                {cell.note}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      <td className="p-2 border-b border-slate-100 text-center font-bold text-sfnavy">{avg}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center gap-3 mt-3 text-[11px] flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-sm"/>Strong (4-5)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-sky-100 border border-sky-300 rounded-sm"/>OK (3)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-100 border border-orange-300 rounded-sm"/>Watch (2)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"/>Action needed (1)</span>
              <span className="ml-auto italic text-sfmuted">Hover any cell for the source note. Each score is 1–5 (5 = strongest for the portfolio).</span>
            </div>
          </div>
        )}

        {view === 'detail' && f && ini && (
          <div>
            <div className="bg-sfbg rounded-lg p-3 mb-3 border border-slate-200">
              <div className="text-xs text-sfmuted">{ini.id} · {pillarById(ini.pillar)?.name}</div>
              <h3 className="font-serif font-bold text-sfnavy">{ini.name}</h3>
              <div className="text-sm text-sfnavy mt-1">Average influence score: <span className="font-bold">{avgInfluenceScore(ini.id)}/5</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FACTOR_META.map(m => {
                const cell = f[m.key];
                if (!cell) return null;
                return (
                  <div key={m.key} className={`rounded-lg p-3 border ${cellTone(cell.score)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{m.icon}</span>
                        <span className="font-semibold text-sm">{m.label}</span>
                      </div>
                      <span className="font-mono font-bold text-lg">{cell.score}/5</span>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed text-sfnavy">{cell.note}</p>
                    <div className="text-[10px] text-sfmuted mt-2 grid grid-cols-2 gap-1">
                      {Object.entries(cell).filter(([k]) => !['score','note'].includes(k)).map(([k,v]) => (
                        <div key={k}><strong className="text-sfnavy">{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-[11px] text-sfmuted mt-4 leading-relaxed">
          <strong>How a portfolio manager uses this:</strong> Run the matrix view first. Initiatives with average score &lt; 3 are red flags — even if their RICE looks great. Then drill into the worst factor for each: a Data Governance 1 is fixable in a quarter; a Talent Risk 1 might mean killing the initiative until you can hire.
        </p>
      </div>
    </div>
  );
}

// -------------------- PROCESS HEALTH --------------------
function ProcessHealth() {
  const sevColor = { critical: 'sred', high: 'syellow', medium: 'sfblue', low: 'sgreen' };

  return (
    <div className="space-y-4">
      <Header
        title="Process Health & Strategic Audit Feedback"
        blurb="Where the portfolio process itself is breaking — and what to do about it"
        framework="A Sr Strategic Portfolio Manager isn't just a referee for initiatives — they audit the PROCESS that governs initiatives. This view surfaces friction (cycle time, rework rate, satisfaction) and detected anti-patterns. Maps to JD #6 'identify friction points in current data workflows' and #9 'data-driven audits to provide strategic feedback to leadership.'"
      />

      {/* Cycle time by gate */}
      <div className="card">
        <h3 className="text-base font-semibold text-sfnavy mb-1 flex items-center gap-2">Median Cycle Time by Gate <Tip>Days an initiative spends in each gate before advancing. Higher than target = process friction. P90 reveals the worst-case experience.</Tip></h3>
        <p className="text-xs text-sfmuted mb-3">G2 Build dominates — expected. G1 Plan is over-target by 7% — investigate.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3">Gate</th>
                <th className="py-2 pr-3">Median (days)</th>
                <th className="py-2 pr-3">Target</th>
                <th className="py-2 pr-3">P90</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {PROCESS_HEALTH.cycleTimeByGate.map(g => {
                if (g.median == null) return (
                  <tr key={g.gate} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-mono font-bold text-sfdeep">{g.gate} {g.name}</td>
                    <td colSpan={4} className="py-2 pr-3 text-xs text-sfmuted italic">Continuous — not measured</td>
                  </tr>
                );
                const pct = g.median / g.target;
                const tone = pct <= 1 ? 'sgreen' : pct <= 1.1 ? 'syellow' : 'sred';
                return (
                  <tr key={g.gate} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-mono font-bold text-sfdeep">{g.gate} {g.name}</td>
                    <td className="py-2 pr-3 font-mono">{g.median}</td>
                    <td className="py-2 pr-3 font-mono text-sfmuted">{g.target}</td>
                    <td className="py-2 pr-3 font-mono text-sfmuted">{g.p90}</td>
                    <td className="py-2 pr-3"><span className={`pill bg-${tone}/10 text-${tone} border border-${tone}/30`}>{pct <= 1 ? 'On target' : pct <= 1.1 ? 'Slight slip' : 'Over target'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rework rate + Pillar NPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-base font-semibold text-sfnavy mb-1 flex items-center gap-2">Artifact Rework Rate <Tip>% of artifacts sent back for revision before approval. High rework = unclear template, wrong audience, or process timing problem.</Tip></h3>
          <p className="text-xs text-sfmuted mb-3">PRD + Capacity Plan are the two worst — known issue, fix proposed (see anti-patterns below).</p>
          <div className="space-y-2">
            {PROCESS_HEALTH.reworkRate.map(r => {
              const overTarget = r.rate > r.target;
              const TrendIcon = r.trend === 'down' ? TrendingDown : r.trend === 'up' ? TrendingUp : ArrowRight;
              const trendColor = r.trend === 'down' ? 'text-sgreen' : r.trend === 'up' ? 'text-sred' : 'text-sfmuted';
              return (
                <div key={r.artifact} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-sfnavy font-medium">{r.artifact}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 relative overflow-hidden">
                    <div className={`h-full ${overTarget ? 'bg-sred' : 'bg-sgreen'}`} style={{ width: `${r.rate}%` }} />
                    <div className="absolute top-0 h-full border-l-2 border-sfnavy" style={{ left: `${r.target}%` }} title={`Target: ${r.target}%`} />
                  </div>
                  <div className="text-xs font-mono w-12 text-right">{r.rate}%</div>
                  <div className={`text-[11px] font-mono w-12 text-right flex items-center gap-0.5 justify-end ${trendColor}`}>
                    <TrendIcon className="w-3 h-3" />{r.trendPct > 0 ? '+' : ''}{r.trendPct}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-sfmuted mt-3 italic">Black line = target. 90-day trend on the right.</div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-sfnavy mb-1 flex items-center gap-2">Pillar PM Process NPS <Tip>Net Promoter Score from Pillar PMs on the portfolio process. The customers of the Sr Mgr role ARE the Pillar PMs — their satisfaction matters.</Tip></h3>
          <p className="text-xs text-sfmuted mb-3">Two pillars in the negative — both correlate with over-capacity. Friction-reduction sprint proposed.</p>
          <div className="space-y-2">
            {PROCESS_HEALTH.pillarSatisfaction.map(p => {
              const tone = p.nps >= 20 ? 'sgreen' : p.nps >= 0 ? 'sfblue' : p.nps >= -20 ? 'syellow' : 'sred';
              return (
                <div key={p.pillar} className="flex items-center gap-2">
                  <div className="flex-1 text-xs text-sfnavy">{p.pillar}</div>
                  <div className="text-xs text-sfmuted">{p.responses} respondents</div>
                  <div className={`font-mono font-bold text-sm w-12 text-right text-${tone}`}>{p.nps > 0 ? '+' : ''}{p.nps}</div>
                  <div className="text-[11px] text-sfmuted w-10 text-right">{p.change}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compliance trend */}
      <div className="card">
        <h3 className="text-base font-semibold text-sfnavy mb-1 flex items-center gap-2">Stage-Gate Compliance — 6 Month Trend <Tip>% of active initiatives with all required artifacts approved and current. The Sr Mgr's flagship operational metric.</Tip></h3>
        <p className="text-xs text-sfmuted mb-3">+17 points in 6 months. Story to tell at next exec review.</p>
        <div className="flex items-end gap-3 h-32">
          {PROCESS_HEALTH.complianceTrend.map((m, i) => {
            const pct = m.pct;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center justify-end">
                <div className="text-xs font-mono font-bold text-sfnavy mb-1">{pct}%</div>
                <div className="w-full bg-sfblue rounded-t" style={{ height: `${pct}%` }} />
                <div className="text-[10px] text-sfmuted mt-1">{m.month.slice(5)}/{m.month.slice(2,4)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anti-patterns / Audit Findings */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-sfblue" />
          <h3 className="text-base font-semibold text-sfnavy">Detected Anti-Patterns — Strategic Feedback for Leadership</h3>
        </div>
        <p className="text-xs text-sfmuted mb-3">Patterns the data surfaces that no single PM can see. This is what JD line #9 means: "data-driven audits to provide strategic feedback to leadership."</p>
        <div className="space-y-3">
          {PROCESS_HEALTH.antiPatterns.map(ap => {
            const tone = sevColor[ap.severity];
            return (
              <div key={ap.id} className={`border-l-4 rounded-r-lg p-3 bg-white border-${tone}`} style={{ borderLeftColor: undefined }}>
                <div className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-${tone}`}>
                  <span>{ap.severity}</span>
                  <span className="text-sfmuted">· {ap.id}</span>
                </div>
                <div className="text-sm font-semibold text-sfnavy mt-1">{ap.pattern}</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div><strong className="text-sfnavy">Affected:</strong> <span className="font-mono text-sfmuted">{ap.affectedInitiatives.join(', ')}</span></div>
                  <div className="md:col-span-2"><strong className="text-sfnavy">Root cause hypothesis:</strong> <span className="text-sfmuted">{ap.rootCauseHypothesis}</span></div>
                </div>
                <div className="mt-2 text-xs bg-sfbg rounded p-2"><strong className="text-sfblue">Recommendation:</strong> {ap.recommendation}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -------------------- SCENARIO COMPARE --------------------
function ScenarioCompare() {
  const [picked, setPicked] = useState(['baseline', 'margin-push', 'agentforce-bet']);
  const cmp = useMemo(() => compareScenarios(picked), [picked]);

  const togglePick = (id) => {
    if (picked.includes(id)) {
      if (picked.length > 2) setPicked(picked.filter(x => x !== id));
    } else if (picked.length < 4) setPicked([...picked, id]);
  };

  return (
    <div className="space-y-4">
      <Header
        title="Scenario Comparison with Decision Rationale"
        blurb="Side-by-side, with auto-generated commentary on the trade-offs"
        framework="Most exec discussions stall because no one separates 'which scenario' from 'why this scenario'. This view computes the numbers AND auto-narrates the rationale, including which Salesforce core value each scenario reinforces."
      />

      <div className="card">
        <div className="text-xs font-semibold text-sfnavy mb-2 flex items-center gap-1">
          Pick 2–4 scenarios to compare <Tip>Each scenario is a complete portfolio thesis with included/excluded initiatives, budget, and a written rationale. Compare any 2–4.</Tip>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SCENARIOS.map(s => {
            const on = picked.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => togglePick(s.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${on ? s.color + ' font-semibold' : 'bg-white text-sfmuted border-slate-300'}`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {cmp && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                    <th className="py-2 pr-3">Metric</th>
                    {cmp.summaries.map(s => (
                      <th key={s.scenario.id} className="py-2 pr-3 font-semibold text-sfnavy">{s.scenario.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CmpRow label="Initiatives funded"  cells={cmp.summaries.map(s => s.initiativeCount)} />
                  <CmpRow label="Total TCO"           cells={cmp.summaries.map(s => fmtMoney(s.tco))} />
                  <CmpRow label="Total benefit"       cells={cmp.summaries.map(s => fmtMoney(s.benefit))} />
                  <CmpRow label="Net value"           cells={cmp.summaries.map(s => fmtMoney(s.netValue))} bold />
                  <CmpRow label="Portfolio ROI"       cells={cmp.summaries.map(s => `${s.roi}%`)} bold />
                  <CmpRow label="Weighted risk score" cells={cmp.summaries.map(s => `${s.weightedRisk}/25`)} />
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-3 text-xs text-sfmuted">Salesforce core values reinforced</td>
                    {cmp.summaries.map(s => (
                      <td key={s.scenario.id} className="py-2 pr-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(s.scenario.coreValueAlignment).map(([v, score]) => (
                            <span key={v} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${score >= 4 ? 'bg-sgreen/10 text-sgreen' : score >= 2 ? 'bg-syellow/10 text-syellow' : 'bg-slate-100 text-sfmuted'}`}>
                              {v} · {score}/5
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Per-scenario commentary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              {cmp.summaries.map(s => (
                <div key={s.scenario.id} className={`rounded-lg p-3 border-2 ${s.scenario.color}`}>
                  <div className="text-xs font-semibold mb-1">{s.scenario.name}</div>
                  <div className="text-[11px] mb-2 italic">{s.scenario.summary}</div>
                  <details className="text-[11px] cursor-pointer">
                    <summary className="font-semibold">Decision rationale →</summary>
                    <div className="mt-2 leading-relaxed font-normal whitespace-pre-line text-sfnavy">{s.scenario.commentary}</div>
                    <div className="mt-2">
                      <strong>Trade-offs you accept:</strong>
                      <ul className="mt-1 space-y-1">
                        {s.scenario.tradeoffs.map((t, i) => <li key={i} className="flex gap-1"><span>•</span><span>{t}</span></li>)}
                      </ul>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {/* Auto-generated meta-commentary */}
            <div className="mt-5 bg-sfnavy text-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitCompare className="w-4 h-4 text-sflight" />
                <h3 className="text-sm font-semibold">Auto-generated decision commentary</h3>
              </div>
              <div className="text-sm leading-relaxed text-white/90 whitespace-pre-line">{cmp.commentary}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CmpRow({ label, cells, bold }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-2 pr-3 text-xs text-sfmuted">{label}</td>
      {cells.map((c, i) => <td key={i} className={`py-2 pr-3 font-mono ${bold ? 'font-bold text-sfnavy' : 'text-sfnavy'}`}>{c}</td>)}
    </tr>
  );
}

// -------------------- MAIN --------------------
export default function DecisionEngine({ sub: subProp, setSub: setSubProp }) {
  const [internalSub, internalSetSub] = useState('rice');
  const sub = subProp ?? internalSub;
  const setSub = setSubProp ?? internalSetSub;
  const ActiveSub = {
    rice: RiceMatrix,
    capital: CapitalOptimizer,
    risk: RiskHeatmap,
    gate: GateScorer,
    value: ValueEngine,
    factors: InfluenceFactors,
    health: ProcessHealth,
    compare: ScenarioCompare,
    'kpi-studio': KPIStudio
  }[sub];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-card p-3">
        <div className="flex flex-wrap gap-2">
          {SUB_TABS.map(t => {
            const Icon = t.icon;
            const active = t.id === sub;
            return (
              <button
                key={t.id}
                onClick={() => setSub(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-sfnavy text-white' : 'text-sfnavy hover:bg-sfbg'}`}
                title={t.blurb}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <ActiveSub />
    </div>
  );
}
