import React, { useState } from 'react';
import {
  Users, Calendar, AlertCircle, Sparkles, MessageSquare, Zap,
  CheckCircle2, ArrowUpRight, Clock, Mail, ChevronDown
} from 'lucide-react';
import { DIRECT_REPORTS, COACHING_FEED, AUTOMATIONS } from '../data/teamData.js';
import { fmtMoney } from '../data/portfolioData.js';

const SEVERITY_META = {
  urgent:  { color: 'sred',     bg: 'bg-red-50',     border: 'border-red-200',     label: 'Urgent' },
  medium:  { color: 'syellow',  bg: 'bg-orange-50',  border: 'border-orange-200',  label: 'Medium' },
  low:     { color: 'sfblue',   bg: 'bg-sky-50',     border: 'border-sky-200',     label: 'Low' }
};

function PMCard({ pm, onSelect, isSelected }) {
  const healthColor = pm.health.onTrackPct >= 80 ? 'text-sgreen' : pm.health.onTrackPct >= 60 ? 'text-syellow' : 'text-sred';
  const slipColor = pm.health.lastReviewSlippage >= 14 ? 'text-sred' : pm.health.lastReviewSlippage >= 7 ? 'text-syellow' : 'text-sgreen';
  return (
    <button onClick={() => onSelect(pm.id)} className={`text-left card card-hover ${isSelected ? 'ring-2 ring-sfblue' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${pm.avatarColor} text-white grid place-items-center font-bold text-sm flex-shrink-0`}>
          {pm.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sfnavy truncate">{pm.name}</div>
          <div className="text-[11px] text-sfmuted truncate">{pm.role}</div>
          <div className="text-[11px] text-sfmuted truncate">{pm.pillarName}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-sfbg rounded p-1.5">
          <div className="text-[10px] text-sfmuted uppercase">Initiatives</div>
          <div className="font-serif font-bold text-sfnavy text-lg">{pm.workload.initiatives}</div>
        </div>
        <div className="bg-sfbg rounded p-1.5">
          <div className="text-[10px] text-sfmuted uppercase">Budget</div>
          <div className="font-serif font-bold text-sfnavy text-sm">{fmtMoney(pm.workload.budget)}</div>
        </div>
        <div className="bg-sfbg rounded p-1.5">
          <div className="text-[10px] text-sfmuted uppercase">FTE</div>
          <div className="font-serif font-bold text-sfnavy text-lg">{pm.workload.fte}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="text-xs">
          <span className="text-sfmuted">Health: </span>
          <span className={`font-semibold ${healthColor}`}>{pm.health.onTrackPct}%</span>
        </div>
        <div className="text-xs">
          <span className="text-sfmuted">Last 1:1: </span>
          <span className={`font-semibold ${slipColor}`}>{pm.health.lastReviewSlippage}d ago</span>
        </div>
      </div>
      {pm.workload.atRisk > 0 && (
        <div className="mt-2 text-[11px] text-sred font-semibold flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {pm.workload.atRisk} initiative at risk
        </div>
      )}
    </button>
  );
}

function PMDetail({ pm }) {
  const [draftOpen, setDraftOpen] = useState(false);
  const insightTone = (t) => t === 'risk' ? 'border-sred bg-red-50 text-sred'
                          : t === 'positive' ? 'border-sgreen bg-emerald-50 text-sgreen'
                          : t === 'growth'   ? 'border-sfblue bg-sky-50 text-sfblue'
                                              : 'border-syellow bg-orange-50 text-syellow';
  const insightLabel = (t) => ({ risk: 'RISK', positive: 'STRENGTH', growth: 'GROWTH', note: 'NOTE' }[t] || t.toUpperCase());

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full ${pm.avatarColor} text-white grid place-items-center font-bold text-lg`}>
            {pm.avatar}
          </div>
          <div>
            <h3 className="font-serif font-bold text-sfnavy text-lg">{pm.name}</h3>
            <div className="text-sm text-sfmuted">{pm.role} · {pm.pillarName}</div>
            <div className="text-xs text-sfmuted">Tenure {pm.tenure} · Last 1:1 {pm.last1on1}</div>
          </div>
        </div>
        <button className="text-xs bg-sfblue text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-sfdeep">
          <Calendar className="w-3.5 h-3.5" /> Schedule 1:1
        </button>
      </div>

      {/* AI-generated insights */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-sflight" />
          <h4 className="text-sm font-semibold text-sfnavy">AI-detected insights</h4>
        </div>
        <div className="space-y-2">
          {pm.insights.map((ins, i) => (
            <div key={i} className={`border rounded-lg p-2.5 text-xs flex gap-2 ${insightTone(ins.type)}`}>
              <span className="font-bold text-[10px] tracking-wider mt-0.5">{insightLabel(ins.type)}</span>
              <span className="text-sfnavy">{ins.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-generated weekly brief */}
      <div className="mt-4 bg-sfnavy text-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-sflight" />
          <h4 className="text-sm font-semibold">AI Weekly Brief — auto-generated 1:1 prep</h4>
          <span className="ml-auto text-[10px] text-white/60 font-mono">friday 4pm pt</span>
        </div>
        <p className="text-sm leading-relaxed mb-3">{pm.weeklyBrief.tldr}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <BriefSection title="They need from you" items={pm.weeklyBrief.asks} tone="text-sflight" />
          <BriefSection title="Risks to discuss" items={pm.weeklyBrief.risks} tone="text-syellow" />
          <BriefSection title="Wins to celebrate" items={pm.weeklyBrief.celebrations} tone="text-sgreen" />
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-xs">
          <strong className="text-sflight">Coaching focus:</strong> <span className="text-white/80">{pm.coachingFocus}</span>
        </div>
      </div>
    </div>
  );
}

function BriefSection({ title, items, tone }) {
  return (
    <div>
      <div className={`text-[10px] uppercase font-semibold mb-1 ${tone}`}>{title}</div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1 text-white/90"><span className={tone}>•</span><span>{it}</span></li>
        ))}
      </ul>
    </div>
  );
}

function CoachingFeedItem({ item }) {
  const [draftOpen, setDraftOpen] = useState(false);
  const sev = SEVERITY_META[item.severity];
  const pm = DIRECT_REPORTS.find(p => p.id === item.pmId);
  return (
    <div className={`border-l-4 rounded-r-lg p-3 ${sev.bg} border-${sev.color}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${pm?.avatarColor} text-white grid place-items-center text-[10px] font-bold flex-shrink-0`}>
            {pm?.avatar}
          </div>
          <div>
            <div className="text-xs">
              <span className={`text-[10px] font-bold uppercase tracking-wider text-${sev.color}`}>{sev.label}</span>
              <span className="text-sfmuted"> · {pm?.name}</span>
            </div>
            <div className="text-sm font-semibold text-sfnavy">{item.title}</div>
          </div>
        </div>
      </div>
      <p className="text-xs text-sfnavy mt-2 leading-relaxed">{item.detail}</p>
      <div className="mt-2 text-xs">
        <strong className="text-sfnavy">Suggested action:</strong> <span className="text-sfmuted">{item.suggestedAction}</span>
      </div>
      {item.autoDraft && (
        <div className="mt-2">
          <button onClick={() => setDraftOpen(o => !o)} className="text-xs text-sfblue hover:underline flex items-center gap-1">
            <Mail className="w-3 h-3" /> {draftOpen ? 'Hide' : 'View'} auto-drafted message
            <ChevronDown className={`w-3 h-3 transition-transform ${draftOpen ? 'rotate-180' : ''}`} />
          </button>
          {draftOpen && (
            <div className="mt-2 bg-white border border-slate-200 rounded p-2.5 text-xs text-sfnavy leading-relaxed font-mono">
              {item.autoDraft}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeamCockpit() {
  const [selectedId, setSelectedId] = useState('PM-04'); // Renata — most urgent
  const selectedPM = DIRECT_REPORTS.find(p => p.id === selectedId);
  const urgentCount = COACHING_FEED.filter(c => c.severity === 'urgent').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Users className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-serif font-bold">Team Cockpit — 4 Portfolio Managers</h2>
            <p className="text-sm text-white/80 mt-1">AI surfaces coaching opportunities, drafts weekly 1:1 prep, automates routine notifications. Includes leave-coverage detection.</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-white/60">Urgent items</div>
            <div className="text-3xl font-serif font-bold text-sred">{urgentCount}</div>
          </div>
        </div>
      </div>

      {/* PM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {DIRECT_REPORTS.map(pm => (
          <PMCard key={pm.id} pm={pm} onSelect={setSelectedId} isSelected={pm.id === selectedId} />
        ))}
      </div>

      {/* Selected PM Detail */}
      {selectedPM && <PMDetail pm={selectedPM} />}

      {/* Coaching Feed + Automation Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-sflight" />
            <h3 className="text-base font-semibold text-sfnavy">AI Coaching Feed</h3>
            <span className="text-[10px] text-sfmuted ml-auto">Updated continuously from initiative + 1:1 + sentiment signals</span>
          </div>
          <p className="text-xs text-sfmuted mb-3">Auto-detected coaching opportunities across the team — ranked by severity. Each comes with a suggested action and, where useful, an auto-drafted message you can edit and send.</p>
          <div className="space-y-2">
            {COACHING_FEED.map(c => <CoachingFeedItem key={c.id} item={c} />)}
          </div>
        </div>

        {/* Automations */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-sflight" />
            <h3 className="text-base font-semibold text-sfnavy">Workflow Automations</h3>
          </div>
          <p className="text-xs text-sfmuted mb-3">Background jobs that catch the things humans drop. The Sr Manager doesn't manage these — they manage the exceptions.</p>
          <div className="space-y-3">
            {AUTOMATIONS.map(a => (
              <div key={a.id} className="bg-sfbg border border-slate-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-sfnavy leading-tight">{a.name}</div>
                  <span className={`pill ${a.enabled ? 'pill-green' : 'pill-gray'} flex-shrink-0`}>
                    <CheckCircle2 className="w-3 h-3" /> {a.enabled ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="text-[11px] text-sfmuted mt-2 space-y-0.5">
                  <div><strong className="text-sfnavy">When:</strong> {a.trigger}</div>
                  <div><strong className="text-sfnavy">Action:</strong> {a.action}</div>
                </div>
                <div className="text-[11px] text-sfmuted mt-2 italic leading-relaxed">{a.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JD mapping footer */}
      <div className="card bg-sfbg border-2 border-sfblue/20">
        <h4 className="text-sm font-semibold text-sfnavy mb-2 flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-sfblue" /> How this maps to JR337298
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-sfnavy">
          <div className="bg-white rounded p-2 border border-slate-200">
            <strong>"Build a collaborative teaming environment that champions creativity, innovation, and learning"</strong> — AI Coaching Feed surfaces growth opportunities (Aisha → Sr Director track), not just risks.
          </div>
          <div className="bg-white rounded p-2 border border-slate-200">
            <strong>People-leader role, 4 direct reports</strong> — Designed exactly for this team size. Workflow automations save ~30 min/week of 1:1 prep, which is real time at this scale.
          </div>
          <div className="bg-white rounded p-2 border border-slate-200">
            <strong>Hiring urgency: maternity leave coverage starting June</strong> — Detected automatically (C-02 in feed), with Aisha proposed as backfill based on capacity headroom + tenure.
          </div>
          <div className="bg-white rounded p-2 border border-slate-200">
            <strong>"Strong facilitation skills, ensuring teams continuously adapt"</strong> — Pattern detection (Renata's scope creep; Marcus's burnout signal) turns 1:1s into coaching, not status updates.
          </div>
        </div>
      </div>
    </div>
  );
}
