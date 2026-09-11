import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { User, LearnerProfile, UserRole } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  profile: LearnerProfile | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  savedAccounts: User[];
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  login: (
    email: string,
    password?: string,
    role?: UserRole,
    name?: string,
    department?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    department?: string;
    organization?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchAccount: (email: string) => void;
  removeAccount: (email: string) => void;
  updateProfile: (updates: Partial<LearnerProfile>) => void;
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  triggerConfetti: () => void;
  refreshUserData: () => Promise<void>;
  simulateCompetencyBoost: (competencyName: string, boostAmount: number) => Promise<void>;
}

const defaultProfile: LearnerProfile = {
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
};

const initialSampleAccounts: User[] = [
  {
    id: 'usr_learner_1',
    email: 'ananya.sharma@mospi.gov.in',
    name: 'Ananya Sharma',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Survey Design & Research Division',
    organization: 'National Statistical Office (MoSPI)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_trainer_1',
    email: 'dr.rajesh.varma@mospi.gov.in',
    name: 'Dr. Rajesh Varma',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'National Statistical Systems Training Academy (NSSTA)',
    organization: 'MoSPI',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_admin_1',
    email: 'vikram.sen@mospi.gov.in',
    name: 'Vikramaditya Sen',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Central Statistics Office & Capacity Building Wing',
    organization: 'MoSPI & iGOT Karmayogi Council',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_student_1',
    email: 'rohit.patel@university.edu.in',
    name: 'Rohit Patel (Student & Aspirant)',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Dept. of Data Science & Applied Statistics',
    organization: 'Delhi University & National Colleges',
    createdAt: new Date().toISOString()
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pragya_active_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialSampleAccounts[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('pragya_token') || 'mock_jwt_token_learner';
    } catch {
      return 'mock_jwt_token_learner';
    }
  });

  const [savedAccounts, setSavedAccounts] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('pragya_saved_accounts');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialSampleAccounts;
  });

  const [profile, setProfile] = useState<LearnerProfile>(defaultProfile);

  // Sync active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('pragya_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('pragya_active_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Sync token to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('pragya_token', token);
      } else {
        localStorage.removeItem('pragya_token');
      }
    } catch {
      // ignore
    }
  }, [token]);

  // Sync saved accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pragya_saved_accounts', JSON.stringify(savedAccounts));
    } catch {
      // ignore
    }
  }, [savedAccounts]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const persistAccountInList = (account: User) => {
    setSavedAccounts((prev) => {
      const filtered = prev.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
      return [account, ...filtered].slice(0, 8); // Keep up to 8 recent accounts
    });
  };

  // Login with ANY email (e.g. gubbanithish9@gmail.com or officer@gov.in)
  const login = async (
    email: string,
    password?: string,
    role?: UserRole,
    name?: string,
    department?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, role, name, department })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        persistAccountInList(data.user);
        triggerConfetti();
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Login failed' };
      }
    } catch (e) {
      // Offline / client fallback: still log in cleanly with the custom email!
      const emailPrefix = cleanEmail.split('@')[0];
      const derivedName =
        name ||
        emailPrefix
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') ||
        'Statistical Officer';

      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: derivedName,
        role: role || 'learner',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}&backgroundColor=0f2942,1e3a8a,f59e0b`,
        department: department || 'Field Operations & Statistics Division',
        organization: cleanEmail.endsWith('.gov.in') ? 'Government of India' : 'Civil Services Cadre',
        createdAt: new Date().toISOString()
      };

      setUser(fallbackUser);
      setToken(`token_${cleanEmail}`);
      persistAccountInList(fallbackUser);
      triggerConfetti();
      return { success: true };
    }
  };

  // Sign up a new user with their custom email and details
  const signup = async (data: {
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    department?: string;
    organization?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    if (!data.name.trim()) {
      return { success: false, error: 'Please enter your full name' };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: cleanEmail })
      });

      if (res.ok) {
        const result = await res.json();
        setUser(result.user);
        setToken(result.token);
        persistAccountInList(result.user);
        triggerConfetti();
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Registration failed' };
      }
    } catch {
      // Fallback
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: data.name,
        role: data.role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=0f2942,1e3a8a,f59e0b`,
        department: data.department || 'Civil Services Capacity Wing',
        organization: data.organization || 'MoSPI Cadre',
        createdAt: new Date().toISOString()
      };

      setUser(fallbackUser);
      setToken(`token_${cleanEmail}`);
      persistAccountInList(fallbackUser);
      triggerConfetti();
      return { success: true };
    }
  };

  // Logout clears the current active user
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Switch between previously saved email accounts on this device
  const switchAccount = (targetEmail: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    const existing = savedAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      setUser(existing);
      setToken(`token_${existing.email}`);
    } else {
      login(cleanEmail);
    }
  };

  const removeAccount = (targetEmail: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    setSavedAccounts((prev) => prev.filter((a) => a.email.toLowerCase() !== cleanEmail));
    if (user?.email.toLowerCase() === cleanEmail) {
      logout();
    }
  };

  // Fast switch for preset demo roles
  const loginAs = (targetRole: UserRole) => {
    const found = initialSampleAccounts.find((a) => a.role === targetRole);
    if (found) {
      setUser(found);
      setToken(`mock_jwt_token_${targetRole}`);
      persistAccountInList(found);
    }
  };

  const setRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      persistAccountInList(updated);
    } else {
      loginAs(newRole);
    }
  };

  const updateProfile = (updates: Partial<LearnerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addXP = (amount: number, reason?: string) => {
    setProfile((prev) => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newTarget = prev.xpToNextLevel;

      if (newXP >= newTarget) {
        newLevel += 1;
        newTarget = Math.round(newTarget * 1.5);
        triggerConfetti();
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newTarget
      };
    });
  };

  const addCoins = (amount: number) => {
    setProfile((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const refreshUserData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      }
    } catch {
      // fallback
    }
  };

  const simulateCompetencyBoost = async (competencyName: string, boostAmount: number) => {
    if (!token) return;
    try {
      await fetch('/api/competencies/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: {
            comp_data_viz: 38 + boostAmount
          }
        })
      });
      addXP(100);
      triggerConfetti();
    } catch {
      // fallback
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        role: user?.role || 'learner',
        isAuthenticated: !!user,
        savedAccounts,
        setRole,
        loginAs,
        login,
        signup,
        logout,
        switchAccount,
        removeAccount,
        updateProfile,
        addXP,
        addCoins,
        triggerConfetti,
        refreshUserData,
        simulateCompetencyBoost
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

