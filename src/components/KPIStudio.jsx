import React, { useState, useMemo } from 'react';
import {
  Settings, Sparkles, Info, RotateCcw, ChevronDown,
  TrendingUp, Target, Users, DollarSign, AlertTriangle, Heart, Compass,
  Search, Filter
} from 'lucide-react';
import {
  KPI_LIBRARY, KPI_CATEGORIES, SCORING_PROFILES,
  defaultWeights, profileWeights, rankPortfolio, actionDistribution, commentary
} from '../data/kpiCatalog.js';
import { pillarById } from '../data/portfolioData.js';

const CATEGORY_ICON = {
  value: TrendingUp, business: Target, resource: Users, capital: DollarSign,
  risk: AlertTriangle, sentiment: Heart, strategic: Compass
};

function Tip({ children }) {
  return (
    <span className="relative group inline-flex">
      <Info className="w-3.5 h-3.5 text-sfmuted cursor-help" />
      <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute z-30 left-0 top-5 w-72 bg-sfnavy text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed normal-case font-normal">
        {children}
      </span>
    </span>
  );
}

// =================== CATALOG WIZARD ===================
function CatalogWizard({ weights, setWeights, profileId, setProfileId }) {
  const totalWeight = Object.values(weights).reduce((s, w) => s + (w || 0), 0);
  const enabledCount = Object.values(weights).filter(w => w > 0).length;

  const applyProfile = (id) => {
    setProfileId(id);
    setWeights(profileWeights(id));
  };
  const toggle = (kpiId) => {
    const k = KPI_LIBRARY.find(x => x.id === kpiId);
    setWeights({ ...weights, [kpiId]: weights[kpiId] > 0 ? 0 : k.defaultWeight });
    setProfileId('custom');
  };
  const setW = (kpiId, w) => {
    setWeights({ ...weights, [kpiId]: w });
    setProfileId('custom');
  };

  return (
    <div className="space-y-4">
      {/* Profile picker */}
      <div className="card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-semibold text-sfnavy flex items-center gap-2">Pick a scoring profile <Tip>Profiles are pre-configured weight presets for different exec contexts. Switch profiles to instantly re-score the entire portfolio. Customize from any starting point.</Tip></h3>
            <p className="text-xs text-sfmuted">Each profile reflects a specific decision lens. Click to apply, then customize below.</p>
          </div>
          <div className="text-right text-xs text-sfmuted">
            <div>{enabledCount} of {KPI_LIBRARY.length} KPIs active</div>
            <div className="font-mono">Total weight: <span className="text-sfnavy font-bold">{totalWeight}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SCORING_PROFILES.map(p => {
            const active = profileId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyProfile(p.id)}
                className={`text-left px-3 py-2 rounded-lg border-2 text-xs transition ${active ? p.color + ' font-semibold' : 'bg-white text-sfnavy border-slate-200 hover:border-sfblue/40'}`}
                style={{ minWidth: 200 }}
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-[10px] mt-0.5 leading-tight font-normal opacity-90">{p.description}</div>
              </button>
            );
          })}
          {profileId === 'custom' && (
            <span className="px-3 py-2 rounded-lg border-2 border-sflight bg-sflight/10 text-sflight text-xs font-semibold flex items-center gap-2">
              Custom <button onClick={() => applyProfile('balanced')} className="text-sfnavy"><RotateCcw className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      </div>

      {/* KPI catalog grouped by category */}
      {KPI_CATEGORIES.map(cat => {
        const Icon = CATEGORY_ICON[cat.id];
        const kpis = KPI_LIBRARY.filter(k => k.category === cat.id);
        const enabledInCat = kpis.filter(k => weights[k.id] > 0).length;
        return (
          <div key={cat.id} className="card">
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-200">
              <div className={`w-9 h-9 rounded-lg bg-${cat.color}/10 grid place-items-center text-base`}>{cat.icon}</div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-sfnavy">{cat.label}</h3>
                <p className="text-[11px] text-sfmuted">{cat.desc}</p>
              </div>
              <div className="text-xs text-sfmuted">{enabledInCat}/{kpis.length} active</div>
            </div>
            <div className="space-y-2">
              {kpis.map(k => {
                const w = weights[k.id] || 0;
                const enabled = w > 0;
                return (
                  <div key={k.id} className={`p-3 rounded-lg border ${enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggle(k.id)}
                        className={`mt-1 w-9 h-5 rounded-full transition relative flex-shrink-0 ${enabled ? `bg-${cat.color}` : 'bg-slate-300'}`}
                        title={enabled ? 'Disable' : 'Enable'}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${enabled ? 'left-4' : 'left-0.5'}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-sfnavy">{k.label}</span>
                          <Tip>{k.desc}</Tip>
                          <span className="text-[10px] font-mono text-sfmuted">{k.formula}</span>
                        </div>
                        {enabled && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-sfmuted">Weight</span>
                            <input
                              type="range" min={1} max={25} value={w}
                              onChange={(e) => setW(k.id, Number(e.target.value))}
                              className={`flex-1 accent-${cat.color}`}
                            />
                            <span className="text-xs font-mono font-bold text-sfnavy w-8 text-right">{w}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =================== RECOMMENDATIONS VIEW ===================
function RecommendationsView({ weights }) {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const ranked = useMemo(() => rankPortfolio(weights), [weights]);
  const dist = actionDistribution(ranked);

  const filtered = filter === 'all' ? ranked : ranked.filter(r => r.action.id === filter);

  const enabledCount = Object.values(weights).filter(w => w > 0).length;
  if (enabledCount === 0) {
    return (
      <div className="card text-center py-8">
        <AlertTriangle className="w-8 h-8 text-syellow mx-auto mb-2" />
        <p className="text-sm text-sfnavy font-semibold">No KPIs enabled</p>
        <p className="text-xs text-sfmuted mt-1">Switch to the Catalog tab and enable at least one KPI to see recommendations.</p>
      </div>
    );
  }

  const ACTIONS = [
    { id: 'accelerate',  label: 'Accelerate',  color: 'sgreen',  bg: 'bg-emerald-50' },
    { id: 'continue',    label: 'Continue',    color: 'sfblue',  bg: 'bg-sky-50' },
    { id: 'watch',       label: 'Watch',       color: 'syellow', bg: 'bg-orange-50' },
    { id: 'restructure', label: 'Restructure', color: 'sred',    bg: 'bg-orange-100' },
    { id: 'sunset',      label: 'Sunset',      color: 'sred',    bg: 'bg-red-50' }
  ];

  return (
    <div className="space-y-4">
      {/* Distribution summary */}
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base font-serif font-semibold">Portfolio Recommendations</h3>
            <p className="text-xs text-white/80 mt-1">Initiatives scored against {enabledCount} active KPIs and bucketed by percentile. Click any row for the auto-generated rationale.</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 mt-3">
          {ACTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => setFilter(filter === a.id ? 'all' : a.id)}
              className={`bg-white/10 rounded p-2 text-center hover:bg-white/15 transition ${filter === a.id ? 'ring-2 ring-sflight' : ''}`}
            >
              <div className={`text-2xl font-serif font-bold text-${a.color === 'sfblue' ? 'sflight' : a.color === 'sgreen' ? 'sgreen' : a.color === 'syellow' ? 'syellow' : 'sred'}`}>{dist[a.id]}</div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider">{a.label}</div>
            </button>
          ))}
        </div>
        {filter !== 'all' && (
          <button onClick={() => setFilter('all')} className="text-[11px] text-sflight mt-2 hover:underline">Clear filter ({filtered.length} of {ranked.length} shown)</button>
        )}
      </div>

      {/* Ranked table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3">Rank</th>
                <th className="py-2 pr-3">Initiative</th>
                <th className="py-2 pr-3">Pillar</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Recommendation</th>
                <th className="py-2 pr-3">Strengths</th>
                <th className="py-2 pr-3">Drag</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const isOpen = expanded === r.initiative.id;
                const pct = r.score;
                const barColor = r.score >= 70 ? 'bg-sgreen' : r.score >= 50 ? 'bg-sfblue' : r.score >= 30 ? 'bg-syellow' : 'bg-sred';
                return (
                  <React.Fragment key={r.initiative.id}>
                    <tr className="border-b border-slate-100 hover:bg-sfbg/60 cursor-pointer" onClick={() => setExpanded(isOpen ? null : r.initiative.id)}>
                      <td className="py-2 pr-3 text-xs font-mono text-sfmuted">#{ranked.indexOf(r) + 1}</td>
                      <td className="py-2 pr-3">
                        <div className="font-medium text-sfnavy text-sm">{r.initiative.name}</div>
                        <div className="text-[10px] font-mono text-sfmuted">{r.initiative.id}</div>
                      </td>
                      <td className="py-2 pr-3 text-xs text-sfmuted">{pillarById(r.initiative.pillar)?.name}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-mono font-bold text-sfnavy">{r.score}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3"><span className={r.action.pill}>{r.action.icon} {r.action.label}</span></td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {r.topContributors.filter(c => c.raw >= 60).slice(0, 2).map(c => (
                            <span key={c.id} className="text-[10px] bg-emerald-50 text-sgreen rounded px-1.5 py-0.5 border border-emerald-200">{c.label} {c.raw}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {r.topDraggers.filter(c => c.raw < 50).slice(0, 2).map(c => (
                            <span key={c.id} className="text-[10px] bg-red-50 text-sred rounded px-1.5 py-0.5 border border-red-200">{c.label} {c.raw}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-sfmuted"><ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-sfbg">
                        <td colSpan={8} className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                              <div className="text-[10px] uppercase font-bold tracking-wider text-sfblue mb-1">Auto-generated rationale</div>
                              <p className="text-sm text-sfnavy leading-relaxed" dangerouslySetInnerHTML={{ __html: commentary(r).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                              <div className="mt-3 text-[10px] uppercase font-bold tracking-wider text-sfblue mb-1">Recommendation guidance</div>
                              <p className="text-sm text-sfnavy">{r.action.desc}</p>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-wider text-sfblue mb-2">Per-KPI breakdown</div>
                              <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                                {r.breakdown.sort((a, b) => (b.raw * b.weight) - (a.raw * a.weight)).map(b => {
                                  const cat = KPI_CATEGORIES.find(c => c.id === b.category);
                                  const tone = b.raw >= 70 ? 'text-sgreen' : b.raw >= 50 ? 'text-sfblue' : b.raw >= 30 ? 'text-syellow' : 'text-sred';
                                  return (
                                    <div key={b.id} className="flex items-center gap-2 text-[11px]">
                                      <span className="text-sfmuted w-3">{cat?.icon}</span>
                                      <span className="flex-1 text-sfnavy truncate">{b.label}</span>
                                      <span className={`font-mono font-bold w-8 text-right ${tone}`}>{b.raw}</span>
                                      <span className="text-sfmuted text-[10px] w-10 text-right">w:{b.weight}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =================== MAIN ===================
export default function KPIStudio() {
  const [mode, setMode] = useState('recommendations'); // 'catalog' | 'recommendations'
  const [profileId, setProfileId] = useState('balanced');
  const [weights, setWeights] = useState(() => defaultWeights());

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Settings className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-serif font-bold">KPI Studio &amp; Recommendation Engine</h2>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">
              Define which KPIs matter for your portfolio, weight them to reflect the moment, and let the engine score every initiative + recommend a clear action: Accelerate, Continue, Watch, Restructure, or Sunset. Switch profiles instantly to test the lens — Margin-First vs Innovation-First vs Trust-First — and see how the recommendations shift.
            </p>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="bg-white rounded-xl shadow-card p-2 inline-flex gap-1">
        <button
          onClick={() => setMode('recommendations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'recommendations' ? 'bg-sfnavy text-white' : 'text-sfnavy hover:bg-sfbg'}`}
        >
          📊 Recommendations
        </button>
        <button
          onClick={() => setMode('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'catalog' ? 'bg-sfnavy text-white' : 'text-sfnavy hover:bg-sfbg'}`}
        >
          ⚙ KPI Catalog (Wizard)
        </button>
      </div>

      {/* Active mode */}
      {mode === 'recommendations'
        ? <RecommendationsView weights={weights} />
        : <CatalogWizard weights={weights} setWeights={setWeights} profileId={profileId} setProfileId={setProfileId} />}
    </div>
  );
}
