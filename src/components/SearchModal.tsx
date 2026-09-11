import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Layers, Sparkles, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (courseId: string) => void;
  onSelectTopic: (topicId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  onSelectTopic
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    courses: any[];
    topics: any[];
    semanticMaterials: any[];
  }>({ courses: [], topics: [], semanticMaterials: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ courses: [], topics: [], semanticMaterials: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search statistical courses, survey methods, cognitive charts, ChromaDB chunks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
              Querying ChromaDB vector representations & course database...
            </div>
          )}

          {!loading && query && results.courses.length === 0 && results.topics.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No direct matches found for "{query}". Try "sampling", "visualization", or "inference".
            </div>
          )}

          {/* Courses */}
          {results.courses.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Courses ({results.courses.length})
              </div>
              <div className="space-y-1.5">
                {results.courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      onSelectCourse(course.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-800/60 hover:bg-slate-800 p-3 text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{course.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{course.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {results.topics.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Topics & Modules ({results.topics.length})
              </div>
              <div className="space-y-1.5">
                {results.topics.map((t) => (
                  <button
                    key={t.topic.id}
                    onClick={() => {
                      onSelectTopic(t.topic.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-800/60 hover:bg-slate-800 p-3 text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{t.topic.title}</div>
                      <div className="text-[10px] text-emerald-400">{t.courseTitle} • {t.topic.competency}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Semantic ChromaDB Chunks */}
          {results.semanticMaterials.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2">
                <Sparkles className="h-3 w-3" />
                <span>ChromaDB Vector Retrieval ({results.semanticMaterials.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.semanticMaterials.map((m, i) => (
                  <div key={i} className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-3 text-left text-xs">
                    <div className="flex justify-between items-center text-[10px] text-purple-300 font-semibold mb-1">
                      <span>{m.filename || 'Indexed Material'}</span>
                      <span className="rounded bg-purple-900/60 px-1.5 py-0.5">{m.score}% Similarity</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
