import crypto from 'crypto';

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'learner' | 'trainer' | 'admin';
  avatar?: string;
  department?: string;
  organization?: string;
  createdAt: string;
}

export interface DBLearnerProfile {
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

export interface DBCompetency {
  id: string;
  name: string;
  category: string;
  description: string;
  requiredForRoles: Record<string, number>; // e.g. "Statistical Analyst": 80
}

export interface DBLearnerCompetency {
  learnerId: string;
  competencyId: string;
  competencyName: string;
  category: string;
  score: number; // 0-100
  lastAssessed: string;
}

export interface DBTopicResource {
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

export interface DBTopic {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  competency: string;
  isBoss?: boolean;
  resources: DBTopicResource[];
}

export interface DBModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  topics: DBTopic[];
}

export interface DBCourse {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  thumbnail: string;
  competencies: string[];
  modules: DBModule[];
  isIgot?: boolean;
  igotProvider?: string;
  enrolledCount?: number;
  rating?: number;
}

export interface DBQuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competency: string;
  sourceReference?: string;
  status: 'pending_review' | 'approved' | 'rejected';
}

export interface DBQuiz {
  id: string;
  topicId?: string;
  courseId?: string;
  title: string;
  description?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
  questions: DBQuizQuestion[];
  isPublished: boolean;
  createdBy?: string;
  sourceDocument?: string;
  passingScorePercent?: number;
}

export interface DBLearnerProgress {
  id: string;
  learnerId: string;
  courseId: string;
  topicId: string;
  videoCompleted: boolean;
  ebookCompleted: boolean;
  pdfCompleted: boolean;
  gameCompleted: boolean;
  quizCompleted: boolean;
  completedAt?: string;
}

export interface DBXPTransaction {
  id: string;
  learnerId: string;
  amount: number;
  source: string;
  referenceId?: string;
  createdAt: string;
}

export interface DBAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

export interface DBLearnerAchievement {
  learnerId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface DBUploadedMaterial {
  id: string;
  filename: string;
  fileType: 'pdf' | 'pptx' | 'docx' | 'txt';
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  chunkCount: number;
  status: 'processing' | 'indexed' | 'quiz_ready';
  extractedTextPreview?: string;
  textContent: string;
  suggestedCompetencies: string[];
}

export interface DBNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'recommendation' | 'achievement' | 'streak' | 'quiz' | 'igot' | 'review';
  read: boolean;
  createdAt: string;
}

export interface DBIGOTCourse {
  id: string;
  igotId: string;
  title: string;
  provider: string;
  category: string;
  competencyMapped: string;
  duration: string;
  rating: number;
  enrolledCount: number;
  lastSynced: string;
  url: string;
  description: string;
}

// In-Memory Database Store with initial seed
class DatabaseStore {
  users: DBUser[] = [];
  learnerProfiles: Map<string, DBLearnerProfile> = new Map();
  competencies: DBCompetency[] = [];
  learnerCompetencies: DBLearnerCompetency[] = [];
  courses: DBCourse[] = [];
  quizzes: DBQuiz[] = [];
  learnerProgress: DBLearnerProgress[] = [];
  xpTransactions: DBXPTransaction[] = [];
  achievements: DBAchievement[] = [];
  learnerAchievements: DBLearnerAchievement[] = [];
  uploadedMaterials: DBUploadedMaterial[] = [];
  notifications: DBNotification[] = [];
  igotCourses: DBIGOTCourse[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    // 1. Users
    this.users = [
      {
        id: 'usr_learner_1',
        email: 'ananya.sharma@mospi.gov.in',
        passwordHash: 'hashed_password_123',
        name: 'Ananya Sharma',
        role: 'learner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'National Statistical Office (NSO)',
        organization: 'Ministry of Statistics & Programme Implementation (MoSPI)',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_trainer_1',
        email: 'dr.rajesh.varma@mospi.gov.in',
        passwordHash: 'hashed_password_123',
        name: 'Dr. Rajesh Varma',
        role: 'trainer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        department: 'National Statistical Systems Training Academy (NSSTA)',
        organization: 'Ministry of Statistics & Programme Implementation (MoSPI)',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_admin_1',
        email: 'vikram.sen@mospi.gov.in',
        passwordHash: 'hashed_password_123',
        name: 'Vikramaditya Sen',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        department: 'Central Statistics Office & Capacity Building Wing',
        organization: 'MoSPI & iGOT Karmayogi Council',
        createdAt: new Date().toISOString()
      }
    ];

    // 2. Learner Profile (matches exact SIH demo scenario)
    this.learnerProfiles.set('usr_learner_1', {
      userId: 'usr_learner_1',
      educationLevel: 'Undergraduate',
      degree: 'B.Sc Mathematics',
      specialization: 'Applied Statistics & Probability',
      institution: 'Delhi University',
      currentRole: 'Statistical Analyst',
      department: 'Survey Design & Research Division',
      experienceLevel: 'Entry',
      interests: ['Data Science', 'Statistics', 'AI', 'Data Visualization', 'Official Statistics'],
      skills: ['Statistics', 'Excel', 'Basic Python', 'Survey Sampling'],
      learningGoals: ['Improve Data Analytics', 'Master Official Statistical Dissemination', 'Prepare for Senior Statistical Officer'],
      preferredFormats: ['video', 'reading', 'games', 'quizzes'],
      level: 3,
      xp: 1240,
      xpToNextLevel: 1800,
      streakDays: 7,
      streakHistory: [
        { date: 'Mon', active: true },
        { date: 'Tue', active: true },
        { date: 'Wed', active: true },
        { date: 'Thu', active: true },
        { date: 'Fri', active: true },
        { date: 'Sat', active: true },
        { date: 'Sun', active: true }
      ],
      coins: 480
    });

    // 3. Competencies definition
    this.competencies = [
      {
        id: 'comp_data_viz',
        name: 'Data Visualization',
        category: 'Analytics & Reporting',
        description: 'Creating charts, cognitive dashboard visuals, statistical graphs, and government data presentation.',
        requiredForRoles: { 'Statistical Analyst': 80, 'Statistical Officer': 85, 'Data Scientist': 90 }
      },
      {
        id: 'comp_stat_inf',
        name: 'Statistical Inference',
        category: 'Statistical Theory',
        description: 'Hypothesis testing, confidence intervals, p-values, regression analysis, and sample estimators.',
        requiredForRoles: { 'Statistical Analyst': 75, 'Statistical Officer': 85, 'Data Scientist': 85 }
      },
      {
        id: 'comp_python_data',
        name: 'Python for Data Analysis',
        category: 'Programming & Computation',
        description: 'Pandas, NumPy, automated data wrangling, and statistical data pipelines.',
        requiredForRoles: { 'Statistical Analyst': 70, 'Statistical Officer': 75, 'Data Scientist': 90 }
      },
      {
        id: 'comp_survey_methods',
        name: 'Survey Methods & Sampling',
        category: 'Field Operations',
        description: 'Stratified sampling, survey questionnaires, frame development, and fieldwork control.',
        requiredForRoles: { 'Statistical Analyst': 75, 'Statistical Officer': 80, 'Data Scientist': 65 }
      },
      {
        id: 'comp_data_col',
        name: 'Data Collection & Verification',
        category: 'Field Operations',
        description: 'CAPI, field data validation, response tracking, and census quality assurance.',
        requiredForRoles: { 'Statistical Analyst': 70, 'Statistical Officer': 80, 'Data Scientist': 60 }
      },
      {
        id: 'comp_stat_basics',
        name: 'Measures of Central Tendency',
        category: 'Statistical Theory',
        description: 'Mean, median, mode, variance, and standard deviation in official datasets.',
        requiredForRoles: { 'Statistical Analyst': 80, 'Statistical Officer': 85, 'Data Scientist': 80 }
      }
    ];

    // 4. Initial Learner Competency Scores (Matching SIH Demo Scenario 1: Critical gaps in Data Viz 38%, Stat Inference 42%)
    this.learnerCompetencies = [
      {
        learnerId: 'usr_learner_1',
        competencyId: 'comp_data_viz',
        competencyName: 'Data Visualization',
        category: 'Analytics & Reporting',
        score: 38, // Critical gap
        lastAssessed: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        learnerId: 'usr_learner_1',
        competencyId: 'comp_stat_inf',
        competencyName: 'Statistical Inference',
        category: 'Statistical Theory',
        score: 42, // Developing gap
        lastAssessed: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        learnerId: 'usr_learner_1',
        competencyId: 'comp_python_data',
        competencyName: 'Python for Data Analysis',
        category: 'Programming & Computation',
        score: 48, // Developing
        lastAssessed: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        learnerId: 'usr_learner_1',
        competencyId: 'comp_survey_methods',
        competencyName: 'Survey Methods & Sampling',
        category: 'Field Operations',
        score: 82, // Strong
        lastAssessed: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        learnerId: 'usr_learner_1',
        competencyId: 'comp_data_col',
        competencyName: 'Data Collection & Verification',
        category: 'Field Operations',
        score: 85, // Strong
        lastAssessed: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        learnerId: 'usr_learner_1',
        competencyId: 'comp_stat_basics',
        competencyName: 'Measures of Central Tendency',
        category: 'Statistical Theory',
        score: 72, // Good
        lastAssessed: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];

    // 5. Courses with rich modules, topics, and all 5 learning resources
    this.courses = [
      {
        id: 'crs_data_viz',
        title: 'Data Visualization for Statistical Analysis',
        code: 'STAT-VIZ-201',
        description: 'Master cognitive chart selection, exploratory visual diagnostics, spatial thematic mapping, and executive dashboard design for official statistics and NSS/NFHS reports.',
        category: 'Data Analytics & Visualization',
        level: 'Intermediate',
        durationHours: 6,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        competencies: ['Data Visualization', 'Statistical Analysis', 'Government Data Management'],
        rating: 4.9,
        enrolledCount: 1420,
        modules: [
          {
            id: 'mod_viz_1',
            courseId: 'crs_data_viz',
            title: 'World 1: Visual Grammar & Chart Archetypes',
            order: 1,
            description: 'Foundations of cognitive visual encoding, misleading scales, and statistical perception.',
            topics: [
              {
                id: 'top_viz_1',
                moduleId: 'mod_viz_1',
                courseId: 'crs_data_viz',
                title: 'Level 1: Principles of Cognitive Perception in Statistical Charts',
                description: 'Explore Cleveland & McGill graphical perception rankings: position, length, slope, angle, area, and color hue in demographic representations.',
                order: 1,
                estimatedMinutes: 20,
                xpReward: 100,
                competency: 'Data Visualization',
                resources: [
                  {
                    id: 'res_viz_v1',
                    type: 'video',
                    title: 'Visual Perception & Chart Selection in Official Statistics',
                    description: 'Interactive lecture on human visual decoding and avoiding chartjunk in government releases.',
                    durationMinutes: 12,
                    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                  },
                  {
                    id: 'res_viz_e1',
                    type: 'ebook',
                    title: 'The Visual Grammar of Statistical Evidence',
                    description: 'Comprehensive handbook covering Cleveland perception models and MoSPI chart guidelines.',
                    chapters: [
                      {
                        title: 'Chapter 1: The Human Visual Cortex and Data Encodings',
                        content: 'When a statistical analyst presents demographic trends, the human brain processes visual elements along distinct pre-attentive attributes. Position along a common aligned scale delivers the highest perceptual accuracy, followed by length, direction, and angle. Areas and volume introduce non-linear cognitive biases that distort public understanding. Therefore, for official statistical bulletins, bar charts and line charts must always take precedence over 3D bubble spheres or exploded donut charts.'
                      },
                      {
                        title: 'Chapter 2: Baseline Zero and Ratio Comparisons',
                        content: 'Truncating the quantitative baseline zero in bar charts creates false variance perception. In official statistics, where decisions affect welfare funding and monetary policy, visual fidelity is paramount. When plotting indexed time-series, baseline normalization must be explicitly cited in the subtitle with error margins.'
                      },
                      {
                        title: 'Chapter 3: Color Accessibility in Public Portals',
                        content: 'Official government publications must comply with WCAG 2.1 AA accessibility standards. Monochromatic palettes and deuteranopia-safe ramps (such as Viridis or ColorBrewer diverging sets) ensure universal readability across civil services.'
                      }
                    ]
                  },
                  {
                    id: 'res_viz_p1',
                    type: 'pdf',
                    title: 'MoSPI Guidelines on Data Presentation & Dissemination.pdf',
                    description: 'Official Government of India manual for statistical tables and visual charts.',
                    pages: 24,
                    content: 'MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION - GOVERNMENT OF INDIA\n\nGUIDELINES FOR OFFICIAL STATISTICAL VISUALIZATIONS\n\nSection 4.1: Standard Visual Charting Norms\n1. Every statistical figure must feature a self-contained title, reference period, geographical domain, and source agency.\n2. Bar charts must originate at value zero.\n3. Projections or provisional estimates must be rendered with dashed stroke styles.\n4. When displaying national accounts, constant price series must be differentiated from current price series via distinct color keys.'
                  },
                  {
                    id: 'res_viz_g1',
                    type: 'game',
                    title: 'Knowledge Run: Chart Perception Sprint',
                    description: 'Run through the data sprint, dodge deceptive chart traps, and identify the optimal visualization archetype at each checkpoint!',
                    gameType: 'knowledge_run'
                  },
                  {
                    id: 'res_viz_q1',
                    type: 'quiz',
                    title: 'AI Adaptive Assessment: Visual Encoding & Perception',
                    description: 'Adaptive 5-question evaluation testing chart accuracy and cognitive perception.',
                    quizId: 'quiz_viz_1'
                  }
                ]
              },
              {
                id: 'top_viz_2',
                moduleId: 'mod_viz_1',
                courseId: 'crs_data_viz',
                title: 'Level 2: Distributional Visuals: Histograms, Boxplots & Violin Charts',
                description: 'Diagnosing skewness, multimodal clusters, and outlier thresholds in household survey datasets.',
                order: 2,
                estimatedMinutes: 25,
                xpReward: 120,
                competency: 'Data Visualization',
                resources: [
                  {
                    id: 'res_viz_v2',
                    type: 'video',
                    title: 'Distribution Plots: Beyond Simple Averages',
                    description: 'Demonstrating how 5-number summaries expose income inequality masked by standard means.',
                    durationMinutes: 14,
                    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
                  },
                  {
                    id: 'res_viz_e2',
                    type: 'ebook',
                    title: 'Visualizing Economic Distributions and Skewness',
                    description: 'Guide to quartile boundaries, interquartile ranges (IQR), and whisker limits.',
                    chapters: [
                      {
                        title: 'Chapter 1: The Anatomy of a Boxplot',
                        content: 'A Tukey boxplot encapsulates five critical summary metrics: minimum, first quartile (Q1), median (Q2), third quartile (Q3), and maximum. Observations extending beyond 1.5 times the IQR from the hinge are delineated as individual outlier points.'
                      }
                    ]
                  },
                  {
                    id: 'res_viz_g2',
                    type: 'game',
                    title: 'Knowledge Collector: Distribution Matcher',
                    description: 'Catch the correct statistical metrics falling from the data stream and match them to their visual charts!',
                    gameType: 'knowledge_collector'
                  },
                  {
                    id: 'res_viz_q2',
                    type: 'quiz',
                    title: 'AI Assessment: Distributional Chart Interpretation',
                    description: 'Interactive test on identifying skewness, outliers, and variance in official reports.',
                    quizId: 'quiz_viz_2'
                  }
                ]
              },
              {
                id: 'top_viz_3',
                moduleId: 'mod_viz_1',
                courseId: 'crs_data_viz',
                title: 'Level 3: Time Series & Thematic Choropleth Maps',
                description: 'Visualizing state-wise socio-economic indicators using GeoJSON boundary layers.',
                order: 3,
                estimatedMinutes: 30,
                xpReward: 140,
                competency: 'Data Visualization',
                resources: [
                  {
                    id: 'res_viz_v3',
                    type: 'video',
                    title: 'Choropleth Cartography for Indian District Statistics',
                    description: 'Handling boundary normalization and population density distortions.',
                    durationMinutes: 16
                  },
                  {
                    id: 'res_viz_g3',
                    type: 'game',
                    title: 'Logic Challenge: Geographic Data Anomaly Solver',
                    description: 'Solve spatial statistical puzzles by rebalancing map classification bins.',
                    gameType: 'logic_challenge'
                  }
                ]
              },
              {
                id: 'top_viz_boss',
                moduleId: 'mod_viz_1',
                courseId: 'crs_data_viz',
                title: 'BOSS LEVEL: National Statistical Dashboard Grand Challenge',
                description: 'Assemble a complete interactive dashboard under strict MoSPI compliance rules to unlock the next world!',
                order: 4,
                estimatedMinutes: 35,
                xpReward: 250,
                competency: 'Data Visualization',
                isBoss: true,
                resources: [
                  {
                    id: 'res_viz_boss',
                    type: 'game',
                    title: 'Boss Challenge: The MoSPI Chief Statistician Review',
                    description: 'Defeat the 10 boss questions with an 80%+ score to master the world!',
                    gameType: 'boss_challenge'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'crs_stat_inf',
        title: 'Statistical Inference & Hypothesis Testing',
        code: 'STAT-INF-301',
        description: 'Deep dive into null hypothesis testing, z-tests, t-tests, ANOVA, Chi-square independence tests, and p-value interpretation for policy evaluation.',
        category: 'Statistical Theory & Modeling',
        level: 'Intermediate',
        durationHours: 8,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        competencies: ['Statistical Inference', 'Statistical Analysis', 'Survey Methods & Sampling'],
        rating: 4.8,
        enrolledCount: 980,
        modules: [
          {
            id: 'mod_inf_1',
            courseId: 'crs_stat_inf',
            title: 'World 1: Sampling Distributions & Central Limit Theorem',
            order: 1,
            description: 'How sample means approximate normality regardless of the underlying population distribution.',
            topics: [
              {
                id: 'top_inf_1',
                moduleId: 'mod_inf_1',
                courseId: 'crs_stat_inf',
                title: 'Level 1: Central Limit Theorem and Standard Error',
                description: 'Calculate standard error of the mean across repeated random survey samples.',
                order: 1,
                estimatedMinutes: 25,
                xpReward: 110,
                competency: 'Statistical Inference',
                resources: [
                  {
                    id: 'res_inf_v1',
                    type: 'video',
                    title: 'Understanding the Central Limit Theorem in Sample Surveys',
                    description: 'Why n >= 30 ensures normality of sample means in official socio-economic surveys.',
                    durationMinutes: 15
                  },
                  {
                    id: 'res_inf_e1',
                    type: 'ebook',
                    title: 'Principles of Statistical Inference for Civil Servants',
                    description: 'Confidence interval formulation and sample size determination.',
                    chapters: [
                      {
                        title: 'Chapter 1: The Standard Error of the Mean',
                        content: 'The standard error of the mean (SE = sigma / sqrt(n)) quantifies the dispersion of sample means around the true population parameter. As sample size expands by factor 4, the margin of error is halved.'
                      }
                    ]
                  },
                  {
                    id: 'res_inf_g1',
                    type: 'game',
                    title: 'Knowledge Run: The Inferential Hypothesis Maze',
                    description: 'Sprint through statistical parameters, reject false nulls, and steer clear of Type I errors!',
                    gameType: 'knowledge_run'
                  },
                  {
                    id: 'res_inf_q1',
                    type: 'quiz',
                    title: 'AI Adaptive Assessment: Inference & Confidence Limits',
                    description: 'Adaptive questions evaluating hypothesis formulation, alpha thresholds, and test selection.',
                    quizId: 'quiz_inf_1'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'crs_python_data',
        title: 'Python for Official Statistical Analysis',
        code: 'PROG-PY-102',
        description: 'Harness Python, Pandas, NumPy, and Statsmodels to clean large-scale census datasets, execute sample weightings, and generate reproducible statistical summaries.',
        category: 'Programming & Computation',
        level: 'Beginner',
        durationHours: 10,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        competencies: ['Python for Data Analysis', 'Data Collection & Verification', 'Statistical Analysis'],
        rating: 4.9,
        enrolledCount: 2310,
        modules: [
          {
            id: 'mod_py_1',
            courseId: 'crs_python_data',
            title: 'World 1: Tabular Data Wrangling with Pandas',
            order: 1,
            description: 'Ingesting microdata, handling missing imputations, and grouped aggregates.',
            topics: [
              {
                id: 'top_py_1',
                moduleId: 'mod_py_1',
                courseId: 'crs_python_data',
                title: 'Level 1: DataFrames, Vectorized Operations & Survey Weights',
                description: 'Applying sampling multiplier weights across NSS rounds using vectorized Pandas operations.',
                order: 1,
                estimatedMinutes: 30,
                xpReward: 120,
                competency: 'Python for Data Analysis',
                resources: [
                  {
                    id: 'res_py_v1',
                    type: 'video',
                    title: 'Pandas for Official Statistical Data Processing',
                    description: 'Vectorized aggregations, pivot tables, and survey weighting scripts.',
                    durationMinutes: 18
                  },
                  {
                    id: 'res_py_g1',
                    type: 'game',
                    title: 'Knowledge Collector: Python Syntax Catcher',
                    description: 'Collect valid Pandas functions while dodging deprecated methods!',
                    gameType: 'knowledge_collector'
                  },
                  {
                    id: 'res_py_q1',
                    type: 'quiz',
                    title: 'AI Assessment: Pandas Data Pipelines',
                    description: 'Code comprehension and statistical data frame transformations.',
                    quizId: 'quiz_py_1'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'crs_stat_fundamentals',
        title: 'Fundamentals of Official Statistics in India',
        code: 'MOSPI-FND-101',
        description: 'Comprehensive orientation on India’s National Statistical System, National Accounts Statistics (NAS), Consumer Price Index (CPI), and Index of Industrial Production (IIP).',
        category: 'Official Statistics',
        level: 'Beginner',
        durationHours: 5,
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
        competencies: ['Measures of Central Tendency', 'Data Collection & Verification', 'Survey Methods & Sampling'],
        rating: 4.7,
        enrolledCount: 3840,
        modules: [
          {
            id: 'mod_fnd_1',
            courseId: 'crs_stat_fundamentals',
            title: 'World 1: Statistical Foundations & Central Tendency',
            order: 1,
            description: 'Averages, dispersion, and economic indices in public administration.',
            topics: [
              {
                id: 'top_fnd_1',
                moduleId: 'mod_fnd_1',
                courseId: 'crs_stat_fundamentals',
                title: 'Level 1: Measures of Central Tendency: Mean, Median & Mode',
                description: 'Compare arithmetic mean, geometric mean, and median in skewed economic indicators like per capita income.',
                order: 1,
                estimatedMinutes: 20,
                xpReward: 100,
                competency: 'Measures of Central Tendency',
                resources: [
                  {
                    id: 'res_fnd_v1',
                    type: 'video',
                    title: 'Mean, Median and Mode in Macroeconomic Aggregates',
                    description: 'Why median household income prevents outlier distortion compared to arithmetic mean.',
                    durationMinutes: 10
                  },
                  {
                    id: 'res_fnd_e1',
                    type: 'ebook',
                    title: 'Statistical Basics for Policy Makers',
                    description: 'Core manual on central tendencies and weighted aggregates.',
                    chapters: [
                      {
                        title: 'Chapter 1: The Median as a Robust Statistic',
                        content: 'In highly skewed distributions such as land ownership or rural household consumption expenditure, the median serves as a far more resilient descriptor than the arithmetic mean.'
                      }
                    ]
                  },
                  {
                    id: 'res_fnd_g1',
                    type: 'game',
                    title: 'Knowledge Run: Central Tendency Sprint',
                    description: 'Calculate midpoints and medians on the fly to navigate through obstacles!',
                    gameType: 'knowledge_run'
                  },
                  {
                    id: 'res_fnd_q1',
                    type: 'quiz',
                    title: 'AI Assessment: Central Tendency & Dispersion',
                    description: 'Evaluate mastery of mean, median, mode, and standard error.',
                    quizId: 'quiz_fnd_1'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'crs_survey_sampling',
        title: 'Survey Methods, Sampling Frames & CAPI Design',
        code: 'SURV-MTH-202',
        description: 'Techniques for building robust sampling frames, stratified multistage sampling in NSS rounds, and Computer Assisted Personal Interviewing (CAPI) workflow deployment.',
        category: 'Field Operations & Surveys',
        level: 'Intermediate',
        durationHours: 7,
        thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
        competencies: ['Survey Methods & Sampling', 'Data Collection & Verification'],
        rating: 4.8,
        enrolledCount: 1650,
        modules: []
      },
      {
        id: 'crs_adv_data_viz',
        title: 'Advanced Data Visualization & Statistical Dashboards',
        code: 'STAT-VIZ-401',
        description: 'Advanced interactive multivariate visual analytics, automated reporting engines, and executive dashboard engineering for senior administrative leadership.',
        category: 'Data Analytics & Visualization',
        level: 'Advanced',
        durationHours: 8,
        thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
        competencies: ['Data Visualization', 'Government Data Management'],
        rating: 4.95,
        enrolledCount: 520,
        modules: []
      },
      {
        id: 'crs_igot_ai_gov',
        title: 'iGOT: Artificial Intelligence for e-Governance & Public Statistics',
        code: 'IGOT-AIGOV-101',
        description: 'Curated iGOT Karmayogi course empowering government officers with modern LLMs, predictive analytics, and automated survey anomaly detection.',
        category: 'Artificial Intelligence & Governance',
        level: 'Beginner',
        durationHours: 4,
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        competencies: ['Data Collection & Verification', 'Government Data Management'],
        isIgot: true,
        igotProvider: 'Capacity Building Commission (CBC)',
        rating: 4.9,
        enrolledCount: 8400,
        modules: []
      },
      {
        id: 'crs_igot_macro_data',
        title: 'iGOT: National Accounts Statistics & Macroeconomic Aggregates',
        code: 'IGOT-NAS-202',
        description: 'Official CBC-certified curriculum on Gross Value Added (GVA), Gross Domestic Product (GDP), and Input-Output Transaction Tables (IOTT).',
        category: 'Official Statistics',
        level: 'Intermediate',
        durationHours: 6,
        thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
        competencies: ['Statistical Analysis', 'Measures of Central Tendency'],
        isIgot: true,
        igotProvider: 'National Statistical Systems Training Academy (NSSTA)',
        rating: 4.85,
        enrolledCount: 6200,
        modules: []
      }
    ];

    // 6. Seed Quizzes with high quality statistical questions & explanations
    this.quizzes = [
      {
        id: 'quiz_viz_1',
        topicId: 'top_viz_1',
        courseId: 'crs_data_viz',
        title: 'AI Adaptive Assessment: Visual Encoding & Perception',
        difficulty: 'Adaptive',
        isPublished: true,
        passingScorePercent: 80,
        questions: [
          {
            id: 'q_viz_1',
            quizId: 'quiz_viz_1',
            question: 'According to Cleveland & McGill graphical perception theory, which visual attribute enables humans to decode quantitative differences with the highest accuracy?',
            options: [
              'Position along a common aligned scale',
              'Direction and angle of line segments',
              'Area of two-dimensional shapes',
              'Color saturation and hue intensity'
            ],
            correctAnswer: 0,
            explanation: 'Position along a common aligned scale (e.g. aligned bar charts) delivers the highest perceptual accuracy because the human eye can directly judge relative length without geometric distortion.',
            difficulty: 'Easy',
            competency: 'Data Visualization',
            sourceReference: 'Cleveland, W. S., & McGill, R. (1984). Graphical Perception: Theory, Experimentation, and Application.',
            status: 'approved'
          },
          {
            id: 'q_viz_2',
            quizId: 'quiz_viz_1',
            question: 'Why is truncating the y-axis (omitting baseline zero) considered a critical defect in bar charts published by statistical agencies?',
            options: [
              'It causes file rendering latency in government portal PDF exports',
              'It exaggerates visual differences between categories by distorting proportional length',
              'It violates ISO 8601 calendar date formatting requirements',
              'It prevents color blind users from distinguishing adjacent columns'
            ],
            correctAnswer: 1,
            explanation: 'In a bar chart, the quantitative value is encoded by the total physical length of the bar. When the baseline zero is truncated, the ratio between visual bar heights no longer equals the ratio between the underlying data values.',
            difficulty: 'Medium',
            competency: 'Data Visualization',
            sourceReference: 'MoSPI Guidelines on Data Presentation, Section 4.2.1',
            status: 'approved'
          },
          {
            id: 'q_viz_3',
            quizId: 'quiz_viz_1',
            question: 'When presenting state-wise maternal mortality ratios (MMR) across Indian states, which visual representation best prevents population-size distortion?',
            options: [
              'A 3D pie chart with exploded regional slices',
              'A standard choropleth map without area normalization',
              'A cartogram or population-weighted choropleth with standardized classification bins',
              'A stacked area chart across arbitrary administrative codes'
            ],
            correctAnswer: 2,
            explanation: 'Geographical maps naturally draw attention to large land areas (like Rajasthan or Madhya Pradesh) regardless of population. A cartogram or normalized rate-based classification ensures fair demographic evaluation.',
            difficulty: 'Hard',
            competency: 'Data Visualization',
            sourceReference: 'SRS Statistical Report on Maternal Mortality in India',
            status: 'approved'
          },
          {
            id: 'q_viz_4',
            quizId: 'quiz_viz_1',
            question: 'What is the primary benefit of using a diverging color palette (e.g., Red-Neutral-Blue) over a sequential palette?',
            options: [
              'It uses fewer ink droplets during government printing',
              'It highlights deviations in both positive and negative directions from a critical neutral baseline or national target',
              'It eliminates the need for numeric axis tick labels',
              'It converts continuous variables directly into nominal categories'
            ],
            correctAnswer: 1,
            explanation: 'Diverging palettes feature two complementary hues radiating outward from a neutral midpoint (such as national average or zero change), allowing immediate identification of surplus vs deficit states.',
            difficulty: 'Medium',
            competency: 'Data Visualization',
            sourceReference: 'ColorBrewer Cartographic Design Standards',
            status: 'approved'
          },
          {
            id: 'q_viz_5',
            quizId: 'quiz_viz_1',
            question: 'In official dashboard design, what does the cognitive concept of "Preattentive Processing" allow users to accomplish?',
            options: [
              'Store confidential statistical microdata without database encryption',
              'Notice visual anomalies, outliers, and patterns in less than 250 milliseconds prior to conscious inspection',
              'Automatically translate statistical text into regional Indian languages',
              'Execute regression models directly within the browser GPU'
            ],
            correctAnswer: 1,
            explanation: 'Preattentive visual processing operates in the human subconscious vision layer within 200-250ms, allowing immediate identification of distinct colors, spatial positions, and sizes.',
            difficulty: 'Hard',
            competency: 'Data Visualization',
            sourceReference: 'Ware, C. (2019). Information Visualization: Perception for Design',
            status: 'approved'
          }
        ]
      },
      {
        id: 'quiz_inf_1',
        topicId: 'top_inf_1',
        courseId: 'crs_stat_inf',
        title: 'AI Assessment: Statistical Inference & Hypothesis Testing',
        difficulty: 'Adaptive',
        isPublished: true,
        passingScorePercent: 80,
        questions: [
          {
            id: 'q_inf_1',
            quizId: 'quiz_inf_1',
            question: 'Which statistical metric represents the standard deviation of the sampling distribution of a sample statistic?',
            options: [
              'Standard Error (SE)',
              'Variance Inflation Factor (VIF)',
              'Coefficient of Variation (CV)',
              'Interquartile Range (IQR)'
            ],
            correctAnswer: 0,
            explanation: 'The Standard Error (SE) quantifies the dispersion of a sample statistic across hypothetical repeated random samples drawn from the same parent population.',
            difficulty: 'Easy',
            competency: 'Statistical Inference',
            sourceReference: 'Freund, J. E. Mathematical Statistics, Ch 8.',
            status: 'approved'
          },
          {
            id: 'q_inf_2',
            quizId: 'quiz_inf_1',
            question: 'If a researcher sets the significance level alpha to 0.05 and obtains a p-value of 0.012 for a policy intervention, what is the appropriate statistical conclusion?',
            options: [
              'Accept the null hypothesis because p-value is below 1',
              'Reject the null hypothesis in favor of the alternative hypothesis',
              'Conclude the test was invalid due to sampling bias',
              'Increase alpha to 0.10 and re-run the test'
            ],
            correctAnswer: 1,
            explanation: 'Since the p-value (0.012) is strictly less than the significance threshold alpha (0.05), there is statistically significant evidence to reject the null hypothesis.',
            difficulty: 'Medium',
            competency: 'Statistical Inference',
            sourceReference: 'Wasserman, L. (2004). All of Statistics.',
            status: 'approved'
          }
        ]
      },
      {
        id: 'quiz_fnd_1',
        topicId: 'top_fnd_1',
        courseId: 'crs_stat_fundamentals',
        title: 'AI Assessment: Central Tendency & Dispersion',
        difficulty: 'Adaptive',
        isPublished: true,
        passingScorePercent: 80,
        questions: [
          {
            id: 'q_fnd_1',
            quizId: 'quiz_fnd_1',
            question: 'Which statistical measure represents the middle value of an ordered dataset?',
            options: [
              'Arithmetic Mean',
              'Median',
              'Mode',
              'Geometric Mean'
            ],
            correctAnswer: 1,
            explanation: 'The median represents the exact 50th percentile or middle score of a ranked distribution, dividing the sample into two equal halves.',
            difficulty: 'Easy',
            competency: 'Measures of Central Tendency',
            sourceReference: 'Central Statistics Office Statistical Primer',
            status: 'approved'
          }
        ]
      }
    ];

    // 7. Seed Achievements & Badges
    this.achievements = [
      {
        id: 'ach_first_steps',
        code: 'FIRST_STEPS',
        title: 'First Steps',
        description: 'Complete your first learning topic in the Official Statistical System.',
        icon: 'Compass',
        xpReward: 50
      },
      {
        id: 'ach_quiz_master',
        code: 'QUIZ_MASTER',
        title: 'Quiz Master',
        description: 'Score 90%+ in five AI-generated statistical quizzes.',
        icon: 'Award',
        xpReward: 150
      },
      {
        id: 'ach_knowledge_explorer',
        code: 'KNOWLEDGE_EXPLORER',
        title: 'Knowledge Explorer',
        description: 'Complete ten topics across video, reading, and interactive modes.',
        icon: 'BookOpen',
        xpReward: 200
      },
      {
        id: 'ach_course_champion',
        code: 'COURSE_CHAMPION',
        title: 'Course Champion',
        description: 'Achieve 100% completion in any official capacity building course.',
        icon: 'Trophy',
        xpReward: 500
      },
      {
        id: 'ach_7day_streak',
        code: '7_DAY_STREAK',
        title: '7 Day Streak',
        description: 'Maintain continuous learning activity for seven consecutive days.',
        icon: 'Flame',
        xpReward: 250
      },
      {
        id: 'ach_game_master',
        code: 'GAME_MASTER',
        title: 'Game Master',
        description: 'Triumph in ten educational game challenges and boss encounters.',
        icon: 'Gamepad2',
        xpReward: 300
      },
      {
        id: 'ach_ai_challenger',
        code: 'AI_CHALLENGER',
        title: 'AI Challenger',
        description: 'Complete twenty adaptive AI statistical quizzes with dynamic adjustments.',
        icon: 'Sparkles',
        xpReward: 400
      }
    ];

    // Award initial 7 Day Streak badge to demo learner
    this.learnerAchievements.push({
      learnerId: 'usr_learner_1',
      achievementId: 'ach_7day_streak',
      unlockedAt: new Date(Date.now() - 86400000).toISOString()
    });
    this.learnerAchievements.push({
      learnerId: 'usr_learner_1',
      achievementId: 'ach_first_steps',
      unlockedAt: new Date(Date.now() - 86400000 * 6).toISOString()
    });

    // 7b. Seed Learner Module and Topic Progress
    this.learnerProgress = [
      {
        id: 'prog_init_1',
        learnerId: 'usr_learner_1',
        courseId: 'crs_data_viz',
        topicId: 'top_viz_1',
        videoCompleted: true,
        ebookCompleted: true,
        pdfCompleted: true,
        gameCompleted: true,
        quizCompleted: true,
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'prog_init_2',
        learnerId: 'usr_learner_1',
        courseId: 'crs_data_viz',
        topicId: 'top_viz_2',
        videoCompleted: true,
        ebookCompleted: true,
        pdfCompleted: true,
        gameCompleted: false,
        quizCompleted: true,
        completedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'prog_init_3',
        learnerId: 'usr_learner_1',
        courseId: 'crs_stat_fundamentals',
        topicId: 'top_fnd_1',
        videoCompleted: true,
        ebookCompleted: true,
        pdfCompleted: true,
        gameCompleted: true,
        quizCompleted: true,
        completedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ];

    // 8. Seed Uploaded Materials (Trainer demo scenario)
    this.uploadedMaterials = [
      {
        id: 'mat_mospi_manual',
        filename: 'MoSPI_National_Statistical_Sampling_Manual_2025.pdf',
        fileType: 'pdf',
        fileSize: 4200000,
        uploadedBy: 'usr_trainer_1',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        chunkCount: 18,
        status: 'quiz_ready',
        extractedTextPreview: 'Chapter 3: Sampling Frames and Multistage Stratified Selection in Rural and Urban Blocks...',
        textContent: `NATIONAL STATISTICAL OFFICE - MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
TECHNICAL MANUAL ON SAMPLE SURVEY DESIGN AND DATA DISSEMINATION

1. SAMPLING FRAME DESIGN AND DUAL-FRAME ESTIMATION
The ultimate sampling units in rural domains comprise Census Enumeration Blocks (CEBs) or villages delineated during the 2011 Population Census, updated continuously via the Urban Frame Survey (UFS). Stratification is carried out by grouping contiguous sub-districts with homogeneous agricultural cropping patterns and demographic densities.

2. COMPUTER ASSISTED PERSONAL INTERVIEWING (CAPI) PROTOCOLS
To minimize non-sampling errors arising from manual transcription and recall degradation, field investigators employ tablet-based CAPI validation scripts. Real-time parity checks enforce logical constraints: total reported monthly per capita expenditure (MPCE) cannot be less than primary food expenditure, and age must be consistent with educational attainment indicators.

3. DATA VISUALIZATION AND REPORTING METRICS
When disseminating national survey outcomes, statistical officers must utilize standard visual conventions:
- Bar charts must feature an explicit zero baseline to avoid visual exaggeration.
- Error bands representing 95% confidence intervals must accompany all regional estimates where the coefficient of variation (CV) exceeds 15%.
- Scatter plots illustrating bivariate relationships between income and nutritional caloric intake must indicate the loess or linear regression trendline alongside the determination coefficient (R-squared).`,
        suggestedCompetencies: ['Data Visualization', 'Survey Methods & Sampling', 'Data Collection & Verification']
      }
    ];

    // 9. Seed iGOT Karmayogi Courses
    this.igotCourses = [
      {
        id: 'igot_crs_1',
        igotId: 'IGOT-CBC-STAT-01',
        title: 'Principles of Evidence-Based Policy Making in Official Statistics',
        provider: 'Capacity Building Commission (CBC)',
        category: 'Governance & Public Administration',
        competencyMapped: 'Statistical Analysis',
        duration: '5 hours',
        rating: 4.88,
        enrolledCount: 12400,
        lastSynced: new Date().toISOString(),
        url: 'https://igot-karmayogi.gov.in/learn/course/IGOT-CBC-STAT-01',
        description: 'Comprehensive curriculum on translating survey microdata into cabinet briefing memos and policy interventions.'
      },
      {
        id: 'igot_crs_2',
        igotId: 'IGOT-NSSTA-VIZ-04',
        title: 'Visual Storytelling for National Socio-Economic Reports',
        provider: 'National Statistical Systems Training Academy (NSSTA)',
        category: 'Data Analytics & Visualization',
        competencyMapped: 'Data Visualization',
        duration: '4 hours',
        rating: 4.92,
        enrolledCount: 8900,
        lastSynced: new Date().toISOString(),
        url: 'https://igot-karmayogi.gov.in/learn/course/IGOT-NSSTA-VIZ-04',
        description: 'Designing accessible infographics, executive briefs, and interactive portals for government data dissemination.'
      },
      {
        id: 'igot_crs_3',
        igotId: 'IGOT-MOSPI-INF-09',
        title: 'Advanced Econometrics & Time Series Analysis for Price Indices',
        provider: 'National Statistical Systems Training Academy (NSSTA)',
        category: 'Statistical Theory & Modeling',
        competencyMapped: 'Statistical Inference',
        duration: '7 hours',
        rating: 4.81,
        enrolledCount: 5600,
        lastSynced: new Date().toISOString(),
        url: 'https://igot-karmayogi.gov.in/learn/course/IGOT-MOSPI-INF-09',
        description: 'Seasonal adjustments, ARIMA forecasting, and hedonic quality adjustment for the Consumer Price Index (CPI).'
      }
    ];

    // 10. Initial Notifications
    this.notifications = [
      {
        id: 'notif_1',
        userId: 'usr_learner_1',
        title: 'New Personalized Learning Path Generated',
        message: 'Based on your B.Sc Mathematics background and Data Visualization gap (38%), we have prepared an adaptive path for you.',
        type: 'recommendation',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'notif_2',
        userId: 'usr_learner_1',
        title: '🔥 7-Day Streak Achieved!',
        message: 'You have logged continuous learning for 7 days. +250 XP bonus awarded!',
        type: 'streak',
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'notif_3',
        userId: 'usr_learner_1',
        title: 'iGOT Karmayogi Course Synced',
        message: 'Visual Storytelling for National Socio-Economic Reports is now mapped to your competency profile.',
        type: 'igot',
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }
}

export const db = new DatabaseStore();
