import React, { useRef, useEffect, useState } from 'react';
import { soundFX } from '../../utils/gameAudio.js';
import {
  Castle,
  Crown,
  Zap,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';

interface FunctionCastleBossProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isBoss: boolean;
  color: string;
  radius: number;
  dmg: number;
}

export const FunctionCastleBoss: React.FC<FunctionCastleBossProps> = ({
  onComplete,
  onExit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player Stats
  const [playerHP, setPlayerHP] = useState(100);
  const playerMaxHP = 100;
  const [playerMana, setPlayerMana] = useState(100);
  const playerMaxMana = 100;

  // Boss Stats (The Bug Overlord)
  const [bossHP, setBossHP] = useState(400);
  const bossMaxHP = 400;
  const [bossPhase, setBossPhase] = useState<'Phase 1: Base Case' | 'Phase 2: Stack Overflow'>(
    'Phase 1: Base Case'
  );

  const [soundMuted, setSoundMuted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    soundFX.enabled = !soundMuted;
  }, [soundMuted]);

  // Keys Tracking
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const fireTriggerRef = useRef<'basic' | 'args' | 'lambda' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        fireTriggerRef.current = 'basic';
      }
      if (e.key === 'q' || e.key === 'Q') {
        fireTriggerRef.current = 'args';
      }
      if (e.key === 'e' || e.key === 'E') {
        fireTriggerRef.current = 'lambda';
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Boss Arena Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Player position
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 50,
      radius: 16,
      speed: 4.5
    };

    // Boss position
    const boss = {
      x: canvas.width / 2,
      y: 75,
      radius: 40,
      vx: 2.2,
      lastAttack: Date.now()
    };

    let projectiles: Projectile[] = [];
    let currentBossHP = bossHP;
    let currentPlayerHP = playerHP;

    let tick = 0;

    const loop = () => {
      tick++;

      // 1. Move Player
      const keys = keysRef.current;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;
      if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
      if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;

      // Keep player inside arena
      player.x = Math.max(player.radius + 10, Math.min(canvas.width - player.radius - 10, player.x));
      player.y = Math.max(160, Math.min(canvas.height - player.radius - 10, player.y));

      // 2. Move Boss
      boss.x += boss.vx;
      if (boss.x < 100 || boss.x > canvas.width - 100) {
        boss.vx *= -1;
      }

      // 3. Fire Player Attacks
      if (fireTriggerRef.current) {
        const attackType = fireTriggerRef.current;
        fireTriggerRef.current = null;

        if (attackType === 'basic') {
          soundFX.playLaser();
          projectiles.push({
            x: player.x,
            y: player.y - 18,
            vx: 0,
            vy: -8,
            isBoss: false,
            color: '#38bdf8',
            radius: 5,
            dmg: 18
          });
        } else if (attackType === 'args') {
          // *args multi-spread
          soundFX.playLaser();
          [-2, -1, 0, 1, 2].forEach((offset) => {
            projectiles.push({
              x: player.x,
              y: player.y - 18,
              vx: offset * 1.8,
              vy: -7,
              isBoss: false,
              color: '#f59e0b',
              radius: 6,
              dmg: 14
            });
          });
        } else if (attackType === 'lambda') {
          // Lambda solar blast
          soundFX.playPowerup();
          soundFX.playLaser();
          projectiles.push({
            x: player.x,
            y: player.y - 25,
            vx: 0,
            vy: -10,
            isBoss: false,
            color: '#c084fc',
            radius: 12,
            dmg: 50
          });
        }
      }

      // 4. Boss AI Attacks
      const now = Date.now();
      const attackCooldown = currentBossHP < 200 ? 900 : 1400; // Enrage in Phase 2
      if (now - boss.lastAttack > attackCooldown) {
        boss.lastAttack = now;
        soundFX.playLaser();

        if (currentBossHP < 200) {
          // Phase 2: Spiral StackOverflow bullet pattern
          setBossPhase('Phase 2: Stack Overflow');
          [-2, -1, 0, 1, 2].forEach((spread) => {
            projectiles.push({
              x: boss.x,
              y: boss.y + 35,
              vx: spread * 1.5,
              vy: 4.5,
              isBoss: true,
              color: '#ef4444',
              radius: 7,
              dmg: 18
            });
          });
        } else {
          // Phase 1: Targeted Recursion Fireball
          const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
          projectiles.push({
            x: boss.x,
            y: boss.y + 35,
            vx: Math.cos(angle) * 4.5,
            vy: Math.sin(angle) * 4.5,
            isBoss: true,
            color: '#f97316',
            radius: 9,
            dmg: 22
          });
        }
      }

      // 5. Update Projectiles
      projectiles.forEach((proj) => {
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Player bullet hits boss
        if (!proj.isBoss) {
          const dist = Math.hypot(proj.x - boss.x, proj.y - boss.y);
          if (dist < boss.radius + proj.radius) {
            soundFX.playHit();
            currentBossHP = Math.max(0, currentBossHP - proj.dmg);
            setBossHP(currentBossHP);
            proj.y = -999; // destroy bullet

            if (currentBossHP <= 0 && !gameWon) {
              setGameWon(true);
              soundFX.playVictory();
              onComplete(300);
            }
          }
        } else {
          // Boss fireball hits player
          const dist = Math.hypot(proj.x - player.x, proj.y - player.y);
          if (dist < player.radius + proj.radius) {
            soundFX.playHit();
            currentPlayerHP = Math.max(0, currentPlayerHP - proj.dmg);
            setPlayerHP(currentPlayerHP);
            proj.y = 9999; // destroy bullet

            if (currentPlayerHP <= 0 && !gameOver) {
              setGameOver(true);
            }
          }
        }
      });

      // Filter off-screen bullets
      projectiles = projectiles.filter(
        (p) => p.x > 0 && p.x < canvas.width && p.y > 0 && p.y < canvas.height
      );

      // ----------------------------------------------------
      // RENDER ARENA
      // ----------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark Citadel Floor
      ctx.fillStyle = '#1e1b4b'; // deep purple castle interior
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid lines
      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Projectiles
      projectiles.forEach((proj) => {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fillStyle = proj.color;
        ctx.fill();
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 8;
      });
      ctx.shadowBlur = 0; // reset shadow

      // Draw Boss: The Bug Overlord (Recursion Dragon)
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
      ctx.fillStyle = currentBossHP < 200 ? '#7f1d1d' : '#581c87';
      ctx.fill();
      ctx.strokeStyle = currentBossHP < 200 ? '#ef4444' : '#c084fc';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐉', boss.x, boss.y);

      // Boss name banner above boss
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('THE BUG OVERLORD', boss.x, boss.y - boss.radius - 8);

      // Draw Player Hero
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧙‍♂️', player.x, player.y);

      if (!gameWon && !gameOver) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameWon, gameOver]);

  return (
    <div className="rounded-3xl border border-purple-500/50 bg-slate-950 p-6 text-white shadow-2xl space-y-4">
      {/* Boss Arena Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Castle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-['Space_Grotesk'] text-white">
                🏰 Realm 4: Function Castle (👑 FINAL BOSS)
              </h2>
              <span className="rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black px-2.5 py-0.5 border border-purple-500/40 animate-pulse">
                Action Arena Gauntlet
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dodge RecursionError firestorms and blast the Bug Overlord using function magic spells!
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-purple-400" />}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            Exit to Map
          </button>
        </div>
      </div>

      {/* Giant Boss Health Bar */}
      <div className="rounded-2xl border border-purple-500/40 bg-purple-950/30 p-3 space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-white flex items-center gap-1.5">
            <Crown className="h-4 w-4 text-amber-400" />
            <span>THE BUG OVERLORD (Recursion Dragon)</span>
          </span>
          <span className="text-purple-300 font-bold">{bossPhase}</span>
          <span className="text-amber-400 font-bold">
            {bossHP} / {bossMaxHP} HP
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-purple-500/40">
          <div
            className={`h-full transition-all duration-200 ${
              bossHP > 200
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
                : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
            }`}
            style={{ width: `${(bossHP / bossMaxHP) * 100}%` }}
          />
        </div>
      </div>

      {/* 2D Canvas Boss Combat Arena */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-purple-600/40 bg-slate-900 shadow-inner flex justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="w-full h-auto max-w-full block bg-slate-950"
        />

        {/* Victory Screen */}
        {gameWon && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="text-6xl animate-bounce">👑</div>
            <h3 className="text-3xl font-black text-amber-400 font-['Space_Grotesk']">
              THE BUG OVERLORD HAS BEEN SLAIN!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-lg">
              You conquered all 4 realms of Python Kingdom! You are officially crowned the{' '}
              <strong className="text-amber-300">Grand Python Archmage of India</strong>.
              +300 XP and 100 Karma Coins added to your cadre wallet!
            </p>
            <button
              onClick={() => onComplete(300)}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 font-black text-sm shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              Claim Royal Archmage Crown →
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💀</div>
            <h3 className="text-2xl font-black text-rose-500 font-['Space_Grotesk']">
              Recursion Depth Exceeded!
            </h3>
            <p className="text-xs text-slate-300">
              The Bug Overlord vaporized your functions. Formulate your base case and attack again!
            </p>
            <button
              onClick={() => {
                setPlayerHP(100);
                setBossHP(400);
                setGameOver(false);
                setBossPhase('Phase 1: Base Case');
              }}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Boss Fight</span>
            </button>
          </div>
        )}
      </div>

      {/* Player Spells / Attacks & Touch Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Spell 1: def strike */}
        <button
          onClick={() => {
            fireTriggerRef.current = 'basic';
          }}
          className="p-3.5 rounded-2xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 active:scale-95 text-left transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-[10px] text-blue-300 font-mono">SPACEBAR</span>
          </div>
          <div className="font-bold text-xs text-white mt-1">⚡ def attack() Bolt</div>
          <div className="text-[10px] text-slate-400">18 DMG plasma projectile</div>
        </button>

        {/* Spell 2: *args multi-spread */}
        <button
          onClick={() => {
            fireTriggerRef.current = 'args';
          }}
          className="p-3.5 rounded-2xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 active:scale-95 text-left transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between">
            <Flame className="h-4 w-4 text-amber-400" />
            <span className="text-[10px] text-amber-300 font-mono">KEY: Q</span>
          </div>
          <div className="font-bold text-xs text-white mt-1">🔥 *args Multi-Burst</div>
          <div className="text-[10px] text-slate-400">5-way fan spread attack</div>
        </button>

        {/* Spell 3: lambda ultimate */}
        <button
          onClick={() => {
            fireTriggerRef.current = 'lambda';
          }}
          className="p-3.5 rounded-2xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 active:scale-95 text-left transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-[10px] text-purple-300 font-mono">KEY: E</span>
          </div>
          <div className="font-bold text-xs text-white mt-1">💥 lambda Solar Nova</div>
          <div className="text-[10px] text-slate-400">Heavy 50 DMG charge blast</div>
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-400">
        Controls: Move with <strong>WASD / Arrow Keys</strong>. Shoot with <strong>SPACEBAR, Q, or E</strong> (or tap buttons above).
      </div>
    </div>
  );
};
