import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, PlayCircle, Target, Shield, MessageCircle,
  ChevronDown, Lightbulb, X, Clock, Zap, BookOpen
} from 'lucide-react';

// =================== TAB QUICK REFERENCE ===================
const TAB_REFERENCE = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard',        desc: '5 portfolio KPIs, stage-gate pipeline, pillar performance, 16 initiatives.' },
  { id: 'journey',   icon: '🎬', label: 'Journey',          desc: 'Animated G0→G5 lifecycle of one initiative, showing capital/risk/resource/KPI ripples.' },
  { id: 'decision',  icon: '🧮', label: 'Decision Engine',   desc: '8 calculators: RICE, Capital Optimizer, Risk Heatmap, Stage-Gate Scorer, Value/TCO, Influence Factors, Process Health, Scenario Compare.' },
  { id: 'kpi',       icon: '⚙️',  label: 'KPI Studio',         desc: '17 configurable KPIs + 5 weighting profiles + Accelerate/Continue/Watch/Restructure/Sunset recommendations.' },
  { id: 'playbooks', icon: '📚', label: 'Playbooks',         desc: '7 foundational playbooks (intake, stage-gate, capacity, risk, rebalance, review, sunset).' },
  { id: 'team',      icon: '👥', label: 'Team Cockpit',      desc: '4 portfolio manager direct reports with AI coaching feed and workflow automations.' },
  { id: 'workbench', icon: '✍️',  label: 'Workbench',          desc: 'Sr Manager comms: 8 message templates, composer, drafts, distribution lists.' },
  { id: 'copilot',   icon: '🤖', label: 'Copilot',           desc: 'AI agent answering portfolio questions with transparent reasoning (classify → resolve → reason → confidence).' },
  { id: 'data',      icon: '📐', label: 'Source of Truth',   desc: 'Schema (4 tables) + 17-metric Catalog + 33-term Glossary + Audit Trail.' },
  { id: 'how',       icon: '🔨', label: 'How I Built This',  desc: 'JD coverage matrix, design rationale, 60-90 day plan.' }
];

// =================== TOURS ===================
const TOURS = {
  '20s': {
    label: '20-second scan',
    description: 'The bare minimum understanding. 3 stops.',
    steps: [
      { tab: 'dashboard', title: 'The 5 KPIs',           lookFor: 'Health · Capital · Compliance · Cycle · Strategic Alignment. Hover any tile for what + target.' },
      { tab: 'kpi',       title: 'The recommendations',  lookFor: 'Every initiative bucketed: Accelerate / Continue / Watch / Restructure / Sunset.' },
      { tab: 'workbench', title: 'The output',           lookFor: 'How portfolio data becomes exec messaging — 8 templates, AI auto-draft.' }
    ]
  },
  '2m': {
    label: '2-minute narrative',
    description: 'The story of one initiative across 5 stops.',
    steps: [
      { tab: 'dashboard', title: 'Get the shape',                  lookFor: '16 initiatives, 6 pillars, $30M deployed. The Stage-Gate Pipeline shows where capital concentrates.' },
      { tab: 'journey',   title: 'Press Play',                      lookFor: 'Watch Agentforce move G0→G5. Risk peaks at G2 Build then falls — by design.' },
      { tab: 'decision',  title: 'Drag the budget slider',          lookFor: 'Capital Optimizer recomputes the optimal mix in real-time. Pin Trust initiatives to protect them.' },
      { tab: 'kpi',       title: 'Switch the profile',              lookFor: 'Pick "Margin-First" → see CPQ shift to Sunset. Pick "Innovation-First" → see Customer 360 Voice rise.' },
      { tab: 'workbench', title: 'Open a template',                 lookFor: 'Click Compose on "Monthly Exec Update" — 5 sections, AI auto-draft, distribution list ready.' }
    ]
  },
  '5m': {
    label: '5-minute deep dive',
    description: 'Every tab with one specific thing to notice.',
    steps: [
      { tab: 'dashboard', title: 'KPIs as governance signals',     lookFor: 'Stage-Gate Compliance at 88% — improving. The trend line on Process Health shows +17pts in 6 months.' },
      { tab: 'journey',   title: 'Cross-pillar ripple',             lookFor: 'At G2 Build, Trust & Security activates (AI Governance dependency). At G4 Launch, dependencies unblock.' },
      { tab: 'decision',  title: 'Process Health anti-patterns',    lookFor: '4 detected anti-patterns with recommendations — this is "data-driven audits to provide strategic feedback."' },
      { tab: 'kpi',       title: 'Per-initiative drill-down',        lookFor: 'Click any initiative row → see auto-rationale + per-KPI breakdown showing what dragged the score down.' },
      { tab: 'playbooks', title: 'Adoption gradient',                lookFor: '4 playbooks at GA, 2 in Pilot, 1 in Draft. Adoption tracked per pillar.' },
      { tab: 'team',      title: 'AI Coaching Feed',                 lookFor: 'Auto-detected: "Renata 1:1 overdue 19 days." "Marcus on leave June 17 — propose Aisha as backfill."' },
      { tab: 'workbench', title: 'Workbench composer',               lookFor: 'AI auto-draft button fills sections from PortfolioIQ data. Completeness % bar updates live.' },
      { tab: 'data',      title: 'Source of Truth',                   lookFor: 'Schema · Metric Catalog (17) · Data Glossary (33 terms with "Don\'t confuse with") · Audit Trail.' }
    ]
  }
};

// =================== PRFAQ CONTENT ===================
const PRFAQ_FAQS = [
  { q: 'Why does PortfolioIQ exist?',
    a: 'Most portfolio teams spend the majority of their time triangulating data across systems instead of making decisions. PortfolioIQ collapses that. One Source of Truth, one taxonomy, one set of decision engines, one workbench for comms — so portfolio leaders spend their time on the decisions only they can make.' },
  { q: 'Who is the target user?',
    a: 'Senior Directors and Senior Managers of Strategic Portfolio Management. Pillar Portfolio Managers who report to them. Executive Sponsors who fund the work and need to see trade-offs without hunting for them.' },
  { q: 'What\'s the most differentiated feature?',
    a: 'The KPI Studio Recommendation Engine. Every other portfolio tool shows you data. This one tells you what to do about it — bucketing every initiative as Accelerate / Continue / Watch / Restructure / Sunset, with auto-generated rationale grounded in your chosen scoring profile.' },
  { q: 'How is this different from Anaplan, Smartsheet, or ServiceNow SPM?',
    a: 'Those tools are systems of record. PortfolioIQ is the intelligence + decision layer that sits on top. The architecture assumes existing systems exist and feed in — and focuses on the part those systems don\'t do: surfacing trade-offs, recommending actions, and turning data into comms.' },
  { q: 'Why mock data?',
    a: 'To enable open exploration without compromising any organization\'s portfolio. The schema is designed so each table maps to a real connector (Anaplan for budget, ServiceNow for tickets, GUS for stage-gate artifacts). Real data is one connector per source system away.' },
  { q: 'What\'s mock vs production-quality?',
    a: 'The data is mock. The schema, taxonomy, governance frameworks, decision engines, and AI patterns are designed to lift into production with minimal change. The 4 normalized tables, the 17-metric Catalog, the 33-term Glossary, the 7 Playbooks — all production-ready as v1.' },
  { q: 'What\'s next if this becomes a real tool?',
    a: 'v2 priorities: ingest real data via 4 connectors (Anaplan, ServiceNow, GUS, Quip); replace simulated AI with grounded RAG over the actual portfolio data; add a benefits_realization table for post-launch value tracking; integrate with Slack for in-channel decisions.' }
];

// =================== COMPONENTS ===================
function Stat({ label, value, sub }) {
  return (
    <div>
      <div className="text-3xl font-serif font-bold text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/60 font-semibold">{label}</div>
      <div className="text-[11px] text-white/70">{sub}</div>
    </div>
  );
}

function OutcomeCard({ icon: Icon, title, description }) {
  return (
    <div className="card card-hover">
      <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center mb-3">
        <Icon className="w-5 h-5 text-sfblue" />
      </div>
      <h3 className="font-serif font-bold text-sfnavy">{title}</h3>
      <p className="text-sm text-sfnavy mt-1 leading-relaxed">{description}</p>
    </div>
  );
}

function NarrativeStep({ num, tab, navigateTo, title, description, cta }) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="w-9 h-9 rounded-full bg-sflight text-white grid place-items-center font-mono font-bold flex-shrink-0">{num}</div>
      <div className="flex-1 pt-0.5">
        <h4 className="font-serif font-semibold text-sfnavy">{title}</h4>
        <p className="text-sm text-sfnavy mt-0.5 leading-relaxed">{description}</p>
        <button onClick={() => navigateTo(tab)} className="text-xs font-semibold text-sfblue hover:text-sfdeep flex items-center gap-1 mt-2">
          {cta} <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function TourCard({ duration, title, description, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className="card card-hover text-left flex flex-col items-start group">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-sflight/15 grid place-items-center">
          <Icon className="w-4 h-4 text-sflight" />
        </div>
        <span className="text-[11px] uppercase tracking-wider text-sflight font-bold">{duration}</span>
      </div>
      <h4 className="font-serif font-bold text-sfnavy">{title}</h4>
      <p className="text-xs text-sfmuted mt-1 leading-relaxed">{description}</p>
      <span className="text-xs font-semibold text-sfblue mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
        Start <ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
}

function TourPanel({ tourId, navigateTo, onClose }) {
  const tour = TOURS[tourId];
  return (
    <section className="card border-l-4 border-sflight bg-sflight/5 step-fade-in">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-sflight font-semibold">Active tour</div>
          <h3 className="text-lg font-serif font-bold text-sfnavy">{tour.label}</h3>
          <p className="text-xs text-sfmuted">{tour.description}</p>
        </div>
        <button onClick={onClose} className="text-xs text-sfmuted hover:text-sfnavy flex items-center gap-1">
          <X className="w-3 h-3" /> Close
        </button>
      </div>
      <div className="space-y-2 mt-4">
        {tour.steps.map((step, i) => (
          <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3 step-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-7 h-7 rounded-full bg-sflight text-white grid place-items-center text-xs font-bold flex-shrink-0">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-sfnavy">{step.title}</div>
              <p className="text-xs text-sfblue mt-1"><strong>Look for:</strong> <span className="text-sfnavy font-normal">{step.lookFor}</span></p>
            </div>
            <button onClick={() => navigateTo(step.tab)} className="text-xs bg-sflight text-white rounded-lg px-3 py-1.5 font-medium hover:bg-sfblue flex-shrink-0 flex items-center gap-1">
              Open <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PRFAQ({ faqOpen, setFaqOpen }) {
  return (
    <div>
      {/* Press Release */}
      <div className="bg-sfbg border border-slate-200 rounded-lg p-5">
        <div className="text-[10px] uppercase tracking-widest text-sfmuted font-semibold mb-2">For Immediate Release · April 2026</div>
        <h3 className="text-2xl font-serif font-bold text-sfnavy leading-tight">PortfolioIQ launches: a single pane of glass for portfolio leaders managing technology investments at scale</h3>
        <p className="italic text-sm text-sfmuted mt-2 leading-relaxed">A new tool that empowers Senior Directors, Senior Managers, and Executives to prioritize, allocate capital, govern, and communicate across every pillar of a tech portfolio — replacing the current sprawl of dashboards, spreadsheets, and Slack threads.</p>

        <div className="mt-4 space-y-3 text-sm text-sfnavy leading-relaxed">
          <p>Portfolio teams managing strategic technology investments spend most of their time triangulating data across systems: <em>"Is this initiative actually on track?" "What's our exposure if Q3 budget gets cut?" "Why did CPQ go off-track?"</em> The answers live in 4 different tools and 12 different definitions, and the time spent stitching context together is time not spent making decisions.</p>

          <p>PortfolioIQ replaces the stitching. Every portfolio KPI, every initiative, every stage-gate artifact, every dependency, every capital allocation decision lives in one application — with a defined Source of Truth, a configurable KPI catalog, an AI agent that answers questions with transparent reasoning, and a workbench for the communications a portfolio leader owns weekly.</p>

          <blockquote className="border-l-4 border-sflight pl-4 py-2 italic text-sfmuted bg-white rounded-r">
            "Most portfolio dashboards show me data. PortfolioIQ shows me the next decision I need to make and the trade-offs of getting it wrong."<br />
            <span className="text-xs not-italic">— target user, Senior Director of Portfolio Management</span>
          </blockquote>

          <p><strong className="text-sfnavy">How it works.</strong> A portfolio leader opens PortfolioIQ on Monday morning. The Dashboard surfaces 5 leading KPIs (Health, Capital, Compliance, Cycle Time, Strategic Alignment). The KPI Studio Recommendation Engine has already scored every initiative and bucketed them <em>Accelerate / Continue / Watch / Restructure / Sunset</em>. The leader picks a profile (Margin-First, Risk-Averse, Innovation-First, Trust-First, Balanced), watches the recommendations shift, and exports the top 3 trade-off decisions to her CFO via the Workbench in 90 seconds.</p>

          <blockquote className="border-l-4 border-sgreen pl-4 py-2 italic text-sfmuted bg-white rounded-r">
            "Most tools tell me where the portfolio has been. This one tells me what to do about it."<br />
            <span className="text-xs not-italic">— imagined exec response after a 2-minute walkthrough</span>
          </blockquote>

          <p>PortfolioIQ is currently a live demonstration at <a href="https://portfolioiq-demo.vercel.app" className="text-sfblue hover:underline" target="_blank" rel="noreferrer">portfolioiq-demo.vercel.app</a>. All data is mock. The architecture, taxonomy, and frameworks are production-quality.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-4">
        <h4 className="text-base font-serif font-bold text-sfnavy mb-2">Frequently Asked Questions</h4>
        <div className="space-y-2">
          {PRFAQ_FAQS.map((f, i) => {
            const open = faqOpen === i;
            return (
              <button key={i} onClick={() => setFaqOpen(open ? null : i)} className="w-full text-left bg-white border border-slate-200 rounded-lg p-3 hover:border-sfblue/40 transition">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-sfnavy">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-sfmuted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
                </div>
                {open && <p className="text-sm text-sfnavy mt-2 leading-relaxed">{f.a}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =================== MAIN ===================
export default function Welcome({ navigateTo }) {
  const [activeTour, setActiveTour] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <div className="space-y-4">
      {/* HERO — the 20-second pitch */}
      <section className="card bg-gradient-to-br from-sfnavy via-sfdeep to-sfblue text-white relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-sflight/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-sflight" />
            <span className="text-[11px] uppercase tracking-widest text-sflight font-bold">PortfolioIQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.05]">Run your tech portfolio in one view.</h1>
          <p className="text-lg text-white/90 mt-4 leading-relaxed">
            A single pane of glass for portfolio leaders to <strong className="text-sflight">prioritize</strong> initiatives, <strong className="text-sflight">allocate capital</strong>, <strong className="text-sflight">govern</strong> stage-gates, and <strong className="text-sflight">communicate</strong> decisions — across every pillar, every initiative, every dollar.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => setActiveTour('20s')} className="bg-white text-sfnavy rounded-lg px-5 py-3 font-semibold hover:bg-white/90 transition flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" /> 20-second scan
            </button>
            <button onClick={() => setActiveTour('2m')} className="bg-sflight text-white rounded-lg px-5 py-3 font-semibold hover:bg-sfblue transition flex items-center gap-2 text-sm shadow-lg">
              <PlayCircle className="w-4 h-4" /> 2-minute tour
            </button>
            <button onClick={() => navigateTo('dashboard')} className="bg-white/10 text-white border border-white/30 rounded-lg px-5 py-3 font-semibold hover:bg-white/20 transition flex items-center gap-2 text-sm">
              Skip to dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/20 max-w-md">
            <Stat label="Initiatives" value="16" sub="across 6 pillars" />
            <Stat label="Capital" value="$30M" sub="annual portfolio" />
            <Stat label="Decisions/mo" value="12+" sub="exec trade-offs" />
          </div>
        </div>
      </section>

      {/* Active tour panel — appears when a tour is started */}
      {activeTour && <TourPanel tourId={activeTour} navigateTo={navigateTo} onClose={() => setActiveTour(null)} />}

      {/* SO WHAT — 3 outcome cards (not features) */}
      <section>
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">What changes for you</div>
          <h2 className="text-2xl font-serif font-bold text-sfnavy">Three outcomes, not three dashboards</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <OutcomeCard
            icon={Target}
            title="Decide faster"
            description="Decision engines turn raw data into Accelerate / Continue / Watch / Restructure / Sunset recommendations in seconds. Switch profiles to test the lens — Margin-First vs Innovation-First — and see how recommendations shift live."
          />
          <OutcomeCard
            icon={Shield}
            title="Govern with discipline"
            description="Stage-gate scorers, audit trails, a 7-playbook library, and a 33-term Data Glossary replace tribal knowledge with reusable standards. Every change is logged, every artifact has a lifecycle, every term has a canonical definition."
          />
          <OutcomeCard
            icon={MessageCircle}
            title="Communicate without friction"
            description="The Workbench drafts exec updates, sponsor briefs, escalations, launches, and CFO memos. AI auto-fills sections from the underlying data — so you stop re-typing the same KPIs every Friday."
          />
        </div>
      </section>

      {/* THE NARRATIVE ARC — initiative as a story */}
      <section className="card">
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">The narrative</div>
          <h2 className="text-2xl font-serif font-bold text-sfnavy">An initiative’s journey, told in five jobs</h2>
          <p className="text-sm text-sfmuted mt-1">Every initiative has the same 5 jobs to be done. Each tab supports a specific job — click any to jump to it.</p>
        </div>
        <div className="space-y-4">
          <NarrativeStep num={1} tab="journey"   navigateTo={navigateTo} title="It starts as an idea" description="An exec has a hypothesis. Watch it move from G0 Concept to G5 Sustain — capital, risk, FTEs, KPIs, and dependencies all ripple as it advances." cta="Open Journey" />
          <NarrativeStep num={2} tab="decision"  navigateTo={navigateTo} title="It needs to be prioritized" description="RICE scores, capital optimizer, risk heatmap, scenario compare — the calculators that turn 'gut feel' into a defensible portfolio decision." cta="Open Decision Engine" />
          <NarrativeStep num={3} tab="kpi"       navigateTo={navigateTo} title="It has to compete for capital" description="The KPI Studio scores every initiative against your active KPIs and weights, then recommends Accelerate/Continue/Watch/Restructure/Sunset. Switch profiles to see the trade-offs." cta="Open KPI Studio" />
          <NarrativeStep num={4} tab="playbooks" navigateTo={navigateTo} title="It has to be governed" description="Foundational playbooks (intake, capacity, risk register, rebalance, sunset) plus a Source of Truth schema, Metric Catalog, Glossary, and Audit Trail." cta="Open Playbooks" />
          <NarrativeStep num={5} tab="workbench" navigateTo={navigateTo} title="It has to be communicated" description="Templates for exec updates, sponsor briefs, escalations, launches, CFO memos. AI auto-fills sections from the underlying data." cta="Open Workbench" />
        </div>
      </section>

      {/* TOUR SELECTOR */}
      <section>
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">Three depths</div>
          <h2 className="text-2xl font-serif font-bold text-sfnavy">Pick a tour</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TourCard duration="20 seconds" title="Just the so-what" description="3 stops. The minimum viable understanding for someone with no time." icon={Zap} onClick={() => setActiveTour('20s')} />
          <TourCard duration="2 minutes"   title="The narrative arc" description="5 stops. One initiative, end-to-end. Why each engine exists." icon={PlayCircle} onClick={() => setActiveTour('2m')} />
          <TourCard duration="5 minutes"   title="Deep dive"        description="8 stops. Every tab with one specific thing to look for." icon={BookOpen} onClick={() => setActiveTour('5m')} />
        </div>
      </section>

      {/* PRFAQ */}
      <section className="card">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-sflight" />
          <div>
            <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">PRFAQ</div>
            <h2 className="text-xl font-serif font-bold text-sfnavy">Why this exists, in press-release form</h2>
          </div>
        </div>
        <PRFAQ faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
      </section>

      {/* WHAT'S ON EACH TAB */}
      <section className="card">
        <h2 className="text-lg font-serif font-bold text-sfnavy mb-1">What's on each tab</h2>
        <p className="text-xs text-sfmuted mb-4">Quick reference — click any to jump.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TAB_REFERENCE.map(t => (
            <button key={t.id} onClick={() => navigateTo(t.id)} className="text-left bg-sfbg border border-slate-200 rounded-lg p-3 hover:border-sfblue/40 hover:bg-white transition group">
              <div className="flex items-center gap-2">
                <span className="text-base">{t.icon}</span>
                <span className="font-semibold text-sfnavy text-sm">{t.label}</span>
                <ArrowRight className="w-3 h-3 text-sfblue ml-auto opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-xs text-sfmuted mt-1 leading-relaxed">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
