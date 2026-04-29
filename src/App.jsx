import React, { useState } from 'react';
import { LayoutDashboard, Database, Hammer, Sparkles, Calculator, PlayCircle, Briefcase, Bot, Compass } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import Guide from './components/Guide.jsx';
import PortfolioJourney from './components/PortfolioJourney.jsx';
import DecisionEngine from './components/DecisionEngine.jsx';
import Operate from './components/Operate.jsx';
import Agents from './components/Agents.jsx';
import DataModel from './components/DataModel.jsx';
import HowIBuilt from './components/HowIBuilt.jsx';
import TourBar from './components/TourBar.jsx';
import PersonaSwitcher from './components/PersonaSwitcher.jsx';
import { TOURS } from './data/tours.js';
import { PERSONAS, getPersona } from './data/personas.js';

const TABS = [
  { id: 'guide',     label: 'Guide',           icon: Compass },
  { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'journey',   label: 'Journey',         icon: PlayCircle },
  { id: 'decisions', label: 'Decisions',       icon: Calculator },
  { id: 'operate',   label: 'Operate',         icon: Briefcase },
  { id: 'agents',    label: 'Agents',          icon: Bot },
  { id: 'data',      label: 'Source of Truth', icon: Database },
  { id: 'about',     label: 'About',           icon: Hammer }
];

export default function App() {
  const [tab, setTab] = useState('guide');
  const [activeTour, setActiveTour] = useState(null);
  const [tourStep, setTourStep] = useState(0);
  const [personaId, setPersonaId] = useState('sr-manager');
  const persona = getPersona(personaId);

  // Sub-tab state for parents that have sub-tabs
  const [decisionsSub, setDecisionsSub] = useState('rice');
  const [operateSub, setOperateSub]     = useState('playbooks');
  const [dataSub, setDataSub]           = useState('schema');

  // Filter tabs based on current persona's RBAC
  const visibleTabs = TABS.filter(t => !persona.hideTabs.includes(t.id));

  // If user is on a hidden tab after persona switch, jump back to dashboard
  React.useEffect(() => {
    if (persona.hideTabs.includes(tab)) setTab('dashboard');
  }, [persona.hideTabs, tab]);

  const startTour = (tourId) => {
    setActiveTour(tourId);
    setTourStep(0);
  };

  const goToStep = (idx) => {
    if (!activeTour) return;
    const tour = TOURS[activeTour];
    if (idx < 0 || idx >= tour.steps.length) return;
    const step = tour.steps[idx];
    setTourStep(idx);
    if (!persona.hideTabs.includes(step.tab)) {
      setTab(step.tab);
      if (step.sub) {
        if (step.tab === 'decisions') setDecisionsSub(step.sub);
        if (step.tab === 'operate')   setOperateSub(step.sub);
        if (step.tab === 'data')      setDataSub(step.sub);
      }
    }
  };

  const exitTour = () => {
    setActiveTour(null);
    setTourStep(0);
    setTab('dashboard');
  };

  const backToTourList = () => setTab('dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-sfnavy text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sflight/20 grid place-items-center">
              <Sparkles className="w-5 h-5 text-sflight" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold tracking-tight">PortfolioIQ</h1>
              <p className="text-xs text-white/60">Strategic Portfolio Intelligence</p>
            </div>
          </div>
          <PersonaSwitcher persona={persona} onChange={(p) => setPersonaId(p.id)} />
        </div>
        <nav className="max-w-[1400px] mx-auto px-6 flex gap-1 flex-wrap">
          {visibleTabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`tab-btn flex items-center gap-2 ${active ? 'tab-btn-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6 pb-32">
        {tab === 'dashboard' && (
          <Dashboard
            navigateTo={setTab}
            activeTour={activeTour}
            tourStep={tourStep}
            onStartTour={startTour}
            onCloseTour={exitTour}
            onGoToStep={goToStep}
            persona={persona}
          />
        )}
        {tab === 'guide'     && <Guide navigateTo={setTab} onStartTour={startTour} persona={persona} />}
        {tab === 'journey'   && <PortfolioJourney />}
        {tab === 'decisions' && <DecisionEngine sub={decisionsSub} setSub={setDecisionsSub} persona={persona} />}
        {tab === 'operate'   && <Operate sub={operateSub} setSub={setOperateSub} persona={persona} />}
        {tab === 'agents'    && <Agents />}
        {tab === 'data'      && <DataModel sub={dataSub} setSub={setDataSub} persona={persona} />}
        {tab === 'about'     && <HowIBuilt />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between text-xs text-sfmuted flex-wrap gap-2">
          <span>All mock data · No real systems connected · For demonstration purposes</span>
          <span className="text-white/40">RBAC simulated · in production, persona derives from identity provider</span>
        </div>
      </footer>

      {/* Persistent Tour Bar */}
      <TourBar
        tour={activeTour ? TOURS[activeTour] : null}
        step={tourStep}
        currentTab={tab}
        onPrev={() => goToStep(tourStep - 1)}
        onNext={() => goToStep(tourStep + 1)}
        onExit={exitTour}
        onBackToList={backToTourList}
      />
    </div>
  );
}
