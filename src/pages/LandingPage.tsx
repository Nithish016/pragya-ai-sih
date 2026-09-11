import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Gamepad2,
  BookOpen,
  Award,
  Users,
  Shield,
  Layers,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  LogIn,
  Mail,
  UserPlus
} from 'lucide-react';
import { ShowcasedCourses } from '../components/ShowcasedCourses.js';
import { NationalStandingsMap } from '../components/NationalStandingsMap.js';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, role, profile, loginAs } = useAuth();
  const [learnerTrack, setLearnerTrack] = React.useState<'civil_services' | 'students'>('students');

  const hubs = [
    {
      id: 'course_map',
      title: 'Learn Hub',
      subtitle: 'Course Catalog & Learning Paths',
      description: 'Access accredited e-learning courses across functional, behavioral, and statistical domain competencies.',
      icon: BookOpen,
      tag: '1,850+ Courses',
      color: 'border-blue-200 hover:border-blue-500 bg-blue-50/50'
    },
    {
      id: 'competencies',
      title: 'Competencies Hub (FRAC)',
      subtitle: 'Framework for Roles, Activities & Competencies',
      description: 'Diagnose your skill gaps against official MoSPI cadre benchmarks and bridge shortfalls.',
      icon: TrendingUp,
      tag: 'Role Benchmarks',
      color: 'border-orange-200 hover:border-orange-500 bg-orange-50/50'
    },
    {
      id: 'games',
      title: 'Interactive SkillQuest',
      subtitle: 'Educational Games & AI Quizzes',
      description: 'Reinforce statistical principles through interactive sprint games and dynamic difficulty quizzes.',
      icon: Gamepad2,
      tag: 'Gamified Learning',
      color: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/50'
    },
    {
      id: 'recommendations',
      title: '12-Factor Recommendations',
      subtitle: 'Machine Learning Engine',
      description: 'Receive explainable course suggestions tailored to your degree, role, gaps, and cadre peers.',
      icon: Sparkles,
      tag: 'AI-Powered',
      color: 'border-purple-200 hover:border-purple-500 bg-purple-50/50'
    },
    {
      id: 'leaderboard',
      title: 'Cadre Leaderboard',
      subtitle: 'National Officer Standings',
      description: 'Track your capacity-building milestones, daily learning streaks, and digital credentials.',
      icon: Award,
      tag: 'Recognitions',
      color: 'border-amber-200 hover:border-amber-500 bg-amber-50/50'
    },
    {
      id: 'trainer',
      title: 'Trainer & Admin Studio',
      subtitle: 'Document Extraction & Sync',
      description: 'Upload MoSPI circulars, chunk into ChromaDB vector store, review AI quizzes, and sync iGOT REST APIs.',
      icon: Shield,
      tag: 'Governance',
      color: 'border-slate-300 hover:border-slate-500 bg-slate-100/60'
    }
  ];

  const featuredCourses = [
    {
      id: 'crs_data_viz',
      title: 'Data Visualization for Statistical Analysis',
      provider: 'National Statistical Systems Training Academy (NSSTA)',
      category: 'Domain Competency • Analytics',
      duration: '4.5 Hours',
      rating: 4.9,
      level: 'Intermediate',
      competency: 'Data Visualization (Critical Gap)',
      match: '94% Match'
    },
    {
      id: 'igot_crs_1',
      title: 'Principles of Evidence-Based Policy in Official Statistics',
      provider: 'Capacity Building Commission (CBC)',
      category: 'Functional Competency • Policy',
      duration: '5.0 Hours',
      rating: 4.88,
      level: 'Foundation',
      competency: 'Official Statistics Dissemination',
      match: '90% Match'
    },
    {
      id: 'crs_survey_methods',
      title: 'Survey Methods & Multi-Stage Stratified Sampling',
      provider: 'Survey Design & Research Division (MoSPI)',
      category: 'Domain Competency • Sampling',
      duration: '6.0 Hours',
      rating: 4.92,
      level: 'Advanced',
      competency: 'Survey Sampling & Design',
      match: '88% Match'
    }
  ];

  return (
    <div className="space-y-16 pb-16 bg-[#F8FAFC]">
      {/* 1. Official iGOT Karmayogi Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0F2942] via-[#132B45] to-[#1E3A8A] text-white py-14 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-orange-300 border border-white/15 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-[#FF9933] animate-ping" />
                <span>Pragya AI • Civil Services Capacity Intelligence & Student Skill Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] tracking-tight leading-tight">
                Empowering India's Civil Services through{' '}
                <span className="text-[#FF9933]">Pragya AI</span>
              </h1>

              <div className="space-y-2.5 max-w-3xl">
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  Welcome to <strong className="text-white">Pragya AI (प्रज्ञा AI)</strong>. Assess civil servant competency shortfalls, explore 5-mode interactive learning paths, track real-time state & ministry performance standings, and master national standards through gamified educational quests.
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF9933]/25 to-amber-500/15 border border-[#FF9933]/40 text-amber-200 text-xs sm:text-sm font-medium">
                  <GraduationCap className="h-4 w-4 text-[#FF9933] shrink-0" />
                  <span>Not only for civil service — it is for all students to increase their course skills and to learn new skills!</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate(user ? 'dashboard' : 'login')}
                  className="flex items-center gap-2 rounded-xl bg-[#FF9933] hover:bg-orange-500 text-[#0F2942] font-extrabold px-6 py-3 text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                >
                  <span>{user ? 'Enter Officer Portal' : 'Login / Enter Portal'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onNavigate('course_map')}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                >
                  <GraduationCap className="h-4 w-4 text-white" />
                  <span>Student & Course Skills Track</span>
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 text-xs sm:text-sm border border-white/20 transition-all"
                >
                  <Mail className="h-4 w-4 text-orange-300" />
                  <span>Sign In with Any Email</span>
                </button>

                <button
                  onClick={() => onNavigate('games')}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 font-bold px-4 py-3 text-xs sm:text-sm border border-emerald-400/30 transition-all"
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>Launch SkillQuest</span>
                </button>
              </div>
            </div>

            {/* Right Official Card / Profile Snapshot */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={user?.avatar || profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={user?.name || 'Officer'}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FF9933] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight truncate">
                        {user?.name || 'Guest Officer'}
                      </div>
                      <div className="text-[10px] text-slate-300 truncate font-mono">
                        {user?.email || 'Login with any email'}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30 shrink-0">
                    {user ? 'Active Cadre' : 'Guest Mode'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-orange-200 font-bold uppercase tracking-wider">
                    Officer Profile & Status
                  </div>
                  <div className="rounded-xl bg-black/20 p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Department:</span>
                      <span className="font-bold text-white truncate max-w-[170px] text-right">
                        {user?.department || 'National Cadre'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Target Benchmark:</span>
                      <span className="font-bold text-white">
                        {role === 'admin' ? 'Ministry Nodal Lead' : role === 'trainer' ? 'Certified Faculty' : 'Senior Statistical Officer'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Karma Points / XP:</span>
                      <span className="font-bold text-[#FF9933]">{profile?.xp || 450} XP</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => onNavigate(user ? 'dashboard' : 'login')}
                    className="w-full rounded-xl bg-white text-[#0F2942] hover:bg-slate-100 font-bold py-2 text-xs transition-colors"
                  >
                    {user ? 'Go to Personalized Dashboard →' : 'Sign In to Access Dashboard →'}
                  </button>

                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 text-[11px] border border-white/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Mail className="h-3 w-3 text-orange-300" />
                    <span>Log In with Different Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official National Capacity Metrics Ribbon */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2942]">4,280,000+</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Civil Servants & Students Enrolled</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF9933]">1,850+</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Accredited Courses & Skill Tracks</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">14,200+</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Mapped FRAC & Academic Competencies</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">100%</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Digital India & MoSPI Aligned</div>
          </div>
        </div>
      </div>

      {/* Dual Pathway: Civil Services Cadre & All Students Track */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Empowering India's Future</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
                Built for Civil Servants & All Ambitious Students
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Pragya AI bridges government cadre standards with student academic excellence. Whether you are an officer bridging competency shortfalls or a student accelerating course skills and learning new technologies, explore targeted learning pathways.
              </p>
            </div>

            {/* Pathway Selector Tabs */}
            <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200 shrink-0 self-start md:self-center">
              <button
                onClick={() => setLearnerTrack('students')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  learnerTrack === 'students'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0F2942]'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>All Students & Learners</span>
              </button>
              <button
                onClick={() => setLearnerTrack('civil_services')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  learnerTrack === 'civil_services'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0F2942]'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Civil Services Cadre</span>
              </button>
            </div>
          </div>

          {/* Tab Content: All Students */}
          {learnerTrack === 'students' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-5 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[#0F2942] text-sm sm:text-base">
                  Increase College & Course Skills
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reinforce university subjects with real-world statistical foundations: probability, sampling theories, regression modeling, and survey analysis designed by NSSTA academicians.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-blue-800">Applied Statistics</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-blue-800">Calculus & Math</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-blue-800">Econometrics</span>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-5 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[#0F2942] text-sm sm:text-base">
                  Learn New High-Demand Skills
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gain practical data science skills required in modern industries and public policy: Python for data wrangling, interactive data visualization, GIS mapping, and machine learning.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[10px] font-bold text-emerald-800">Python Data Science</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[10px] font-bold text-emerald-800">Data Visualization</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[10px] font-bold text-emerald-800">AI Literacy</span>
                </div>
              </div>

              <div className="rounded-2xl bg-purple-50/70 border border-purple-200/80 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Gamepad2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-[#0F2942] text-sm sm:text-base">
                    5-Mode Gamified Mastery
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Learn through dynamic video lectures, concept reader modules, adaptive AI quizzes, and SkillQuest mini-games. Earn Karma Coins, streaks, and verified digital certificates.
                  </p>
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => onNavigate('course_map')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Browse Student Skill Catalog</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl bg-orange-50/70 border border-orange-200/80 p-5 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#FF9933] text-[#0F2942] flex items-center justify-center font-black shadow-xs">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[#0F2942] text-sm sm:text-base">
                  FRAC Competency Diagnostics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assess and benchmark official skill proficiencies against MoSPI cadre standards. Pinpoint critical gaps across behavioral, functional, and domain competency clusters.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-orange-200 text-[10px] font-bold text-orange-900">MoSPI Cadre Standards</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-orange-200 text-[10px] font-bold text-orange-900">iGOT Karmayogi</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold shadow-xs">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[#0F2942] text-sm sm:text-base">
                  National & State Standings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Live interactive map of India displaying state capacity scores, active ministry course completions, and district cadre capacity development milestones.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-800">State Leaderboards</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-800">District Analytics</span>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-[#0F2942] text-sm sm:text-base">
                    12-Factor AI Recommendations
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Personalized machine learning recommendation algorithm factoring in education degrees, cadre roles, department priorities, and verified skill gaps.
                  </p>
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => onNavigate('competencies')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Assess Cadre Competencies</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#FF9933]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Showcased Courses Carousel (from Screenshot 2) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ShowcasedCourses onNavigate={onNavigate} />
      </div>

      {/* 3. The 6 Official Functional Hubs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
            Integrated Capacity Building Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk']">
            Explore the Hubs of Pragya AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A unified ecosystem connecting competency frameworks, e-learning courses, AI diagnostics, and cadre peer circles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <div
                key={hub.id}
                onClick={() => onNavigate(hub.id)}
                className={`rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${hub.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white text-[#0F2942] shadow-2xs">
                      <Icon className="h-6 w-6 text-[#0F2942]" />
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200 shadow-2xs">
                      {hub.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F2942] font-['Space_Grotesk']">
                    {hub.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-orange-700 mt-0.5">
                    {hub.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {hub.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#0F2942] group">
                  <span>Open Hub</span>
                  <ChevronRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* National Standings & Performance Map (from Screenshot 1) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <NationalStandingsMap />
      </div>

      {/* 4. Featured Courses in Official Pragya AI Style */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Curriculum Recommendations
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-0.5">
              Accredited MoSPI & CBC E-Learning Courses
            </h2>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0F2942] hover:text-orange-600"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((crs) => (
            <div
              key={crs.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5">
                    {crs.match}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {crs.duration} • {crs.level}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0F2942] mt-1 line-clamp-2 leading-snug">
                  {crs.title}
                </h3>

                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Provider: {crs.provider}
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Mapped Competency
                  </div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {crs.competency}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span>{crs.rating}</span>
                </div>

                <button
                  onClick={() => onNavigate('topic_learning')}
                  className="rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold px-3.5 py-1.5 text-xs transition-colors flex items-center gap-1"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="h-3 w-3 text-[#FF9933]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
