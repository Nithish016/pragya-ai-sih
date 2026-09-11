import React, { useState, useEffect } from 'react';
import { CourseRecommendation } from '../types/index.js';
import {
  Sparkles,
  ArrowRight,
  Video,
  FileText,
  Gamepad2,
  Brain,
  Info,
  ChevronDown,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface RecommendationsPageProps {
  onNavigate: (page: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onNavigate }) => {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/recommendations')
      .then((res) => res.json())
      .then((data) => setRecommendations(data))
      .catch((e) => console.error(e));
  }, []);

  const categories = [
    'All',
    'Close Your Skill Gaps',
    'Based on Your Education',
    'Based on Your Interests',
    'Based on Your Role',
    'Popular Among Your Peers',
    'Recently Added Courses',
    'Trending in Your Organization',
    'Next Best Course',
    'iGOT Recommended Courses'
  ];

  const filtered = recommendations.filter((r) => {
    if (activeCategory === 'All') return true;
    return r.recommendationCategory === activeCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Machine Learning Recommendations • 9 Dimensions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
          Curated Course Catalog
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Courses algorithmically curated across all 9 personalized dimensions, prioritizing closing your immediate MoSPI competency gaps.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((rec) => {
          const isExpanded = expandedId === rec.courseId;

          return (
            <div
              key={rec.courseId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-[#0F2942] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-full bg-orange-100 border border-orange-200 px-2.5 py-0.5 text-xs font-extrabold text-orange-900 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-orange-600" />
                    {rec.matchScore}% Match
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {rec.difficulty} • {rec.durationHours}h
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F2942] mt-2 leading-snug">
                  {rec.courseTitle}
                </h3>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {rec.category} {rec.isIgot && '• iGOT Karmayogi Sync'}
                </div>

                {/* Score breakdown metrics */}
                <div className="mt-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-2">
                    <span>Algorithm Fit Weights:</span>
                    <span className="text-orange-700">{rec.matchScore}/100</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500">
                    <div>
                      <div>Gap Weight</div>
                      <div className="font-bold text-[#0F2942]">{rec.matchBreakdown.competencyGapMatch} pts</div>
                    </div>
                    <div>
                      <div>Role Fit</div>
                      <div className="font-bold text-[#0F2942]">{rec.matchBreakdown.roleMatch} pts</div>
                    </div>
                    <div>
                      <div>Education</div>
                      <div className="font-bold text-[#0F2942]">{rec.matchBreakdown.educationMatch} pts</div>
                    </div>
                  </div>
                </div>

                {/* Why This Course Accordion */}
                <div className="mt-3">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.courseId)}
                    className="flex items-center justify-between w-full text-left text-xs font-semibold text-orange-700 hover:text-orange-900"
                  >
                    <span className="flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      Why this course?
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 rounded-xl border border-orange-200 bg-orange-50/50 p-3 text-[11px] text-slate-700">
                      {rec.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                  {rec.recommendationCategory}
                </span>
                <button
                  onClick={() => onNavigate('topic_learning')}
                  className="rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold px-3.5 py-1.5 text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Start Course</span>
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
