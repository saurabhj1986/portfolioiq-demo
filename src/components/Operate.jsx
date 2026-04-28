import React from 'react';
import { BookOpen, Users, PenSquare } from 'lucide-react';
import Playbooks from './Playbooks.jsx';
import TeamCockpit from './TeamCockpit.jsx';
import Workbench from './Workbench.jsx';

const SUB_TABS = [
  { id: 'playbooks', label: 'Playbooks',     icon: BookOpen,   desc: '7 standardized playbooks Pillar PMs pull from' },
  { id: 'team',      label: 'Team Cockpit',  icon: Users,      desc: '4 direct reports with AI coaching' },
  { id: 'workbench', label: 'Workbench',     icon: PenSquare,  desc: 'Comms drafted for Director review' }
];

export default function Operate({ sub, setSub }) {
  return (
    <div className="space-y-4">
      {/* Sub-tab nav */}
      <div className="bg-white rounded-xl shadow-card p-3">
        <div className="flex flex-wrap gap-2">
          {SUB_TABS.map(t => {
            const Icon = t.icon;
            const active = t.id === sub;
            return (
              <button
                key={t.id}
                onClick={() => setSub(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-sfnavy text-white' : 'text-sfnavy hover:bg-sfbg'}`}
                title={t.desc}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {sub === 'playbooks' && <Playbooks />}
      {sub === 'team'      && <TeamCockpit />}
      {sub === 'workbench' && <Workbench />}
    </div>
  );
}
