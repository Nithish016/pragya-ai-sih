import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { CompetencyScore } from '../types/index.js';
import { CompetencyRadarChart } from '../components/CompetencyRadarChart.js';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  BookOpen,
  RefreshCw,
  Award
} from 'lucide-react';

interface CompetenciesPageProps {
  onNavigate: (page: string) => void;
}

export const CompetenciesPage: React.FC<CompetenciesPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [competencies, setCompetencies] = useState<CompetencyScore[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'developing' | 'strong'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetencies();
  }, []);

  const fetchCompetencies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/competencies/me');
      if (res.ok) {
        const data = await res.json();
        setCompetencies(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = competencies.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return c.status === 'critical_gap';
    if (filter === 'developing') return c.status === 'developing';
    if (filter === 'strong') return c.status === 'strong' || c.status === 'good';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>FRAC Framework • Roles, Activities & Competencies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
            Competencies Hub: Skill Gap Analysis
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Target Cadre Role: <strong className="text-slate-900">{profile?.currentRole || 'Senior Statistical Officer'}</strong> • Ministry of Statistics & Programme Implementation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCompetencies}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F2942] hover:bg-slate-50 shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Dynamic Competency Radar Chart */}
      <CompetencyRadarChart
        competencies={competencies}
        onNavigate={onNavigate}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Competencies ({competencies.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filter === 'critical'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Critical Gaps ({competencies.filter((c) => c.status === 'critical_gap').length})
        </button>
        <button
          onClick={() => setFilter('developing')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filter === 'developing'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Developing ({competencies.filter((c) => c.status === 'developing').length})
        </button>
        <button
          onClick={() => setFilter('strong')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filter === 'strong'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Good / Strong ({competencies.filter((c) => c.status === 'strong' || c.status === 'good').length})
        </button>
      </div>

      {/* Competencies Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((comp) => {
          const isCritical = comp.status === 'critical_gap';
          const isDeveloping = comp.status === 'developing';
          const isStrong = comp.status === 'strong';

          const cardBorder = isCritical
            ? 'border-rose-300 bg-gradient-to-br from-white to-rose-50/40'
            : isDeveloping
            ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/40'
            : 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40';

          const badgeBg = isCritical
            ? 'bg-rose-100 text-rose-800 border border-rose-200'
            : isDeveloping
            ? 'bg-amber-100 text-amber-800 border border-amber-200'
            : 'bg-emerald-100 text-emerald-800 border border-emerald-200';

          const barColor = isCritical
            ? 'bg-rose-500'
            : isDeveloping
            ? 'bg-amber-500'
            : 'bg-emerald-500';

          return (
            <div
              key={comp.competencyId}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${cardBorder}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {comp.category}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${badgeBg}`}>
                  {comp.status.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#0F2942] font-['Space_Grotesk']">
                {comp.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {comp.description}
              </p>

              {/* Visual Bars: Score vs Required Benchmark */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Current Officer Score:</span>
                  <span className="font-extrabold text-[#0F2942] text-sm">{comp.score}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Role Benchmark: {comp.requiredScore}%</span>
                  <span className={comp.gap > 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {comp.gap > 0 ? `Gap Shortfall: -${comp.gap}%` : '✓ Benchmark Satisfied'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Assessed: {new Date(comp.lastAssessed).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onNavigate('topic_learning')}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 text-xs font-bold transition-colors"
                >
                  <span>Launch Bridge Course</span>
                  <ArrowRight className="h-3 w-3 text-[#FF9933]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
