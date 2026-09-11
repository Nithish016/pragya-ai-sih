import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Video,
  FileText,
  Gamepad2,
  Brain,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize,
  Bookmark,
  ZoomIn,
  ZoomOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Flame,
  Coins,
  AlertCircle,
  HelpCircle,
  Trophy,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface TopicLearningPageProps {
  onNavigate: (page: string) => void;
  initialMode?: 'video' | 'ebook' | 'pdf' | 'game' | 'quiz';
}

export const TopicLearningPage: React.FC<TopicLearningPageProps> = ({ onNavigate, initialMode = 'video' }) => {
  const { user, profile, addXP, addCoins, triggerConfetti, simulateCompetencyBoost } = useAuth();
  const [activeTab, setActiveTab] = useState<'video' | 'ebook' | 'pdf' | 'game' | 'quiz'>(initialMode);

  // Completion states for 5 modes
  const [completedModes, setCompletedModes] = useState({
    video: false,
    ebook: false,
    pdf: false,
    game: false,
    quiz: false
  });

  // ----------------------------------------------------
  // VIDEO STATE
  // ----------------------------------------------------
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTranscriptIdx, setActiveTranscriptIdx] = useState(1);

  const videoChapters = [
    { title: '01. Introduction to Official Statistical Reporting', time: '00:00' },
    { title: '02. Cleveland & McGill Graphical Perception Hierarchy', time: '02:15' },
    { title: '03. The Zero Baseline Mandate for Bar Charts', time: '05:40' },
    { title: '04. Color-safe palettes for National Portals', time: '08:20' }
  ];

  const transcript = [
    { time: '00:15', speaker: 'Dr. Varma (NSSTA)', text: 'Welcome to this specialized module on visual analytics for official statistical bulletins.' },
    { time: '02:20', speaker: 'Dr. Varma (NSSTA)', text: 'In experimental psychology, Cleveland and McGill proved that humans judge position along a common scale with the highest accuracy.' },
    { time: '04:10', speaker: 'Dr. Varma (NSSTA)', text: 'Angles and areas in 3D pie charts consistently introduce cognitive distortion, causing readers to misestimate policy figures.' },
    { time: '06:05', speaker: 'Dr. Varma (NSSTA)', text: 'Therefore, MoSPI formatting rules mandate that all economic indicator bar charts strictly begin at a zero baseline.' }
  ];

  const handleMarkVideoComplete = () => {
    if (!completedModes.video) {
      setCompletedModes((prev) => ({ ...prev, video: true }));
      addXP(30);
      addCoins(10);
      triggerConfetti();
    }
  };

  // ----------------------------------------------------
  // E-BOOK STATE
  // ----------------------------------------------------
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(65);

  const handleMarkEbookComplete = () => {
    if (!completedModes.ebook) {
      setCompletedModes((prev) => ({ ...prev, ebook: true }));
      addXP(20);
      addCoins(10);
      triggerConfetti();
    }
  };

  // ----------------------------------------------------
  // PDF STATE
  // ----------------------------------------------------
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(100);

  const handleMarkPdfComplete = () => {
    if (!completedModes.pdf) {
      setCompletedModes((prev) => ({ ...prev, pdf: true }));
      addXP(30);
      addCoins(10);
      triggerConfetti();
    }
  };

  // ----------------------------------------------------
  // GAME STATE: "Knowledge Run"
  // ----------------------------------------------------
  const [selectedGameType, setSelectedGameType] = useState<'run' | 'collector' | 'boss'>('run');
  const [gameScore, setGameScore] = useState(0);
  const [gameCoins, setGameCoins] = useState(0);
  const [gameLives, setGameLives] = useState(3);
  const [gameStep, setGameStep] = useState(0);
  const [gameGameOver, setGameGameOver] = useState(false);
  const [gameCompletedSuccess, setGameCompletedSuccess] = useState(false);

  const gameQuestions = [
    {
      stage: 'Checkpoint 1: Cleveland Perception Gate',
      prompt: 'A citizen wants to compare state unemployment rates. Which visual encoding yields the lowest decoding error?',
      options: [
        'Aligned bar chart along a common horizontal axis',
        '3D Donut chart with isometric shading',
        'Color saturation density grid without numbers',
        'Circular bubble size chart'
      ],
      correct: 0,
      xpBonus: 50
    },
    {
      stage: 'Checkpoint 2: The Zero Baseline Chasm',
      prompt: 'A press release bar chart truncates the Y-axis at 45% instead of 0%. What visual flaw does this create?',
      options: [
        'Data-Ink optimization',
        'Artificial visual exaggeration of small statistical variations',
        'Enhanced statistical significance',
        'Resolution scaling compliance'
      ],
      correct: 1,
      xpBonus: 50
    },
    {
      stage: 'Checkpoint 3: The Choropleth Canyon',
      prompt: 'When mapping rural household expenditure across Indian districts, what must be avoided?',
      options: [
        'Normalizing raw expenditure by district population',
        'Using raw count totals instead of per-capita rates',
        'Providing equal interval color steps',
        'Including a clear legend scale'
      ],
      correct: 1,
      xpBonus: 50
    }
  ];

  const handleGameAnswer = (optionIdx: number) => {
    const currentQ = gameQuestions[gameStep];
    if (optionIdx === currentQ.correct) {
      setGameScore((prev) => prev + 100);
      setGameCoins((prev) => prev + 15);
      if (gameStep + 1 < gameQuestions.length) {
        setGameStep((prev) => prev + 1);
      } else {
        setGameCompletedSuccess(true);
        setCompletedModes((prev) => ({ ...prev, game: true }));
        addXP(150);
        addCoins(45);
        triggerConfetti();
      }
    } else {
      const remaining = gameLives - 1;
      setGameLives(remaining);
      if (remaining <= 0) {
        setGameGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setGameScore(0);
    setGameCoins(0);
    setGameLives(3);
    setGameStep(0);
    setGameGameOver(false);
    setGameCompletedSuccess(false);
  };

  // ----------------------------------------------------
  // ADAPTIVE AI QUIZ STATE
  // ----------------------------------------------------
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [isSubmittedQuestion, setIsSubmittedQuestion] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [quizAnswersRecord, setQuizAnswersRecord] = useState<any[]>([]);
  const [competencyBoostApplied, setCompetencyBoostApplied] = useState(false);

  const quizQuestions = [
    {
      id: 'q1',
      difficulty: 'Medium',
      question: 'According to William Cleveland’s graphical perception experiments, which visual attribute is decoded most accurately by human observers?',
      options: [
        'Position along a common aligned scale',
        'Length of non-aligned bars',
        'Area of geometric shapes',
        'Color hue differentiation'
      ],
      correct: 0,
      explanation: 'Cleveland & McGill (1984) established that position along a common scale has the lowest perceptual error rate, followed by position along non-aligned scales, length, angle, and area.',
      source: 'MoSPI Data Visualization Guidelines 2025, Section 3.1'
    },
    {
      id: 'q2',
      difficulty: 'Hard',
      question: 'When presenting time-series CPI inflation trends in official press releases, why is a line chart preferred over a smoothed spline interpolation?',
      options: [
        'Splines consume higher computational bandwidth on mobile',
        'Spline curves invent artificial intermediate fluctuations between monthly reporting points',
        'Line charts require fewer RGB color channels',
        'MoSPI style guidelines forbid vector paths'
      ],
      correct: 1,
      explanation: 'Spline smoothing often dips or spikes between real empirical data points, falsely implying intra-month trends that were never measured by official field enumeration.',
      source: 'National Accounts Division Handbook on Economic Indicators'
    },
    {
      id: 'q3',
      difficulty: 'Hard',
      question: 'Under Edward Tufte’s visual design principles, what does maximizing the "Data-Ink Ratio" signify?',
      options: [
        'Using heavy dark backgrounds and decorative 3D shading',
        'Eliminating non-essential decorative elements, heavy gridlines, and redundant borders',
        'Printing official reports with industrial waterproof ink',
        'Increasing the number of statistical charts per report page'
      ],
      correct: 1,
      explanation: 'Data-Ink ratio = Data-Ink / Total Ink used. Maximizing this ratio removes chartjunk (unnecessary 3D effects, dark backgrounds, and thick borderlines) to focus solely on statistical evidence.',
      source: 'Principles of Statistical Graphics (NSSTA Curriculum)'
    }
  ];

  const handleSelectQuizOption = (idx: number) => {
    if (isSubmittedQuestion) return;
    setUserSelectedOption(idx);
  };

  const handleSubmitQuestion = () => {
    if (userSelectedOption === null) return;
    const currentQ = quizQuestions[quizQuestionIdx];
    const isCorrect = userSelectedOption === currentQ.correct;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      // Adapt difficulty up
      setActiveDifficulty('Hard');
    } else {
      // Adapt difficulty down/medium
      setActiveDifficulty('Medium');
    }

    setQuizAnswersRecord((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selected: userSelectedOption,
        correct: currentQ.correct,
        isCorrect,
        explanation: currentQ.explanation,
        source: currentQ.source
      }
    ]);

    setIsSubmittedQuestion(true);
  };

  const handleNextQuizQuestion = () => {
    if (quizQuestionIdx + 1 < quizQuestions.length) {
      setQuizQuestionIdx((prev) => prev + 1);
      setUserSelectedOption(null);
      setIsSubmittedQuestion(false);
    } else {
      // Finalize Quiz
      setQuizCompleted(true);
      setCompletedModes((prev) => ({ ...prev, quiz: true }));

      // Trigger Level up & dynamic competency update (Section 65 & SIH Key Scenario Step 7!)
      // Data Visualization 38% -> 52%!
      simulateCompetencyBoost('Data Visualization', 14);
      setCompetencyBoostApplied(true);
      addXP(120);
      addCoins(50);
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="cursor-pointer hover:underline" onClick={() => onNavigate('course_map')}>
                Learn Hub • World 1
              </span>
              <span>•</span>
              <span>Stage 1</span>
              <span>•</span>
              <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-200">
                Data Visualization
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk']">
              Principles of Data Visualization for National Reports
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Master cognitive chart decoding, zero-baseline rules, and accessibility standards for MoSPI statistical publications.
            </p>
          </div>

          {/* Gamification Progress on this Topic */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-right">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Topic Completion</div>
              <div className="text-sm font-extrabold text-[#0F2942]">
                {Object.values(completedModes).filter(Boolean).length} / 5 Modes
              </div>
            </div>
            <button
              onClick={() => onNavigate('course_map')}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[#0F2942] px-3.5 py-2 text-xs font-bold shadow-2xs"
            >
              Back to Map
            </button>
          </div>
        </div>

        {/* 5-Mode Switcher Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-[#0F2942] text-white shadow-xs ring-1 ring-blue-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Video className="h-4 w-4 text-[#FF9933]" />
            <span>1. Watch Video</span>
            {completedModes.video && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('ebook')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'ebook'
                ? 'bg-[#0F2942] text-white shadow-xs ring-1 ring-blue-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span>2. Read E-Book</span>
            {completedModes.ebook && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'pdf'
                ? 'bg-[#0F2942] text-white shadow-xs ring-1 ring-blue-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <FileText className="h-4 w-4 text-rose-400" />
            <span>3. Read PDF Manual</span>
            {completedModes.pdf && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'game'
                ? 'bg-[#0F2942] text-white shadow-xs ring-1 ring-blue-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Gamepad2 className="h-4 w-4 text-amber-400" />
            <span>4. Play Game (Run)</span>
            {completedModes.game && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#0F2942] text-white shadow-xs ring-1 ring-blue-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Brain className="h-4 w-4 text-purple-400" />
            <span>5. AI Adaptive Quiz</span>
            {completedModes.quiz && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: VIDEO PLAYER */}
      {/* ========================================================================= */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Screen */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6">
              {/* Fake Video Canvas Illustration */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-4 ring-emerald-500/30 mb-4 animate-pulse">
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 translate-x-0.5 fill-emerald-400" />}
                </div>
                <h3 className="text-lg font-bold text-white max-w-md">
                  Perception Hierarchy & Axis Scaling for National Accounts
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Lecture by National Statistical Systems Training Academy (NSSTA), MoSPI
                </p>
              </div>

              {/* Top Overlays */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white">
                  MoSPI HD 1080p
                </span>
                <span className="rounded-md bg-emerald-500/90 text-slate-950 px-2 py-0.5 text-[10px] font-bold">
                  +30 XP on completion
                </span>
              </div>

              {/* Bottom Player Controls */}
              <div className="relative z-10 rounded-2xl bg-slate-900/90 backdrop-blur-md p-3 border border-slate-800">
                {/* Scrub bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    setVideoProgress(percent);
                  }}
                  className="h-2 w-full rounded-full bg-slate-800 cursor-pointer overflow-hidden mb-3"
                >
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="rounded-lg bg-emerald-500 p-2 text-slate-950 hover:bg-emerald-400"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-slate-950" />}
                    </button>
                    <span className="text-slate-300 font-mono text-[11px]">03:45 / 12:30</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                      className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold hover:bg-slate-700"
                    >
                      {playbackSpeed}x Speed
                    </button>
                    <Volume2 className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white" />
                    <Maximize className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Action Button */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <div className="text-xs font-bold text-white">Watched the full lecture?</div>
                <div className="text-[11px] text-slate-400">Claim your learning XP and unlock next topic stages.</div>
              </div>
              <button
                onClick={handleMarkVideoComplete}
                disabled={completedModes.video}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  completedModes.video
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                }`}
              >
                {completedModes.video ? '✓ Completed (+30 XP)' : 'Mark Video Complete (+30 XP)'}
              </button>
            </div>
          </div>

          {/* Video Chapters & Synchronized Transcript */}
          <div className="space-y-4">
            {/* Chapters */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Lecture Chapters
              </div>
              <div className="space-y-1.5">
                {videoChapters.map((chap, i) => (
                  <div
                    key={i}
                    onClick={() => setVideoProgress((i + 1) * 25)}
                    className="flex items-center justify-between p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <span className="line-clamp-1">{chap.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">{chap.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Transcript Accordion */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Synchronized Transcript
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transcript.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTranscriptIdx(idx)}
                    className={`p-2 rounded-xl text-xs cursor-pointer transition-all ${
                      activeTranscriptIdx === idx
                        ? 'border border-cyan-500/30 bg-cyan-950/20 text-cyan-200'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-0.5">
                      <span>{t.speaker}</span>
                      <span>{t.time}</span>
                    </div>
                    <p className="leading-relaxed">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: E-BOOK READER */}
      {/* ========================================================================= */}
      {activeTab === 'ebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* E-book Chapter Sidebar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 h-fit space-y-3">
            <div className="text-xs font-bold uppercase text-slate-400">E-Book Contents</div>
            <div className="space-y-1 text-xs">
              <button className="w-full text-left p-2 rounded-lg bg-amber-500/20 text-amber-300 font-semibold">
                Chapter 1: The Human Visual Cortex
              </button>
              <button className="w-full text-left p-2 rounded-lg text-slate-400 hover:bg-slate-800">
                Chapter 2: The Data-to-Ink Ratio
              </button>
              <button className="w-full text-left p-2 rounded-lg text-slate-400 hover:bg-slate-800">
                Chapter 3: Avoiding 3D Distortions
              </button>
              <button className="w-full text-left p-2 rounded-lg text-slate-400 hover:bg-slate-800">
                Chapter 4: Statistical Tables & Typography
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Estimated reading time: <strong className="text-white">6 mins</strong>
            </div>
          </div>

          {/* Reader Area */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Font Size:</span>
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 text-xs rounded ${fontSize === 'sm' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-2 py-1 text-xs rounded ${fontSize === 'base' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 text-xs rounded ${fontSize === 'lg' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  A+
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border ${
                    isBookmarked
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-800 text-slate-400'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
                <span className="text-xs text-slate-400">Progress: 65%</span>
              </div>
            </div>

            {/* Formatted E-Book Article */}
            <article className={`space-y-4 text-slate-200 leading-relaxed ${
              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
            }`}>
              <h2 className="text-xl font-extrabold text-white font-['Space_Grotesk']">
                Chapter 1: The Human Visual Cortex & Graphical Perception
              </h2>

              <p>
                When an officer or policymaker views an official statistical release, pre-attentive visual processing occurs within 200 milliseconds. Before deliberate cognitive scrutiny begins, the brain has already parsed length, spatial position, color contrast, and orientation.
              </p>

              {/* Callout Box */}
              <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-950/20 p-4 text-amber-200">
                <div className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-1">
                  MoSPI Official Dissemination Rule #1
                </div>
                <p className="text-xs">
                  Bar charts representing non-ratio frequencies must never truncate the baseline axis. Truncation visually magnifies a 2% variation into an apparent 200% surge, misleading public economic commentary.
                </p>
              </div>

              <p>
                In 1984, research by William Cleveland and Robert McGill ranked elementary perceptual tasks. The rank ordering of accuracy from highest to lowest is:
              </p>

              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-300">
                <li><strong>Position along a common aligned scale</strong> (e.g. standard horizontal or vertical bar charts)</li>
                <li><strong>Position along non-aligned scales</strong> (e.g. small multiples or faceted panels)</li>
                <li><strong>Length, direction, and angle</strong> (e.g. trend lines, vectors)</li>
                <li><strong>Area</strong> (e.g. bubble charts, proportional squares)</li>
                <li><strong>Volume and curvature</strong> (e.g. 3D isometric cylinders)</li>
                <li><strong>Color shading and color saturation</strong> (e.g. heatmap cells without numbers)</li>
              </ol>

              <p>
                By strictly choosing visual channels near the top of this hierarchy, statistical officers minimize reader error and safeguard institutional integrity.
              </p>
            </article>

            {/* Complete E-Book Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Finished Chapter 1?</span>
              <button
                onClick={handleMarkEbookComplete}
                disabled={completedModes.ebook}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  completedModes.ebook
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md'
                }`}
              >
                {completedModes.ebook ? '✓ Read Completed (+20 XP)' : 'Mark Chapter Read (+20 XP)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: PDF VIEWER */}
      {/* ========================================================================= */}
      {activeTab === 'pdf' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
          {/* PDF Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-rose-400" />
              <div>
                <div className="text-xs font-bold text-white">MoSPI_Data_Visualization_Guidelines_2025.pdf</div>
                <div className="text-[10px] text-slate-400">Indexed in ChromaDB Semantic Vector Store</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfZoom((prev) => Math.max(75, prev - 15))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-slate-300 font-mono">{pdfZoom}%</span>
              <button
                onClick={() => setPdfZoom((prev) => Math.min(150, prev + 15))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <button
                onClick={() => setPdfPage((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-slate-300">Page {pdfPage} of 6</span>
              <button
                onClick={() => setPdfPage((prev) => Math.min(6, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Rendered PDF Simulation Page */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-700/60 bg-white text-slate-900 p-8 shadow-2xl space-y-4 font-serif">
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-600">
                GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 mt-1">
                STANDARDS MANUAL FOR STATISTICAL TABLES AND GRAPHICS
              </h2>
              <div className="text-[11px] text-slate-500 italic mt-0.5">
                Circular No. 14/NSSTA/2025 • New Delhi
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <p>
                <strong>1. Executive Purpose:</strong> This directive standardizes the visual dissemination format for all survey bulletins released by the National Statistical Office (NSO). Compliance is mandatory across Central and Field Operations Divisions.
              </p>

              <p>
                <strong>2. Prohibited Visual Formats:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>3-Dimensional bar and pie representations under any circumstances.</li>
                <li>Truncation of horizontal or vertical origin baselines.</li>
                <li>Rainbow color maps without monotonically increasing luminance.</li>
              </ul>

              <p>
                <strong>3. Digital Accessibility:</strong> All color scales must pass WCAG AA standards (minimum 4.5:1 contrast against background canvas) to ensure accessibility for color-deficient readers.
              </p>

              <div className="rounded border border-slate-300 bg-slate-50 p-3 text-[11px] font-sans">
                <strong>Vector Metadata Notice:</strong> This manual has been ingested into ChromaDB (Collection: <code>materials</code>). AI Quiz generation parses Section 2 and 3 chunks to construct adaptive learner assessments.
              </div>
            </div>
          </div>

          {/* PDF Bottom Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">Verified official policy document.</span>
            <button
              onClick={handleMarkPdfComplete}
              disabled={completedModes.pdf}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                completedModes.pdf
                  ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'bg-rose-500 text-white hover:bg-rose-400 shadow-md'
              }`}
            >
              {completedModes.pdf ? '✓ Read Completed (+30 XP)' : 'Mark PDF Completed (+30 XP)'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: EDUCATIONAL GAME ("Knowledge Run") */}
      {/* ========================================================================= */}
      {activeTab === 'game' && (
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Game HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/30">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white font-['Space_Grotesk']">
                  Knowledge Run: Data Viz Checkpoint Gauntlet
                </h2>
                <div className="text-[11px] text-slate-400">
                  Sprint past 3 checkpoints by making correct cognitive chart choices!
                </div>
              </div>
            </div>

            {/* HUD Status: Lives, Score, Coins */}
            <div className="flex items-center gap-4">
              {/* Lives */}
              <div className="flex items-center gap-1.5 rounded-xl bg-rose-950/30 px-3 py-1.5 border border-rose-500/30 text-rose-400">
                <span className="text-xs font-bold">Lives:</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i < gameLives ? 'bg-rose-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Game Score */}
              <div className="rounded-xl bg-slate-950 px-3 py-1.5 border border-slate-800 text-xs">
                <span className="text-slate-400">Score:</span>{' '}
                <strong className="text-emerald-400">{gameScore}</strong>
              </div>

              {/* Game Coins */}
              <div className="flex items-center gap-1 rounded-xl bg-yellow-950/30 px-3 py-1.5 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                <Coins className="h-3.5 w-3.5" />
                <span>+{gameCoins}</span>
              </div>
            </div>
          </div>

          {/* Active Game Stage Screen */}
          {!gameGameOver && !gameCompletedSuccess && (
            <div className="space-y-6">
              {/* Stage Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-emerald-400">
                  Stage {gameStep + 1} of {gameQuestions.length}: {gameQuestions[gameStep].stage}
                </span>
                <span>Sprint Progress</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${((gameStep + 1) / gameQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Banner */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="text-xs font-bold uppercase text-amber-400 mb-2">
                  Obstacle Ahead:
                </div>
                <h3 className="text-base font-bold text-white leading-relaxed">
                  {gameQuestions[gameStep].prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameQuestions[gameStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGameAnswer(idx)}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-emerald-500/50 hover:bg-slate-900 p-4 text-left text-xs text-slate-200 transition-all hover:scale-101 active:scale-98 shadow-md"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400 font-bold text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Victory Screen */}
          {gameCompletedSuccess && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                Sprint Conquered! Checkpoint Cleared!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                You maintained statistical integrity across all 3 checkpoints. Your reward has been added to your profile balance.
              </p>
              <div className="flex justify-center gap-4 text-sm font-bold">
                <span className="text-amber-400">+150 XP Earned</span>
                <span>•</span>
                <span className="text-yellow-400">+45 Coins Added</span>
              </div>
              <button
                onClick={resetGame}
                className="mt-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 text-xs font-semibold"
              >
                Replay Sprint
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameGameOver && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 ring-4 ring-rose-500/30">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                Out of Lives!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Careful! Misleading visual representations incurred cognitive penalties. Review the MoSPI guideline manual and try again.
              </p>
              <button
                onClick={resetGame}
                className="rounded-xl bg-rose-500 hover:bg-rose-400 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Retry Checkpoint Sprint
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 5: ADAPTIVE AI QUIZ (Section 65 & SIH Key Scenario Step 7!) */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="rounded-3xl border border-purple-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quiz Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center ring-1 ring-purple-500/30">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white font-['Space_Grotesk']">
                    Adaptive AI Competency Assessment
                  </h2>
                  <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                    Live AI Engine
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Questions dynamically adjust difficulty based on your responses. Passing updates your competency score!
                </div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current AI Difficulty:</span>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                  activeDifficulty === 'Hard'
                    ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
                }`}
              >
                {activeDifficulty}
              </span>
            </div>
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              {/* Question Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Question <strong className="text-white">{quizQuestionIdx + 1}</strong> of{' '}
                  {quizQuestions.length}
                </span>
                <span>Adaptive Score: {quizScore}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((quizQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                  Competency: Data Visualization
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {quizQuestions[quizQuestionIdx].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {quizQuestions[quizQuestionIdx].options.map((option, idx) => {
                  const isSelected = userSelectedOption === idx;
                  const isCorrect = idx === quizQuestions[quizQuestionIdx].correct;

                  let borderStyle = 'border-slate-800 bg-slate-900 hover:border-purple-500/40';
                  if (isSubmittedQuestion) {
                    if (isCorrect) borderStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
                    else if (isSelected && !isCorrect) borderStyle = 'border-rose-500 bg-rose-950/30 text-rose-200';
                    else borderStyle = 'border-slate-800 bg-slate-950/40 opacity-50';
                  } else if (isSelected) {
                    borderStyle = 'border-purple-500 bg-purple-950/30 text-purple-200 ring-2 ring-purple-500/30';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={isSubmittedQuestion}
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs transition-all ${borderStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-800 font-bold text-xs text-slate-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSubmittedQuestion && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate AI Explanation Box (Section 10 requirement) */}
              {isSubmittedQuestion && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Sparkles className="h-4 w-4" />
                    <span>Instant AI Pedagogical Explanation:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {quizQuestions[quizQuestionIdx].explanation}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-purple-500/20">
                    Source Reference: <strong className="text-white">{quizQuestions[quizQuestionIdx].source}</strong>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!isSubmittedQuestion ? (
                  <button
                    onClick={handleSubmitQuestion}
                    disabled={userSelectedOption === null}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                      userSelectedOption !== null
                        ? 'bg-purple-500 text-white hover:bg-purple-400 shadow-md shadow-purple-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition-all shadow-md"
                  >
                    <span>{quizQuestionIdx + 1 < quizQuestions.length ? 'Next Question' : 'Complete Assessment'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Score & DYNAMIC COMPETENCY GAP UPDATE SCREEN */
            <div className="py-6 space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  Assessment Passed: Score {Math.round((quizScore / quizQuestions.length) * 100)}%
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  You successfully demonstrated proficiency in graphical perception and MoSPI presentation guidelines!
                </p>
              </div>

              {/* CRITICAL SIH DEMO CARD: DYNAMIC COMPETENCY SCORE UPDATE */}
              <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Real-Time Competency Update Triggered
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    Gap Shrinking!
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="font-bold text-white">Data Visualization Competency:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-400 line-through font-bold">38%</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                    <span className="text-2xl font-extrabold text-emerald-400">52%</span>
                  </div>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: '52%' }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 pt-1">
                  🎉 <strong>Outcome:</strong> Your status shifted from <span className="text-rose-400 font-bold">Critical Gap</span> to <span className="text-amber-400 font-bold">Developing</span>! Course recommendations are automatically re-ranking.
                </p>
              </div>

              {/* Navigation Back */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-md shadow-emerald-500/20"
                >
                  View Updated Dashboard & Gaps
                </button>
                <button
                  onClick={() => onNavigate('course_map')}
                  className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 text-xs"
                >
                  Return to Course Map
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
