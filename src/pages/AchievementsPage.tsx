import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Award, CheckCircle2, Lock, Shield, Sparkles, Star, Trophy, Flame } from 'lucide-react';

interface AchievementsPageProps {
  onNavigate: (page: string) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();

  const badges = [
    {
      id: 'b1',
      title: 'MoSPI Diagnostic Pioneer',
      category: 'Competency',
      description: 'Completed the baseline 5-pillar FRAC competency evaluation.',
      unlocked: true,
      date: 'Aug 28, 2026',
      xp: 150,
      icon: Shield,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'b2',
      title: 'Zero-Baseline Guardian',
      category: 'Visualization',
      description: 'Scored 100% on the bar chart cognitive perception assessment.',
      unlocked: true,
      date: 'Sep 02, 2026',
      xp: 200,
      icon: Trophy,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'b3',
      title: '5-Day Continuous Learner',
      category: 'Diligence',
      description: 'Maintained a consecutive 5-day capacity building streak on iGOT.',
      unlocked: true,
      date: 'Sep 09, 2026',
      xp: 250,
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'b4',
      title: 'Boss Slayer: Evaluator Gauntlet',
      category: 'Mastery',
      description: 'Defeat the World 1 Chief Evaluator boss challenge with >80% accuracy.',
      unlocked: false,
      date: 'Locked',
      xp: 500,
      icon: Star,
      color: 'text-slate-400 bg-slate-50 border-slate-200'
    },
    {
      id: 'b5',
      title: 'National Sampling Strategist',
      category: 'Sampling',
      description: 'Master stratified survey weight estimation across 10 simulation modules.',
      unlocked: false,
      date: 'Locked',
      xp: 350,
      icon: Award,
      color: 'text-slate-400 bg-slate-50 border-slate-200'
    },
    {
      id: 'b6',
      title: 'iGOT Karmayogi Champion',
      category: 'Milestone',
      description: 'Reach Level 10 and bridge all priority competency gaps.',
      unlocked: false,
      date: 'Locked',
      xp: 1000,
      icon: Sparkles,
      color: 'text-slate-400 bg-slate-50 border-slate-200'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Award className="h-4 w-4" />
          <span>Accredited Credentials & Badges</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
          Achievements & Karmayogi Badges
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Official digital credentials verified by the Capacity Building Commission (CBC) and MoSPI NSSTA Academy.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Badges Unlocked</div>
          <div className="text-2xl font-black text-[#0F2942] mt-1">
            {badges.filter((b) => b.unlocked).length} of {badges.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">50% Completed</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Total Karma Points Earned</div>
          <div className="text-2xl font-black text-orange-600 font-mono mt-1">
            {profile?.coins || 420} Pts
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Redeemable for workshop priority</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Karmayogi Level</div>
          <div className="text-2xl font-black text-blue-700 font-mono mt-1">
            Level {profile?.level || 3}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Next rank at 3,500 XP</div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${
                badge.unlocked
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-slate-50/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-2xl border ${badge.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {badge.unlocked ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Unlocked
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-[#0F2942] leading-snug">{badge.title}</h2>
              <div className="text-[10px] font-bold uppercase text-orange-700 mt-0.5">{badge.category}</div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{badge.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">{badge.date}</span>
                <span className="font-bold text-[#0F2942]">+{badge.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
