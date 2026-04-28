import React, { useState, useMemo } from 'react';
import {
  Database, ChevronDown, Network, ListChecks, Users, FolderTree, History, Shield,
  BookOpen, Tag, Search, Filter
} from 'lucide-react';
import { METRIC_CATALOG, METRIC_CATEGORIES, DATA_GLOSSARY, GLOSSARY_CATEGORIES } from '../data/standards.js';

// ---------- Audit trail data (JD #4) ----------
const AUDIT_EVENTS = [
  { ts: '2026-04-26 09:14', actor: 'Aisha Patel',     action: 'updated',    target: 'INI-103',  field: 'status',           before: 'in_progress', after: 'complete',     reason: 'Trust Center 2.0 launched; auto-derived from artifact ART-009 approval' },
  { ts: '2026-04-25 16:42', actor: 'Sr Mgr',          action: 'reassigned', target: 'INI-102',  field: 'pillar_pm',        before: 'Marcus Chen', after: 'Aisha Patel',  reason: 'Coverage during parental leave (June 17 → Sep 17)' },
  { ts: '2026-04-25 11:08', actor: 'system',          action: 'flagged',    target: 'ART-005',  field: 'status',           before: 'approved',    after: 'expired',      reason: 'expires_date < CURRENT_DATE() — auto-expire job' },
  { ts: '2026-04-24 14:30', actor: 'Jordan Reilly',   action: 'updated',    target: 'INI-116',  field: 'budget_spent',     before: '$2.10M',      after: '$2.30M',       reason: 'Q1 actuals reconciled from Anaplan' },
  { ts: '2026-04-22 10:11', actor: 'Sr Mgr',          action: 'created',    target: 'INI-115',  field: 'okr_mapping',      before: '[]',          after: "['V25-Trust','V25-Agentforce']", reason: 'AI Governance Framework added to V25 OKR map' },
  { ts: '2026-04-20 17:55', actor: 'system',          action: 'expired',    target: 'ART-003',  field: 'status',           before: 'needs_review',after: 'expired',      reason: 'Risk Register 90-day refresh missed' },
  { ts: '2026-04-19 13:20', actor: 'Renata Oliveira', action: 'updated',    target: 'INI-110',  field: 'status',           before: 'at_risk',     after: 'off_track',    reason: 'Risk Register expired + 78% spend / 50% built' },
  { ts: '2026-04-18 09:45', actor: 'Aarti Vyas',      action: 'approved',   target: 'ART-008',  field: 'status',           before: 'needs_review',after: 'approved',     reason: 'Architecture Review for INI-116 G2' },
  { ts: '2026-04-15 15:12', actor: 'Sr Mgr',          action: 'created',    target: 'PB-05',    field: 'playbook',         before: '—',           after: 'v0.3 Draft',   reason: 'Quarterly Rebalance Playbook v0.3 drafted for Q3 use' },
  { ts: '2026-04-12 11:30', actor: 'David Lindqvist', action: 'requested',  target: 'INI-104',  field: 'gate',             before: 'G1',          after: 'G2 (requested)', reason: 'PRD review pending CFO sponsor decision' }
];

// ---------- Schema tables ----------
const TABLES = [
  {
    icon: FolderTree,
    name: 'initiative_inventory',
    why: 'The master taxonomy of the portfolio — every initiative, exactly once. This is the canonical Source of Truth. Pillar, stage, OKR mapping, sponsor, budget, FTE, last_reviewed all live here. Every other table joins back to this one.',
    ddl: `CREATE TABLE det_portfolio.initiative_inventory (
  initiative_id     VARCHAR(10) PRIMARY KEY,
  initiative_name   VARCHAR(200) NOT NULL,
  pillar            VARCHAR(50)  NOT NULL,
  stage             VARCHAR(4)   NOT NULL,
  status            VARCHAR(20)  NOT NULL,
  budget_allocated  DECIMAL(12,2),
  budget_spent      DECIMAL(12,2),
  ftes_allocated    INTEGER,
  start_date        DATE,
  target_launch     DATE,
  pillar_pm         VARCHAR(100),
  exec_sponsor      VARCHAR(100),
  okr_mapping       ARRAY,
  last_reviewed     DATE,
  created_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

CREATE INDEX idx_initiative_pillar    ON initiative_inventory(pillar);
CREATE INDEX idx_initiative_stage     ON initiative_inventory(stage);
CREATE INDEX idx_initiative_status    ON initiative_inventory(status);`,
    sample: [
      ['INI-101', 'Agentforce Internal Rollout', 'dap', 'G2', 'on_track', '$2.4M', '9 FTE', "['V25-Agentforce']"],
      ['INI-102', 'Workday HRIS Migration',     'ept', 'G2', 'off_track','$3.1M', '12 FTE',"['V25-Margin']"],
      ['INI-115', 'AI Governance Framework',    'ts',  'G1', 'at_risk',  '$850K', '4 FTE', "['V25-Trust']"]
    ],
    sampleHeaders: ['initiative_id', 'name', 'pillar', 'stage', 'status', 'budget', 'fte', 'okr_mapping']
  },
  {
    icon: ListChecks,
    name: 'stage_gate_artifacts',
    why: 'The proof every initiative is governed correctly. Lifecycle states (approved → needs_review → expired → missing) drive the Stage-Gate Compliance KPI. Auto-expire job flags overdue artifacts.',
    ddl: `CREATE TABLE det_portfolio.stage_gate_artifacts (
  artifact_id       VARCHAR(10) PRIMARY KEY,
  initiative_id     VARCHAR(10) REFERENCES initiative_inventory(initiative_id),
  gate              VARCHAR(4),
  artifact_type     VARCHAR(50),
  status            VARCHAR(20),
  approver          VARCHAR(100),
  collected_date    DATE,
  expires_date      DATE,
  source_system     VARCHAR(50),
  link              VARCHAR(500)
);

CREATE OR REPLACE TASK expire_artifacts WAREHOUSE = portfolio_wh
  SCHEDULE = 'USING CRON 0 6 * * * America/Los_Angeles'
  AS UPDATE stage_gate_artifacts
     SET status = 'expired'
     WHERE expires_date < CURRENT_DATE() AND status = 'approved';`,
    sample: [
      ['ART-001', 'INI-101', 'G2', 'Architecture Review', 'approved',     '2026-03-12', '2026-09-12', 'Confluence'],
      ['ART-005', 'INI-110', 'G2', 'Risk Register',       'expired',      '2025-12-05', '2026-03-05', 'ServiceNow'],
      ['ART-006', 'INI-112', 'G1', 'Capacity Plan',       'missing',      '—',          '—',          'Anaplan']
    ],
    sampleHeaders: ['artifact_id', 'initiative_id', 'gate', 'type', 'status', 'collected', 'expires', 'source']
  },
  {
    icon: Network,
    name: 'dependencies',
    why: 'The portfolio is a graph, not a list. Captures upstream/downstream relationships with type (blocks, gates, informs, shares_resources). Enables cascade analysis for capital allocation decisions.',
    ddl: `CREATE TABLE det_portfolio.dependencies (
  dependency_id     VARCHAR(10) PRIMARY KEY,
  upstream_id       VARCHAR(10) REFERENCES initiative_inventory(initiative_id),
  downstream_id     VARCHAR(10) REFERENCES initiative_inventory(initiative_id),
  dependency_type   VARCHAR(20),
  risk_level        VARCHAR(10),
  notes             TEXT,
  CONSTRAINT no_self_dep CHECK (upstream_id <> downstream_id),
  CONSTRAINT uniq_pair UNIQUE (upstream_id, downstream_id, dependency_type)
);

CREATE OR REPLACE VIEW v_initiative_chain AS
WITH RECURSIVE chain AS (
  SELECT initiative_id, initiative_id AS root, 0 AS depth FROM initiative_inventory
  UNION ALL
  SELECT d.upstream_id, c.root, c.depth + 1
    FROM dependencies d JOIN chain c ON d.downstream_id = c.initiative_id
   WHERE c.depth < 6
) SELECT * FROM chain;`,
    sample: [
      ['DEP-01', 'INI-116 (Lakehouse)',     'INI-101 (Agentforce)', 'blocks',           'high',   'Agentforce needs grounding data'],
      ['DEP-03', 'INI-115 (AI Governance)', 'INI-101 (Agentforce)', 'gates',            'high',   'AG approval gates production'],
      ['DEP-05', 'INI-102 (Workday)',       'INI-106 (HR Data)',    'shares_resources', 'medium', '4 shared FTEs in Q3']
    ],
    sampleHeaders: ['dependency_id', 'upstream', 'downstream', 'type', 'risk', 'notes']
  },
  {
    icon: Users,
    name: 'capacity_snapshots',
    why: 'Capacity is a moving target. Weekly snapshots enable scenario planning ("what does next week\'s allocation look like if we move 4 FTE?") and capacity variance reporting.',
    ddl: `CREATE TABLE det_portfolio.capacity_snapshots (
  snapshot_id       VARCHAR(15) PRIMARY KEY,
  pillar            VARCHAR(50),
  fte_capacity      INTEGER,
  fte_allocated     INTEGER,
  budget_capacity   DECIMAL(12,2),
  budget_allocated  DECIMAL(12,2),
  snapshot_date     DATE NOT NULL,
  notes             TEXT
);

CREATE UNIQUE INDEX idx_capacity_uniq ON capacity_snapshots(pillar, snapshot_date);`,
    sample: [
      ['CAP-2026W17-ept', 'Employee Productivity', '28', '31', '$5.6M', '$5.1M', '2026-04-22'],
      ['CAP-2026W17-fot', 'Finance & Ops Tech',    '30', '33', '$7.2M', '$6.0M', '2026-04-22'],
      ['CAP-2026W17-ts',  'Trust & Security',      '22', '19', '$3.5M', '$2.9M', '2026-04-22']
    ],
    sampleHeaders: ['snapshot_id', 'pillar', 'fte_cap', 'fte_alloc', 'budget_cap', 'budget_alloc', 'date']
  }
];

// ---------- TableCard for Schema sub-tab ----------
function TableCard({ table }) {
  const [open, setOpen] = useState(false);
  const Icon = table.icon;
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center">
            <Icon className="w-5 h-5 text-sfblue" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-sfdeep">{table.name}</h3>
            <p className="text-[11px] text-sfmuted">det_portfolio schema</p>
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-xs text-sfblue hover:underline flex items-center gap-1">
          Why this table? <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="bg-sfbg border border-slate-200 rounded-lg p-3 mb-3 text-sm leading-relaxed text-sfnavy">{table.why}</div>
      )}
      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold mb-1">DDL</div>
        <pre className="sql-block">{table.ddl}</pre>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold mb-1">Sample data</div>
        <div className="overflow-x-auto">
          <table className="text-[11px] w-full">
            <thead><tr>{table.sampleHeaders.map(h => <th key={h} className="text-left p-2 bg-sfbg border border-slate-200 font-mono text-sfdeep font-semibold">{h}</th>)}</tr></thead>
            <tbody>{table.sample.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j} className="p-2 border border-slate-200 font-mono">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =================== SUB-TAB: SCHEMA ===================
function SchemaView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {TABLES.map(t => <TableCard key={t.name} table={t} />)}
    </div>
  );
}

// =================== SUB-TAB: METRIC CATALOG ===================
function MetricCard({ m }) {
  const [open, setOpen] = useState(false);
  const cat = METRIC_CATEGORIES.find(c => c.id === m.category);
  return (
    <div className="card">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`pill bg-${cat.color}/10 text-${cat.color} border border-${cat.color}/30 capitalize`}>{cat.label}</span>
              <h3 className="font-serif font-semibold text-sfnavy">{m.name}</h3>
              <span className="text-[10px] font-mono text-sfmuted">{m.version}</span>
            </div>
            <p className="text-xs text-sfmuted mt-1 leading-relaxed">{m.definition}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-sfmuted flex-wrap">
              <span>Target: <strong className="text-sfnavy">{m.target}</strong></span>
              <span>Current: <strong className="text-sfnavy">{m.currentValue}</strong></span>
              <span>Refresh: {m.refresh}</span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-sfmuted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-sfmuted mb-1">Formula</div>
            <code className="block bg-sfbg p-2 rounded text-sfnavy font-mono leading-relaxed">{m.formula}</code>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-sfmuted mb-1">Owner & source</div>
            <div className="text-sfnavy"><strong>Owner:</strong> {m.owner}</div>
            <div className="text-sfnavy"><strong>Source:</strong> <code className="font-mono text-sfdeep">{m.sourceSystem}</code></div>
            <div className="text-sfnavy"><strong>Last reviewed:</strong> {m.lastReviewed}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-sfmuted mb-1">Used in</div>
            <ul className="space-y-0.5">{m.usedIn.map((u, i) => <li key={i} className="text-sfnavy">• {u}</li>)}</ul>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-sfmuted mb-1">Related metrics</div>
            <div className="flex flex-wrap gap-1">{m.related.map(r => <span key={r} className="bg-sfblue/10 text-sfblue rounded px-1.5 py-0.5 text-[11px]">{r}</span>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
function MetricCatalogView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => METRIC_CATALOG.filter(m =>
    (filter === 'all' || m.category === filter) &&
    (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.definition.toLowerCase().includes(search.toLowerCase()))
  ), [filter, search]);

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Tag className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-serif font-bold">Metric Catalog</h2>
            <p className="text-sm text-white/80 mt-1">Authoritative definitions for {METRIC_CATALOG.length} metrics used across the portfolio. Every dashboard, every report, every Copilot answer references back to these definitions. When ambiguity creeps in ("what does Capital Utilization actually count?"), this is where the answer lives.</p>
          </div>
        </div>
      </div>

      <div className="card flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-sfmuted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search metrics by name or definition…" className="flex-1 border-0 outline-none text-sm bg-transparent" />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="w-4 h-4 text-sfmuted" />
          <button onClick={() => setFilter('all')} className={`text-xs px-2 py-1 rounded ${filter === 'all' ? 'bg-sfnavy text-white' : 'bg-sfbg text-sfnavy'}`}>All ({METRIC_CATALOG.length})</button>
          {METRIC_CATEGORIES.map(c => {
            const count = METRIC_CATALOG.filter(m => m.category === c.id).length;
            return <button key={c.id} onClick={() => setFilter(c.id)} className={`text-xs px-2 py-1 rounded ${filter === c.id ? `bg-${c.color} text-white` : `bg-${c.color}/10 text-${c.color}`}`}>{c.label} ({count})</button>;
          })}
        </div>
      </div>

      <div className="space-y-2">{filtered.map(m => <MetricCard key={m.id} m={m} />)}</div>
    </div>
  );
}

// =================== SUB-TAB: GLOSSARY ===================
function GlossaryEntry({ t }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-serif font-semibold text-sfnavy">{t.term}</h4>
            <p className="text-xs text-sfnavy mt-1 leading-relaxed">{t.def}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-sfmuted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
          {t.aliases?.length > 0 && (
            <div><strong className="text-sfmuted uppercase tracking-wider text-[10px]">Also known as: </strong><span className="text-sfnavy">{t.aliases.join(', ')}</span></div>
          )}
          {t.examples?.length > 0 && (
            <div><strong className="text-sfmuted uppercase tracking-wider text-[10px]">Examples: </strong><span className="text-sfnavy font-mono">{t.examples.join(' · ')}</span></div>
          )}
          {t.related?.length > 0 && (
            <div className="flex items-baseline gap-1 flex-wrap"><strong className="text-sfmuted uppercase tracking-wider text-[10px]">Related: </strong>{t.related.map(r => <span key={r} className="bg-sfblue/10 text-sfblue rounded px-1.5 py-0.5">{r}</span>)}</div>
          )}
          {t.dontConfuse && (
            <div className="bg-orange-50 border border-orange-200 rounded p-2"><strong className="text-syellow uppercase tracking-wider text-[10px]">Don't confuse with: </strong><span className="text-sfnavy">{t.dontConfuse}</span></div>
          )}
        </div>
      )}
    </div>
  );
}
function GlossaryView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => DATA_GLOSSARY.filter(t =>
    (filter === 'all' || t.category === filter) &&
    (!search || t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()))
  ), [filter, search]);

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <BookOpen className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-serif font-bold">Data Glossary</h2>
            <p className="text-sm text-white/80 mt-1">{DATA_GLOSSARY.length} canonical terms used across the portfolio. The vocabulary executives, Pillar PMs, and engineers all share. When someone says "this is an initiative, not a project" — this is what they mean.</p>
          </div>
        </div>
      </div>

      <div className="card flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-sfmuted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms or definitions…" className="flex-1 border-0 outline-none text-sm bg-transparent" />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <button onClick={() => setFilter('all')} className={`text-xs px-2 py-1 rounded ${filter === 'all' ? 'bg-sfnavy text-white' : 'bg-sfbg text-sfnavy'}`}>All ({DATA_GLOSSARY.length})</button>
          {GLOSSARY_CATEGORIES.map(c => {
            const count = DATA_GLOSSARY.filter(t => t.category === c.id).length;
            return <button key={c.id} onClick={() => setFilter(c.id)} className={`text-xs px-2 py-1 rounded ${filter === c.id ? 'bg-sfblue text-white' : 'bg-sfbg text-sfnavy'}`}>{c.label} ({count})</button>;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{filtered.map(t => <GlossaryEntry key={t.term} t={t} />)}</div>
    </div>
  );
}

// =================== SUB-TAB: AUDIT TRAIL ===================
function AuditTrailView() {
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center flex-shrink-0">
            <History className="w-5 h-5 text-sfblue" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-sm font-semibold text-sfdeep">portfolio_audit_trail</h3>
            <p className="text-[11px] text-sfmuted">Append-only event log. Every change to initiative_inventory, stage_gate_artifacts, or playbooks. Immutable. Indexed by initiative_id, actor, ts.</p>
          </div>
          <span className="pill pill-blue self-start"><Shield className="w-3 h-3" />Source of Truth</span>
        </div>
        <div className="bg-sfbg border border-slate-200 rounded-lg p-3 mb-3 text-xs leading-relaxed text-sfnavy">
          When the CFO asks "who moved this initiative to off_track and when?", the answer is one query — not three Slack threads.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase text-sfmuted border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Timestamp</th>
                <th className="py-2 pr-3 font-semibold">Actor</th>
                <th className="py-2 pr-3 font-semibold">Action</th>
                <th className="py-2 pr-3 font-semibold">Target</th>
                <th className="py-2 pr-3 font-semibold">Field</th>
                <th className="py-2 pr-3 font-semibold">Before → After</th>
                <th className="py-2 pr-3 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_EVENTS.map((e, i) => {
                const isSystem = e.actor === 'system';
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-sfbg/60">
                    <td className="py-2 pr-3 font-mono text-[11px] text-sfmuted whitespace-nowrap">{e.ts}</td>
                    <td className="py-2 pr-3"><span className={isSystem ? 'text-sfmuted italic' : 'text-sfnavy font-medium'}>{e.actor}</span></td>
                    <td className="py-2 pr-3"><span className="font-mono text-[10px] uppercase tracking-wider text-sfblue">{e.action}</span></td>
                    <td className="py-2 pr-3 font-mono text-[11px] text-sfdeep font-semibold">{e.target}</td>
                    <td className="py-2 pr-3 font-mono text-[11px] text-sfmuted">{e.field}</td>
                    <td className="py-2 pr-3 text-[11px]"><span className="text-sfmuted">{e.before}</span> → <span className="text-sfnavy font-medium">{e.after}</span></td>
                    <td className="py-2 pr-3 text-[11px] text-sfmuted max-w-md">{e.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Retention:</strong> Append-only, 7 years (SOX-aligned)</div>
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Auto-events:</strong> System actor logs all auto-derived state changes</div>
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Query patterns:</strong> "Who changed X?" "What changed in last 24h?" "All changes by actor Y this quarter"</div>
        </div>
      </div>
    </div>
  );
}

// =================== MAIN ===================
const SUB_TABS = [
  { id: 'schema',  label: 'Schema',         icon: Database,    desc: '4 normalized tables — the data backbone' },
  { id: 'metrics', label: 'Metric Catalog', icon: Tag,         desc: '17 canonical metric definitions' },
  { id: 'glossary',label: 'Data Glossary',  icon: BookOpen,    desc: '33 portfolio terms with definitions' },
  { id: 'audit',   label: 'Audit Trail',    icon: History,     desc: 'Every change, ever — append-only' }
];

export default function DataModel() {
  const [sub, setSub] = useState('schema');

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Database className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-serif font-bold">Single Source of Truth</h2>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">
              The authoritative portfolio registry. <strong className="text-sflight">Every</strong> dashboard tile, KPI, Copilot answer, and exec report joins back here. When two people disagree on a number, this is where the disagreement gets resolved — not in Slack, not in email.
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-white/70">
              <span>📐 Schema: 4 tables, 1 audit trail</span>
              <span>📊 {METRIC_CATALOG.length} metrics with canonical definitions</span>
              <span>📖 {DATA_GLOSSARY.length} glossary terms</span>
              <span>📝 {AUDIT_EVENTS.length} audit events shown (append-only, 7-year retention)</span>
            </div>
          </div>
        </div>
      </div>

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

      {/* Active sub-tab */}
      {sub === 'schema'   && <SchemaView />}
      {sub === 'metrics'  && <MetricCatalogView />}
      {sub === 'glossary' && <GlossaryView />}
      {sub === 'audit'    && <AuditTrailView />}
    </div>
  );
}
