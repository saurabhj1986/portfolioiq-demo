import React, { useState } from 'react';
import { BookOpen, Clock, Users, CheckCircle2, ChevronDown, Target, FileText, BarChart3 } from 'lucide-react';
import { PLAYBOOKS, PLAYBOOK_STATUS_META, adoptionTier } from '../data/playbooks.js';

function PlaybookCard({ pb }) {
  const [open, setOpen] = useState(false);
  const statusMeta = PLAYBOOK_STATUS_META[pb.status];
  const tier = adoptionTier(pb.adoption);
  return (
    <div className="card">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-sfblue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-semibold text-sfnavy">{pb.name}</h3>
                <span className={statusMeta.pill}>{statusMeta.label}</span>
                <span className="text-[10px] font-mono text-sfmuted">{pb.version}</span>
              </div>
              <p className="text-xs text-sfmuted mt-0.5">{pb.purpose}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-sfmuted flex-wrap">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pb.timeToUse}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pb.adoption}% adoption · <span className={`font-semibold text-${tier.color}`}>{tier.label}</span></span>
                <span className="flex items-center gap-1 text-sfblue">JD: {pb.jdLine}</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-sfmuted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-sfmuted mb-1.5"><Target className="w-3 h-3" />When to use</div>
            <p className="text-sfnavy text-xs leading-relaxed">{pb.when}</p>
          </div>
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-sfmuted mb-1.5"><CheckCircle2 className="w-3 h-3" />Steps</div>
            <ol className="space-y-1">
              {pb.steps.map((s, i) => (
                <li key={i} className="text-xs text-sfnavy flex gap-2">
                  <span className="font-mono text-sfblue font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-sfmuted mb-1.5"><FileText className="w-3 h-3" />Required artifacts</div>
            <ul className="space-y-0.5">
              {pb.artifacts.map((a, i) => <li key={i} className="text-xs text-sfnavy">• {a}</li>)}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-sfmuted mb-1.5"><BarChart3 className="w-3 h-3" />Adherence metrics</div>
            <ul className="space-y-0.5">
              {pb.metrics.map((m, i) => <li key={i} className="text-xs text-sfnavy">• {m}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Playbooks() {
  const ga    = PLAYBOOKS.filter(p => p.status === 'GA').length;
  const pilot = PLAYBOOKS.filter(p => p.status === 'Pilot').length;
  const draft = PLAYBOOKS.filter(p => p.status === 'Draft').length;
  const avgAdoption = Math.round(PLAYBOOKS.reduce((s, p) => s + p.adoption, 0) / PLAYBOOKS.length);

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <BookOpen className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-serif font-bold">Foundational Playbooks Library</h2>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">
              Standardized playbooks every Pillar PM pulls from. One way to do common work — written down, version-controlled, adoption-tracked. This is Judette's literal 60-day milestone (<em>"Establish documentation around taxonomy, process, and guidance for updated Portfolio Processes"</em>) executed.
            </p>
            <div className="text-[11px] text-white/60 mt-2">
              <strong>JD line:</strong> #2 — "Lead the creation and adoption of foundational playbooks and assets to ensure a seamless, consistent experience for all portfolio teams and stakeholders."
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs flex-shrink-0">
            <div className="bg-white/10 rounded p-2">
              <div className="text-2xl font-serif font-bold text-sgreen">{ga}</div>
              <div className="text-white/70">GA</div>
            </div>
            <div className="bg-white/10 rounded p-2">
              <div className="text-2xl font-serif font-bold text-sflight">{pilot}</div>
              <div className="text-white/70">Pilot</div>
            </div>
            <div className="bg-white/10 rounded p-2">
              <div className="text-2xl font-serif font-bold text-syellow">{draft}</div>
              <div className="text-white/70">Draft</div>
            </div>
            <div className="bg-white/10 rounded p-2">
              <div className="text-2xl font-serif font-bold">{avgAdoption}%</div>
              <div className="text-white/70">Avg adoption</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {PLAYBOOKS.map(pb => <PlaybookCard key={pb.id} pb={pb} />)}
      </div>

      <div className="card bg-sfbg border-2 border-sfblue/20">
        <h4 className="text-sm font-semibold text-sfnavy mb-2">How a new Pillar PM uses this in week 1</h4>
        <ol className="space-y-1 text-xs text-sfnavy">
          <li><strong className="text-sfblue">1.</strong> Open the Initiative Intake Playbook to propose work.</li>
          <li><strong className="text-sfblue">2.</strong> Use Capacity Planning Playbook to declare quarterly FTE before locking commitments.</li>
          <li><strong className="text-sfblue">3.</strong> When advancing a gate, run the Stage-Gate Decision Playbook + Stage-Gate Scorer (Decision Engine).</li>
          <li><strong className="text-sfblue">4.</strong> Refresh Risk Register every 90 days using the template.</li>
          <li><strong className="text-sfblue">5.</strong> Show up to monthly Portfolio Review prepared per the Portfolio Review Playbook.</li>
        </ol>
        <p className="text-[11px] text-sfmuted mt-2 italic">No PM should ever have to re-invent how to do these things. That's the whole point of a playbook library.</p>
      </div>
    </div>
  );
}
