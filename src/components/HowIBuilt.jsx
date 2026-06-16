import React from 'react';

// =================== HOW IT CAME TOGETHER ===================
const OBSERVATIONS = [
  'Seven Pillar Portfolio Managers maintaining their own data spreadsheets on top of Airtable — same fields, different definitions.',
  'Tooling support requests go to whoever the PPM happens to know — no single front door, no SLA.',
  'Tableau dashboards built by different people with different metric definitions — same KPI, conflicting numbers.',
  'Time-tracking adoption inconsistent across the 7 pillars (61–88%) — capacity data leaks.',
  'PPMs and DET leaders waste cycles arguing about whose numbers are right instead of acting on them.'
];

const PRINCIPLES = [
  { p: 'Trust > Speed',            why: 'A slow accurate workspace beats a fast one PPMs second-guess. Every metric carries source + owner + definition so disagreements end before they start.' },
  { p: 'One front door',           why: 'Every tooling request, dashboard ask, and data flag enters one queue. PPMs stop wondering who to ping; SPM Ops stops triaging four inboxes.' },
  { p: 'Metric lineage visible',   why: 'No number without a traceable path back to source system, owner, and refresh cadence. Removes the "where did that come from?" friction.' },
  { p: 'Persona-aware, not gated', why: 'Same workspace reshapes itself for PPM / Finance / Director / Sponsor. RBAC stays simple; experience adapts.' },
  { p: 'Drafts not decisions',     why: 'Every recommendation is a draft for stakeholder review — never a final call. SPM Ops enables decisions; PPMs and leadership make them.' }
];

const SCOPE_IN = [
  'Data quality console · validation rules · reconciliation cadence',
  'Tooling support queue · SLAs · runbooks · enablement docs',
  'Dashboard catalog with documented metric lineage',
  'Persona switcher (PPM / Finance / Director / Sponsor lenses)',
  'Agent fabric for routine governance + comms drafting'
];

const SCOPE_OUT = [
  'Strategic prioritization decisions — PPMs and SPM Lead own these',
  'RICE scoring + capital allocation authority — Director + Sponsor own these',
  'Executive roadmap construction — Sr Director + Joe & Zarillo own this',
  'M&A diligence on portfolio pieces — out of scope for the role and the team'
];

// =================== PATH TO PRODUCTION ===================
const PROD_PHASES = [
  {
    n: 0, title: 'Land + Listen', duration: 'Weeks 0–4',
    scope: 'No tools deployed. Observation + documentation only.',
    moves: [
      'Shadow each of 7 PPMs for 1 hour',
      'Map the as-is: which data lives where, refresh cadence, owners',
      'Document the support-request "shadow IT" patterns (Slack DMs, ad-hoc Airtable views)'
    ],
    exit: 'Signed-off as-is map + scope agreement with Senior Director'
  },
  {
    n: 1, title: 'Foundation', duration: 'Weeks 4–12',
    scope: 'Standardize the substrate without changing user experience yet.',
    moves: [
      'Airtable schema v2: standardize fields + definitions across all 7 pillars',
      'Data validation rules deployed via Zapier → Airtable',
      'Slack support intake — one front door for tooling requests with SLA',
      'Linear hygiene rules + automated nudges for stale tickets'
    ],
    exit: 'Baseline data trust score published + improvement plan accepted'
  },
  {
    n: 2, title: 'Pilot with 1 PPM', duration: 'Months 3–6',
    scope: 'Prove the workspace pattern with the most willing customer.',
    moves: [
      'Pick the PPM most frustrated by tooling sprawl — they become the champion',
      'Co-build their first 3 trusted Tableau dashboards inside this workspace pattern',
      'Document playbooks + SLAs as they emerge from real use',
      'Weekly retro: what to keep, what to cut, what to add'
    ],
    exit: 'Pilot PPM data trust ≥80%, tooling TTR median ≤8h, pilot signs PR/FAQ for rollout'
  },
  {
    n: 3, title: 'Scale to all 7 PPMs', duration: 'Months 6–12',
    scope: 'Onboard the remaining 6 PPMs in cohorts; build the dashboard catalog.',
    moves: [
      '6 weekly cohorts (1 PPM/week) with hands-on enablement',
      'Tableau dashboard catalog — 17 trusted views with metric lineage',
      'Pilot PPM becomes peer mentor for cohort 2',
      'Time-tracking adoption push — partner with the Capacity Planning pillar lead'
    ],
    exit: '7/7 PPM adoption, portfolio-wide trust ≥90%, time tracking ≥90% across pillars'
  },
  {
    n: 4, title: 'Cross-DET expansion', duration: 'Year 2+',
    scope: 'Open the workspace beyond SPM — shared infrastructure for portfolio-adjacent teams.',
    moves: [
      'Open to PPM-adjacent roles: Process Excellence, Capacity Planning, Finance partner',
      'Lift Source-of-Truth schema to feed cross-org executive dashboards',
      'Discuss with Delivery Assurance sibling sub-orgs — same need shape, different inputs',
      'Quarterly SPM steering review confirms continued strategic fit'
    ],
    exit: 'Workspace becomes shared DET infrastructure; ownership transitions to a small platform team'
  }
];

// =================== PATH TO A PRODUCT ===================
const ADOPTION_FUNNEL = [
  { stage: 'Day 0',   who: 'Core team',    detail: 'SPM Ops + Senior Director + Director — the daily users' },
  { stage: 'Week 4',  who: '+1 PPM pilot', detail: 'Most-frustrated pillar adopts as their daily view' },
  { stage: 'Month 6', who: '+7 PPMs',      detail: 'All Pillar Portfolio Managers + Finance partner' },
  { stage: 'Year 1',  who: '+ Leadership', detail: 'Director and Sponsor views go live as read-only lenses' },
  { stage: 'Year 2+', who: '+ Cross-DET',  detail: 'Sister sub-orgs in Delivery Assurance & Operations adopt' }
];

const VALUE_MODEL = [
  { metric: 'Capacity reclaimed', target: '~18 hrs/wk per PPM', how: 'Triangulation time across Airtable / Linear / Tableau / Slack collapses to one workspace' },
  { metric: 'Decision velocity',  target: '4d → 6h median',     how: 'Trusted dashboards + audit trail mean PPMs and leadership skip the "whose numbers" debate' },
  { metric: 'Trust score',        target: '72% → 94%',           how: '% of metrics where PPM + Finance + Director agree on the number first time' },
  { metric: 'Support TTR',        target: 'Median ≤ 4h · SLA 8h', how: 'One Slack intake + runbooks + tier-1 ownership' },
  { metric: 'PPM NPS',            target: '+30 vs baseline',     how: 'Quarterly survey: "How easy is it to get the data + tools you need to run your pillar?"' }
];

const BUILD_VS_BUY = [
  { area: 'Foundation tools',   verdict: 'Buy',         detail: 'Airtable, Linear, Tableau, Slack, Zapier/Workato — best-in-class commercial; no reason to rebuild.' },
  { area: 'SPM-specific layer', verdict: 'Build',       detail: 'Persona switcher, audit trail, dashboard catalog with metric lineage, agent fabric — the role\'s IP lives here.' },
  { area: 'Data warehouse',     verdict: 'Reuse',       detail: 'Salesforce Data Cloud / Snowflake already in DET. No new infra; ride the existing rails.' },
  { area: 'Identity + access',  verdict: 'Reuse',       detail: 'Okta / Entra existing. Persona switcher reads from IdP claims, no new auth system.' },
  { area: 'AI / agents',        verdict: 'Buy + wrap',  detail: 'Agentforce as the runtime; SPM-specific prompts + guardrails as the wrapper. Don\'t train custom models.' }
];

const GOVERNANCE = [
  { who: 'Product Owner',      role: 'SPM Ops Manager (Lead) — this role', what: 'Roadmap, scope, prioritization, pilot selection, weekly cadence' },
  { who: 'Strategic Sponsor',  role: 'Senior Director, SPM',                what: 'Quarterly direction, FY27 pillar alignment, executive air cover' },
  { who: 'Steering Committee', role: '7 PPMs + Finance partner',            what: 'Quarterly review of catalog, request prioritization, adoption metrics' },
  { who: 'Tier-1 Support',     role: 'SPM Ops Manager + on-call rotation',  what: 'Daily ticket queue across Airtable / Linear / Tableau / Slack issues' },
  { who: 'Tier-2 Engineering', role: 'Salesforce IT (cross-cutting)',       what: 'Airtable schema migrations, Tableau extract failures, IdP integration' },
  { who: 'Data Steward',       role: 'SPM Ops + Capacity Planning lead',    what: 'Metric lineage maintenance, glossary updates, validation rule changes' }
];

// =================== STRATEGIC RISKS ===================
const STRATEGIC_RISKS = [
  {
    risk: 'PPMs resist the new front door',
    type: 'Adoption',
    mitigation: 'Pilot with the most-frustrated PPM first. Their results recruit the others. Don\'t announce a mandate — let it earn adoption.'
  },
  {
    risk: 'Sponsor changes priority mid-rollout',
    type: 'Strategic',
    mitigation: 'Phase each release to deliver standalone value. Stop at Phase 1: org still has data validation. Stop at Phase 2: pilot PPM keeps their working view. Phases are independent wins.'
  },
  {
    risk: 'Senior Director arrives with a different vision',
    type: 'Strategic',
    mitigation: 'The workspace embodies the FY27 SPM 5-pillar strategy that leadership already endorsed. The architecture survives a leadership refresh; the layout is the negotiable surface.'
  },
  {
    risk: 'Adoption stalls in Months 6–12',
    type: 'Adoption',
    mitigation: 'Weekly cohorts, not one big launch. 1:1 enablement with each PPM. Co-build the first 3 dashboards with them, not for them.'
  },
  {
    risk: 'Cross-DET expansion perceived as "SPM-only"',
    type: 'Political',
    mitigation: 'From Phase 1, frame as "data foundation underneath portfolio governance" — not "SPM\'s tool." Sister sub-orgs recognize they need the same shape.'
  },
  {
    risk: 'Agent reliability — bad drafts erode trust',
    type: 'Product',
    mitigation: 'Every agent output is a draft for review. Confidence scores visible. Hard cap: confidence ≥0.6 to surface; below that, route to a human. Audit the misses weekly.'
  },
  {
    risk: 'Time-tracking adoption stalls below 90%',
    type: 'Adoption',
    mitigation: 'Pair it with what PPMs already want — capacity visibility + fair allocation. Frame it as "you get a clearer picture of your own work," not as a compliance ask.'
  },
  {
    risk: 'Vendor lock-in on Airtable / Linear',
    type: 'Product',
    mitigation: 'Schema is portable. Every dataset has a documented export path. Could lift to Postgres + Jira inside a quarter if either vendor exit becomes necessary.'
  }
];

// =================== UI ===================
function H2({ kicker, children, sub }) {
  return (
    <header className="mb-5">
      {kicker && <div className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold mb-2">{kicker}</div>}
      <h2 className="text-xl font-serif font-bold text-white leading-tight">{children}</h2>
      {sub && <p className="text-sm text-white/70 mt-1.5 leading-relaxed max-w-2xl">{sub}</p>}
    </header>
  );
}

function RiskTypeBadge({ children }) {
  const c = children.toLowerCase();
  const tone = c === 'strategic' ? 'text-sflight bg-sflight/15 border-sflight/40'
            : c === 'adoption'   ? 'text-amber-300 bg-amber-500/15 border-amber-300/40'
            : c === 'political'  ? 'text-red-300 bg-red-500/15 border-red-300/40'
            : c === 'product'    ? 'text-emerald-300 bg-emerald-500/15 border-emerald-300/40'
            : 'text-white/70 bg-white/5 border-white/15';
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border rounded px-2 py-0.5 ${tone}`}>{children}</span>;
}

function VerdictBadge({ children }) {
  const c = children.toLowerCase();
  const tone = c === 'build'       ? 'text-sflight bg-sflight/15 border-sflight/40'
            : c === 'buy'          ? 'text-emerald-300 bg-emerald-500/15 border-emerald-300/40'
            : c === 'reuse'        ? 'text-amber-300 bg-amber-500/15 border-amber-300/40'
            : c === 'buy + wrap'   ? 'text-white bg-white/10 border-white/25'
            : 'text-white/70 bg-white/5 border-white/15';
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border rounded px-2 py-0.5 ${tone}`}>{children}</span>;
}

// =================== MAIN ===================
export default function HowIBuilt() {
  return (
    <div className="space-y-10 max-w-[1100px]">

      {/* HERO */}
      <header>
        <div className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">About</div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-[1.05] tracking-tight mt-2">About this workspace.</h1>
        <p className="text-base text-white/80 mt-4 leading-relaxed max-w-2xl">
          The strategic story: how this workspace came together, how it scales to production across 12 months, and how it becomes a product the SPM team adopts, maintains, and trusts.
        </p>
        <p className="text-sm text-white/65 mt-3 leading-relaxed max-w-2xl italic">
          <strong className="text-white not-italic">Designed for:</strong> the Strategic Portfolio Operations Manager (Lead) running data + tooling for DET's SPM team. Centered on FY27 SPM pillars P02 (Data &amp; Systems Optimization) and P03 (Tooling Enablement) across the Airtable / Linear / Tableau / Slack stack serving 7 Pillar Portfolio Managers and ~250 initiatives.
        </p>
      </header>

      <hr className="border-white/10" />

      {/* 00 · FY27 SPM 5 PILLARS */}
      <section className="rounded-xl border border-sflight/30 bg-sflight/10 p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold mb-2">00 · Strategy fit · FY27 SPM</div>
        <h2 className="text-lg font-serif font-bold text-white mb-3">5 strategic pillars · the role's home is P02 + P03</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
          <div className="rounded-md border border-white/15 bg-white/5 p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/55 font-bold">P01</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">Portfolio Planning</div>
            <p className="text-[11px] text-white/65 mt-1 leading-snug">Annual + quarterly cycles, intake taxonomy, OKR linkage.</p>
          </div>
          <div className="rounded-md border-2 border-sflight bg-sflight/15 p-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sflight font-bold">P02</span>
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-sflight bg-white/10 border border-sflight/40 rounded px-1.5 py-0.5">ROLE HOME</span>
            </div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">Data &amp; Systems Optimization</div>
            <p className="text-[11px] text-white/85 mt-1 leading-snug">Portfolio data foundation, governance, validation/reconciliation, Airtable schema, downstream warehouse.</p>
          </div>
          <div className="rounded-md border-2 border-sflight bg-sflight/15 p-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sflight font-bold">P03</span>
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-sflight bg-white/10 border border-sflight/40 rounded px-1.5 py-0.5">ROLE HOME</span>
            </div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">Tooling Enablement</div>
            <p className="text-[11px] text-white/85 mt-1 leading-snug">Tier-1 support, integrations, automations, training. Owns Airtable · Linear · Tableau · Slack stack.</p>
          </div>
          <div className="rounded-md border border-white/15 bg-white/5 p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/55 font-bold">P04</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">Process Excellence &amp; Governance</div>
            <p className="text-[11px] text-white/65 mt-1 leading-snug">Operating procedures, stage-gate, governance workflows.</p>
          </div>
          <div className="rounded-md border border-white/15 bg-white/5 p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/55 font-bold">P05</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">Capacity Planning</div>
            <p className="text-[11px] text-white/65 mt-1 leading-snug">FTE supply/demand, time-tracking compliance, allocation data.</p>
          </div>
        </div>
        <p className="text-xs text-white/65 mt-4 leading-relaxed italic">
          Role focus on P02 + P03 — but the workspace stays aware of all five so SPM Ops contributes data and tooling support into Planning, Process, and Capacity workflows owned by other SPM team members.
        </p>
      </section>

      <hr className="border-white/10" />

      {/* 01 · THE RENOVATION */}
      <section className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold mb-2">01 · Context · The renovation</div>
        <h2 className="text-lg font-serif font-bold text-white mb-3">What's being rebuilt — and what stays</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold mb-1.5">Stays · the wood structure</div>
            <ul className="space-y-1 text-white/85 leading-relaxed">
              <li>· The 7 DET pillars and their PPMs (the customers of this role)</li>
              <li>· Airtable as the portfolio data home; Linear as the work-item layer</li>
              <li>· Salesforce-on-Salesforce as the foundational stack</li>
              <li>· Existing time-tracking system in DET (needs solidification)</li>
              <li>· The SPM team's institutional knowledge and PPM relationships</li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-1.5">Changes · what this role owns</div>
            <ul className="space-y-1 text-white/85 leading-relaxed">
              <li>· Data Quality &amp; Governance Program — validation rules, audits, reconciliation cadence</li>
              <li>· Tooling support desk: SLAs, intake routing, runbooks, enablement docs</li>
              <li>· Dashboard catalog: trusted exec + PPM views with documented metric lineage</li>
              <li>· Integrations + Zapier/Workato automations between Airtable, Linear, Tableau, Slack</li>
              <li>· Time tracking compliance push + financial reconciliation cadence with Finance partner</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-white/65 mt-4 leading-relaxed italic">
          Charter refocused 6 weeks ago. The SPM team is scaling and adding a Manager (Lead) role to professionalize the data + tooling layer underneath the 5 FY27 pillars. The role-holder owns it end-to-end across Airtable, Linear, Tableau, and Slack.
        </p>
      </section>

      <hr className="border-white/10" />

      {/* 02 · HOW IT CAME TOGETHER */}
      <section>
        <H2 kicker="02 · The thinking" sub="Three lenses on how this workspace came together: what was observed in the current state, the principles that shaped the response, and the choices about what to leave out.">
          How this workspace came together
        </H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="border border-red-300/30 bg-red-500/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-red-300 font-bold mb-2">Observed</div>
            <ul className="space-y-2 text-sm text-white/85 leading-relaxed">
              {OBSERVATIONS.map((o, i) => (
                <li key={i} className="flex gap-2"><span className="text-red-300 flex-shrink-0">·</span><span>{o}</span></li>
              ))}
            </ul>
          </div>

          <div className="border border-sflight/30 bg-sflight/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-sflight font-bold mb-2">Principles applied</div>
            <ul className="space-y-3 text-sm text-white/85 leading-relaxed">
              {PRINCIPLES.map((p, i) => (
                <li key={i}>
                  <div className="font-serif font-bold text-white">{p.p}</div>
                  <div className="text-xs text-white/65 mt-0.5 leading-relaxed">{p.why}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-emerald-300/30 bg-emerald-500/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold mb-2">Scope discipline</div>
            <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold mb-1">In</div>
            <ul className="space-y-1 text-xs text-white/85 leading-relaxed mb-3">
              {SCOPE_IN.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-emerald-300 flex-shrink-0">+</span><span>{s}</span></li>)}
            </ul>
            <div className="text-[10px] uppercase tracking-wider text-red-300 font-bold mb-1">Deliberately out</div>
            <ul className="space-y-1 text-xs text-white/85 leading-relaxed">
              {SCOPE_OUT.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-red-300 flex-shrink-0">−</span><span>{s}</span></li>)}
            </ul>
          </div>

        </div>
      </section>

      <hr className="border-white/10" />

      {/* 03 · PATH TO PRODUCTION */}
      <section>
        <H2 kicker="03 · Path to production" sub="Five phases over 12 months that turn the prototype into a live workspace running on real DET data. Each phase delivers standalone value — stopping at any phase still leaves the org better off.">
          Path to production
        </H2>
        <div className="space-y-3">
          {PROD_PHASES.map(p => (
            <article key={p.n} className="border border-white/15 rounded-xl p-5 bg-white/5">
              <header className="flex items-baseline gap-3 flex-wrap mb-3">
                <span className="text-[11px] uppercase tracking-wider text-sflight font-mono font-bold">Phase {String(p.n).padStart(2, '0')}</span>
                <h3 className="text-base font-serif font-bold text-white">{p.title}</h3>
                <span className="text-[11px] text-white/55">· {p.duration}</span>
                <span className="text-[11px] text-white/55 ml-auto italic max-w-md text-right">{p.scope}</span>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                <div className="md:col-span-7">
                  <div className="text-[10px] uppercase tracking-wider text-white/55 font-semibold mb-1.5">Moves</div>
                  <ul className="space-y-1.5">
                    {p.moves.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/85 leading-relaxed">
                        <span className="text-sflight font-mono text-xs flex-shrink-0 mt-0.5 font-bold">{String(i + 1).padStart(2, '0')}</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-5 border-l border-white/10 pl-4">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1.5">Exit criteria</div>
                  <p className="text-white/85 leading-relaxed">{p.exit}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="text-xs text-white/65 mt-4 leading-relaxed italic">
          Each phase is an independent win. Sponsor pivots, leadership changes, or budget cuts don't kill the program — they just stop it at the last completed phase, with that phase's value already realized.
        </p>
      </section>

      <hr className="border-white/10" />

      {/* 04 · PATH TO A PRODUCT */}
      <section>
        <H2 kicker="04 · Path to a product" sub="How the workspace stops being a prototype and starts being a product the SPM team adopts, maintains, and recommends. Four moves: an adoption funnel, a measurable value model, build-vs-buy discipline, and a clear ownership structure.">
          Path to a product
        </H2>

        {/* Adoption funnel */}
        <div className="border border-white/15 rounded-xl overflow-hidden mb-5 bg-white/5">
          <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-sflight font-bold">04a · Adoption funnel</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">Who uses it, and when</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {ADOPTION_FUNNEL.map((a, i) => (
              <div key={i} className="p-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-sflight font-bold">{a.stage}</div>
                <div className="text-sm font-serif font-bold text-white mt-0.5">{a.who}</div>
                <p className="text-[11px] text-white/65 mt-1.5 leading-snug">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Value model */}
        <div className="border border-white/15 rounded-xl overflow-hidden mb-5 bg-white/5">
          <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-sflight font-bold">04b · Value model</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">5 measurable outcomes the team will see</div>
          </div>
          <div className="divide-y divide-white/10">
            {VALUE_MODEL.map((v, i) => (
              <div key={i} className="p-3 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
                <div className="md:col-span-3 font-serif font-bold text-white">{v.metric}</div>
                <div className="md:col-span-3 text-sflight font-semibold font-mono text-[12px]">{v.target}</div>
                <div className="md:col-span-6 text-xs text-white/70 leading-relaxed">{v.how}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Build vs Buy */}
        <div className="border border-white/15 rounded-xl overflow-hidden mb-5 bg-white/5">
          <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-sflight font-bold">04c · Build · Buy · Reuse</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">The IP is the operating model, not the infrastructure</div>
          </div>
          <div className="divide-y divide-white/10">
            {BUILD_VS_BUY.map((b, i) => (
              <div key={i} className="p-3 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm items-baseline">
                <div className="md:col-span-3 font-serif font-bold text-white">{b.area}</div>
                <div className="md:col-span-2"><VerdictBadge>{b.verdict}</VerdictBadge></div>
                <div className="md:col-span-7 text-xs text-white/70 leading-relaxed">{b.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance */}
        <div className="border border-white/15 rounded-xl overflow-hidden bg-white/5">
          <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-sflight font-bold">04d · Ownership &amp; governance</div>
            <div className="text-sm font-serif font-bold text-white mt-0.5">A product needs an owner — here's the operating model</div>
          </div>
          <div className="divide-y divide-white/10">
            {GOVERNANCE.map((g, i) => (
              <div key={i} className="p-3 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
                <div className="md:col-span-3 font-serif font-bold text-white">{g.who}</div>
                <div className="md:col-span-3 text-xs text-white/85 leading-relaxed">{g.role}</div>
                <div className="md:col-span-6 text-xs text-white/70 leading-relaxed">{g.what}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-white/10" />

      {/* 05 · STRATEGIC RISKS */}
      <section>
        <H2 kicker="05 · What could go wrong" sub="Strategic, adoption, political, and product risks — and how each is managed. Technical risks belong in a different document; these are the ones a Manager (Lead) actually thinks about.">
          Strategic risks &amp; how to manage them
        </H2>
        <div className="space-y-2.5">
          {STRATEGIC_RISKS.map((r, i) => (
            <article key={i} className="border border-white/15 rounded-xl p-4 bg-white/5">
              <header className="flex items-baseline gap-3 flex-wrap mb-2">
                <RiskTypeBadge>{r.type}</RiskTypeBadge>
                <h3 className="text-sm font-serif font-bold text-white">{r.risk}</h3>
              </header>
              <p className="text-xs text-white/85 leading-relaxed"><strong className="text-white">Mitigation —</strong> {r.mitigation}</p>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
