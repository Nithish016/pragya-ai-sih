import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  Map,
  Compass,
  Sparkles,
  Gamepad2,
  Brain,
  Trophy,
  Award,
  BookOpen,
  UploadCloud,
  FileCheck2,
  BarChart3,
  Users,
  Layers,
  Settings,
  Flame,
  CheckCircle2,
  TrendingUp,
  FolderSync,
  GraduationCap,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { role, profile } = useAuth();

  const learnerNav = [
    { id: 'dashboard', label: 'Officer Dashboard', icon: LayoutDashboard, badge: 'Home' },
    { id: 'course_map', label: 'Learn Hub (Course Map)', icon: Map, badge: 'World 1' },
    { id: 'topic_learning', label: '5-Mode Learning Studio', icon: BookOpen },
    { id: 'competencies', label: 'Competency Gaps (FRAC)', icon: TrendingUp, badge: '2 Gaps' },
    { id: 'recommendations', label: '12-Factor Recommendations', icon: Sparkles, badge: '94% Top' },
    { id: 'games', label: 'Knowledge Run (Game)', icon: Gamepad2, badge: 'Play' },
    { id: 'quizzes', label: 'Adaptive AI Quizzes', icon: Brain, badge: 'Live' },
    { id: 'leaderboard', label: 'National Standings & Map', icon: Trophy, badge: '#3' },
    { id: 'achievements', label: 'Badges & Certificates', icon: Award, badge: '7 Badges' },
    { id: 'onboarding', label: 'Cadre Profile Settings', icon: Settings }
  ];

  const trainerNav = [
    { id: 'trainer', label: 'Trainer Command Center', icon: LayoutDashboard },
    { id: 'trainer_materials', label: 'PDF Document Ingestion', icon: UploadCloud, badge: 'ChromaDB' },
    { id: 'trainer_quizzes', label: 'AI Quiz Review (HITL)', icon: FileCheck2, badge: 'Review' },
    { id: 'trainer_analytics', label: 'Cadre Assessment Metrics', icon: BarChart3 },
    { id: 'dashboard', label: 'Switch to Learner View', icon: BookOpen }
  ];

  const adminNav = [
    { id: 'admin', label: 'Admin Command Center', icon: LayoutDashboard },
    { id: 'admin_competencies', label: 'Ministry Gap Heatmap', icon: Layers, badge: 'Critical' },
    { id: 'admin_users', label: 'Cadre Directory & Roles', icon: Users },
    { id: 'admin_igot', label: 'National Repository Sync', icon: FolderSync, badge: 'REST Active' },
    { id: 'dashboard', label: 'Switch to Learner View', icon: BookOpen }
  ];

  const items = role === 'learner' ? learnerNav : role === 'trainer' ? trainerNav : adminNav;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden lg:flex select-none">
      <div className="space-y-5">
        {/* Active Cadre Banner */}
        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600">
              Active Portal Role
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                role === 'learner'
                  ? 'bg-blue-100 text-blue-800'
                  : role === 'trainer'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {role}
            </span>
          </div>
          <div className="mt-1.5 text-xs font-bold text-[#0F2942]">
            {role === 'learner' && 'Officer Capacity Journey'}
            {role === 'trainer' && 'NSSTA Curriculum Engineering'}
            {role === 'admin' && 'National Governance & Telemetry'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            MoSPI • Pragya AI Node
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              currentPage === item.id ||
              (item.id === 'games' && currentPage === 'topic_learning') ||
              (item.id === 'quizzes' && currentPage === 'topic_learning');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${active ? 'text-[#FF9933]' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      active
                        ? 'bg-[#FF9933] text-[#0F2942]'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cadre Benchmark Footer Box */}
      <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2942]">
          <GraduationCap className="h-4 w-4 text-orange-600" />
          <span>MoSPI Target Role</span>
        </div>
        <div className="text-[11px] text-slate-600 font-medium">
          Junior Statistical Officer (JSO) / Senior Statistical Officer (SSO)
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
          <span>FRAC Alignment</span>
          <span className="text-emerald-700 font-bold">Level 3 • Verified</span>
        </div>
      </div>
    </aside>
  );
};
