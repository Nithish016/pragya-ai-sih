import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Shield,
  FolderSync,
  Layers,
  Users,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, triggerConfetti } = useAuth();
  const [adminAnalytics, setAdminAnalytics] = useState<any | null>(null);
  const [igotCourses, setIgotCourses] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
    fetchIgotCourses();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAdminAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchIgotCourses = async () => {
    try {
      const res = await fetch('/api/igot/courses');
      if (res.ok) {
        const data = await res.json();
        setIgotCourses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncIgot = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/igot/sync', { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setSyncStatus(`Successfully synchronized ${result.coursesSynced} courses from iGOT Karmayogi Bharat!`);
        fetchIgotCourses();
        triggerConfetti();
        setTimeout(() => setSyncStatus(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Shield className="h-4 w-4" />
          <span>Pragya AI • Strategic Governance Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
          National Administrator & Capacity Intelligence Console
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Ministry-wide competency gap heatmaps, civil servant learning analytics, and external repository bidirectional synchronization.
        </p>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Active Civil Servants</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-[#0F2942] mt-2">
            {adminAnalytics?.totalCivilServants?.toLocaleString() || '1,420'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +18% growth this quarter
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Course Completions</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#0F2942] mt-2">
            {adminAnalytics?.completionsThisMonth?.toLocaleString() || '3,840'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 14 MoSPI divisions</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Avg Skill Gap Reduction</span>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-orange-600 mt-2">
            {adminAnalytics?.avgGapReduction || '24.6%'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Post-adaptive learning modules</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">iGOT Synchronized</span>
            <FolderSync className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">
            {igotCourses.length || 6} Courses
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            Live CBC Provider API
          </div>
        </div>
      </div>

      {/* Cadre Competency Gap Heatmap */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F2942] font-['Space_Grotesk']">
              Ministry-Wide Competency Gap Heatmap (FRAC Cadre Analysis)
            </h2>
            <p className="text-xs text-slate-600">
              Aggregated across 1,420 officers in Survey Design, Field Operations, and National Accounts.
            </p>
          </div>
          <span className="rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold px-3 py-1 border border-rose-200">
            Priority Action Required: 2 Critical
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {adminAnalytics?.cadreGaps?.map((gap: any, idx: number) => {
            const isCritical = gap.gapPercentage > 35;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F2942]">{gap.competency}</span>
                    {isCritical && (
                      <span className="rounded bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 border border-rose-200">
                        Critical Shortfall
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Target Cadre: <strong>{gap.cadre}</strong> ({gap.affectedOfficers} Officers)
                  </div>
                </div>

                <div className="sm:w-1/2 space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Average Proficiency: {gap.currentAvg}%</span>
                    <span>Role Benchmark: {gap.requiredScore}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCritical ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${gap.currentAvg}%` }}
                    />
                  </div>
                </div>

                <div className="sm:w-1/6 text-right">
                  <span className="text-xs font-bold text-rose-700 font-mono">
                    -{gap.gapPercentage}% Shortfall
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* iGOT Karmayogi Sync Console */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F2942] font-['Space_Grotesk']">
              iGOT Karmayogi External Sync Console (REST Integration)
            </h2>
            <p className="text-xs text-slate-600">
              Synchronize accredited civil service courses from CBC / iGOT portals into Pragya AI with one click.
            </p>
          </div>

          <button
            onClick={handleSyncIgot}
            disabled={isSyncing}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
              isSyncing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#FF9933] hover:bg-orange-500 text-[#0F2942]'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing iGOT Repositories...' : 'Synchronize iGOT Now'}</span>
          </button>
        </div>

        {/* Synced courses table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#0F2942] text-slate-200 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Course Code</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Provider Agency</th>
                <th className="px-5 py-3">Hours</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {igotCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-[#0F2942]">{c.id}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{c.title}</td>
                  <td className="px-5 py-3 text-slate-600">{c.provider}</td>
                  <td className="px-5 py-3">{c.durationHours} hrs</td>
                  <td className="px-5 py-3">
                    <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                      Synchronized
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
