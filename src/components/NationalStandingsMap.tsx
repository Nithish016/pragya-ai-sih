import React, { useState } from 'react';
import { Trophy, Award, MapPin, Search, ChevronDown, CheckCircle2, TrendingUp, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { INDIA_STATE_PATHS, INDIA_MAP_VIEWBOX } from '../data/indiaMapData.js';

export interface StateData {
  id: string;
  name: string;
  score: number;
  color: string;
  officersTrained: number;
  completionRate: number;
  leadMinistry: string;
}

export interface MinistryData {
  rank: number;
  name: string;
  score: number;
  officersTrained: number;
  completionRate: number;
  badgeColor: string;
}

export const STATES_PERFORMANCE_DATA: StateData[] = [
  { id: 'rj', name: 'Rajasthan', score: 62.49, color: '#166534', officersTrained: 48200, completionRate: 84.5, leadMinistry: 'Revenue & Statistics' },
  { id: 'up', name: 'Uttar Pradesh', score: 61.73, color: '#15803d', officersTrained: 92400, completionRate: 83.1, leadMinistry: 'Planning & Administration' },
  { id: 'mp', name: 'Madhya Pradesh', score: 60.45, color: '#15803d', officersTrained: 56100, completionRate: 81.8, leadMinistry: 'Rural Development' },
  { id: 'pb', name: 'Punjab', score: 51.56, color: '#16a34a', officersTrained: 21800, completionRate: 77.2, leadMinistry: 'Finance & Accounts' },
  { id: 'gj', name: 'Gujarat', score: 51.18, color: '#16a34a', officersTrained: 44300, completionRate: 76.9, leadMinistry: 'Commerce & Industry' },
  { id: 'hr', name: 'Haryana', score: 40.06, color: '#65a30d', officersTrained: 24600, completionRate: 71.4, leadMinistry: 'E-Governance & IT' },
  { id: 'ka', name: 'Karnataka', score: 40.47, color: '#84cc16', officersTrained: 51200, completionRate: 72.0, leadMinistry: 'Statistical Bureau' },
  { id: 'tg', name: 'Telangana', score: 40.41, color: '#84cc16', officersTrained: 33800, completionRate: 71.9, leadMinistry: 'General Admin' },
  { id: 'mh', name: 'Maharashtra', score: 40.19, color: '#84cc16', officersTrained: 76400, completionRate: 71.8, leadMinistry: 'Finance & Planning' },
  { id: 'dl', name: 'Delhi', score: 45.20, color: '#84cc16', officersTrained: 28400, completionRate: 74.2, leadMinistry: 'Civil Services Academy' },
  { id: 'ch', name: 'Chandigarh', score: 42.10, color: '#84cc16', officersTrained: 5100, completionRate: 73.0, leadMinistry: 'Cadre Coordination' },
  { id: 'ar', name: 'Arunachal Pradesh', score: 37.29, color: '#a3e635', officersTrained: 6800, completionRate: 69.1, leadMinistry: 'Border Affairs' },
  { id: 'sk', name: 'Sikkim', score: 35.10, color: '#a3e635', officersTrained: 4200, completionRate: 68.5, leadMinistry: 'Development Planning' },
  { id: 'ut', name: 'Uttarakhand', score: 34.49, color: '#a3e635', officersTrained: 13200, completionRate: 68.2, leadMinistry: 'Personnel & Training' },
  { id: 'hp', name: 'Himachal Pradesh', score: 32.89, color: '#a3e635', officersTrained: 11400, completionRate: 66.5, leadMinistry: 'Forest & Environment' },
  { id: 'ml', name: 'Meghalaya', score: 32.40, color: '#ca8a04', officersTrained: 5600, completionRate: 65.8, leadMinistry: 'Statistical Directorate' },
  { id: 'mz', name: 'Mizoram', score: 31.62, color: '#ca8a04', officersTrained: 5200, completionRate: 65.4, leadMinistry: 'Health & Welfare' },
  { id: 'mn', name: 'Manipur', score: 31.50, color: '#ca8a04', officersTrained: 5900, completionRate: 65.1, leadMinistry: 'Education' },
  { id: 'ct', name: 'Chhattisgarh', score: 30.79, color: '#ca8a04', officersTrained: 22400, completionRate: 64.8, leadMinistry: 'Tribal Affairs' },
  { id: 'or', name: 'Odisha', score: 30.47, color: '#ca8a04', officersTrained: 34100, completionRate: 64.5, leadMinistry: 'Disaster Management' },
  { id: 'tr', name: 'Tripura', score: 30.36, color: '#ca8a04', officersTrained: 4800, completionRate: 64.2, leadMinistry: 'Rural Livelihoods' },
  { id: 'as', name: 'Assam', score: 30.24, color: '#ca8a04', officersTrained: 28900, completionRate: 64.0, leadMinistry: 'Water Resources' },
  { id: 'an', name: 'Andaman & Nicobar Islands', score: 30.19, color: '#ca8a04', officersTrained: 2900, completionRate: 63.9, leadMinistry: 'Island Development' },
  { id: 'dn', name: 'Dadra and Nagar Haveli', score: 29.10, color: '#d97706', officersTrained: 2100, completionRate: 62.8, leadMinistry: 'Industrial Liaison' },
  { id: 'ld', name: 'Lakshadweep', score: 28.50, color: '#d97706', officersTrained: 1800, completionRate: 62.4, leadMinistry: 'Maritime Affairs' },
  { id: 'dd', name: 'Daman and Diu', score: 27.40, color: '#d97706', officersTrained: 1950, completionRate: 61.9, leadMinistry: 'Fiscal Planning' },
  { id: 'py', name: 'Puducherry', score: 25.80, color: '#d97706', officersTrained: 3200, completionRate: 61.2, leadMinistry: 'Administrative Reform' },
  { id: 'ap', name: 'Andhra Pradesh', score: 21.74, color: '#d97706', officersTrained: 38700, completionRate: 59.2, leadMinistry: 'Real-time Governance' },
  { id: 'jh', name: 'Jharkhand', score: 13.94, color: '#ea580c', officersTrained: 19800, completionRate: 52.4, leadMinistry: 'Mines & Geology' },
  { id: 'tn', name: 'Tamil Nadu', score: 11.48, color: '#ea580c', officersTrained: 54100, completionRate: 49.8, leadMinistry: 'Statistical Surveys' },
  { id: 'nl', name: 'Nagaland', score: 10.77, color: '#ea580c', officersTrained: 4100, completionRate: 48.7, leadMinistry: 'Personnel' },
  { id: 'br', name: 'Bihar', score: 10.10, color: '#ea580c', officersTrained: 42500, completionRate: 47.9, leadMinistry: 'General Admin' },
  { id: 'kl', name: 'Kerala', score: 10.09, color: '#ea580c', officersTrained: 29800, completionRate: 47.8, leadMinistry: 'Decentralized Planning' },
  { id: 'ga', name: 'Goa', score: 0.40, color: '#f97316', officersTrained: 3400, completionRate: 38.2, leadMinistry: 'Tourism & Admin' },
  { id: 'wb', name: 'West Bengal', score: 0.27, color: '#f97316', officersTrained: 39100, completionRate: 36.5, leadMinistry: 'Statistics & Programme' },
  { id: 'jk', name: 'Ladakh / Jammu & Kashmir', score: 0.22, color: '#f97316', officersTrained: 12100, completionRate: 35.8, leadMinistry: 'Cadre Administration' }
];

export const MINISTRIES_DATA: MinistryData[] = [
  { rank: 1, name: 'Ministry of Coal', score: 88.4, officersTrained: 18450, completionRate: 91.2, badgeColor: '#EAB308' },
  { rank: 2, name: 'Dept. of Food and Public Distribution', score: 84.1, officersTrained: 14200, completionRate: 87.5, badgeColor: '#F59E0B' },
  { rank: 3, name: 'Ministry of Mines', score: 81.6, officersTrained: 11890, completionRate: 85.3, badgeColor: '#EA580C' },
  { rank: 4, name: 'Ministry of Statistics & Programme Implementation (MoSPI)', score: 79.2, officersTrained: 8940, completionRate: 82.6, badgeColor: '#3B82F6' },
  { rank: 5, name: 'Ministry of Railways', score: 76.5, officersTrained: 34800, completionRate: 80.1, badgeColor: '#6366F1' },
  { rank: 6, name: 'Ministry of Housing and Urban Affairs (MoHUA)', score: 74.8, officersTrained: 16700, completionRate: 78.4, badgeColor: '#10B981' },
  { rank: 7, name: 'Ministry of Health and Family Welfare', score: 72.3, officersTrained: 22100, completionRate: 76.8, badgeColor: '#EC4899' },
  { rank: 8, name: 'Ministry of Finance & Revenue', score: 71.0, officersTrained: 29400, completionRate: 75.2, badgeColor: '#8B5CF6' }
];

export const NationalStandingsMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'states' | 'ministries'>('both');
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(
    STATES_PERFORMANCE_DATA.find((s) => s.id === 'rj') || STATES_PERFORMANCE_DATA[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const getStateDataById = (id: string): StateData | undefined => {
    return STATES_PERFORMANCE_DATA.find((s) => s.id.toLowerCase() === id.toLowerCase());
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const filteredStates = STATES_PERFORMANCE_DATA.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Top Pill Tabs matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'states' ? 'both' : 'states')}
            className={`rounded-2xl px-6 py-2.5 text-sm font-bold tracking-tight transition-all shadow-xs ${
              activeTab === 'states' || activeTab === 'both'
                ? 'bg-[#BCE0FD] text-slate-900 ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            States and Union Territories
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'ministries' ? 'both' : 'ministries')}
            className={`rounded-2xl px-6 py-2.5 text-sm font-bold tracking-tight transition-all shadow-xs ${
              activeTab === 'ministries' || activeTab === 'both'
                ? 'bg-[#BCE0FD] text-slate-900 ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Union Ministries and Departments
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          National Civil Services Capacity Index • Pragya AI Live Feed
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className={`grid grid-cols-1 ${activeTab === 'both' ? 'lg:grid-cols-12' : ''} gap-8 items-start`}>
          {/* LEFT: India Map (States and UTs) */}
          {(activeTab === 'both' || activeTab === 'states') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-7' : 'w-full'} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0F2942] font-['Space_Grotesk']">
                    States and Union Territories Performance Map
                  </h3>
                  <p className="text-xs text-slate-500">
                    Geographic distribution of capacity index scores across India. Click any state for details.
                  </p>
                </div>

                {/* State Quick Search & Select */}
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Find state/UT..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 w-36 sm:w-44 text-slate-800"
                    />
                  </div>

                  {searchQuery && filteredStates.length > 0 && (
                    <div className="absolute top-10 right-0 z-30 w-56 max-h-48 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 p-1 divide-y divide-slate-50 text-xs">
                      {filteredStates.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            setSelectedState(st);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg flex items-center justify-between"
                        >
                          <span className="font-semibold text-slate-800">{st.name}</span>
                          <span className="font-mono text-emerald-700 font-bold">{st.score}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={handleZoomIn}
                      className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    {zoomLevel !== 1 && (
                      <button
                        onClick={handleResetZoom}
                        className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
                        title="Reset View"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Canvas with Authentic SVG Boundaries and Legend */}
              <div className="relative w-full h-[540px] sm:h-[600px] bg-[#F8FAFC] rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200/80 p-2">
                {/* SVG India Map Graphic with Authentic Coordinates and Real Geometry */}
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <svg
                    viewBox={INDIA_MAP_VIEWBOX}
                    className="w-full h-full max-h-[580px] select-none"
                    style={{ filter: 'drop-shadow(0 4px 14px rgba(15, 41, 66, 0.08))' }}
                  >
                    <defs>
                      <filter id="mapShadow" x="-5%" y="-5%" width="110%" height="110%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F2942" floodOpacity="0.12" />
                      </filter>
                    </defs>

                    {/* Authentic Cartographic State Paths of India */}
                    <g filter="url(#mapShadow)">
                      {INDIA_STATE_PATHS.map((loc) => {
                        const st = getStateDataById(loc.id);
                        const isSelected = selectedState?.id.toLowerCase() === loc.id.toLowerCase();
                        const isHovered = hoveredState?.id.toLowerCase() === loc.id.toLowerCase();
                        const fillColor = st ? st.color : '#cbd5e1';

                        return (
                          <path
                            key={loc.id}
                            id={`india-state-${loc.id}`}
                            d={loc.path}
                            fill={fillColor}
                            stroke={isSelected ? '#0F2942' : isHovered ? '#FFFFFF' : '#FFFFFF'}
                            strokeWidth={isSelected ? 2.6 : isHovered ? 2 : 0.85}
                            strokeLinejoin="round"
                            className="cursor-pointer transition-all duration-150"
                            style={{
                              opacity: hoveredState && !isHovered ? 0.88 : 1,
                              transformOrigin: `${loc.labelX}px ${loc.labelY}px`
                            }}
                            onMouseEnter={() => st && setHoveredState(st)}
                            onMouseLeave={() => setHoveredState(null)}
                            onClick={() => st && setSelectedState(st)}
                          />
                        );
                      })}
                    </g>

                    {/* Number Labels Placed Directly on States as in Official Benchmark (Screenshot 1) */}
                    <g className="pointer-events-none">
                      {INDIA_STATE_PATHS.map((loc) => {
                        const st = getStateDataById(loc.id);
                        if (!st) return null;

                        const isSelected = selectedState?.id.toLowerCase() === loc.id.toLowerCase();
                        const isHovered = hoveredState?.id.toLowerCase() === loc.id.toLowerCase();

                        // Omit numbers for tiny territories when zoomed out to prevent crowding
                        const isTinyTerritory = ['ch', 'dl', 'dd', 'dn', 'ga', 'py'].includes(loc.id);
                        if (isTinyTerritory && zoomLevel <= 1 && !isSelected && !isHovered) {
                          return null;
                        }

                        return (
                          <g
                            key={`state-label-${loc.id}`}
                            transform={`translate(${loc.labelX}, ${loc.labelY})`}
                          >
                            {/* Outline/Stroke for extreme contrast across all color ranges */}
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#0F2942"
                              stroke="#0F2942"
                              strokeWidth="2.8"
                              strokeLinejoin="round"
                              fontSize={isSelected || isHovered ? '13' : '10.5'}
                              fontWeight="900"
                              fontFamily="system-ui, -apple-system, sans-serif"
                              opacity="0.8"
                            >
                              {st.score}
                            </text>
                            {/* Pure White / Accent Gold Text */}
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill={isSelected ? '#FEF08A' : '#FFFFFF'}
                              fontSize={isSelected || isHovered ? '13' : '10.5'}
                              fontWeight="900"
                              fontFamily="system-ui, -apple-system, sans-serif"
                            >
                              {st.score}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                {/* Bottom Left Legend matching Screenshot 1 */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/90 shadow-md flex flex-col items-start gap-1 z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Rank</span>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-[#15803d]">62.49</span>
                      <div
                        className="w-3.5 h-28 rounded-full my-1 border border-slate-200"
                        style={{
                          background: 'linear-gradient(to bottom, #166534 0%, #15803d 25%, #84cc16 50%, #ca8a04 75%, #ea580c 100%)'
                        }}
                      />
                      <span className="text-[10px] font-black text-[#ea580c]">0.22</span>
                    </div>
                  </div>
                </div>

                {/* State Tooltip on Hover */}
                {hoveredState && (
                  <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-sm text-white p-3.5 rounded-2xl shadow-xl text-xs space-y-1.5 pointer-events-none border border-slate-700 max-w-[220px] z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-extrabold text-sm text-amber-300 font-['Space_Grotesk']">
                      {hoveredState.name}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Capacity Score:</span>
                      <strong className="text-white font-mono">{hoveredState.score}%</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Officers Trained:</span>
                      <span className="text-white font-mono">{hoveredState.officersTrained.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Completion Rate:</span>
                      <span className="text-emerald-400 font-mono font-bold">{hoveredState.completionRate}%</span>
                    </div>
                    <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                      Cadre: {hoveredState.leadMinistry}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected State Detailed Card */}
              {selectedState && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm uppercase tracking-wider"
                      style={{ backgroundColor: selectedState.color }}
                    >
                      {selectedState.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#0F2942] font-['Space_Grotesk']">
                          {selectedState.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          State Benchmarking
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Lead Cadre Wing: <strong className="text-slate-700 font-medium">{selectedState.leadMinistry}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Index Score</div>
                      <div className="font-black text-slate-900 font-mono text-base">{selectedState.score}</div>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Officers Trained</div>
                      <div className="font-black text-slate-900 font-mono text-base">
                        {selectedState.officersTrained.toLocaleString()}
                      </div>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Completion Rate</div>
                      <div className="font-black text-emerald-700 font-mono text-base">
                        {selectedState.completionRate}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIGHT: Union Ministries & Departments Podium matching Screenshot 1 */}
          {(activeTab === 'both' || activeTab === 'ministries') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-5' : 'w-full'} space-y-6`}>
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-[#0F2942] font-['Space_Grotesk']">
                  Union Ministries and Departments
                </h3>
                <p className="text-xs text-slate-500">
                  National podium standings for civil service capacity building & course adoption.
                </p>
              </div>

              {/* Trophies Podium Grid matching Screenshot 1 */}
              <div className="flex flex-col items-center justify-center space-y-6 py-4">
                {/* 1. Gold Trophy - Ministry of Coal */}
                <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
                  {/* Gold Laurel Wreath Trophy SVG representation */}
                  <div className="relative flex items-center justify-center">
                    <svg viewBox="0 0 120 100" className="w-28 h-24 filter drop-shadow-md">
                      {/* Laurel Wreath Left & Right */}
                      <path
                        d="M 30 75 C 10 50, 20 20, 45 15 C 38 25, 38 45, 45 60 Z"
                        fill="#F59E0B"
                        opacity="0.95"
                      />
                      <path
                        d="M 90 75 C 110 50, 100 20, 75 15 C 82 25, 82 45, 75 60 Z"
                        fill="#F59E0B"
                        opacity="0.95"
                      />
                      {/* Central Star Badge */}
                      <path
                        d="M 60 15 L 64 28 L 78 28 L 67 36 L 71 49 L 60 41 L 49 49 L 53 36 L 42 28 L 56 28 Z"
                        fill="#EAB308"
                        stroke="#CA8A04"
                        strokeWidth="1.5"
                      />
                      {/* Golden Ribbon Base */}
                      <path
                        d="M 45 70 L 75 70 L 70 82 L 50 82 Z"
                        fill="#D97706"
                      />
                      <rect x="42" y="82" width="36" height="8" rx="2" fill="#78350F" opacity="0.8" />
                      {/* Center Circle with "1" */}
                      <circle cx="60" cy="32" r="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
                      <text
                        x="60"
                        y="36"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="900"
                        fill="#854D0E"
                        fontFamily="serif"
                      >
                        1
                      </text>
                    </svg>
                  </div>

                  <div className="font-extrabold text-base text-[#0F2942] tracking-tight hover:text-amber-700 transition-colors">
                    Ministry of Coal
                  </div>
                  <div className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                    88.4% Capacity Benchmark • 18,450 Officers
                  </div>
                </div>

                {/* 2 & 3 Podiums in a row */}
                <div className="grid grid-cols-2 gap-8 w-full pt-2">
                  {/* 2. Silver/Gold Trophy - Dept of Food and Public Distribution */}
                  <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 120 100" className="w-24 h-20 filter drop-shadow-sm">
                        <path
                          d="M 30 75 C 12 50, 22 22, 45 18 C 38 28, 38 46, 45 60 Z"
                          fill="#F97316"
                          opacity="0.9"
                        />
                        <path
                          d="M 90 75 C 108 50, 98 22, 75 18 C 82 28, 82 46, 75 60 Z"
                          fill="#F97316"
                          opacity="0.9"
                        />
                        <path
                          d="M 60 18 L 63 29 L 75 29 L 65 37 L 69 48 L 60 40 L 51 48 L 55 37 L 45 29 L 57 29 Z"
                          fill="#FB923C"
                          stroke="#EA580C"
                          strokeWidth="1.5"
                        />
                        <path d="M 46 70 L 74 70 L 70 80 L 50 80 Z" fill="#C2410C" />
                        <rect x="44" y="80" width="32" height="7" rx="2" fill="#7C2D12" opacity="0.8" />
                        <circle cx="60" cy="33" r="10" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1" />
                        <text
                          x="60"
                          y="37"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="900"
                          fill="#9A3412"
                          fontFamily="serif"
                        >
                          2
                        </text>
                      </svg>
                    </div>

                    <div className="font-extrabold text-sm text-[#0F2942] tracking-tight leading-snug">
                      Dept. of Food and Public Distribution
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      84.1% Score • 14,200 Officers
                    </div>
                  </div>

                  {/* 3. Bronze/Gold Trophy - Ministry of Mines */}
                  <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 120 100" className="w-24 h-20 filter drop-shadow-sm">
                        <path
                          d="M 30 75 C 12 50, 22 22, 45 18 C 38 28, 38 46, 45 60 Z"
                          fill="#F97316"
                          opacity="0.85"
                        />
                        <path
                          d="M 90 75 C 108 50, 98 22, 75 18 C 82 28, 82 46, 75 60 Z"
                          fill="#F97316"
                          opacity="0.85"
                        />
                        <path
                          d="M 60 18 L 63 29 L 75 29 L 65 37 L 69 48 L 60 40 L 51 48 L 55 37 L 45 29 L 57 29 Z"
                          fill="#FB923C"
                          stroke="#EA580C"
                          strokeWidth="1.5"
                        />
                        <path d="M 46 70 L 74 70 L 70 80 L 50 80 Z" fill="#C2410C" />
                        <rect x="44" y="80" width="32" height="7" rx="2" fill="#7C2D12" opacity="0.8" />
                        <circle cx="60" cy="33" r="10" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1" />
                        <text
                          x="60"
                          y="37"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="900"
                          fill="#9A3412"
                          fontFamily="serif"
                        >
                          3
                        </text>
                      </svg>
                    </div>

                    <div className="font-extrabold text-sm text-[#0F2942] tracking-tight leading-snug">
                      Ministry of Mines
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      81.6% Score • 11,890 Officers
                    </div>
                  </div>
                </div>
              </div>

              {/* Subsequent Ministries Table (Ranks 4-8) */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <div className="bg-[#F8FAFC] px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 flex justify-between">
                  <span>Subsequent Standings</span>
                  <span>Avg Completion</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {MINISTRIES_DATA.slice(3).map((min) => (
                    <div key={min.rank} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-400 text-xs w-4">#{min.rank}</span>
                        <span className="font-semibold text-slate-800">{min.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0F2942]">{min.score}%</span>
                        <span className="text-[10px] text-slate-400">({min.completionRate}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
