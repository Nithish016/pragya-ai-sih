import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Map,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  ArrowRight,
  Crown,
  Gamepad2,
  Video,
  FileText,
  Brain,
  X,
  BookOpen
} from 'lucide-react';

interface CourseMapPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CourseMapPage: React.FC<CourseMapPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  const world1Nodes = [
    {
      id: 'top_viz_1',
      title: 'Principles of Data Visualization for National Reports',
      competency: 'Data Visualization',
      level: 1,
      status: 'AVAILABLE',
      xpReward: 100,
      coinsReward: 30,
      type: 'standard',
      description: 'Master Cleveland & McGill perception hierarchy and zero-baseline standards for official statistical bulletins.'
    },
    {
      id: 'top_viz_2',
      title: 'Designing Accessible Statistical Dashboards',
      competency: 'Data Visualization',
      level: 2,
      status: 'AVAILABLE',
      xpReward: 120,
      coinsReward: 35,
      type: 'standard',
      description: 'Color-safe palettes for government dashboards and visual accessibility compliance.'
    },
    {
      id: 'top_viz_game',
      title: 'Checkpoint: The Perception Maze Game',
      competency: 'Data Visualization',
      level: 2,
      status: 'AVAILABLE',
      xpReward: 150,
      coinsReward: 50,
      type: 'mini_game',
      description: 'Educational sprint testing chart selection under high-pressure timer conditions.'
    },
    {
      id: 'top_viz_3',
      title: 'Interactive Statistical Geospatial Visualizations',
      competency: 'Data Visualization',
      level: 3,
      status: 'LOCKED',
      xpReward: 140,
      coinsReward: 40,
      type: 'standard',
      description: 'District and state-level choropleth projection guidelines and MoSPI boundary standards.'
    },
    {
      id: 'top_viz_boss',
      title: 'World 1 Boss Challenge: MoSPI Chief Evaluator Gauntlet',
      competency: 'Data Visualization & Reporting',
      level: 3,
      status: 'BOSS',
      xpReward: 300,
      coinsReward: 100,
      type: 'boss',
      description: 'End-of-World comprehensive gauntlet. Must score 80%+ to unlock World 2 certification badge!'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Map className="h-4 w-4" />
            <span>Official Civil Service Learning Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] mt-1">
            Learn Hub: Gamified Course Map
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Official accredited path: <strong className="text-slate-900">Data Visualization for Statistical Analysis</strong> (NSSTA / MoSPI)
          </p>
        </div>

        {/* World Switcher Tabs */}
        <div className="flex items-center gap-2">
          <button className="rounded-xl bg-[#0F2942] text-white font-bold px-3.5 py-1.5 text-xs shadow-xs">
            World 1: Visual Analytics
          </button>
          <button className="rounded-xl border border-slate-200 bg-white text-slate-400 px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-not-allowed opacity-70">
            <Lock className="h-3 w-3" />
            <span>World 2: Survey Sampling</span>
          </button>
          <button className="rounded-xl border border-slate-200 bg-white text-slate-400 px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-not-allowed opacity-70">
            <Lock className="h-3 w-3" />
            <span>World 3: Dissemination</span>
          </button>
        </div>
      </div>

      {/* World 1 Map Canvas */}
      <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-blue-50/30 p-6 sm:p-12 overflow-hidden shadow-xs">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0F2942_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto py-8">
          {/* S-curve Journey Node Path */}
          <div className="space-y-12 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:bg-gradient-to-b before:from-[#0F2942] before:via-blue-400 before:to-slate-300 before:z-0">
            {world1Nodes.map((node, index) => {
              const isEven = index % 2 === 0;
              const isBoss = node.type === 'boss';
              const isMiniGame = node.type === 'mini_game';
              const isAvailable = node.status === 'AVAILABLE';
              const isLocked = node.status === 'LOCKED';

              return (
                <div
                  key={node.id}
                  className={`relative z-10 flex items-center ${
                    isEven ? 'flex-row' : 'flex-row-reverse'
                  } gap-6 md:gap-12`}
                >
                  {/* Left/Right Text Card */}
                  <div
                    onClick={() => setSelectedTopic(node)}
                    className={`w-1/2 cursor-pointer rounded-2xl border p-4 transition-all duration-300 hover:scale-102 ${
                      isBoss
                        ? 'border-yellow-400/80 bg-amber-50/90 shadow-md'
                        : isAvailable
                        ? 'border-blue-200 bg-white hover:border-[#0F2942] shadow-xs'
                        : 'border-slate-200 bg-slate-100/70 opacity-60'
                    } ${isEven ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-1 justify-end">
                      {isBoss ? (
                        <span className="text-amber-700 flex items-center gap-1">
                          <Crown className="h-3 w-3" /> World Boss Gate
                        </span>
                      ) : isMiniGame ? (
                        <span className="text-blue-700 flex items-center gap-1">
                          <Gamepad2 className="h-3 w-3" /> Educational Checkpoint Game
                        </span>
                      ) : (
                        <span>Stage {index + 1} • {node.competency}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#0F2942] leading-snug">{node.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium justify-end">
                      <span className="text-orange-700 font-bold">+{node.xpReward} XP</span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">+{node.coinsReward} Karma Pts</span>
                    </div>
                  </div>

                  {/* Center Node Button */}
                  <button
                    onClick={() => setSelectedTopic(node)}
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-4 transition-all duration-300 hover:scale-110 active:scale-95 ${
                      isBoss
                        ? 'bg-amber-500 text-white ring-amber-300 shadow-md'
                        : isMiniGame
                        ? 'bg-[#FF9933] text-[#0F2942] ring-orange-200 shadow-md font-bold'
                        : isAvailable
                        ? 'bg-[#0F2942] text-white ring-blue-200 shadow-md'
                        : 'bg-slate-200 text-slate-400 ring-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {isBoss ? (
                      <Crown className="h-6 w-6" />
                    ) : isMiniGame ? (
                      <Gamepad2 className="h-6 w-6" />
                    ) : isAvailable ? (
                      <Play className="h-6 w-6 fill-white translate-x-0.5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}

                    {isAvailable && !isBoss && (
                      <span className="absolute -inset-1 rounded-2xl bg-blue-400/20 animate-ping pointer-events-none" />
                    )}
                  </button>

                  <div className="w-1/2 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Detail Modal / Drawer */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase">
                <Sparkles className="h-4 w-4" />
                <span>{selectedTopic.competency}</span>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0F2942] font-['Space_Grotesk']">
                  {selectedTopic.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {selectedTopic.description}
                </p>
              </div>

              {/* 5-Mode Learning Formats */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-bold uppercase text-slate-500 mb-3">
                  5 Integrated Learning Modes:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span>HD Video Lecture</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>Official E-Book</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <FileText className="h-4 w-4 text-rose-600" />
                    <span>MoSPI Circular PDF</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Gamepad2 className="h-4 w-4 text-amber-600" />
                    <span>Knowledge Run Game</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium col-span-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span>Adaptive AI Quiz (Score Booster)</span>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                <span>Earn on Completion:</span>
                <div className="flex items-center gap-3">
                  <span className="text-orange-700 font-bold">+{selectedTopic.xpReward} XP</span>
                  <span className="text-amber-600 font-bold">+{selectedTopic.coinsReward} Karma Pts</span>
                </div>
              </div>

              {/* Launch Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    onNavigate('topic_learning', { topicId: selectedTopic.id });
                  }}
                  className="w-full rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] py-3 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Launch 5-Mode Learning Studio</span>
                  <ArrowRight className="h-4 w-4 text-[#FF9933]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
