import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { PythonKingdomDiagram } from '../components/PythonKingdomDiagram.js';
import { VariableForestExplorer } from '../components/games/VariableForestExplorer.js';
import { LogicDesertBattle } from '../components/games/LogicDesertBattle.js';
import { LoopMountainsRunner } from '../components/games/LoopMountainsRunner.js';
import { FunctionCastleBoss } from '../components/games/FunctionCastleBoss.js';
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
  Heart,
  Shield,
  Coins,
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Play,
  Award,
  ChevronRight,
  Code2,
  Terminal,
  HelpCircle,
  Trophy
} from 'lucide-react';

type RealmId = 'hub' | 'forest' | 'desert' | 'mountains' | 'castle';

interface RealmInfo {
  id: RealmId;
  name: string;
  icon: any;
  tagline: string;
  badge: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  color: string;
  bgGradient: string;
}

export const PythonKingdomPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user, profile, addXP, addCoins, triggerConfetti } = useAuth();

  // Active realm view
  const [activeRealm, setActiveRealm] = useState<RealmId>('hub');

  // Player RPG stats
  const [playerHP, setPlayerHP] = useState(100);
  const [playerMaxHP] = useState(100);
  const [kingdomXP, setKingdomXP] = useState(0);
  const [kingdomCoins, setKingdomCoins] = useState(0);

  // Realm Completion Tracking
  const [completedRealms, setCompletedRealms] = useState<{ [key in RealmId]: boolean }>({
    hub: true,
    forest: false,
    desert: false,
    mountains: false,
    castle: false
  });

  // --------------------------------------------------------------------------
  // GAME COMPLETION HANDLERS FOR THE 4 ACTION REALMS
  // --------------------------------------------------------------------------
  const handleForestComplete = (rewardXP: number) => {
    setCompletedRealms((prev) => ({ ...prev, forest: true }));
    addXP(rewardXP || 100);
    addCoins(30);
    triggerConfetti();
    setActiveRealm('hub');
  };

  const handleDesertComplete = (rewardXP: number) => {
    setCompletedRealms((prev) => ({ ...prev, desert: true }));
    addXP(rewardXP || 150);
    addCoins(45);
    triggerConfetti();
    setActiveRealm('hub');
  };

  const handleMountainsComplete = (rewardXP: number) => {
    setCompletedRealms((prev) => ({ ...prev, mountains: true }));
    addXP(rewardXP || 200);
    addCoins(60);
    triggerConfetti();
    setActiveRealm('hub');
  };

  const handleCastleComplete = (rewardXP: number) => {
    setCompletedRealms((prev) => ({ ...prev, castle: true }));
    addXP(rewardXP || 300);
    addCoins(100);
    triggerConfetti();
    setActiveRealm('hub');
  };

  // Realms configuration matching user's ASCII diagram
  const realms: RealmInfo[] = [
    {
      id: 'forest',
      name: 'Variable Forest',
      icon: Trees,
      tagline: '🧩 Solve puzzles',
      badge: 'Realm 1',
      description: 'Master primitive data types, memory allocation, variable assignments, and f-string alchemy.',
      unlocked: true,
      completed: completedRealms.forest,
      color: 'emerald',
      bgGradient: 'from-emerald-950/80 to-slate-900'
    },
    {
      id: 'desert',
      name: 'Logic Desert',
      icon: Sun,
      tagline: '⚔️ Battle enemies',
      badge: 'Realm 2',
      description: 'Fight fierce indentation monsters and syntax beasts with Boolean gates and If/Elif/Else swords.',
      unlocked: true,
      completed: completedRealms.desert,
      color: 'amber',
      bgGradient: 'from-amber-950/80 to-slate-900'
    },
    {
      id: 'mountains',
      name: 'Loop Mountains',
      icon: Mountain,
      tagline: '🎯 Complete missions',
      badge: 'Realm 3',
      description: 'Traverse treacherous for/while summits and scale list comprehension ridges without infinite loops.',
      unlocked: completedRealms.forest || completedRealms.desert,
      completed: completedRealms.mountains,
      color: 'blue',
      bgGradient: 'from-blue-950/80 to-slate-900'
    },
    {
      id: 'castle',
      name: 'Function Castle',
      icon: Castle,
      tagline: '👑 FINAL BOSS',
      badge: 'Final Realm',
      description: 'Storm the royal citadel and slay the Bug Overlord using modular functions, return statements, and lambda spells.',
      unlocked: completedRealms.mountains,
      completed: completedRealms.castle,
      color: 'purple',
      bgGradient: 'from-purple-950/80 to-slate-900'
    }
  ];

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans']">
      {/* RPG Top HUD Bar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-4 sm:p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Castle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
                🏰 PYTHON KINGDOM
              </h1>
              <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 border border-amber-500/30">
                Official RPG Adventure
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Conquer algorithmic realms, slay syntax errors, and claim the Crown of Python Archmage.
            </p>
          </div>
        </div>

        {/* Player Stats Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Health Bar */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Health</span>
                <span>{playerHP}/{playerMaxHP}</span>
              </div>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    playerHP > 50 ? 'bg-emerald-500' : playerHP > 25 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Karma Coins */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 text-amber-300">
            <Coins className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="font-mono text-xs font-black">{profile?.coins || 420} Pts</span>
          </div>

          {/* Quick Return to Map Button */}
          {activeRealm !== 'hub' && (
            <button
              onClick={() => setActiveRealm('hub')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>World Map</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. INTERACTIVE KINGDOM MAP (ASCII DIAGRAM TRANSLATED TO INTERACTIVE UI) */}
      {/* ===================================================================== */}
      {/* ===================================================================== */}
      {/* 1. INTERACTIVE KINGDOM MAP (ASCII DIAGRAM & VISUAL TREE) */}
      {/* ===================================================================== */}
      {activeRealm === 'hub' && (
        <div className="space-y-8">
          {/* Main Interactive Map & ASCII Blueprint Component */}
          <PythonKingdomDiagram
            onSelectRealm={(realm) => {
              if (realm === 'mountains' && !completedRealms.forest && !completedRealms.desert) {
                alert('Complete either Variable Forest or Logic Desert to unlock Loop Mountains!');
                return;
              }
              if (realm === 'castle' && !completedRealms.mountains) {
                alert('Complete Loop Mountains to unlock Function Castle and challenge the Final Boss!');
                return;
              }
              setActiveRealm(realm);
            }}
            completedRealms={completedRealms}
          />

          {/* Realm Adventure Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {realms.map((realm) => {
              const Icon = realm.icon;
              return (
                <div
                  key={realm.id}
                  onClick={() => {
                    if (realm.id === 'mountains' && !completedRealms.forest && !completedRealms.desert) {
                      alert('Complete either Variable Forest or Logic Desert to unlock Loop Mountains!');
                      return;
                    }
                    if (realm.id === 'castle' && !completedRealms.mountains) {
                      alert('Complete Loop Mountains to unlock Function Castle and challenge the Final Boss!');
                      return;
                    }
                    setActiveRealm(realm.id);
                  }}
                  className={`rounded-2xl border p-5 transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between ${
                    realm.completed
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md'
                      : realm.unlocked
                      ? 'border-slate-800 bg-slate-900/90 hover:border-amber-500/50 hover:bg-slate-850 cursor-pointer shadow-lg'
                      : 'border-slate-800/40 bg-slate-950/40 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
                        {realm.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
                      {realm.name}
                    </h4>
                    <div className="text-xs font-semibold text-amber-400 mt-0.5">
                      {realm.tagline}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {realm.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>{realm.completed ? 'Replay Realm' : realm.unlocked ? 'Enter Realm' : '🔒 Locked'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. REALM 1: VARIABLE FOREST (2D EXPLORER ACTION GAME) */}
      {/* ===================================================================== */}
      {activeRealm === 'forest' && (
        <VariableForestExplorer
          onComplete={handleForestComplete}
          onExit={() => setActiveRealm('hub')}
        />
      )}

      {/* ===================================================================== */}
      {/* 3. REALM 2: LOGIC DESERT (ANIMATED RPG COMBAT ARENA) */}
      {/* ===================================================================== */}
      {activeRealm === 'desert' && (
        <LogicDesertBattle
          onComplete={handleDesertComplete}
          onExit={() => setActiveRealm('hub')}
        />
      )}

      {/* ===================================================================== */}
      {/* 4. REALM 3: LOOP MOUNTAINS (2D CANVAS ARCADE RUNNER) */}
      {/* ===================================================================== */}
      {activeRealm === 'mountains' && (
        <LoopMountainsRunner
          onComplete={handleMountainsComplete}
          onExit={() => setActiveRealm('hub')}
        />
      )}

      {/* ===================================================================== */}
      {/* 5. REALM 4: FUNCTION CASTLE (👑 FINAL BOSS GAUNTLET ARENA) */}
      {/* ===================================================================== */}
      {activeRealm === 'castle' && (
        <FunctionCastleBoss
          onComplete={handleCastleComplete}
          onExit={() => setActiveRealm('hub')}
        />
      )}
    </div>
  );
};
