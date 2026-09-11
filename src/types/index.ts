export type UserRole = 'learner' | 'trainer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  organization?: string;
  createdAt: string;
}

export interface LearnerProfile {
  userId: string;
  educationLevel: string;
  degree: string;
  specialization: string;
  institution?: string;
  currentRole: string;
  department: string;
  experienceLevel: 'Entry' | 'Intermediate' | 'Senior' | 'Lead';
  interests: string[];
  skills: string[];
  learningGoals: string[];
  preferredFormats: ('video' | 'reading' | 'games' | 'quizzes' | 'mixed')[];
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  streakHistory: { date: string; active: boolean }[];
  coins: number;
}

export type CompetencyStatus = 'critical_gap' | 'developing' | 'good' | 'strong';

export interface CompetencyScore {
  competencyId: string;
  name: string;
  category: string;
  score: number; // 0 - 100
  requiredScore: number; // required by role
  status: CompetencyStatus;
  gap: number; // requiredScore - score
  lastAssessed?: string;
}

export interface CourseRecommendation {
  courseId: string;
  courseTitle: string;
  category: string;
  matchScore: number; // 0 - 100
  matchBreakdown: {
    educationMatch: number;
    interestMatch: number;
    roleMatch: number;
    competencyGapMatch: number;
    learningGoalMatch: number;
    difficultyFit: number;
  };
  reasons: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  learningFormats: ('video' | 'ebook' | 'pdf' | 'game' | 'quiz')[];
  competencies: string[];
  isIgot?: boolean;
  thumbnail?: string;
  recommendationCategory: 
    | 'Based on Your Education'
    | 'Based on Your Interests'
    | 'Based on Your Role'
    | 'Close Your Skill Gaps'
    | 'Continue Learning'
    | 'Based on Your Quiz Performance'
    | 'iGOT Recommended Courses'
    | 'Popular Courses'
    | 'Next Best Course';
}

export type NodeStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';

export interface TopicResource {
  id: string;
  type: 'video' | 'ebook' | 'pdf' | 'game' | 'quiz';
  title: string;
  description: string;
  durationMinutes?: number;
  url?: string;
  content?: string;
  chapters?: { title: string; content: string }[];
  pages?: number;
  gameType?: 'knowledge_run' | 'knowledge_collector' | 'boss_challenge' | 'logic_challenge';
  quizId?: string;
}

export interface CourseTopic {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  competency: string;
  status: NodeStatus;
  isBoss?: boolean;
  resources: TopicResource[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  topics: CourseTopic[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  thumbnail: string;
  competencies: string[];
  modules: CourseModule[];
  isIgot?: boolean;
  igotProvider?: string;
  enrolledCount?: number;
  rating?: number;
  progressPercent?: number;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competency: string;
  sourceReference?: string;
  status?: 'pending_review' | 'approved' | 'rejected';
}

export interface Quiz {
  id: string;
  topicId?: string;
  courseId?: string;
  title: string;
  description?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
  questions: QuizQuestion[];
  isPublished: boolean;
  createdBy?: string;
  sourceDocument?: string;
  passingScorePercent?: number;
}

export interface QuizAttemptResult {
  attemptId: string;
  quizId: string;
  topicId?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  coinsEarned: number;
  adaptivePath: { questionId: string; difficulty: string; correct: boolean }[];
  answers: { questionId: string; selectedOption: number; isCorrect: boolean; explanation: string }[];
  updatedCompetencies: { competencyName: string; previousScore: number; newScore: number }[];
  levelUp?: { newLevel: number; previousLevel: number };
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  role: string;
  department: string;
  xp: number;
  level: number;
  streakDays: number;
  coursesCompleted: number;
  quizAccuracy: number;
  avatar: string;
  badgesCount: number;
}

export interface UploadedMaterial {
  id: string;
  filename: string;
  fileType: 'pdf' | 'pptx' | 'docx' | 'txt';
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  chunkCount: number;
  status: 'processing' | 'indexed' | 'quiz_ready';
  extractedTextPreview?: string;
  suggestedCompetencies: string[];
}

export interface IGOTCourseSync {
  id: string;
  title: string;
  provider: string;
  category: string;
  competencyMapped: string;
  lastSynced: string;
  status: 'active' | 'pending';
  url: string;
}

export interface DailyNugget {
  id: string;
  topicId: string;
  topicTitle: string;
  courseId: string;
  courseTitle: string;
  competency: string;
  keyConcept: string;
  summary: string;
  didYouKnow: string;
  practicalExample: string;
  retentionQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  tags: string[];
  readTimeSeconds: number;
  sourceReference: string;
  generatedAt: string;
  isCompletedToday?: boolean;
}

