import React, { useRef, useEffect, useState } from 'react';
import { soundFX } from '../../utils/gameAudio.js';
import {
  Mountain,
  Target,
  ArrowRight,
  Heart,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Sparkles
} from 'lucide-react';

interface LoopMountainsRunnerProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface Obstacle {
  x: number;
  w: number;
  h: number;
  type: 'spike' | 'rock';
}

interface Collectible {
  x: number;
  y: number;
  type: 'iteration' | 'break' | 'continue';
  collected: boolean;
}

export const LoopMountainsRunner: React.FC<LoopMountainsRunnerProps> = ({
  onComplete,
  onExit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Runner state
  const [iteration, setIteration] = useState(0); // for i in range(10)
  const maxIterations = 10;
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasDoubleJump, setHasDoubleJump] = useState(false);
  const [hasBreakPower, setHasBreakPower] = useState(false);

  useEffect(() => {
    soundFX.enabled = !soundMuted;
  }, [soundMuted]);

  // Jump Trigger Reference
  const jumpTriggerRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jumpTriggerRef.current = true;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main 2D Platformer Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics constants
    const gravity = 0.65;
    const groundY = 320;

    // Player runner state
    const p = {
      x: 80,
      y: groundY - 40,
      w: 28,
      h: 38,
      vy: 0,
      isGrounded: true,
      jumpsRemaining: 1
    };

    let worldX = 0;
    const speed = 3.5;

    // Level design matching 10 loop iterations
    const obstacles: Obstacle[] = [
      { x: 340, w: 28, h: 35, type: 'spike' },
      { x: 580, w: 34, h: 42, type: 'rock' },
      { x: 860, w: 28, h: 35, type: 'spike' },
      { x: 1150, w: 34, h: 42, type: 'rock' },
      { x: 1450, w: 28, h: 35, type: 'spike' },
      { x: 1780, w: 34, h: 42, type: 'rock' },
      { x: 2100, w: 28, h: 35, type: 'spike' },
      { x: 2400, w: 34, h: 42, type: 'rock' },
      { x: 2750, w: 28, h: 35, type: 'spike' }
    ];

    const items: Collectible[] = [
      { x: 260, y: groundY - 70, type: 'iteration', collected: false },
      { x: 480, y: groundY - 60, type: 'continue', collected: false },
      { x: 750, y: groundY - 70, type: 'iteration', collected: false },
      { x: 1020, y: groundY - 60, type: 'break', collected: false },
      { x: 1320, y: groundY - 70, type: 'iteration', collected: false },
      { x: 1640, y: groundY - 60, type: 'continue', collected: false },
      { x: 1950, y: groundY - 70, type: 'iteration', collected: false },
      { x: 2280, y: groundY - 60, type: 'break', collected: false },
      { x: 2600, y: groundY - 70, type: 'iteration', collected: false }
    ];

    const loop = () => {
      // 1. Advance World
      worldX += speed;

      // Calculate iteration progress (0 to 10)
      const currentIter = Math.min(10, Math.floor(worldX / 280));
      setIteration(currentIter);

      // 2. Handle Jump
      if (jumpTriggerRef.current) {
        jumpTriggerRef.current = false;
        if (p.isGrounded || p.jumpsRemaining > 0) {
          p.vy = -12.5;
          p.isGrounded = false;
          p.jumpsRemaining--;
          soundFX.playJump();
        }
      }

      // 3. Apply Gravity
      p.vy += gravity;
      p.y += p.vy;

      // Ground collision
      if (p.y >= groundY - p.h) {
        p.y = groundY - p.h;
        p.vy = 0;
        p.isGrounded = true;
        p.jumpsRemaining = hasDoubleJump ? 2 : 1;
      }

      // 4. Collectibles collision
      items.forEach((item) => {
        if (!item.collected) {
          const screenX = item.x - worldX + p.x;
          const dist = Math.hypot(p.x + p.w / 2 - screenX, p.y + p.h / 2 - item.y);
          if (dist < 32) {
            item.collected = true;
            soundFX.playCoin();
            setScore((prev) => prev + 50);

            if (item.type === 'continue') {
              setHasDoubleJump(true);
              soundFX.playPowerup();
            } else if (item.type === 'break') {
              setHasBreakPower(true);
              soundFX.playPowerup();
            }
          }
        }
      });

      // 5. Obstacle collision
      obstacles.forEach((obs) => {
        const screenX = obs.x - worldX + p.x;
        // Check AABB bounding box
        if (
          p.x < screenX + obs.w &&
          p.x + p.w > screenX &&
          p.y < groundY &&
          p.y + p.h > groundY - obs.h
        ) {
          if (obs.type === 'rock' && hasBreakPower) {
            // Smash rock with break statement!
            obs.h = 0; // destroyed
            soundFX.playPowerup();
            setScore((prev) => prev + 100);
          } else {
            // Hit obstacle
            soundFX.playHit();
            setLives((prev) => {
              const next = Math.max(0, prev - 1);
              if (next <= 0) {
                setGameOver(true);
              }
              return next;
            });
            // Knock forward past obstacle to prevent multihit
            worldX += 60;
          }
        }
      });

      // 6. Check Summit Goal (i == 10)
      if (worldX > 2900) {
        if (!gameWon) {
          setGameWon(true);
          soundFX.playVictory();
          onComplete(200);
        }
      }

      // ----------------------------------------------------
      // RENDER CANVAS
      // ----------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Parallax Sky & Mountain Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant mountain peaks
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(120, 140);
      ctx.lineTo(260, groundY);
      ctx.lineTo(420, 160);
      ctx.lineTo(580, groundY);
      ctx.lineTo(640, 200);
      ctx.fill();

      // Foreground Ground / Path
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, groundY, canvas.width, 6); // neon blue summit trail

      // Draw Items
      items.forEach((item) => {
        if (!item.collected) {
          const screenX = item.x - worldX + p.x;
          if (screenX > -40 && screenX < canvas.width + 40) {
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            if (item.type === 'iteration') {
              ctx.fillText('💎', screenX, item.y);
            } else if (item.type === 'continue') {
              ctx.fillText('🪶', screenX, item.y);
            } else {
              ctx.fillText('🔨', screenX, item.y);
            }
          }
        }
      });

      // Draw Obstacles
      obstacles.forEach((obs) => {
        const screenX = obs.x - worldX + p.x;
        if (screenX > -40 && screenX < canvas.width + 40 && obs.h > 0) {
          if (obs.type === 'spike') {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(screenX, groundY);
            ctx.lineTo(screenX + obs.w / 2, groundY - obs.h);
            ctx.lineTo(screenX + obs.w, groundY);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('while True', screenX - 8, groundY - obs.h - 5);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(screenX, groundY - obs.h, obs.w, obs.h);
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('ROCK', screenX + 2, groundY - obs.h - 5);
          }
        }
      });

      // Draw Summit Flag (End of Loop)
      const flagScreenX = 2950 - worldX + p.x;
      if (flagScreenX > -40 && flagScreenX < canvas.width + 40) {
        ctx.font = '36px sans-serif';
        ctx.fillText('🚩', flagScreenX, groundY - 40);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('SUMMIT i=10', flagScreenX - 25, groundY - 55);
      }

      // Draw Player Hero
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏃‍♂️', p.x + p.w / 2, p.y + p.h - 4);

      if (!gameOver && !gameWon) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [hasDoubleJump, hasBreakPower, gameOver, gameWon]);

  return (
    <div className="rounded-3xl border border-blue-500/40 bg-slate-950 p-6 text-white shadow-2xl space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Mountain className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-['Space_Grotesk'] text-white">
                🏔️ Realm 3: Loop Mountains Platformer
              </h2>
              <span className="rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-500/30">
                2D Arcade Runner
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Jump across loop ledges, dodge infinite while loops, and iterate through `range(10)` to summit!
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                className={`h-4 w-4 ${i <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-blue-400" />}
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            Exit to Map
          </button>
        </div>
      </div>

      {/* Live Python Loop Counter HUD */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-3 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold">for i in range(10):</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-blue-500 text-slate-950 font-black">
            i = {iteration}
          </span>
          <span className="text-slate-400">({iteration * 10}% Complete)</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>Score: <strong className="text-amber-400">{score} Pts</strong></span>
          {hasDoubleJump && (
            <span className="rounded bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 border border-teal-500/30">
              🪶 Continue Double Jump
            </span>
          )}
          {hasBreakPower && (
            <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 border border-amber-500/30">
              🔨 Break Rock Smash
            </span>
          )}
        </div>
      </div>

      {/* 2D Canvas Platformer Area */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-blue-600/40 bg-slate-900 shadow-inner flex justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={380}
          className="w-full h-auto max-w-full block bg-slate-950"
        />

        {/* Victory Screen */}
        {gameWon && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="text-5xl">🚩</div>
            <h3 className="text-2xl font-black text-blue-400 font-['Space_Grotesk']">
              Summit Reached: Loop Range Exhausted!
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              You climbed all 10 loop cycles, harnessed `break` and `continue`, and conquered Loop Mountains!
              Function Castle has unlocked!
            </p>
            <button
              onClick={() => onComplete(200)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              Challenge The Final Boss at Function Castle →
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💥</div>
            <h3 className="text-2xl font-black text-rose-500 font-['Space_Grotesk']">
              Trapped in an Infinite Loop!
            </h3>
            <p className="text-xs text-slate-300">
              You collided with obstacles and lost all health. Reset your iterator and try again!
            </p>
            <button
              onClick={() => {
                setLives(3);
                setScore(0);
                setGameOver(false);
                setHasDoubleJump(false);
                setHasBreakPower(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Ascent</span>
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Jump Button (Mobile & Mouse Friendly) */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          Desktop: Press <strong>SPACEBAR</strong> or <strong>W / UP</strong> to jump.
        </span>
        <button
          onClick={() => {
            jumpTriggerRef.current = true;
          }}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 active:scale-95 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer"
        >
          <Zap className="h-5 w-5" />
          <span>TAP TO JUMP</span>
        </button>
      </div>
    </div>
  );
};
