import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/gameAudio.js';
import {
  Sun,
  Sword,
  Shield,
  Zap,
  Heart,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';

interface LogicDesertBattleProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface FloatingText {
  id: number;
  text: string;
  color: string;
  isCrit?: boolean;
}

export const LogicDesertBattle: React.FC<LogicDesertBattleProps> = ({
  onComplete,
  onExit
}) => {
  // Player Stats
  const [playerHP, setPlayerHP] = useState(100);
  const [playerMaxHP] = useState(100);
  const [playerMana, setPlayerMana] = useState(60);
  const [playerMaxMana] = useState(60);
  const [isDefending, setIsDefending] = useState(false);

  // Enemy Stats (Indentation Scorpion)
  const [enemyHP, setEnemyHP] = useState(180);
  const [enemyMaxHP] = useState(180);
  const [enemyName] = useState('The Indentation Scorpion');

  // Animation States
  const [playerActionAnim, setPlayerActionAnim] = useState<'idle' | 'attack' | 'cast' | 'hurt'>('idle');
  const [enemyActionAnim, setEnemyActionAnim] = useState<'idle' | 'attack' | 'hurt'>('idle');
  const [screenShake, setScreenShake] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [battleLog, setBattleLog] = useState<string[]>([
    '⚔️ An Indentation Scorpion emerges from the logic sand dunes! Choose your conditional strike!'
  ]);
  const [soundMuted, setSoundMuted] = useState(false);
  const [battleWon, setBattleWon] = useState(false);
  const [battleLost, setBattleLost] = useState(false);

  useEffect(() => {
    soundFX.enabled = !soundMuted;
  }, [soundMuted]);

  const addFloatingText = (text: string, color: string, isCrit = false) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, color, isCrit }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
    }, 1200);
  };

  const triggerScreenShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 400);
  };

  // Enemy Turn Execution
  const handleEnemyTurn = (currentEnemyHP: number) => {
    if (currentEnemyHP <= 0) return;

    setTurn('enemy');
    setTimeout(() => {
      setEnemyActionAnim('attack');
      soundFX.playHit();
      triggerScreenShake();

      // Enemy moves randomly chosen
      const moves = [
        { name: 'Tabs vs Spaces Stinger', dmg: 22, desc: 'unleashes an unaligned Tab strike!' },
        { name: 'Unmatched IndentationError', dmg: 28, desc: 'spits a syntax venom cloud!' },
        { name: 'Missing Colon Whip', dmg: 18, desc: 'lashes with a missing `:` tail!' }
      ];
      const move = moves[Math.floor(Math.random() * moves.length)];

      let finalDmg = move.dmg;
      if (isDefending) {
        finalDmg = Math.round(move.dmg * 0.3); // 70% blocked!
        addFloatingText(`BLOCKED! -${finalDmg} HP`, '#38bdf8');
        setBattleLog((prev) => [
          `🛡️ Elif Aegis absorbed the brunt of ${move.name}! You only took ${finalDmg} DMG!`,
          ...prev.slice(0, 4)
        ]);
        setIsDefending(false);
      } else {
        addFloatingText(`-${finalDmg} HP`, '#ef4444');
        setBattleLog((prev) => [
          `🦂 ${enemyName} ${move.desc} You took ${finalDmg} DMG!`,
          ...prev.slice(0, 4)
        ]);
      }

      setPlayerActionAnim('hurt');
      setPlayerHP((prev) => {
        const next = Math.max(0, prev - finalDmg);
        if (next <= 0) {
          setBattleLost(true);
        }
        return next;
      });

      // Regenerate 10 Mana each turn
      setPlayerMana((prev) => Math.min(playerMaxMana, prev + 10));

      setTimeout(() => {
        setEnemyActionAnim('idle');
        setPlayerActionAnim('idle');
        setTurn('player');
      }, 700);
    }, 1000);
  };

  // Player Actions
  const handleAttack = (type: 'if_else' | 'elif_shield' | 'ternary' | 'boolean_blast' | 'heal') => {
    if (turn !== 'player' || battleWon || battleLost) return;

    if (type === 'if_else') {
      // If-Else Strike
      setPlayerActionAnim('attack');
      soundFX.playLaser();
      setEnemyActionAnim('hurt');

      const isBonus = playerMana >= 15;
      const dmg = isBonus ? 38 : 22;
      const newMana = isBonus ? playerMana - 15 : playerMana;
      setPlayerMana(newMana);

      addFloatingText(`-${dmg} DMG!`, isBonus ? '#f59e0b' : '#ffffff', isBonus);
      const newEnemyHP = Math.max(0, enemyHP - dmg);
      setEnemyHP(newEnemyHP);

      setBattleLog((prev) => [
        `⚔️ If-Else Strike: Condition \`mana >= 15\` evaluated to ${isBonus ? 'True (CRITICAL +38 DMG!)' : 'False (+22 DMG)'}!`,
        ...prev.slice(0, 4)
      ]);

      if (newEnemyHP <= 0) {
        soundFX.playVictory();
        setBattleWon(true);
      } else {
        setTimeout(() => {
          setPlayerActionAnim('idle');
          setEnemyActionAnim('idle');
          handleEnemyTurn(newEnemyHP);
        }, 600);
      }
    } else if (type === 'elif_shield') {
      // Elif Aegis (Defensive posture)
      setIsDefending(true);
      setPlayerActionAnim('cast');
      soundFX.playPowerup();
      addFloatingText('AEGIS ACTIVE!', '#38bdf8');
      setBattleLog((prev) => [
        '🛡️ Elif Aegis activated: Evaluated secondary fallback gate! 70% damage reduction next turn!',
        ...prev.slice(0, 4)
      ]);

      setTimeout(() => {
        setPlayerActionAnim('idle');
        handleEnemyTurn(enemyHP);
      }, 600);
    } else if (type === 'ternary') {
      // Ternary Slash (Double hit)
      setPlayerActionAnim('attack');
      soundFX.playLaser();
      setEnemyActionAnim('hurt');

      const dmg1 = 18;
      const dmg2 = 18;
      const total = dmg1 + dmg2;
      const newEnemyHP = Math.max(0, enemyHP - total);
      setEnemyHP(newEnemyHP);
      addFloatingText(`-${dmg1} -${dmg2} TERNARY!`, '#ec4899', true);

      setBattleLog((prev) => [
        `⚡ Ternary Expression: \`dmg if hit else 0\` struck twice in a single line (+${total} DMG)!`,
        ...prev.slice(0, 4)
      ]);

      if (newEnemyHP <= 0) {
        soundFX.playVictory();
        setBattleWon(true);
      } else {
        setTimeout(() => {
          setPlayerActionAnim('idle');
          setEnemyActionAnim('idle');
          handleEnemyTurn(newEnemyHP);
        }, 600);
      }
    } else if (type === 'boolean_blast') {
      // Ultimate Boolean Blast (costs 40 mana)
      if (playerMana < 40) {
        addFloatingText('LOW MANA!', '#ef4444');
        return;
      }
      setPlayerMana((prev) => prev - 40);
      setPlayerActionAnim('cast');
      soundFX.playPowerup();
      soundFX.playLaser();
      triggerScreenShake();
      setEnemyActionAnim('hurt');

      const dmg = 65;
      const newEnemyHP = Math.max(0, enemyHP - dmg);
      setEnemyHP(newEnemyHP);
      addFloatingText(`-${dmg} MEGA BLAST!`, '#a855f7', true);

      setBattleLog((prev) => [
        `💥 ULTIMATE: \`not False\` Boolean Nova vaporized logic impurities for +${dmg} DMG!`,
        ...prev.slice(0, 4)
      ]);

      if (newEnemyHP <= 0) {
        soundFX.playVictory();
        setBattleWon(true);
      } else {
        setTimeout(() => {
          setPlayerActionAnim('idle');
          setEnemyActionAnim('idle');
          handleEnemyTurn(newEnemyHP);
        }, 600);
      }
    } else if (type === 'heal') {
      // Heal Elixir (costs 20 mana)
      if (playerMana < 20) {
        addFloatingText('LOW MANA!', '#ef4444');
        return;
      }
      setPlayerMana((prev) => prev - 20);
      setPlayerActionAnim('cast');
      soundFX.playCoin();
      const healAmt = 35;
      setPlayerHP((prev) => Math.min(playerMaxHP, prev + healAmt));
      addFloatingText(`+${healAmt} HP`, '#10b981');
      setBattleLog((prev) => [
        `🧪 Garbage Collection Elixir reclaimed memory and restored ${healAmt} HP!`,
        ...prev.slice(0, 4)
      ]);

      setTimeout(() => {
        setPlayerActionAnim('idle');
        handleEnemyTurn(enemyHP);
      }, 600);
    }
  };

  const restartBattle = () => {
    setPlayerHP(100);
    setPlayerMana(60);
    setEnemyHP(180);
    setIsDefending(false);
    setBattleWon(false);
    setBattleLost(false);
    setTurn('player');
    setBattleLog(['⚔️ Battle restarted! Face the Indentation Scorpion once more!']);
  };

  return (
    <div
      className={`rounded-3xl border border-amber-500/40 bg-slate-950 p-6 text-white shadow-2xl space-y-5 transition-transform ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Realm Game Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sun className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-['Space_Grotesk'] text-white">
                🏜️ Realm 2: Logic Desert Battle Arena
              </h2>
              <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 border border-amber-500/30">
                Turn-Based RPG Combat
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Battle the Indentation Scorpion using Boolean logic, If/Elif shields, and Ternary slashes!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            Exit to Map
          </button>
        </div>
      </div>

      {/* 2D Animated Combat Arena Canvas / Stage */}
      <div className="relative rounded-3xl border-2 border-amber-600/30 bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[340px] flex flex-col justify-between">
        {/* Background dunes & floating sparkles */}
        <div className="absolute top-4 right-12 text-6xl opacity-10 pointer-events-none select-none">
          🏜️
        </div>

        {/* Floating Combat Damage Numbers */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className={`text-lg sm:text-2xl font-black font-mono animate-bounce drop-shadow-md`}
              style={{ color: ft.color }}
            >
              {ft.text}
            </div>
          ))}
        </div>

        {/* Top Arena Layer: Enemy Side */}
        <div className="flex items-start justify-between">
          <div />

          {/* Enemy HUD & Sprite */}
          <div className="text-right space-y-2 max-w-xs">
            <div className="flex items-center justify-end gap-2">
              <span className="rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 border border-rose-500/30">
                Boss Beast
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white font-['Space_Grotesk']">
                {enemyName}
              </h3>
            </div>

            {/* Enemy HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>HP</span>
                <span>
                  {enemyHP} / {enemyMaxHP}
                </span>
              </div>
              <div className="w-48 sm:w-56 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-300"
                  style={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}
                />
              </div>
            </div>

            {/* Animated Enemy Avatar */}
            <div
              className={`inline-block text-6xl sm:text-7xl pt-2 transition-transform duration-200 ${
                enemyActionAnim === 'attack'
                  ? '-translate-x-12 scale-110'
                  : enemyActionAnim === 'hurt'
                  ? 'translate-x-6 opacity-60'
                  : 'animate-pulse'
              }`}
            >
              🦂
            </div>
          </div>
        </div>

        {/* Bottom Arena Layer: Player Side */}
        <div className="flex items-end justify-between pt-8">
          {/* Player Sprite & HUD */}
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white font-['Space_Grotesk']">
                Python Knight (You)
              </h3>
              {isDefending && (
                <span className="rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-500/30">
                  🛡️ Aegis Active
                </span>
              )}
            </div>

            {/* Player HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                  <span>Health</span>
                </span>
                <span>
                  {playerHP} / {playerMaxHP}
                </span>
              </div>
              <div className="w-48 sm:w-56 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                />
              </div>
            </div>

            {/* Player Mana Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span>Mana (Logic Fuel)</span>
                </span>
                <span>
                  {playerMana} / {playerMaxMana}
                </span>
              </div>
              <div className="w-48 sm:w-56 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300"
                  style={{ width: `${(playerMana / playerMaxMana) * 100}%` }}
                />
              </div>
            </div>

            {/* Animated Player Avatar */}
            <div
              className={`inline-block text-6xl sm:text-7xl pt-2 transition-transform duration-200 ${
                playerActionAnim === 'attack'
                  ? 'translate-x-12 scale-110'
                  : playerActionAnim === 'cast'
                  ? '-translate-y-4 scale-105'
                  : playerActionAnim === 'hurt'
                  ? '-translate-x-6 opacity-60'
                  : ''
              }`}
            >
              🧙‍♂️
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 text-xs font-mono font-bold">
            {turn === 'player' ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Your Turn to Strike</span>
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Enemy Countering...</span>
              </span>
            )}
          </div>
        </div>

        {/* Victory Overlay */}
        {battleWon && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="text-5xl">🏆</div>
            <h3 className="text-2xl font-black text-amber-400 font-['Space_Grotesk']">
              Indentation Scorpion Slain!
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Your mastery over `if/elif/else` syntax and boolean algebra freed the desert from syntax errors!
              +150 XP and 45 Karma Coins awarded!
            </p>
            <button
              onClick={() => onComplete(150)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              Ascend to Loop Mountains →
            </button>
          </div>
        )}

        {/* Defeat Overlay */}
        {battleLost && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="text-5xl">💀</div>
            <h3 className="text-2xl font-black text-rose-500 font-['Space_Grotesk']">
              You Were Defeated in Combat!
            </h3>
            <p className="text-xs text-slate-300">
              The Indentation Scorpion overpowered your shields. Adjust your tactical conditional logic!
            </p>
            <button
              onClick={restartBattle}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Battle</span>
            </button>
          </div>
        )}
      </div>

      {/* Battle Command Center (Combat Tactical Action Buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Action 1: If-Else Blade */}
        <button
          disabled={turn !== 'player' || battleWon || battleLost}
          onClick={() => handleAttack('if_else')}
          className="p-3.5 rounded-2xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/50 disabled:opacity-50 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Sword className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-amber-400 font-mono font-bold">15 Mana</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">⚔️ If-Else Blade</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Deals 38 DMG if Mana ≥ 15, else 22 DMG.
          </div>
        </button>

        {/* Action 2: Elif Shield */}
        <button
          disabled={turn !== 'player' || battleWon || battleLost}
          onClick={() => handleAttack('elif_shield')}
          className="p-3.5 rounded-2xl border border-blue-500/40 bg-blue-950/30 hover:bg-blue-900/50 disabled:opacity-50 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Shield className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-blue-400 font-mono font-bold">0 Mana</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">🛡️ Elif Aegis</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Blocks 70% of next enemy attack.
          </div>
        </button>

        {/* Action 3: Ternary Slash */}
        <button
          disabled={turn !== 'player' || battleWon || battleLost}
          onClick={() => handleAttack('ternary')}
          className="p-3.5 rounded-2xl border border-pink-500/40 bg-pink-950/30 hover:bg-pink-900/50 disabled:opacity-50 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Zap className="h-4 w-4 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-pink-400 font-mono font-bold">Fast</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">⚡ Ternary Strike</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Rapid 2x multi-hit (36 total damage).
          </div>
        </button>

        {/* Action 4: Boolean Blast */}
        <button
          disabled={turn !== 'player' || battleWon || battleLost || playerMana < 40}
          onClick={() => handleAttack('boolean_blast')}
          className="p-3.5 rounded-2xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50 disabled:opacity-50 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-purple-400 font-mono font-bold">40 Mana</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">💥 Boolean Nova</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Heavy 65 DMG Ultimate attack!
          </div>
        </button>

        {/* Action 5: Heal Elixir */}
        <button
          disabled={turn !== 'player' || battleWon || battleLost || playerMana < 20}
          onClick={() => handleAttack('heal')}
          className="p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 disabled:opacity-50 text-left transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <Heart className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-emerald-400 font-mono font-bold">20 Mana</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">🧪 Restore HP</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Reclaims memory (+35 HP).
          </div>
        </button>
      </div>

      {/* Battle Combat Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 font-mono text-[11px] text-slate-300 space-y-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 mb-1">
          Combat Log
        </div>
        {battleLog.slice(0, 3).map((log, idx) => (
          <div key={idx} className="leading-tight">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
