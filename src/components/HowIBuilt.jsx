import React, { useState } from 'react';
import { Lightbulb, MessageCircleQuestion, AlertCircle, Map, ArrowRightLeft, ChevronDown, Target, CheckCircle2 } from 'lucide-react';

// Every JD line, mapped to where it lives in the prototype.
// 15 JD responsibilities + qualifications, all with explicit feature attribution.
const JD_COVERAGE = [
  { line: 'Architect a unified framework for initiative data management',                          where: 'Data Model · initiative_inventory schema',                                           tab: 'Data Model' },
  { line: 'Lead the creation and adoption of foundational playbooks and assets',                   where: '7 playbooks (4 GA, 2 Pilot, 1 Draft); adoption tracked per pillar',                  tab: 'Playbooks' },
  { line: 'Establish comprehensive guardrails and stage-gate processes',                           where: 'Stage-Gate Pipeline (Dashboard) + Stage-Gate Scorer (Decision Engine)',              tab: 'Dashboard + Decision Engine' },
  { line: 'Implement oversight mechanisms and audit trails',                                       where: 'portfolio_audit_trail (Data Model) + artifact lifecycle states',                     tab: 'Data Model' },
  { line: 'Define and govern master taxonomy and metadata standards',                              where: 'PILLARS / STAGES / STATUS / OKR taxonomies in portfolioData.js',                     tab: 'Data Model' },
  { line: 'Identify friction points in current data workflows',                                    where: 'Process Health sub-tab — cycle time, rework rate, NPS, anti-patterns',               tab: 'Decision Engine' },
  { line: 'Source of Truth supporting high-fidelity reporting + automated insights',               where: 'Every component reads from initiative_inventory; PortfolioCopilot grounded in same', tab: 'Data Model + PortfolioCopilot' },
  { line: 'Drive organizational excellence through regular evaluations',                           where: 'Portfolio Review Playbook (PB-06); compliance trend in Process Health',              tab: 'Playbooks + Decision Engine' },
  { line: 'Data-driven audits to provide strategic feedback to leadership',                        where: 'Anti-Patterns section in Process Health (4 detected, with recommendations)',         tab: 'Decision Engine' },
  { line: 'Support quarterly portfolio planning, prioritization, and rebalancing',                 where: 'Quarterly Rebalance Playbook (PB-05) + Scenario Compare',                            tab: 'Playbooks + Decision Engine' },
  { line: 'Maintain a forward-looking view (dependencies, capacity constraints, market impacts)',  where: 'Pillar Performance grid + dependencies table + Influence Factors (Market Timing)',   tab: 'Dashboard + Data Model + Decision Engine' },
  { line: 'Provide executive insights to guide strategic trade-offs and capital allocation',       where: 'Capital Optimizer + Value & TCO Engine + Scenario Compare with auto-rationale',       tab: 'Decision Engine' },
  { line: 'Define and manage portfolio KPIs (value realization, time-to-market, resource util, risk)', where: '5 KPIs on Dashboard, each tooltipped with target + JD line citation',             tab: 'Dashboard' },
  { line: 'Drive adoption of enterprise tools and analytics for portfolio visibility + scenario planning', where: 'Tooltip-everywhere UX + PortfolioCopilot AI agent + Scenario Compare',     tab: 'PortfolioCopilot + Decision Engine' },
  { line: 'Build a collaborative teaming environment that champions creativity, innovation, learning', where: 'Team Cockpit AI Coaching Feed (growth opportunities, not just risks)',           tab: 'Team Cockpit' },
  { line: '[BONUS] Experience building portfolio tools with AI',                                   where: 'PortfolioCopilot agent + AI Coaching Feed + auto-drafted weekly briefs',             tab: 'PortfolioCopilot + Team Cockpit' }
];

const DECISIONS = [
  { d: 'Domain framing', chose: 'Treat portfolio governance as a data-architecture problem with an adoption layer on top', why: 'Judette\'s 60–90 day plan reads as taxonomy + standards + frameworks. That\'s a schema problem first, a process problem second. Demo leads with the data model for that reason.' },
  { d: 'Schema scope', chose: '4 tables (initiative, stage-gate artifact, dependency, capacity)', why: 'Covers the 80% of portfolio questions an exec actually asks. Resist the urge to over-model — benefits_realization and stage_history can be added in v2 once teams adopt v1.' },
  { d: 'Stage-gates', chose: 'G0 Concept → G5 Sustain', why: 'Aligns with how DET likely already thinks about lifecycle. "Test once, audit many" applies — same gate definition for every Pillar.' },
  { d: 'Master taxonomy unit', chose: 'Initiative (not project, not epic)', why: 'A project is execution-scoped. An initiative ties to a V25 OKR and a sponsor. The Sr Mgr role is funded to manage the initiative layer.' },
  { d: 'AI agent boundary', chose: 'Copilot answers questions; humans make decisions', why: 'The agent surfaces evidence and trade-offs with confidence scores. Humans decide. Same governance principle as TrustReply: AI is a force multiplier on top of governed data.' },
  { d: 'Reasoning transparency', chose: 'Show classify → resolve → reason → confidence for every agent answer', why: 'Capital allocation decisions need an audit trail. Opaque AI is unauditable. Transparent reasoning is what makes the agent trustworthy in a portfolio context.' },
  { d: 'KPI definitions', chose: 'Tooltipped on every metric — WHAT, TARGET, JD line', why: 'Eliminates the "every report defines metrics differently" problem. Aligns three-VP audiences without an alignment meeting.' },
  { d: 'Mock data realism', chose: 'Plausible Salesforce-shaped pillars, V25 OKR codes, $30M portfolio scale', why: 'Demo only matters if it feels like the real org. Numbers chosen to be realistic for a single DET sub-portfolio at Salesforce scale.' },
  { d: 'Reuse from TrustReply', chose: 'Lift the architecture pattern (registry + lifecycle + AI + reasoning) and re-skin', why: 'Demonstrates pattern transfer. The same governance discipline works whether the unit is a control or an initiative.' }
];

const QUESTIONS = [
  { q: 'What\'s the current source of truth for DET portfolio data?', why: 'Asana? Smartsheet? Anaplan? GUS? The answer determines whether v1 is a schema build or a migration. Big effort delta.' },
  { q: 'How many Pillars actually exist, and who are the Pillar Portfolio Managers?', why: 'The team works "across DET Pillars." Real names + count change the stakeholder map and the rollout sequence.' },
  { q: 'Which stage-gate artifacts are mandatory vs. recommended today, and what\'s the enforcement mechanism?', why: 'If gates are advisory, governance is theater. If gates block budget release, governance has teeth. v1 design depends on which it is.' },
  { q: 'What\'s the relationship between V2MOM and the V25 OKRs at the initiative level?', why: 'Want to design the okr_mapping field correctly. Is it a free array or a controlled vocabulary? Who owns the master list?' },
  { q: 'What does "value realization" actually mean in DET — leading indicator (adoption) or lagging (revenue/cost)?', why: 'Drives the benefits_realization table design and the Strategic Alignment KPI definition.' },
  { q: 'Who has been building portfolio reports today, and what do they hate about the current process?', why: 'The fastest path to adoption is solving the analyst\'s problem, not just the exec\'s. Want their pain points before designing v1.' },
  { q: 'When is the next quarterly portfolio review, and what 3 questions does Judette want to answer differently?', why: 'Working backwards from a real meeting forces concrete scope. v1 ships to support that meeting.' }
];

const GAPS = [
  'How DET\'s governance ladder actually works — what does the Pillar PM authority vs. Sr Mgr authority look like in practice?',
  'Whether Anaplan, Smartsheet, ServiceNow, or something else holds the official initiative list today',
  'Salesforce\'s internal data classification rules — does portfolio data sit on a specific tier with PII restrictions?',
  'How V25 OKRs are versioned — do they change mid-year, and if so, how do we re-cascade alignment?',
  'The exact Salesforce flavor of "Source of Truth" — Tableau CRM? Data Cloud? A different tool I haven\'t learned yet?',
  'Whether agentic-workforce planning (the prep guide called it out) is part of this role\'s scope or a separate workstream',
  'How Pillar capacity is actually planned — is it FTE-based, story-points, or a Salesforce-specific unit?'
];

const PLAN = [
  { phase: 'Days 0–14', focus: 'Listen + map', work: [
    'Meet every Pillar PM 1:1 — get current process, pain points, and "what would you change?" list',
    'Inventory existing tools: where data lives, who owns it, refresh cadence',
    'Read the last 4 quarterly review decks Judette has run/inherited',
    'Sit in on at least one stage-gate meeting per Pillar to observe the actual mechanics'
  ]},
  { phase: 'Days 15–30', focus: 'Draft taxonomy v0', work: [
    'Publish a strawman initiative taxonomy + stage-gate artifact list',
    'Pilot on 1 Pillar (volunteer — likely the team most under-served by current state)',
    'Stand up a lightweight "current state" dashboard pulling from existing systems (read-only, no migration yet)',
    'Identify the 3 highest-impact KPIs for v1 (likely: portfolio health, stage-gate compliance, capital utilization)'
  ]},
  { phase: 'Days 31–60', focus: 'Standardize + document', work: [
    'Lock the master taxonomy with Pillar PM consensus',
    'Publish the playbook: what each gate requires, who approves, escalation path',
    'Stand up the Source of Truth in the agreed system (build vs. configure decision made by day 30)',
    'Run a stage-gate review using the new framework as a controlled experiment — measure cycle time before/after'
  ]},
  { phase: 'Days 61–90', focus: 'Pilot + scale', work: [
    'Roll v1 to 2 more Pillars, instrument adoption (logins, artifact upload rate, KPI freshness)',
    'Show measurable improvement in data quality + reporting consistency at the next exec review',
    'Identify the top 3 questions executives ask repeatedly → automate via AI agent (this is where PortfolioCopilot would slot in)',
    'Publish the v2 roadmap for the back half of the year'
  ]}
];

const TRANSFER = [
  { trust: 'control_inventory (CC-01..CC-23)',     port: 'initiative_inventory (INI-101..INI-116)' },
  { trust: 'evidence_submissions (PRD, scan, log)', port: 'stage_gate_artifacts (PRD, capacity plan, risk register)' },
  { trust: 'CCF taxonomy (test once, audit many)',  port: 'V25 OKR mapping (one initiative, many reports)' },
  { trust: 'Evidence lifecycle (current/expired)',  port: 'Artifact lifecycle (approved/needs_review/expired/missing)' },
  { trust: 'TrustReply Agent (CCF-grounded)',       port: 'PortfolioCopilot (data-model-grounded)' },
  { trust: 'Reuse rate KPI (84%)',                  port: 'Strategic alignment KPI (91%)' },
  { trust: '"Test once, audit many"',                port: '"Capture once, report many"' }
];

function Section({ icon: Icon, title, children, subtitle }) {
  return (
    <section className="card">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center flex-shrink-0">
          <Icon className="w-5 h-5 text-sfblue" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-semibold text-sfnavy">{title}</h2>
          {subtitle && <p className="text-xs text-sfmuted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Expandable({ q, children }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left bg-sfbg border border-slate-200 rounded-lg p-3 hover:border-sfblue/40 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-sfnavy">{q}</span>
        <ChevronDown className={`w-4 h-4 text-sfmuted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && <div className="mt-2 text-xs text-sfmuted leading-relaxed">{children}</div>}
    </button>
  );
}

export default function HowIBuilt() {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <h2 className="text-xl font-serif font-bold">How I Built This</h2>
        <p className="text-sm text-white/80 mt-2 leading-relaxed max-w-3xl">
          This tab matters more than the others. The dashboard and agent show <em>what</em> I built. This tab shows <em>how I think</em> — the JD coverage matrix, the design decisions, the questions I'd ask Judette before locking v1, the honest gaps, and how the prototype maps to the 60–90 day plan in the candidate prep guide.
        </p>
      </div>

      {/* JD COVERAGE MATRIX — top of the tab, most important */}
      <Section icon={Target} title="JD Coverage Matrix" subtitle="Every line of JR337298 mapped to where it lives in this prototype. Nothing built outside scope.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold w-12">#</th>
                <th className="py-2 pr-3 font-semibold">JD line</th>
                <th className="py-2 pr-3 font-semibold">Where in the prototype</th>
                <th className="py-2 pr-3 font-semibold">Tab</th>
              </tr>
            </thead>
            <tbody>
              {JD_COVERAGE.map((j, i) => (
                <tr key={i} className="border-b border-slate-100 align-top">
                  <td className="py-2 pr-3"><CheckCircle2 className="w-4 h-4 text-sgreen" /></td>
                  <td className="py-2 pr-3 text-sfnavy">{j.line}</td>
                  <td className="py-2 pr-3 text-sfmuted">{j.where}</td>
                  <td className="py-2 pr-3"><span className="text-[11px] font-mono text-sfblue bg-sfblue/10 rounded px-1.5 py-0.5">{j.tab}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-sfbg border border-slate-200 rounded-lg p-3 text-xs text-sfnavy">
          <strong>Discipline note:</strong> Two influence factors (Sustainability, Equality &amp; Inclusion) were intentionally trimmed from v1 — they're Salesforce core values but not in this JD. Easy to add when relevant; out of scope for the role as written.
        </div>
      </Section>

      <Section icon={Lightbulb} title="Design Decisions" subtitle="Each decision tied to a JD requirement or a candidate-prep-guide signal">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Decision</th>
                <th className="py-2 pr-3 font-semibold">What I chose</th>
                <th className="py-2 pr-3 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d, i) => (
                <tr key={i} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-3 font-medium text-sfnavy">{d.d}</td>
                  <td className="py-3 pr-3">{d.chose}</td>
                  <td className="py-3 pr-3 text-sfmuted">{d.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={MessageCircleQuestion} title="Questions I'd Ask Judette Before Locking v1" subtitle="Demonstrates curiosity + humility — the two things Round 1 is screening for">
        <div className="space-y-2">
          {QUESTIONS.map((q, i) => (
            <Expandable key={i} q={`${i+1}. ${q.q}`}>{q.why}</Expandable>
          ))}
        </div>
      </Section>

      <Section icon={Map} title="60–90 Day Plan — Mapped Directly to the Candidate Prep Guide" subtitle="Prep guide milestones: 60 days = taxonomy/process/guidance documentation; 90 days = pilot frameworks, drive adoption, measurable improvements">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLAN.map((p, i) => (
            <div key={i} className="bg-sfbg border border-slate-200 rounded-lg p-3">
              <div className="text-[11px] uppercase tracking-wider text-sfblue font-semibold">{p.phase}</div>
              <div className="text-sm font-semibold text-sfnavy mt-0.5">{p.focus}</div>
              <ul className="mt-2 space-y-1.5">
                {p.work.map((w, j) => (
                  <li key={j} className="text-xs text-sfnavy leading-snug flex gap-1.5">
                    <span className="text-sfblue flex-shrink-0">→</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={AlertCircle} title="What I Don't Know Yet" subtitle="Honest gaps — these are the questions I'd close in week 1">
        <ul className="space-y-2">
          {GAPS.map((g, i) => (
            <li key={i} className="flex gap-2 text-sm text-sfnavy">
              <span className="text-syellow flex-shrink-0">•</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={ArrowRightLeft} title="Architecture Transfer — TrustReply → PortfolioIQ" subtitle="Same governance pattern, different domain. Talking point for Round 2 with Kyle (Drive Innovation, AI-enhanced portfolio tools).">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">TrustReply (Harvey AI / Compliance)</th>
                <th className="py-2 pr-3 font-semibold">PortfolioIQ (Salesforce DET / Portfolio)</th>
              </tr>
            </thead>
            <tbody>
              {TRANSFER.map((t, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-mono text-xs">{t.trust}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-sfblue">{t.port}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-sfmuted mt-3 leading-relaxed">
          The architectural pattern — central registry + lifecycle states + AI agent + transparent reasoning + reuse engine — is domain-agnostic. Building it twice in different domains demonstrates that the framework, not the domain, is the durable PM skill.
        </p>
      </Section>
    </div>
  );
}
