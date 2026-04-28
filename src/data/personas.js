// Persona definitions — RBAC for the demo.
// In production, persona + pillar would be derived from the identity provider
// (Okta/Entra) at login. Here, we let the viewer switch manually to demonstrate
// how the same workspace adapts to different roles.

export const PERSONAS = [
  {
    id: 'sr-manager',
    role: 'Sr Manager',
    label: 'Sr Manager · Strategic Portfolio Mgmt',
    desc: 'Default — full operating view. All initiatives, all calculators, all team coaching.',
    pillarFilter: null,
    pillarLabel: null,
    hideTabs: [],
    readOnly: false,
    accent: 'text-sflight'
  },
  {
    id: 'director',
    role: 'Director',
    label: 'Director · Business Process',
    desc: 'Strategic lens — recommendations and trade-offs only. Operational details hidden.',
    pillarFilter: null,
    pillarLabel: null,
    hideTabs: ['operate'],
    readOnly: false,
    accent: 'text-sgreen'
  },
  {
    id: 'pillar-pm-dap',
    role: 'Pillar PM',
    label: 'Pillar PM · Data & AI Platform',
    desc: 'Scoped to Data & AI Platform initiatives only. Cross-pillar context shown but not editable.',
    pillarFilter: 'dap',
    pillarLabel: 'Data & AI Platform',
    hideTabs: ['operate', 'workbench'],
    readOnly: false,
    accent: 'text-syellow'
  },
  {
    id: 'pillar-pm-ts',
    role: 'Pillar PM',
    label: 'Pillar PM · Trust & Security',
    desc: 'Scoped to Trust & Security initiatives only. Cross-pillar context shown but not editable.',
    pillarFilter: 'ts',
    pillarLabel: 'Trust & Security',
    hideTabs: ['operate', 'workbench'],
    readOnly: false,
    accent: 'text-syellow'
  },
  {
    id: 'pillar-pm-fe',
    role: 'Pillar PM',
    label: 'Pillar PM · Field Engagement',
    desc: 'Scoped to Field Engagement initiatives only.',
    pillarFilter: 'fe',
    pillarLabel: 'Field Engagement',
    hideTabs: ['operate', 'workbench'],
    readOnly: false,
    accent: 'text-syellow'
  },
  {
    id: 'sponsor',
    role: 'Sponsor',
    label: 'Executive Sponsor',
    desc: 'Read-only summary view. KPIs, value realization, and exec comms — no operational depth.',
    pillarFilter: null,
    pillarLabel: null,
    hideTabs: ['operate', 'decisions', 'data'],
    readOnly: true,
    accent: 'text-sred'
  }
];

export function getPersona(id) {
  return PERSONAS.find(p => p.id === id) || PERSONAS[0];
}
