import React, { useState } from 'react';
import {
  Compass, PlayCircle, ArrowRight, ChevronDown, Calculator,
  Briefcase, Bot, Database, Hammer, LayoutDashboard, Lock, User,
  AlertCircle, Workflow, TrendingUp
} from 'lucide-react';

// =================== PERSONA QUICK-START HINT ===================
const PERSONA_FRAMING = {
  'sr-manager':       { quickStartHint: 'Start with the 2-min tour to see the full operating loop end-to-end.' },
  'director':         { quickStartHint: 'Start with the Dashboard\'s "Decisions needed this week".' },
  'pillar-pm-dap':    { quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.' },
  'pillar-pm-ts':     { quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.' },
  'pillar-pm-fe':     { quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.' },
  'pillar-pm-etr':    { quickStartHint: 'Start with the Dashboard — your pillar\'s initiatives are filtered automatically.' },
  'sponsor':          { quickStartHint: 'Start with the Dashboard for the leadership scan.' },
  'finance-partner':  { quickStartHint: 'Start with the Dashboard KPI strip (Capital + VaR), then Decisions → Investment Framework.' }
};

// =================== TAB GUIDE CONTENT ===================
const TAB_GUIDES = [
  {
    id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, ord: '01',
    purpose: 'The 20-second leadership scan: what\'s red, what\'s blocked, what\'s the portfolio shape.'
  },
  {
    id: 'guide', label: 'Guide (this tab)', icon: Compass, ord: '02',
    purpose: 'You are here. Orientation only.'
  },
  {
    id: 'journey', label: 'Journey', icon: PlayCircle, ord: '03',
    purpose: 'Watch one initiative move G0→G5. See how each stage ripples through KPIs, capital, risk, FTE.'
  },
  {
    id: 'decisions', label: 'Decisions', icon: Calculator, ord: '04',
    purpose: 'Analysis tools. Calculators turn data into draft trade-offs for stakeholder review.'
  },
  {
    id: 'operate', label: 'Operate', icon: Briefcase, ord: '05',
    purpose: 'The daily workspace: standardized playbooks, PPM customer desk, and comms drafting.'
  },
  {
    id: 'agents', label: 'Agents', icon: Bot, ord: '06',
    purpose: '12 niche agents on Agentforce — automate the routine governance and comms work.'
  },
  {
    id: 'data', label: 'Source of Truth', icon: Database, ord: '07',
    purpose: 'The authoritative reference: schema, metric catalog, glossary, audit trail, AI copilot.'
  },
  {
    id: 'about', label: 'About', icon: Hammer, ord: '08',
    purpose: 'The strategic story: how this came together, how it scales to production, how it becomes a product.'
  }
];

// =================== FAQs (slim) ===================
const FAQS = [
  { q: 'Why does the workspace adapt to persona?',
    a: 'RBAC simulation. In production, persona derives from your identity provider (Okta). Switch personas in the top-right to see how the experience reshapes for Director, Pillar PM, Sponsor, or Finance Partner.' },
  { q: 'Is this connected to real systems?',
    a: 'No — all data is mock. Schema is production-quality so the path to real is one connector per source system (Airtable, Linear, Tableau, Slack).' },
  { q: 'Can I switch back to the default view?',
    a: 'Yes — persona dropdown in the top-right. First entry is "Strategic Portfolio Ops Mgr · Lead" (default, full view).' },
  { q: 'How do I reset the demo?',
    a: 'Refresh the page. State resets to defaults: default persona, Dashboard tab, no active tour.' }
];

// =================== UI COMPONENTS ===================
function Kicker({ ord, label }) {
  return (
    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">{ord}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">·</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold">{label}</span>
    </div>
  );
}

function QuickStartCard({ icon: Icon, label, sub, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl p-4 transition-all border ${primary ? 'bg-sflight/15 border-sflight/40 hover:bg-sflight/20' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg grid place-items-center ${primary ? 'bg-sflight text-sfnavy' : 'bg-sflight/15 text-sflight'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-serif font-bold ${primary ? 'text-sflight' : 'text-white'}`}>{label}</span>
      </div>
      <p className="text-xs text-sfmuted leading-relaxed">{sub}</p>
      <span className={`text-xs mt-3 inline-flex items-center gap-1 font-semibold ${primary ? 'text-sflight' : 'text-white/80'}`}>
        Go <ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
}

function TabRow({ guide, navigateTo }) {
  const Icon = guide.icon;
  const isCurrentTab = guide.id === 'guide';
  return (
    <button
      onClick={() => !isCurrentTab && navigateTo(guide.id)}
      disabled={isCurrentTab}
      className={`w-full text-left rounded-xl border p-3 flex items-start gap-3 transition ${isCurrentTab ? 'bg-sflight/10 border-sflight/30 cursor-default' : 'bg-white/5 border-white/15 hover:bg-white/[0.08] hover:border-white/25'}`}
    >
      <div className={`w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 ${isCurrentTab ? 'bg-sflight/20' : 'bg-sflight/15'}`}>
        <Icon className="w-4.5 h-4.5 text-sflight" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-sfmuted">{guide.ord}</span>
          <span className="font-serif font-bold text-white text-sm">{guide.label}</span>
          {isCurrentTab && <span className="pill pill-blue text-[10px]">YOU ARE HERE</span>}
        </div>
        <p className="text-xs text-white/75 mt-1 leading-relaxed">{guide.purpose}</p>
      </div>
      {!isCurrentTab && <ArrowRight className="w-4 h-4 text-white/50 flex-shrink-0 mt-2.5" />}
    </button>
  );
}

// =================== MAIN ===================
export default function Guide({ navigateTo, onStartTour, persona }) {
  const personaId = persona?.id || 'sr-manager';
  const framing = PERSONA_FRAMING[personaId] || PERSONA_FRAMING['sr-manager'];

  // Filter tabs by persona's RBAC
  const visibleTabGuides = TAB_GUIDES.filter(g => g.id === 'guide' || !persona?.hideTabs?.includes(g.id));

  // Quick start cards — filter by tab visibility
  const allQuickStart = [
    { id: 'tour', icon: PlayCircle, label: 'Take the 2-min tour',
      sub: 'Five stops walking through the demo\'s narrative arc. Floating tour bar auto-navigates between tabs.',
      action: () => onStartTour('2m'), primary: true, requiresTab: null },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Jump to Dashboard',
      sub: 'The 20-second leadership scan: red items, cross-pillar blockers, 6 KPIs, stage-gate pipeline.',
      action: () => navigateTo('dashboard'), primary: false, requiresTab: 'dashboard' },
    { id: 'about', icon: Hammer, label: 'Read the About tab',
      sub: 'The strategic story: how this came together, the 12-month path to production, productization plan.',
      action: () => navigateTo('about'), primary: false, requiresTab: 'about' }
  ];
  const visibleQuickStart = allQuickStart.filter(q => !q.requiresTab || !persona?.hideTabs?.includes(q.requiresTab)).slice(0, 3);

  return (
    <div className="space-y-8 max-w-[900px]">

      {/* HERO — short and direct */}
      <header>
        <Kicker ord="Guide" label="Orientation" />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight tracking-tight">A 60-second orientation.</h1>
        <p className="text-base text-white/75 mt-3 leading-relaxed">
          Why this exists · where to start · what's in each tab. Switch personas (top-right) to see how the workspace reshapes. The full strategic story lives in the About tab.
        </p>
      </header>

      {/* PERSONA BANNER — only when viewing as something other than default */}
      {persona && persona.id !== 'sr-manager' && (
        <div className="rounded-lg bg-sflight/10 border border-sflight/30 px-4 py-3 flex items-start gap-3">
          <User className="w-4 h-4 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="text-[10px] uppercase tracking-widest text-sflight font-bold">Viewing as · {persona.role}</span>
            <span className="text-white/85 ml-2">{persona.desc}</span>
          </div>
          {persona.hideTabs.length > 0 && (
            <span className="text-[10px] text-white/50 font-mono whitespace-nowrap">
              <Lock className="w-3 h-3 inline mr-0.5" />Hidden: {persona.hideTabs.join(' · ')}
            </span>
          )}
        </div>
      )}

      {/* 01 · WHY THIS WAS CREATED — Business Problem / Action / Value Derived */}
      <section>
        <Kicker ord="01" label="Why this was created" />
        <h2 className="text-lg font-serif font-bold text-white mb-3">Business problem · Action · Value derived</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-300" />
              <span className="text-[10px] uppercase tracking-widest text-red-300 font-bold">Business problem</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              ~250 initiatives, 7 PPMs, 4 critical tools (<strong>Airtable · Linear · Tableau · Slack</strong>) — but data definitions drift, dashboards disagree, intake is inconsistent. PPMs don't trust the numbers; leadership can't decide.
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Workflow className="w-4 h-4 text-amber-300" />
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">Action</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              Built one operating workspace: <strong>data foundation</strong> (schema, lineage, audit) + <strong>tooling support desk</strong> (one Slack intake, SLAs) + <strong>dashboard catalog</strong> (trusted Tableau views) + <strong>agent fabric</strong> (governance + comms automation) + persona-aware lenses for PPM / Finance / Director / Sponsor.
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Value derived</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              <strong>~18 hrs/wk reclaimed per PPM</strong>. Tooling TTR <strong>3d → 4h</strong>. Data trust <strong>72% → 94%</strong>. Dashboard refresh failures <strong>14% → 0%</strong>. Time-tracking adoption <strong>61% → 92%</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 02 · QUICK START */}
      <section>
        <Kicker ord="02" label="Quick start" />
        <h2 className="text-lg font-serif font-bold text-white mb-1">Where to start</h2>
        <p className="text-sm text-sfmuted mb-3">{framing.quickStartHint}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visibleQuickStart.map(q => (
            <QuickStartCard key={q.id} icon={q.icon} label={q.label} sub={q.sub} onClick={q.action} primary={q.primary} />
          ))}
        </div>
      </section>

      {/* 03 · TAB GUIDE */}
      <section>
        <Kicker ord="03" label="What's in each tab" />
        <h2 className="text-lg font-serif font-bold text-white mb-3">{visibleTabGuides.length} tabs · one purpose each</h2>
        <div className="space-y-2">
          {visibleTabGuides.map(g => <TabRow key={g.id} guide={g} navigateTo={navigateTo} />)}
        </div>
      </section>

      {/* 04 · FAQ — slim */}
      <section>
        <Kicker ord="04" label="FAQ" />
        <h2 className="text-lg font-serif font-bold text-white mb-3">A few common questions</h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <details key={i} className="rounded-lg bg-white/5 border border-white/15 p-3 text-sm cursor-pointer">
              <summary className="font-semibold text-white">{f.q}</summary>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
