// KPI Studio: configurable catalog + portfolio recommendation engine.
// Execs pick which KPIs matter (toggle on/off), set weights, and the engine
// scores every initiative + outputs an action recommendation.

import { INITIATIVES, pillarById, STAGE_GATE_ARTIFACTS, DEPENDENCIES } from './portfolioData.js';
import { SCORING, riceScore, riskScore, totalTCO, totalBenefit, roiPercent } from './decisionData.js';
import { INFLUENCE_FACTORS } from './influenceFactors.js';

// ============================================================================
// CATEGORIES — colored groupings for the catalog UI
// ============================================================================
export const KPI_CATEGORIES = [
  { id: 'value',     label: 'Value Creation',  color: 'sgreen',  icon: '💰', desc: 'Does this initiative create value?' },
  { id: 'business',  label: 'Business Impact', color: 'sfblue',  icon: '🎯', desc: 'How much does it move the business?' },
  { id: 'resource',  label: 'Resource',        color: 'syellow', icon: '👥', desc: 'How efficient is the allocation?' },
  { id: 'capital',   label: 'Capital',         color: 'sfdeep',  icon: '🏦', desc: 'Is the budget being spent well?' },
  { id: 'risk',      label: 'Risk',            color: 'sred',    icon: '⚠️', desc: 'How exposed are we?' },
  { id: 'sentiment', label: 'Sentiment',       color: 'sflight', icon: '💬', desc: 'What does the field tell us?' },
  { id: 'strategic', label: 'Strategic Fit',   color: 'sfnavy',  icon: '🧭', desc: 'Does it align with strategy?' }
];

// ============================================================================
// KPI LIBRARY — 17 KPIs every exec might care about
// Each carries: id, category, label, formula (plain English), default weight,
// default enabled state, longer description, and a normalize() that returns 0-100
// for any initiative.
// ============================================================================
export const KPI_LIBRARY = [
  // VALUE CREATION
  { id: 'kpi-roi',         category: 'value',     label: 'ROI %',
    formula: '(Total Benefit − Total TCO) / TCO × 100',
    defaultWeight: 15, defaultEnabled: true,
    desc: 'Lifecycle return on investment. Anything below cost-of-capital (~10%) is suspect.',
    normalize: (id) => clamp(((roiPercent(id) + 50) / 4) ) },

  { id: 'kpi-payback',     category: 'value',     label: 'Payback Period',
    formula: 'Months until cumulative benefit > cumulative cost',
    defaultWeight: 8, defaultEnabled: true,
    desc: 'Faster payback = lower risk. Anything beyond 24 months needs strategic justification.',
    normalize: (id) => {
      const m = SCORING[id]?.benefit?.paybackMonths || 36;
      return clamp(((36 - m) / 30) * 100);
    } },

  { id: 'kpi-net-value',   category: 'value',     label: 'Net Value ($M)',
    formula: 'Total Benefit − Total TCO',
    defaultWeight: 10, defaultEnabled: true,
    desc: 'Absolute dollar value created. Pairs with ROI to balance scale vs efficiency.',
    normalize: (id) => {
      const nv = totalBenefit(id) - totalTCO(id);
      // Portfolio range: -2M (worst) to +15M (best). Normalize.
      return clamp(((nv + 2000000) / 17000000) * 100);
    } },

  // BUSINESS IMPACT
  { id: 'kpi-rice',        category: 'business',  label: 'RICE Score',
    formula: '(Reach × Impact × Confidence) / Effort',
    defaultWeight: 12, defaultEnabled: true,
    desc: 'Composite prioritization. Forces apples-to-apples comparison across initiatives.',
    normalize: (id) => clamp(riceScore(id) * 35) },  // RICE 0-3 → 0-100

  { id: 'kpi-okr-coverage',category: 'business',  label: 'OKR Coverage',
    formula: 'Number of V25 strategic OKRs supported',
    defaultWeight: 8, defaultEnabled: true,
    desc: 'How many top-level objectives this initiative supports. Cross-OKR initiatives compound value.',
    normalize: (id) => {
      const ini = INITIATIVES.find(i => i.id === id);
      return clamp((ini?.okrs?.length || 0) * 33);  // 0-3+ OKRs → 0-100
    } },

  { id: 'kpi-market',      category: 'business',  label: 'Market Timing',
    formula: 'Window state: open_strong=100, open=75, closing=40, fulfilled=20',
    defaultWeight: 5, defaultEnabled: false,
    desc: 'Some initiatives lose 80% of value if shipped 6 months late. Critical for AI/competitive plays.',
    normalize: (id) => {
      const w = INFLUENCE_FACTORS[id]?.marketTiming?.window || 'open';
      return ({ open_strong: 100, open: 75, closing_slow: 50, closing: 40, fulfilled: 20 })[w] || 60;
    } },

  // RESOURCE
  { id: 'kpi-fte-eff',     category: 'resource',  label: 'FTE Efficiency',
    formula: 'Total Benefit ÷ FTEs allocated',
    defaultWeight: 7, defaultEnabled: true,
    desc: 'Value generated per person on the team. Surfaces over-staffed initiatives.',
    normalize: (id) => {
      const ini = INITIATIVES.find(i => i.id === id);
      if (!ini || !ini.fte) return 50;
      const eff = totalBenefit(id) / ini.fte;
      // Range: $50K/FTE (worst) to $1.5M/FTE (best)
      return clamp(((eff - 50000) / 1450000) * 100);
    } },

  { id: 'kpi-talent-risk', category: 'resource',  label: 'Talent & Capacity',
    formula: 'Inverse of key-person + hiring gap risk (1-5 scale)',
    defaultWeight: 6, defaultEnabled: true,
    desc: 'High score = low key-person risk + adequate hiring pipeline.',
    normalize: (id) => clamp((INFLUENCE_FACTORS[id]?.talentRisk?.score || 3) * 20) },

  // CAPITAL
  { id: 'kpi-budget-burn', category: 'capital',   label: 'Budget Discipline',
    formula: '100 − |Actual spend % − Expected spend %|',
    defaultWeight: 8, defaultEnabled: true,
    desc: 'Are we burning capital on plan? Both over-spending AND under-spending hurt the score.',
    normalize: (id) => {
      const ini = INITIATIVES.find(i => i.id === id);
      if (!ini || !ini.budget) return 50;
      const actualPct = (ini.spent / ini.budget) * 100;
      // Use 50% as the mid-year benchmark. Distance from 50% reduces score.
      const dist = Math.abs(actualPct - 50);
      return clamp(100 - dist * 1.2);
    } },

  { id: 'kpi-tco-eff',     category: 'capital',   label: 'TCO Efficiency',
    formula: 'Build cost ÷ Total TCO (lower run cost = more sustainable)',
    defaultWeight: 5, defaultEnabled: false,
    desc: 'Initiatives with low ongoing run cost are easier to absorb long-term.',
    normalize: (id) => {
      const t = SCORING[id]?.tco;
      if (!t) return 50;
      const buildShare = t.build / (t.build + t.run3yr + t.change + t.opportunity);
      return clamp(buildShare * 200);  // 50% build share = 100 score
    } },

  // RISK
  { id: 'kpi-risk-score',  category: 'risk',      label: 'Risk Score (inverse)',
    formula: '25 − (Probability × Impact); 25 = lowest risk',
    defaultWeight: 12, defaultEnabled: true,
    desc: 'Inverted so higher score = safer. Critical risks (>16) drag the composite down hard.',
    normalize: (id) => clamp((25 - riskScore(id)) * 4) },

  { id: 'kpi-gov',         category: 'risk',      label: 'Governance Compliance',
    formula: '% of required stage-gate artifacts that are approved & current',
    defaultWeight: 8, defaultEnabled: true,
    desc: 'Initiatives missing artifacts are governance liabilities — flagged regardless of business case.',
    normalize: (id) => {
      const arts = STAGE_GATE_ARTIFACTS.filter(a => a.initiative === id);
      if (!arts.length) return 30;  // No artifacts at all = poor
      const ok = arts.filter(a => a.status === 'approved').length;
      return clamp((ok / arts.length) * 100);
    } },

  { id: 'kpi-deps',        category: 'risk',      label: 'Dependency Health',
    formula: 'Inverse of high-risk dependencies on this initiative',
    defaultWeight: 6, defaultEnabled: true,
    desc: 'Initiatives dependent on at-risk upstream work inherit that risk.',
    normalize: (id) => {
      const deps = DEPENDENCIES.filter(d => d.downstream === id);
      const highRisk = deps.filter(d => d.risk === 'high').length;
      const mediumRisk = deps.filter(d => d.risk === 'medium').length;
      return clamp(100 - highRisk * 25 - mediumRisk * 10);
    } },

  // SENTIMENT
  { id: 'kpi-stakeholder', category: 'sentiment', label: 'Stakeholder Signal',
    formula: 'Customer/user sentiment score from surveys (1-5 scale)',
    defaultWeight: 6, defaultEnabled: true,
    desc: 'Direct user enthusiasm. Distinguishes "we think this is valuable" from "they\'re asking for it."',
    normalize: (id) => clamp((INFLUENCE_FACTORS[id]?.customerSat?.score || 3) * 20) },

  { id: 'kpi-pm-nps',      category: 'sentiment', label: 'Pillar PM Sentiment',
    formula: 'NPS from owning pillar PM on the initiative',
    defaultWeight: 4, defaultEnabled: false,
    desc: 'How the owning PM feels about the initiative. Negative NPS = morale drag.',
    normalize: (id) => {
      // Derive proxy from pillar NPS (simple model)
      const ini = INITIATIVES.find(i => i.id === id);
      const pillarNps = { dap: 38, ept: -14, ts: 18, fe: 8, cxt: 22, fot: -22 };
      const nps = pillarNps[ini?.pillar] || 0;
      return clamp((nps + 100) / 2);  // -100 to +100 → 0-100
    } },

  // STRATEGIC FIT
  { id: 'kpi-tech-debt',   category: 'strategic', label: 'Tech Debt Delta',
    formula: 'Direction of tech debt: reduces=100, neutral=50, increases=20',
    defaultWeight: 5, defaultEnabled: false,
    desc: 'Initiatives that reduce debt deserve disproportionate weight — they make every future initiative easier.',
    normalize: (id) => {
      const delta = INFLUENCE_FACTORS[id]?.techDebt?.delta;
      return ({ reduces: 100, neutral: 50, increases: 20 })[delta] || 50;
    } },

  { id: 'kpi-data-q',      category: 'strategic', label: 'Data Quality',
    formula: 'Quality of data the initiative depends on or produces (1-5)',
    defaultWeight: 4, defaultEnabled: false,
    desc: 'High RICE built on bad data still ships bad outcomes. Foundational filter.',
    normalize: (id) => clamp((INFLUENCE_FACTORS[id]?.dataQuality?.score || 3) * 20) }
];

function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

// ============================================================================
// SCORING PROFILES — pre-baked weight configurations
// ============================================================================
export const SCORING_PROFILES = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Default — equal weighting across all categories. Good starting point.',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    weights: {} // uses defaults
  },
  {
    id: 'margin-first',
    name: 'Margin-First',
    description: 'CFO mode — heavy weight on capital discipline, ROI, payback, and budget burn.',
    color: 'bg-orange-50 text-syellow border-orange-300',
    weights: {
      'kpi-roi': 25, 'kpi-payback': 18, 'kpi-net-value': 15, 'kpi-budget-burn': 18, 'kpi-tco-eff': 10,
      'kpi-rice': 6, 'kpi-okr-coverage': 4, 'kpi-fte-eff': 12,
      'kpi-risk-score': 8, 'kpi-gov': 6, 'kpi-deps': 4,
      'kpi-talent-risk': 4, 'kpi-stakeholder': 3, 'kpi-market': 0
    }
  },
  {
    id: 'risk-averse',
    name: 'Risk-Averse',
    description: 'Compliance + governance mode — heavy weight on risk, governance, dependencies, talent.',
    color: 'bg-red-50 text-sred border-red-300',
    weights: {
      'kpi-risk-score': 22, 'kpi-gov': 18, 'kpi-deps': 14, 'kpi-talent-risk': 12, 'kpi-data-q': 10,
      'kpi-roi': 8, 'kpi-payback': 6, 'kpi-rice': 5, 'kpi-budget-burn': 5
    }
  },
  {
    id: 'innovation',
    name: 'Innovation-First',
    description: 'CTO mode — strategic fit, market timing, RICE, OKR coverage, tech debt reduction.',
    color: 'bg-sky-50 text-sfblue border-sky-300',
    weights: {
      'kpi-rice': 18, 'kpi-okr-coverage': 14, 'kpi-market': 12, 'kpi-tech-debt': 10, 'kpi-data-q': 8,
      'kpi-roi': 8, 'kpi-net-value': 8, 'kpi-stakeholder': 8,
      'kpi-risk-score': 6, 'kpi-gov': 4, 'kpi-fte-eff': 4
    }
  },
  {
    id: 'trust-first',
    name: 'Trust-First',
    description: 'Compliance-led portfolio — protects governance + data quality + regulatory exposure.',
    color: 'bg-emerald-50 text-sgreen border-emerald-300',
    weights: {
      'kpi-gov': 20, 'kpi-risk-score': 18, 'kpi-data-q': 15, 'kpi-deps': 12,
      'kpi-roi': 8, 'kpi-rice': 8, 'kpi-talent-risk': 8,
      'kpi-okr-coverage': 5, 'kpi-stakeholder': 3, 'kpi-budget-burn': 3
    }
  }
];

export function profileWeights(profileId) {
  const p = SCORING_PROFILES.find(x => x.id === profileId);
  if (!p) return defaultWeights();
  if (Object.keys(p.weights).length === 0) return defaultWeights();
  // Fill missing with 0 (means disabled in this profile)
  const result = {};
  KPI_LIBRARY.forEach(k => { result[k.id] = p.weights[k.id] ?? 0; });
  return result;
}
export function defaultWeights() {
  const w = {};
  KPI_LIBRARY.forEach(k => { w[k.id] = k.defaultEnabled ? k.defaultWeight : 0; });
  return w;
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

// Composite score for one initiative given a weight map.
export function compositeScore(initiativeId, weights) {
  const breakdown = [];
  let weightedSum = 0;
  let totalWeight = 0;

  KPI_LIBRARY.forEach(kpi => {
    const w = weights[kpi.id] || 0;
    if (w === 0) return;
    const raw = kpi.normalize(initiativeId);
    weightedSum += raw * w;
    totalWeight += w;
    breakdown.push({ id: kpi.id, label: kpi.label, category: kpi.category, raw, weight: w, contribution: raw * w });
  });

  const score = totalWeight ? Math.round(weightedSum / totalWeight) : 0;
  // Top contributors (positive pull): highest raw × weight
  const sorted = [...breakdown].sort((a, b) => b.raw - a.raw);
  const topContributors = sorted.slice(0, 3);
  const topDraggers = [...breakdown].sort((a, b) => a.raw - b.raw).slice(0, 3);

  return { score, breakdown, topContributors, topDraggers, totalWeight };
}

// Recommendation tiers based on percentile within the portfolio.
export function recommendAction(percentile) {
  if (percentile >= 75) return { id: 'accelerate',  label: 'Accelerate',  pill: 'pill-green',  icon: '🚀', desc: 'Top quartile — consider increased investment or scope expansion.' };
  if (percentile >= 40) return { id: 'continue',    label: 'Continue',    pill: 'pill-blue',   icon: '✓',  desc: 'On track — hold course, monitor.' };
  if (percentile >= 20) return { id: 'watch',       label: 'Watch',       pill: 'pill-yellow', icon: '👁',  desc: 'Below median — monthly review, surface risks early.' };
  if (percentile >=  7) return { id: 'restructure', label: 'Restructure', pill: 'pill-yellow', icon: '🔄', desc: 'Bottom decile — scope cut, sponsor escalation, or re-baseline.' };
  return                       { id: 'sunset',      label: 'Sunset',      pill: 'pill-red',    icon: '🛑', desc: 'Bottom 5% — propose retirement and capital reallocation.' };
}

// Score every initiative + assign action recommendations
export function rankPortfolio(weights) {
  const scored = INITIATIVES.map(i => {
    const composite = compositeScore(i.id, weights);
    return { initiative: i, ...composite };
  });
  scored.sort((a, b) => b.score - a.score);

  // Assign percentile-based action
  const n = scored.length;
  return scored.map((s, idx) => {
    const percentile = Math.round(((n - idx - 1) / (n - 1)) * 100);
    const action = recommendAction(percentile);
    return { ...s, percentile, action };
  });
}

// Auto-generated commentary for a single ranked initiative
export function commentary(ranked) {
  const { initiative, score, action, topContributors, topDraggers, percentile } = ranked;
  const pillar = pillarById(initiative.pillar)?.name;
  const top = topContributors.filter(c => c.raw >= 60).slice(0, 2).map(c => c.label).join(' + ');
  const bot = topDraggers.filter(c => c.raw < 50).slice(0, 2).map(c => c.label).join(' + ');

  let line = `**${initiative.name}** scores ${score}/100 (${percentile}th percentile) → **${action.label.toUpperCase()}**.`;
  if (top) line += ` Strengths: ${top}.`;
  if (bot) line += ` Drag: ${bot}.`;
  if (action.id === 'accelerate') {
    line += ` Worth increasing investment or expanding scope.`;
  } else if (action.id === 'sunset') {
    line += ` Recommend formal sunset proposal — release capital + capacity for higher-fit work.`;
  } else if (action.id === 'restructure') {
    line += ` Needs scope cut or sponsor re-engagement before next gate.`;
  } else if (action.id === 'watch') {
    line += ` Surface in monthly portfolio review; pre-empt the slip.`;
  }
  return line;
}

// Distribution helper for the recommendations summary
export function actionDistribution(ranked) {
  const dist = { accelerate: 0, continue: 0, watch: 0, restructure: 0, sunset: 0 };
  ranked.forEach(r => { dist[r.action.id]++; });
  return dist;
}
