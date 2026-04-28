import React, { useState } from 'react';
import { Database, ChevronDown, Network, ListChecks, Users, FolderTree, History, Shield } from 'lucide-react';

// Sample audit trail events — JD #4: "Implement oversight mechanisms and audit trails that
// facilitate early risk detection and ensure all investments align with organizational quality
// standards throughout their lifecycle."
const AUDIT_EVENTS = [
  { ts: '2026-04-26 09:14', actor: 'Aisha Patel',     action: 'updated',    target: 'INI-103',  field: 'status',           before: 'in_progress', after: 'complete',     reason: 'Trust Center 2.0 launched; auto-derived from artifact ART-009 approval' },
  { ts: '2026-04-25 16:42', actor: 'Sr Mgr (Saurabh)',action: 'reassigned', target: 'INI-102',  field: 'pillar_pm',        before: 'Marcus Chen', after: 'Aisha Patel',  reason: 'Coverage during parental leave (June 17 → Sep 17)' },
  { ts: '2026-04-25 11:08', actor: 'system',          action: 'flagged',    target: 'ART-005',  field: 'status',           before: 'approved',    after: 'expired',      reason: 'expires_date < CURRENT_DATE() — auto-expire job' },
  { ts: '2026-04-24 14:30', actor: 'Jordan Reilly',   action: 'updated',    target: 'INI-116',  field: 'budget_spent',     before: '$2.10M',      after: '$2.30M',       reason: 'Q1 actuals reconciled from Anaplan' },
  { ts: '2026-04-22 10:11', actor: 'Sr Mgr (Saurabh)',action: 'created',    target: 'INI-115',  field: 'okr_mapping',      before: '[]',          after: "['V25-Trust','V25-Agentforce']", reason: 'AI Governance Framework added to V25 OKR map' },
  { ts: '2026-04-20 17:55', actor: 'system',          action: 'expired',    target: 'ART-003',  field: 'status',           before: 'needs_review',after: 'expired',      reason: 'Risk Register 90-day refresh missed' },
  { ts: '2026-04-19 13:20', actor: 'Renata Oliveira', action: 'updated',    target: 'INI-110',  field: 'status',           before: 'at_risk',     after: 'off_track',    reason: 'Risk Register expired + 78% spend / 50% built' },
  { ts: '2026-04-18 09:45', actor: 'Aarti Vyas',      action: 'approved',   target: 'ART-008',  field: 'status',           before: 'needs_review',after: 'approved',     reason: 'Architecture Review for INI-116 G2' },
  { ts: '2026-04-15 15:12', actor: 'Sr Mgr (Saurabh)',action: 'created',    target: 'PB-05',    field: 'playbook',         before: '—',           after: 'v0.3 Draft',   reason: 'Quarterly Rebalance Playbook v0.3 drafted for Q3 use' },
  { ts: '2026-04-12 11:30', actor: 'David Lindqvist', action: 'requested',  target: 'INI-104',  field: 'gate',             before: 'G1',          after: 'G2 (requested)', reason: 'PRD review pending CFO sponsor decision' }
];

const TABLES = [
  {
    icon: FolderTree,
    name: 'initiative_inventory',
    why: 'The master taxonomy of the portfolio — every initiative, exactly once. This is the "Source of Truth" the JD calls for. Pillar, stage, OKR mapping, sponsor, budget, FTE, last_reviewed all live here. Every other table joins back to this one. Without it, every report defines initiatives differently — which is the symptom Judette\'s 60-day plan exists to solve.',
    ddl: `CREATE TABLE det_portfolio.initiative_inventory (
  initiative_id     VARCHAR(10) PRIMARY KEY,
  initiative_name   VARCHAR(200) NOT NULL,
  pillar            VARCHAR(50)  NOT NULL,    -- FK pillars.pillar_id
  stage             VARCHAR(4)   NOT NULL,    -- G0..G5 (stage-gate taxonomy)
  status            VARCHAR(20)  NOT NULL,    -- on_track | at_risk | off_track | complete
  budget_allocated  DECIMAL(12,2),
  budget_spent      DECIMAL(12,2),
  ftes_allocated    INTEGER,
  start_date        DATE,
  target_launch     DATE,
  pillar_pm         VARCHAR(100),
  exec_sponsor      VARCHAR(100),
  okr_mapping       ARRAY,                    -- ['V25-Agentforce', ...]
  last_reviewed     DATE,
  created_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Indexes for fast portfolio reporting
CREATE INDEX idx_initiative_pillar    ON initiative_inventory(pillar);
CREATE INDEX idx_initiative_stage     ON initiative_inventory(stage);
CREATE INDEX idx_initiative_status    ON initiative_inventory(status);
CREATE INDEX idx_initiative_reviewed  ON initiative_inventory(last_reviewed);`,
    sample: [
      ['INI-101', 'Agentforce Internal Rollout', 'dap', 'G2', 'on_track', '$2.4M', '9 FTE', "['V25-Agentforce', 'V25-Employee-AI']"],
      ['INI-102', 'Workday HRIS Migration',     'ept', 'G2', 'off_track','$3.1M', '12 FTE',"['V25-Margin']"],
      ['INI-115', 'AI Governance Framework',    'ts',  'G1', 'at_risk',  '$850K', '4 FTE', "['V25-Trust', 'V25-Agentforce']"]
    ],
    sampleHeaders: ['initiative_id', 'name', 'pillar', 'stage', 'status', 'budget', 'fte', 'okr_mapping']
  },
  {
    icon: ListChecks,
    name: 'stage_gate_artifacts',
    why: 'The proof every initiative is governed correctly. Each stage-gate (G0–G5) requires specific artifacts — PRD, Architecture Review, Capacity Plan, Risk Register, Launch Readiness. The lifecycle states (approved → needs_review → expired → missing) drive the Stage-Gate Compliance KPI and feed the agent\'s "overdue review" answer. Same pattern as TrustReply\'s evidence_submissions — turning policy into observable state.',
    ddl: `CREATE TABLE det_portfolio.stage_gate_artifacts (
  artifact_id       VARCHAR(10) PRIMARY KEY,
  initiative_id     VARCHAR(10) REFERENCES initiative_inventory(initiative_id),
  gate              VARCHAR(4),               -- G0..G5
  artifact_type     VARCHAR(50),              -- 'PRD','Architecture Review','Capacity Plan','Risk Register'
  status            VARCHAR(20),              -- approved | needs_review | expired | missing
  approver          VARCHAR(100),
  collected_date    DATE,
  expires_date      DATE,
  source_system     VARCHAR(50),              -- Quip, Confluence, Anaplan, ServiceNow, GUS
  link              VARCHAR(500),
  created_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Auto-expire job runs daily; sets status='expired' when expires_date < CURRENT_DATE
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
    why: 'The portfolio is a graph, not a list. Cutting one initiative or slipping its date can cascade through 3–4 others. This table captures upstream/downstream relationships with type (blocks, gates, informs, shares_resources) and risk level. Powers the agent\'s "show dependencies for X" answer and the scenario-planning logic. Without it, capital allocation decisions are made blind to second-order effects.',
    ddl: `CREATE TABLE det_portfolio.dependencies (
  dependency_id     VARCHAR(10) PRIMARY KEY,
  upstream_id       VARCHAR(10) REFERENCES initiative_inventory(initiative_id),
  downstream_id     VARCHAR(10) REFERENCES initiative_inventory(initiative_id),
  dependency_type   VARCHAR(20),  -- blocks | gates | informs | shares_resources
  risk_level        VARCHAR(10),  -- high | medium | low
  notes             TEXT,
  created_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  -- prevent self-loops and duplicates
  CONSTRAINT no_self_dep CHECK (upstream_id <> downstream_id),
  CONSTRAINT uniq_pair UNIQUE (upstream_id, downstream_id, dependency_type)
);

-- Recursive CTE view: full upstream chain for any initiative
CREATE OR REPLACE VIEW v_initiative_chain AS
WITH RECURSIVE chain AS (
  SELECT initiative_id, initiative_id AS root, 0 AS depth
    FROM initiative_inventory
  UNION ALL
  SELECT d.upstream_id, c.root, c.depth + 1
    FROM dependencies d JOIN chain c ON d.downstream_id = c.initiative_id
   WHERE c.depth < 6
) SELECT * FROM chain;`,
    sample: [
      ['DEP-01', 'INI-116 (Lakehouse)',        'INI-101 (Agentforce)', 'blocks',           'high',   'Agentforce needs grounding data'],
      ['DEP-03', 'INI-115 (AI Governance)',    'INI-101 (Agentforce)', 'gates',            'high',   'AG approval gates production'],
      ['DEP-05', 'INI-102 (Workday)',          'INI-106 (HR Data)',    'shares_resources', 'medium', '4 shared FTEs in Q3']
    ],
    sampleHeaders: ['dependency_id', 'upstream', 'downstream', 'type', 'risk', 'notes']
  },
  {
    icon: Users,
    name: 'capacity_snapshots',
    why: 'Capacity is a moving target — engineers leave, hiring slips, scope creeps. Snapshots taken weekly let us see "what did we believe last Tuesday vs. what changed?" Drives the "where are we over-capacity?" answer and the FTE utilization bars on the Pillar grid. Snapshot-based design also enables scenario planning: "if I move 4 FTE from Pillar X to Y, what does next week\'s allocation look like?"',
    ddl: `CREATE TABLE det_portfolio.capacity_snapshots (
  snapshot_id       VARCHAR(15) PRIMARY KEY,
  pillar            VARCHAR(50),
  fte_capacity      INTEGER,         -- approved headcount + contractors
  fte_allocated     INTEGER,         -- sum of initiative FTE asks for this snapshot week
  budget_capacity   DECIMAL(12,2),   -- pillar's quarterly budget
  budget_allocated  DECIMAL(12,2),
  snapshot_date     DATE NOT NULL,
  notes             TEXT,
  created_at        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- One snapshot per pillar per week (idempotent)
CREATE UNIQUE INDEX idx_capacity_uniq ON capacity_snapshots(pillar, snapshot_date);

-- Trend view: % capacity allocated over rolling 12 weeks per pillar
CREATE OR REPLACE VIEW v_capacity_trend AS
SELECT pillar,
       snapshot_date,
       fte_allocated * 100.0 / NULLIF(fte_capacity, 0) AS pct_allocated
  FROM capacity_snapshots
 WHERE snapshot_date >= DATEADD(week, -12, CURRENT_DATE());`,
    sample: [
      ['CAP-2026W17-ept', 'Employee Productivity', '28', '31', '$5.6M', '$5.1M', '2026-04-22'],
      ['CAP-2026W17-fot', 'Finance & Ops Tech',    '30', '33', '$7.2M', '$6.0M', '2026-04-22'],
      ['CAP-2026W17-ts',  'Trust & Security',      '22', '19', '$3.5M', '$2.9M', '2026-04-22']
    ],
    sampleHeaders: ['snapshot_id', 'pillar', 'fte_cap', 'fte_alloc', 'budget_cap', 'budget_alloc', 'date']
  }
];

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
        <button
          onClick={() => setOpen(o => !o)}
          className="text-xs text-sfblue hover:underline flex items-center gap-1"
        >
          Why this table? <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="bg-sfbg border border-slate-200 rounded-lg p-3 mb-3 text-sm leading-relaxed text-sfnavy">
          {table.why}
        </div>
      )}

      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold mb-1">DDL</div>
        <pre className="sql-block">{table.ddl}</pre>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold mb-1">Sample data</div>
        <div className="overflow-x-auto">
          <table className="text-[11px] w-full">
            <thead>
              <tr>
                {table.sampleHeaders.map(h => (
                  <th key={h} className="text-left p-2 bg-sfbg border border-slate-200 font-mono text-sfdeep font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.sample.map((row, i) => (
                <tr key={i}>
                  {row.map((c, j) => (
                    <td key={j} className="p-2 border border-slate-200 font-mono">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DataModel() {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-sfnavy to-sfdeep text-white">
        <div className="flex items-start gap-3">
          <Database className="w-6 h-6 text-sflight flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-serif font-semibold">Master Portfolio Schema</h2>
            <p className="text-sm text-white/80 mt-1 leading-relaxed">
              Four normalized tables that act as the Source of Truth for DET portfolio reporting. Every dashboard tile, every Copilot answer, every executive report joins back to <span className="font-mono text-sflight">initiative_inventory</span>. The schema is intentionally small — covers ~80% of use cases. Expand to <span className="font-mono">benefits_realization</span>, <span className="font-mono">stage_history</span>, <span className="font-mono">vendor_contracts</span> as adoption grows.
            </p>
            <p className="text-xs text-white/60 mt-3">
              <strong>JD mapping:</strong> "Define and govern the master taxonomy and metadata standards for portfolio and operational data" + "Act as the primary authority for data integrity, ensuring a reliable Source of Truth."
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TABLES.map(t => <TableCard key={t.name} table={t} />)}
      </div>

      {/* AUDIT TRAIL — JD #4 */}
      <div className="card">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-sfblue/10 grid place-items-center flex-shrink-0">
            <History className="w-5 h-5 text-sfblue" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-sm font-semibold text-sfdeep">portfolio_audit_trail</h3>
            <p className="text-[11px] text-sfmuted">Append-only event log — every change to initiative_inventory, stage_gate_artifacts, or playbooks. Immutable. Indexed by initiative_id, actor, and ts.</p>
          </div>
          <span className="pill pill-blue self-start"><Shield className="w-3 h-3" />JD #4</span>
        </div>
        <div className="bg-sfbg border border-slate-200 rounded-lg p-3 mb-3 text-xs leading-relaxed text-sfnavy">
          <strong>Why this matters:</strong> JD #4 — "Implement oversight mechanisms and audit trails that facilitate early risk detection and ensure all investments align with organizational quality standards throughout their lifecycle." When the CFO asks "who moved this initiative to off_track and when?", the answer is one query, not three Slack threads.
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
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Auto-events:</strong> System actor logs all auto-derived state changes (artifact expiry, status auto-flag)</div>
          <div className="bg-sfbg rounded p-2"><strong className="text-sfnavy">Query patterns:</strong> "Who changed X?" "What changed in the last 24h?" "All changes by actor Y this quarter"</div>
        </div>
      </div>
    </div>
  );
}
