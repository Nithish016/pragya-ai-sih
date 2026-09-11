import React, { useRef, useEffect, useState } from 'react';
import { soundFX } from '../../utils/gameAudio.js';
import {
  Trees,
  Puzzle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Heart,
  Shield,
  Volume2,
  VolumeX,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';

interface VariableForestExplorerProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface Item {
  id: string;
  x: number;
  y: number;
  type: 'int' | 'str' | 'float' | 'bool';
  name: string;
  val: string;
  color: string;
  icon: string;
  collected: boolean;
}

interface Gate {
  x: number;
  y: number;
  w: number;
  h: number;
  requiredItem: string;
  label: string;
  opened: boolean;
}

interface PatrolBug {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const VariableForestExplorer: React.FC<VariableForestExplorerProps> = ({
  onComplete,
  onExit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player State
  const [player, setPlayer] = useState({
    x: 60,
    y: 60,
    radius: 16,
    speed: 4,
    direction: 'down',
    moving: false
  });

  const [hp, setHp] = useState(3);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [soundMuted, setSoundMuted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [objectiveText, setObjectiveText] = useState(
    '🌲 Objective: Explore the forest, collect variable crystals, and place them into the Type Altars to open the gates!'
  );

  // World Items (Python Primitive Crystals)
  const [items, setItems] = useState<Item[]>([
    {
      id: 'i1',
      x: 180,
      y: 100,
      type: 'int',
      name: 'survey_year',
      val: '2026',
      color: '#10B981',
      icon: '💎',
      collected: false
    },
    {
      id: 'i2',
      x: 320,
      y: 220,
      type: 'str',
      name: 'state_name',
      val: '"Telangana"',
      color: '#3B82F6',
      icon: '📜',
      collected: false
    },
    {
      id: 'i3',
      x: 120,
      y: 340,
      type: 'float',
      name: 'growth_rate',
      val: '8.4',
      color: '#F59E0B',
      icon: '🧪',
      collected: false
    },
    {
      id: 'i4',
      x: 480,
      y: 120,
      type: 'bool',
      name: 'is_verified',
      val: 'True',
      color: '#EC4899',
      icon: '🗝️',
      collected: false
    }
  ]);

  // Puzzle Gates
  const [gates, setGates] = useState<Gate[]>([
    {
      x: 230,
      y: 140,
      w: 24,
      h: 90,
      requiredItem: 'int',
      label: 'Altar 1: Requires int (survey_year)',
      opened: false
    },
    {
      x: 390,
      y: 260,
      w: 90,
      h: 24,
      requiredItem: 'str',
      label: 'Altar 2: Requires str (state_name)',
      opened: false
    },
    {
      x: 520,
      y: 200,
      w: 24,
      h: 110,
      requiredItem: 'bool',
      label: 'Final Portal: Requires bool (is_verified)',
      opened: false
    }
  ]);

  // Patrol Bugs (Enemies that patrol paths)
  const [bugs, setBugs] = useState<PatrolBug[]>([
    { x: 280, y: 80, vx: 1.5, vy: 0, radius: 12 },
    { x: 260, y: 320, vx: 0, vy: 2, radius: 12 },
    { x: 450, y: 200, vx: 1.8, vy: 1.2, radius: 14 }
  ]);

  // Key tracking
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    soundFX.enabled = !soundMuted;
  }, [soundMuted]);

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
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

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pX = player.x;
    let pY = player.y;

    const loop = () => {
      // 1. Move Player
      let moved = false;
      const speed = player.speed;
      const keys = keysRef.current;

      let nextX = pX;
      let nextY = pY;

      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        nextY -= speed;
        moved = true;
      }
      if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        nextY += speed;
        moved = true;
      }
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        nextX -= speed;
        moved = true;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        nextX += speed;
        moved = true;
      }

      // World bounds collision
      nextX = Math.max(player.radius + 10, Math.min(canvas.width - player.radius - 10, nextX));
      nextY = Math.max(player.radius + 10, Math.min(canvas.height - player.radius - 10, nextY));

      // Gate collision
      let gateBlocked = false;
      gates.forEach((gate) => {
        if (!gate.opened) {
          if (
            nextX + player.radius > gate.x &&
            nextX - player.radius < gate.x + gate.w &&
            nextY + player.radius > gate.y &&
            nextY - player.radius < gate.y + gate.h
          ) {
            gateBlocked = true;
          }
        }
      });

      if (!gateBlocked) {
        pX = nextX;
        pY = nextY;
      }

      // Check item collection
      items.forEach((item) => {
        if (!item.collected) {
          const dist = Math.hypot(pX - item.x, pY - item.y);
          if (dist < player.radius + 16) {
            item.collected = true;
            setItems([...items]);
            setInventory((prev) => [...prev, item]);
            soundFX.playCoin();
            setObjectiveText(
              `✨ Collected: ${item.name} = ${item.val} (${item.type.toUpperCase()}). Bring it to the corresponding Type Altar!`
            );
          }
        }
      });

      // Check gate unlocking
      gates.forEach((gate) => {
        if (!gate.opened) {
          const dist = Math.hypot(pX - (gate.x + gate.w / 2), pY - (gate.y + gate.h / 2));
          if (dist < 48) {
            // Check if player has required item
            const hasItem = inventory.some((inv) => inv.type === gate.requiredItem);
            if (hasItem) {
              gate.opened = true;
              setGates([...gates]);
              soundFX.playPowerup();
              setObjectiveText(`🎉 Altar Activated! ${gate.label} unlocked! The forest path opens!`);
            } else {
              setObjectiveText(`🔒 Locked! Find the crystal of type \`${gate.requiredItem}\` first!`);
            }
          }
        }
      });

      // Check Exit Goal (Top Right Chamber)
      if (pX > canvas.width - 60 && pY > canvas.height - 80) {
        if (gates.every((g) => g.opened)) {
          if (!gameWon) {
            setGameWon(true);
            soundFX.playVictory();
            onComplete(100);
          }
        }
      }

      // Update bugs
      bugs.forEach((bug) => {
        bug.x += bug.vx;
        bug.y += bug.vy;
        if (bug.x < 100 || bug.x > 540) bug.vx *= -1;
        if (bug.y < 60 || bug.y > 380) bug.vy *= -1;

        // Player collision with bug
        const dist = Math.hypot(pX - bug.x, pY - bug.y);
        if (dist < player.radius + bug.radius) {
          soundFX.playHit();
          setHp((prev) => Math.max(0, prev - 1));
          // knockback
          pX = Math.max(50, pX - bug.vx * 20);
          pY = Math.max(50, pY - bug.vy * 20);
        }
      });

      // ----------------------------------------------------
      // RENDER CANVAS
      // ----------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grass
      ctx.fillStyle = '#064e3b'; // deep emerald forest
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Path tiles
      ctx.fillStyle = '#047857';
      ctx.fillRect(40, 40, canvas.width - 80, 50);
      ctx.fillRect(160, 40, 60, 320);
      ctx.fillRect(40, 320, canvas.width - 80, 50);
      ctx.fillRect(canvas.width - 120, 80, 60, 280);

      // Decorative Trees
      ctx.font = '22px sans-serif';
      const treePositions = [
        [20, 20],
        [100, 160],
        [220, 20],
        [40, 240],
        [360, 120],
        [460, 20],
        [280, 240],
        [560, 180]
      ];
      treePositions.forEach(([tx, ty]) => {
        ctx.fillText('🌲', tx, ty);
      });

      // Draw Gates / Altars
      gates.forEach((gate) => {
        if (!gate.opened) {
          ctx.fillStyle = '#dc2626'; // laser red barrier
          ctx.fillRect(gate.x, gate.y, gate.w, gate.h);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText(`🔒 ${gate.requiredItem}`, gate.x - 10, gate.y - 8);
        } else {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.strokeRect(gate.x, gate.y, gate.w, gate.h);
          ctx.fillStyle = '#10b981';
          ctx.font = '10px monospace';
          ctx.fillText('✨ OPEN', gate.x - 6, gate.y - 8);
        }
      });

      // Draw Items
      items.forEach((item) => {
        if (!item.collected) {
          ctx.beginPath();
          ctx.arc(item.x, item.y, 16, 0, Math.PI * 2);
          ctx.fillStyle = item.color + '44';
          ctx.fill();
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.icon, item.x, item.y);

          // Name label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(item.name, item.x, item.y + 22);
        }
      });

      // Draw Patrol Bugs
      bugs.forEach((bug) => {
        ctx.beginPath();
        ctx.arc(bug.x, bug.y, bug.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐛', bug.x, bug.y);
      });

      // Draw Exit Portal
      ctx.fillStyle = gates.every((g) => g.opened) ? '#10b981' : '#64748b';
      ctx.fillRect(canvas.width - 70, canvas.height - 90, 50, 60);
      ctx.font = '24px sans-serif';
      ctx.fillText('🏰', canvas.width - 45, canvas.height - 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('EXIT GATE', canvas.width - 45, canvas.height - 18);

      // Draw Player
      ctx.beginPath();
      ctx.arc(pX, pY, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧙‍♂️', pX, pY);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [items, gates, bugs, inventory, gameWon]);

  // Virtual D-Pad Click Handlers for Mobile & Touch
  const handleDPadPress = (dir: string) => {
    const k = dir === 'up' ? 'ArrowUp' : dir === 'down' ? 'ArrowDown' : dir === 'left' ? 'ArrowLeft' : 'ArrowRight';
    keysRef.current[k] = true;
    setTimeout(() => {
      keysRef.current[k] = false;
    }, 150);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/40 bg-slate-950 p-6 text-white shadow-2xl space-y-4">
      {/* Realm Game Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Trees className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-['Space_Grotesk'] text-white">
                🌲 Realm 1: Variable Forest Explorer
              </h2>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                2D Action Game
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Collect Python typed crystals (`int`, `str`, `float`, `bool`) and unlock the elemental altars!
            </p>
          </div>
        </div>

        {/* Player Stats & Controls */}
        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                className={`h-4 w-4 ${i <= hp ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle 8-bit Audio"
          >
            {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            Exit to Map
          </button>
        </div>
      </div>

      {/* Dynamic Objective Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 font-mono flex items-center justify-between">
        <span>{objectiveText}</span>
        <span className="text-[11px] text-slate-400">Controls: WASD or Arrow Keys</span>
      </div>

      {/* Game Canvas & Controls Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Main 2D Canvas */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border-2 border-emerald-600/40 bg-slate-900 shadow-inner flex justify-center relative">
          <canvas
            ref={canvasRef}
            width={640}
            height={420}
            className="w-full h-auto max-w-full block bg-slate-950"
          />

          {/* Victory Modal */}
          {gameWon && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
              <div className="text-4xl">🏆</div>
              <h3 className="text-2xl font-black text-emerald-400 font-['Space_Grotesk']">
                Variable Forest Conquered!
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                You mastered Python variable types (`int`, `str`, `float`, `bool`) and opened all Type Altars.
                +100 XP & 30 Karma Coins earned!
              </p>
              <button
                onClick={() => onComplete(100)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-transform"
              >
                Proceed to Logic Desert →
              </button>
            </div>
          )}

          {/* Game Over Modal */}
          {hp <= 0 && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="text-4xl">💀</div>
              <h3 className="text-2xl font-black text-rose-500 font-['Space_Grotesk']">
                Defeated by Bug Slimes!
              </h3>
              <p className="text-xs text-slate-300">
                You ran out of health points. Re-spawn and try again!
              </p>
              <button
                onClick={() => {
                  setHp(3);
                  setInventory([]);
                  setGates([
                    { x: 230, y: 140, w: 24, h: 90, requiredItem: 'int', label: 'Altar 1', opened: false },
                    { x: 390, y: 260, w: 90, h: 24, requiredItem: 'str', label: 'Altar 2', opened: false },
                    { x: 520, y: 200, w: 24, h: 110, requiredItem: 'bool', label: 'Portal', opened: false }
                  ]);
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
              >
                Restart Forest
              </button>
            </div>
          )}
        </div>

        {/* Right Panel: Inventory & On-Screen Controls */}
        <div className="space-y-4">
          {/* Inventory */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎒 Memory Inventory</span>
              <span className="text-[10px] text-slate-400 font-mono">({inventory.length}/4)</span>
            </h4>

            {inventory.length === 0 ? (
              <div className="text-[11px] text-slate-500 py-3 text-center border border-dashed border-slate-800 rounded-xl">
                Walk near crystals to collect variables.
              </div>
            ) : (
              <div className="space-y-2">
                {inventory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-mono text-emerald-300">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{item.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* On-Screen Touch / Click D-Pad */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              On-Screen Controls
            </div>
            <div className="flex flex-col items-center gap-1.5 py-1">
              <button
                onClick={() => handleDPadPress('up')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all shadow-md"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDPadPress('left')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all shadow-md"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDPadPress('down')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all shadow-md"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDPadPress('right')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all shadow-md"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
