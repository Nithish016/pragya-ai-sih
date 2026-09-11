import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Flame,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Coins,
  Award,
  Gift,
  Shield,
  ArrowRight,
  Zap,
  Play,
  Check,
  Lock,
  Gamepad2,
  Brain,
  BookOpen,
  Info
} from 'lucide-react';

interface DailyStreakTrackerProps {
  onNavigate: (page: string) => void;
  className?: string;
}

interface DailyQuest {
  id: string;
  title: string;
  category: string;
  xp: number;
  coins: number;
  targetPage: string;
  actionLabel: string;
  icon: 'book' | 'brain' | 'game';
  completed: boolean;
}

export const DailyStreakTracker: React.FC<DailyStreakTrackerProps> = ({
  onNavigate,
  className = ''
}) => {
  const { profile, updateProfile, addXP, addCoins, triggerConfetti } = useAuth();

  // Retrieve or compute current streak status
  const currentStreak = profile?.streakDays ?? 7;
  const highestStreak = 14;

  // Local state for today's check-in
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      return localStorage.getItem(`pragya_streak_claimed_${todayKey}`) === 'true';
    } catch {
      return false;
    }
  });

  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [rewardDetails, setRewardDetails] = useState<{ xp: number; coins: number; message: string } | null>(null);

  // Daily engagement quests
  const [quests, setQuests] = useState<DailyQuest[]>([
    {
      id: 'quest_lesson',
      title: 'Complete 1 Study Module: Data Visualization Principles',
      category: 'Core Curriculum',
      xp: 80,
      coins: 25,
      targetPage: 'topic_learning',
      actionLabel: 'Study Topic',
      icon: 'book',
      completed: false
    },
    {
      id: 'quest_quiz',
      title: 'Pass 1 MoSPI Adaptive Diagnostic Assessment',
      category: 'Diagnostic Testing',
      xp: 60,
      coins: 20,
      targetPage: 'quizzes',
      actionLabel: 'Take Quiz',
      icon: 'brain',
      completed: false
    },
    {
      id: 'quest_game',
      title: 'Clear Stage 1 in Knowledge Run Sprint',
      category: 'Gamified SkillQuest',
      xp: 100,
      coins: 30,
      targetPage: 'games',
      actionLabel: 'Play Sprint',
      icon: 'game',
      completed: false
    }
  ]);

  // Build 7-day rolling schedule (Monday through Sunday)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = 6; // Sunday in demo

  // Handler for claiming daily engagement check-in bonus
  const handleClaimDailyCheckIn = () => {
    if (hasClaimedToday) return;

    const todayKey = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`pragya_streak_claimed_${todayKey}`, 'true');
    } catch {
      // ignore
    }

    const xpEarned = 50;
    const coinsEarned = 30;
    const newStreak = currentStreak + 1;

    // Update global profile
    updateProfile({
      streakDays: newStreak,
      streakHistory: [
        { date: 'Mon', active: true },
        { date: 'Tue', active: true },
        { date: 'Wed', active: true },
        { date: 'Thu', active: true },
        { date: 'Fri', active: true },
        { date: 'Sat', active: true },
        { date: 'Sun', active: true }
      ]
    });

    addXP(xpEarned, 'Daily Learning Streak Maintained');
    addCoins(coinsEarned);
    triggerConfetti();

    setHasClaimedToday(true);
    setRewardDetails({
      xp: xpEarned,
      coins: coinsEarned,
      message: `Day ${newStreak} Streak Maintained! Continuous learning reward unlocked.`
    });
    setShowRewardModal(true);
  };

  // Handler for claiming an individual quest reward
  const handleCompleteQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          addXP(q.xp, `Completed Daily Quest: ${q.title}`);
          addCoins(q.coins);
          triggerConfetti();
          setRewardDetails({
            xp: q.xp,
            coins: q.coins,
            message: `Completed "${q.title}"!`
          });
          setShowRewardModal(true);
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  return (
    <div
      id="daily-streak-tracker-container"
      className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs overflow-hidden ${className}`}
    >
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Flame className="h-4 w-4 fill-rose-600 text-rose-600 animate-pulse" />
            <span>Consistency Engine • iGOT Karmayogi Framework</span>
            <span className="rounded-full bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 font-bold">
              1.25x Karma Multiplier
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
            Daily Learning Streak & Engagement Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log active learning sessions daily to earn Karma coins, unlock promotion badges, and advance your statistical competency.
          </p>
        </div>

        {/* Top Streak Counter and Shield Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak Counter Badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-[#FF9933] text-[#0F2942] shadow-xs">
              <Flame className="h-6 w-6 fill-[#0F2942]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-orange-900 uppercase tracking-wide">
                Current Streak
              </div>
              <div className="text-2xl font-black text-[#0F2942] font-mono leading-none mt-0.5">
                {currentStreak}{' '}
                <span className="text-xs font-extrabold text-orange-700 font-sans">Days Active</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Personal Record: <strong className="text-slate-700">{highestStreak} Days</strong>
              </div>
            </div>
          </div>

          {/* Duty Leave Shield */}
          <button
            onClick={() => setShieldActive(!shieldActive)}
            title="Field Tour Shield protects streak during NSS/PLFS survey verification"
            className={`hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center min-w-[90px] ${
              shieldActive
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className={`h-4 w-4 ${shieldActive ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
            <span className="text-[10px] font-extrabold mt-1">Duty Shield</span>
            <span className="text-[9px] text-slate-500">{shieldActive ? 'Armed (1 Use)' : 'Ready'}</span>
          </button>
        </div>
      </div>

      {/* 2. Seven-Day Rolling Visual Timeline */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F2942] uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5 text-orange-600" />
            <span>Weekly Engagement Activity Log</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Week of September 8–14, 2026
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isPastActive = idx < todayIndex;
            const isCompleted = isPastActive || (isToday && hasClaimedToday);

            return (
              <div
                key={day}
                className={`relative flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all text-center ${
                  isToday
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                {/* Day Header */}
                <div className="text-[11px] sm:text-xs font-extrabold text-slate-700">
                  {day}
                </div>

                {/* Status Indicator Icon */}
                <div className="my-2">
                  {isCompleted ? (
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                  ) : isToday ? (
                    <div className="h-8 w-8 rounded-full bg-[#FF9933] text-[#0F2942] flex items-center justify-center shadow-xs animate-bounce">
                      <Flame className="h-4 w-4 fill-[#0F2942]" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                {/* Sub-label */}
                <div className="text-[10px] font-bold">
                  {isToday ? (
                    <span className="text-orange-900 bg-orange-200 px-1.5 py-0.5 rounded-md uppercase text-[9px]">
                      {hasClaimedToday ? '+50 XP' : 'Today'}
                    </span>
                  ) : isCompleted ? (
                    <span className="text-emerald-800 font-mono">+50 XP</span>
                  ) : (
                    <span className="text-slate-400">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Daily Claim & Engagement Action Center */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0F2942] via-[#163554] to-[#0F2942] text-white p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#FF9933] text-[#0F2942] text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                Daily Check-In
              </span>
              <span className="text-xs text-slate-300">Resets daily at 00:00 IST</span>
            </div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              {hasClaimedToday
                ? `Day ${currentStreak} Streak Maintained!`
                : `Claim Your Day ${currentStreak + 1} Continuous Learning Reward`}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {hasClaimedToday
                ? 'Your daily engagement check-in has been logged. Complete the daily quests below to boost your Karma coins and FRAC competency scores.'
                : 'Maintain your training cadence to earn +50 XP, +30 Karma coins, and keep your Subordinate Statistical Service cohort ranking.'}
            </p>
          </div>

          <div className="shrink-0">
            {hasClaimedToday ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Today's Streak Logged (+50 XP)</span>
              </div>
            ) : (
              <button
                id="claim-streak-btn"
                onClick={handleClaimDailyCheckIn}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF9933] hover:bg-orange-500 text-[#0F2942] font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105"
              >
                <Flame className="h-4 w-4 fill-[#0F2942]" />
                <span>Claim Day {currentStreak + 1} Bonus</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Daily Engagement Quests & Challenges */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Today's Cadre Learning Quests</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Complete any active quest to maintain streak velocity and earn Karma coin rewards.
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {completedQuestsCount} / {quests.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                quest.completed
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-white hover:border-orange-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl ${
                        quest.icon === 'book'
                          ? 'bg-blue-100 text-blue-800'
                          : quest.icon === 'brain'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {quest.icon === 'book' && <BookOpen className="h-4 w-4" />}
                      {quest.icon === 'brain' && <Brain className="h-4 w-4" />}
                      {quest.icon === 'game' && <Gamepad2 className="h-4 w-4" />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {quest.category}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full font-mono">
                    <Coins className="h-3 w-3 text-orange-600" />
                    +{quest.coins}
                  </span>
                </div>

                <div className="font-bold text-xs text-[#0F2942] leading-snug">
                  {quest.title}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 font-mono">
                  +{quest.xp} XP
                </span>

                {quest.completed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Claimed</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline"
                      title="Quick check-off if already finished"
                    >
                      Quick Claim
                    </button>
                    <button
                      onClick={() => onNavigate(quest.targetPage)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs transition-colors shadow-2xs"
                    >
                      <span>{quest.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Streak Milestones & Long-Term Cadre Rewards */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-orange-600" />
            <span>Cadre Streak Milestones & Badges</span>
          </div>
          <span className="text-[11px] text-slate-500">Official MoSPI Recognition</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Milestone 1 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-center space-y-1.5">
            <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>3-Day Streak</span>
            </div>
            <div className="font-extrabold text-xs text-[#0F2942]">Bronze Scholar</div>
            <div className="text-[10px] text-slate-500">+100 Karma Pts (Unlocked)</div>
          </div>

          {/* Milestone 2 */}
          <div className="rounded-2xl border-2 border-orange-400 bg-orange-50/60 p-3 text-center space-y-1.5 shadow-2xs">
            <div className="text-xs font-bold text-orange-700 flex items-center justify-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-600 fill-orange-600" />
              <span>7-Day Streak</span>
            </div>
            <div className="font-extrabold text-xs text-[#0F2942]">Silver Investigator</div>
            <div className="text-[10px] text-orange-800 font-bold">+250 Karma Pts (Active)</div>
          </div>

          {/* Milestone 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center space-y-1.5">
            <div className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>14-Day Streak</span>
            </div>
            <div className="font-extrabold text-xs text-slate-700">Gold Policy Analyst</div>
            <div className="text-[10px] text-slate-500">
              {currentStreak}/14 Days (+500 Pts)
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center space-y-1.5">
            <div className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
              <Gift className="h-3.5 w-3.5 text-purple-600" />
              <span>30-Day Streak</span>
            </div>
            <div className="font-extrabold text-xs text-slate-700">National Champion</div>
            <div className="text-[10px] text-slate-500">
              {currentStreak}/30 Days (+1000 Pts)
            </div>
          </div>
        </div>
      </div>

      {/* 6. Celebratory Modal on Streak Claim */}
      {showRewardModal && rewardDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
              <Flame className="h-8 w-8 fill-orange-600" />
            </div>

            <div>
              <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
                Streak Reward Claimed!
              </div>
              <h3 className="text-lg font-black text-[#0F2942] font-['Space_Grotesk'] mt-1">
                Cadre Engagement Verified
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {rewardDetails.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100">
              <div className="rounded-xl bg-orange-50 p-2.5">
                <div className="text-[10px] text-orange-700 font-bold uppercase">Karma Points</div>
                <div className="text-lg font-black text-orange-950 font-mono">
                  +{rewardDetails.coins}
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5">
                <div className="text-[10px] text-blue-700 font-bold uppercase">Experience</div>
                <div className="text-lg font-black text-blue-950 font-mono">
                  +{rewardDetails.xp} XP
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRewardModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Continue Learning →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
