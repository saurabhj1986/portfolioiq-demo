import React, { useState } from 'react';
import { TrendingUp, Layers, Target, AlertTriangle, Calculator, Compass, Info } from 'lucide-react';
import {
  COMPARISON_PROJECTS, PORTFOLIO_ALLOCATION, STRATEGIC_FACTORS, VALUE_AT_RISK,
  npv, bangForBuck, paybackMonths, DISCOUNT_RATE
} from '../data/investmentFramework.js';
import { fmtMoney } from '../data/portfolioData.js';

// =================== HEADER ===================
function Header() {
  return (
    <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-sflight" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">Investment framework</span>
          </div>
          <h2 className="text-lg font-serif font-bold leading-tight">How an Infra project gets compared to a Customer Feature</h2>
          <p className="text-sm text-white/80 mt-2 leading-relaxed max-w-3xl">
            Every initiative gets normalised through a <strong className="text-sflight">5-year NPV model</strong> (upfront capital + projected cash flows from cost reduction or revenue uplift). Then ranked by <strong className="text-sflight">Bang-for-Buck</strong> (NPV ÷ investment). A <strong className="text-sflight">top-down asset-allocation</strong> overlay (30% Infra · 50% Features · 20% Innovation) makes sure the portfolio doesn't drift.
          </p>
        </div>
      </div>
    </div>
  );
}

// =================== NPV PROJECT CARD ===================
function ProjectNPVCard({ p }) {
  const v = npv(p.upfrontCapital, p.cashFlows);
  const b4b = bangForBuck(p.upfrontCapital, p.cashFlows);
  const payback = paybackMonths(p.upfrontCapital, p.cashFlows);
  const riskAdjNPV = v * p.confidence;

  const tone = p.category === 'infra' ? 'sflight' : p.category === 'feature' ? 'sgreen' : 'syellow';

  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className={`text-[10px] uppercase tracking-widest text-${tone} font-bold`}>{p.categoryLabel}</div>
          <h3 className="text-base font-serif font-bold text-white mt-0.5">{p.name}</h3>
        </div>
      </div>
      <p className="text-xs text-white/70 leading-relaxed">{p.description}</p>

      {/* Cash flow timeline */}
      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold mb-2">5-year cash flow model</div>
        <div className="flex items-end gap-1 h-24">
          <div className="flex flex-col items-center" style={{ flex: 1 }}>
            <div className="text-[10px] font-mono text-red-300">−{fmtMoney(p.upfrontCapital)}</div>
            <div className="w-full bg-red-500/40 mt-1" style={{ height: '60%' }} />
            <div className="text-[10px] text-sfmuted mt-1">Y0</div>
          </div>
          {p.cashFlows.map((cf, i) => {
            const max = Math.max(p.upfrontCapital, ...p.cashFlows);
            const h = Math.abs(cf) / max * 60;
            const isNeg = cf < 0;
            return (
              <div key={i} className="flex flex-col items-center" style={{ flex: 1 }}>
                <div className={`text-[10px] font-mono ${isNeg ? 'text-red-300' : 'text-emerald-300'}`}>
                  {isNeg ? '−' : '+'}{fmtMoney(Math.abs(cf))}
                </div>
                <div className={`w-full mt-1 ${isNeg ? 'bg-red-500/40' : 'bg-emerald-500/40'}`} style={{ height: `${h}%` }} />
                <div className="text-[10px] text-sfmuted mt-1">Y{i + 1}</div>
              </div>
            );
          })}
        </div>
        <div className="text-[11px] text-sfmuted mt-2 italic">{p.cashFlowSource}</div>
      </div>

      {/* Outputs */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded p-2">
          <div className="text-[10px] uppercase tracking-wider text-sfmuted">NPV @ {DISCOUNT_RATE * 100}%</div>
          <div className={`text-lg font-serif font-bold ${v > 0 ? 'text-sgreen' : 'text-sred'}`}>{fmtMoney(v)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-[10px] uppercase tracking-wider text-sfmuted">Bang-for-Buck</div>
          <div className={`text-lg font-serif font-bold text-${tone}`}>{b4b.toFixed(2)}×</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-[10px] uppercase tracking-wider text-sfmuted">Payback</div>
          <div className="text-lg font-serif font-bold text-white">{payback ? `${payback} mo` : '—'}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-[10px] uppercase tracking-wider text-sfmuted">Risk-adj NPV ({Math.round(p.confidence * 100)}% conf)</div>
          <div className={`text-lg font-serif font-bold ${riskAdjNPV > 0 ? 'text-sgreen' : 'text-sred'}`}>{fmtMoney(riskAdjNPV)}</div>
        </div>
      </div>

      {/* Strategic factors */}
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold mb-1">Strategic factors</div>
        <ul className="space-y-1">
          {p.strategicFactors.map((f, i) => (
            <li key={i} className="text-[11px] text-white/85 flex gap-1.5">
              <span className={`text-${tone}`}>•</span><span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Why */}
      <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-white/85 italic leading-relaxed">
        {p.why}
      </div>
    </div>
  );
}

// =================== TOP-DOWN ALLOCATION ===================
function PortfolioAllocation() {
  const cats = ['infra', 'features', 'innovation'];
  const colors = { infra: 'sflight', features: 'sgreen', innovation: 'syellow' };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-sflight" />
        <h3 className="text-base font-serif font-bold text-sfnavy">Top-down portfolio allocation</h3>
      </div>
      <p className="text-xs text-sfmuted mb-4 leading-relaxed">
        Like a wealth-portfolio asset allocation: <strong>30% stocks / 20% bonds / 10% cash</strong> becomes <strong>30% Infra / 50% Features / 20% Innovation</strong>. Bottoms-up NPV per project still applies — but the top-down envelope prevents the portfolio from drifting toward whatever the loudest sponsor wants this quarter.
      </p>

      {/* Stacked bars: target vs current */}
      <div className="space-y-4">
        <AllocationBar label="Target allocation"  data={PORTFOLIO_ALLOCATION.target}  cats={cats} colors={colors} showDesc />
        <AllocationBar label="Current allocation" data={PORTFOLIO_ALLOCATION.current} cats={cats} colors={colors} showDollars total={PORTFOLIO_ALLOCATION.totalCapital} />
      </div>

      {/* Variance note */}
      <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded p-3 text-xs text-white/90 leading-relaxed">
        <strong className="text-amber-300">Variance:</strong> {PORTFOLIO_ALLOCATION.variance}
      </div>

      {/* Category descriptors */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        {cats.map(c => (
          <div key={c} className={`rounded p-3 border bg-${colors[c]}/10 border-${colors[c]}/30`}>
            <div className={`text-[10px] uppercase tracking-widest text-${colors[c]} font-bold`}>{PORTFOLIO_ALLOCATION.target[c].label}</div>
            <div className="text-2xl font-serif font-bold text-white mt-0.5">{PORTFOLIO_ALLOCATION.target[c].pct}%</div>
            <p className="text-[11px] text-white/75 mt-1 leading-snug">{PORTFOLIO_ALLOCATION.target[c].desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllocationBar({ label, data, cats, colors, showDesc, showDollars, total }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-sfmuted font-bold">{label}</span>
        {showDollars && <span className="text-[10px] text-sfmuted font-mono">total {fmtMoney(total)}</span>}
      </div>
      <div className="flex h-9 rounded overflow-hidden border border-white/15">
        {cats.map(c => {
          const slice = data[c];
          const pct = slice.pct;
          return (
            <div
              key={c}
              className={`flex items-center justify-center text-xs font-bold text-white bg-${colors[c]}/40`}
              style={{ width: `${pct}%`, borderRight: '1px solid rgba(255,255,255,0.1)' }}
              title={`${slice.label || c}: ${pct}%`}
            >
              {pct}%
              {showDollars && <span className="text-[10px] font-normal opacity-75 ml-1">· {fmtMoney(slice.dollars)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =================== STRATEGIC FACTORS ===================
function StrategicFactorsPanel() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-sflight" />
        <h3 className="text-base font-serif font-bold text-sfnavy">When NPV alone isn't enough</h3>
      </div>
      <p className="text-xs text-sfmuted mb-4 leading-relaxed">
        NPV is the floor of investment discipline — not the ceiling. These five factors override or complement the financial model.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STRATEGIC_FACTORS.map((f, i) => (
          <div key={i} className="rounded-lg bg-white/5 border border-white/15 p-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-base">{f.icon}</span>
              <h4 className="text-sm font-serif font-bold text-white">{f.name}</h4>
            </div>
            <div className="text-[11px] text-white/85 leading-relaxed mb-2">
              <strong className="text-sflight">When:</strong> {f.when}
            </div>
            <div className="text-[11px] text-sfmuted leading-relaxed italic">
              {f.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== VALUE AT RISK ===================
function ValueAtRiskPanel() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-sred" />
        <h3 className="text-base font-serif font-bold text-sfnavy">Value at Risk · what the portfolio is exposing this year</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-white/5 border border-white/15 p-3">
          <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold">Top-line plan (12 mo)</div>
          <div className="text-2xl font-serif font-bold text-white">{fmtMoney(VALUE_AT_RISK.totalPortfolioValue)}</div>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
          <div className="text-[10px] uppercase tracking-wider text-red-300 font-bold">Currently at risk</div>
          <div className="text-2xl font-serif font-bold text-red-300">{fmtMoney(VALUE_AT_RISK.atRisk)}</div>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/15 p-3">
          <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold">% of portfolio</div>
          <div className="text-2xl font-serif font-bold text-amber-300">{VALUE_AT_RISK.pctAtRisk}%</div>
        </div>
      </div>
      <div className="rounded-lg bg-white/5 border border-white/15 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 text-[10px] uppercase tracking-wider text-sfmuted font-bold">VaR breakdown · 5 initiatives</div>
        <table className="w-full text-sm">
          <tbody>
            {VALUE_AT_RISK.breakdown.map((b, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2 text-white">{b.initiative}</td>
                <td className="px-3 py-2 text-right font-mono text-red-300">{fmtMoney(b.exposure)}</td>
                <td className="px-3 py-2 text-xs text-sfmuted">{b.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =================== MAIN ===================
export default function InvestmentFramework() {
  return (
    <div className="space-y-4">
      <Header />

      {/* PROJECT COMPARISON: Infra vs Feature vs Innovation */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-sflight" />
          <h3 className="text-base font-serif font-bold text-sfnavy">Project comparison · how do you compare an Infra ask to a Feature ask?</h3>
        </div>
        <p className="text-xs text-sfmuted mb-4 leading-relaxed">
          <strong className="text-sfnavy">The standardised answer:</strong> model both the same way. Even infra gets cash flows — they're just cost-savings cash flows (engineer time, compute spend) instead of revenue cash flows. Discount at WACC ({DISCOUNT_RATE * 100}%), risk-adjust by confidence, then rank by Bang-for-Buck.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {COMPARISON_PROJECTS.map(p => <ProjectNPVCard key={p.id} p={p} />)}
        </div>
        <div className="mt-4 bg-sflight/10 border border-sflight/30 rounded p-3 text-xs text-white/90 leading-relaxed">
          <strong className="text-sflight">Read the verdict:</strong> Infra has the highest <em>Bang-for-Buck</em> (per dollar invested) and lowest risk. Feature has higher absolute NPV but lower confidence — risk-adjusted, the gap closes. Innovation has the most upside but financial modelling is least reliable — apply test-and-learn instead of waterfall NPV. <strong>The PMO doesn't pick the winner — the framework lets the sponsor compare apples-to-apples.</strong>
        </div>
      </div>

      {/* TOP-DOWN ALLOCATION */}
      <PortfolioAllocation />

      {/* STRATEGIC FACTORS */}
      <StrategicFactorsPanel />

      {/* VALUE AT RISK */}
      <ValueAtRiskPanel />

      {/* OPERATING NOTE */}
      <div className="card bg-sfbg border-2 border-sflight/20">
        <h4 className="text-sm font-semibold text-sfnavy mb-2">How this fits the Sr Manager role</h4>
        <p className="text-xs text-sfnavy leading-relaxed max-w-4xl">
          This is the <strong>standardisation of decision-making</strong> the role exists to do. The PMO doesn't pick which projects win — it makes sure every project is <em>evaluated against the same framework</em>, so capital can be deployed against the company's top priorities and maximum return. The Sr Manager provides the spreadsheet (or the automated version of it), forces every PM to fill in upfront capital + cash-flow assumptions, then debates the assumptions. The Director makes the call. The framework makes the call defensible.
        </p>
      </div>
    </div>
  );
}
