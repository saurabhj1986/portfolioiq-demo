# Demo Script — PortfolioIQ for JR337298

## 30-second opener (memorize this)

> "This is **PortfolioIQ** — a portfolio intelligence prototype I built specifically for the DET Senior Manager role. The premise: portfolio governance is fundamentally a **data architecture problem with an adoption layer on top**. I translated every line of the JD into a working feature — playbooks, stage-gate scoring, capital optimization, an AI agent for portfolio questions, and a team cockpit for the four direct reports. All mock data, no real Salesforce systems connected — the architecture is what's transferable on day one."

## 10-second elevator (if they say "what is it?")

> "A working prototype of the DET portfolio system Judette's 60–90 day plan describes — built end-to-end so we can talk about real trade-offs, not abstract ideas."

---

## Round 1 — Judette Platz (45 min · Manage Ambiguity & Strategic Leadership)

**Don't share screen unless she asks.** This round is behavioral. Reference the prototype as the STAR story.

**STAR Story: "Building PortfolioIQ from a JD"**
- **S:** I had the JR337298 JD, the candidate prep guide, and a recruiter screening — no requirements doc, no users defined, no live data.
- **T:** Translate that ambiguity into a tangible artifact that demonstrates how I'd execute the 60–90 day plan, in under 2 weeks.
- **A:** Picked the wedge — taxonomy + standards + frameworks first, since that's literally Judette's day-60 milestone. Designed a 4-table schema. Built 7 playbooks (4 GA, 2 Pilot, 1 Draft). Stood up 5 portfolio KPIs. Wrote 4 scenarios mapped to Salesforce core values. Made every framework tooltipped so adoption isn't gated on training.
- **R:** A 7-tab live prototype at [URL]. Every JD line maps to a feature in the JD Coverage Matrix. The "How I Built This" tab documents 9 design decisions, 7 questions I'd ask Judette before locking v1, and 7 honest gaps in week-1 learning agenda.

**Bridge sentence:** "I wanted to come into Round 1 with proof I think about this work the way you'd want me to think about it on day 90 — not just talk about it."

**Questions to ask her (have 3 ready):**
1. "What does 'Process Governance Excellence' look like to you in the first quarter — is it more about taxonomy and standards, or more about adoption mechanics?"
2. "The prep guide mentions an emerging agentic workforce. Is that a separate initiative, or part of this role's scope?"
3. "Of the current 4 Pillar PMs, which is most under-served by the current portfolio process today?"

---

## Round 2 — Kyle Poor (45 min · Drive Innovation & Portfolio Governance)

**This is THE round to share screen.** Kyle's competency is "Drive Innovation" with the AI-tools bonus qualification. The prototype is the answer.

**3-minute walkthrough (rehearse with a timer):**

| Time | Tab | What to say |
|---|---|---|
| 0:00–0:20 | Dashboard | "5 KPIs, every one tooltipped with target + the JD line it satisfies. Solves the 'every report defines metrics differently' problem." |
| 0:20–0:50 | Decision Engine → Process Health | "Friction tracking. PRD rework rate is 38% — nearly 2× target. The anti-pattern detector explains why and recommends a fix. This is JD line #9: data-driven audits to provide strategic feedback to leadership." |
| 0:50–1:30 | Decision Engine → Capital Optimizer | "Slide the budget cap. Knapsack solver picks the optimal mix. Pin the Trust initiatives to protect them. This is the conversation I want to have with the CFO at portfolio review." |
| 1:30–2:00 | Decision Engine → Scenario Compare | "Pick 3 scenarios. Side-by-side metrics, plus auto-generated rationale that scores each against Salesforce core values. The decision isn't just 'highest net value' — it's 'which scenario does the moment require?'" |
| 2:00–2:30 | PortfolioCopilot | "AI agent grounded in the schema. Watch the reasoning panel — classify, resolve sources, reason step by step, confidence score. Transparency = auditability = trustworthy enough for capital allocation." |
| 2:30–3:00 | Playbooks | "Seven foundational playbooks. Adoption tracked per pillar. This is Judette's 60-day milestone, executed." |

**Bridge to the broader point:** "The pattern transfer here is what matters — registry + lifecycle states + AI agent + transparent reasoning + reuse engine. Same architecture I built at Harvey for compliance ([trustreply-demo.vercel.app](https://trustreply-demo.vercel.app)) — works because the discipline is domain-agnostic."

**Questions to ask him:**
1. "What's one process the current portfolio team has that you think is over-engineered? I'd want to start with simplification, not addition."
2. "Where has AI tooling helped vs. hurt portfolio reporting in your experience?"
3. "If you could change one thing about the current stage-gate process, what would it be?"

---

## Round 3 — Lauren Hudson (45 min · Build Trust & Cross-functional Communication)

**Don't share screen.** Reference the prototype as a stakeholder communication artifact.

**STAR Story: "Documenting decisions, not just delivering them"**
- **S:** Built a 7-tab portfolio prototype with 16 mock initiatives.
- **T:** Make the artifact stakeholder-ready, not just demo-able.
- **A:** Every KPI has a tooltip explaining WHAT it measures, the TARGET, and the JD line it maps to — eliminates definition drift across audiences. Built a "How I Built This" tab that documents design decisions, questions I'd ask, and honest gaps. Built a Team Cockpit with auto-generated weekly briefs for each PM — saves ~30 min/week on 1:1 prep, frees that time for actual coaching.
- **R:** The prototype is itself the stakeholder communication. When Judette opens it, she can see what I think and why I think it — without me having to explain it line by line.

**Reference 3 things specifically:**
1. **Tooltips on every KPI** = "Three different VPs reading the same dashboard see the same definition. Eliminates the alignment debt that kills cross-functional clarity."
2. **'Questions I'd ask Judette' tab** = "Seven open questions before I'd lock the design. Authentic communication means saying 'I don't know yet' and showing the questions I'd ask before committing."
3. **Team Cockpit's AI Coaching Feed** = "It auto-detected Marcus's parental leave starting June 17 and proposed Aisha as backfill based on capacity headroom + tenure. That's the kind of pattern-detection that makes 1:1s into coaching, not status updates."

**Questions to ask her:**
1. "What does 'building trust' look like for a Sr Mgr who's new to a team — is it more about delivery or more about consistency in small things?"
2. "The team has been through a lot of change recently — Sr Director joining, Director joining in May, maternity coverage. What's the most important conversation a new Sr Mgr should have in week 1?"
3. "How does the team currently handle pushback from Pillar PMs — what's the escalation pattern when there's disagreement on prioritization?"

---

## Common interview question patterns + which tab to reference

| If they ask… | Show / reference |
|---|---|
| "How would you build a portfolio governance framework from scratch?" | Playbooks tab + Stage-Gate Scorer |
| "How would you handle a 15% budget cut mid-year?" | Decision Engine → Scenario Compare → Margin Push scenario |
| "Walk me through a hard prioritization decision." | Decision Engine → RICE + Capital Optimizer |
| "How do you measure portfolio health?" | Dashboard 5 KPIs + Process Health sub-tab |
| "How would you spot risk early?" | Risk Heatmap + Process Health → Anti-Patterns |
| "How do you coach someone whose initiative is failing?" | Team Cockpit → Renata's coaching focus |
| "How do you decide build vs. buy?" | Value & TCO Engine + Influence Factors → Vendor Concentration |
| "What's your day-90 plan?" | How I Built This → 60–90 Day Plan |
| "How do you build trust with a new team?" | Team Cockpit → AI Coaching Feed (growth-track items, not just risks) |
| "How would you use AI in this role?" | PortfolioCopilot + Team Cockpit's AI weekly briefs + auto-drafted messages |

---

## Closer (last 30 sec, all rounds)

> "The honest meta-point is that I built this to learn the role from the inside out. The gaps I haven't closed are in the 'What I Don't Know Yet' section — they're the questions I'd close in week 1. What I'm confident about is the architecture pattern: registry, lifecycle, AI agent, transparent reasoning. That works whether the unit is a control or an initiative — and it gives Judette's team a working artifact to react to instead of a deck to interpret."

## After the interview — the leave-behind

Send Judette a short follow-up email within 24h:
> "Thanks for the conversation. As mentioned, here's the prototype I built for this role: [URL]. The 'JD Coverage Matrix' on the 'How I Built This' tab is the most useful single view — it shows every JD line mapped to where it's executed. Happy to walk through any tab you're curious about."

Don't attach anything else. The URL is the artifact.
