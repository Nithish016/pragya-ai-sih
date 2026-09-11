import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Target,
  Clock,
  BookCheck,
  CheckCircle2,
  Sparkles,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Zap,
  Settings2,
  Award,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

interface DailyGoalTrackerProps {
  onNavigate?: (page: string) => void;
  className?: string;
}

export const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({
  onNavigate,
  className = ''
}) => {
  const { addXP, addCoins, triggerConfetti } = useAuth();
  const todayKey = new Date().toISOString().slice(0, 10);

  // Goal settings: Type, Time Goal (minutes), Modules Goal (count)
  const [goalType, setGoalType] = useState<'time' | 'modules' | 'both'>('both');
  const [targetMinutes, setTargetMinutes] = useState<number>(30);
  const [targetModules, setTargetModules] = useState<number>(2);

  // Progress state
  const [currentMinutes, setCurrentMinutes] = useState<number>(18);
  const [currentModules, setCurrentModules] = useState<number>(1);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);

  // Active focus study timer state
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Load saved preferences and progress from localStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('pragya_goal_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.goalType) setGoalType(parsed.goalType);
        if (parsed.targetMinutes) setTargetMinutes(parsed.targetMinutes);
        if (parsed.targetModules) setTargetModules(parsed.targetModules);
      }

      const savedProgress = localStorage.getItem(`pragya_goal_progress_${todayKey}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (typeof parsed.currentMinutes === 'number') setCurrentMinutes(parsed.currentMinutes);
        if (typeof parsed.currentModules === 'number') setCurrentModules(parsed.currentModules);
        if (typeof parsed.hasCelebrated === 'boolean') setHasCelebrated(parsed.hasCelebrated);
      }
    } catch {
      // fallback to initial state
    }
  }, [todayKey]);

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(
        `pragya_goal_progress_${todayKey}`,
        JSON.stringify({
          currentMinutes,
          currentModules,
          hasCelebrated
        })
      );
    } catch {
      // ignore
    }
  }, [currentMinutes, currentModules, hasCelebrated, todayKey]);

  // Focus study session timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => {
          if (sec + 1 >= 60) {
            // Added 1 full minute to currentMinutes
            setCurrentMinutes((m) => m + 1);
            return 0;
          }
          return sec + 1;
        });
      }, 1000);
    } else if (!isTimerRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Calculations
  const timePercent = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));
  const modulesPercent = Math.min(100, Math.round((currentModules / targetModules) * 100));

  const isTimeMet = currentMinutes >= targetMinutes;
  const isModulesMet = currentModules >= targetModules;

  const isGoalMet =
    goalType === 'time'
      ? isTimeMet
      : goalType === 'modules'
      ? isModulesMet
      : isTimeMet && isModulesMet;

  const overallProgressPercent =
    goalType === 'time'
      ? timePercent
      : goalType === 'modules'
      ? modulesPercent
      : Math.round((timePercent + modulesPercent) / 2);

  // Trigger celebratory reward when goal is met for the first time
  useEffect(() => {
    if (isGoalMet && !hasCelebrated) {
      setHasCelebrated(true);
      triggerConfetti();
      addXP(75, 'Daily Learning Goal Achieved');
      addCoins(40);
    }
  }, [isGoalMet, hasCelebrated, triggerConfetti, addXP, addCoins]);

  // Handlers for manual progress logging
  const handleAddMinutes = (mins: number) => {
    setCurrentMinutes((prev) => Math.max(0, prev + mins));
  };

  const handleAddModule = () => {
    setCurrentModules((prev) => prev + 1);
  };

  const handleSaveGoal = () => {
    setIsEditingGoal(false);
    try {
      localStorage.setItem(
        'pragya_goal_config',
        JSON.stringify({
          goalType,
          targetMinutes,
          targetModules
        })
      );
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="daily-goal-tracker"
      className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs overflow-hidden ${className}`}
    >
      {/* 1. Header & Configuration Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Target className="h-4 w-4 text-blue-600" />
            <span>Personalized Productivity Benchmark</span>
            <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 font-bold">
              DoPT Target Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
            Daily Learning Goals & Progress Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your daily time and module targets to maintain structured competency development.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            <Settings2 className="h-3.5 w-3.5 text-slate-500" />
            <span>{isEditingGoal ? 'Close Settings' : 'Adjust Target'}</span>
          </button>
        </div>
      </div>

      {/* 2. Goal Settings Drawer (Expandable) */}
      {isEditingGoal && (
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Settings2 className="h-4 w-4 text-orange-600" />
              <span>Configure Daily Target Criteria</span>
            </div>
            <button
              onClick={() => setIsEditingGoal(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Goal Type Choice */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Target Type:
              </label>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setGoalType('both')}
                  className={`px-3 py-2 rounded-xl text-left font-semibold border transition-all ${
                    goalType === 'both'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Both Time & Modules (Recommended)
                </button>
                <button
                  onClick={() => setGoalType('time')}
                  className={`px-3 py-2 rounded-xl text-left font-semibold border transition-all ${
                    goalType === 'time'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Study Duration Only
                </button>
                <button
                  onClick={() => setGoalType('modules')}
                  className={`px-3 py-2 rounded-xl text-left font-semibold border transition-all ${
                    goalType === 'modules'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Module Completion Only
                </button>
              </div>
            </div>

            {/* Daily Minutes Target */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Daily Learning Time Target:
              </label>
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTargetMinutes(mins)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        targetMinutes === mins
                          ? 'bg-[#0F2942] text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(Number(e.target.value))}
                    className="w-full accent-[#0F2942]"
                  />
                  <span className="font-mono font-bold text-sm text-[#0F2942] min-w-[50px]">
                    {targetMinutes} min
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Modules Target */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Daily Completed Modules Target:
              </label>
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setTargetModules(cnt)}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        targetModules === cnt
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cnt} {cnt === 1 ? 'Mod' : 'Mods'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={targetModules}
                    onChange={(e) => setTargetModules(Number(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                  <span className="font-mono font-bold text-sm text-orange-600 min-w-[50px]">
                    {targetModules} {targetModules === 1 ? 'module' : 'modules'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={handleSaveGoal}
              className="px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Save Daily Target
            </button>
          </div>
        </div>
      )}

      {/* 3. Visual Feedback Banner When Goal Is Met */}
      {isGoalMet && (
        <div className="my-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 shadow-md animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20 text-white shadow-inner">
                <Trophy className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-amber-300 text-emerald-950 px-2 py-0.5 rounded-full">
                    Goal Accomplished!
                  </span>
                  <span className="text-[11px] text-emerald-100">
                    Reward: +75 XP & +40 Karma Coins
                  </span>
                </div>
                <h3 className="text-base font-extrabold font-['Space_Grotesk'] text-white mt-1">
                  Outstanding Cadre Dedication! Daily Benchmark Mastered.
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  You have satisfied your planned learning criteria for today. Your progress has been credited to your officer profile.
                </p>
              </div>
            </div>

            <button
              onClick={triggerConfetti}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-sm hover:bg-emerald-50 transition-all hover:scale-105 shrink-0"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Celebrate!</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Main Progress Meters: Time & Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* Card A: Study Time Target Meter */}
        <div
          className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
            isTimeMet
              ? 'border-emerald-300 bg-emerald-50/40'
              : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl ${
                    isTimeMet
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wide">
                    Daily Study Duration
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Target: {targetMinutes} Minutes
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-[#0F2942] font-mono">
                  {currentMinutes}
                  <span className="text-xs font-bold text-slate-400">/{targetMinutes}m</span>
                </div>
                <div
                  className={`text-[10px] font-bold ${
                    isTimeMet ? 'text-emerald-700' : 'text-blue-600'
                  }`}
                >
                  {timePercent}% Reached
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden my-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isTimeMet ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>

          {/* Controls & Quick Log */}
          <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all ${
                  isTimerRunning
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-[#0F2942] hover:bg-[#1E3A8A] text-white'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-3 w-3" />
                    <span>Timer ({timerSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    <span>Focus Timer</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAddMinutes(15)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs transition-colors"
                title="Log 15 minutes of manual offline study"
              >
                +15m
              </button>
              <button
                onClick={() => handleAddMinutes(30)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs transition-colors"
                title="Log 30 minutes of manual study"
              >
                +30m
              </button>
            </div>
          </div>
        </div>

        {/* Card B: Module Completion Target Meter */}
        <div
          className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
            isModulesMet
              ? 'border-emerald-300 bg-emerald-50/40'
              : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl ${
                    isModulesMet
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  <BookCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wide">
                    Daily Module Completions
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Target: {targetModules} Completed Modules
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-[#0F2942] font-mono">
                  {currentModules}
                  <span className="text-xs font-bold text-slate-400">/{targetModules}</span>
                </div>
                <div
                  className={`text-[10px] font-bold ${
                    isModulesMet ? 'text-emerald-700' : 'text-orange-600'
                  }`}
                >
                  {modulesPercent}% Reached
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden my-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isModulesMet ? 'bg-emerald-600' : 'bg-[#FF9933]'
                }`}
                style={{ width: `${modulesPercent}%` }}
              />
            </div>
          </div>

          {/* Controls & Quick Log */}
          <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              {isModulesMet ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Module Quota Met</span>
                </span>
              ) : (
                <span className="text-slate-500">
                  {targetModules - currentModules} more module needed
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddModule}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition-colors"
                title="Mark a curriculum module completed"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+1 Module Completed</span>
              </button>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('topic_learning')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
                >
                  Study Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Combined Status Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Combined Goal Progress:</span>
          <span className="font-mono font-black text-[#0F2942] bg-slate-100 px-2 py-0.5 rounded-md">
            {overallProgressPercent}%
          </span>
          <span className="text-slate-500">
            {isGoalMet
              ? '• Daily quota completely achieved!'
              : '• Keep going to earn today’s milestone reward.'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Active Cadre Target: Senior Statistical Officer</span>
          <span className="font-bold text-orange-700">MoSPI Karmayogi</span>
        </div>
      </div>
    </div>
  );
};
