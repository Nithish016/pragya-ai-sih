import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';

export type ScreenViewMode = 'full' | 'desktop' | 'laptop' | 'tablet' | 'mobile';

interface ScreenSizeControllerProps {
  currentMode: ScreenViewMode;
  onModeChange: (mode: ScreenViewMode) => void;
  variant?: 'navbar' | 'floating';
}

export const ScreenSizeController: React.FC<ScreenSizeControllerProps> = ({
  currentMode,
  onModeChange,
  variant = 'navbar'
}) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Track real-time window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request denied:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen error:', err);
      });
    }
  };

  const getBreakpointLabel = (w: number) => {
    if (w >= 1536) return 'Desktop 2XL';
    if (w >= 1280) return 'Desktop XL';
    if (w >= 1024) return 'Laptop (LG)';
    if (w >= 768) return 'Tablet (MD)';
    if (w >= 640) return 'Mobile (SM)';
    return 'Mobile (XS)';
  };

  const modes: { id: ScreenViewMode; label: string; widthLabel: string; icon: any }[] = [
    { id: 'full', label: 'Full Width', widthLabel: '100% Fluid', icon: Maximize2 },
    { id: 'desktop', label: 'Desktop', widthLabel: '1280px', icon: Monitor },
    { id: 'laptop', label: 'Laptop', widthLabel: '1024px', icon: Laptop },
    { id: 'tablet', label: 'Tablet', widthLabel: '768px', icon: Tablet },
    { id: 'mobile', label: 'Mobile', widthLabel: '390px', icon: Smartphone }
  ];

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-2xl border border-slate-700/80 text-xs select-none">
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-bold text-[11px] text-slate-200">
            {windowDimensions.width}×{windowDimensions.height}
          </span>
          <span className="text-[10px] text-emerald-300 font-semibold hidden sm:inline">
            {getBreakpointLabel(windowDimensions.width)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                title={`${m.label} (${m.widthLabel})`}
                className={`p-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  active
                    ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] hidden md:inline">{m.label}</span>
              </button>
            );
          })}

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F11)'}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 text-amber-400" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  // Navbar variant (compact, government-styled)
  return (
    <div className="relative inline-flex items-center">
      <div className="hidden lg:flex items-center bg-slate-100 hover:bg-slate-200/70 border border-slate-300 rounded-lg p-0.5 text-[11px] transition-colors">
        {/* Live Pixel Resolution Indicator */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 text-slate-600 font-mono text-[10px] border-r border-slate-300 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Current live viewport size"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-bold">{windowDimensions.width}×{windowDimensions.height}</span>
        </div>

        {/* Viewport switcher buttons */}
        {modes.map((m) => {
          const Icon = m.icon;
          const active = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              title={`${m.label} View (${m.widthLabel})`}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                active
                  ? 'bg-white text-orange-600 font-bold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden xl:inline text-[10px]">{m.label}</span>
            </button>
          );
        })}

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
          className="p-1 text-slate-600 hover:text-orange-600 rounded transition-colors ml-0.5"
        >
          {isFullscreen ? <Minimize2 className="h-3 w-3 text-orange-600" /> : <Maximize2 className="h-3 w-3" />}
        </button>
      </div>

      {/* Mobile/Compact dropdown toggle button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold"
        >
          <Monitor className="h-3.5 w-3.5 text-orange-600" />
          <span className="text-[10px] font-mono">{windowDimensions.width}px</span>
          <ChevronDown className="h-3 w-3 text-slate-500" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex justify-between">
              <span>Website Screen View</span>
              <span className="text-emerald-600">{windowDimensions.width}×{windowDimensions.height}</span>
            </div>
            {modes.map((m) => {
              const Icon = m.icon;
              const active = currentMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    onModeChange(m.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    active ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{m.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{m.widthLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
