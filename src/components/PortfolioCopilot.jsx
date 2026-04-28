import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Database, Workflow, FileSearch, CheckCircle2, Bot, User } from 'lucide-react';
import { SAMPLE_QUESTIONS, findResponse } from '../data/responseMap.js';

function Markdown({ text }) {
  // Lightweight markdown: tables, bold, headings, list items
  const lines = text.split('\n');
  const out = [];
  let inTable = false, tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    const [head, _sep, ...body] = tableRows;
    const headers = head.split('|').slice(1, -1).map(s => s.trim());
    const rows = body.map(r => r.split('|').slice(1, -1).map(s => s.trim()));
    out.push(
      <div key={`tbl-${out.length}`} className="overflow-x-auto my-3">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>{headers.map((h, i) => <th key={i} className="text-left p-2 bg-sfbg border border-slate-200 font-semibold text-sfnavy">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci} className="p-2 border border-slate-200 align-top" dangerouslySetInnerHTML={{ __html: renderInline(c) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  const renderInline = (s) =>
    s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-sfnavy">$1</strong>')
     .replace(/`(.+?)`/g, '<code class="font-mono bg-sfbg px-1 rounded text-[11px]">$1</code>');

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('|') && line.includes('|')) {
      tableRows.push(line);
      inTable = true;
      return;
    }
    if (inTable) { flushTable(); inTable = false; }
    if (!line.trim()) { out.push(<div key={idx} className="h-2" />); return; }
    if (line.startsWith('### ')) {
      out.push(<h4 key={idx} className="font-serif font-semibold text-sfnavy mt-3">{line.slice(4)}</h4>);
    } else if (line.match(/^\d+\.\s/)) {
      out.push(<div key={idx} className="ml-2 my-1 text-sm" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />);
    } else if (line.startsWith('- ')) {
      out.push(<div key={idx} className="ml-2 my-1 text-sm flex gap-2"><span className="text-sfblue">•</span><span dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} /></div>);
    } else {
      out.push(<p key={idx} className="text-sm my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />);
    }
  });
  flushTable();
  return <div>{out}</div>;
}

function ReasoningPanel({ response, animate }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!response || !animate) return;
    setStep(0);
    const totalSteps = 3 + response.reasoning.length;
    const t = setInterval(() => setStep(s => (s < totalSteps ? s + 1 : s)), 280);
    return () => clearInterval(t);
  }, [response, animate]);

  if (!response) {
    return (
      <div className="card h-full">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-sflight" />
          <h3 className="text-sm font-semibold text-sfnavy">Agent Reasoning</h3>
        </div>
        <p className="text-xs text-sfmuted leading-relaxed">
          Ask the agent a question. The reasoning panel will show how it classifies the query, maps it to data sources, and generates the response — every step logged for audit.
        </p>
        <div className="mt-4 text-xs text-sfmuted bg-sfbg rounded-md p-3 border border-slate-200">
          <strong className="text-sfnavy">Why this matters:</strong> Portfolio decisions affect millions of dollars and quarterly OKRs. An opaque AI answer is unauditable. Transparent reasoning is what makes the agent trustworthy enough for capital allocation.
        </div>
      </div>
    );
  }

  const Step = ({ idx, icon: Icon, title, children }) => (
    <div className={`flex gap-3 ${step > idx ? 'step-fade-in' : 'opacity-0'} mt-3`}>
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-sfblue/10 grid place-items-center">
          <Icon className="w-3.5 h-3.5 text-sfblue" />
        </div>
        <div className="flex-1 w-px bg-slate-200 mt-1" />
      </div>
      <div className="flex-1 pb-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-sfdeep">{title}</div>
        <div className="mt-1 text-xs text-sfnavy leading-relaxed">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="card h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sflight" />
          <h3 className="text-sm font-semibold text-sfnavy">Agent Reasoning</h3>
        </div>
        <span className="text-[10px] text-sfmuted font-mono">live trace</span>
      </div>

      <Step idx={0} icon={Workflow} title="1. Classify Question">
        <div>Category: <span className="font-medium">{response.classify.category}</span></div>
        <div>Sub-topic: <span className="font-medium">{response.classify.subtopic}</span></div>
      </Step>

      <Step idx={1} icon={Database} title="2. Resolve Data Sources">
        <div className="space-y-1">
          {response.sources.map(s => (
            <div key={s} className="font-mono text-[11px] text-sfdeep bg-sfbg rounded px-1.5 py-0.5 inline-block mr-1">{s}</div>
          ))}
        </div>
      </Step>

      <Step idx={2} icon={FileSearch} title="3. Reasoning Steps">
        <ol className="list-decimal ml-4 space-y-1 text-[12px]">
          {response.reasoning.map((r, i) => (
            <li key={i} className={step >= 3 + i ? 'step-fade-in' : 'opacity-0'}>{r}</li>
          ))}
        </ol>
      </Step>

      <Step idx={3 + response.reasoning.length} icon={CheckCircle2} title="4. Confidence">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${response.confidence >= 0.85 ? 'bg-sgreen' : response.confidence >= 0.6 ? 'bg-syellow' : 'bg-sred'}`}
              style={{ width: `${response.confidence * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs">{Math.round(response.confidence * 100)}%</span>
        </div>
        <p className="mt-1 text-[11px] text-sfmuted">
          {response.confidence < 0.6 ? 'Low — routing to human analyst' : response.confidence < 0.85 ? 'Medium — review recommended' : 'High — direct answer'}
        </p>
      </Step>
    </div>
  );
}

export default function PortfolioCopilot() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hi — I'm PortfolioCopilot. I answer questions grounded in the DET portfolio data model. Try one of the suggested questions, or ask your own." }
  ]);
  const [input, setInput] = useState('');
  const [activeResponse, setActiveResponse] = useState(null);
  const [animateKey, setAnimateKey] = useState(0);
  const scrollRef = useRef(null);

  const ask = (text) => {
    if (!text.trim()) return;
    const r = findResponse(text);
    setMessages(m => [...m, { role: 'user', text }, { role: 'agent', text: r.answer, response: r }]);
    setActiveResponse(r);
    setAnimateKey(k => k + 1);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
      {/* Chat (left) */}
      <div className="lg:col-span-3 card flex flex-col">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-sfblue/10 grid place-items-center">
            <Bot className="w-4 h-4 text-sfblue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sfnavy">PortfolioCopilot</h3>
            <p className="text-[11px] text-sfmuted">Grounded in initiative_inventory · stage_gate_artifacts · dependencies · capacity_snapshots</p>
          </div>
        </div>

        {/* Suggested questions */}
        <div className="py-3 border-b border-slate-100">
          <div className="text-[11px] uppercase tracking-wider text-sfmuted font-semibold mb-2">Try a question</div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="text-[11px] text-sfdeep bg-sfbg hover:bg-sfblue/10 border border-slate-200 rounded-full px-3 py-1.5 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full grid place-items-center flex-shrink-0 ${m.role === 'user' ? 'bg-sfnavy text-white' : 'bg-sfblue/10 text-sfblue'}`}>
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`flex-1 max-w-[85%] ${m.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block text-left rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-sfnavy text-white' : 'bg-sfbg text-sfnavy border border-slate-200'}`}>
                  {m.role === 'agent' ? <Markdown text={m.text} /> : <span className="text-sm">{m.text}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          className="pt-3 border-t border-slate-200 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about risk, capital allocation, dependencies, scenarios…"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sfblue/40"
          />
          <button type="submit" className="bg-sfblue text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-sfdeep transition flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Ask
          </button>
        </form>
      </div>

      {/* Reasoning (right) */}
      <div className="lg:col-span-2">
        <ReasoningPanel key={animateKey} response={activeResponse} animate={true} />
      </div>
    </div>
  );
}
