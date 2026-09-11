import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
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
  // REALM 1: VARIABLE FOREST (PUZZLES)
  // --------------------------------------------------------------------------
  const [forestStep, setForestStep] = useState(0);
  const [forestSelectedAnswer, setForestSelectedAnswer] = useState<number | null>(null);
  const [forestPuzzleFeedback, setForestPuzzleFeedback] = useState<string | null>(null);

  const forestPuzzles = [
    {
      title: 'Puzzle 1: The Memory Vault (Type Alchemy)',
      scenario: 'The Ancient Tree of Memory requires you to classify MoSPI survey inputs into strictly typed Python memory boxes.',
      codeSnippet: `survey_year = 2026\nresponse_rate = 94.8\nstate_name = "Telangana"\nis_sample_verified = True`,
      question: 'Which of the following describes the types in exact order?',
      options: [
        'int, float, str, bool',
        'str, int, float, boolean',
        'number, decimal, text, flag',
        'int, double, string, boolean'
      ],
      correct: 0,
      explanation: 'In Python, integers are `int`, decimals are `float`, text is `str`, and booleans are `bool`.'
    },
    {
      title: 'Puzzle 2: The F-String Canopy (String Formatting)',
      scenario: 'Assemble the magic incantation to produce the official survey bulletin text without type casting errors.',
      codeSnippet: `district = "Varanasi"\nhouseholds = 450\n# Goal: "Survey in Varanasi surveyed 450 households."`,
      question: 'Which Python syntax safely achieves this using modern f-strings?',
      options: [
        'f"Survey in {district} surveyed {households} households."',
        '"Survey in " + district + " surveyed " + households + " households."',
        'f"Survey in $district surveyed $households households."',
        'print("Survey in %s surveyed %s", district, households)'
      ],
      correct: 0,
      explanation: 'Python f-strings (`f"..."`) automatically interpolate variables inside `{}` and handle type conversion smoothly.'
    },
    {
      title: 'Puzzle 3: The Mutation Shrub (List Operations)',
      scenario: 'The forest path branches into an array of census indicators. A new district sample must be appended.',
      codeSnippet: `samples = ["D101", "D102", "D103"]\n# Action: Add "D104" to the end of the collection`,
      question: 'Which method properly mutates the list in-place?',
      options: [
        'samples.append("D104")',
        'samples.add("D104")',
        'samples.push("D104")',
        'samples = samples.insert("D104")'
      ],
      correct: 0,
      explanation: 'In Python, `.append(item)` adds an element to the end of a list. (`push` is JavaScript, `add` is for Sets).'
    }
  ];

  const handleForestAnswer = (idx: number) => {
    setForestSelectedAnswer(idx);
    const puzzle = forestPuzzles[forestStep];
    if (idx === puzzle.correct) {
      setForestPuzzleFeedback('✨ Correct! The forest runes light up!');
      addXP(50);
      addCoins(15);
      triggerConfetti();

      setTimeout(() => {
        setForestSelectedAnswer(null);
        setForestPuzzleFeedback(null);
        if (forestStep + 1 < forestPuzzles.length) {
          setForestStep((prev) => prev + 1);
        } else {
          setCompletedRealms((prev) => ({ ...prev, forest: true }));
          addXP(100);
          addCoins(30);
          setActiveRealm('hub');
        }
      }, 1500);
    } else {
      setForestPuzzleFeedback('❌ The runes flicker red. Check your Python syntax and try again!');
      setPlayerHP((prev) => Math.max(10, prev - 15));
    }
  };

  // --------------------------------------------------------------------------
  // REALM 2: LOGIC DESERT (ENEMY BATTLES)
  // --------------------------------------------------------------------------
  const [enemyName, setEnemyName] = useState('The Indentation Scorpion');
  const [enemyHP, setEnemyHP] = useState(100);
  const [enemyMaxHP] = useState(100);
  const [desertBattleStep, setDesertBattleStep] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([
    '⚔️ You enter the scorching Logic Desert! A fierce Indentation Scorpion blocks the oasis.'
  ]);
  const [desertSelectedAnswer, setDesertSelectedAnswer] = useState<number | null>(null);

  const desertBattles = [
    {
      enemyPrompt: 'The Scorpion prepares a sting! Defend yourself by evaluating this compound conditional:',
      codeSnippet: `gdp_growth = 7.2\ninflation = 4.8\nif gdp_growth > 6.0 and inflation < 5.0:\n    action = "EXPAND"\nelif gdp_growth > 5.0 or inflation < 6.0:\n    action = "HOLD"\nelse:\n    action = "CONTRACT"`,
      question: 'What is the evaluated value of `action`?',
      options: ['"EXPAND"', '"HOLD"', '"CONTRACT"', 'SyntaxError'],
      correct: 0,
      damage: 40,
      explanation: 'Since 7.2 > 6.0 (True) AND 4.8 < 5.0 (True), the first `if` branch executes immediately: "EXPAND".'
    },
    {
      enemyPrompt: 'The Scorpion summons a sandstorm of Boolean logic! Cast your counter-spell:',
      codeSnippet: `is_officer = True\nhas_clearance = False\ncan_access = is_officer and not has_clearance`,
      question: 'What is the boolean value of `can_access`?',
      options: ['True', 'False', 'None', 'TypeError'],
      correct: 0,
      damage: 40,
      explanation: '`not False` is `True`. `True and True` evaluates to `True`.'
    },
    {
      enemyPrompt: 'The Scorpion makes a desperate final charge! Strike with a Python Ternary statement:',
      codeSnippet: `poverty_ratio = 12.4\nstatus = "Alert" if poverty_ratio > 15 else "Stabilized"`,
      question: 'What is the string assigned to `status`?',
      options: ['"Stabilized"', '"Alert"', 'None', 'SyntaxError'],
      correct: 0,
      damage: 40,
      explanation: 'Because 12.4 > 15 is False, the ternary expression yields the `else` branch: "Stabilized".'
    }
  ];

  const handleDesertAttack = (idx: number) => {
    setDesertSelectedAnswer(idx);
    const battle = desertBattles[desertBattleStep];

    if (idx === battle.correct) {
      const newEnemyHP = Math.max(0, enemyHP - battle.damage);
      setEnemyHP(newEnemyHP);
      setBattleLog((prev) => [
        `🗡️ Critical Strike! You correctly executed Python logic dealing ${battle.damage} DMG to ${enemyName}!`,
        ...prev.slice(0, 3)
      ]);
      addXP(60);
      addCoins(20);
      triggerConfetti();

      setTimeout(() => {
        setDesertSelectedAnswer(null);
        if (desertBattleStep + 1 < desertBattles.length && newEnemyHP > 0) {
          setDesertBattleStep((prev) => prev + 1);
        } else {
          setBattleLog((prev) => [
            `🏆 VICTORY! You defeated ${enemyName} and conquered the Logic Desert!`,
            ...prev
          ]);
          setCompletedRealms((prev) => ({ ...prev, desert: true }));
          addXP(120);
          addCoins(40);
          setTimeout(() => setActiveRealm('hub'), 2000);
        }
      }, 1500);
    } else {
      setPlayerHP((prev) => Math.max(10, prev - 25));
      setBattleLog((prev) => [
        `💥 Missed! ${enemyName} strikes back with an IndentationError dealing 25 damage to your HP!`,
        ...prev.slice(0, 3)
      ]);
    }
  };

  // --------------------------------------------------------------------------
  // REALM 3: LOOP MOUNTAINS (MISSIONS)
  // --------------------------------------------------------------------------
  const [mountainStep, setMountainStep] = useState(0);
  const [mountainAnswer, setMountainAnswer] = useState<number | null>(null);
  const [mountainFeedback, setMountainFeedback] = useState<string | null>(null);

  const mountainMissions = [
    {
      title: 'Mission 1: The Accumulator Peak',
      goal: 'Ascend the peaks by tracing a `for` loop that aggregates survey counts.',
      codeSnippet: `total = 0\nfor count in [10, 20, 30]:\n    total += count`,
      question: 'What is the final value of `total` after loop execution?',
      options: ['60', '50', '30', '0'],
      correct: 0,
      explanation: '0 + 10 = 10; 10 + 20 = 30; 30 + 30 = 60.'
    },
    {
      title: 'Mission 2: The Range Glider',
      goal: 'Navigate the cliffs using Python `range()` step increments.',
      codeSnippet: `checkpoints = list(range(2, 10, 2))`,
      question: 'What elements are produced inside `checkpoints`?',
      options: ['[2, 4, 6, 8]', '[2, 4, 6, 8, 10]', '[0, 2, 4, 6, 8]', '[2, 3, 4, 5, 6, 7, 8, 9]'],
      correct: 0,
      explanation: '`range(start, stop, step)` starts at 2, steps by 2, and stops strictly BEFORE 10 -> [2, 4, 6, 8].'
    },
    {
      title: 'Mission 3: The List Comprehension Ridge',
      goal: 'Cross the chasm with an elegant single-line Python list comprehension.',
      codeSnippet: `prices = [100, 200, 300]\ngst_prices = [p * 1.18 for p in prices if p > 150]`,
      question: 'How many items will be in the resulting `gst_prices` list?',
      options: ['2 items ([236.0, 354.0])', '3 items', '1 item', '0 items'],
      correct: 0,
      explanation: 'Only 200 and 300 satisfy the condition `p > 150`. They are scaled by 1.18.'
    }
  ];

  const handleMountainAnswer = (idx: number) => {
    setMountainAnswer(idx);
    const m = mountainMissions[mountainStep];

    if (idx === m.correct) {
      setMountainFeedback('🏔️ Mission checkpoint completed! The path opens higher!');
      addXP(60);
      addCoins(20);
      triggerConfetti();

      setTimeout(() => {
        setMountainAnswer(null);
        setMountainFeedback(null);
        if (mountainStep + 1 < mountainMissions.length) {
          setMountainStep((prev) => prev + 1);
        } else {
          setCompletedRealms((prev) => ({ ...prev, mountains: true }));
          addXP(150);
          addCoins(50);
          setActiveRealm('hub');
        }
      }, 1500);
    } else {
      setMountainFeedback('⚠️ You slipped on the scree! Review the loop trace.');
      setPlayerHP((prev) => Math.max(10, prev - 20));
    }
  };

  // --------------------------------------------------------------------------
  // REALM 4: FUNCTION CASTLE (FINAL BOSS BATTLE)
  // --------------------------------------------------------------------------
  const [bossHP, setBossHP] = useState(150);
  const [bossMaxHP] = useState(150);
  const [bossStep, setBossStep] = useState(0);
  const [bossBattleLog, setBossBattleLog] = useState<string[]>([
    '🔥 THE FINAL BOSS: The Bug Overlord (Recursion Dragon) roars atop Function Castle!'
  ]);
  const [bossAnswer, setBossAnswer] = useState<number | null>(null);
  const [bossVictory, setBossVictory] = useState(false);

  const bossPhases = [
    {
      phaseName: 'Phase 1: Return Value Spell Shield',
      prompt: 'The Bug Overlord casts a `NoneType` null barrier! Strike by defining the correct return value:',
      codeSnippet: `def compute_variance(values):\n    mean_val = sum(values) / len(values)\n    sq_diff = [(x - mean_val)**2 for x in values]\n    return sum(sq_diff) / len(values)\n\nres = compute_variance([2, 4, 4, 4, 5, 5, 7, 9])`,
      question: 'What does `compute_variance` return to break the null shield?',
      options: [
        'A calculated float number (the population variance)',
        'None (because return is inside a loop)',
        'A list of difference squares',
        'SyntaxError'
      ],
      correct: 0,
      damage: 50,
      explanation: 'The function executes calculations and uses `return` to output the computed float back to the caller.'
    },
    {
      phaseName: 'Phase 2: *args and **kwargs Dragon Scales',
      prompt: 'The Dragon hardens its scales with arbitrary argument packing! Unravel the parameters:',
      codeSnippet: `def aggregate_metrics(dept, *weights, **params):\n    return f"{dept}: {len(weights)} weights, {len(params)} params"\n\nout = aggregate_metrics("MoSPI", 0.3, 0.5, 0.2, region="North", verified=True)`,
      question: 'What is the output string?',
      options: [
        '"MoSPI: 3 weights, 2 params"',
        '"MoSPI: 5 weights, 0 params"',
        'TypeError: unexpected keyword argument',
        '"MoSPI: (0.3, 0.5, 0.2), {region: North}"'
      ],
      correct: 0,
      damage: 50,
      explanation: '`*weights` packs 3 positional floats into a tuple, while `**params` packs 2 keyword arguments into a dict.'
    },
    {
      phaseName: 'Phase 3: The Lambda Final Strike',
      prompt: 'The Bug Overlord is weakened! Finish the battle with a pristine inline Lambda function:',
      codeSnippet: `survey_sorter = lambda row: row["priority"]\ndata = [{"id": 1, "priority": 3}, {"id": 2, "priority": 1}]\ndata.sort(key=survey_sorter)`,
      question: 'Which item will appear first after sorting?',
      options: [
        '{"id": 2, "priority": 1}',
        '{"id": 1, "priority": 3}',
        'TypeError',
        'Unsorted original list'
      ],
      correct: 0,
      damage: 50,
      explanation: 'The lambda function extracts `row["priority"]` as the sort key. Since 1 < 3, item {"id": 2, "priority": 1} is sorted first!'
    }
  ];

  const handleBossAttack = (idx: number) => {
    setBossAnswer(idx);
    const phase = bossPhases[bossStep];

    if (idx === phase.correct) {
      const newBossHP = Math.max(0, bossHP - phase.damage);
      setBossHP(newBossHP);
      setBossBattleLog((prev) => [
        `⚡ Royal Strike! Clean function syntax dealt ${phase.damage} DMG to The Bug Overlord!`,
        ...prev.slice(0, 3)
      ]);
      addXP(100);
      addCoins(35);
      triggerConfetti();

      setTimeout(() => {
        setBossAnswer(null);
        if (bossStep + 1 < bossPhases.length && newBossHP > 0) {
          setBossStep((prev) => prev + 1);
        } else {
          setBossVictory(true);
          setCompletedRealms((prev) => ({ ...prev, castle: true }));
          addXP(300);
          addCoins(100);
          triggerConfetti();
        }
      }, 1500);
    } else {
      setPlayerHP((prev) => Math.max(10, prev - 30));
      setBossBattleLog((prev) => [
        '🔥 The Bug Overlord breathes a RecursionError firestorm! You took 30 DMG!',
        ...prev.slice(0, 3)
      ]);
    }
  };

  const restartBossBattle = () => {
    setBossHP(150);
    setBossStep(0);
    setBossVictory(false);
    setPlayerHP(100);
    setBossBattleLog(['🔥 Challenge restarted! The Bug Overlord awaits your functions.']);
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
      {activeRealm === 'hub' && (
        <div className="space-y-6">
          {/* Kingdom ASCII Structure Visualizer Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-lg mx-auto space-y-2 mb-8">
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                Civil Services Python Learning Odyssey
              </span>
              <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
                Explore the Realms of Python Kingdom
              </h2>
              <p className="text-xs text-slate-400">
                Choose a realm to explore. Solve puzzles in the forest, battle monsters in the desert, scale the loop mountains, and face the Bug Overlord at Function Castle!
              </p>
            </div>

            {/* Visual Tree Node Graph matching user's architecture */}
            <div className="max-w-3xl mx-auto py-2">
              {/* Top Node: Python Kingdom Gateway */}
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-6 py-3 text-center shadow-lg shadow-amber-500/10">
                  <div className="text-lg font-black text-white font-['Space_Grotesk'] flex items-center justify-center gap-2">
                    <Castle className="h-5 w-5 text-amber-400" />
                    <span>🏰 PYTHON KINGDOM</span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                    Royal Citadel & Capacity Realm
                  </div>
                </div>
              </div>

              {/* Trunk Connecting Line */}
              <div className="w-0.5 h-6 bg-amber-500/50 mx-auto" />

              {/* Horizontal Fork Bar */}
              <div className="relative flex items-center justify-center">
                <div className="w-3/4 sm:w-2/3 h-0.5 bg-slate-700 relative">
                  <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-amber-400" />
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-500" />
                </div>
              </div>

              {/* Realm Branch 1 & 2: Forest & Desert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
                {/* Branch Left: 🌲 Variable Forest */}
                <div
                  onClick={() => setActiveRealm('forest')}
                  className={`group rounded-3xl border p-6 transition-all duration-300 cursor-pointer text-left relative overflow-hidden ${
                    completedRealms.forest
                      ? 'border-emerald-500/60 bg-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Trees className="h-6 w-6" />
                    </div>
                    {completedRealms.forest ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold px-2.5 py-1 border border-emerald-500/20">
                        Realm 1
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mt-4">
                    🌲 Variable Forest
                  </h3>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Puzzle className="h-3.5 w-3.5" />
                    <span>🧩 Solve puzzles</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Master primitive types, memory boxes, f-strings, and list mutations among ancient trees.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Enter Forest</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Branch Right: 🏜️ Logic Desert */}
                <div
                  onClick={() => setActiveRealm('desert')}
                  className={`group rounded-3xl border p-6 transition-all duration-300 cursor-pointer text-left relative overflow-hidden ${
                    completedRealms.desert
                      ? 'border-amber-500/60 bg-amber-950/30 ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/80 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                      <Sun className="h-6 w-6" />
                    </div>
                    {completedRealms.desert ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800 text-amber-400 text-[10px] font-bold px-2.5 py-1 border border-amber-500/20">
                        Realm 2
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mt-4">
                    🏜️ Logic Desert
                  </h3>
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-0.5">
                    <Sword className="h-3.5 w-3.5" />
                    <span>⚔️ Battle enemies</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Slay the Indentation Scorpion and boolean sandstorms with strict conditionals and ternary strikes.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Engage in Battle</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Converging Stem to Loop Mountains */}
              <div className="flex flex-col items-center my-2">
                <div className="w-3/4 sm:w-2/3 h-0.5 bg-slate-700 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div className="w-0.5 h-6 bg-blue-500/50" />
              </div>

              {/* Central Mid Node: 🏔️ Loop Mountains */}
              <div className="max-w-md mx-auto my-4">
                <div
                  onClick={() => {
                    if (completedRealms.forest || completedRealms.desert) {
                      setActiveRealm('mountains');
                    } else {
                      alert('Complete either Variable Forest or Logic Desert to unlock Loop Mountains!');
                    }
                  }}
                  className={`group rounded-3xl border p-6 transition-all duration-300 text-left relative overflow-hidden ${
                    completedRealms.mountains
                      ? 'border-blue-500/60 bg-blue-950/30 ring-1 ring-blue-500/30 cursor-pointer'
                      : completedRealms.forest || completedRealms.desert
                      ? 'border-slate-800 bg-slate-900/80 hover:border-blue-500/50 cursor-pointer'
                      : 'border-slate-800/60 bg-slate-950/40 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                      <Mountain className="h-6 w-6" />
                    </div>
                    {completedRealms.mountains ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800 text-blue-400 text-[10px] font-bold px-2.5 py-1 border border-blue-500/20">
                        Realm 3
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mt-4">
                    🏔️ Loop Mountains
                  </h3>
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1 mt-0.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>🎯 Complete missions</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Ascend via for-loops, dodge infinite while-abysses, and master one-line list comprehensions.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>{completedRealms.forest || completedRealms.desert ? 'Ascend Summit' : '🔒 Locked'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Connecting Line to Function Castle */}
              <div className="w-0.5 h-6 bg-purple-500/50 mx-auto" />

              {/* Final Climax Node: 🏰 Function Castle & 👑 FINAL BOSS */}
              <div className="max-w-md mx-auto my-4">
                <div
                  onClick={() => {
                    if (completedRealms.mountains) {
                      setActiveRealm('castle');
                    } else {
                      alert('Complete Loop Mountains to unlock Function Castle and challenge the Final Boss!');
                    }
                  }}
                  className={`group rounded-3xl border p-6 transition-all duration-300 text-left relative overflow-hidden ${
                    completedRealms.castle
                      ? 'border-purple-500/60 bg-purple-950/40 ring-2 ring-purple-500/40 shadow-xl cursor-pointer'
                      : completedRealms.mountains
                      ? 'border-purple-500/40 bg-slate-900/90 hover:border-purple-500 cursor-pointer shadow-lg'
                      : 'border-slate-800/60 bg-slate-950/40 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
                      <Castle className="h-6 w-6" />
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black px-3 py-1 border border-purple-500/30">
                      <Crown className="h-3.5 w-3.5 text-amber-400" />
                      <span>👑 FINAL BOSS</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white font-['Space_Grotesk'] mt-4 flex items-center gap-2">
                    <span>🏰 Function Castle</span>
                  </h3>
                  <div className="text-xs font-semibold text-purple-400 flex items-center gap-1 mt-0.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Defeat the Bug Overlord (Recursion Dragon)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    The ultimate trial: encapsulate logic with `def`, wield `*args/**kwargs`, and unleash lambda strikes to liberate the kingdom.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-extrabold text-purple-300">
                    <span>{completedRealms.mountains ? '⚔️ Enter Boss Gauntlet' : '🔒 Clear Loop Mountains First'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. REALM 1: VARIABLE FOREST (PUZZLE PLAYGROUND) */}
      {/* ===================================================================== */}
      {activeRealm === 'forest' && (
        <div className="rounded-3xl border border-emerald-500/40 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Trees className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Realm 1: Variable Forest
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  🧩 Solve Puzzles: {forestPuzzles[forestStep].title}
                </h2>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 text-slate-300 text-xs px-3 py-1 font-mono">
              Puzzle {forestStep + 1} of {forestPuzzles.length}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {forestPuzzles[forestStep].scenario}
          </p>

          {/* Interactive Code Display */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            {forestPuzzles[forestStep].codeSnippet}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">
              {forestPuzzles[forestStep].question}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {forestPuzzles[forestStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleForestAnswer(idx)}
                  className={`p-3.5 rounded-2xl text-left text-xs font-mono transition-all border cursor-pointer ${
                    forestSelectedAnswer === idx
                      ? idx === forestPuzzles[forestStep].correct
                        ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500'
                        : 'border-rose-500 bg-rose-950/60 text-rose-200'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-850'
                  }`}
                >
                  <span className="font-bold text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {forestPuzzleFeedback && (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
              {forestPuzzleFeedback}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. REALM 2: LOGIC DESERT (ENEMY BATTLES) */}
      {/* ===================================================================== */}
      {activeRealm === 'desert' && (
        <div className="rounded-3xl border border-amber-500/40 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Sun className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Realm 2: Logic Desert
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  ⚔️ Battle Enemies: Turn {desertBattleStep + 1}
                </h2>
              </div>
            </div>

            {/* Enemy Health Bar */}
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-amber-500/30 px-3.5 py-2">
              <Sword className="h-4 w-4 text-amber-400" />
              <div>
                <div className="flex justify-between text-[10px] font-bold text-amber-300 uppercase">
                  <span>{enemyName}</span>
                  <span>{enemyHP}/{enemyMaxHP} HP</span>
                </div>
                <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Combat Log */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1 font-mono text-slate-300">
            {battleLog.map((log, i) => (
              <div key={i} className={i === 0 ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                {log}
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {desertBattles[desertBattleStep]?.enemyPrompt}
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {desertBattles[desertBattleStep]?.codeSnippet}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">
              {desertBattles[desertBattleStep]?.question}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {desertBattles[desertBattleStep]?.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDesertAttack(idx)}
                  className={`p-3.5 rounded-2xl text-left text-xs font-mono transition-all border cursor-pointer ${
                    desertSelectedAnswer === idx
                      ? idx === desertBattles[desertBattleStep].correct
                        ? 'border-amber-400 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500'
                        : 'border-rose-500 bg-rose-950/60 text-rose-200'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-500/50 hover:bg-slate-850'
                  }`}
                >
                  <span className="font-bold text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. REALM 3: LOOP MOUNTAINS (MISSIONS) */}
      {/* ===================================================================== */}
      {activeRealm === 'mountains' && (
        <div className="rounded-3xl border border-blue-500/40 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                <Mountain className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Realm 3: Loop Mountains
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  🎯 Complete Missions: {mountainMissions[mountainStep].title}
                </h2>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 text-slate-300 text-xs px-3 py-1 font-mono">
              Mission {mountainStep + 1} of {mountainMissions.length}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {mountainMissions[mountainStep].goal}
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            {mountainMissions[mountainStep].codeSnippet}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">
              {mountainMissions[mountainStep].question}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mountainMissions[mountainStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMountainAnswer(idx)}
                  className={`p-3.5 rounded-2xl text-left text-xs font-mono transition-all border cursor-pointer ${
                    mountainAnswer === idx
                      ? idx === mountainMissions[mountainStep].correct
                        ? 'border-blue-400 bg-blue-950/60 text-blue-200 ring-2 ring-blue-500'
                        : 'border-rose-500 bg-rose-950/60 text-rose-200'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-blue-500/50 hover:bg-slate-850'
                  }`}
                >
                  <span className="font-bold text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {mountainFeedback && (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-200">
              {mountainFeedback}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. REALM 4: FUNCTION CASTLE & FINAL BOSS */}
      {/* ===================================================================== */}
      {activeRealm === 'castle' && (
        <div className="rounded-3xl border border-purple-500/50 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300">
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Final Realm: Function Castle
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  👑 FINAL BOSS: The Bug Overlord
                </h2>
              </div>
            </div>

            {/* Boss HP Bar */}
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-purple-500/30 px-3.5 py-2">
              <Crown className="h-4 w-4 text-amber-400" />
              <div>
                <div className="flex justify-between text-[10px] font-bold text-purple-300 uppercase">
                  <span>Boss HP</span>
                  <span>{bossHP}/{bossMaxHP}</span>
                </div>
                <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${(bossHP / bossMaxHP) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {bossVictory ? (
            /* VICTORY CELEBRATION CARD */
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-bounce">
                <Crown className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                  🎉 ALL HAIL THE PYTHON ARCHMAGE!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
                  You conquered Variable Forest, crossed the Logic Desert, scaled the Loop Mountains, and defeated the Bug Overlord at Function Castle!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 max-w-sm mx-auto text-xs space-y-2 text-slate-200">
                <div className="flex justify-between">
                  <span>Crown Title:</span>
                  <strong className="text-amber-400">Royal Python Archmage</strong>
                </div>
                <div className="flex justify-between">
                  <span>Bonus XP:</span>
                  <strong className="text-emerald-400">+500 XP Earned</strong>
                </div>
                <div className="flex justify-between">
                  <span>Karma Rewards:</span>
                  <strong className="text-amber-400">+150 Coins Awarded</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={restartBossBattle}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Play Boss Again
                </button>
                <button
                  onClick={() => setActiveRealm('hub')}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
                >
                  Return to Kingdom Map
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE BOSS BATTLE */
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1 font-mono">
                {bossBattleLog.map((log, i) => (
                  <div key={i} className={i === 0 ? 'text-purple-300 font-bold' : 'text-slate-500'}>
                    {log}
                  </div>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {bossPhases[bossStep]?.prompt}
              </p>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-purple-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {bossPhases[bossStep]?.codeSnippet}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  {bossPhases[bossStep]?.question}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bossPhases[bossStep]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBossAttack(idx)}
                      className={`p-3.5 rounded-2xl text-left text-xs font-mono transition-all border cursor-pointer ${
                        bossAnswer === idx
                          ? idx === bossPhases[bossStep].correct
                            ? 'border-purple-400 bg-purple-950/60 text-purple-200 ring-2 ring-purple-500'
                            : 'border-rose-500 bg-rose-950/60 text-rose-200'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-purple-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <span className="font-bold text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
