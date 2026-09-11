import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { DailyNugget as DailyNuggetType } from '../types/index.js';
import {
  Sparkles,
  Brain,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Award,
  Flame,
  Check,
  Share2,
  Copy,
  Layers,
  GraduationCap,
  Clock,
  ChevronDown
} from 'lucide-react';

interface DailyNuggetProps {
  onNavigate: (page: string) => void;
  className?: string;
}

interface LearningPathTopic {
  id: string;
  title: string;
  courseTitle: string;
  competency: string;
}

export const DailyNugget: React.FC<DailyNuggetProps> = ({
  onNavigate,
  className = ''
}) => {
  const { profile, addXP, addCoins, triggerConfetti } = useAuth();

  const [nugget, setNugget] = useState<DailyNuggetType | null>(null);
  const [learningPathTopics, setLearningPathTopics] = useState<LearningPathTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Retention check state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      return localStorage.getItem(`pragya_nugget_completed_${today}`) === 'true';
    } catch {
      return false;
    }
  });

  // Audio speech synthesis state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showTopicSelector, setShowTopicSelector] = useState<boolean>(false);

  // Fetch daily nugget
  const fetchNugget = async (topicId?: string) => {
    try {
      if (topicId) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const url = topicId
        ? `/api/daily-nugget?topicId=${encodeURIComponent(topicId)}`
        : '/api/daily-nugget';

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch daily retention nugget');
      const data = await res.json();

      setNugget(data.nugget);
      if (data.learningPathTopics) {
        setLearningPathTopics(data.learningPathTopics);
      }

      // Reset interaction state for fresh nugget
      setSelectedOption(null);
      setIsAnswerSubmitted(false);

      // Cancel any ongoing speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to load Daily Nugget right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNugget();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Text-to-Speech (Audio Read Aloud)
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !nugget) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `Daily Retention Nugget for ${nugget.topicTitle}. Key concept: ${nugget.keyConcept}. Summary: ${nugget.summary}. Did you know? ${nugget.didYouKnow}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Handle Copy Snippet
  const handleCopy = () => {
    if (!nugget) return;
    const text = `💡 Pragya AI Daily Nugget: ${nugget.topicTitle}\n\n"${nugget.keyConcept}"\n\n${nugget.summary}\n\n📌 Did You Know: ${nugget.didYouKnow}\n\nSource: ${nugget.sourceReference}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Retention Micro-Quiz Answer
  const handleSelectOption = async (index: number) => {
    if (isAnswerSubmitted || !nugget) return;

    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    const isCorrect = index === nugget.retentionQuiz.correctIndex;

    const today = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`pragya_nugget_completed_${today}`, 'true');
    } catch (e) {
      // ignore
    }
    setIsCompletedToday(true);

    if (isCorrect) {
      triggerConfetti();
      addXP(25, 'Daily Retention Check Passed');
      addCoins(10);
    } else {
      addXP(15, 'Daily Retention Check Attempted');
      addCoins(5);
    }

    // Persist to server
    try {
      await fetch('/api/daily-nugget/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nuggetId: nugget.id,
          topicId: nugget.topicId,
          wasCorrect: isCorrect,
          answerIndex: index
        })
      });
    } catch (e) {
      console.warn('Could not sync nugget completion to server', e);
    }
  };

  if (loading) {
    return (
      <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4 animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-200 rounded-full" />
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
        <div className="h-20 bg-slate-100 rounded-2xl" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (error || !nugget) {
    return (
      <div className={`rounded-3xl border border-amber-200 bg-amber-50/70 p-6 shadow-xs flex items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F2942]">Daily Retention Nugget</h4>
            <p className="text-xs text-slate-600">Explore core principles from your current learning path to build daily retention.</p>
          </div>
        </div>
        <button
          onClick={() => fetchNugget()}
          className="rounded-xl bg-[#0F2942] text-white text-xs font-bold px-4 py-2 hover:bg-[#1E3A8A] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id="daily-nugget-card"
      className={`rounded-3xl border-2 border-[#FF9933]/30 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden transition-all ${className}`}
    >
      {/* Decorative Tricolor Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Top Header & Context Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/90 text-[#0F2942] text-xs font-black px-3 py-1 border border-orange-300">
              <Sparkles className="h-3.5 w-3.5 text-[#FF9933] animate-spin" />
              <span>Daily Nugget</span>
            </span>

            <span className="rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold px-2.5 py-0.5 border border-blue-200">
              {nugget.competency}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{nugget.readTimeSeconds || 45}s micro-read</span>
            </span>

            {isCompletedToday && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300">
                <Check className="h-3 w-3" />
                <span>Reviewed Today (+25 XP)</span>
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Learning Path:</span>
            <strong className="text-slate-800 font-semibold">{nugget.courseTitle}</strong>
          </div>
        </div>

        {/* Action Controls: Audio, Shuffle, Copy */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleSpeech}
            title={isSpeaking ? 'Stop listening' : 'Listen to summary (Read Aloud)'}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-200 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4 text-rose-600" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy key insight"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="hidden sm:inline text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Shuffle / Next Topic from Current Learning Path */}
          <button
            type="button"
            onClick={() => fetchNugget()}
            disabled={refreshing}
            title="Get a random topic from your current learning path"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300 hover:text-[#0F2942] text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-[#FF9933] ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Shuffle Topic</span>
          </button>

          {/* Learning Path Topic Selector Toggle */}
          {learningPathTopics.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTopicSelector(!showTopicSelector)}
                title="Select a specific topic from your path"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Layers className="h-4 w-4 text-slate-600" />
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showTopicSelector && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-2.5 z-30 space-y-1">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Topics in Current Learning Path
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {learningPathTopics.map((top) => (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => {
                          setShowTopicSelector(false);
                          fetchNugget(top.id);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex flex-col gap-0.5 ${
                          top.id === nugget.topicId
                            ? 'bg-orange-50 text-[#0F2942] font-bold border border-orange-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{top.title}</span>
                        <span className="text-[10px] text-slate-400 truncate">{top.competency}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Topic Header & Key Concept */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-700 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span>Spaced Repetition Concept</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] leading-tight">
            {nugget.topicTitle}
          </h3>
        </div>

        {/* Golden Rule / Big Idea Quote Box */}
        <div className="rounded-2xl bg-white border border-amber-200/90 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-2 right-3 text-4xl font-serif text-amber-200/50 select-none pointer-events-none">
            “
          </div>
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Core Golden Rule</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-[#0F2942] leading-snug">
            {nugget.keyConcept}
          </p>
        </div>

        {/* AI-Generated Retention Summary */}
        <div className="text-sm text-slate-700 leading-relaxed space-y-2">
          <p>{nugget.summary}</p>
        </div>
      </div>

      {/* Two-Column Insight Cards: Did You Know & Real-World Application */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Did You Know? */}
        <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Lightbulb className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Did You Know? • Rule of Thumb</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            {nugget.didYouKnow}
          </p>
        </div>

        {/* Practical Field Example */}
        <div className="rounded-2xl bg-blue-50/80 border border-blue-200/80 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Award className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Civil Service & Student Field Application</span>
          </div>
          <p className="text-xs text-blue-950 leading-relaxed font-medium">
            {nugget.practicalExample}
          </p>
        </div>
      </div>

      {/* 1-Question Micro Retention Check (Lock It In!) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F2942]">Quick Retention Check</div>
              <div className="text-[11px] text-slate-500">Tap the best answer to reinforce memory & earn XP</div>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 border border-amber-200">
            +25 XP • +10 Coins
          </span>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-slate-800 pt-1">
          {nugget.retentionQuiz.question}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {nugget.retentionQuiz.options.map((option, idx) => {
            let optionStyles = 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700';

            if (isAnswerSubmitted) {
              if (idx === nugget.retentionQuiz.correctIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400';
              } else if (idx === selectedOption) {
                optionStyles = 'border-rose-300 bg-rose-50 text-rose-950';
              } else {
                optionStyles = 'border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${optionStyles}`}
              >
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  isAnswerSubmitted && idx === nugget.retentionQuiz.correctIndex
                    ? 'bg-emerald-600 text-white'
                    : isAnswerSubmitted && idx === selectedOption
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
                {isAnswerSubmitted && idx === nugget.retentionQuiz.correctIndex && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && idx === selectedOption && idx !== nugget.retentionQuiz.correctIndex && (
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Post-Answer */}
        {isAnswerSubmitted && (
          <div className={`p-3 rounded-xl text-xs space-y-1 ${
            selectedOption === nugget.retentionQuiz.correctIndex
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {selectedOption === nugget.retentionQuiz.correctIndex ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Correct! Memory reinforced (+25 XP)</span>
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  <span>Good review attempt (+15 XP)</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed pl-5">
              {nugget.retentionQuiz.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation & Citation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
          <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Reference: <strong>{nugget.sourceReference}</strong></span>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('course_map')}
            className="text-slate-600 hover:text-[#0F2942] font-bold transition-colors"
          >
            Course Map
          </button>

          <button
            type="button"
            onClick={() => onNavigate('topic_learning')}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold px-4 py-2 shadow-xs transition-all hover:scale-105"
          >
            <span>Deep Dive in Module</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#FF9933]" />
          </button>
        </div>
      </div>
    </div>
  );
};
