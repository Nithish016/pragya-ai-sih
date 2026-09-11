import React, { useState } from 'react';
import {
  Castle,
  Trees,
  Sun,
  Mountain,
  Crown,
  Sword,
  Puzzle,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  Terminal,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface PythonKingdomDiagramProps {
  onSelectRealm?: (realm: 'forest' | 'desert' | 'mountains' | 'castle') => void;
  completedRealms?: {
    forest: boolean;
    desert: boolean;
    mountains: boolean;
    castle: boolean;
  };
}

export const PythonKingdomDiagram: React.FC<PythonKingdomDiagramProps> = ({
  onSelectRealm = (_realm: 'forest' | 'desert' | 'mountains' | 'castle') => {},
  completedRealms = {
    forest: false,
    desert: false,
    mountains: false,
    castle: false
  }
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'ascii'>('visual');

  const asciiTree = `
                         🏰 PYTHON KINGDOM
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
        🌲 Variable Forest                  🏜️ Logic Desert
              │                                   │
        🧩 Solve puzzles                    ⚔️ Battle enemies
              │                                   │
              └──────────────┬────────────────────┘
                             │
                       🏔️ Loop Mountains
                             │
                     🎯 Complete missions
                             │
                        🏰 Function Castle
                             │
                        👑 FINAL BOSS
`;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with Tab toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Castle className="h-4 w-4" />
            <span>Interactive RPG World Hierarchy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk'] mt-1">
            🏰 Python Kingdom Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any realm node to solve puzzles, battle monsters, complete missions, or face the Bug Overlord.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'visual'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setViewMode('ascii')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'ascii'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>ASCII Tree</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EXACT ASCII BLUEPRINT */}
      {viewMode === 'ascii' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto shadow-inner leading-relaxed">
            <pre className="font-mono text-center font-bold tracking-tight text-amber-400">
              {asciiTree}
            </pre>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onSelectRealm('forest')}
              className="p-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-left text-xs transition-all cursor-pointer"
            >
              <div className="font-bold text-emerald-300">🌲 Variable Forest</div>
              <div className="text-[11px] text-emerald-400/80">🧩 Solve puzzles</div>
            </button>
            <button
              onClick={() => onSelectRealm('desert')}
              className="p-3 rounded-2xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-left text-xs transition-all cursor-pointer"
            >
              <div className="font-bold text-amber-300">🏜️ Logic Desert</div>
              <div className="text-[11px] text-amber-400/80">⚔️ Battle enemies</div>
            </button>
            <button
              onClick={() => onSelectRealm('mountains')}
              className="p-3 rounded-2xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-left text-xs transition-all cursor-pointer"
            >
              <div className="font-bold text-blue-300">🏔️ Loop Mountains</div>
              <div className="text-[11px] text-blue-400/80">🎯 Complete missions</div>
            </button>
            <button
              onClick={() => onSelectRealm('castle')}
              className="p-3 rounded-2xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-left text-xs transition-all cursor-pointer"
            >
              <div className="font-bold text-purple-300">🏰 Function Castle</div>
              <div className="text-[11px] text-purple-400/80">👑 FINAL BOSS</div>
            </button>
          </div>
        </div>
      ) : (
        /* VIEW 2: FULL VISUAL INTERACTIVE FLOWCHART */
        <div className="max-w-2xl mx-auto py-2">
          {/* 1. Root: 🏰 PYTHON KINGDOM */}
          <div className="flex justify-center">
            <div className="rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-500/30 to-orange-500/30 px-6 py-3 text-center shadow-xl shadow-amber-500/20">
              <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-black text-white font-['Space_Grotesk']">
                <Castle className="h-5 w-5 text-amber-400 animate-pulse" />
                <span>🏰 PYTHON KINGDOM</span>
              </div>
              <div className="text-[11px] text-amber-300 font-mono">
                Official Ministry of Capacity Building Quest
              </div>
            </div>
          </div>

          {/* Stem │ */}
          <div className="w-0.5 h-6 bg-amber-500 mx-auto" />

          {/* Horizontal Split Line ┌───────────┴───────────┐ */}
          <div className="relative flex items-center justify-center">
            <div className="w-4/5 sm:w-3/4 h-0.5 bg-slate-700 relative">
              {/* Left corner dot ┌ */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40" />
              {/* Middle junction ┴ */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400" />
              {/* Right corner dot ┐ */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/40" />
            </div>
          </div>

          {/* Left / Right Vertical Drop Lines │           │ */}
          <div className="w-4/5 sm:w-3/4 mx-auto flex justify-between">
            <div className="w-0.5 h-5 bg-emerald-500/70" />
            <div className="w-0.5 h-5 bg-amber-500/70" />
          </div>

          {/* Dual Realm Layer: Variable Forest (Left) & Logic Desert (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-1">
            {/* Left Node: 🌲 Variable Forest */}
            <div
              onClick={() => onSelectRealm('forest')}
              className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer group relative overflow-hidden ${
                completedRealms.forest
                  ? 'border-emerald-500/60 bg-emerald-950/40 ring-1 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900 hover:border-emerald-500 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trees className="h-5 w-5" />
                </div>
                {completedRealms.forest ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Solved</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/20">
                    Realm 1
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] group-hover:text-emerald-300 transition-colors">
                  🌲 Variable Forest
                </h3>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                  <Puzzle className="h-3.5 w-3.5" />
                  <span>🧩 Solve puzzles</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Types, f-strings, list mutations & memory variables.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Enter Puzzles</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Right Node: 🏜️ Logic Desert */}
            <div
              onClick={() => onSelectRealm('desert')}
              className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer group relative overflow-hidden ${
                completedRealms.desert
                  ? 'border-amber-500/60 bg-amber-950/40 ring-1 ring-amber-500/40'
                  : 'border-slate-800 bg-slate-900 hover:border-amber-500 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sun className="h-5 w-5" />
                </div>
                {completedRealms.desert ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Cleared</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 text-amber-400 text-[10px] font-bold px-2 py-0.5 border border-amber-500/20">
                    Realm 2
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] group-hover:text-amber-300 transition-colors">
                  🏜️ Logic Desert
                </h3>
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-1 font-mono">
                  <Sword className="h-3.5 w-3.5" />
                  <span>⚔️ Battle enemies</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  If/Elif/Else logic, Boolean gates & ternary strikes.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Fight Monsters</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bottom Merge Connector Lines └──────────┬──────────┘ */}
          <div className="w-4/5 sm:w-3/4 mx-auto flex justify-between">
            <div className="w-0.5 h-5 bg-emerald-500/70" />
            <div className="w-0.5 h-5 bg-amber-500/70" />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-4/5 sm:w-3/4 h-0.5 bg-slate-700 relative">
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Vertical stem down to Loop Mountains │ */}
          <div className="w-0.5 h-6 bg-blue-500 mx-auto" />

          {/* 3. Central Node: 🏔️ Loop Mountains */}
          <div className="max-w-md mx-auto my-1">
            <div
              onClick={() => onSelectRealm('mountains')}
              className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer group relative overflow-hidden ${
                completedRealms.mountains
                  ? 'border-blue-500/60 bg-blue-950/40 ring-1 ring-blue-500/40'
                  : 'border-slate-800 bg-slate-900 hover:border-blue-500 hover:bg-slate-850 hover:shadow-xl hover:shadow-blue-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <Mountain className="h-5 w-5" />
                </div>
                {completedRealms.mountains ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Conquered</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-800 text-blue-400 text-[10px] font-bold px-2 py-0.5 border border-blue-500/20">
                    Realm 3
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] group-hover:text-blue-300 transition-colors">
                  🏔️ Loop Mountains
                </h3>
                <div className="text-xs font-semibold text-blue-400 flex items-center gap-1 mt-1 font-mono">
                  <Target className="h-3.5 w-3.5" />
                  <span>🎯 Complete missions</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Iterative for-loops, range parameters & list comprehensions.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Scale Summit</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Stem down to Function Castle │ */}
          <div className="w-0.5 h-6 bg-purple-500 mx-auto" />

          {/* 4. Citadel Node: 🏰 Function Castle */}
          <div className="max-w-md mx-auto my-1">
            <div
              onClick={() => onSelectRealm('castle')}
              className={`rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer group relative overflow-hidden ${
                completedRealms.castle
                  ? 'border-purple-500/80 bg-purple-950/50 ring-2 ring-purple-500/40 shadow-2xl'
                  : 'border-purple-500/50 bg-slate-900/90 hover:border-purple-400 hover:bg-slate-850 hover:shadow-xl hover:shadow-purple-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                  <Castle className="h-5 w-5 text-amber-400" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black px-2.5 py-0.5 border border-purple-500/40">
                  <Crown className="h-3 w-3 text-amber-400" />
                  <span>👑 FINAL BOSS</span>
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-black text-white font-['Space_Grotesk'] group-hover:text-purple-300 transition-colors flex items-center gap-2">
                  <span>🏰 Function Castle</span>
                </h3>
                <div className="text-xs font-semibold text-purple-300 flex items-center gap-1 mt-1 font-mono">
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                  <span>Defeat The Bug Overlord (Recursion Dragon)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Modular def functions, *args/**kwargs and lambda strikes.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-extrabold text-amber-400">
                <span>Challenge Final Boss</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
