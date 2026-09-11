import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { Footer } from './components/Footer.js';
import { SearchModal } from './components/SearchModal.js';
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

function MainLayout() {
  const { role, loginAs } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [searchOpen, setSearchOpen] = useState(false);
  const [initialTopicMode, setInitialTopicMode] = useState<'video' | 'ebook' | 'pdf' | 'game' | 'quiz'>('video');

  const handleNavigate = (page: string, params?: any) => {
    if (page === 'games') {
      setCurrentPage('topic_learning');
      setInitialTopicMode('game');
    } else if (page === 'quizzes') {
      setCurrentPage('topic_learning');
      setInitialTopicMode('quiz');
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

  const isLanding = currentPage === 'landing';
  const isAuthPage = currentPage === 'login' || currentPage === 'signup';

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-['Plus_Jakarta_Sans'] antialiased selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
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
        <div className="flex-1 flex mx-auto w-full max-w-7xl">
          <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
            {currentPage === 'dashboard' && <LearnerDashboard onNavigate={handleNavigate} />}
            {currentPage === 'course_map' && <CourseMapPage onNavigate={handleNavigate} />}
            {currentPage === 'topic_learning' && (
              <TopicLearningPage onNavigate={handleNavigate} initialMode={initialTopicMode} />
            )}
            {currentPage === 'competencies' && <CompetenciesPage onNavigate={handleNavigate} />}
            {currentPage === 'recommendations' && <RecommendationsPage onNavigate={handleNavigate} />}
            {currentPage === 'leaderboard' && <LeaderboardPage onNavigate={handleNavigate} />}
            {currentPage === 'achievements' && <AchievementsPage onNavigate={handleNavigate} />}
            {currentPage === 'onboarding' && <OnboardingPage onNavigate={handleNavigate} />}

            {/* Trainer Pages */}
            {(currentPage === 'trainer' ||
              currentPage === 'trainer_materials' ||
              currentPage === 'trainer_quizzes' ||
              currentPage === 'trainer_analytics') && (
              <TrainerDashboard onNavigate={handleNavigate} />
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

      {/* Global Semantic Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCourse={handleSelectCourse}
        onSelectTopic={handleSelectTopic}
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
