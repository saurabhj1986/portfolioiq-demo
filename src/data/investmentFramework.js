// Investment Framework — bottoms-up NPV per project + top-down portfolio allocation.
// Inspired by capital-allocation discipline: every project normalized through the
// same 5-year NPV model, then ranked by NPV-per-dollar (bang for buck), with a
// top-down asset-allocation overlay (Infra vs Features vs Innovation).

// ============================================================================
// NPV HELPERS
// ============================================================================
export const DISCOUNT_RATE = 0.10; // weighted average cost of capital

export function npv(upfrontCapital, cashFlows, rate = DISCOUNT_RATE) {
  return -upfrontCapital + cashFlows.reduce((sum, cf, i) => sum + cf / Math.pow(1 + rate, i + 1), 0);
}

export function bangForBuck(upfrontCapital, cashFlows, rate = DISCOUNT_RATE) {
  return npv(upfrontCapital, cashFlows, rate) / upfrontCapital;
}

export function paybackMonths(upfrontCapital, cashFlows) {
  // Linear interpolation across yearly cash flows
  let cumulative = -upfrontCapital;
  for (let i = 0; i < cashFlows.length; i++) {
    const next = cumulative + cashFlows[i];
    if (next >= 0) {
      const fractionOfYear = -cumulative / cashFlows[i];
      return Math.round((i + fractionOfYear) * 12);
    }
    cumulative = next;
  }
  return null; // doesn't pay back in horizon
}

// ============================================================================
// SAMPLE PROJECTS — Infra vs Feature comparison
// ============================================================================
export const COMPARISON_PROJECTS = [
  {
    id: 'PROJ-INFRA',
    name: 'Database Scaling Infrastructure',
    category: 'infra',
    categoryLabel: 'Infrastructure',
    description: 'Upgrade core data warehouse for 10× query performance. Internal-only, no customer-facing changes.',
    upfrontCapital: 5_200_000,
    cashFlows: [800_000, 2_400_000, 3_500_000, 4_000_000, 4_200_000],
    cashFlowSource: 'Cost reduction · faster queries → engineer productivity gains + lower compute spend',
    confidence: 0.85,
    strategicFactors: [
      'Foundational — gates 4 downstream initiatives (Agentforce, HR Data Cloud, etc.)',
      'Reduces tech debt — every initiative built on this gets faster',
      'Lower-bounded value — even pessimistic case has positive NPV'
    ],
    risks: ['On track but tight timeline', 'Long-term commitment'],
    why: 'High Bang-for-Buck because the cash flows are real (cost savings, productivity), the asset is foundational, and confidence is high. NPV captures it cleanly.'
  },
  {
    id: 'PROJ-FEATURE',
    name: 'Customer 360 Voice (Genie+)',
    category: 'feature',
    categoryLabel: 'Customer Feature',
    description: 'AI-powered voice analytics for customer service interactions. Customer-facing, revenue-generating.',
    upfrontCapital: 1_200_000,
    cashFlows: [200_000, 1_500_000, 2_800_000, 3_200_000, 3_500_000],
    cashFlowSource: 'Revenue uplift · upsell + reduced churn from improved CX',
    confidence: 0.60,
    strategicFactors: [
      'Strong customer signal — explicit ask in 4 enterprise renewals',
      'Window of competitive advantage open ~6 months',
      'PMF risk — voice quality varies by language; pricing model unproven'
    ],
    risks: ['Product-market fit risk', 'BIPA / GDPR voice biometrics exposure'],
    why: 'Higher absolute NPV due to revenue upside, but lower confidence and lower Bang-for-Buck once risk-adjusted. Strategic + market-timing factors push it up.'
  },
  {
    id: 'PROJ-MOON',
    name: 'Internal Agentforce Rollout',
    category: 'innovation',
    categoryLabel: 'Innovation / Moonshot',
    description: 'Deploy Agentforce internally as a Sr Mgr operating layer (this kind of demo, productionized).',
    upfrontCapital: 2_400_000,
    cashFlows: [-200_000, 1_800_000, 4_500_000, 6_200_000, 7_000_000],
    cashFlowSource: 'Mostly time-saved (intangible) + competitive advantage in talent retention',
    confidence: 0.55,
    strategicFactors: [
      'CEO bet — V25 OKR alignment',
      'Hard-to-quantify upside; proves out a pattern that can scale across 6 pillars',
      'High option value — even partial success de-risks the next 3 years of AI investment'
    ],
    risks: ['Adoption uncertain', 'Cost overruns common in moonshots'],
    why: 'Don\'t over-engineer the NPV — this is innovation budget. Apply test-and-learn, not waterfall financial modelling.'
  }
];

// ============================================================================
// TOP-DOWN PORTFOLIO ALLOCATION
// ============================================================================
export const PORTFOLIO_ALLOCATION = {
  target: {
    infra:      { pct: 30, label: 'Infrastructure',           desc: 'Mandatory continuous reinvestment. Software degrades on a 4-5 year cycle.' },
    features:   { pct: 50, label: 'Customer-Driven Features', desc: 'Demand-driven. What customers are explicitly asking for.' },
    innovation: { pct: 20, label: 'Innovation Moonshots',     desc: 'High-risk bets. Customers don\'t know they want this yet (Steve Jobs lens).' }
  },
  current: {
    // computed from the actual initiative_inventory by category (illustrative numbers)
    infra:      { pct: 38, dollars: 11_400_000 },
    features:   { pct: 42, dollars: 12_600_000 },
    innovation: { pct: 20, dollars:  6_000_000 }
  },
  totalCapital: 30_000_000,
  variance: 'Currently 8 pts over-indexed on Infra, 8 pts under-indexed on Features. Acceptable variance during platform rebuild — will normalise as Lakehouse + AI Governance complete.'
};

// ============================================================================
// STRATEGIC FACTORS — when NPV alone is insufficient
// ============================================================================
export const STRATEGIC_FACTORS = [
  {
    name: 'Strategic alignment',
    when: 'A project that aligns to a stated company priority (e.g., V25-Agentforce) gets weight even when financial modelling is uncertain.',
    example: 'Internal Agentforce rollout — if CEO has declared AI as the bet, NPV alone can\'t kill it. Apply judgment + executive air cover.',
    icon: '🎯'
  },
  {
    name: 'Compliance / Regulatory',
    when: 'When non-compliance creates fines, sanctions, or legal exposure. Often near-zero direct NPV but mandatory.',
    example: 'AI Governance Framework gates Agentforce launch — driven by EU AI Act, not customer demand. Must-do regardless of NPV.',
    icon: '⚖️'
  },
  {
    name: 'Strategic customer / churn risk',
    when: 'When a single customer relationship justifies an investment that wouldn\'t make sense in a normal NPV model.',
    example: 'A $6B / year customer requests a feature → you build it. The NPV shouldn\'t be calculated against the feature alone, but against the at-risk revenue.',
    icon: '💼'
  },
  {
    name: 'Reputation / Brand',
    when: 'When the project protects or enhances analyst rankings (Gartner, Forrester) or public trust posture.',
    example: 'Trust Center 2.0 — the dollar value of NOT having a security incident is hard to model, but real. Forrester rankings move millions.',
    icon: '🏆'
  },
  {
    name: 'Test-and-learn (rapidly changing markets)',
    when: 'When a 6-month NPV exercise would obsolete itself before it finished. Apply lean prototyping, AB testing, minimum capital deployment.',
    example: 'Agentic commerce — by the time you build the NPV, the market has moved. Prototype fast, deploy small, iterate. Financial equivalent of agile vs waterfall.',
    icon: '🧪'
  }
];

// ============================================================================
// VALUE AT RISK
// ============================================================================
export const VALUE_AT_RISK = {
  totalPortfolioValue: 600_000_000,  // top-line plan over 12 months
  atRisk: 50_000_000,
  pctAtRisk: 8.3,
  breakdown: [
    { initiative: 'INI-110 CPQ Modernization',   exposure: 18_000_000, reason: 'Off-track · Risk Register expired · scope contention' },
    { initiative: 'INI-115 AI Governance',       exposure: 14_000_000, reason: 'At-risk · gates Agentforce launch · 43 days overdue PRD' },
    { initiative: 'INI-102 Workday HRIS',        exposure: 10_000_000, reason: 'Off-track · 85% spent / 50% built' },
    { initiative: 'INI-112 ServiceNow',          exposure:  5_000_000, reason: 'At-risk · capacity plan missing' },
    { initiative: 'INI-104 Anaplan Migration',   exposure:  3_000_000, reason: 'At-risk · PRD review pending' }
  ]
};
