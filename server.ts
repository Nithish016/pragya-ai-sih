import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { chromaVectorStore } from './server/vector_store.js';
import { generateQuizQuestionsFromChunks, generateAIExplanation, generateDailyNugget } from './server/gemini.js';
import { generatePersonalizedRecommendations } from './server/services/recommendation_engine.js';
import { igotService } from './server/services/igot_service.js';
import { generateToken, verifyToken, getUserByEmail, getUserById, TokenPayload } from './server/services/auth_service.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Auth Middleware
interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Default to demo learner if unauthenticated for seamless preview experience
    req.user = {
      userId: 'usr_learner_1',
      email: 'ananya.sharma@mospi.gov.in',
      role: 'learner',
      name: 'Ananya Sharma'
    };
    return next();
  }

  const verified = verifyToken(token);
  if (!verified) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }

  req.user = verified;
  next();
}

// ----------------------------------------------------
// AUTH & USERS
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password, name, role, department } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  // If user does not exist in memory DB, register them dynamically with their own email
  if (!user) {
    const emailPrefix = cleanEmail.split('@')[0];
    const derivedName =
      name ||
      emailPrefix
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') ||
      'Officer';

    const assignedRole = (role || 'learner') as any;
    const isGov = cleanEmail.endsWith('.gov.in') || cleanEmail.endsWith('.nic.in');

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      passwordHash: 'hashed_pwd',
      name: derivedName,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}&backgroundColor=0f2942,1e3a8a,f59e0b`,
      department: department || (isGov ? 'Ministry of Statistics & Programme Implementation' : 'Civil Services Capacity Wing'),
      organization: isGov ? 'Government of India' : 'National Civil Services Cadre',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    user = newUser;

    // Create profile
    db.learnerProfiles.set(user.id, {
      userId: user.id,
      educationLevel: 'Graduate',
      degree: 'Public Administration & Data Analytics',
      specialization: 'Civil Services Policy & Statistics',
      currentRole: assignedRole === 'admin' ? 'System Administrator' : assignedRole === 'trainer' ? 'Cadre Trainer' : 'Statistical Analyst / Officer',
      department: user.department,
      experienceLevel: 'Intermediate',
      interests: ['Data Science', 'Statistics', 'AI in Governance', 'Data Visualization', 'Official Statistics'],
      skills: ['Statistics', 'Excel', 'Policy Analysis', 'Governance'],
      learningGoals: ['Improve Statistical Analytics', 'Digital Transformation in Governance'],
      preferredFormats: ['video', 'reading', 'games', 'quizzes'],
      level: 2,
      xp: 450,
      xpToNextLevel: 1000,
      streakDays: 3,
      streakHistory: [
        { date: 'Fri', active: true },
        { date: 'Sat', active: true },
        { date: 'Sun', active: true }
      ],
      coins: 200
    });
  }

  const token = generateToken(user);
  res.json({ token, user });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, role, department, organization } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const existing = getUserByEmail(cleanEmail);
  if (existing) {
    if (name) existing.name = name;
    if (role) existing.role = role;
    if (department) existing.department = department;
    const token = generateToken(existing);
    return res.json({ token, user: existing });
  }

  const emailPrefix = cleanEmail.split('@')[0];
  const derivedName =
    name ||
    emailPrefix
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') ||
    'Statistical Officer';

  const isGov = cleanEmail.endsWith('.gov.in') || cleanEmail.endsWith('.nic.in');

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    passwordHash: 'hashed_pwd',
    name: derivedName,
    role: (role || 'learner') as any,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}&backgroundColor=0f2942,1e3a8a,f59e0b`,
    department: department || (isGov ? 'Ministry of Statistics & Programme Implementation' : 'Civil Services Capacity Wing'),
    organization: organization || (isGov ? 'Government of India' : 'MoSPI & iGOT Council'),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  db.learnerProfiles.set(newUser.id, {
    userId: newUser.id,
    educationLevel: 'Undergraduate',
    degree: 'B.Sc Statistics & Mathematics',
    specialization: 'Applied Statistics',
    currentRole: newUser.role === 'admin' ? 'System Administrator' : newUser.role === 'trainer' ? 'Cadre Trainer' : 'Statistical Analyst',
    department: newUser.department,
    experienceLevel: 'Entry',
    interests: ['Data Science', 'Statistics', 'Data Visualization', 'Official Statistics'],
    skills: ['Statistics', 'Excel', 'Data Analysis'],
    learningGoals: ['Improve Data Analytics', 'Master Official Statistical Dissemination'],
    preferredFormats: ['video', 'reading', 'games', 'quizzes'],
    level: 1,
    xp: 100,
    xpToNextLevel: 500,
    streakDays: 1,
    streakHistory: [{ date: 'Today', active: true }],
    coins: 100
  });

  const token = generateToken(newUser);
  res.status(201).json({ token, user: newUser });
});

app.get('/api/users/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = getUserById(req.user!.userId) || db.users[0];
  const profile = db.learnerProfiles.get(user.id);
  res.json({ user, profile });
});

app.put('/api/users/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = getUserById(req.user!.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (req.body.name) user.name = req.body.name;
  if (req.body.department) user.department = req.body.department;
  if (req.body.role) user.role = req.body.role;

  res.json({ user });
});

// ----------------------------------------------------
// ONBOARDING
// ----------------------------------------------------
app.post('/api/onboarding', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const {
    educationLevel,
    degree,
    specialization,
    institution,
    currentRole,
    department,
    experienceLevel,
    interests,
    skills,
    learningGoals,
    preferredFormats
  } = req.body;

  const profile = db.learnerProfiles.get(userId) || {
    userId,
    level: 1,
    xp: 0,
    xpToNextLevel: 500,
    streakDays: 1,
    streakHistory: [{ date: 'Today', active: true }],
    coins: 50,
    educationLevel: '',
    degree: '',
    specialization: '',
    currentRole: '',
    department: '',
    experienceLevel: 'Entry',
    interests: [],
    skills: [],
    learningGoals: [],
    preferredFormats: []
  };

  profile.educationLevel = educationLevel || profile.educationLevel;
  profile.degree = degree || profile.degree;
  profile.specialization = specialization || profile.specialization;
  profile.institution = institution || profile.institution;
  profile.currentRole = currentRole || profile.currentRole;
  profile.department = department || profile.department;
  profile.experienceLevel = experienceLevel || profile.experienceLevel;
  profile.interests = interests || profile.interests;
  profile.skills = skills || profile.skills;
  profile.learningGoals = learningGoals || profile.learningGoals;
  profile.preferredFormats = preferredFormats || profile.preferredFormats;

  db.learnerProfiles.set(userId, profile);
  res.json({ success: true, profile });
});

// ----------------------------------------------------
// COMPETENCIES & GAP ANALYSIS
// ----------------------------------------------------
app.get('/api/competencies/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const profile = db.learnerProfiles.get(userId) || db.learnerProfiles.get('usr_learner_1');
  const role = profile?.currentRole || 'Statistical Analyst';

  const userCompetencies = db.learnerCompetencies.filter((c) => c.learnerId === userId);
  // If not present for this user, clone default scores
  const results = db.competencies.map((comp) => {
    const existing = userCompetencies.find((c) => c.competencyId === comp.id);
    const score = existing ? existing.score : 45;
    const requiredScore = comp.requiredForRoles[role] || 80;
    const gap = Math.max(0, requiredScore - score);

    let status = 'good';
    if (score >= 80) status = 'strong';
    else if (score >= 60) status = 'good';
    else if (score >= 40) status = 'developing';
    else status = 'critical_gap';

    return {
      competencyId: comp.id,
      name: comp.name,
      category: comp.category,
      description: comp.description,
      score,
      requiredScore,
      gap,
      status,
      lastAssessed: existing?.lastAssessed || new Date().toISOString()
    };
  });

  res.json(results);
});

app.get('/api/competencies/gaps', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const profile = db.learnerProfiles.get(userId) || db.learnerProfiles.get('usr_learner_1');
  const role = profile?.currentRole || 'Statistical Analyst';

  const userCompetencies = db.learnerCompetencies.filter((c) => c.learnerId === userId);
  const gaps = db.competencies
    .map((comp) => {
      const existing = userCompetencies.find((c) => c.competencyId === comp.id);
      const score = existing ? existing.score : 45;
      const requiredScore = comp.requiredForRoles[role] || 80;
      const gap = Math.max(0, requiredScore - score);

      let status = 'good';
      if (score >= 80) status = 'strong';
      else if (score >= 60) status = 'good';
      else if (score >= 40) status = 'developing';
      else status = 'critical_gap';

      return {
        competencyId: comp.id,
        name: comp.name,
        category: comp.category,
        score,
        requiredScore,
        gap,
        status
      };
    })
    .sort((a, b) => b.gap - a.gap);

  const criticalGaps = gaps.filter((g) => g.status === 'critical_gap');
  const developingGaps = gaps.filter((g) => g.status === 'developing');

  res.json({
    role,
    criticalGaps,
    developingGaps,
    allGaps: gaps
  });
});

app.post('/api/competencies/assessment', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { answers } = req.body; // e.g. { comp_data_viz: 38, comp_stat_inf: 42, comp_python_data: 48 }

  // Update learner competency entries
  for (const [compId, score] of Object.entries(answers || {})) {
    const existing = db.learnerCompetencies.find((c) => c.learnerId === userId && c.competencyId === compId);
    if (existing) {
      existing.score = score as number;
      existing.lastAssessed = new Date().toISOString();
    } else {
      const compDef = db.competencies.find((c) => c.id === compId);
      db.learnerCompetencies.push({
        learnerId: userId,
        competencyId: compId,
        competencyName: compDef?.name || compId,
        category: compDef?.category || 'General',
        score: score as number,
        lastAssessed: new Date().toISOString()
      });
    }
  }

  // Award onboarding assessment XP
  const profile = db.learnerProfiles.get(userId);
  if (profile) {
    profile.xp += 100;
  }

  res.json({
    success: true,
    message: 'Competency baseline assessment completed successfully',
    updatedGaps: db.learnerCompetencies.filter((c) => c.learnerId === userId)
  });
});

// ----------------------------------------------------
// RECOMMENDATIONS
// ----------------------------------------------------
app.get('/api/recommendations', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const recs = generatePersonalizedRecommendations(userId);
  res.json(recs);
});

app.get('/api/recommendations/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const recs = generatePersonalizedRecommendations(userId);
  const found = recs.find((r) => r.courseId === req.params.id);
  if (!found) return res.status(404).json({ error: 'Recommendation not found' });
  res.json(found);
});

// ----------------------------------------------------
// COURSES & TOPICS
// ----------------------------------------------------
app.get('/api/courses', (req, res) => {
  const category = req.query.category as string;
  let list = db.courses;
  if (category) {
    list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }
  res.json(list);
});

app.get('/api/courses/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const course = db.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // Attach learner topic completion statuses
  const userId = req.user!.userId;
  const progressEntries = db.learnerProgress.filter((p) => p.learnerId === userId && p.courseId === course.id);

  // Return course with calculated module & topic statuses
  const enrichedModules = course.modules.map((mod) => {
    let previousTopicCompleted = true;
    const enrichedTopics = mod.topics.map((top, idx) => {
      const progress = progressEntries.find((p) => p.topicId === top.id);
      let status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED' = 'LOCKED';

      if (progress && (progress.quizCompleted || progress.gameCompleted)) {
        status = 'COMPLETED';
        previousTopicCompleted = true;
      } else if (idx === 0 || previousTopicCompleted) {
        status = progress ? 'IN_PROGRESS' : 'AVAILABLE';
        previousTopicCompleted = false;
      }

      return {
        ...top,
        status,
        progress: progress || {
          videoCompleted: false,
          ebookCompleted: false,
          pdfCompleted: false,
          gameCompleted: false,
          quizCompleted: false
        }
      };
    });

    return {
      ...mod,
      topics: enrichedTopics
    };
  });

  res.json({
    ...course,
    modules: enrichedModules
  });
});

app.post('/api/courses', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { title, code, description, category, level, durationHours, competencies, thumbnail } = req.body;
  const newCourse: any = {
    id: `crs_${Date.now()}`,
    title,
    code: code || `STAT-${Math.floor(100 + Math.random() * 900)}`,
    description,
    category: category || 'Official Statistics',
    level: level || 'Intermediate',
    durationHours: Number(durationHours) || 6,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    competencies: competencies || ['Data Visualization'],
    modules: [],
    rating: 5.0,
    enrolledCount: 1
  };
  db.courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.get('/api/topics/:id', (req, res) => {
  for (const c of db.courses) {
    for (const m of c.modules) {
      const top = m.topics.find((t) => t.id === req.params.id);
      if (top) {
        return res.json({ topic: top, course: c, module: m });
      }
    }
  }
  res.status(404).json({ error: 'Topic not found' });
});

// ----------------------------------------------------
// DAILY NUGGET & SPACED RETENTION
// ----------------------------------------------------
app.get('/api/daily-nugget', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId || 'usr_learner_1';
    const profile = db.learnerProfiles.get(userId);
    const requestedTopicId = req.query.topicId as string;

    // Collect topics from current learning path (active enrolled course + top recommended courses)
    // Priority: in-progress course (crs_data_viz), then other courses in learning path
    const candidateTopics: {
      id: string;
      title: string;
      description: string;
      competency: string;
      courseId: string;
      courseTitle: string;
      chaptersContent?: string;
    }[] = [];

    for (const course of db.courses) {
      for (const module of course.modules) {
        for (const topic of module.topics) {
          // Extract chapter content from ebook/reading resources if available for deeper AI grounding
          let chaptersContent = '';
          const ebookRes = topic.resources.find((r) => r.type === 'ebook');
          if (ebookRes && ebookRes.chapters) {
            chaptersContent = ebookRes.chapters.map((c) => `${c.title}: ${c.content}`).join('\n\n');
          } else {
            chaptersContent = topic.resources.map((r) => `${r.title}: ${r.description}`).join('\n');
          }

          candidateTopics.push({
            id: topic.id,
            title: topic.title,
            description: topic.description,
            competency: topic.competency,
            courseId: course.id,
            courseTitle: course.title,
            chaptersContent
          });
        }
      }
    }

    if (candidateTopics.length === 0) {
      return res.status(404).json({ error: 'No learning path topics found' });
    }

    // Select topic: specific topic if requested, else random topic from learner's path
    let selectedTopic = candidateTopics[0];
    if (requestedTopicId) {
      const found = candidateTopics.find((t) => t.id === requestedTopicId);
      if (found) selectedTopic = found;
    } else {
      // Pick random topic from candidate list to ensure fresh daily retention
      const randomIndex = Math.floor(Math.random() * candidateTopics.length);
      selectedTopic = candidateTopics[randomIndex];
    }

    const nugget = await generateDailyNugget({
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      topicDescription: selectedTopic.description,
      courseId: selectedTopic.courseId,
      courseTitle: selectedTopic.courseTitle,
      competency: selectedTopic.competency,
      chaptersContent: selectedTopic.chaptersContent,
      userRole: profile?.currentRole || 'Learner'
    });

    res.json({
      nugget,
      learningPathTopics: candidateTopics.map((t) => ({
        id: t.id,
        title: t.title,
        courseTitle: t.courseTitle,
        competency: t.competency
      }))
    });
  } catch (error: any) {
    console.error('Error generating daily nugget:', error);
    res.status(500).json({ error: 'Failed to generate daily retention nugget' });
  }
});

app.post('/api/daily-nugget/complete', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId || 'usr_learner_1';
  const { topicId, nuggetId, wasCorrect } = req.body;

  const profile = db.learnerProfiles.get(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Learner profile not found' });
  }

  const xpReward = wasCorrect ? 25 : 15;
  const coinReward = wasCorrect ? 10 : 5;

  profile.xp += xpReward;
  profile.coins += coinReward;

  // Record transaction
  db.xpTransactions.push({
    id: `tx_${Date.now()}`,
    learnerId: userId,
    amount: xpReward,
    source: 'Daily Retention Nugget Mastery',
    referenceId: nuggetId || topicId,
    createdAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `Earned +${xpReward} XP & +${coinReward} Karma Points!`,
    xpEarned: xpReward,
    coinsEarned: coinReward,
    totalXp: profile.xp,
    totalCoins: profile.coins,
    level: profile.level
  });
});


// ----------------------------------------------------
// DOCUMENT PROCESSING & VECTOR PIPELINE
// ----------------------------------------------------
app.post('/api/documents/upload', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { filename, fileType, textContent, fileSize } = req.body;

  if (!textContent || textContent.trim().length === 0) {
    return res.status(400).json({ error: 'No text content provided for extraction' });
  }

  const docId = `mat_${Date.now()}`;
  const detectedCompetencies: string[] = [];

  if (textContent.toLowerCase().includes('visual') || textContent.toLowerCase().includes('chart')) {
    detectedCompetencies.push('Data Visualization');
  }
  if (textContent.toLowerCase().includes('sampling') || textContent.toLowerCase().includes('survey')) {
    detectedCompetencies.push('Survey Methods & Sampling');
  }
  if (textContent.toLowerCase().includes('hypothesis') || textContent.toLowerCase().includes('error')) {
    detectedCompetencies.push('Statistical Inference');
  }
  if (detectedCompetencies.length === 0) detectedCompetencies.push('Official Statistics');

  // Chunk and store in Chroma vector store
  const chunks = chromaVectorStore.addDocument(docId, textContent, {
    filename,
    competency: detectedCompetencies[0],
    difficulty: 'Intermediate'
  });

  const materialEntry: any = {
    id: docId,
    filename,
    fileType: fileType || 'pdf',
    fileSize: fileSize || textContent.length * 2,
    uploadedBy: req.user!.userId,
    uploadedAt: new Date().toISOString(),
    chunkCount: chunks.length,
    status: 'quiz_ready',
    extractedTextPreview: textContent.slice(0, 300) + '...',
    textContent,
    suggestedCompetencies: detectedCompetencies
  };

  db.uploadedMaterials.unshift(materialEntry);

  res.status(201).json({
    document: materialEntry,
    chunksIndexed: chunks.length,
    vectorStoreTotal: chromaVectorStore.getChunkCount()
  });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = db.uploadedMaterials.find((m) => m.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});

// ----------------------------------------------------
// AI QUIZ GENERATION & TRAINER REVIEW WORKFLOW
// ----------------------------------------------------
app.post('/api/quizzes/generate', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { documentId, count = 5, difficulty = 'Medium', competency = 'Data Visualization' } = req.body;

  // Retrieve relevant semantic chunks from Chroma vector store
  const searchResults = chromaVectorStore.query(competency, {
    topK: 4,
    filterDocumentId: documentId
  });

  const contextChunks = searchResults.map((r) => r.chunk.text);
  if (contextChunks.length === 0) {
    contextChunks.push(`Official statistical manual on ${competency}. Adhere to MoSPI standards.`);
  }

  // Call Gemini AI or fallback
  const generatedQuestions = await generateQuizQuestionsFromChunks(
    contextChunks,
    Number(count) || 5,
    difficulty,
    competency
  );

  const quizId = `quiz_${Date.now()}`;
  const newQuiz: any = {
    id: quizId,
    title: `AI Assessment: ${competency}`,
    difficulty,
    isPublished: false, // Trainer review required before publication!
    createdBy: req.user!.userId,
    sourceDocument: documentId,
    passingScorePercent: 80,
    questions: generatedQuestions.map((q, idx) => ({
      id: `q_gen_${Date.now()}_${idx + 1}`,
      quizId,
      ...q,
      status: 'pending_review' // Trainer must approve
    }))
  };

  db.quizzes.push(newQuiz);
  res.status(201).json(newQuiz);
});

app.get('/api/quizzes', (req, res) => {
  res.json(db.quizzes);
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = db.quizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

// Trainer Quiz Review: Approve, Edit, Regenerate, Reject
app.put('/api/trainer/quizzes/:id/review', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const quiz = db.quizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const { action, questionId, editedQuestion, isPublished } = req.body;

  if (typeof isPublished === 'boolean') {
    quiz.isPublished = isPublished;
  }

  if (questionId) {
    const qIndex = quiz.questions.findIndex((q) => q.id === questionId);
    if (qIndex !== -1) {
      if (action === 'approve') {
        quiz.questions[qIndex].status = 'approved';
      } else if (action === 'reject') {
        quiz.questions[qIndex].status = 'rejected';
      } else if (action === 'edit' && editedQuestion) {
        quiz.questions[qIndex] = { ...quiz.questions[qIndex], ...editedQuestion, status: 'approved' };
      } else if (action === 'regenerate') {
        const regenerated = await generateQuizQuestionsFromChunks(
          [quiz.questions[qIndex].question],
          1,
          quiz.questions[qIndex].difficulty,
          quiz.questions[qIndex].competency
        );
        if (regenerated.length > 0) {
          quiz.questions[qIndex] = {
            id: quiz.questions[qIndex].id,
            quizId: quiz.id,
            ...regenerated[0],
            status: 'pending_review'
          };
        }
      }
    }
  }

  res.json(quiz);
});

// Quiz Submission with Adaptive Difficulty & Dynamic Competency Update
app.post('/api/quizzes/:id/submit', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const quiz = db.quizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const { answers, topicId } = req.body; // array of { questionId, selectedOption }
  const profile = db.learnerProfiles.get(userId) || db.learnerProfiles.get('usr_learner_1')!;

  let correctCount = 0;
  const answerEvaluations = [];
  const adaptivePath = [];

  for (const userAns of answers || []) {
    const q = quiz.questions.find((question) => question.id === userAns.questionId);
    if (q) {
      const isCorrect = userAns.selectedOption === q.correctAnswer;
      if (isCorrect) correctCount++;

      adaptivePath.push({
        questionId: q.id,
        difficulty: q.difficulty,
        correct: isCorrect
      });

      answerEvaluations.push({
        questionId: q.id,
        question: q.question,
        selectedOption: userAns.selectedOption,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        competency: q.competency,
        sourceReference: q.sourceReference
      });
    }
  }

  const totalQuestions = quiz.questions.length || 1;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= (quiz.passingScorePercent || 80);

  // Gamification: XP & Coins
  const xpEarned = passed ? 100 : 40;
  const coinsEarned = passed ? 50 : 15;

  profile.xp += xpEarned;
  profile.coins += coinsEarned;

  // Level Up check
  let levelUp = undefined;
  if (profile.xp >= profile.xpToNextLevel) {
    const previousLevel = profile.level;
    profile.level += 1;
    profile.xpToNextLevel = Math.round(profile.xpToNextLevel * 1.6);
    levelUp = { previousLevel, newLevel: profile.level };
  }

  // Crucial SIH Demonstration: Dynamic Competency Update!
  // If user scores well, bump competency score!
  // E.g. Data Visualization 38% -> 52%
  const updatedCompetencies = [];
  const compName = quiz.questions[0]?.competency || 'Data Visualization';
  const learnerComp = db.learnerCompetencies.find(
    (c) => c.learnerId === userId && c.competencyName.toLowerCase() === compName.toLowerCase()
  );

  if (learnerComp) {
    const prev = learnerComp.score;
    let boost = Math.round((percentage / 100) * 16);
    learnerComp.score = Math.min(100, learnerComp.score + boost);
    learnerComp.lastAssessed = new Date().toISOString();
    updatedCompetencies.push({
      competencyName: compName,
      previousScore: prev,
      newScore: learnerComp.score
    });
  }

  // Update learner progress for this topic
  if (topicId) {
    let progress = db.learnerProgress.find((p) => p.learnerId === userId && p.topicId === topicId);
    if (!progress) {
      progress = {
        id: `prog_${Date.now()}`,
        learnerId: userId,
        courseId: quiz.courseId || 'crs_data_viz',
        topicId,
        videoCompleted: true,
        ebookCompleted: true,
        pdfCompleted: true,
        gameCompleted: true,
        quizCompleted: true,
        completedAt: new Date().toISOString()
      };
      db.learnerProgress.push(progress);
    } else {
      progress.quizCompleted = true;
      progress.completedAt = new Date().toISOString();
    }
  }

  res.json({
    attemptId: `att_${Date.now()}`,
    quizId: quiz.id,
    topicId,
    score: correctCount,
    totalQuestions,
    percentage,
    passed,
    xpEarned,
    coinsEarned,
    adaptivePath,
    answers: answerEvaluations,
    updatedCompetencies,
    levelUp,
    newProfileStats: {
      xp: profile.xp,
      level: profile.level,
      xpToNextLevel: profile.xpToNextLevel,
      coins: profile.coins
    }
  });
});

// AI Explanation endpoint for instant question breakdown
app.post('/api/quizzes/explain', async (req, res) => {
  const { question, selectedOption, correctOption, isCorrect, competency } = req.body;
  const explanation = await generateAIExplanation(
    question,
    selectedOption,
    correctOption,
    Boolean(isCorrect),
    competency || 'Data Visualization'
  );
  res.json({ explanation });
});

// ----------------------------------------------------
// EDUCATIONAL GAMES
// ----------------------------------------------------
app.post('/api/games/:id/start', authenticateToken, (req: AuthenticatedRequest, res) => {
  const gameType = req.params.id; // 'knowledge_run' | 'knowledge_collector' | 'boss_challenge' | 'logic_challenge'
  res.json({
    sessionId: `game_${Date.now()}`,
    gameType,
    status: 'active',
    initialLives: 3,
    initialCoins: 0,
    checkpoints: [
      { id: 1, title: 'Cleveland Perception Checkpoint' },
      { id: 2, title: 'Zero Baseline Verification Gate' },
      { id: 3, title: 'Choropleth Projection Portal' },
      { id: 4, title: 'Statistical Integrity Finish Line' }
    ]
  });
});

app.post('/api/games/:id/complete', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { score, coins, livesRemaining, topicId } = req.body;
  const profile = db.learnerProfiles.get(userId) || db.learnerProfiles.get('usr_learner_1')!;

  const xpEarned = 100 + (score || 0) * 10;
  profile.xp += xpEarned;
  profile.coins += Number(coins) || 30;

  if (topicId) {
    const progress = db.learnerProgress.find((p) => p.learnerId === userId && p.topicId === topicId);
    if (progress) progress.gameCompleted = true;
  }

  res.json({
    success: true,
    xpEarned,
    coinsEarned: Number(coins) || 30,
    currentXP: profile.xp,
    currentCoins: profile.coins
  });
});

// ----------------------------------------------------
// PROGRESS TRACKING
// ----------------------------------------------------
app.get('/api/progress', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const entries = db.learnerProgress.filter((p) => p.learnerId === userId);
  res.json(entries);
});

app.post('/api/progress/update', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { courseId, topicId, activityType } = req.body; // 'video' | 'ebook' | 'pdf' | 'game' | 'quiz'
  const profile = db.learnerProfiles.get(userId) || db.learnerProfiles.get('usr_learner_1')!;

  let progress = db.learnerProgress.find((p) => p.learnerId === userId && p.topicId === topicId);
  if (!progress) {
    progress = {
      id: `prog_${Date.now()}`,
      learnerId: userId,
      courseId: courseId || 'crs_data_viz',
      topicId,
      videoCompleted: false,
      ebookCompleted: false,
      pdfCompleted: false,
      gameCompleted: false,
      quizCompleted: false
    };
    db.learnerProgress.push(progress);
  }

  let xpAwarded = 0;
  if (activityType === 'video' && !progress.videoCompleted) {
    progress.videoCompleted = true;
    xpAwarded = 30;
  } else if (activityType === 'ebook' && !progress.ebookCompleted) {
    progress.ebookCompleted = true;
    xpAwarded = 20;
  } else if (activityType === 'pdf' && !progress.pdfCompleted) {
    progress.pdfCompleted = true;
    xpAwarded = 30;
  }

  profile.xp += xpAwarded;

  res.json({
    success: true,
    progress,
    xpAwarded,
    totalXP: profile.xp
  });
});

// ----------------------------------------------------
// LEARNER SUMMARY REPORT DATA (FOR PDF GENERATION)
// ----------------------------------------------------
app.get('/api/learner/report-data', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const user = getUserById(userId) || db.users[0];
  const profile = db.learnerProfiles.get(userId) || db.learnerProfiles.get('usr_learner_1')!;
  const role = profile.currentRole || 'Statistical Analyst';

  // Competencies breakdown
  const userCompetencies = db.learnerCompetencies.filter((c) => c.learnerId === userId);
  const competencyList = db.competencies.map((comp) => {
    const existing = userCompetencies.find((c) => c.competencyId === comp.id);
    const score = existing ? existing.score : 45;
    const requiredScore = comp.requiredForRoles[role] || 80;
    const gap = Math.max(0, requiredScore - score);

    let status = 'good';
    if (score >= 80) status = 'strong';
    else if (score >= 60) status = 'good';
    else if (score >= 40) status = 'developing';
    else status = 'critical_gap';

    return {
      competencyId: comp.id,
      name: comp.name,
      category: comp.category,
      score,
      requiredScore,
      gap,
      status,
      lastAssessed: existing?.lastAssessed || new Date().toISOString()
    };
  });

  // Completed modules and topics
  const progressEntries = db.learnerProgress.filter((p) => p.learnerId === userId);
  const completedTopicsList: any[] = [];

  for (const course of db.courses) {
    for (const module of course.modules) {
      for (const topic of module.topics) {
        const prog = progressEntries.find((p) => p.topicId === topic.id);
        if (prog) {
          const completedCount = [
            prog.videoCompleted,
            prog.ebookCompleted,
            prog.pdfCompleted,
            prog.gameCompleted,
            prog.quizCompleted
          ].filter(Boolean).length;

          completedTopicsList.push({
            topicId: topic.id,
            topicTitle: topic.title,
            moduleId: module.id,
            moduleTitle: module.title,
            courseId: course.id,
            courseTitle: course.title,
            courseCode: course.code,
            competency: topic.competency,
            xpReward: topic.xpReward,
            completedActivities: {
              video: prog.videoCompleted,
              ebook: prog.ebookCompleted,
              pdf: prog.pdfCompleted,
              game: prog.gameCompleted,
              quiz: prog.quizCompleted
            },
            completedModesCount: completedCount,
            isFullyCompleted: prog.quizCompleted || completedCount >= 3,
            completedAt: prog.completedAt || new Date().toISOString()
          });
        }
      }
    }
  }

  // Courses summary
  const coursesSummary = db.courses.map((course) => {
    let totalTopics = 0;
    let completedTopics = 0;
    for (const module of course.modules) {
      totalTopics += module.topics.length;
      for (const topic of module.topics) {
        const prog = progressEntries.find((p) => p.topicId === topic.id);
        if (prog && (prog.quizCompleted || prog.gameCompleted || prog.videoCompleted)) {
          completedTopics++;
        }
      }
    }
    const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return {
      courseId: course.id,
      title: course.title,
      code: course.code,
      level: course.level,
      totalTopics,
      completedTopics,
      progressPercent: percent
    };
  });

  // Achievements
  const userAch = db.learnerAchievements.filter((a) => a.learnerId === userId);
  const achievementsList = userAch.map((ua) => {
    const def = db.achievements.find((a) => a.id === ua.achievementId);
    return {
      id: ua.achievementId,
      title: def?.title || 'Milestone Achievement',
      description: def?.description || 'Awarded for capacity building milestones.',
      unlockedAt: ua.unlockedAt
    };
  });

  res.json({
    reportId: `PRAGYA-REP-${userId.toUpperCase().slice(-4)}-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    user: {
      name: user.name,
      email: user.email,
      department: user.department || 'Survey Design & Research Division',
      organization: user.organization || 'Ministry of Statistics & Programme Implementation',
      role: user.role
    },
    profile: {
      level: profile.level,
      xp: profile.xp,
      coins: profile.coins,
      degree: profile.degree,
      specialization: profile.specialization,
      currentRole: profile.currentRole,
      streakDays: profile.streakDays,
      streakHistory: profile.streakHistory || [
        { date: 'Mon', active: true },
        { date: 'Tue', active: true },
        { date: 'Wed', active: true },
        { date: 'Thu', active: true },
        { date: 'Fri', active: true },
        { date: 'Sat', active: true },
        { date: 'Sun', active: true }
      ]
    },
    competencies: competencyList,
    completedModules: completedTopicsList,
    coursesSummary,
    achievements: achievementsList
  });
});

// ----------------------------------------------------
// LEADERBOARD & ACHIEVEMENTS
// ----------------------------------------------------
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = [
    {
      rank: 1,
      userId: 'usr_lead_1',
      name: 'Priyanka Sen',
      role: 'Senior Statistical Officer',
      department: 'National Accounts Division',
      xp: 4850,
      level: 9,
      streakDays: 24,
      coursesCompleted: 6,
      quizAccuracy: 96,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      badgesCount: 7
    },
    {
      rank: 2,
      userId: 'usr_lead_2',
      name: 'Amitabh Mukherjee',
      role: 'Statistical Officer',
      department: 'Survey Design & Research',
      xp: 3920,
      level: 8,
      streakDays: 18,
      coursesCompleted: 5,
      quizAccuracy: 92,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badgesCount: 6
    },
    {
      rank: 3,
      userId: 'usr_learner_1',
      name: 'Ananya Sharma',
      role: 'Statistical Analyst',
      department: 'Survey Design & Research Division',
      xp: db.learnerProfiles.get('usr_learner_1')?.xp || 1240,
      level: db.learnerProfiles.get('usr_learner_1')?.level || 3,
      streakDays: db.learnerProfiles.get('usr_learner_1')?.streakDays || 7,
      coursesCompleted: 1,
      quizAccuracy: 88,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badgesCount: 2
    },
    {
      rank: 4,
      userId: 'usr_lead_4',
      name: 'Rohan Deshmukh',
      role: 'Junior Statistical Officer',
      department: 'Price Statistics Division',
      xp: 1150,
      level: 3,
      streakDays: 5,
      coursesCompleted: 1,
      quizAccuracy: 82,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      badgesCount: 2
    }
  ];

  res.json(leaderboard);
});

app.get('/api/achievements', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const userUnlocked = db.learnerAchievements.filter((a) => a.learnerId === userId);

  const list = db.achievements.map((ach) => {
    const unlocked = userUnlocked.find((u) => u.achievementId === ach.id);
    return {
      ...ach,
      unlockedAt: unlocked ? unlocked.unlockedAt : undefined
    };
  });

  res.json(list);
});

// ----------------------------------------------------
// iGOT KARMAYOGI REST API INTEGRATION
// ----------------------------------------------------
app.get('/api/igot/courses', async (req, res) => {
  const competency = req.query.competency as string;
  const courses = await igotService.discoverCourses(competency);
  res.json(courses);
});

app.post('/api/igot/sync', async (req, res) => {
  const result = await igotService.syncCourses();
  res.json(result);
});

// ----------------------------------------------------
// TRAINER DASHBOARD APIs
// ----------------------------------------------------
app.get('/api/trainer/courses', (req, res) => {
  res.json(db.courses);
});

app.get('/api/trainer/materials', (req, res) => {
  res.json(db.uploadedMaterials);
});

app.get('/api/trainer/analytics', (req, res) => {
  res.json({
    totalLearnersEnrolled: 1420,
    averageQuizScore: 84,
    passRate: 88.5,
    pendingQuestionReviews: db.quizzes.reduce(
      (sum, q) => sum + q.questions.filter((ques) => ques.status === 'pending_review').length,
      0
    ),
    mostDifficultQuestions: [
      {
        question: 'Cleveland & McGill Graphical Perception Hierarchy',
        failRate: 34,
        competency: 'Data Visualization'
      },
      {
        question: 'Standard Error calculation under Multistage Sampling',
        failRate: 41,
        competency: 'Statistical Inference'
      }
    ]
  });
});

// ----------------------------------------------------
// ADMIN DASHBOARD APIs
// ----------------------------------------------------
app.get('/api/admin/analytics', (req, res) => {
  res.json({
    totalLearners: 4280,
    totalTrainers: 142,
    totalCourses: db.courses.length,
    totalLearningMaterials: db.uploadedMaterials.length,
    totalQuizzes: db.quizzes.length,
    activeLearnersToday: 812,
    averageCompletionRate: 74.2,
    averageQuizScore: 82.6,
    igotSyncStatus: 'Healthy (Live REST connection active)',
    organizationCompetencyOverview: [
      { name: 'Data Analysis', score: 76, benchmark: 80, gap: 4 },
      { name: 'Statistics', score: 71, benchmark: 80, gap: 9 },
      { name: 'Data Visualization', score: 54, benchmark: 80, gap: 26, isCritical: true },
      { name: 'Statistical Inference', score: 48, benchmark: 85, gap: 37, isCritical: true },
      { name: 'Survey Methods & Sampling', score: 81, benchmark: 75, gap: 0 },
      { name: 'Data Collection & Verification', score: 85, benchmark: 75, gap: 0 }
    ],
    criticalOrganizationGaps: [
      'Statistical Inference (37% average organizational shortfall)',
      'Data Visualization & Executive Reporting (26% shortfall)'
    ]
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json(db.users);
});

// ----------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------
app.get('/api/notifications', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const userNotifs = db.notifications.filter((n) => n.userId === userId);
  res.json(userNotifs);
});

app.put('/api/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res) => {
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

// ----------------------------------------------------
// SEMANTIC SEARCH
// ----------------------------------------------------
app.get('/api/search', (req, res) => {
  const q = ((req.query.q as string) || '').toLowerCase();
  if (!q) return res.json({ courses: [], topics: [], materials: [] });

  const matchingCourses = db.courses.filter(
    (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );

  const matchingTopics: any[] = [];
  db.courses.forEach((c) => {
    c.modules.forEach((m) => {
      m.topics.forEach((t) => {
        if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
          matchingTopics.push({ topic: t, courseId: c.id, courseTitle: c.title });
        }
      });
    });
  });

  const vectorMatches = chromaVectorStore.query(q, { topK: 3 });

  res.json({
    courses: matchingCourses,
    topics: matchingTopics,
    semanticMaterials: vectorMatches.map((v) => ({
      text: v.chunk.text,
      filename: v.chunk.metadata.filename,
      score: Math.round(v.score * 100)
    }))
  });
});

// ----------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pragya AI (SkillQuest) Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
