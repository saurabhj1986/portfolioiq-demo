import React, { useState } from 'react';
import {
  Lightbulb, Layers, Plug, FlaskConical, AlertOctagon, ChevronDown,
  Database, Cog, Eye, ArrowDown, CheckCircle2, Code2
} from 'lucide-react';

// =================== DESIGN DECISIONS ===================
const DECISIONS = [
  {
    d: 'Framing',
    chose: 'Treat portfolio governance as a data-architecture problem with an adoption layer on top',
    why: 'The standards / frameworks / playbooks asks read as a schema problem first, a process problem second. The demo leads with the data model for that reason.'
  },
  {
    d: 'Schema scope',
    chose: '4 normalized tables + 1 audit log',
    why: 'Covers ~80% of the portfolio questions execs actually ask. Resist over-modelling — benefits_realization and stage_history can be added in v2 once teams adopt v1.'
  },
  {
    d: 'Stage-gates',
    chose: 'G0 Concept → G5 Sustain (6 gates)',
    why: 'Aligns with how most engineering orgs already think about lifecycle. Same gate definition across every Pillar — discipline, not opinion.'
  },
  {
    d: 'Taxonomy unit',
    chose: 'Initiative (not project, not epic)',
    why: 'A project is execution-scoped. An initiative ties to a strategic OKR and an executive sponsor. Sr Manager roles are funded to manage the initiative layer.'
  },
  {
    d: 'AI boundary',
    chose: 'AI surfaces evidence; humans decide',
    why: 'Capital allocation decisions need an audit trail. The agent gives confidence scores and transparent reasoning; the human makes the call. AI is a force multiplier on top of governed data — not a substitute for governance.'
  },
  {
    d: 'Reasoning transparency',
    chose: 'classify → resolve → reason → confidence on every agent answer',
    why: 'Opaque AI is unauditable. Transparent reasoning is what makes the agent trustworthy in a portfolio context.'
  },
  {
    d: 'KPI definitions',
    chose: 'Tooltipped on every metric — WHAT, TARGET, SOURCE',
    why: 'Eliminates the "every report defines metrics differently" problem. Aligns multi-VP audiences without an alignment meeting.'
  },
  {
    d: 'Recommendation framing',
    chose: 'Every output is a draft for sponsor review, never a final decision',
    why: 'Sharp boundary between operations (Sr Manager) and strategy (Director). The tool reflects that boundary in the language of every screen.'
  },
  {
    d: 'Mock data',
    chose: 'Production-quality schema, fictional data',
    why: 'Enables open exploration without compromising any real organisation\'s portfolio. Lifts to production with one connector per source system.'
  }
];

// =================== ARCHITECTURE LAYERS ===================
const LAYERS = [
  {
    name: 'Experience layer',
    icon: Eye,
    color: 'sflight',
    items: 'Dashboard · Journey · Decisions · Operate (Playbooks / Team / Workbench) · Source of Truth · Copilot',
    note: 'React 18 + Vite + Tailwind + Lucide. No backend in v1 — pure UI on mock data.'
  },
  {
    name: 'Logic layer',
    icon: Cog,
    color: 'sfblue',
    items: 'RICE · Capital Optimizer · Risk Heatmap · Stage-Gate Scorer · Value/TCO · Influence Factors · Process Health · Scenario Compare · KPI Studio',
    note: 'Pure JS calculation engines. Deterministic, testable. Each engine is a small file with a single responsibility.'
  },
  {
    name: 'Data layer (Source of Truth)',
    icon: Database,
    color: 'sfdeep',
    items: 'initiative_inventory · stage_gate_artifacts · dependencies · capacity_snapshots · portfolio_audit_trail',
    note: 'Snowflake-flavoured DDL designed for production. Append-only audit. Foreign keys enforce referential integrity.'
  },
  {
    name: 'Source systems (production target)',
    icon: Plug,
    color: 'sgreen',
    items: 'Anaplan · ServiceNow · Workday · Snowflake / Data Cloud · Quip / Confluence · Slack · Calendar · Identity provider',
    note: 'Each source feeds one or more tables in the Data layer via a thin connector.'
  }
];

// =================== INTEGRATION POINTS ===================
const INTEGRATIONS = [
  { source: 'Anaplan',                  feeds: 'capacity_snapshots · initiative_inventory.budget_*',  type: 'API pull',         refresh: 'Daily',     notes: 'Capital plans, budget actuals, FTE capacity' },
  { source: 'ServiceNow',               feeds: 'stage_gate_artifacts (risk register, capacity plan)', type: 'Webhooks',         refresh: 'Real-time', notes: 'Incident → risk; CR → artifact' },
  { source: 'Workday HRIS',             feeds: 'capacity_snapshots.fte_capacity · pillar.lead',       type: 'API pull',         refresh: 'Weekly',    notes: 'Headcount, org structure, leave calendar' },
  { source: 'Snowflake / Data Cloud',   feeds: 'aggregated KPIs (Process Health, Compliance trend)',  type: 'SQL views',        refresh: 'Hourly',    notes: 'Materialized views; query through a semantic layer' },
  { source: 'Quip / Confluence',         feeds: 'stage_gate_artifacts (PRD, Architecture Review)',     type: 'URL + metadata',   refresh: 'On-update', notes: 'Webhook on doc change; extract status + approver' },
  { source: 'Slack',                    feeds: 'Workbench distribution · Team Cockpit signals',       type: 'Slack API',        refresh: 'Real-time', notes: 'Send drafted messages; detect stalled threads' },
  { source: 'Calendar (Outlook/Gcal)',   feeds: 'Team Cockpit.last1on1 · stale-1:1 signal',           type: 'Calendar API',     refresh: 'Hourly',    notes: 'Detect overdue 1:1s, portfolio reviews' },
  { source: 'Identity provider (Okta)',  feeds: 'auth + role-based access',                            type: 'SAML / OIDC',      refresh: 'At login',  notes: 'Sponsor-only views, audit-trail attribution' }
];

// =================== POCs ===================
const POCS = [
  {
    n: 1,
    title: 'Read-only Source of Truth',
    duration: '4 weeks',
    pillars: 'All',
    goal: 'Connect data layer to existing source systems; stand up Dashboard with real KPIs alongside the mock view.',
    measure: 'KPI freshness vs source · query latency p90 · daily-active-user count',
    success: 'KPIs refresh within target cadence; user count grows 3 weeks consecutively'
  },
  {
    n: 2,
    title: 'Stage-gate enforcement',
    duration: '6 weeks',
    pillars: '1 volunteer pillar',
    goal: 'Pilot the Stage-Gate Scorer with budget release gated on artifact compliance.',
    measure: 'Median cycle time per gate (before/after) · % artifacts approved at gate entry · Pillar PM NPS',
    success: '≥10% reduction in cycle time, no drop in PM NPS, sponsor signs off on rollout to next 2 pillars'
  },
  {
    n: 3,
    title: 'Recommendation Engine dry-run',
    duration: '1 quarter',
    pillars: 'All (read-only)',
    goal: 'Generate engine recommendations every 2 weeks; compare against actual sponsor decisions.',
    measure: '% agreement between engine and sponsor · time-to-decision delta',
    success: '≥60% agreement on tier; engine flags surfaced ≥2 issues exec hadn\'t seen'
  },
  {
    n: 4,
    title: 'Copilot grounded in real data',
    duration: '4 weeks',
    pillars: 'Sr Manager team only',
    goal: 'Replace mock response map with RAG over the production schema; restrict to retrieval-only.',
    measure: 'Answer accuracy (audited sample) · hallucination rate · time saved per query',
    success: '≥90% accuracy on factual queries; <2% hallucination; user count grows week-on-week'
  },
  {
    n: 5,
    title: 'Workbench AI auto-draft',
    duration: '3 months',
    pillars: 'Sr Mgr + 4 reports',
    goal: 'Wire auto-draft to pull live KPIs; pilot on Monthly Exec Update + Pillar PM Weekly Digest.',
    measure: 'Drafting time (median) · edit volume (% of words changed) · exec read rate',
    success: '≥40% drafting time reduction, ≤30% edit volume, exec read rate ≥90%'
  }
];

// =================== RISKS ===================
const RISKS = [
  { risk: 'Source data quality is worse than assumed',                     likelihood: 'High',   impact: 'High',   mitigation: 'Start with read-only POC; build data-quality monitors as KPIs; surface gaps before they become reporting bugs.' },
  { risk: 'Pillar PMs reject new process as overhead',                       likelihood: 'Medium', impact: 'High',   mitigation: 'Co-create with one volunteer pillar first; instrument time savings; let early adopters become internal champions before broad rollout.' },
  { risk: 'AI hallucinations in Copilot answers',                            likelihood: 'Medium', impact: 'High',   mitigation: 'Confidence scoring + transparent reasoning + retrieval-only constraint (no free generation). Hard cap on confidence ≥0.6 to display answer; below that, route to human.' },
  { risk: 'Adoption stalls without an executive sponsor',                    likelihood: 'Medium', impact: 'High',   mitigation: 'Pre-align with sponsor before v1 launch; tie v1 launch to a specific recurring exec review meeting so the tool has a clear "job to be done."' },
  { risk: 'Schema migration breaks downstream reports',                      likelihood: 'Low',    impact: 'High',   mitigation: 'Treat the schema as a versioned API; semantic versioning + 90-day deprecation cycle; backfill new columns before retiring old ones.' },
  { risk: 'Compliance / SOX audit reveals access or audit-trail gaps',        likelihood: 'Low',    impact: 'High',   mitigation: 'SOC2-aligned append-only audit trail from day 1; role-based access tied to identity provider; quarterly access review.' },
  { risk: 'Vendor lock-in on AI provider',                                   likelihood: 'Medium', impact: 'Medium', mitigation: 'Abstract LLM calls behind a model-agnostic interface; swap-in mock for testing; benchmark 2 alternative providers per quarter.' },
  { risk: 'Data warehouse cost overrun (especially with AI grounding)',       likelihood: 'Medium', impact: 'Medium', mitigation: 'Cache hot queries; auto-suspend cold tables; pre-compute Process Health aggregates; monthly cost review tied to value-delivered KPIs.' }
];

// =================== UI COMPONENTS ===================
function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="card">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center flex-shrink-0">
          <Icon className="w-5 h-5 text-sfblue" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-semibold text-sfnavy">{title}</h2>
          {subtitle && <p className="text-xs text-sfmuted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function LayerBlock({ layer, isLast }) {
  const Icon = layer.icon;
  return (
    <div className="relative">
      <div className={`bg-${layer.color}/5 border-2 border-${layer.color}/30 rounded-lg p-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg bg-${layer.color}/15 grid place-items-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 text-${layer.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-serif font-bold text-${layer.color}`}>{layer.name}</h4>
            <p className="text-xs text-sfnavy mt-1 font-mono leading-relaxed">{layer.items}</p>
            <p className="text-[11px] text-sfmuted mt-1.5 italic">{layer.note}</p>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="flex justify-center my-1.5">
          <ArrowDown className="w-4 h-4 text-sfmuted" />
        </div>
      )}
    </div>
  );
}

function Pill({ tone, children }) {
  const map = {
    high:   'bg-red-100 text-sred border-red-300',
    medium: 'bg-orange-100 text-syellow border-orange-300',
    low:    'bg-emerald-100 text-sgreen border-emerald-300'
  };
  return <span className={`pill ${map[children.toLowerCase()] || ''}`}>{children}</span>;
}

// =================== MAIN ===================
export default function HowIBuilt() {
  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Code2 className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-serif font-bold">How I Built This</h2>
            <p className="text-sm text-white/80 mt-2 leading-relaxed max-w-3xl">
              Design philosophy, system architecture, integration points, POCs to take it to production, and the risks to manage along the way. The dashboard shows <em>what</em> was built. This tab shows <em>how it was reasoned about</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Design Decisions */}
      <Section
        icon={Lightbulb}
        title="Design Decisions"
        subtitle="9 decisions that shape the product. Each is a defensible trade-off — not a default."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Decision</th>
                <th className="py-2 pr-3 font-semibold">What I chose</th>
                <th className="py-2 pr-3 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d, i) => (
                <tr key={i} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-3 font-medium text-sfnavy whitespace-nowrap">{d.d}</td>
                  <td className="py-3 pr-3 text-sfnavy">{d.chose}</td>
                  <td className="py-3 pr-3 text-sfmuted">{d.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* System Architecture */}
      <Section
        icon={Layers}
        title="System Architecture"
        subtitle="Four layers, each with a single responsibility. Designed to lift to production with the data layer connected to real source systems."
      >
        <div className="space-y-0">
          {LAYERS.map((layer, i) => (
            <LayerBlock key={layer.name} layer={layer} isLast={i === LAYERS.length - 1} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Build path:</strong> Data layer first → Logic layer → Experience layer.</div>
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Test path:</strong> Each engine is independently testable on mock data.</div>
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Production path:</strong> Replace mock data with source connectors; everything above is unchanged.</div>
        </div>
      </Section>

      {/* Integration Points */}
      <Section
        icon={Plug}
        title="Integration Points"
        subtitle="Production connections needed to lift this from demo to live system. One connector per source — small surface area, big leverage."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Source system</th>
                <th className="py-2 pr-3 font-semibold">Feeds (data layer)</th>
                <th className="py-2 pr-3 font-semibold">Connection</th>
                <th className="py-2 pr-3 font-semibold">Refresh</th>
                <th className="py-2 pr-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {INTEGRATIONS.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 align-top">
                  <td className="py-2 pr-3 font-semibold text-sfnavy">{c.source}</td>
                  <td className="py-2 pr-3 font-mono text-[11px] text-sfdeep">{c.feeds}</td>
                  <td className="py-2 pr-3 text-xs"><span className="bg-sfblue/10 text-sfblue rounded px-2 py-0.5">{c.type}</span></td>
                  <td className="py-2 pr-3 text-xs text-sfmuted">{c.refresh}</td>
                  <td className="py-2 pr-3 text-xs text-sfmuted">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* POCs */}
      <Section
        icon={FlaskConical}
        title="POCs to Production"
        subtitle="5 progressive proof-of-concepts. Each isolates one risk and produces a measurable answer before broader rollout."
      >
        <div className="space-y-3">
          {POCS.map(p => (
            <div key={p.n} className="bg-sfbg border border-slate-200 rounded-lg p-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-sfblue text-white grid place-items-center font-bold text-sm flex-shrink-0">{p.n}</div>
                <h4 className="font-serif font-semibold text-sfnavy">{p.title}</h4>
                <span className="text-[11px] font-mono text-sfmuted">{p.duration} · {p.pillars}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div><strong className="text-sfnavy block mb-0.5">Goal</strong><span className="text-sfmuted">{p.goal}</span></div>
                <div><strong className="text-sfnavy block mb-0.5">Measure</strong><span className="text-sfmuted font-mono text-[11px]">{p.measure}</span></div>
                <div><strong className="text-sgreen block mb-0.5">Success criteria</strong><span className="text-sfnavy">{p.success}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Risks */}
      <Section
        icon={AlertOctagon}
        title="Risks &amp; Mitigations"
        subtitle="What could go wrong on the path to production — and the mitigation already designed in."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Risk</th>
                <th className="py-2 pr-3 font-semibold">Likelihood</th>
                <th className="py-2 pr-3 font-semibold">Impact</th>
                <th className="py-2 pr-3 font-semibold">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {RISKS.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-3 font-medium text-sfnavy">{r.risk}</td>
                  <td className="py-3 pr-3"><Pill>{r.likelihood}</Pill></td>
                  <td className="py-3 pr-3"><Pill>{r.impact}</Pill></td>
                  <td className="py-3 pr-3 text-sfmuted text-xs leading-relaxed">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-sfbg border border-slate-200 rounded p-3 text-xs text-sfnavy leading-relaxed">
          <strong>Risk philosophy:</strong> the demo encodes the mitigations into the architecture. Audit trail is append-only by design. The Recommendation Engine surfaces drafts, not decisions, so AI errors degrade gracefully. Source-of-Truth-first means data quality is observable before it becomes a reporting problem.
        </div>
      </Section>

      {/* Tech stack footer */}
      <div className="card bg-sfbg border-2 border-slate-200">
        <h4 className="text-sm font-semibold text-sfnavy mb-2 flex items-center gap-2"><Code2 className="w-4 h-4 text-sfblue" />Tech stack</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div><strong className="text-sfnavy">Frontend</strong><br /><span className="text-sfmuted">React 18 · Vite · Tailwind 3 · Lucide</span></div>
          <div><strong className="text-sfnavy">State</strong><br /><span className="text-sfmuted">Pure useState (no global store yet)</span></div>
          <div><strong className="text-sfnavy">Data</strong><br /><span className="text-sfmuted">Mock JSON · production target: Snowflake</span></div>
          <div><strong className="text-sfnavy">Deploy</strong><br /><span className="text-sfmuted">Vercel · auto-deploy on git push</span></div>
        </div>
      </div>
    </div>
  );
}
