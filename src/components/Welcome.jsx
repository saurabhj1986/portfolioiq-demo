import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, ArrowRight, PlayCircle, Target, Shield, MessageCircle,
  ChevronDown, Lightbulb, X, Clock, Zap, BookOpen
} from 'lucide-react';
import { TOURS } from '../data/tours.js';

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
// (Imported from src/data/tours.js — shared with App.jsx for the persistent TourBar)

// =================== PRFAQ CONTENT ===================
const PRFAQ_FAQS = [
  { q: 'What does the Sr Manager own — and what does the Director own?',
    a: 'The Sr Manager owns the operating layer: process governance, the team of 4 Pillar PMs, the data layer (Source of Truth, Metric Catalog, Glossary), the cadences (intake, stage-gate review, rebalance, monthly review), and the comms drafts. The Director owns strategy, sponsor relationships, capital allocation authority, and final calls. This prototype reflects that boundary — every recommendation is framed as a draft for sponsor review, never a final decision.' },
  { q: 'Why a "Recommendation Engine" if the Sr Manager doesn\'t decide?',
    a: 'It generates a defensible draft. The Director will adjust based on context the data can\'t see (relationships, political signals, board-level priorities). A draft that takes 30 minutes to refine is more valuable than a blank page — and it shows the Sr Manager\'s thinking, which is what the Director is paying for.' },
  { q: 'Why all the playbooks?',
    a: 'So the Sr Manager builds reusable practice instead of personal heroics. Playbooks let the team scale beyond the Sr Manager\'s individual time, and let new team members onboard against shared standards instead of tribal knowledge. The 7 playbooks here cover the operational moments the role owns weekly: intake, stage-gate review, capacity planning, risk refresh, rebalance, monthly portfolio review, sunset.' },
  { q: 'How does this scale to coaching 4 direct reports?',
    a: 'The Team Cockpit auto-detects coaching opportunities (overdue 1:1s, leave-coverage gaps, growth signals, off-track-initiative pattern detection) so 1:1s become coaching conversations instead of status updates. AI-drafted weekly briefs free ~30 min/week per PM, which at 4 reports is two extra hours of actual coaching time per week.' },
  { q: 'What\'s outside this prototype\'s scope?',
    a: 'Org-level strategy, sponsor relationship-building, capital allocation authority, and external GTM — those belong to the Director and above. This is intentionally the operations layer. The boundary is sharp on purpose: a Sr Manager who tries to own strategy without being asked is annoying; a Sr Manager who owns operations rigorously is invaluable.' },
  { q: 'Why mock data?',
    a: 'To enable open exploration without compromising any organization\'s portfolio. The schema is designed so each table maps to a real connector (Anaplan for budget, ServiceNow for tickets, GUS for stage-gate artifacts). Real data is one connector per source system away.' },
  { q: 'What does this say about the Sr Manager who built it?',
    a: 'That they treat governance as a data-architecture problem with an adoption layer on top, that they instrument their own work, that they think in terms of equipping the people above them with decision-ready inputs rather than making decisions themselves, and that they ship working artifacts instead of decks.' }
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

function TourCard({ duration, title, description, onClick, icon: Icon, active, featured }) {
  return (
    <button
      onClick={onClick}
      className={`card card-hover text-left flex flex-col items-start group transition-all ${active ? 'ring-2 ring-sflight bg-sflight/5' : featured ? 'ring-2 ring-sflight/40' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg grid place-items-center ${active || featured ? 'bg-sflight text-white' : 'bg-sflight/15'}`}>
          <Icon className={`w-4 h-4 ${active || featured ? 'text-white' : 'text-sflight'}`} />
        </div>
        <span className="text-[11px] uppercase tracking-wider text-sflight font-bold">{duration}</span>
      </div>
      <h4 className="font-serif font-bold text-sfnavy">{title}</h4>
      <p className="text-xs text-sfmuted mt-1 leading-relaxed">{description}</p>
      <span className={`text-xs font-semibold mt-3 flex items-center gap-1 group-hover:gap-2 transition-all ${active ? 'text-sflight' : 'text-sfblue'}`}>
        {active ? '✓ Active — scroll down' : 'Start'} <ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
}

function TourPanel({ tourId, tourStep, onGoToStep, onClose }) {
  const tour = TOURS[tourId];
  return (
    <section className="card border-l-4 border-sflight bg-sflight/5 step-fade-in">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-sflight font-semibold">Active tour · {tour.steps.length} stops</div>
          <h3 className="text-lg font-serif font-bold text-sfnavy">{tour.label}</h3>
          <p className="text-xs text-sfmuted">{tour.description}</p>
        </div>
        <button onClick={onClose} className="text-xs text-sfmuted hover:text-sfnavy flex items-center gap-1">
          <X className="w-3 h-3" /> Close
        </button>
      </div>
      <div className="text-[11px] text-sfmuted mt-2 mb-3 italic">Click any step to jump there. The floating tour bar at the bottom of every tab will let you Prev/Next without coming back here.</div>
      <div className="space-y-2">
        {tour.steps.map((step, i) => {
          const isCurrent = i === tourStep;
          return (
            <div
              key={i}
              className={`p-3 rounded-lg border flex items-start gap-3 step-fade-in transition-all ${isCurrent ? 'bg-sflight/10 border-sflight ring-2 ring-sflight/40' : 'bg-white border-slate-200'}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold flex-shrink-0 ${isCurrent ? 'bg-sflight text-white ring-2 ring-sflight/30' : 'bg-sflight text-white'}`}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-sfnavy flex items-center gap-2">
                  {step.title}
                  {isCurrent && <span className="text-[10px] uppercase tracking-wider text-sflight font-bold">· current</span>}
                </div>
                <p className="text-xs text-sfblue mt-1"><strong>Look for:</strong> <span className="text-sfnavy font-normal">{step.lookFor}</span></p>
              </div>
              <button onClick={() => onGoToStep(i)} className={`text-xs rounded-lg px-3 py-1.5 font-medium flex-shrink-0 flex items-center gap-1 ${isCurrent ? 'bg-sfblue text-white hover:bg-sfdeep' : 'bg-sflight text-white hover:bg-sfblue'}`}>
                {isCurrent ? 'Re-open' : 'Open'} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PRFAQ({ faqOpen, setFaqOpen }) {
  return (
    <div>
      {/* Operating Notes — Sr Manager-scoped, replaces product launch framing */}
      <div className="bg-sfbg border border-slate-200 rounded-lg p-5">
        <div className="text-[10px] uppercase tracking-widest text-sfmuted font-semibold mb-2">Operating Notes · Senior Manager scope</div>
        <h3 className="text-2xl font-serif font-bold text-sfnavy leading-tight">How a Senior Manager runs strategic portfolio management</h3>
        <p className="italic text-sm text-sfmuted mt-2 leading-relaxed">A working description of the operating model: the standards, frameworks, cadences, and team rhythms a Senior Manager owns so the Director can focus on strategy and sponsor relationships.</p>

        <div className="mt-4 space-y-3 text-sm text-sfnavy leading-relaxed">
          <p>The Senior Manager of Strategic Portfolio Management is not the strategist. The Director is. The Sr Manager is the person who turns strategy into <em>observable, governed, repeatable practice</em> — and who builds the team that runs the practice without their constant presence.</p>

          <p>This prototype demonstrates that operating model. Each tab represents a job the role owns weekly:</p>

          <ul className="space-y-1 ml-4 text-sfnavy">
            <li>• Owning the master taxonomy, Metric Catalog, and Data Glossary so every report uses the same definitions</li>
            <li>• Running stage-gate reviews against an objective scorer so decisions are <em>discipline</em>, not <em>opinion</em></li>
            <li>• Preparing decision-ready inputs (capital scenarios, RICE rankings, risk exposures) so sponsor conversations produce decisions, not "let me think about it"</li>
            <li>• Coaching 4 Pillar PM direct reports through their own portfolios, with AI-detected coaching opportunities</li>
            <li>• Drafting the comms (sponsor briefs, escalations, monthly exec updates) so the Director's time is spent reviewing, not writing</li>
          </ul>

          <blockquote className="border-l-4 border-sflight pl-4 py-2 italic text-sfmuted bg-white rounded-r">
            "What I need from my Sr Manager isn't strategy. It's the discipline that lets me set strategy without worrying the day-to-day will fall apart."<br />
            <span className="text-xs not-italic">— target user, Sr Director of Portfolio Management</span>
          </blockquote>

          <p><strong className="text-sfnavy">The boundary is sharp on purpose.</strong> Every recommendation in this prototype is framed as a <em>draft for sponsor review</em>, never a final decision. The Decision Engine produces analysis, not verdicts. The KPI Studio drafts a recommendation, the sponsor refines it. The Workbench drafts the comms, the Director reviews and signs. This is the role the title actually describes.</p>

          <blockquote className="border-l-4 border-sgreen pl-4 py-2 italic text-sfmuted bg-white rounded-r">
            "A Sr Manager who tries to own strategy without being asked is annoying. A Sr Manager who owns operations rigorously is invaluable."<br />
            <span className="text-xs not-italic">— operating philosophy this prototype encodes</span>
          </blockquote>

          <p>Live at <a href="https://portfolioiq-demo.vercel.app" className="text-sfblue hover:underline" target="_blank" rel="noreferrer">portfolioiq-demo.vercel.app</a>. All data is mock. The schema, taxonomy, frameworks, and AI patterns are designed to lift into production with minimal change.</p>
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
export default function Welcome({ navigateTo, activeTour, tourStep, onStartTour, onCloseTour, onGoToStep }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const [prfaqOpen, setPrfaqOpen] = useState(false);
  const tourRef = useRef(null);

  // When a tour starts, scroll the panel into view (works whether triggered from
  // the hero CTAs at top or the tour cards further down).
  useEffect(() => {
    if (activeTour && tourRef.current) {
      tourRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTour]);

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
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.05]">Operate the portfolio. Equip the leaders.</h1>
          <p className="text-base text-white/90 mt-3 leading-relaxed">
            A Sr Manager's workspace for portfolio <strong className="text-sflight">governance</strong>, <strong className="text-sflight">decision support</strong>, <strong className="text-sflight">team coaching</strong>, and <strong className="text-sflight">comms drafting</strong> — so Directors can focus on strategy.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => onStartTour('2m')} className="bg-sflight text-white rounded-lg px-5 py-3 font-semibold hover:bg-sfblue transition flex items-center gap-2 text-sm shadow-lg ring-2 ring-white/30">
              <PlayCircle className="w-4 h-4" /> Start 2-minute tour
              <span className="text-[10px] bg-white text-sflight rounded px-1.5 py-0.5 font-bold ml-1">BEST FOR DEMOS</span>
            </button>
            <button onClick={() => onStartTour('20s')} className="bg-white/10 text-white border border-white/30 rounded-lg px-5 py-3 font-semibold hover:bg-white/20 transition flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" /> 20-second scan
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

      {/* SO WHAT — 3 outcome cards (not features) */}
      <section>
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">Three jobs the Sr Manager owns</div>
          <h2 className="text-2xl font-serif font-bold text-sfnavy">Three outcomes, not three dashboards</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <OutcomeCard icon={Shield}         title="Run governance like clockwork"           description="Stage-gate scorers, audit trails, 7 playbooks, 33-term glossary." />
          <OutcomeCard icon={Target}         title="Equip leaders with decision-ready inputs" description="RICE, capital optimizer, risk heatmap, scenarios. Drafts for sponsor review." />
          <OutcomeCard icon={MessageCircle}  title="Own the comms heartbeat"                  description="8 templates with AI auto-draft. Director reviews, doesn't write." />
        </div>
      </section>

      {/* THE NARRATIVE ARC — initiative as a story (one line per step) */}
      <section className="card">
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">The narrative</div>
          <h2 className="text-2xl font-serif font-bold text-sfnavy">Every initiative passes through 5 Sr Manager touchpoints</h2>
        </div>
        <div className="space-y-3">
          <NarrativeStep num={1} tab="journey"   navigateTo={navigateTo} title="Triage it"            description="Run intake. Watch G0→G5 ripples in Journey." cta="Journey" />
          <NarrativeStep num={2} tab="decision"  navigateTo={navigateTo} title="Assess it"            description="RICE, Capital Optimizer, Risk Heatmap, Scenarios — prepare the analysis." cta="Decision Engine" />
          <NarrativeStep num={3} tab="kpi"       navigateTo={navigateTo} title="Draft a recommendation" description="Accelerate / Continue / Watch / Restructure / Sunset. The sponsor decides." cta="KPI Studio" />
          <NarrativeStep num={4} tab="playbooks" navigateTo={navigateTo} title="Govern it"            description="Apply the playbook. Log to audit trail. Reference Source of Truth." cta="Playbooks" />
          <NarrativeStep num={5} tab="workbench" navigateTo={navigateTo} title="Report it"            description="Draft sponsor briefs, exec updates, escalations. Director reviews." cta="Workbench" />
        </div>
      </section>

      {/* TOUR SELECTOR — 2-min is featured */}
      <section>
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">Pick a tour</div>
          <h2 className="text-2xl font-serif font-bold text-sfnavy">Three depths — start with 2-min for a demo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TourCard duration="2 min · BEST FOR DEMOS" title="The narrative arc"  description="5 stops. One initiative, end-to-end."             icon={PlayCircle} onClick={() => onStartTour('2m')}  active={activeTour === '2m'} featured />
          <TourCard duration="20 sec"                title="Just the so-what"   description="3 stops. The minimum viable understanding."      icon={Zap}        onClick={() => onStartTour('20s')} active={activeTour === '20s'} />
          <TourCard duration="5 min"                 title="Deep dive"          description="8 stops. Every tab, one thing to look for."     icon={BookOpen}   onClick={() => onStartTour('5m')}  active={activeTour === '5m'} />
        </div>
      </section>

      {/* Active tour panel — anchored here so clicks from tour cards or hero CTAs scroll into view */}
      <div ref={tourRef}>
        {activeTour && <TourPanel tourId={activeTour} tourStep={tourStep} onGoToStep={onGoToStep} onClose={onCloseTour} />}
      </div>

      {/* PRFAQ — collapsed by default; expand only if the viewer wants depth */}
      <section className="card">
        <button onClick={() => setPrfaqOpen(o => !o)} className="w-full flex items-center gap-2 text-left">
          <Lightbulb className="w-5 h-5 text-sflight flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-widest text-sflight font-bold">PRFAQ · operating notes</div>
            <h2 className="text-base font-serif font-bold text-sfnavy">The operating model in press-release form</h2>
          </div>
          <span className="text-xs text-sfmuted flex items-center gap-1">{prfaqOpen ? 'Hide' : 'Read'} <ChevronDown className={`w-4 h-4 transition-transform ${prfaqOpen ? 'rotate-180' : ''}`} /></span>
        </button>
        {prfaqOpen && (
          <div className="mt-4">
            <PRFAQ faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
          </div>
        )}
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
