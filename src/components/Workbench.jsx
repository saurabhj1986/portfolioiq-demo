import React, { useState } from 'react';
import {
  PenSquare, Send, Mail, Users, FileText, Sparkles, ChevronDown, Eye,
  Clock, CheckCircle2, AlertCircle, MessageCircle, BarChart3, Edit3, Plus
} from 'lucide-react';
import { MESSAGE_TEMPLATES, DISTRIBUTION_LISTS, ACTIVE_DRAFTS, RECENT_SENDS, STATUS_META } from '../data/workbenchData.js';

// ---------- TEMPLATE LIBRARY ----------
function TemplateCard({ template, onCompose, onPreview }) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center text-lg">{template.icon}</div>
          <div>
            <h3 className="font-serif font-semibold text-sfnavy text-sm">{template.name}</h3>
            <div className="text-[11px] text-sfmuted">{template.audience} · {template.cadence}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-sfmuted mb-3">
        <Clock className="w-3 h-3" /> {template.estimatedTime}
      </div>
      <div className="bg-sfbg border border-slate-200 rounded p-2 text-xs text-sfnavy mb-2">
        <strong className="text-sfblue">{template.structure.length} sections:</strong> {template.structure.map(s => s.name).join(' · ')}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-sfmuted mb-3 leading-relaxed">
        <Sparkles className="w-3 h-3 text-sflight flex-shrink-0" />
        <span><strong className="text-sfblue">AI assist:</strong> {template.aiAssist}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onCompose(template.id)} className="flex-1 bg-sfblue text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-sfdeep flex items-center justify-center gap-1.5">
          <Edit3 className="w-3 h-3" /> Compose
        </button>
        <button onClick={() => onPreview(template.id)} className="flex-1 bg-sfbg text-sfnavy rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-slate-200 flex items-center justify-center gap-1.5">
          <Eye className="w-3 h-3" /> Preview
        </button>
      </div>
    </div>
  );
}

function TemplateLibrary({ onCompose, onPreview }) {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <h3 className="text-base font-serif font-bold">Message Templates</h3>
        <p className="text-sm text-white/80 mt-1">
          {MESSAGE_TEMPLATES.length} pre-structured templates for the portfolio communications a Sr Manager owns. Pick a template, fill in the structure, ship the message. AI assist pulls the underlying numbers from PortfolioIQ so you stop re-typing the same KPIs every time.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MESSAGE_TEMPLATES.map(t => <TemplateCard key={t.id} template={t} onCompose={onCompose} onPreview={onPreview} />)}
      </div>
    </div>
  );
}

// ---------- COMPOSER ----------
function Composer({ templateId, onClose }) {
  const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
  const [content, setContent] = useState(() => {
    const initial = {};
    template.structure.forEach(s => { initial[s.name] = ''; });
    return initial;
  });
  const [aiBusy, setAiBusy] = useState(false);
  const [audience, setAudience] = useState(DISTRIBUTION_LISTS[0].id);

  const filledCount = Object.values(content).filter(v => v.trim().length > 0).length;
  const completeness = Math.round((filledCount / template.structure.length) * 100);

  const generateAI = () => {
    setAiBusy(true);
    setTimeout(() => {
      // Simulate AI fill from PortfolioIQ data
      const filled = {};
      template.structure.forEach(s => { filled[s.name] = `[Auto-filled: ${s.guidance}]`; });
      setContent(filled);
      setAiBusy(false);
    }, 1200);
  };

  const dl = DISTRIBUTION_LISTS.find(d => d.id === audience);

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center text-lg">{template.icon}</div>
          <div>
            <h3 className="font-serif font-bold text-sfnavy">{template.name}</h3>
            <div className="text-[11px] text-sfmuted">{template.audience} · {template.cadence}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={generateAI} disabled={aiBusy} className="bg-sflight text-white rounded-lg px-3 py-1.5 font-medium hover:bg-sfblue disabled:opacity-60 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> {aiBusy ? 'Drafting…' : 'AI auto-draft'}
          </button>
          <button onClick={onClose} className="bg-sfbg text-sfnavy rounded-lg px-3 py-1.5 hover:bg-slate-200">← Templates</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {template.structure.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-baseline justify-between mb-1">
                <h4 className="font-serif font-semibold text-sfnavy text-sm">{s.name}</h4>
                <span className="text-[10px] text-sfmuted italic">{s.guidance}</span>
              </div>
              <textarea
                value={content[s.name]}
                onChange={(e) => setContent({ ...content, [s.name]: e.target.value })}
                rows={s.name.includes('Headline') || s.name.includes('TL;DR') ? 2 : 4}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-sfblue/40"
                placeholder={`Write your ${s.name.toLowerCase()}…`}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="card">
            <h4 className="font-serif font-semibold text-sfnavy text-sm mb-2">Distribution</h4>
            <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full border border-slate-200 rounded p-2 text-sm">
              {DISTRIBUTION_LISTS.map(d => <option key={d.id} value={d.id}>{d.name} ({d.memberCount})</option>)}
            </select>
            <div className="mt-2 text-[11px] text-sfmuted">{dl.purpose}</div>
            <div className="mt-2 text-[11px] text-sfnavy">
              <strong>Channels:</strong> {dl.channels.join(', ')}
            </div>
          </div>

          <div className="card">
            <h4 className="font-serif font-semibold text-sfnavy text-sm mb-2">Completeness</h4>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-sgreen transition-all duration-500" style={{ width: `${completeness}%` }} />
            </div>
            <div className="mt-2 text-xs text-sfmuted">{filledCount} of {template.structure.length} sections filled · <strong className="text-sfnavy">{completeness}%</strong></div>
          </div>

          <div className="card">
            <h4 className="font-serif font-semibold text-sfnavy text-sm mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3 text-sflight" />AI assist hint</h4>
            <p className="text-[11px] text-sfnavy leading-relaxed">{template.aiAssist}</p>
            <div className="mt-2 text-[11px] text-sfmuted">
              <strong>Pulls from:</strong>
              <ul className="mt-1 space-y-0.5">{template.relatedSources.map(r => <li key={r}>· {r}</li>)}</ul>
            </div>
          </div>

          <div className="space-y-2">
            <button disabled={completeness < 100} className="w-full bg-sfblue text-white rounded-lg px-3 py-2 text-sm font-semibold hover:bg-sfdeep disabled:opacity-50 flex items-center justify-center gap-1.5">
              <Send className="w-4 h-4" /> Send
            </button>
            <button className="w-full bg-sfbg text-sfnavy rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-200">Save draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- TEMPLATE PREVIEW ----------
function Preview({ templateId, onClose, onCompose }) {
  const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center text-lg">{template.icon}</div>
          <div>
            <h3 className="font-serif font-bold text-sfnavy">{template.name} — Preview</h3>
            <div className="text-[11px] text-sfmuted">{template.audience}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onCompose(template.id)} className="bg-sfblue text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-sfdeep flex items-center gap-1.5">
            <Edit3 className="w-3 h-3" /> Use this template
          </button>
          <button onClick={onClose} className="bg-sfbg text-sfnavy rounded-lg px-3 py-1.5 text-xs hover:bg-slate-200">← Back</button>
        </div>
      </div>
      <div className="card">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-sfnavy bg-sfbg p-4 rounded-lg border border-slate-200">{template.sample}</pre>
        </div>
      </div>
    </div>
  );
}

// ---------- ACTIVE DRAFTS ----------
function ActiveDrafts({ onOpenDraft }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-sfblue" />
        <h3 className="text-base font-semibold text-sfnavy">Active Drafts</h3>
        <span className="ml-auto text-xs text-sfmuted">{ACTIVE_DRAFTS.length} in progress</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase text-sfmuted border-b border-slate-200">
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Template</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Distribution</th>
              <th className="py-2 pr-3">Reviewers</th>
              <th className="py-2 pr-3">Due</th>
              <th className="py-2 pr-3">Completeness</th>
              <th className="py-2 pr-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVE_DRAFTS.map(d => {
              const meta = STATUS_META[d.status];
              const dl = DISTRIBUTION_LISTS.find(x => x.id === d.distributionId);
              return (
                <tr key={d.id} className="border-b border-slate-100 hover:bg-sfbg/60">
                  <td className="py-2 pr-3 font-medium text-sfnavy">{d.title}</td>
                  <td className="py-2 pr-3 text-xs text-sfmuted">{d.template}</td>
                  <td className="py-2 pr-3"><span className={meta.pill}>{meta.label}</span></td>
                  <td className="py-2 pr-3 text-xs text-sfmuted">{dl?.name || '—'}</td>
                  <td className="py-2 pr-3 text-xs text-sfmuted">{d.reviewers}</td>
                  <td className="py-2 pr-3 text-xs font-mono text-sfmuted">{d.dueDate}</td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${d.completeness >= 75 ? 'bg-sgreen' : d.completeness >= 40 ? 'bg-sfblue' : 'bg-syellow'}`} style={{ width: `${d.completeness}%` }} />
                      </div>
                      <span className="text-xs font-mono">{d.completeness}%</span>
                    </div>
                  </td>
                  <td className="py-2 pr-3"><button className="text-xs text-sfblue hover:underline">Open</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- RECENT SENDS ----------
function RecentSends() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-sfblue" />
        <h3 className="text-base font-semibold text-sfnavy">Recent Sends</h3>
        <span className="ml-auto text-xs text-sfmuted">last 30 days</span>
      </div>
      <div className="space-y-2">
        {RECENT_SENDS.map(s => (
          <div key={s.id} className="bg-sfbg border border-slate-200 rounded-lg p-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sfnavy text-sm">{s.title}</div>
              <div className="text-[11px] text-sfmuted">{s.template} · {s.audience} · sent {s.sent}</div>
              <div className="text-[11px] text-sfnavy mt-1 italic">"{s.signal}"</div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-right">
              <div className="text-xs">
                <div className="text-[10px] uppercase text-sfmuted">Read</div>
                <div className="font-mono font-bold text-sgreen">{s.readRate}%</div>
              </div>
              <div className="text-xs">
                <div className="text-[10px] uppercase text-sfmuted">Replies</div>
                <div className="font-mono font-bold text-sfblue">{s.replies}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- DISTRIBUTION LISTS ----------
function DistributionListsView() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-sfblue" />
        <h3 className="text-base font-semibold text-sfnavy">Distribution Lists</h3>
        <span className="ml-auto text-xs text-sfmuted">{DISTRIBUTION_LISTS.length} maintained</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DISTRIBUTION_LISTS.map(d => (
          <div key={d.id} className="bg-sfbg border border-slate-200 rounded-lg p-3">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h4 className="font-serif font-semibold text-sfnavy">{d.name}</h4>
              <span className="text-xs font-mono text-sfblue">{d.memberCount} members</span>
            </div>
            <p className="text-[11px] text-sfmuted leading-relaxed">{d.purpose}</p>
            <div className="text-[11px] text-sfnavy mt-2"><strong>Sample:</strong> <span className="text-sfmuted">{d.sampleMembers.join(', ')}</span></div>
            <div className="text-[11px] text-sfnavy mt-1"><strong>Channels:</strong> <span className="text-sfmuted">{d.channels.join(' · ')}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- MAIN ----------
const VIEWS = [
  { id: 'overview',   label: 'Overview',           icon: BarChart3 },
  { id: 'templates',  label: 'Templates',          icon: FileText },
  { id: 'drafts',     label: 'Active Drafts',      icon: Edit3 },
  { id: 'lists',      label: 'Distribution Lists', icon: Users }
];

export default function Workbench() {
  const [view, setView] = useState('overview');
  const [composing, setComposing] = useState(null); // template id
  const [previewing, setPreviewing] = useState(null);

  const onCompose = (id) => { setPreviewing(null); setComposing(id); };
  const onPreview = (id) => { setComposing(null); setPreviewing(id); };
  const onClose = () => { setComposing(null); setPreviewing(null); };

  // If composer or preview is active, show it
  if (composing) return <div className="space-y-4">
    <Header />
    <Composer templateId={composing} onClose={onClose} />
  </div>;
  if (previewing) return <div className="space-y-4">
    <Header />
    <Preview templateId={previewing} onClose={onClose} onCompose={onCompose} />
  </div>;

  return (
    <div className="space-y-4">
      <Header />

      {/* View nav */}
      <div className="bg-white rounded-xl shadow-card p-3">
        <div className="flex flex-wrap gap-2">
          {VIEWS.map(v => {
            const Icon = v.icon;
            const active = v.id === view;
            return (
              <button key={v.id} onClick={() => setView(v.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-sfnavy text-white' : 'text-sfnavy hover:bg-sfbg'}`}>
                <Icon className="w-4 h-4" /> {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'overview' && (
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat icon={FileText}      label="Templates"     value={MESSAGE_TEMPLATES.length}     sub="Pre-structured" />
            <Stat icon={Edit3}         label="Active drafts" value={ACTIVE_DRAFTS.length}         sub={`${ACTIVE_DRAFTS.filter(d=>d.status==='needs-write').length} needs write`} accent="syellow" />
            <Stat icon={Send}          label="Recent sends"  value={RECENT_SENDS.length}          sub="last 30 days" accent="sgreen" />
            <Stat icon={Users}         label="Distribution lists" value={DISTRIBUTION_LISTS.length} sub={`${DISTRIBUTION_LISTS.reduce((s,d)=>s+d.memberCount,0)} total members`} />
          </div>

          <ActiveDrafts onOpenDraft={onCompose} />
          <RecentSends />

          {/* Quick start templates */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-sflight" />
              <h3 className="text-base font-semibold text-sfnavy">Start a new message</h3>
              <button onClick={() => setView('templates')} className="ml-auto text-xs text-sfblue hover:underline">See all templates →</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {MESSAGE_TEMPLATES.slice(0, 4).map(t => (
                <button key={t.id} onClick={() => onCompose(t.id)} className="bg-sfbg border border-slate-200 rounded-lg p-3 text-left hover:border-sfblue/40 transition">
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold text-sfnavy leading-tight">{t.name}</div>
                  <div className="text-[10px] text-sfmuted mt-1">{t.estimatedTime}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'templates' && <TemplateLibrary onCompose={onCompose} onPreview={onPreview} />}
      {view === 'drafts'    && <ActiveDrafts onOpenDraft={onCompose} />}
      {view === 'lists'     && <DistributionListsView />}
    </div>
  );
}

function Header() {
  return (
    <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
      <div className="flex items-start gap-3">
        <PenSquare className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-lg font-serif font-bold">Sr Manager Workbench</h2>
          <p className="text-sm text-white/80 mt-1">Where the Sr Manager <strong className="text-sflight">drafts</strong> comms for Director review. 8 templates: exec updates, sponsor briefs, escalations, launches, PM digests. AI auto-fills from PortfolioIQ data.</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, accent = 'sfblue' }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-7 h-7 rounded-lg bg-${accent}/10 grid place-items-center`}>
          <Icon className={`w-3.5 h-3.5 text-${accent}`} />
        </div>
        <span className="text-[11px] uppercase tracking-wide text-sfmuted font-semibold">{label}</span>
      </div>
      <div className="text-2xl font-serif font-bold text-sfnavy">{value}</div>
      <div className="text-[11px] text-sfmuted">{sub}</div>
    </div>
  );
}
