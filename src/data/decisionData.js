// Decision Engine data: RICE, Risk, TCO, Benefit per initiative + 4 DET scenarios.
// All numbers are illustrative — designed to feel realistic at Salesforce DET scale ($30M sub-portfolio).

import { INITIATIVES, fmtMoney } from './portfolioData.js';

// Per-initiative scoring. Indexed by initiative_id.
export const SCORING = {
  'INI-101': { // Agentforce Internal Rollout
    rice: { reach: 9, impact: 3,   confidence: 0.85, effort: 18 },
    risk: { probability: 3, impact: 4, mitigation: 'AI Governance dependency cleared by Q3; Lakehouse on track' },
    tco:     { build: 2400000, run3yr: 1800000, change: 400000, opportunity: 600000 },
    benefit: { revenue: 0,        savings: 8400000, riskAvoided: 1200000, strategic: 3000000, paybackMonths: 14 }
  },
  'INI-102': { // Workday HRIS Migration
    rice: { reach: 10, impact: 2,  confidence: 0.55, effort: 30 },
    risk: { probability: 5, impact: 4, mitigation: 'Risk register expired; immediate refresh + sponsor escalation needed' },
    tco:     { build: 3100000, run3yr: 2400000, change: 900000, opportunity: 1100000 },
    benefit: { revenue: 0,        savings: 4800000, riskAvoided: 800000,  strategic: 600000,  paybackMonths: 28 }
  },
  'INI-103': { // Trust Center 2.0
    rice: { reach: 7, impact: 2.5, confidence: 1.0,  effort: 6 },
    risk: { probability: 1, impact: 2, mitigation: 'Complete; in sustain phase' },
    tco:     { build: 720000,  run3yr: 540000,  change: 120000, opportunity: 80000 },
    benefit: { revenue: 2400000, savings: 600000,  riskAvoided: 3500000, strategic: 1800000, paybackMonths: 8 }
  },
  'INI-104': { // Anaplan Capital Planning Migration
    rice: { reach: 4, impact: 2,   confidence: 0.65, effort: 22 },
    risk: { probability: 4, impact: 3, mitigation: 'PRD review overdue; CFO sponsor unblock pending' },
    tco:     { build: 1800000, run3yr: 1500000, change: 300000, opportunity: 400000 },
    benefit: { revenue: 0,        savings: 3200000, riskAvoided: 400000,  strategic: 800000,  paybackMonths: 22 }
  },
  'INI-105': { // Slack Sales Elevate
    rice: { reach: 8, impact: 2,   confidence: 0.80, effort: 10 },
    risk: { probability: 2, impact: 2, mitigation: 'Healthy; CPQ dependency monitored' },
    tco:     { build: 900000,  run3yr: 720000,  change: 200000, opportunity: 200000 },
    benefit: { revenue: 4200000, savings: 800000,  riskAvoided: 0,       strategic: 1200000, paybackMonths: 11 }
  },
  'INI-106': { // Data Cloud for HR Analytics
    rice: { reach: 6, impact: 2,   confidence: 0.80, effort: 14 },
    risk: { probability: 3, impact: 3, mitigation: 'Lakehouse blocker — sequence after INI-116 G3 sign-off' },
    tco:     { build: 1500000, run3yr: 1200000, change: 250000, opportunity: 300000 },
    benefit: { revenue: 0,        savings: 3800000, riskAvoided: 600000,  strategic: 1500000, paybackMonths: 16 }
  },
  'INI-107': { // Privacy Vault & DSAR Automation
    rice: { reach: 9, impact: 2.5, confidence: 0.85, effort: 12 },
    risk: { probability: 2, impact: 4, mitigation: 'Legal sponsor engaged; on schedule' },
    tco:     { build: 1300000, run3yr: 900000,  change: 200000, opportunity: 200000 },
    benefit: { revenue: 0,        savings: 1800000, riskAvoided: 8500000, strategic: 2200000, paybackMonths: 9 }
  },
  'INI-108': { // Customer 360 Voice (Genie+)
    rice: { reach: 7, impact: 3,   confidence: 0.60, effort: 24 },
    risk: { probability: 3, impact: 3, mitigation: 'Early-stage; product-market fit risk' },
    tco:     { build: 1200000, run3yr: 1500000, change: 300000, opportunity: 600000 },
    benefit: { revenue: 6500000, savings: 0,       riskAvoided: 0,       strategic: 3500000, paybackMonths: 18 }
  },
  'INI-109': { // Mulesoft API Hub Consolidation
    rice: { reach: 8, impact: 2,   confidence: 0.85, effort: 16 },
    risk: { probability: 2, impact: 3, mitigation: 'Stable; legacy API deprecation on track' },
    tco:     { build: 1100000, run3yr: 800000,  change: 250000, opportunity: 250000 },
    benefit: { revenue: 0,        savings: 4200000, riskAvoided: 800000,  strategic: 900000,  paybackMonths: 13 }
  },
  'INI-110': { // CPQ Modernization
    rice: { reach: 8, impact: 2.5, confidence: 0.50, effort: 28 },
    risk: { probability: 5, impact: 5, mitigation: 'Risk register EXPIRED; over-FTE; needs scope cut or sponsor escalation' },
    tco:     { build: 2700000, run3yr: 2100000, change: 600000, opportunity: 900000 },
    benefit: { revenue: 5200000, savings: 1400000, riskAvoided: 0,       strategic: 800000,  paybackMonths: 30 }
  },
  'INI-111': { // Tableau Embedded for Exec Dashboards
    rice: { reach: 5, impact: 1.5, confidence: 1.0,  effort: 5 },
    risk: { probability: 1, impact: 1, mitigation: 'Live; in sustain' },
    tco:     { build: 640000,  run3yr: 480000,  change: 100000, opportunity: 60000 },
    benefit: { revenue: 0,        savings: 1800000, riskAvoided: 0,       strategic: 600000,  paybackMonths: 7 }
  },
  'INI-112': { // ServiceNow Consolidation
    rice: { reach: 9, impact: 2,   confidence: 0.55, effort: 36 },
    risk: { probability: 4, impact: 5, mitigation: 'CAPACITY PLAN MISSING — governance breach; biggest single capital exposure' },
    tco:     { build: 4200000, run3yr: 3000000, change: 800000, opportunity: 1200000 },
    benefit: { revenue: 0,        savings: 6800000, riskAvoided: 1200000, strategic: 1500000, paybackMonths: 32 }
  },
  'INI-113': { // Marketing Cloud Personalization
    rice: { reach: 7, impact: 2.5, confidence: 0.80, effort: 14 },
    risk: { probability: 2, impact: 3, mitigation: 'On track; Mulesoft hub dependency stable' },
    tco:     { build: 1900000, run3yr: 1500000, change: 400000, opportunity: 400000 },
    benefit: { revenue: 7200000, savings: 0,       riskAvoided: 0,       strategic: 1200000, paybackMonths: 12 }
  },
  'INI-114': { // Slack Huddles AI Summaries
    rice: { reach: 9, impact: 1.5, confidence: 0.85, effort: 6 },
    risk: { probability: 2, impact: 2, mitigation: 'Healthy; small scope, fast feedback loop' },
    tco:     { build: 480000,  run3yr: 360000,  change: 80000,  opportunity: 80000 },
    benefit: { revenue: 0,        savings: 2400000, riskAvoided: 0,       strategic: 600000,  paybackMonths: 8 }
  },
  'INI-115': { // AI Governance Framework
    rice: { reach: 9, impact: 3,   confidence: 0.70, effort: 10 },
    risk: { probability: 4, impact: 5, mitigation: 'PRD review overdue; gates Agentforce — escalate before Q3 close' },
    tco:     { build: 850000,  run3yr: 600000,  change: 150000, opportunity: 200000 },
    benefit: { revenue: 0,        savings: 1200000, riskAvoided: 12000000,strategic: 4500000, paybackMonths: 6 }
  },
  'INI-116': { // Data Lakehouse on Snowflake
    rice: { reach: 10, impact: 3,  confidence: 0.85, effort: 32 },
    risk: { probability: 2, impact: 5, mitigation: 'On track; blocks 2 high-priority initiatives if delayed' },
    tco:     { build: 5200000, run3yr: 3600000, change: 700000, opportunity: 1500000 },
    benefit: { revenue: 0,        savings: 9800000, riskAvoided: 2000000, strategic: 6500000, paybackMonths: 18 }
  }
};

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

export function riceScore(id) {
  const r = SCORING[id]?.rice;
  if (!r) return 0;
  return Math.round(((r.reach * r.impact * r.confidence) / r.effort) * 100) / 100;
}

export function riceRecommendation(score) {
  if (score >= 1.5) return { label: 'Greenlight', color: 'sgreen' };
  if (score >= 0.8) return { label: 'Watch',      color: 'sfblue' };
  if (score >= 0.4) return { label: 'Defer',      color: 'syellow' };
  return                 { label: 'Kill / Re-scope', color: 'sred' };
}

export function riskScore(id) {
  const r = SCORING[id]?.risk;
  if (!r) return 0;
  return r.probability * r.impact;  // 1..25
}

export function riskZone(score) {
  if (score >= 16) return { label: 'Critical', color: 'sred',     bg: 'bg-red-100' };
  if (score >= 9)  return { label: 'High',     color: 'syellow',  bg: 'bg-orange-100' };
  if (score >= 4)  return { label: 'Medium',   color: 'sfblue',   bg: 'bg-sky-100' };
  return                  { label: 'Low',      color: 'sgreen',   bg: 'bg-emerald-100' };
}

export function totalTCO(id) {
  const t = SCORING[id]?.tco;
  if (!t) return 0;
  return t.build + t.run3yr + t.change + t.opportunity;
}

export function totalBenefit(id) {
  const b = SCORING[id]?.benefit;
  if (!b) return 0;
  return b.revenue + b.savings + b.riskAvoided + b.strategic;
}

export function netValue(id)  { return totalBenefit(id) - totalTCO(id); }
export function roiPercent(id) {
  const tco = totalTCO(id);
  if (!tco) return 0;
  return Math.round((netValue(id) / tco) * 100);
}

// Greedy knapsack: highest value-per-dollar fits first, respecting protected list.
export function optimizeBudget(budgetCap, protectedIds = []) {
  const protectedSet = new Set(protectedIds);
  const all = INITIATIVES.map(i => ({
    id: i.id,
    name: i.name,
    cost: totalTCO(i.id),
    value: totalBenefit(i.id),
    rice: riceScore(i.id),
    isProtected: protectedSet.has(i.id),
    valuePerDollar: totalBenefit(i.id) / totalTCO(i.id)
  }));

  // Protected always in
  let selected = all.filter(x => x.isProtected);
  let spent = selected.reduce((s, x) => s + x.cost, 0);
  let remaining = all.filter(x => !x.isProtected).sort((a, b) => b.valuePerDollar - a.valuePerDollar);

  for (const item of remaining) {
    if (spent + item.cost <= budgetCap) {
      selected.push(item);
      spent += item.cost;
    }
  }
  const cut = all.filter(a => !selected.find(s => s.id === a.id));
  return {
    selected,
    cut,
    spent,
    headroom: budgetCap - spent,
    valueCaptured: selected.reduce((s, x) => s + x.value, 0),
    valueLost:     cut.reduce((s, x) => s + x.value, 0)
  };
}

// Stage-gate readiness: 4 dimensions, each 0/1
export function gateReadiness(initiativeId, artifacts) {
  const ini = INITIATIVES.find(i => i.id === initiativeId);
  if (!ini) return null;
  const arts = artifacts.filter(a => a.initiative === initiativeId);

  const checks = {
    artifactsApproved: arts.length > 0 && arts.every(a => a.status === 'approved'),
    sponsorAligned:    !!ini.sponsor,
    capacityLocked:    arts.some(a => a.type === 'Capacity Plan' && a.status === 'approved'),
    depsCleared:       ini.status !== 'off_track' && ini.status !== 'at_risk'
  };
  const passed = Object.values(checks).filter(Boolean).length;
  let verdict;
  if (passed === 4) verdict = { label: 'PASS — proceed to next gate',     color: 'sgreen' };
  else if (passed === 3) verdict = { label: 'CONDITIONAL — proceed with named risks', color: 'syellow' };
  else                   verdict = { label: 'BLOCK — do not advance',     color: 'sred' };
  return { checks, passed, verdict };
}

// ============================================================================
// SCENARIOS — 4 realistic Sr Strategic PM situations at Salesforce DET
// ============================================================================

export const SCENARIOS = [
  {
    id: 'baseline',
    name: 'Status Quo (Q2 Baseline)',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    summary: 'Current allocation. All 16 initiatives funded as planned.',
    includedIds: INITIATIVES.map(i => i.id),
    coreValueAlignment: { Trust: 4, 'Customer Success': 5, Innovation: 5, Equality: 1, Sustainability: 1 },
    commentary: `**What this scenario says:** Hold the line. No reallocation, no cuts. Lets every Pillar PM continue current commitments.

**Where it shines:** Maximum optionality. Every V25 OKR has at least one funded initiative. Most stakeholders untouched.

**Where it hurts:** $8.5M is exposed to the 5 at-risk/off-track initiatives. Two pillars (Employee Productivity, Finance & Ops) are over-FTE — burnout risk. Stage-gate compliance only 88% — governance debt accumulating.`,
    tradeoffs: [
      'Highest absolute value but exposes $8.5M to off-track risk',
      'No room for new ideas in H2 — capital is fully deployed',
      '2 pillars over-capacity; CPQ + Workday + ServiceNow continue burning despite warning signals'
    ]
  },
  {
    id: 'margin-push',
    name: 'Margin Push (-15% Q3 cut)',
    color: 'bg-orange-50 text-syellow border-orange-300',
    summary: 'CFO mandate: -$4.5M. Right-size CPQ + defer ServiceNow phase 2 + delay Anaplan.',
    includedIds: ['INI-101','INI-103','INI-105','INI-106','INI-107','INI-108','INI-109','INI-111','INI-113','INI-114','INI-115','INI-116','INI-102','INI-110-scoped','INI-112-deferred','INI-104-deferred'],
    excludedNotes: { 'INI-110': 'Scoped to MVP (-$1.6M)', 'INI-112': 'Phase 2 deferred to FY27 (-$2.9M)', 'INI-104': 'Deferred to Q4 (-$0; pure timing)' },
    coreValueAlignment: { Trust: 4, 'Customer Success': 4, Innovation: 4, Equality: 1, Sustainability: 2 },
    commentary: `**What this scenario says:** When the CFO asks for 15%, don't smear pain across every initiative. Concentrate cuts on initiatives the org is already paying the cost of (off-track, missing artifacts).

**Where it shines:** Recovers $4.5M without touching any V25-Agentforce or V25-Trust work. Forces overdue conversations on CPQ scope and ServiceNow capacity. Lowest near-term execution risk of any cut scenario.

**Where it hurts:** Sales leadership will push back hard on CPQ scope cut — needs CRO air-cover. Anaplan delay frustrates Finance team.`,
    tradeoffs: [
      'CRO will push back on CPQ MVP scope — pre-align before announcing',
      'OKR coverage drops 3 points (still ≥88% — within range)',
      'Frees $4.5M but signals to Pillar PMs that under-governed initiatives get cut first (good behavior shaping)'
    ]
  },
  {
    id: 'agentforce-bet',
    name: 'Agentforce Double-Down',
    color: 'bg-sky-50 text-sfblue border-sky-300',
    summary: 'Reallocate $3M from sustaining work into AI initiatives. Trade short-term margin for long-term moat.',
    includedIds: ['INI-101','INI-108','INI-114','INI-115','INI-116','INI-103','INI-105','INI-107','INI-113'],
    excludedNotes: { 'INI-104': 'Deferred — accept Excel-based planning for 2 more quarters', 'INI-109': 'Deferred — Mulesoft consolidation can wait', 'INI-110': 'Frozen — current CPQ holds', 'INI-112': 'Deferred — ServiceNow stays', 'INI-111': 'Deferred — exec dashboards stay on Tableau v1', 'INI-106': 'Deferred — HR analytics 6 months out', 'INI-102': 'Deferred — Workday extended on legacy' },
    coreValueAlignment: { Trust: 5, 'Customer Success': 5, Innovation: 5, Equality: 1, Sustainability: 1 },
    commentary: `**What this scenario says:** Agentforce is Salesforce's stated #1 strategic bet. The portfolio should reflect that — not by accident, by design.

**Where it shines:** Doubles AI initiative funding. Accelerates AI Governance (de-risks Agentforce). Front-loads Lakehouse (the data foundation everything else needs). Strongest signal that DET is a strategic accelerator, not a cost center.

**Where it hurts:** Defers 7 initiatives. Workday on legacy = HR pain point continues. Anaplan delay = Finance keeps cobbling together Excel. Need explicit CEO/CFO buy-in for the trade.`,
    tradeoffs: [
      'Defers 7 initiatives; multiple Pillar PMs will lose owned scope',
      'Highest strategic upside but lowest stakeholder peace',
      'Requires CFO sign-off on margin trade and CEO endorsement of AI thesis'
    ]
  },
  {
    id: 'trust-first',
    name: 'Trust First (Compliance Priority)',
    color: 'bg-emerald-50 text-sgreen border-emerald-300',
    summary: 'Salesforce\'s #1 core value is Trust. Treat every Trust & Security initiative as protected; rebalance the rest.',
    includedIds: ['INI-103','INI-107','INI-115','INI-101','INI-105','INI-108','INI-109','INI-113','INI-114','INI-116','INI-111','INI-106'],
    excludedNotes: { 'INI-102': 'Deferred to Q4 — Workday timeline relaxed', 'INI-110': 'Scoped to MVP', 'INI-112': 'Phase 2 deferred', 'INI-104': 'Deferred — capital planning stays manual' },
    coreValueAlignment: { Trust: 5, 'Customer Success': 4, Innovation: 4, Equality: 2, Sustainability: 2 },
    commentary: `**What this scenario says:** Treat Trust & Security like a non-negotiable spine. Every Trust initiative is protected; the rest competes for what's left.

**Where it shines:** Aligns explicitly with Salesforce's #1 stated core value (per Kathrin's email signature: "Trust, Customer Success, Innovation, Equality, Sustainability"). De-risks the entire portfolio — every other initiative inherits a stronger compliance + governance backbone.

**Where it hurts:** Trust ROI is mostly risk avoided, not revenue generated — harder to justify on pure financial KPIs. Need to pre-frame Trust value to CFO.`,
    tradeoffs: [
      'Clearest cultural alignment with Salesforce values — easiest scenario to defend internally',
      'Hardest to defend on pure financial ROI — risk-avoided is invisible until it isn\'t',
      'Three deferrals; needs sponsor air-cover for Workday team and CFO'
    ]
  }
];

// ============================================================================
// SCENARIO COMPARISON — auto-generated commentary on why one beats another
// ============================================================================

export function summarizeScenario(scenarioId) {
  const s = SCENARIOS.find(x => x.id === scenarioId);
  if (!s) return null;
  const includedActual = s.includedIds.filter(id => INITIATIVES.find(i => i.id === id));
  const tco = includedActual.reduce((sum, id) => sum + totalTCO(id), 0);
  const benefit = includedActual.reduce((sum, id) => sum + totalBenefit(id), 0);
  const weightedRisk = Math.round(includedActual.reduce((sum, id) => sum + riskScore(id) * totalTCO(id), 0) / tco);
  const initiativeCount = includedActual.length;
  return { scenario: s, tco, benefit, netValue: benefit - tco, roi: Math.round((benefit - tco) / tco * 100), weightedRisk, initiativeCount };
}

export function compareScenarios(scenarioIds) {
  const summaries = scenarioIds.map(summarizeScenario).filter(Boolean);
  if (summaries.length < 2) return null;

  const best = summaries.reduce((a, b) => b.netValue > a.netValue ? b : a);
  const safest = summaries.reduce((a, b) => b.weightedRisk < a.weightedRisk ? b : a);
  const cheapest = summaries.reduce((a, b) => b.tco < a.tco ? b : a);

  return {
    summaries,
    best,
    safest,
    cheapest,
    commentary: `**${best.scenario.name}** delivers the highest net value (${fmtMoney(best.netValue)}, ROI ${best.roi}%) but carries weighted risk score ${best.weightedRisk}/25.

**${safest.scenario.name}** is the lowest-risk path (weighted risk ${safest.weightedRisk}/25), trading ${fmtMoney(best.netValue - safest.netValue)} of net value for de-risking.

**${cheapest.scenario.name}** is the lowest TCO at ${fmtMoney(cheapest.tco)}. Useful as a defensive baseline if CFO mandates capital constraint.

**The decision rationale should weight:** (a) which Salesforce core value the moment requires — Trust/Customer Success/Innovation; (b) sponsor appetite for risk; (c) credibility cost of deferring stakeholder asks. Net value alone is not the answer — it's an input to the conversation, not the decision.`
  };
}
