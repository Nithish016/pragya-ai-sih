import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Edit3,
  Brain,
  Layers,
  ArrowRight,
  BarChart3,
  Eye,
  Check,
  X,
  BookOpen,
  Trash2,
  Plus
} from 'lucide-react';

interface TrainerDashboardProps {
  onNavigate: (page: string) => void;
  onOpenUploadModal?: () => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onNavigate, onOpenUploadModal }) => {
  const { user, triggerConfetti } = useAuth();

  // Document pipeline state
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadText, setUploadText] = useState('');
  const [uploadFilename, setUploadFilename] = useState('MoSPI_Survey_Methods_2026.pdf');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // AI Quiz Generator state
  const [selectedDocId, setSelectedDocId] = useState('mat_viz_guidelines');
  const [targetCompetency, setTargetCompetency] = useState('Data Visualization');
  const [questionCount, setQuestionCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any | null>(null);

  // Review states
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/trainer/materials');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadText.trim()) return;

    setIsUploading(true);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: uploadFilename,
          textContent: uploadText,
          fileType: 'pdf'
        })
      });

      if (res.ok) {
        setUploadSuccess(true);
        setUploadText('');
        fetchMaterials();
        triggerConfetti();
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setUploadText(text);
        } else {
          setUploadText(
            `OFFICIAL STATISTICAL GUIDELINES: ${file.name}\n` +
            `Training manual ingested into MoSPI Capacity Repository. Adherence to baseline standards and sampling frames is required.`
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this document from the vector store?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMaterials();
      }
    } catch (e) {
      console.error('Failed to delete document:', e);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/quizzes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocId,
          count: questionCount,
          difficulty,
          competency: targetCompetency
        })
      });

      if (res.ok) {
        const quizData = await res.json();
        setGeneratedQuiz(quizData);
        triggerConfetti();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReviewAction = async (questionId: string, action: 'approve' | 'reject' | 'regenerate') => {
    if (!generatedQuiz) return;

    try {
      const res = await fetch(`/api/trainer/quizzes/${generatedQuiz.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, questionId })
      });

      if (res.ok) {
        const updated = await res.json();
        setGeneratedQuiz(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishQuiz = async () => {
    if (!generatedQuiz) return;
    try {
      const res = await fetch(`/api/trainer/quizzes/${generatedQuiz.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: true })
      });
      if (res.ok) {
        const updated = await res.json();
        setGeneratedQuiz(updated);
        triggerConfetti();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Brain className="h-4 w-4" />
          <span>Faculty & Curriculum Designer Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
          Material Ingestion & AI Adaptive Quiz Generator
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Upload official MoSPI manuals (PDF/DOCX), ingest into semantic vector index, and generate curriculum-aligned adaptive quizzes with human-in-the-loop review.
        </p>
      </div>

      {/* Grid: Document Pipeline & AI Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Ingestion Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-[#0F2942] font-['Space_Grotesk']">
                1. Document Extraction & Vector Index
              </h2>
            </div>
            <span className="rounded bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 border border-blue-200">
              Vector Store
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Select a PDF document, paste guidelines, or write revision notes to process through the semantic chunking engine.
          </p>

          {/* Quick File Select Bar */}
          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
              <UploadCloud className="h-4 w-4 text-orange-600" />
              <span>Choose PDF / Text File to Load</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                onChange={handleFilePicked}
              />
            </label>

            {onOpenUploadModal && (
              <button
                type="button"
                onClick={onOpenUploadModal}
                className="px-3 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold transition-colors shrink-0"
              >
                Studio Upload
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Document Filename
              </label>
              <input
                type="text"
                value={uploadFilename}
                onChange={(e) => setUploadFilename(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Statistical Manual Content
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setUploadText(
                      `NATIONAL STATISTICAL ACADEMY - GUIDELINES ON CPI DATA VISUALIZATION\nIn compiling the Consumer Price Index (CPI), state-wise food and fuel sub-indices must be rendered using dual-axis charts with explicit zero-anchor baselines. Cleveland and McGill perceptual hierarchies indicate that readers misinterpret non-aligned bubble charts by up to 40% compared to position-encoded bar charts. All publications must maintain WCAG AA color accessibility.`
                    )
                  }
                  className="text-[10px] text-orange-700 hover:underline font-semibold"
                >
                  Insert Sample MoSPI Excerpt
                </button>
              </div>
              <textarea
                rows={4}
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                placeholder="Paste MoSPI manual, survey guidelines, or notes here..."
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              />
            </div>

            {uploadSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Document successfully chunked and indexed into vector repository!</span>
              </div>
            )}

            <button
              onClick={handleUploadDocument}
              disabled={isUploading || !uploadText.trim()}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isUploading || !uploadText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#0F2942] hover:bg-[#1E3A8A] text-white shadow-xs'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Chunking & Indexing Embeddings...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4 text-[#FF9933]" />
                  <span>Ingest & Index Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Quiz Generator Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <h2 className="text-base font-bold text-[#0F2942] font-['Space_Grotesk']">
                2. AI Question Synthesis (Gemini RAG)
              </h2>
            </div>
            <span className="rounded bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-bold px-2 py-0.5">
              Gemini Flash RAG
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Ground dynamic questions directly in your uploaded MoSPI documents with source citations.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Source Document
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0F2942]"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.chunks} Chunks)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Target Competency
                </label>
                <select
                  value={targetCompetency}
                  onChange={(e) => setTargetCompetency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Data Visualization">Data Visualization</option>
                  <option value="Statistical Inference">Statistical Inference</option>
                  <option value="Survey Methodology">Survey Methodology</option>
                  <option value="National Accounts">National Accounts</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Easy">Easy (Recall)</option>
                  <option value="Medium">Medium (Application)</option>
                  <option value="Hard">Hard (Analytical)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isGenerating
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#FF9933] hover:bg-orange-500 text-[#0F2942] shadow-xs'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Adaptive Items...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Adaptive Items</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ingested Documents & Notes Vector Inventory */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2942] font-['Space_Grotesk']">
                Active Vector Store Inventory ({documents.length} Items)
              </h2>
              <p className="text-xs text-slate-500">
                Official circulars, manuals, and trainer study notes indexed in ChromaDB for semantic search & RAG quiz generation.
              </p>
            </div>
          </div>
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add PDF / Notes</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Document Title / File</th>
                <th className="py-2.5 px-3">Target Domain</th>
                <th className="py-2.5 px-3 text-center">Vector Chunks</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.fileType === 'note'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {doc.fileType === 'note' ? <BookOpen className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {doc.fileType || 'PDF'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{doc.title || doc.filename}</div>
                    <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                      ID: {doc.id} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Active'}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold border border-slate-200">
                      {doc.category || doc.competency || 'Official Statistics'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                    {doc.chunkCount || doc.chunks || 4} chunks
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-[11px] transition-colors"
                        title="Use as source for AI Quiz Generation"
                      >
                        Select for RAG
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Document from Vector Store"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HITL Review Section */}
      {generatedQuiz && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase">
                <Edit3 className="h-4 w-4" />
                <span>Human-in-the-Loop Quality Review</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F2942] font-['Space_Grotesk'] mt-0.5">
                Review & Approve Generated Items
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePublishQuiz}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs shadow-xs"
              >
                <Check className="h-4 w-4" />
                <span>Publish to iGOT Learner Map</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {generatedQuiz.questions.map((q: any, idx: number) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F2942]">
                    Item #{idx + 1} • {q.difficulty}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      q.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : q.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-800">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt: string, optIdx: number) => (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border text-xs ${
                        optIdx === q.correctAnswer
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Source: <strong>{q.citation}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewAction(q.id, 'approve')}
                      className="rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1 text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction(q.id, 'reject')}
                      className="rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1 text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
