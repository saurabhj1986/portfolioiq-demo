import React from 'react';

// =================== DESIGN DECISIONS ===================
const DECISIONS = [
  { d: 'Framing',                chose: 'Treat portfolio governance as a data-architecture problem with an adoption layer on top', why: 'The standards / frameworks / playbooks asks read as a schema problem first, a process problem second. The demo leads with the data model for that reason.' },
  { d: 'Schema scope',           chose: '4 normalized tables + 1 audit log',                                                       why: 'Covers ~80% of the portfolio questions execs actually ask. Resist over-modelling — benefits_realization and stage_history can be added in v2 once teams adopt v1.' },
  { d: 'Stage-gates',            chose: 'G0 Concept → G5 Sustain (6 gates)',                                                       why: 'Aligns with how most engineering orgs already think about lifecycle. Same gate definition across every Pillar — discipline, not opinion.' },
  { d: 'Taxonomy unit',          chose: 'Initiative (not project, not epic)',                                                      why: 'A project is execution-scoped. An initiative ties to a strategic OKR and an executive sponsor. Sr Manager roles are funded to manage the initiative layer.' },
  { d: 'AI boundary',            chose: 'AI surfaces evidence; humans decide',                                                     why: 'Capital allocation needs an audit trail. The agent gives confidence scores and transparent reasoning; the human makes the call. AI as force multiplier, not substitute.' },
  { d: 'Reasoning transparency', chose: 'classify → resolve → reason → confidence on every agent answer',                          why: 'Opaque AI is unauditable. Transparent reasoning is what makes the agent trustworthy in a portfolio context.' },
  { d: 'KPI definitions',        chose: 'Tooltipped on every metric — WHAT, TARGET, SOURCE',                                       why: 'Eliminates the "every report defines metrics differently" problem. Aligns multi-VP audiences without an alignment meeting.' },
  { d: 'Recommendation framing', chose: 'Every output is a draft for sponsor review, never a final decision',                      why: 'Sharp boundary between operations (Sr Manager) and strategy (Director). The tool reflects that boundary in the language of every screen.' },
  { d: 'Mock data',              chose: 'Production-quality schema, fictional data',                                               why: 'Enables open exploration without compromising any real organisation\'s portfolio. Lifts to production with one connector per source system.' }
];

// =================== ARCHITECTURE LAYERS ===================
const LAYERS = [
  { name: 'Experience',     items: 'Dashboard · Journey · Decisions · Operate · Source of Truth · Copilot',                                  note: 'React 18 · Vite · Tailwind. No backend in v1 — pure UI on mock data.' },
  { name: 'Logic',          items: 'RICE · Capital Optimizer · Risk Heatmap · Stage-Gate Scorer · Value/TCO · Influence Factors · Process Health · Scenario Compare · KPI Studio', note: 'Pure JS calculation engines. Deterministic, testable, single-responsibility.' },
  { name: 'Data',           items: 'initiative_inventory · stage_gate_artifacts · dependencies · capacity_snapshots · portfolio_audit_trail', note: 'Snowflake-flavoured DDL. Append-only audit. Foreign keys enforce integrity.' },
  { name: 'Source systems', items: 'Anaplan · ServiceNow · Workday · Snowflake · Quip · Slack · Calendar · Identity provider',                note: 'Each source feeds one or more data-layer tables via a thin connector.' }
];

// =================== INTEGRATION POINTS ===================
const INTEGRATIONS = [
  { source: 'Anaplan',                feeds: 'capacity_snapshots · initiative_inventory.budget_*',  type: 'API pull',       refresh: 'Daily',     notes: 'Capital plans, budget actuals, FTE capacity' },
  { source: 'ServiceNow',             feeds: 'stage_gate_artifacts (risk register, capacity plan)', type: 'Webhooks',       refresh: 'Real-time', notes: 'Incident → risk; CR → artifact' },
  { source: 'Workday HRIS',           feeds: 'capacity_snapshots.fte_capacity · pillar.lead',       type: 'API pull',       refresh: 'Weekly',    notes: 'Headcount, org structure, leave calendar' },
  { source: 'Snowflake / Data Cloud', feeds: 'aggregated KPIs (Process Health, Compliance trend)',  type: 'SQL views',      refresh: 'Hourly',    notes: 'Materialized views via a semantic layer' },
  { source: 'Quip / Confluence',      feeds: 'stage_gate_artifacts (PRD, Architecture Review)',     type: 'URL + metadata', refresh: 'On-update', notes: 'Webhook on doc change; extract status + approver' },
  { source: 'Slack',                  feeds: 'Workbench distribution · Team Cockpit signals',       type: 'Slack API',      refresh: 'Real-time', notes: 'Send drafted messages; detect stalled threads' },
  { source: 'Calendar',               feeds: 'Team Cockpit.last1on1 · stale-1:1 signal',           type: 'Calendar API',   refresh: 'Hourly',    notes: 'Detect overdue 1:1s, portfolio reviews' },
  { source: 'Identity provider',      feeds: 'auth + role-based access',                            type: 'SAML / OIDC',    refresh: 'At login',  notes: 'Sponsor-only views, audit-trail attribution' }
];

// =================== POCs ===================
const POCS = [
  { n: 1, title: 'Read-only Source of Truth',     duration: '4 weeks',  scope: 'All pillars',          goal: 'Connect data layer to existing source systems; stand up Dashboard with real KPIs alongside the mock view.', measure: 'KPI freshness vs source · query latency p90 · daily-active-user count', success: 'KPIs refresh within target cadence; user count grows 3 weeks consecutively.' },
  { n: 2, title: 'Stage-gate enforcement',         duration: '6 weeks',  scope: '1 volunteer pillar',   goal: 'Pilot the Stage-Gate Scorer with budget release gated on artifact compliance.',                            measure: 'Median cycle time per gate (before / after) · % artifacts approved at entry · Pillar PM NPS', success: '≥10% reduction in cycle time, no drop in PM NPS, sponsor signs off on rollout to next 2 pillars.' },
  { n: 3, title: 'Recommendation Engine dry-run',  duration: '1 quarter', scope: 'All (read-only)',      goal: 'Generate engine recommendations every 2 weeks; compare against actual sponsor decisions.',                  measure: '% agreement between engine and sponsor · time-to-decision delta',                              success: '≥60% agreement on tier; engine surfaces ≥2 issues exec hadn\'t seen.' },
  { n: 4, title: 'Copilot grounded in real data',  duration: '4 weeks',  scope: 'Sr Mgr team only',     goal: 'Replace mock response map with RAG over the production schema; restrict to retrieval-only.',                measure: 'Answer accuracy (audited sample) · hallucination rate · time saved per query',                  success: '≥90% accuracy on factual queries; <2% hallucination; user count grows week-on-week.' },
  { n: 5, title: 'Workbench AI auto-draft',         duration: '3 months', scope: 'Sr Mgr + 4 reports',   goal: 'Wire auto-draft to pull live KPIs; pilot on Monthly Exec Update + Pillar PM Weekly Digest.',                  measure: 'Drafting time (median) · edit volume (% words changed) · exec read rate',                       success: '≥40% drafting time reduction, ≤30% edit volume, exec read rate ≥90%.' }
];

// =================== RISKS ===================
const RISKS = [
  { risk: 'Source data quality is worse than assumed',                lvl: 'High',   imp: 'High',   mitigation: 'Start with read-only POC; build data-quality monitors as KPIs; surface gaps before they become reporting bugs.' },
  { risk: 'Pillar PMs reject new process as overhead',                 lvl: 'Medium', imp: 'High',   mitigation: 'Co-create with one volunteer pillar first; instrument time savings; let early adopters become champions.' },
  { risk: 'AI hallucinations in Copilot answers',                      lvl: 'Medium', imp: 'High',   mitigation: 'Confidence scoring + transparent reasoning + retrieval-only. Hard cap: confidence ≥0.6 to display; below that, route to human.' },
  { risk: 'Adoption stalls without an executive sponsor',              lvl: 'Medium', imp: 'High',   mitigation: 'Pre-align with sponsor before v1 launch; tie launch to a recurring exec review meeting so the tool has a clear job to be done.' },
  { risk: 'Schema migration breaks downstream reports',                lvl: 'Low',    imp: 'High',   mitigation: 'Treat schema as a versioned API; semantic versioning + 90-day deprecation; backfill new columns before retiring old.' },
  { risk: 'Compliance / SOX audit reveals access or audit-trail gaps', lvl: 'Low',    imp: 'High',   mitigation: 'SOC2-aligned append-only audit trail from day 1; role-based access tied to identity provider; quarterly access review.' },
  { risk: 'Vendor lock-in on AI provider',                             lvl: 'Medium', imp: 'Medium', mitigation: 'Abstract LLM calls behind a model-agnostic interface; swap-in mock for testing; benchmark 2 alternative providers per quarter.' },
  { risk: 'Data warehouse cost overrun',                               lvl: 'Medium', imp: 'Medium', mitigation: 'Cache hot queries; auto-suspend cold tables; pre-compute Process Health aggregates; monthly cost review.' }
];

// =================== UI ===================
function H2({ kicker, children, sub }) {
  return (
    <header className="mb-5">
      {kicker && <div className="text-[10px] uppercase tracking-[0.2em] text-sfblue font-bold mb-2">{kicker}</div>}
      <h2 className="text-xl font-serif font-bold text-sfnavy leading-tight">{children}</h2>
      {sub && <p className="text-sm text-sfmuted mt-1.5 leading-relaxed max-w-2xl">{sub}</p>}
    </header>
  );
}

function RiskBadge({ children }) {
  const c = children.toLowerCase();
  const tone = c === 'high' ? 'text-sred bg-red-50 border-red-200'
            : c === 'medium' ? 'text-syellow bg-orange-50 border-orange-200'
            : 'text-sgreen bg-emerald-50 border-emerald-200';
  return <span className={`inline-block text-[11px] font-medium border rounded px-2 py-0.5 ${tone}`}>{children}</span>;
}

// =================== MAIN ===================
export default function HowIBuilt() {
  return (
    <div className="space-y-10 max-w-[1100px]">

      {/* HERO — clean, no gradient, no icon */}
      <header>
        <div className="text-[10px] uppercase tracking-[0.2em] text-sfblue font-bold">About</div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-sfnavy leading-[1.05] tracking-tight mt-2">How I built this.</h1>
        <p className="text-base text-sfmuted mt-4 leading-relaxed max-w-2xl">
          Design philosophy, system architecture, integration points, and the path from this demo to a production system — including the risks to manage along the way.
        </p>
      </header>

      <hr className="border-slate-200" />

      {/* DESIGN DECISIONS */}
      <section>
        <H2 kicker="01 · Approach" sub="Nine trade-offs that shape the product. Each is defensible — not a default.">
          Design decisions
        </H2>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sfbg">
              <tr className="text-left text-[11px] uppercase tracking-wider text-sfmuted">
                <th className="py-3 px-4 font-semibold w-44">Decision</th>
                <th className="py-3 px-4 font-semibold">What I chose</th>
                <th className="py-3 px-4 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d, i) => (
                <tr key={i} className={`align-top ${i < DECISIONS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <td className="py-3 px-4 font-semibold text-sfnavy">{d.d}</td>
                  <td className="py-3 px-4 text-sfnavy">{d.chose}</td>
                  <td className="py-3 px-4 text-sfmuted leading-relaxed">{d.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* SYSTEM ARCHITECTURE */}
      <section>
        <H2 kicker="02 · Structure" sub="Four layers, each with a single responsibility. Designed to lift to production with the data layer connected to real source systems.">
          System architecture
        </H2>
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden">
          {LAYERS.map((layer, i) => (
            <div key={layer.name} className="py-4 px-5 bg-white">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] uppercase tracking-wider text-sfmuted font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base font-serif font-bold text-sfnavy">{layer.name}</span>
              </div>
              <p className="text-xs text-sfdeep mt-1 ml-9 font-mono leading-relaxed">{layer.items}</p>
              <p className="text-[11px] text-sfmuted mt-1 ml-9 italic leading-relaxed">{layer.note}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* INTEGRATION POINTS */}
      <section>
        <H2 kicker="03 · Connections" sub="Production connectors needed to lift this from demo to live system. One connector per source — small surface area, big leverage.">
          Integration points
        </H2>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sfbg">
              <tr className="text-left text-[11px] uppercase tracking-wider text-sfmuted">
                <th className="py-3 px-4 font-semibold">Source system</th>
                <th className="py-3 px-4 font-semibold">Feeds</th>
                <th className="py-3 px-4 font-semibold">Connection</th>
                <th className="py-3 px-4 font-semibold">Refresh</th>
              </tr>
            </thead>
            <tbody>
              {INTEGRATIONS.map((c, i) => (
                <tr key={i} className={`align-top ${i < INTEGRATIONS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-sfnavy">{c.source}</div>
                    <div className="text-[11px] text-sfmuted mt-0.5 leading-relaxed">{c.notes}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[12px] text-sfdeep">{c.feeds}</td>
                  <td className="py-3 px-4 text-sfmuted text-xs">{c.type}</td>
                  <td className="py-3 px-4 text-sfmuted text-xs">{c.refresh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* POCs */}
      <section>
        <H2 kicker="04 · Path to production" sub="Five progressive proof-of-concepts. Each isolates one risk and produces a measurable answer before broader rollout.">
          POCs
        </H2>
        <div className="space-y-3">
          {POCS.map(p => (
            <article key={p.n} className="border border-slate-200 rounded-lg p-5 bg-white">
              <header className="flex items-baseline gap-3 flex-wrap mb-3">
                <span className="text-[11px] uppercase tracking-wider text-sfblue font-mono">POC {String(p.n).padStart(2, '0')}</span>
                <h3 className="text-base font-serif font-bold text-sfnavy">{p.title}</h3>
                <span className="text-[11px] text-sfmuted ml-auto">{p.duration} · {p.scope}</span>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sfmuted font-semibold mb-1">Goal</div>
                  <p className="text-sfnavy leading-relaxed">{p.goal}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sfmuted font-semibold mb-1">Measure</div>
                  <p className="text-sfnavy leading-relaxed">{p.measure}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-sfmuted font-semibold mb-1">Success</div>
                  <p className="text-sfnavy leading-relaxed">{p.success}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* RISKS */}
      <section>
        <H2 kicker="05 · What could go wrong" sub="The mitigations are encoded in the architecture — not afterthoughts.">
          Risks &amp; mitigations
        </H2>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sfbg">
              <tr className="text-left text-[11px] uppercase tracking-wider text-sfmuted">
                <th className="py-3 px-4 font-semibold">Risk</th>
                <th className="py-3 px-4 font-semibold w-24">Likelihood</th>
                <th className="py-3 px-4 font-semibold w-24">Impact</th>
                <th className="py-3 px-4 font-semibold">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {RISKS.map((r, i) => (
                <tr key={i} className={`align-top ${i < RISKS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <td className="py-3 px-4 font-semibold text-sfnavy">{r.risk}</td>
                  <td className="py-3 px-4"><RiskBadge>{r.lvl}</RiskBadge></td>
                  <td className="py-3 px-4"><RiskBadge>{r.imp}</RiskBadge></td>
                  <td className="py-3 px-4 text-sfmuted leading-relaxed">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* TECH STACK */}
      <section>
        <H2 kicker="06 · Implementation">Tech stack</H2>
        <dl className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold">Frontend</dt>
            <dd className="text-sfnavy mt-1">React 18 · Vite · Tailwind 3 · Lucide</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold">State</dt>
            <dd className="text-sfnavy mt-1">React useState (no global store yet)</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold">Data</dt>
            <dd className="text-sfnavy mt-1">Mock JSON · target: Snowflake</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold">Deploy</dt>
            <dd className="text-sfnavy mt-1">Vercel · auto-deploy on git push</dd>
          </div>
        </dl>
      </section>

    </div>
  );
}
