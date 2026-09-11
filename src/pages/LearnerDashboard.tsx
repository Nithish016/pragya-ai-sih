import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { CompetencyScore, CourseRecommendation } from '../types/index.js';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  Coins,
  BookOpen,
  Gamepad2,
  Brain,
  Shield,
  CheckCircle2,
  Clock,
  Play,
  Layers,
  ChevronRight,
  RefreshCw,
  GraduationCap,
  FileDown,
  Loader2,
  Check
} from 'lucide-react';
import { ShowcasedCourses } from '../components/ShowcasedCourses.js';
import { CompetencyRadarChart } from '../components/CompetencyRadarChart.js';
import { DailyStreakTracker } from '../components/DailyStreakTracker.js';
import { DailyGoalTracker } from '../components/DailyGoalTracker.js';
import { DailyNugget } from '../components/DailyNugget.js';
import { generateLearnerSummaryPDF, LearnerReportData } from '../utils/pdfGenerator.js';

interface LearnerDashboardProps {
  onNavigate: (page: string) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate }) => {
  const { user, profile, triggerConfetti } = useAuth();
  const [competencies, setCompetencies] = useState<CompetencyScore[]>([]);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [reportDownloadedRecently, setReportDownloadedRecently] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/competencies/me').then((r) => r.json()),
      fetch('/api/recommendations').then((r) => r.json())
    ])
      .then(([compData, recData]) => {
        setCompetencies(compData);
        setRecommendations(recData);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadReport = async () => {
    if (downloadingReport) return;
    try {
      setDownloadingReport(true);
      const token = localStorage.getItem('pragya_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let reportData: LearnerReportData;
      try {
        const res = await fetch('/api/learner/report-data', { headers });
        if (res.ok) {
          reportData = await res.json();
        } else {
          throw new Error('Fallback to local snapshot');
        }
      } catch {
        reportData = {
          reportId: `PRAGYA-REP-${Date.now().toString(36).toUpperCase()}`,
          generatedAt: new Date().toISOString(),
          user: {
            name: user?.name || 'Smt. Ananya Sharma',
            email: user?.email || 'ananya.sharma@mospi.gov.in',
            department: user?.department || 'Survey Design & Research Division',
            organization: user?.organization || 'Ministry of Statistics & Programme Implementation',
            role: user?.role || 'learner'
          },
          profile: {
            level: profile?.level || 3,
            xp: profile?.xp || 1240,
            coins: profile?.coins || 480,
            degree: profile?.degree || 'B.Sc Mathematics',
            specialization: profile?.specialization || 'Applied Statistics & Probability',
            currentRole: profile?.currentRole || 'Statistical Analyst',
            streakDays: profile?.streakDays || 7,
            streakHistory: profile?.streakHistory || [
              { date: 'Mon', active: true },
              { date: 'Tue', active: true },
              { date: 'Wed', active: true },
              { date: 'Thu', active: true },
              { date: 'Fri', active: true },
              { date: 'Sat', active: true },
              { date: 'Sun', active: true }
            ]
          },
          competencies: competencies.map((c) => ({
            competencyId: c.competencyId,
            name: c.name,
            category: c.category || 'General',
            score: c.score,
            requiredScore: c.requiredScore || 80,
            gap: c.gap || Math.max(0, (c.requiredScore || 80) - c.score),
            status: c.status || (c.score >= 80 ? 'strong' : c.score >= 60 ? 'good' : c.score >= 40 ? 'developing' : 'critical_gap'),
            lastAssessed: new Date().toISOString()
          })),
          completedModules: [
            {
              topicId: 'top_viz_1',
              topicTitle: 'Level 1: Principles of Cognitive Perception in Statistical Charts',
              moduleId: 'mod_viz_1',
              moduleTitle: 'World 1: Visual Grammar & Chart Archetypes',
              courseId: 'crs_data_viz',
              courseTitle: 'Data Visualization for Statistical Analysis',
              courseCode: 'STAT-VIZ-201',
              competency: 'Data Visualization',
              xpReward: 100,
              completedActivities: { video: true, ebook: true, pdf: true, game: true, quiz: true },
              completedModesCount: 5,
              isFullyCompleted: true,
              completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
              topicId: 'top_viz_2',
              topicTitle: 'Level 2: Misleading Scales, Truncated Baselines & Distortion',
              moduleId: 'mod_viz_1',
              moduleTitle: 'World 1: Visual Grammar & Chart Archetypes',
              courseId: 'crs_data_viz',
              courseTitle: 'Data Visualization for Statistical Analysis',
              courseCode: 'STAT-VIZ-201',
              competency: 'Data Visualization',
              xpReward: 120,
              completedActivities: { video: true, ebook: true, pdf: true, game: false, quiz: true },
              completedModesCount: 4,
              isFullyCompleted: true,
              completedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              topicId: 'top_fnd_1',
              topicTitle: 'Level 1: Measures of Central Tendency: Mean, Median & Mode',
              moduleId: 'mod_fnd_1',
              moduleTitle: 'World 1: Statistical Foundations & Central Tendency',
              courseId: 'crs_stat_fundamentals',
              courseTitle: 'Statistical Foundations & Macro Aggregates',
              courseCode: 'STAT-FND-101',
              competency: 'Measures of Central Tendency',
              xpReward: 100,
              completedActivities: { video: true, ebook: true, pdf: true, game: true, quiz: true },
              completedModesCount: 5,
              isFullyCompleted: true,
              completedAt: new Date(Date.now() - 86400000 * 4).toISOString()
            }
          ],
          coursesSummary: [
            {
              courseId: 'crs_data_viz',
              title: 'Data Visualization for Statistical Analysis',
              code: 'STAT-VIZ-201',
              level: 'Intermediate',
              totalTopics: 5,
              completedTopics: 2,
              progressPercent: 40
            },
            {
              courseId: 'crs_stat_fundamentals',
              title: 'Statistical Foundations & Macro Aggregates',
              code: 'STAT-FND-101',
              level: 'Beginner',
              totalTopics: 1,
              completedTopics: 1,
              progressPercent: 100
            }
          ],
          achievements: [
            {
              id: 'ach_7day_streak',
              title: '7 Day Streak Master',
              description: 'Continuous learning activity for seven consecutive days.',
              unlockedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 'ach_first_steps',
              title: 'First Steps Cadet',
              description: 'Completed first official learning topic in National Statistical System.',
              unlockedAt: new Date(Date.now() - 86400000 * 6).toISOString()
            }
          ]
        };
      }

      await generateLearnerSummaryPDF(reportData);
      triggerConfetti?.();
      setReportDownloadedRecently(true);
      setTimeout(() => setReportDownloadedRecently(false), 4000);
    } catch (err) {
      console.error('Error downloading learner report:', err);
    } finally {
      setDownloadingReport(false);
    }
  };

  const criticalGaps = competencies.filter((c) => c.status === 'critical_gap');
  const topRecommendation = recommendations[0];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Officer Profile & Welcome Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative tricolor corner accent */}
        <div className="absolute top-0 right-0 h-2 w-32 flex">
          <div className="h-full w-1/3 bg-[#FF9933]" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-[#138808]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt="Officer"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-orange-500 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk']">
                  Welcome, {user?.name || 'Smt. Ananya Sharma'}
                </h1>
                <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 border border-blue-200">
                  MoSPI Cadre • JSO
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {profile?.department || 'Survey Design & Research Division'} • Ministry of Statistics & Programme Implementation
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span>Degree: <strong>{profile?.degree || 'B.Sc Mathematics'}</strong></span>
                <span>•</span>
                <span>Target Benchmark: <strong className="text-orange-700">Senior Statistical Officer</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-3.5 text-center min-w-[84px] sm:min-w-[90px]">
                <div className="text-xs font-bold text-orange-700 uppercase flex items-center justify-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-orange-600" />
                  <span>Karma Pts</span>
                </div>
                <div className="text-xl font-black text-orange-950 font-mono mt-0.5">
                  {profile?.coins || 420}
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-center min-w-[84px] sm:min-w-[90px]">
                <div className="text-xs font-bold text-rose-700 uppercase flex items-center justify-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-rose-600" />
                  <span>Streak</span>
                </div>
                <div className="text-xl font-black text-rose-950 font-mono mt-0.5">
                  {profile?.streakDays || 5} Days
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-center min-w-[84px] sm:min-w-[90px]">
                <div className="text-xs font-bold text-blue-700 uppercase flex items-center justify-center gap-1">
                  <Award className="h-3.5 w-3.5 text-blue-600" />
                  <span>Level</span>
                </div>
                <div className="text-xl font-black text-blue-950 font-mono mt-0.5">
                  L{profile?.level || 3}
                </div>
              </div>
            </div>

            {/* Download Summary PDF Report Button */}
            <button
              id="btn-download-learner-report"
              onClick={handleDownloadReport}
              disabled={downloadingReport}
              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-75 ${
                reportDownloadedRecently
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-400'
                  : 'bg-gradient-to-br from-[#0F2942] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#0F2942] text-white border border-blue-900/40 shadow-blue-950/10'
              }`}
              title="Download official PDF report containing current competencies, completed modules, and streak history"
            >
              {downloadingReport ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                  <div className="text-left">
                    <div className="leading-tight">Generating PDF...</div>
                    <div className="text-[10px] text-orange-200 font-normal">Compiling Matrix</div>
                  </div>
                </>
              ) : reportDownloadedRecently ? (
                <>
                  <Check className="h-4 w-4 text-emerald-200" />
                  <div className="text-left">
                    <div className="leading-tight">Report Downloaded!</div>
                    <div className="text-[10px] text-emerald-200 font-normal">Saved to device</div>
                  </div>
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 text-orange-400 shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight font-bold">Download Report</div>
                    <div className="text-[10px] text-slate-300 font-normal">Official PDF Summary</div>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Daily Learning Streak & Engagement Rewards Tracker */}
      <DailyStreakTracker onNavigate={onNavigate} />

      {/* 3. Daily Learning Goals & Progress Tracker */}
      <DailyGoalTracker onNavigate={onNavigate} />

      {/* 4. AI-Generated Daily Nugget (Spaced Repetition & Micro-Retention) */}
      <DailyNugget onNavigate={onNavigate} />

      {/* 5. Dynamic FRAC Competency Progress Radar Chart (Recharts) */}
      <CompetencyRadarChart
        competencies={competencies}
        onNavigate={onNavigate}
      />

      {/* 3. Critical FRAC Competency Gap Alert Box */}
      {criticalGaps.length > 0 && (
        <div className="rounded-3xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 via-amber-50 to-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-600 text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#0F2942] font-['Space_Grotesk']">
                  FRAC Competency Diagnostic: {criticalGaps.length} Priority Gaps Detected
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Your current capability scores in official statistical visualization are below the benchmark required for Senior Statistical Officer.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('competencies')}
              className="rounded-xl border border-orange-300 bg-white hover:bg-orange-50 text-orange-900 font-bold px-4 py-2 text-xs transition-colors shrink-0"
            >
              Full Diagnostics Matrix →
            </button>
          </div>

          {/* Gaps List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {criticalGaps.map((gap) => (
              <div
                key={gap.competencyId}
                className="rounded-2xl border border-orange-200 bg-white p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[#0F2942]">{gap.name}</div>
                  <span className="rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5">
                    Critical Gap (-{gap.gap}%)
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Current Score: <strong className="text-rose-700">{gap.score}%</strong></span>
                    <span>Role Benchmark: <strong className="text-slate-800">{gap.requiredScore}%</strong></span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all"
                      style={{ width: `${gap.score}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-500">
                    Bridge course ready on Pragya AI
                  </span>
                  <button
                    onClick={() => onNavigate('topic_learning')}
                    className="flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-900"
                  >
                    <span>Launch Bridge Module</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. In-Progress Course & 12-Factor Match Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Learning Course */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5">
                In-Progress E-Learning
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                MoSPI / NSSTA Certified
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#0F2942] font-['Space_Grotesk'] leading-snug">
              Data Visualization for Statistical Analysis
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Level 1: Principles of Cognitive Perception in Statistical Charts (Cleveland & McGill visual encoding rankings).
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Course Completion: <strong>40% Complete</strong></span>
                <span>2 of 5 Topics Completed</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#0F2942] w-2/5" />
              </div>
            </div>

            {/* 5 Formats Pills */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">5 Modes:</span>
              <span className="rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5">🎥 Video Lecture</span>
              <span className="rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5">📖 Official E-Book</span>
              <span className="rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5">📄 Circular PDF</span>
              <span className="rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5">🎮 Knowledge Run Game</span>
              <span className="rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold px-2 py-0.5">🧠 AI Adaptive Quiz</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('course_map')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              View Full Course Map →
            </button>
            <button
              onClick={() => onNavigate('topic_learning')}
              className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold px-5 py-2.5 text-xs shadow-xs transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Continue Learning (Topic 1)</span>
            </button>
          </div>
        </div>

        {/* Top 12-Factor ML Recommendation Card */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2.5 py-0.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                94% Algorithm Match
              </span>
              <span className="text-[11px] text-slate-400">12-Factor ML Engine</span>
            </div>

            <h3 className="text-base font-bold text-[#0F2942] font-['Space_Grotesk'] leading-snug">
              Why this was recommended for you:
            </h3>

            <div className="mt-3 space-y-2 rounded-2xl bg-[#F8FAFC] p-4 border border-slate-100 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Directly targets your <strong>Data Visualization</strong> gap (-42%).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Fits your <strong>B.Sc Mathematics</strong> academic profile.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Required for <strong>Senior Statistical Officer</strong> role advancement.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-bold text-orange-700 hover:text-orange-900"
            >
              All 9 Recommendation Types →
            </button>
            <button
              onClick={() => onNavigate('course_map')}
              className="rounded-xl bg-[#FF9933] hover:bg-orange-500 text-[#0F2942] font-bold px-4 py-2 text-xs transition-colors"
            >
              Start Course Journey
            </button>
          </div>
        </div>
      </div>

      {/* Showcased Courses Carousel from Screenshot */}
      <ShowcasedCourses onNavigate={onNavigate} />

      {/* 4. Gamified SkillQuest Quick Jump Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => onNavigate('games')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              +150 XP
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#0F2942]">Knowledge Run Sprint</h4>
          <p className="text-xs text-slate-500 mt-1">
            Navigate statistical obstacles, preserve 3 hearts, and pass cognitive encoding gates.
          </p>
        </div>

        <div
          onClick={() => onNavigate('quizzes')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 group-hover:scale-110 transition-transform">
              <Brain className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              Adaptive
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#0F2942]">AI Adaptive Quiz</h4>
          <p className="text-xs text-slate-500 mt-1">
            Tests dynamically shift difficulty, cite MoSPI sources, and boost your live competency score.
          </p>
        </div>

        <div
          onClick={() => onNavigate('leaderboard')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Rank #3
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#0F2942]">Ministry Leaderboard</h4>
          <p className="text-xs text-slate-500 mt-1">
            Compare capacity building achievements across SDRD and field regional divisions.
          </p>
        </div>
      </div>
    </div>
  );
};
