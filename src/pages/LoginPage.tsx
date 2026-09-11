import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Globe,
  HelpCircle,
  KeyRound,
  Smartphone,
  Check,
  AlertCircle,
  X,
  GraduationCap,
  BookOpen
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  defaultMode?: 'signin' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, defaultMode = 'signin' }) => {
  const { login, signup, user, isAuthenticated, savedAccounts, switchAccount, removeAccount, logout } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'parichay' | 'otp'>('email');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('learner');
  const [department, setDepartment] = useState('Survey Design & Research Division');
  const [organization, setOrganization] = useState('National Statistical Office (MoSPI)');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password, role, name, department);
      if (res.success) {
        setSuccessMessage('Login successful! Redirecting to Officer Portal...');
        setTimeout(() => {
          if (role === 'admin') onNavigate('admin');
          else if (role === 'trainer') onNavigate('trainer');
          else onNavigate('dashboard');
        }, 600);
      } else {
        setErrorMessage(res.error || 'Invalid credentials or login failed');
      }
    } catch {
      setErrorMessage('Failed to sign in. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter an email address');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter your full official name');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        role,
        department,
        organization
      });

      if (res.success) {
        setSuccessMessage('Account created successfully! Welcome to Pragya AI.');
        setTimeout(() => {
          if (role === 'admin') onNavigate('admin');
          else if (role === 'trainer') onNavigate('trainer');
          else onNavigate('dashboard');
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to create account');
      }
    } catch {
      setErrorMessage('Account creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleParichayLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Enter your official Parichay Username / Gov Email');
      return;
    }
    handleSignIn(e);
  };

  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setErrorMessage(null);
    setSuccessMessage('OTP sent to ' + mobileNumber.replace(/(\d{6})(\d{4})/, '******$2'));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the 6-digit OTP code');
      return;
    }
    // Convert mobile to email login
    const generatedEmail = `officer.${mobileNumber.slice(-4)}@gov.in`;
    login(generatedEmail, undefined, role, 'Officer (Mobile Verified)', department);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-[#F4F6F9]">
      {/* Top Banner / Breadcrumb */}
      <div className="w-full max-w-4xl mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold tracking-wide">
          <span>🏛️</span>
          <span>Government of India • Ministry of Statistics & Programme Implementation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-['Space_Grotesk'] tracking-tight">
          Pragya AI Single Sign-On (SSO) Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Secure capacity intelligence and e-learning gateway for civil servants, statistical cadre, trainers, and nodal administrators.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Auth Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Sign In vs Register Toggle */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In (Any Email)
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account / Register
            </button>
          </div>

          {/* Sub-tabs for Sign In methods */}
          {mode === 'signin' && (
            <div className="flex border-b border-slate-200 text-xs font-semibold gap-6 pb-2">
              <button
                onClick={() => setAuthMethod('email')}
                className={`pb-2 transition-colors border-b-2 -mb-2 ${
                  authMethod === 'email'
                    ? 'border-orange-500 text-orange-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Email Address
              </button>
              <button
                onClick={() => setAuthMethod('parichay')}
                className={`pb-2 transition-colors border-b-2 -mb-2 flex items-center gap-1 ${
                  authMethod === 'parichay'
                    ? 'border-orange-500 text-orange-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Jan Parichay SSO</span>
                <span className="text-[9px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded font-bold">Govt</span>
              </button>
              <button
                onClick={() => setAuthMethod('otp')}
                className={`pb-2 transition-colors border-b-2 -mb-2 ${
                  authMethod === 'otp'
                    ? 'border-orange-500 text-orange-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Mobile OTP
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORM: Sign In with Email */}
          {mode === 'signin' && authMethod === 'email' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gubbanithish9@gmail.com, name@gov.in"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] text-slate-900 bg-slate-50/50"
                  />
                </div>
                <span className="text-[11px] text-slate-400">
                  You can use any personal (e.g. Gmail) or official (@nic.in, @gov.in) email address.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0F2942]">
                    Password <span className="text-slate-400 font-normal">(Optional for demo login)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email address.')}
                    className="text-[11px] text-orange-700 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] text-slate-900 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-[#0F2942]">Cadre Role Persona</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('learner')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                      role === 'learner'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-950 ring-1 ring-blue-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 text-blue-600 mb-1" />
                    <span className="font-bold">Learner</span>
                    <span className="text-[10px] text-slate-500">Civil Servants</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('trainer')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                      role === 'trainer'
                        ? 'border-purple-500 bg-purple-50/70 text-purple-950 ring-1 ring-purple-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-purple-600 mb-1" />
                    <span className="font-bold">Trainer</span>
                    <span className="text-[10px] text-slate-500">NSSTA Faculty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                      role === 'admin'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-1 ring-orange-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Shield className="h-4 w-4 text-orange-600 mb-1" />
                    <span className="font-bold">Admin</span>
                    <span className="text-[10px] text-slate-500">Ministry Nodal</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  defaultChecked
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                  Remember this account on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Pragya AI</span>
                    <ArrowRight className="h-4 w-4 text-orange-400" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORM: Sign In with Jan Parichay */}
          {mode === 'signin' && authMethod === 'parichay' && (
            <form onSubmit={handleParichayLogin} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-amber-700" />
                  <span>National Single Sign-On (MeriPehchan / Jan Parichay)</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Authenticate directly using your official Government of India NIC/e-Gov credentials.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">Parichay Gov Email / User ID</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer.sharma@gov.in or nic_id"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Authorize via Parichay SSO</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* FORM: Sign In with Mobile OTP */}
          {mode === 'signin' && authMethod === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">Registered Mobile Number</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0F2942]">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-widest font-mono py-2.5 text-lg rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50 font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Verify & Login</span>
                    <Check className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* FORM: Registration (New Account) */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nitish Gubba, Rajesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gubbanithish9@gmail.com or officer@nic.in"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set account password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0F2942]">Department / Division</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Field Operations Division"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0F2942]">Ministry / Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. MoSPI or State Govt"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F2942]">Account Cadre / Learner Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('learner');
                      setDepartment('Survey Design & Research Division');
                      setOrganization('National Statistical Office (MoSPI)');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      role === 'learner' && organization.includes('MoSPI')
                        ? 'border-blue-500 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Civil Service</div>
                    <div className="text-[10px] text-slate-500 font-normal">Officer / Analyst</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('learner');
                      setDepartment('Dept. of Data Science & Statistics');
                      setOrganization('Delhi University & Colleges');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      role === 'learner' && !organization.includes('MoSPI')
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Student / Learner</div>
                    <div className="text-[10px] text-slate-500 font-normal">Course & New Skills</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('trainer');
                      setDepartment('NSSTA Faculty Wing');
                      setOrganization('MoSPI');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      role === 'trainer'
                        ? 'border-purple-500 bg-purple-50 text-purple-950 font-bold ring-1 ring-purple-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Cadre Trainer</div>
                    <div className="text-[10px] text-slate-500 font-normal">NSSTA Faculty</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setDepartment('Central Statistics Office');
                      setOrganization('MoSPI & iGOT Council');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      role === 'admin'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold ring-1 ring-orange-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Ministry Admin</div>
                    <div className="text-[10px] text-slate-500 font-normal">Nodal Officer</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#FF9933] hover:bg-orange-500 text-[#0F2942] font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 border-2 border-[#0F2942] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Compliance Footer */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span>Govt. of India 256-bit Cadre Encryption</span>
            </span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-slate-600 hover:text-slate-900 font-bold"
            >
              Skip to Portal →
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Saved Accounts & Quick Presets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Logged In Status Card */}
          {user ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  Currently Signed In
                </span>
                <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                  Active Session
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-[#0F2942] truncate">{user.name}</div>
                  <div className="text-xs text-slate-600 font-mono truncate">{user.email}</div>
                  <div className="text-[10px] text-emerald-700 font-bold capitalize mt-0.5">
                    {user.role} • {user.department || 'MoSPI Cadre'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-emerald-200">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold text-center transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => logout()}
                  className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : null}

          {/* Switch Between Saved Accounts on this Device */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2942]">
                  Saved Accounts on this Device
                </h3>
                <p className="text-[11px] text-slate-500">
                  Switch easily between accounts using different emails.
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-slate-400">
                {savedAccounts.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {savedAccounts.map((acc) => {
                const isActive = user?.email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <div
                    key={acc.email}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'border-orange-300 bg-orange-50/50 shadow-2xs'
                        : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div
                      onClick={() => switchAccount(acc.email)}
                      className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    >
                      <img
                        src={acc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                        alt={acc.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#0F2942] truncate">{acc.name}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">{acc.email}</div>
                        <div className="text-[9px] uppercase font-bold text-orange-800">
                          {acc.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => switchAccount(acc.email)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-orange-200 text-orange-900'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isActive ? 'Active' : 'Switch'}
                      </button>
                      <button
                        onClick={() => removeAccount(acc.email)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Remove account from device"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Fill custom email input */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 block mb-1">
                Want to test with your own custom email?
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Type any email (e.g. myname@gmail.com)"
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        setEmail(val);
                        login(val);
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                    if (input?.value) {
                      setEmail(input.value);
                      login(input.value);
                    }
                  }}
                  className="px-3 py-2 bg-[#0F2942] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A]"
                >
                  Quick In
                </button>
              </div>
            </div>
          </div>

          {/* Official Mission Karmayogi Info Banner */}
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 p-5 space-y-2 text-xs text-blue-900">
            <div className="font-bold flex items-center gap-1.5 text-sm text-[#0F2942]">
              <Globe className="h-4 w-4 text-blue-700" />
              <span>Multi-Account Support</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pragya AI allows logging in with different email addresses across central, state, and personal cadres. Each email maintains separate competency diagnostics, course maps, and learning streaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
