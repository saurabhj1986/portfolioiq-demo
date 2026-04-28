import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Lock } from 'lucide-react';
import { PERSONAS } from '../data/personas.js';

export default function PersonaSwitcher({ persona, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 hover:bg-white/10 transition"
      >
        <User className="w-3.5 h-3.5 text-white/70" />
        <div className="text-left">
          <div className="text-[9px] uppercase tracking-widest text-white/50 leading-none">Viewing as</div>
          <div className={`text-xs font-semibold leading-none mt-1 ${persona.accent}`}>{persona.role}{persona.pillarLabel ? ` · ${persona.pillarLabel}` : ''}</div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-white/15 shadow-2xl z-50 overflow-hidden" style={{ background: '#0F1623' }}>
          <div className="px-3 py-2 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Switch persona</div>
            <div className="text-[11px] text-white/70 mt-0.5 leading-snug">In production, this would come from your identity provider login. Demo: switch manually to see how RBAC adapts the views.</div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {PERSONAS.map(p => {
              const isCurrent = p.id === persona.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { onChange(p); setOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 hover:bg-white/5 transition border-l-2 ${isCurrent ? 'bg-white/10 border-sflight' : 'border-transparent'}`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-xs font-semibold ${p.accent}`}>{p.label}</span>
                    {p.readOnly && <Lock className="w-3 h-3 text-white/40 flex-shrink-0" title="Read-only" />}
                  </div>
                  <div className="text-[11px] text-white/60 mt-0.5 leading-snug">{p.desc}</div>
                  {p.hideTabs.length > 0 && (
                    <div className="text-[10px] text-white/40 mt-1 font-mono">Hidden: {p.hideTabs.join(', ')}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
