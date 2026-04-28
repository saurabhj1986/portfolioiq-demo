// 360° Portfolio Influence Factors — beyond RICE / TCO / Risk.
// What an experienced Sr Portfolio Manager actually weighs in real decisions.

// Each initiative scored on 10 non-financial dimensions. Scores are 1-5
// (5 = strongest / best for the portfolio; 1 = weakest / worst).
// Some factors are signed: negative tech_debt means it INCREASES debt; positive means it REDUCES debt.

export const INFLUENCE_FACTORS = {
  'INI-101': { // Agentforce Internal Rollout
    dataQuality:      { score: 4, owner: 'Jordan Reilly',   completeness: 95, freshness: 'current',     accuracy: 'high',   note: 'Strong — telemetry pipeline already instrumented' },
    dataGovernance:   { score: 3, classification: 'Internal',compliance: ['EU AI Act','SOC 2','ISO 42001'], steward: 'Lena Wu',       residency: 'US/EU',   note: 'AI Act compliance pending CC-18 framework approval' },
    vendorRisk:       { score: 2, primary: 'Azure OpenAI',  concentration: 'high', alternative: 'Anthropic in eval', note: 'Heavy single-vendor exposure' },
    talentRisk:       { score: 4, keyPersonRisk: 'medium',  hiringGap: 0,           contractorMix: '20%', note: 'Solid bench; Jordan is single point of failure' },
    regulatory:       { score: 2, exposure: ['EU AI Act','GDPR'], blockers: ['EU AI Office filing'], note: 'High exposure but compliance roadmap exists' },
    techDebt:         { score: 4, delta: 'reduces',          note: 'Replaces legacy chatbot stack' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: true,    note: 'Azure green-compute regions available' },
    equalityInclusion:{ score: 4, accessibility: 'positive', inclusion: 'high',     note: 'Multilingual, screen-reader-tested by design' },
    customerSat:      { score: 5, signal: 'strongly_positive', surveys: 14,         note: 'Internal pilot users report 4.6/5 helpfulness' },
    marketTiming:     { score: 5, window: 'open_strong',     urgency: 'high',       note: 'Salesforce stated #1 strategic bet — window is now' }
  },
  'INI-102': { // Workday HRIS Migration
    dataQuality:      { score: 2, owner: 'Marcus Chen',     completeness: 64, freshness: 'stale',       accuracy: 'medium', note: 'HR data has known dupes; pre-migration cleansing required' },
    dataGovernance:   { score: 2, classification: 'Restricted', compliance: ['GDPR','CCPA','SOX'], steward: 'Nina Burke', residency: 'US/EU/AU', note: 'PII-heavy; data minimization audit pending' },
    vendorRisk:       { score: 3, primary: 'Workday',       concentration: 'high', alternative: 'no realistic switch', note: 'Standard HR vendor lock-in' },
    talentRisk:       { score: 2, keyPersonRisk: 'high',    hiringGap: 2,           contractorMix: '40%', note: 'Marcus on parental leave starting June — coverage critical' },
    regulatory:       { score: 3, exposure: ['GDPR','SOX'], blockers: [],           note: 'Standard HR compliance posture' },
    techDebt:         { score: 4, delta: 'reduces',          note: 'Retires PeopleSoft + 3 satellite systems' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: true,    note: 'Workday cloud-native; minor footprint reduction' },
    equalityInclusion:{ score: 3, accessibility: 'neutral',  inclusion: 'medium',   note: 'Workday native accessibility is decent' },
    customerSat:      { score: 2, signal: 'mixed',           surveys: 8,            note: 'Employee satisfaction with HR tools currently 2.8/5 — bar is low' },
    marketTiming:     { score: 3, window: 'open',            urgency: 'medium',     note: 'No competitive pressure; pure internal modernization' }
  },
  'INI-103': { // Trust Center 2.0 — complete
    dataQuality:      { score: 5, owner: 'Aisha Patel',     completeness: 100, freshness: 'current',     accuracy: 'high',   note: 'Live; data quality monitored continuously' },
    dataGovernance:   { score: 5, classification: 'Public',  compliance: ['SOC 2','ISO 27001','EU-US DPF'], steward: 'Lena Wu', residency: 'Global', note: 'Reference implementation for the rest of DET' },
    vendorRisk:       { score: 5, primary: 'In-house',       concentration: 'low',  alternative: 'n/a', note: 'No external dependencies' },
    talentRisk:       { score: 5, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '0%',  note: 'Sustain phase; lean ops team' },
    regulatory:       { score: 5, exposure: ['Multiple'],   blockers: [],           note: 'Designed to demonstrate compliance, not require it' },
    techDebt:         { score: 5, delta: 'reduces',          note: 'Replaced 3 sub-pages + manual upload flow' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Static site — minimal runtime footprint' },
    equalityInclusion:{ score: 5, accessibility: 'positive', inclusion: 'high',     note: 'WCAG 2.2 AA certified' },
    customerSat:      { score: 5, signal: 'strongly_positive', surveys: 22,        note: 'Reduced customer security questions by 40%' },
    marketTiming:     { score: 4, window: 'fulfilled',       urgency: 'low',        note: 'Shipped — value being realized' }
  },
  'INI-104': { // Anaplan Capital Planning Migration
    dataQuality:      { score: 2, owner: 'David Lindqvist', completeness: 55, freshness: 'stale',       accuracy: 'low',    note: 'Capital data spread across 4 spreadsheets; reconciliation issues' },
    dataGovernance:   { score: 2, classification: 'Confidential', compliance: ['SOX'], steward: 'Ravi Ahuja', residency: 'US', note: 'No formal data governance on capital plans today' },
    vendorRisk:       { score: 3, primary: 'Anaplan',       concentration: 'high', alternative: 'Pigment, Workday Adaptive', note: 'Standard FP&A vendor lock' },
    talentRisk:       { score: 3, keyPersonRisk: 'medium',  hiringGap: 1,           contractorMix: '30%', note: 'Specialized Anaplan modelers needed' },
    regulatory:       { score: 4, exposure: ['SOX'],         blockers: [],           note: 'SOX-relevant; needs audit trail design' },
    techDebt:         { score: 3, delta: 'reduces',          note: 'Replaces 4 Excel workbooks' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: false,   note: 'Anaplan SaaS; no specific green options' },
    equalityInclusion:{ score: 2, accessibility: 'neutral',  inclusion: 'low',      note: 'Specialist tool; limited accessibility scope' },
    customerSat:      { score: 3, signal: 'cautious_positive', surveys: 5,          note: 'Finance team excited but skeptical of timelines' },
    marketTiming:     { score: 2, window: 'closing_slow',    urgency: 'low',        note: 'No external pressure; can be deferred without harm' }
  },
  'INI-105': { // Slack Sales Elevate
    dataQuality:      { score: 4, owner: 'Renata Oliveira', completeness: 88, freshness: 'current',     accuracy: 'high',   note: 'Sales activity data well-instrumented' },
    dataGovernance:   { score: 4, classification: 'Internal',compliance: ['SOC 2'], steward: 'Tom Harlow',     residency: 'US',      note: 'Standard sales data governance' },
    vendorRisk:       { score: 4, primary: 'Slack',         concentration: 'low',  alternative: 'in-house Salesforce platform', note: 'Slack is wholly owned' },
    talentRisk:       { score: 4, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '0%',  note: 'Healthy team' },
    regulatory:       { score: 4, exposure: [],              blockers: [],           note: 'Internal-only; minimal exposure' },
    techDebt:         { score: 4, delta: 'reduces',          note: 'Consolidates 2 sales tools' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Reduces email + meeting volume' },
    equalityInclusion:{ score: 4, accessibility: 'positive', inclusion: 'high',     note: 'Slack accessibility well-tested' },
    customerSat:      { score: 5, signal: 'strongly_positive', surveys: 38,        note: 'Sales adoption +18% above target' },
    marketTiming:     { score: 4, window: 'open',            urgency: 'medium',     note: 'Sales productivity always in season' }
  },
  'INI-106': { // Data Cloud for HR Analytics
    dataQuality:      { score: 3, owner: 'Marcus Chen',     completeness: 72, freshness: 'mixed',       accuracy: 'medium', note: 'Depends on Workday cleanup (INI-102) finishing' },
    dataGovernance:   { score: 3, classification: 'Restricted', compliance: ['GDPR','CCPA'], steward: 'Nina Burke', residency: 'US/EU', note: 'PII handling needs Privacy Vault dependency' },
    vendorRisk:       { score: 4, primary: 'Salesforce Data Cloud', concentration: 'low', alternative: 'in-house', note: 'Internal product' },
    talentRisk:       { score: 3, keyPersonRisk: 'medium',  hiringGap: 1,           contractorMix: '20%', note: 'Marcus on leave during build' },
    regulatory:       { score: 3, exposure: ['GDPR'],        blockers: [],           note: 'Standard people-data exposure' },
    techDebt:         { score: 4, delta: 'reduces',          note: 'Replaces ad-hoc HR dashboards' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: true,    note: 'Standard Data Cloud footprint' },
    equalityInclusion:{ score: 4, accessibility: 'positive', inclusion: 'high',     note: 'Will surface DEI metrics to leadership' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 6,            note: 'CHRO eager for self-serve analytics' },
    marketTiming:     { score: 3, window: 'open',            urgency: 'medium',     note: 'Leadership wants this; not on critical path' }
  },
  'INI-107': { // Privacy Vault & DSAR Automation
    dataQuality:      { score: 4, owner: 'Aisha Patel',     completeness: 90, freshness: 'current',     accuracy: 'high',   note: 'PII inventory mostly mapped' },
    dataGovernance:   { score: 5, classification: 'Restricted', compliance: ['GDPR','CCPA','LGPD','PIPEDA'], steward: 'Lena Wu', residency: 'Global', note: 'Will become the gold-standard governance mechanism' },
    vendorRisk:       { score: 4, primary: 'In-house + OneTrust', concentration: 'low', alternative: 'BigID', note: 'Diversified' },
    talentRisk:       { score: 4, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '15%', note: 'Privacy team well-staffed' },
    regulatory:       { score: 5, exposure: ['Multiple'],   blockers: [],           note: 'Designed FOR regulatory compliance' },
    techDebt:         { score: 5, delta: 'reduces',          note: 'Replaces 6 manual DSAR processes' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Reduces data sprawl' },
    equalityInclusion:{ score: 5, accessibility: 'positive', inclusion: 'high',     note: 'Equality of data rights across jurisdictions' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 9,            note: 'Customer trust signal — explicit ask in 4 enterprise renewals' },
    marketTiming:     { score: 5, window: 'open_strong',     urgency: 'high',       note: 'EU regulatory push; 2 customer renewals gated on this' }
  },
  'INI-108': { // Customer 360 Voice (Genie+)
    dataQuality:      { score: 3, owner: 'Priya Sundaram',  completeness: 60, freshness: 'mixed',       accuracy: 'medium', note: 'Voice transcription quality varies by language' },
    dataGovernance:   { score: 3, classification: 'Confidential', compliance: ['GDPR','CCPA'], steward: 'Sarah Holt', residency: 'US/EU', note: 'Voice recordings need explicit consent flows' },
    vendorRisk:       { score: 3, primary: 'AssemblyAI',    concentration: 'medium',alternative: 'Deepgram in eval', note: 'Reasonable alternatives exist' },
    talentRisk:       { score: 3, keyPersonRisk: 'medium',  hiringGap: 2,           contractorMix: '30%', note: 'NLP/voice ML specialists needed' },
    regulatory:       { score: 3, exposure: ['GDPR','BIPA'],blockers: [],           note: 'Voice biometrics is a regulatory minefield' },
    techDebt:         { score: 3, delta: 'neutral',          note: 'Net-new capability' },
    sustainability:   { score: 2, carbonImpact: 'negative', greenCompute: false,   note: 'Voice ML is compute-heavy' },
    equalityInclusion:{ score: 3, accessibility: 'mixed',    inclusion: 'medium',   note: 'Voice tech accessibility uneven across accents/languages' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 11,           note: 'Strong directional signal from CX research' },
    marketTiming:     { score: 4, window: 'open',            urgency: 'medium',     note: 'AI-voice market emerging; not late, not early' }
  },
  'INI-109': { // Mulesoft API Hub Consolidation
    dataQuality:      { score: 4, owner: 'Jordan Reilly',   completeness: 85, freshness: 'current',     accuracy: 'high',   note: 'API metadata well-tracked' },
    dataGovernance:   { score: 4, classification: 'Internal',compliance: ['SOC 2'], steward: 'Aarti Vyas',     residency: 'Global', note: 'API governance maturing' },
    vendorRisk:       { score: 4, primary: 'Mulesoft (SF)', concentration: 'low',  alternative: 'in-house', note: 'Wholly-owned subsidiary' },
    talentRisk:       { score: 4, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '10%', note: 'Established platform team' },
    regulatory:       { score: 4, exposure: [],              blockers: [],           note: 'Infrastructure; minimal direct exposure' },
    techDebt:         { score: 5, delta: 'reduces',          note: 'Retires 11 point-to-point integrations' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Reduces compute via API consolidation' },
    equalityInclusion:{ score: 3, accessibility: 'neutral',  inclusion: 'medium',   note: 'Internal infrastructure; limited surface' },
    customerSat:      { score: 3, signal: 'mixed',           surveys: 4,            note: 'Internal devs wary of breaking changes' },
    marketTiming:     { score: 3, window: 'open',            urgency: 'low',        note: 'Tech-debt work; no external pressure' }
  },
  'INI-110': { // CPQ Modernization
    dataQuality:      { score: 2, owner: 'Renata Oliveira', completeness: 58, freshness: 'stale',       accuracy: 'low',    note: 'Pricing data inconsistent across product lines' },
    dataGovernance:   { score: 2, classification: 'Confidential', compliance: ['SOX'], steward: 'Tom Harlow', residency: 'US/EU', note: 'Pricing governance needs overhaul' },
    vendorRisk:       { score: 3, primary: 'Salesforce CPQ',concentration: 'high', alternative: 'in-house', note: 'Internal product but specific module' },
    talentRisk:       { score: 2, keyPersonRisk: 'high',    hiringGap: 3,           contractorMix: '50%', note: 'CPQ specialists scarce; Renata under pressure' },
    regulatory:       { score: 3, exposure: ['SOX','ASC 606'], blockers: [],         note: 'Revenue recognition implications' },
    techDebt:         { score: 3, delta: 'reduces',          note: 'Replaces 3 legacy quote tools' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: true,    note: 'Standard SF cloud footprint' },
    equalityInclusion:{ score: 2, accessibility: 'neutral',  inclusion: 'low',      note: 'Internal sales tool' },
    customerSat:      { score: 2, signal: 'negative',        surveys: 12,           note: 'Sales reps frustrated with current tool — but also wary of change' },
    marketTiming:     { score: 3, window: 'open',            urgency: 'medium',     note: 'Sales cycle pressure mounting' }
  },
  'INI-111': { // Tableau Embedded Exec Dashboards
    dataQuality:      { score: 5, owner: 'Jordan Reilly',   completeness: 96, freshness: 'current',     accuracy: 'high',   note: 'Curated exec datasets' },
    dataGovernance:   { score: 5, classification: 'Internal',compliance: ['SOC 2'], steward: 'Aarti Vyas',     residency: 'US/EU',  note: 'Reference governance' },
    vendorRisk:       { score: 5, primary: 'Tableau (SF)',  concentration: 'low',  alternative: 'in-house', note: 'Wholly-owned' },
    talentRisk:       { score: 5, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '0%',  note: 'Live; sustain only' },
    regulatory:       { score: 5, exposure: [],              blockers: [],           note: '—' },
    techDebt:         { score: 4, delta: 'reduces',          note: 'Retires 6 ad-hoc dashboards' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Cached aggregates' },
    equalityInclusion:{ score: 4, accessibility: 'positive', inclusion: 'medium',   note: 'Exec audience' },
    customerSat:      { score: 5, signal: 'strongly_positive', surveys: 18,        note: 'Exec NPS 9.2' },
    marketTiming:     { score: 4, window: 'fulfilled',       urgency: 'low',        note: 'Shipped' }
  },
  'INI-112': { // ServiceNow Consolidation
    dataQuality:      { score: 2, owner: 'David Lindqvist', completeness: 50, freshness: 'stale',       accuracy: 'low',    note: 'Ticket taxonomy fragmented across 4 instances' },
    dataGovernance:   { score: 1, classification: 'Internal',compliance: ['SOX'], steward: 'unassigned', residency: 'US',     note: 'NO ASSIGNED STEWARD — governance breach' },
    vendorRisk:       { score: 3, primary: 'ServiceNow',    concentration: 'high', alternative: 'Atlassian, Freshservice', note: 'Industry standard' },
    talentRisk:       { score: 2, keyPersonRisk: 'high',    hiringGap: 4,           contractorMix: '60%', note: 'Heavy contractor reliance; capacity plan MISSING' },
    regulatory:       { score: 3, exposure: ['SOX'],         blockers: [],           note: 'Standard ITSM compliance' },
    techDebt:         { score: 5, delta: 'reduces',          note: 'Consolidates 4 instances → 1' },
    sustainability:   { score: 3, carbonImpact: 'positive', greenCompute: true,    note: 'Modest footprint reduction' },
    equalityInclusion:{ score: 2, accessibility: 'neutral',  inclusion: 'low',      note: 'Internal IT tool' },
    customerSat:      { score: 2, signal: 'mixed',           surveys: 7,            note: 'Internal IT teams divided on consolidation' },
    marketTiming:     { score: 2, window: 'open',            urgency: 'low',        note: 'Pure internal modernization' }
  },
  'INI-113': { // Marketing Cloud Personalization
    dataQuality:      { score: 4, owner: 'Priya Sundaram',  completeness: 86, freshness: 'current',     accuracy: 'high',   note: 'Marketing data clean post-2025 cleanup' },
    dataGovernance:   { score: 4, classification: 'Confidential', compliance: ['GDPR','CCPA','CAN-SPAM'], steward: 'Sarah Holt', residency: 'US/EU', note: 'Marketing data governance mature' },
    vendorRisk:       { score: 5, primary: 'Marketing Cloud (SF)', concentration: 'low', alternative: 'in-house', note: 'Wholly-owned' },
    talentRisk:       { score: 4, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '20%', note: 'Marketing engineering team established' },
    regulatory:       { score: 3, exposure: ['GDPR','CCPA'],blockers: [],           note: 'Personalization always carries privacy risk' },
    techDebt:         { score: 3, delta: 'neutral',          note: 'Adds capability without removing' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: true,    note: 'Standard footprint' },
    equalityInclusion:{ score: 3, accessibility: 'positive', inclusion: 'medium',   note: 'Personalization done right reduces filter bubbles' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 16,           note: 'Strong CMO sponsorship' },
    marketTiming:     { score: 5, window: 'open_strong',     urgency: 'high',       note: 'Cookie deprecation pressure; window narrowing' }
  },
  'INI-114': { // Slack Huddles AI Summaries
    dataQuality:      { score: 4, owner: 'Marcus Chen',     completeness: 90, freshness: 'current',     accuracy: 'high',   note: 'Audio quality good; transcription baseline strong' },
    dataGovernance:   { score: 3, classification: 'Internal',compliance: ['SOC 2'], steward: 'Marcus Chen',  residency: 'US/EU',  note: 'Recording consent flows in design review' },
    vendorRisk:       { score: 4, primary: 'OpenAI Whisper',concentration: 'medium', alternative: 'Deepgram', note: 'Reasonable diversification path' },
    talentRisk:       { score: 4, keyPersonRisk: 'low',     hiringGap: 0,           contractorMix: '15%', note: 'Small team; well-defined scope' },
    regulatory:       { score: 3, exposure: ['GDPR (EU calls)'],blockers: [],       note: 'Recording consent surfaced in flow' },
    techDebt:         { score: 4, delta: 'reduces',          note: 'Eliminates manual meeting-notes labor' },
    sustainability:   { score: 3, carbonImpact: 'neutral',   greenCompute: true,    note: 'On-demand inference' },
    equalityInclusion:{ score: 5, accessibility: 'positive', inclusion: 'high',     note: 'Massive accessibility win for d/Deaf + non-native speakers' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 13,           note: 'Beta testers highly enthusiastic' },
    marketTiming:     { score: 4, window: 'open_strong',     urgency: 'high',       note: 'AI meeting summary is table stakes now' }
  },
  'INI-115': { // AI Governance Framework
    dataQuality:      { score: 3, owner: 'Aisha Patel',     completeness: 70, freshness: 'mixed',       accuracy: 'medium', note: 'Model inventory partially complete' },
    dataGovernance:   { score: 5, classification: 'Restricted', compliance: ['EU AI Act','ISO 42001','NIST AI RMF'], steward: 'Lena Wu', residency: 'Global', note: 'Will define governance for ALL AI initiatives' },
    vendorRisk:       { score: 5, primary: 'In-house',       concentration: 'low',  alternative: 'n/a', note: 'No vendor — this IS the governance layer' },
    talentRisk:       { score: 3, keyPersonRisk: 'high',    hiringGap: 1,           contractorMix: '25%', note: 'AI governance specialists scarce industry-wide' },
    regulatory:       { score: 5, exposure: ['EU AI Act','many'], blockers: ['EU AI Office filing'], note: 'Designed FOR regulatory compliance' },
    techDebt:         { score: 5, delta: 'reduces',          note: 'Eliminates ad-hoc AI risk assessments' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Will require model carbon disclosure' },
    equalityInclusion:{ score: 5, accessibility: 'positive', inclusion: 'high',     note: 'Bias auditing built into framework' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 6,            note: 'Customers asking for AI governance evidence in renewals' },
    marketTiming:     { score: 5, window: 'open_strong',     urgency: 'critical',   note: 'EU AI Act enforcement timeline; gates Agentforce launch' }
  },
  'INI-116': { // Data Lakehouse on Snowflake
    dataQuality:      { score: 4, owner: 'Jordan Reilly',   completeness: 88, freshness: 'current',     accuracy: 'high',   note: 'Foundation for portfolio-wide data quality uplift' },
    dataGovernance:   { score: 5, classification: 'Mixed',   compliance: ['SOC 2','GDPR','HIPAA'], steward: 'Aarti Vyas', residency: 'US/EU/AU', note: 'Will become enterprise data governance hub' },
    vendorRisk:       { score: 3, primary: 'Snowflake',     concentration: 'high', alternative: 'Databricks evaluated', note: 'Long-term commitment with switching cost' },
    talentRisk:       { score: 4, keyPersonRisk: 'medium',  hiringGap: 1,           contractorMix: '30%', note: 'Snowflake skills available in market' },
    regulatory:       { score: 4, exposure: ['Multiple'],   blockers: [],           note: 'Standard data platform compliance' },
    techDebt:         { score: 5, delta: 'reduces',          note: 'Replaces 4 data warehouses + 2 lakes' },
    sustainability:   { score: 4, carbonImpact: 'positive', greenCompute: true,    note: 'Snowflake auto-suspend reduces idle compute' },
    equalityInclusion:{ score: 3, accessibility: 'neutral',  inclusion: 'medium',   note: 'Foundational; downstream apps determine impact' },
    customerSat:      { score: 4, signal: 'positive',        surveys: 9,            note: 'Internal data consumers eager' },
    marketTiming:     { score: 5, window: 'open_strong',     urgency: 'high',       note: 'Blocks Agentforce + HR Data Cloud — critical-path' }
  }
};

// Factor metadata for the UI — trimmed to 8 JD-explicit dimensions.
// Sustainability + Equality were dropped (Salesforce core values, but not in JR337298 JD — scope discipline).
export const FACTOR_META = [
  { key: 'dataQuality',    label: 'Data Quality',          icon: '📊', tip: 'Completeness, freshness, accuracy of the data this initiative relies on or produces. A high-RICE initiative built on bad data still ships bad outcomes.', jd: 'Increase data quality (#6); Source of Truth (#7)' },
  { key: 'dataGovernance', label: 'Data Governance',       icon: '🛡️', tip: 'Named steward, data classification, compliance flags. Without governance, every initiative becomes someone else\'s cleanup project.', jd: 'Master taxonomy and metadata standards (#5)' },
  { key: 'vendorRisk',     label: 'Vendor & Tech Concentration', icon: '🔗', tip: 'Single-vendor lock-in risk and architectural concentration. Critical at Salesforce given heavy own-product use + strategic vendor partnerships.', jd: 'Innovation, product, and technology ecosystems' },
  { key: 'talentRisk',     label: 'Talent & Capacity',     icon: '👥', tip: 'Hiring gaps, contractor mix, key-person risk. Predicts which initiatives will stall during a leave or attrition event.', jd: 'Capacity planning across competing demands' },
  { key: 'regulatory',     label: 'Regulatory & Compliance', icon: '⚖️', tip: 'GDPR, SOX, EU AI Act, HIPAA. High exposure isn\'t bad — but it has to be planned for, not discovered late.', jd: 'Organizational quality standards throughout lifecycle (#4)' },
  { key: 'techDebt',       label: 'Tech Debt Delta',       icon: '🧹', tip: 'Does this initiative INCREASE or REDUCE tech debt? Initiatives that reduce debt deserve disproportionate weight.', jd: 'Innovation, product, and technology ecosystems' },
  { key: 'customerSat',    label: 'Stakeholder Signal',    icon: '😊', tip: 'Direct user/customer signal. Survey count + sentiment. Distinguishes "we think this is valuable" from "they\'re asking for it".', jd: 'Value realization (#13)' },
  { key: 'marketTiming',   label: 'Market Timing',         icon: '⏰', tip: 'Is the window open, closing, or fulfilled? Some initiatives lose 80% of value if shipped 6 months late.', jd: 'Anticipate dependencies, resource constraints, market impacts (#11)' }
];

export function avgInfluenceScore(id) {
  const f = INFLUENCE_FACTORS[id];
  if (!f) return 0;
  const scores = FACTOR_META.map(m => f[m.key]?.score || 0);
  return Math.round((scores.reduce((s, x) => s + x, 0) / scores.length) * 10) / 10;
}
