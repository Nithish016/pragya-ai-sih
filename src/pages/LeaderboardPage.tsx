import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Trophy, Flame, Award, Medal, Crown, Star } from 'lucide-react';
import { NationalStandingsMap } from '../components/NationalStandingsMap.js';

interface LeaderboardPageProps {
  onNavigate: (page: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'global' | 'dept' | 'weekly'>('global');

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Trophy className="h-4 w-4" />
          <span>Pragya AI • National Civil Services Standings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
          National Standings & Cadre Leaderboard
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Interactive State and Union Territory capacity scores, Union Ministry trophies, and officer peer rankings across MoSPI divisions.
        </p>
      </div>

      {/* 1. National Standings (States & UTs Map + Union Ministries Trophies from Screenshot 1) */}
      <NationalStandingsMap />

      {/* Section Divider */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F2942] font-['Space_Grotesk']">
              Individual Officer Standings & Division Champions
            </h2>
            <p className="text-xs text-slate-500">
              Rankings determined by verified assessment scores, completed learning hours, and streak consistency.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('global')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'global'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All MoSPI Divisions
        </button>
        <button
          onClick={() => setActiveTab('dept')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'dept'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Survey Design & Research Division
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'weekly'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          This Week's Top Climbers
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {leaderboard.slice(0, 3).map((item, idx) => {
          const isFirst = item.rank === 1;
          const isSecond = item.rank === 2;
          const isThird = item.rank === 3;

          const borderBg = isFirst
            ? 'border-amber-400 bg-gradient-to-b from-amber-50/80 to-white shadow-sm'
            : isSecond
            ? 'border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-2xs'
            : 'border-orange-300 bg-gradient-to-b from-orange-50/60 to-white shadow-2xs';

          return (
            <div
              key={item.userId}
              className={`relative rounded-3xl border p-6 text-center shadow-xs ${borderBg} ${
                isFirst ? 'md:-translate-y-2' : ''
              }`}
            >
              {/* Crown for #1 */}
              {isFirst && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 p-1.5 text-slate-950 shadow-md">
                  <Crown className="h-4 w-4" />
                </div>
              )}

              <div className="relative mx-auto h-20 w-20 mb-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-full w-full rounded-2xl object-cover ring-2 ring-[#0F2942]"
                />
                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-[#0F2942] text-xs font-black text-white ring-2 ring-white">
                  #{item.rank}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#0F2942] leading-tight">{item.name}</h2>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{item.role}</div>
              <div className="text-[10px] text-orange-700 font-semibold">{item.department}</div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Total XP</div>
                  <div className="font-extrabold text-[#0F2942]">{item.xp}</div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Level</div>
                  <div className="font-extrabold text-blue-700">L{item.level}</div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Streak</div>
                  <div className="font-extrabold text-rose-600 flex items-center gap-0.5 justify-center">
                    <Flame className="h-3 w-3 fill-rose-500" /> {item.streakDays}d
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-[#0F2942] text-[10px] font-bold uppercase tracking-wider text-slate-200 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Rank</th>
              <th className="px-6 py-3.5">Civil Servant</th>
              <th className="px-6 py-3.5">Level</th>
              <th className="px-6 py-3.5">Accuracy</th>
              <th className="px-6 py-3.5">Streak</th>
              <th className="px-6 py-3.5 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaderboard.map((row) => {
              const isCurrentUser = row.name.includes('Ananya');

              return (
                <tr
                  key={row.userId}
                  className={`hover:bg-slate-50 transition-colors ${
                    isCurrentUser ? 'bg-blue-50/60 font-medium' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-lg font-bold text-xs ${
                        row.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : row.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : row.rank === 3
                          ? 'bg-orange-300 text-orange-950'
                          : 'text-slate-600'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-bold text-[#0F2942] flex items-center gap-1.5">
                          <span>{row.name}</span>
                          {isCurrentUser && (
                            <span className="rounded bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.2 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{row.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-800 font-bold">
                      Level {row.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">{row.quizAccuracy}%</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-rose-600 font-bold">
                      <Flame className="h-3.5 w-3.5 fill-rose-500" />
                      <span>{row.streakDays}d</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-[#0F2942]">
                    {row.xp.toLocaleString()} XP
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
