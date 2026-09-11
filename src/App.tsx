import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { Footer } from './components/Footer.js';
import { SearchModal } from './components/SearchModal.js';
import { ScreenSizeController, ScreenViewMode } from './components/ScreenSizeController.js';
import { DocumentUploadModal } from './components/DocumentUploadModal.js';
import { LandingPage } from './pages/LandingPage.js';
import { LearnerDashboard } from './pages/LearnerDashboard.js';
import { CourseMapPage } from './pages/CourseMapPage.js';
import { TopicLearningPage } from './pages/TopicLearningPage.js';
import { CompetenciesPage } from './pages/CompetenciesPage.js';
import { RecommendationsPage } from './pages/RecommendationsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { AchievementsPage } from './pages/AchievementsPage.js';
import { OnboardingPage } from './pages/OnboardingPage.js';
import { TrainerDashboard } from './pages/TrainerDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { LoginPage } from './pages/LoginPage.js';
import { PythonKingdomPage } from './pages/PythonKingdomPage.js';
import { RotateCcw, X, Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';

function MainLayout() {
  const { role, loginAs } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [searchOpen, setSearchOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenViewMode>('desktop');
  const [initialTopicMode, setInitialTopicMode] = useState<'video' | 'ebook' | 'pdf' | 'game' | 'quiz'>('video');

  const handleNavigate = (page: string, params?: any) => {
    if (page === 'games' || page === 'python_kingdom') {
      setCurrentPage('python_kingdom');
    } else if (page === 'quizzes') {
      setCurrentPage('topic_learning');
      setInitialTopicMode('quiz');
    } else if (page === 'upload') {
      setUploadModalOpen(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setCurrentPage('topic_learning');
  };

  const handleSelectTopic = (topicId: string) => {
    setCurrentPage('topic_learning');
  };

  const handleUploadSuccess = (newDoc: any) => {
    // If on trainer or topic learning, transition smoothly
    if (currentPage !== 'topic_learning' && currentPage !== 'trainer_materials') {
      setCurrentPage('topic_learning');
      setInitialTopicMode('pdf');
    }
  };

  const isLanding = currentPage === 'landing';
  const isAuthPage = currentPage === 'login' || currentPage === 'signup';

  // Responsive Layout Container classes according to screenMode
  const getContainerClasses = () => {
    switch (screenMode) {
      case 'full':
        return 'w-full px-2 sm:px-4 lg:px-6';
      case 'laptop':
        return 'w-full max-w-[1024px] mx-auto transition-all duration-300 shadow-xl border border-slate-300/80 rounded-2xl bg-[#F4F6F9] my-2';
      case 'tablet':
        return 'w-full max-w-[768px] mx-auto transition-all duration-300 shadow-2xl border-4 border-slate-800 rounded-3xl bg-[#F4F6F9] my-4 overflow-hidden';
      case 'mobile':
        return 'w-full max-w-[390px] mx-auto transition-all duration-300 shadow-2xl border-8 border-slate-900 rounded-[40px] bg-[#F4F6F9] my-6 overflow-hidden relative';
      case 'desktop':
      default:
        return 'mx-auto w-full max-w-7xl transition-all duration-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-['Plus_Jakarta_Sans'] antialiased selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Top Banner Notice when Simulated Screen Size is Active */}
      {screenMode !== 'desktop' && screenMode !== 'full' && (
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-700 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            {screenMode === 'mobile' && <Smartphone className="h-3.5 w-3.5 text-orange-400" />}
            {screenMode === 'tablet' && <Tablet className="h-3.5 w-3.5 text-emerald-400" />}
            {screenMode === 'laptop' && <Laptop className="h-3.5 w-3.5 text-blue-400" />}
            <span className="font-semibold capitalize">
              {screenMode} View Simulation ({screenMode === 'mobile' ? '390px' : screenMode === 'tablet' ? '768px' : '1024px'})
            </span>
          </div>
          <button
            onClick={() => setScreenMode('desktop')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset to Standard Desktop</span>
          </button>
        </div>
      )}

      {/* Mobile Simulated Status Bar */}
      {screenMode === 'mobile' && (
        <div className="bg-slate-950 text-white text-[10px] px-6 pt-2 pb-1 flex items-center justify-between font-mono max-w-[390px] mx-auto w-full rounded-t-[32px] select-none">
          <span>9:41</span>
          <div className="w-16 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1 text-[9px]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Screen Frame Wrapper */}
      <div className={`flex-1 flex flex-col ${getContainerClasses()}`}>
        {/* Top Navigation */}
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          screenMode={screenMode}
          onScreenModeChange={setScreenMode}
          onOpenUploadModal={() => setUploadModalOpen(true)}
        />

        {/* Main Body */}
        {isLanding ? (
          <main className="flex-1">
            <LandingPage onNavigate={handleNavigate} />
          </main>
        ) : isAuthPage ? (
          <main className="flex-1">
            <LoginPage
              onNavigate={handleNavigate}
              defaultMode={currentPage === 'signup' ? 'signup' : 'signin'}
            />
          </main>
        ) : (
          <div className={`flex-1 flex w-full ${screenMode === 'mobile' ? 'flex-col' : ''}`}>
            {screenMode !== 'mobile' && (
              <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
            )}
            <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
              {currentPage === 'dashboard' && <LearnerDashboard onNavigate={handleNavigate} />}
              {currentPage === 'course_map' && <CourseMapPage onNavigate={handleNavigate} />}
              {currentPage === 'topic_learning' && (
                <TopicLearningPage
                  onNavigate={handleNavigate}
                  initialMode={initialTopicMode}
                  onOpenUploadModal={() => setUploadModalOpen(true)}
                />
              )}
              {currentPage === 'competencies' && <CompetenciesPage onNavigate={handleNavigate} />}
              {currentPage === 'recommendations' && <RecommendationsPage onNavigate={handleNavigate} />}
              {currentPage === 'leaderboard' && <LeaderboardPage onNavigate={handleNavigate} />}
              {currentPage === 'achievements' && <AchievementsPage onNavigate={handleNavigate} />}
              {currentPage === 'onboarding' && <OnboardingPage onNavigate={handleNavigate} />}
              {currentPage === 'python_kingdom' && <PythonKingdomPage onNavigate={handleNavigate} />}

              {/* Trainer Pages */}
              {(currentPage === 'trainer' ||
                currentPage === 'trainer_materials' ||
                currentPage === 'trainer_quizzes' ||
                currentPage === 'trainer_analytics') && (
                <TrainerDashboard
                  onNavigate={handleNavigate}
                  onOpenUploadModal={() => setUploadModalOpen(true)}
                />
              )}

              {/* Admin Pages */}
              {(currentPage === 'admin' ||
                currentPage === 'admin_competencies' ||
                currentPage === 'admin_users' ||
                currentPage === 'admin_igot') && (
                <AdminDashboard onNavigate={handleNavigate} />
              )}
            </main>
          </div>
        )}

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Global Semantic Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCourse={handleSelectCourse}
        onSelectTopic={handleSelectTopic}
      />

      {/* Global PDF & Notes Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Floating Quick Screen Size & Viewport Controller */}
      <ScreenSizeController
        currentMode={screenMode}
        onModeChange={setScreenMode}
        variant="floating"
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

