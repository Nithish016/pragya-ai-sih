import React, { useState, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { CompetencyScore } from '../types/index.js';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Award,
  Filter,
  Eye,
  Zap,
  Info
} from 'lucide-react';

interface CompetencyRadarChartProps {
  competencies: CompetencyScore[];
  onNavigate?: (page: string) => void;
  className?: string;
  initialRole?: string;
}

type TargetRoleKey = 'sso' | 'jso' | 'director';

interface RoleBenchmark {
  key: TargetRoleKey;
  label: string;
  cadreTitle: string;
  experienceReq: string;
  benchmarks: Record<string, number>;
}

const ROLE_BENCHMARKS: Record<TargetRoleKey, RoleBenchmark> = {
  sso: {
    key: 'sso',
    label: 'Senior Statistical Officer (SSO)',
    cadreTitle: 'Target Benchmark • Level 8 Pay Band',
    experienceReq: '3+ Years in Subordinate Statistical Service',
    benchmarks: {
      'comp_data_viz': 85,
      'comp_stat_inf': 85,
      'comp_python_data': 75,
      'comp_survey_methods': 80,
      'comp_data_col': 80,
      'comp_stat_basics': 85
    }
  },
  jso: {
    key: 'jso',
    label: 'Junior Statistical Officer (JSO)',
    cadreTitle: 'Baseline Role • Entry Cadre',
    experienceReq: 'Induction / Direct Recruitment (SSC CGL)',
    benchmarks: {
      'comp_data_viz': 70,
      'comp_stat_inf': 70,
      'comp_python_data': 65,
      'comp_survey_methods': 75,
      'comp_data_col': 75,
      'comp_stat_basics': 80
    }
  },
  director: {
    key: 'director',
    label: 'Lead Data Scientist / Director',
    cadreTitle: 'Executive Cadre • National Analytics Wing',
    experienceReq: 'Senior Cadre • Indian Statistical Service (ISS)',
    benchmarks: {
      'comp_data_viz': 95,
      'comp_stat_inf': 90,
      'comp_python_data': 95,
      'comp_survey_methods': 80,
      'comp_data_col': 75,
      'comp_stat_basics': 90
    }
  }
};

// National Cadre Peer Average benchmarks (for reference comparison)
const CADRE_PEER_AVERAGE: Record<string, number> = {
  'comp_data_viz': 58,
  'comp_stat_inf': 62,
  'comp_python_data': 52,
  'comp_survey_methods': 68,
  'comp_data_col': 71,
  'comp_stat_basics': 74
};

export const CompetencyRadarChart: React.FC<CompetencyRadarChartProps> = ({
  competencies,
  onNavigate,
  className = '',
  initialRole = 'sso'
}) => {
  const [selectedRole, setSelectedRole] = useState<TargetRoleKey>('sso');
  const [showCurrent, setShowCurrent] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [showCadreAvg, setShowCadreAvg] = useState(true);
  const [skillBoost, setSkillBoost] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeRoleData = ROLE_BENCHMARKS[selectedRole];

  // Default fallback competencies if list is empty
  const baseCompetencies = useMemo(() => {
    if (competencies && competencies.length > 0) {
      return competencies;
    }
    return [
      {
        competencyId: 'comp_data_viz',
        name: 'Data Visualization',
        category: 'Analytics & Reporting',
        score: 38,
        requiredScore: 85,
        gap: 47,
        status: 'critical_gap' as const
      },
      {
        competencyId: 'comp_stat_inf',
        name: 'Statistical Inference',
        category: 'Statistical Theory',
        score: 45,
        requiredScore: 85,
        gap: 40,
        status: 'developing' as const
      },
      {
        competencyId: 'comp_python_data',
        name: 'Python for Data Analysis',
        category: 'Programming & Computation',
        score: 65,
        requiredScore: 75,
        gap: 10,
        status: 'developing' as const
      },
      {
        competencyId: 'comp_survey_methods',
        name: 'Survey Methods & Sampling',
        category: 'Field Operations',
        score: 74,
        requiredScore: 80,
        gap: 6,
        status: 'good' as const
      },
      {
        competencyId: 'comp_data_col',
        name: 'Data Collection & Verification',
        category: 'Field Operations',
        score: 78,
        requiredScore: 80,
        gap: 2,
        status: 'good' as const
      },
      {
        competencyId: 'comp_stat_basics',
        name: 'Measures of Central Tendency',
        category: 'Statistical Theory',
        score: 88,
        requiredScore: 85,
        gap: 0,
        status: 'strong' as const
      }
    ];
  }, [competencies]);

  // Formatted data for Recharts Radar
  const radarData = useMemo(() => {
    return baseCompetencies.map((comp) => {
      const targetReq = activeRoleData.benchmarks[comp.competencyId] || comp.requiredScore || 80;
      const boostedScore = Math.min(100, Math.max(0, comp.score + skillBoost));
      const peerAvg = CADRE_PEER_AVERAGE[comp.competencyId] || 60;
      const liveGap = Math.max(0, targetReq - boostedScore);

      // Short label for radar axes to keep labels readable on small screens
      let shortLabel = comp.name;
      if (comp.name.includes('Data Visualization')) shortLabel = 'Data Viz';
      else if (comp.name.includes('Statistical Inference')) shortLabel = 'Stat Inference';
      else if (comp.name.includes('Python for Data')) shortLabel = 'Python Analytics';
      else if (comp.name.includes('Survey Methods')) shortLabel = 'Survey Sampling';
      else if (comp.name.includes('Data Collection')) shortLabel = 'Field CAPI';
      else if (comp.name.includes('Central Tendency')) shortLabel = 'Central Tendency';

      let status: 'critical_gap' | 'developing' | 'good' | 'strong' = 'good';
      if (liveGap > 25) status = 'critical_gap';
      else if (liveGap > 10) status = 'developing';
      else if (liveGap > 0) status = 'good';
      else status = 'strong';

      return {
        competencyId: comp.competencyId,
        subject: shortLabel,
        fullName: comp.name,
        category: comp.category,
        Current: boostedScore,
        Target: targetReq,
        CadreAvg: peerAvg,
        gap: liveGap,
        status
      };
    });
  }, [baseCompetencies, activeRoleData, skillBoost]);

  // Summary Metrics calculations
  const totalTarget = radarData.reduce((acc, curr) => acc + curr.Target, 0);
  const totalCurrent = radarData.reduce((acc, curr) => acc + curr.Current, 0);
  const overallReadiness = Math.round((totalCurrent / totalTarget) * 100);

  const criticalGapsCount = radarData.filter((d) => d.status === 'critical_gap').length;
  const targetMetCount = radarData.filter((d) => d.Current >= d.Target).length;
  const largestDeficit = [...radarData].sort((a, b) => b.gap - a.gap)[0];

  return (
    <div
      id="competency-radar-container"
      className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs overflow-hidden ${className}`}
    >
      {/* 1. Header & Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4 text-[#FF9933]" />
            <span>FRAC Dynamic Radar Diagnostics</span>
            <span className="rounded-full bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 font-bold">
              Live Comparative
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
            Role Proficiency & Skill Gap Radar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-dimensional assessment comparing current officer scores against official MoSPI cadre benchmarks.
          </p>
        </div>

        {/* Dynamic Target Role Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-3 w-3 text-slate-400" />
            <span>Benchmark Role:</span>
          </div>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs">
            <button
              id="role-btn-jso"
              onClick={() => setSelectedRole('jso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'jso'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JSO (Entry)
            </button>
            <button
              id="role-btn-sso"
              onClick={() => setSelectedRole('sso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'sso'
                  ? 'bg-[#0F2942] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SSO (Target)
            </button>
            <button
              id="role-btn-director"
              onClick={() => setSelectedRole('director')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'director'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Scientist
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid: Radar Chart + Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* Left Column: Recharts Radar Container */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Layer visibility toggles */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-2 text-xs font-semibold">
            <button
              onClick={() => setShowCurrent(!showCurrent)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                showCurrent
                  ? 'bg-orange-50 border-orange-300 text-orange-900 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF9933]" />
              <span>Current Officer Skill</span>
            </button>

            <button
              onClick={() => setShowTarget(!showTarget)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                showTarget
                  ? 'bg-blue-50 border-blue-300 text-[#0F2942] shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#0F2942]" />
              <span>{activeRoleData.label.split('(')[0].trim()} Req</span>
            </button>

            <button
              onClick={() => setShowCadreAvg(!showCadreAvg)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                showCadreAvg
                  ? 'bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
              <span>Cadre Average</span>
            </button>
          </div>

          {/* Recharts Radar Graphic */}
          <div className="w-full h-[340px] sm:h-[370px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  stroke="#CBD5E1"
                />

                {/* Cadre Peer Average */}
                {showCadreAvg && (
                  <Radar
                    name="Cadre Average"
                    dataKey="CadreAvg"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    fill="#94A3B8"
                    fillOpacity={0.12}
                  />
                )}

                {/* Target Benchmark Requirement */}
                {showTarget && (
                  <Radar
                    name={`${activeRoleData.label.split('(')[0].trim()} Target`}
                    dataKey="Target"
                    stroke="#0F2942"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    fill="#0F2942"
                    fillOpacity={0.14}
                  />
                )}

                {/* Current Officer Proficiency */}
                {showCurrent && (
                  <Radar
                    name="Current Proficiency"
                    dataKey="Current"
                    stroke="#EA580C"
                    strokeWidth={2.5}
                    fill="#FF9933"
                    fillOpacity={0.4}
                    dot={{ r: 3.5, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  />
                )}

                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Simulation Slider / Quick Boost for Demonstration */}
          <div className="w-full max-w-md bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3 mt-1 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Dynamic Practice Simulator:</span>
                <span className="text-slate-500 block text-[11px]">
                  {skillBoost > 0 ? `+${skillBoost}% simulated gain across modules` : 'Live baseline scores'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setSkillBoost((prev) => Math.min(prev + 10, 30))}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
                title="Simulate complete quiz / course modules"
              >
                +10% XP
              </button>
              {skillBoost > 0 && (
                <button
                  onClick={() => setSkillBoost(0)}
                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Metrics & Dynamic Gap Insights */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Role Card */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-slate-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">
                  Active Cadre Progression Track
                </div>
                <div className="text-base font-extrabold text-[#0F2942] mt-0.5">
                  {activeRoleData.label}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {activeRoleData.cadreTitle}
                </div>
              </div>
              <span className="rounded-full bg-blue-100 text-[#0F2942] text-[10px] font-bold px-2 py-0.5 border border-blue-200">
                MoSPI FRAC
              </span>
            </div>

            {/* Overall Role Readiness Meter */}
            <div className="mt-4 pt-3 border-t border-blue-100/80 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Overall Role Readiness:</span>
                <span className="font-extrabold text-[#0F2942] font-mono">
                  {overallReadiness}% / 100%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    overallReadiness >= 85
                      ? 'bg-emerald-600'
                      : overallReadiness >= 65
                      ? 'bg-[#FF9933]'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, overallReadiness)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                <span>{targetMetCount} of 6 Benchmarks Met</span>
                <span>Advancement Threshold: 85%</span>
              </div>
            </div>
          </div>

          {/* Core Competencies Quick Breakdown Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wider">
                FRAC Capability Breakdown
              </div>
              <span className="text-[10px] text-slate-400">Score vs. Req</span>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {radarData.map((item) => {
                const isCritical = item.status === 'critical_gap';
                const isMet = item.Current >= item.Target;

                return (
                  <div
                    key={item.competencyId}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-orange-50/50 transition-colors text-xs"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            isMet
                              ? 'bg-emerald-500'
                              : isCritical
                              ? 'bg-rose-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="truncate">{item.fullName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.category}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="font-extrabold text-[#0F2942] font-mono">
                          {item.Current}%{' '}
                          <span className="text-slate-400 font-normal">/ {item.Target}%</span>
                        </div>
                        <div
                          className={`text-[10px] font-bold ${
                            isMet
                              ? 'text-emerald-700'
                              : isCritical
                              ? 'text-rose-600'
                              : 'text-amber-700'
                          }`}
                        >
                          {isMet ? `+${item.Current - item.Target}% (Met)` : `-${item.gap}% Gap`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          {largestDeficit && largestDeficit.gap > 0 && (
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <div className="font-bold text-orange-950 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                  <span>Priority Deficit: {largestDeficit.fullName}</span>
                </div>
                <div className="text-[11px] text-orange-800 mt-0.5">
                  Bridge course available with +{largestDeficit.gap}% competency uplift.
                </div>
              </div>

              <button
                id="bridge-module-radar-btn"
                onClick={() => onNavigate && onNavigate('topic_learning')}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
              >
                <span>Bridge Gap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip component for Recharts Radar
const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const currentScore = data.Current;
    const targetScore = data.Target;
    const cadreAvg = data.CadreAvg;
    const gap = data.gap;
    const isMet = currentScore >= targetScore;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-3.5 shadow-xl text-xs text-slate-800 min-w-[210px] space-y-2 z-50">
        <div className="border-b border-slate-100 pb-2">
          <div className="font-extrabold text-sm text-[#0F2942] leading-tight">
            {data.fullName}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            {data.category}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#FF9933]" />
              <span>Current Score:</span>
            </span>
            <span className="font-extrabold text-orange-600 font-mono text-sm">
              {currentScore}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#0F2942]" />
              <span>Role Benchmark:</span>
            </span>
            <span className="font-bold text-[#0F2942] font-mono">
              {targetScore}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Cadre Average:</span>
            </span>
            <span className="font-medium text-slate-500 font-mono">
              {cadreAvg}%
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Status:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              isMet
                ? 'bg-emerald-100 text-emerald-800'
                : gap > 20
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {isMet ? `Benchmark Met (+${currentScore - targetScore}%)` : `Deficit (-${gap}%)`}
          </span>
        </div>
      </div>
    );
  }
  return null;
};
