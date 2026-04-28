import React, { useState } from 'react';
import { LayoutDashboard, Bot, Database, Hammer, Sparkles, Calculator, Users, BookOpen, Settings, PlayCircle, PenSquare, Home } from 'lucide-react';
import Welcome from './components/Welcome.jsx';
import Dashboard from './components/Dashboard.jsx';
import PortfolioJourney from './components/PortfolioJourney.jsx';
import DecisionEngine from './components/DecisionEngine.jsx';
import KPIStudio from './components/KPIStudio.jsx';
import Playbooks from './components/Playbooks.jsx';
import TeamCockpit from './components/TeamCockpit.jsx';
import Workbench from './components/Workbench.jsx';
import PortfolioCopilot from './components/PortfolioCopilot.jsx';
import DataModel from './components/DataModel.jsx';
import HowIBuilt from './components/HowIBuilt.jsx';
import TourBar from './components/TourBar.jsx';
import { TOURS } from './data/tours.js';

const TABS = [
  { id: 'welcome',   label: 'Welcome',           icon: Home },
  { id: 'dashboard', label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'journey',   label: 'Journey',           icon: PlayCircle },
  { id: 'decision',  label: 'Decision Engine',   icon: Calculator },
  { id: 'kpi',       label: 'KPI Studio',        icon: Settings },
  { id: 'playbooks', label: 'Playbooks',         icon: BookOpen },
  { id: 'team',      label: 'Team Cockpit',      icon: Users },
  { id: 'workbench', label: 'Workbench',         icon: PenSquare },
  { id: 'copilot',   label: 'Copilot',           icon: Bot },
  { id: 'data',      label: 'Source of Truth',   icon: Database },
  { id: 'how',       label: 'How I Built This',  icon: Hammer }
];

export default function App() {
  const [tab, setTab] = useState('welcome');
  const [activeTour, setActiveTour] = useState(null); // tour id or null
  const [tourStep, setTourStep] = useState(0);

  const startTour = (tourId) => {
    setActiveTour(tourId);
    setTourStep(0);
    // First step navigation handled by user clicking step "Open" in panel,
    // OR optionally auto-jumping to first step. We'll keep them on Welcome
    // so they can see the step list, then click into step 1.
  };

  const goToStep = (idx) => {
    if (!activeTour) return;
    const tour = TOURS[activeTour];
    if (idx < 0 || idx >= tour.steps.length) return;
    setTourStep(idx);
    setTab(tour.steps[idx].tab);
  };

  const exitTour = () => {
    setActiveTour(null);
    setTourStep(0);
  };

  const backToTourList = () => {
    setTab('welcome');
    // keep activeTour set so the Welcome panel shows the steps
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-sfnavy text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sflight/20 grid place-items-center">
              <Sparkles className="w-5 h-5 text-sflight" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold tracking-tight">PortfolioIQ</h1>
              <p className="text-xs text-white/60">Strategic Portfolio Intelligence</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">A Senior Manager's operating workspace for</p>
            <p className="text-xs text-white font-medium">strategic portfolio management</p>
          </div>
        </div>
        <nav className="max-w-[1400px] mx-auto px-6 flex gap-1 flex-wrap">
          {TABS.map(t => {
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
        {tab === 'welcome'   && (
          <Welcome
            navigateTo={setTab}
            activeTour={activeTour}
            tourStep={tourStep}
            onStartTour={startTour}
            onCloseTour={exitTour}
            onGoToStep={goToStep}
          />
        )}
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'journey'   && <PortfolioJourney />}
        {tab === 'decision'  && <DecisionEngine />}
        {tab === 'kpi'       && <KPIStudio />}
        {tab === 'playbooks' && <Playbooks />}
        {tab === 'team'      && <TeamCockpit />}
        {tab === 'workbench' && <Workbench />}
        {tab === 'copilot'   && <PortfolioCopilot />}
        {tab === 'data'      && <DataModel />}
        {tab === 'how'       && <HowIBuilt />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between text-xs text-sfmuted flex-wrap gap-2">
          <span>All mock data · No real systems connected · For demonstration purposes</span>
        </div>
      </footer>

      {/* Persistent Tour Bar — appears across all tabs while a tour is active */}
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
