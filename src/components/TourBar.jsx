import React from 'react';
import { ChevronLeft, ChevronRight, X, List, Sparkles } from 'lucide-react';

// Persistent floating tour bar — renders across all tabs while a tour is active.
// Shows current step, prev/next nav, back-to-list, and exit.
export default function TourBar({ tour, step, onPrev, onNext, onExit, onBackToList, currentTab }) {
  if (!tour) return null;
  const total = tour.steps.length;
  const current = tour.steps[step];
  if (!current) return null;
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const onTargetTab = currentTab === current.tab;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
      <div className="max-w-[1200px] mx-auto pointer-events-auto">
        <div className="bg-sfnavy text-white rounded-xl shadow-2xl border border-sflight/30 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-sflight transition-all duration-500"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>

          <div className="p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Left: tour identity + step content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-sflight font-bold">
                <Sparkles className="w-3 h-3" />
                <span>{tour.label}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/70 font-mono">Step {step + 1} of {total}</span>
                {!onTargetTab && (
                  <span className="text-syellow text-[10px] font-mono ml-1">(not on target tab)</span>
                )}
              </div>
              <div className="text-sm md:text-base font-serif font-semibold mt-0.5">{current.title}</div>
              <p className="text-xs text-white/80 mt-0.5 leading-snug">
                <span className="text-sflight font-semibold">Look for:</span> {current.lookFor}
              </p>
            </div>

            {/* Right: nav controls */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0">
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={onBackToList}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1"
                title="See all tour steps"
              >
                <List className="w-3.5 h-3.5" /> All steps
              </button>
              <button
                onClick={onExit}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1"
                title="Exit tour"
              >
                <X className="w-3.5 h-3.5" /> Exit
              </button>
              <button
                onClick={onNext}
                disabled={isLast}
                className="px-3 py-1.5 rounded-lg bg-sflight hover:bg-sfblue text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isLast ? 'Last step' : 'Next'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
