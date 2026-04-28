import React, { useState } from 'react';
import { Bot, Zap, Activity, ChevronDown, Filter, CheckCircle2, Pause } from 'lucide-react';
import { AGENTS, AGENT_CATEGORIES, MCP_SERVERS, AGENT_ACTIVITY, aggregateStats } from '../data/agents.js';

function McpBadge({ id }) {
  const m = MCP_SERVERS.find(s => s.id === id);
  if (!m) return null;
  const tone = m.salesforce
    ? 'bg-sflight/10 border-sflight/30'
    : 'bg-white/5 border-white/15';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] border rounded px-1.5 py-0.5 ${tone}`}>
      <span>{m.icon}</span>
      <span className={m.salesforce ? 'text-sflight' : 'text-white/70'}>{m.label}</span>
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    active: { label: 'ACTIVE', cls: 'pill-green',  icon: <CheckCircle2 className="w-3 h-3" /> },
    pilot:  { label: 'PILOT',  cls: 'pill-blue',   icon: <Activity className="w-3 h-3" /> },
    paused: { label: 'PAUSED', cls: 'pill-yellow', icon: <Pause className="w-3 h-3" /> },
    draft:  { label: 'DRAFT',  cls: 'pill-gray',   icon: <Activity className="w-3 h-3" /> }
  };
  const m = map[status] || map.active;
  return <span className={m.cls}>{m.icon} {m.label}</span>;
}

function AgentCard({ agent, expanded, onToggle }) {
  const cat = AGENT_CATEGORIES.find(c => c.id === agent.category);
  return (
    <div className={`rounded-xl border transition-all ${expanded ? 'bg-white/8 border-sflight/40' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{agent.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-white text-base leading-tight">{agent.name}</h3>
                <StatusPill status={agent.status} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-sflight font-bold mt-1">{cat.label}</div>
              <p className="text-xs text-white/75 mt-2 leading-relaxed">{agent.description}</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {agent.integrations.map(id => <McpBadge key={id} id={id} />)}
        </div>

        <div className="mt-3 flex items-baseline justify-between text-[11px]">
          <span className="text-sfmuted">Last run: <span className="text-white/90">{agent.lastRun}</span></span>
          <span className="font-mono text-sflight">{agent.monthlyActions} actions/mo</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold mb-1">Trigger</div>
            <div className="font-mono text-sflight">{agent.trigger}</div>
            <div className="text-white/60 mt-0.5">Schedule: {agent.schedule}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-sfmuted font-bold mb-1">What it does</div>
            <ol className="space-y-1">
              {agent.actions.map((a, i) => (
                <li key={i} className="flex gap-2 text-white/85">
                  <span className="font-mono text-sflight flex-shrink-0">{i + 1}.</span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-sgreen font-bold mb-1">Last outcome</div>
              <p className="text-white/85 leading-relaxed">{agent.lastOutcome}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-sflight font-bold mb-1">Success metric</div>
              <p className="text-white/85 leading-relaxed">{agent.successMetric}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityRow({ event }) {
  const m = MCP_SERVERS.find(s => s.id === event.via);
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 text-xs">
      <span className="font-mono text-[10px] text-sfmuted whitespace-nowrap mt-0.5">{event.ts.slice(11)}</span>
      <span className="text-base flex-shrink-0">{m?.icon || '⚙️'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white">
          <span className="text-sflight font-semibold">{event.agentName}</span>
          <span className="text-sfmuted"> · </span>
          <span className="text-white/85">{event.action}</span>
          {event.target !== '—' && (
            <>
              <span className="text-sfmuted"> → </span>
              <span className="text-white">{event.target}</span>
            </>
          )}
        </div>
        <p className="text-[11px] text-sfmuted mt-0.5 leading-snug">{event.detail}</p>
      </div>
    </div>
  );
}

export default function Agents() {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const stats = aggregateStats();

  const filtered = filter === 'all' ? AGENTS : AGENTS.filter(a => a.category === filter);

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="card bg-gradient-to-br from-sfnavy via-sfdeep to-sfblue text-white">
        <div className="flex items-start gap-3">
          <Bot className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-sflight font-bold mb-1">Agentic operating layer</div>
            <h2 className="text-xl font-serif font-bold leading-tight">12 specialized agents — running on Agentforce, connected primarily to the Salesforce stack</h2>
            <p className="text-sm text-white/80 mt-2 leading-relaxed max-w-3xl">
              Agents execute on <strong className="text-sflight">Agentforce</strong>, read and write across the <strong className="text-sflight">Salesforce-native fabric</strong> — GUS, Salesforce Platform, Data Cloud, Einstein, Tableau, Slack, Quip, MuleSoft — and reach out to <strong className="text-white">supporting external systems</strong> (Jira, Email, Okta, Snowflake, Workday, Anaplan) through MCP. Routine governance and comms work happens automatically; the Sr Manager reviews and approves what humans must.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-white/15">
          <div><div className="text-2xl font-serif font-bold">{stats.agents}</div><div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">Agents</div></div>
          <div><div className="text-2xl font-serif font-bold text-sgreen">{stats.active}</div><div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">Active</div></div>
          <div><div className="text-2xl font-serif font-bold">{stats.monthlyActions}</div><div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">Actions / month</div></div>
          <div><div className="text-2xl font-serif font-bold text-sflight">~18 hrs</div><div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">Saved / week</div></div>
        </div>
      </div>

      {/* MCP fabric — Salesforce-native first, external supporting second */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-sflight" />
          <h3 className="text-sm font-semibold text-sfnavy">MCP fabric · Salesforce-native + supporting external</h3>
        </div>

        {/* Salesforce ecosystem */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-sflight font-bold mb-2">Salesforce ecosystem · primary</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {MCP_SERVERS.filter(m => m.salesforce).map(m => (
              <div key={m.id} className="bg-sflight/10 border border-sflight/30 rounded p-2.5 text-xs">
                <div className="flex items-center gap-2"><span className="text-base">{m.icon}</span><span className="font-semibold text-sflight">{m.label}</span></div>
                <p className="text-[11px] text-sfmuted mt-1 leading-snug">{m.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* External supporting */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-sfmuted font-bold mb-2">External · supporting</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {MCP_SERVERS.filter(m => !m.salesforce).map(m => (
              <div key={m.id} className="bg-white/5 border border-white/15 rounded p-2.5 text-xs">
                <div className="flex items-center gap-2"><span className="text-base">{m.icon}</span><span className="font-semibold text-sfnavy">{m.label}</span></div>
                <p className="text-[11px] text-sfmuted mt-1 leading-snug">{m.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="card flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-sfmuted" />
        <button
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-full ${filter === 'all' ? 'bg-sfnavy text-white' : 'bg-white/5 text-sfnavy hover:bg-white/10'}`}
        >
          All ({AGENTS.length})
        </button>
        {AGENT_CATEGORIES.map(c => {
          const count = AGENTS.filter(a => a.category === c.id).length;
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full ${active ? 'bg-sfnavy text-white' : 'bg-white/5 text-sfnavy hover:bg-white/10'}`}
              title={c.desc}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Agents grid + activity feed (2-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(a => (
            <AgentCard
              key={a.id}
              agent={a}
              expanded={expandedId === a.id}
              onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
            />
          ))}
        </div>

        <aside className="card sticky top-4 self-start">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-sflight" />
            <h3 className="text-sm font-semibold text-sfnavy">Live activity · last 24h</h3>
          </div>
          <p className="text-xs text-sfmuted mb-3">Append-only stream of every agent action — same audit-trail discipline as state changes.</p>
          <div className="max-h-[640px] overflow-y-auto pr-1">
            {AGENT_ACTIVITY.map((e, i) => <ActivityRow key={i} event={e} />)}
          </div>
        </aside>
      </div>

      {/* How agents fit footer */}
      <div className="card bg-sfbg border-2 border-sflight/20">
        <h4 className="text-sm font-semibold text-sfnavy mb-2">How agents fit the operating model</h4>
        <p className="text-xs text-sfnavy leading-relaxed max-w-4xl">
          Agents do <strong>routine, observable, reversible work</strong> — the things humans drop because they're boring and recurring. They never make capital allocation decisions, never sign off on stage-gates, never override a sponsor. Every agent action lands in <strong>portfolio_audit_trail</strong> on Salesforce Platform with the same discipline as a human change. The Sr Manager reviews agent output, approves what needs approval, and spends saved time on the work only humans can do: judgment calls, relationships, coaching.
        </p>
        <p className="text-xs text-sfnavy leading-relaxed max-w-4xl mt-2">
          <strong className="text-sflight">Why Salesforce-first:</strong> Agentforce is the agent runtime, Data Cloud is the unified read/write layer, Einstein supplies ML scoring, Tableau renders the views, Slack and Quip are the human touchpoints. MuleSoft bridges the few external systems (Anaplan, Workday, Snowflake) into the same data layer — so every agent operates on a single Source of Truth.
        </p>
      </div>
    </div>
  );
}
