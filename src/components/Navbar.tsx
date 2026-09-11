import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Search,
  Flame,
  Coins,
  Award,
  Bell,
  ChevronDown,
  User,
  Shield,
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  Settings,
  Layers,
  Menu,
  X,
  ExternalLink,
  LogIn,
  LogOut,
  UserPlus,
  Mail,
  Users,
  UploadCloud
} from 'lucide-react';
import { ScreenSizeController, ScreenViewMode } from './ScreenSizeController.js';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  screenMode?: ScreenViewMode;
  onScreenModeChange?: (mode: ScreenViewMode) => void;
  onOpenUploadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onNavigate,
  currentPage,
  screenMode = 'desktop',
  onScreenModeChange = () => {},
  onOpenUploadModal
}) => {
  const { user, profile, role, loginAs, logout, switchAccount, savedAccounts, isAuthenticated } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const handleRoleChange = (newRole: 'learner' | 'trainer' | 'admin') => {
    loginAs(newRole);
    setProfileDropdownOpen(false);
    if (newRole === 'learner') onNavigate('dashboard');
    if (newRole === 'trainer') onNavigate('trainer');
    if (newRole === 'admin') onNavigate('admin');
  };

  const navLinks = [
    { id: 'dashboard', label: lang === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: BookOpen },
    { id: 'course_map', label: lang === 'en' ? 'Learn Hub' : 'लर्न हब', icon: Layers },
    { id: 'competencies', label: lang === 'en' ? 'Competencies (FRAC)' : 'क्षमताएं', icon: Award },
    { id: 'recommendations', label: lang === 'en' ? 'Course Catalog' : 'कोर्स सूची', icon: Sparkles },
    { id: 'games', label: lang === 'en' ? 'SkillQuest Games' : 'गेम्स व क्विज़', icon: Trophy },
    { id: 'leaderboard', label: lang === 'en' ? 'Leaderboard' : 'रैंकिंग', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs select-none">
      {/* 1. Indian Tricolor Header Stripe */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Official Government of India Top Strip */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          {/* Left: State Emblem + Department Names */}
          <div className="flex items-center gap-3">
            {/* Ashoka Emblem representation */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-6 flex flex-col items-center justify-center text-[#996515] font-serif font-black text-[9px] leading-tight">
                <span>🏛️</span>
              </div>
              <div className="border-l border-slate-300 pl-2.5">
                <div className="font-extrabold text-[11px] text-[#0F2942] tracking-wide leading-tight">
                  {lang === 'en' ? 'भारत सरकार | GOVERNMENT OF INDIA' : 'भारत सरकार'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight">
                  {lang === 'en'
                    ? 'Ministry of Statistics & Programme Implementation (MoSPI)'
                    : 'सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय'}
                </div>
              </div>
            </div>
            <span className="hidden md:inline-block rounded-sm bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 ml-2 border border-orange-200">
              Mission Karmayogi
            </span>
          </div>

          {/* Right: Accessibility toolbar + Language + Portal switcher */}
          <div className="flex items-center gap-4 text-[11px]">
            {/* Font Size controls */}
            <div className="hidden sm:flex items-center gap-1 border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-600">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1 font-bold ${fontSize === 'normal' ? 'text-orange-600' : 'hover:text-black'}`}
                title="Standard Text Size"
              >
                A-
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1 font-bold ${fontSize === 'large' ? 'text-orange-600' : 'hover:text-black'}`}
                title="Large Text Size"
              >
                A
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-1 font-bold ${fontSize === 'larger' ? 'text-orange-600' : 'hover:text-black'}`}
                title="Largest Text Size"
              >
                A+
              </button>
            </div>

            {/* Screen Size & Viewport Controller */}
            <ScreenSizeController
              currentMode={screenMode}
              onModeChange={onScreenModeChange}
              variant="navbar"
            />

            {/* Language Switcher */}
            <div className="flex items-center border border-slate-300 rounded overflow-hidden bg-white">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 text-[11px] font-bold transition-colors ${
                  lang === 'en' ? 'bg-[#0F2942] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 text-[11px] font-bold transition-colors ${
                  lang === 'hi' ? 'bg-[#0F2942] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Screen Reader & Helpdesk */}
            <span className="hidden lg:inline text-slate-500 hover:text-slate-800 cursor-pointer">
              Screen Reader Access
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Portal Header Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* Pragya AI Logo Mark */}
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F2942] to-[#1E3A8A] text-white shadow-sm ring-1 ring-slate-900/10">
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#FF9933] border-2 border-white" />
              <span className="font-black text-xs tracking-tight text-white">PAI</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] tracking-tight">
                  Pragya AI
                </span>
                <span className="text-orange-600 font-bold text-xs sm:text-sm bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                  प्रज्ञा AI
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Civil Services Capacity Intelligence • MoSPI
              </div>
            </div>
          </div>

          {/* Quick Search Bar (styled like official iGOT search) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-white hover:border-[#0F2942] px-4 py-2 text-xs text-slate-500 cursor-pointer shadow-2xs transition-all"
            >
              <Search className="h-4 w-4 text-slate-400" />
              <span className="flex-1 truncate">
                Search courses, competencies, roles, or providers (NSSTA, CBC)...
              </span>
              <kbd className="hidden lg:inline-block rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Gamification Stats (Karma Points, Streaks, Level) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Karma Points */}
            <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-orange-900 shadow-2xs">
              <Coins className="h-4 w-4 text-orange-600 fill-orange-500" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-bold uppercase text-orange-700">Karma Pts</span>
                <span className="text-xs font-black text-orange-950 font-mono">
                  {profile?.coins || 420}
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-rose-900 shadow-2xs">
              <Flame className="h-4 w-4 text-rose-600 fill-rose-500" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-bold uppercase text-rose-700">Streak</span>
                <span className="text-xs font-black text-rose-950 font-mono">
                  {profile?.streakDays || 5}d
                </span>
              </div>
            </div>

            {/* Level / XP */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-blue-900 shadow-2xs">
              <Award className="h-4 w-4 text-blue-600" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-bold uppercase text-blue-700">Level {profile?.level || 3}</span>
                <span className="text-xs font-black text-blue-950 font-mono">
                  {profile?.xp || 1450} XP
                </span>
              </div>
            </div>

            {/* Upload PDF & Notes Action Button */}
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Upload PDF Manual or Create Study Notes"
              >
                <UploadCloud className="h-4 w-4 text-orange-600" />
                <span className="hidden sm:inline">Upload Notes / PDF</span>
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => alert('iGOT Notifications: 2 new circulars released for MoSPI Cadre regarding Statistical Survey sampling updates.')}
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Official Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
            </button>

            {/* User Profile & Role Switcher Dropdown */}
            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#0F2942] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 bg-white shadow-2xs"
                >
                  <LogIn className="h-3.5 w-3.5 text-orange-600" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-[#0F2942] bg-[#FF9933] hover:bg-orange-500 rounded-xl shadow-2xs transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <img
                    src={user.avatar || profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt="Officer Profile"
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-orange-500"
                  />
                  <div className="hidden md:block text-left leading-tight">
                    <div className="text-xs font-bold text-[#0F2942] truncate max-w-[120px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-orange-700 font-semibold uppercase">
                      {role === 'learner' ? 'Learner' : role === 'trainer' ? 'Trainer' : 'Admin'}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Profile / Role Switcher Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-slate-800 animate-in fade-in">
                    {/* User Header */}
                    <div className="border-b border-slate-100 pb-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-[#0F2942]">{user.name}</div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                          {role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">{user.email}</div>
                      <div className="text-[11px] text-slate-600 font-medium mt-1">
                        {user.department || 'Ministry of Statistics & Programme Implementation'}
                      </div>
                    </div>

                    {/* Action: Log In with Different Email */}
                    <div className="pb-2 border-b border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('login');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-900 text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-orange-600" />
                          <span>Login with Different Email</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Switch</span>
                      </button>
                    </div>

                    {/* Saved Accounts Switcher */}
                    {savedAccounts.filter((a) => a.email.toLowerCase() !== user.email.toLowerCase()).length > 0 && (
                      <div className="py-2 border-b border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                          Saved Accounts
                        </div>
                        {savedAccounts
                          .filter((a) => a.email.toLowerCase() !== user.email.toLowerCase())
                          .slice(0, 3)
                          .map((acc) => (
                            <button
                              key={acc.email}
                              onClick={() => {
                                switchAccount(acc.email);
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 text-left text-xs transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={acc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                                  alt={acc.name}
                                  className="h-5 w-5 rounded-full object-cover"
                                />
                                <div className="truncate">
                                  <div className="font-semibold text-slate-800 text-[11px] truncate">{acc.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{acc.email}</div>
                                </div>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold shrink-0 ml-1">Switch</span>
                            </button>
                          ))}
                      </div>
                    )}

                    {/* Role Switcher */}
                    <div className="space-y-1 py-2 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                        Switch Active Persona
                      </div>

                      <button
                        onClick={() => handleRoleChange('learner')}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                          role === 'learner'
                            ? 'bg-blue-50 text-[#0F2942] font-bold border border-blue-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <span>Civil Service Learner</span>
                        </div>
                        {role === 'learner' && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                      </button>

                      <button
                        onClick={() => handleRoleChange('trainer')}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                          role === 'trainer'
                            ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                          <span>NSSTA Certified Trainer</span>
                        </div>
                        {role === 'trainer' && <span className="h-2 w-2 rounded-full bg-purple-600" />}
                      </button>

                      <button
                        onClick={() => handleRoleChange('admin')}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                          role === 'admin'
                            ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-orange-600" />
                          <span>Ministry Administrator</span>
                        </div>
                        {role === 'admin' && <span className="h-2 w-2 rounded-full bg-orange-600" />}
                      </button>
                    </div>

                    <div className="pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('onboarding');
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Settings className="h-3.5 w-3.5 text-slate-500" />
                        <span>Cadre Profile & Personalization</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          onNavigate('landing');
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Primary Hubs Navigation Bar (Official iGOT Karmayogi blue tabs) */}
      <nav className="bg-[#0F2942] text-white border-t border-[#132B45]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1">
              {navLinks.map((tab) => {
                const isActive =
                  currentPage === tab.id ||
                  (tab.id === 'games' && currentPage === 'topic_learning') ||
                  (tab.id === 'dashboard' && currentPage === 'landing');

                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onNavigate(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                      isActive
                        ? 'border-[#FF9933] text-[#FF9933] bg-white/5'
                        : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Trainer/Admin Quick Jump */}
            <div className="flex items-center gap-2 py-1 text-xs">
              {role === 'trainer' && (
                <button
                  onClick={() => onNavigate('trainer')}
                  className="rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 px-2.5 py-1 font-bold border border-purple-400/30"
                >
                  Trainer Ingestion Console
                </button>
              )}
              {role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="rounded bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 px-2.5 py-1 font-bold border border-orange-400/30"
                >
                  Admin iGOT Console
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3">
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-600"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span>Search courses & competencies...</span>
          </div>

          <div className="space-y-1">
            {navLinks.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(tab.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left ${
                  currentPage === tab.id
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5 text-orange-600" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('signup');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#FF9933] text-[#0F2942] text-xs font-extrabold flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-[#0F2942]">{user.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                  <div className="text-[10px] text-orange-700 font-bold uppercase mt-0.5">{role}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('login');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-orange-600" />
                    <span>Switch Email</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      onNavigate('landing');
                    }}
                    className="py-2 px-3 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
