import React, { useState } from 'react';
import { LayoutDashboard, Bot, Database, Hammer, Sparkles, Calculator, Users, BookOpen } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import DecisionEngine from './components/DecisionEngine.jsx';
import Playbooks from './components/Playbooks.jsx';
import TeamCockpit from './components/TeamCockpit.jsx';
import PortfolioCopilot from './components/PortfolioCopilot.jsx';
import DataModel from './components/DataModel.jsx';
import HowIBuilt from './components/HowIBuilt.jsx';

const TABS = [
  { id: 'dashboard', label: 'Portfolio Dashboard', icon: LayoutDashboard },
  { id: 'decision',  label: 'Decision Engine',     icon: Calculator },
  { id: 'playbooks', label: 'Playbooks',           icon: BookOpen },
  { id: 'team',      label: 'Team Cockpit',        icon: Users },
  { id: 'copilot',   label: 'PortfolioCopilot',    icon: Bot },
  { id: 'data',      label: 'Data Model',          icon: Database },
  { id: 'how',       label: 'How I Built This',    icon: Hammer }
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

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
            <p className="text-xs text-white/60">A single pane of glass for</p>
            <p className="text-xs text-white font-medium">portfolio leaders managing initiatives across pillars</p>
          </div>
        </div>
        <nav className="max-w-[1400px] mx-auto px-6 flex gap-1">
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
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'decision'  && <DecisionEngine />}
        {tab === 'playbooks' && <Playbooks />}
        {tab === 'team'      && <TeamCockpit />}
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
    </div>
  );
}
