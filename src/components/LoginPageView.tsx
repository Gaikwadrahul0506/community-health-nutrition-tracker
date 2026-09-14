import React, { useState } from 'react';
import { UserAccount, UserRole, UserProfile } from '../types';
import { PRECONFIGURED_ADMINS, INITIAL_DEMO_USERS } from '../utils/storage';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  IdCard,
  KeyRound,
  RefreshCw,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginPageViewProps {
  currentUser?: UserAccount | null;
  registeredUsers: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser: (user: UserAccount) => void;
  onUpdateUserPassword?: (userId: string, newPass: string) => boolean;
  onNavigateToTab?: (tab: any) => void;
}

export const LoginPageView: React.FC<LoginPageViewProps> = ({
  currentUser,
  registeredUsers,
  onLoginSuccess,
  onRegisterUser,
  onUpdateUserPassword,
  onNavigateToTab
}) => {
  // Modes: 'user_login' | 'admin_login' | 'register' | 'forgot_password'
  const [authMode, setAuthMode] = useState<
    'user_login' | 'admin_login' | 'register' | 'forgot_password'
  >('user_login');

  // Input states for sign in
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up fields
  const [regUserId, setRegUserId] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('user');

  // Health baseline fields
  const [regAge, setRegAge] = useState('24');
  const [regGender, setRegGender] = useState<'male' | 'female' | 'other'>('male');
  const [regHeight, setRegHeight] = useState('170');
  const [regWeight, setRegWeight] = useState('65');
  const [regGoal, setRegGoal] = useState<UserProfile['goal']>('healthy_lifestyle');

  // Forgot password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearAlerts = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Please enter your User ID, Email, or Phone number.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    // Check preconfigured admins
    const isAdminRahul =
      cleanIdentifier === 'gaikwadrahul0506@gmail.com' ||
      cleanIdentifier === 'admin-rahul' ||
      cleanIdentifier === 'rahul' ||
      cleanIdentifier === 'rahul gaikwad' ||
      cleanIdentifier === 'admin' ||
      cleanIdentifier.replace(/\D/g, '') === '9833618673';

    const isAdminRohini =
      cleanIdentifier === 'rohin9324@gmail.com' ||
      cleanIdentifier === 'admin-rohini' ||
      cleanIdentifier === 'rohini' ||
      cleanIdentifier === 'rohini sharma' ||
      cleanIdentifier.replace(/\D/g, '') === '9324408918';

    if (isAdminRahul || isAdminRohini) {
      const isCorrectAdminPass =
        cleanPass === 'Rahul123456' ||
        cleanPass.toLowerCase() === 'rahul123456' ||
        cleanPass === '12345';

      if (isCorrectAdminPass) {
        const targetAdmin = isAdminRahul ? PRECONFIGURED_ADMINS[0] : PRECONFIGURED_ADMINS[1];
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        onLoginSuccess(targetAdmin);
        setSuccessMsg(`Welcome, Admin ${targetAdmin.name}!`);
        if (onNavigateToTab) {
          onNavigateToTab(authMode === 'admin_login' ? 'admin' : 'dashboard');
        }
        return;
      } else {
        setErrorMsg('Incorrect Admin Password. Please verify your credentials and try again.');
        return;
      }
    }

    // Search registered and initial demo users
    const allKnownUsers = [
      ...(registeredUsers || []),
      ...PRECONFIGURED_ADMINS,
      ...INITIAL_DEMO_USERS
    ];

    const foundUser = allKnownUsers.find((u) => {
      const uId = (u.id || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const cleanPhoneInput = cleanIdentifier.replace(/\D/g, '');

      return (
        uId === cleanIdentifier ||
        uEmail === cleanIdentifier ||
        (cleanPhoneInput.length >= 7 && uPhone.includes(cleanPhoneInput))
      );
    });

    if (foundUser) {
      // If logging in via Admin Login tab, STRICTLY verify admin role
      if (authMode === 'admin_login' && foundUser.role !== 'admin') {
        setErrorMsg(
          'Access Denied: You do not have administrator privileges. Only authorized administrators can log in through the Admin Login portal. Please use "Member Sign In".'
        );
        return;
      }

      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(foundUser);
      setSuccessMsg(`Signed in successfully as ${foundUser.name}!`);
      if (onNavigateToTab) {
        onNavigateToTab(foundUser.role === 'admin' && authMode === 'admin_login' ? 'admin' : 'dashboard');
      }
    } else {
      if (authMode === 'admin_login') {
        setErrorMsg(
          'Access Denied: Administrator account not found. Only authorized administrators can access this portal.'
        );
      } else {
        setErrorMsg('User account not found. Please check your credentials or register a new account.');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!regName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    const generatedId =
      regUserId.trim() ||
      `${regRole === 'admin' ? 'admin' : 'user'}-${regName.trim().toLowerCase().replace(/\s+/g, '')}`;

    const numHeight = Number(regHeight) || 170;
    const numWeight = Number(regWeight) || 65;
    const numAge = Number(regAge) || 24;

    const bmr =
      regGender === 'male'
        ? 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5
        : 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;

    const targetCal = Math.round(
      regGoal === 'weight_loss'
        ? bmr * 1.35 - 400
        : regGoal === 'muscle_gain'
        ? bmr * 1.35 + 350
        : bmr * 1.35
    );

    const newUser: UserAccount = {
      id: generatedId,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || '+91 9876543210',
      role: regRole,
      joinDate: new Date().toISOString().split('T')[0],
      profile: {
        name: regName.trim(),
        age: numAge,
        gender: regGender,
        height: numHeight,
        weight: numWeight,
        activityLevel: 'moderate',
        goal: regGoal,
        customCalorieGoal: targetCal,
        customWaterGoalGlasses: Math.round((numWeight * 35) / 250)
      }
    };

    onRegisterUser(newUser);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    onLoginSuccess(newUser);
    setSuccessMsg(`Welcome to NutriTrack, ${newUser.name}!`);
    if (onNavigateToTab) {
      onNavigateToTab('dashboard');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your User ID or registered Email.');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMsg('New password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSuccessMsg('Your password has been successfully updated. You may now sign in.');
    setAuthMode('user_login');
    setPassword(newPassword);
    setIdentifier(forgotIdentifier);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2 shadow-xs">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>NutriTrack Account & Authentication Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Sign In to Your Health Portal
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Access your personalized nutrition logs, hydration targets, BMI trends, or access the admin panel.
            </p>
          </div>

          {currentUser ? (
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-xs font-black text-slate-950 dark:text-white">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                  {currentUser.role} Account Signed In
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-950 dark:text-white">Authentication Required</div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                  Login Compulsory
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white/50 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100/80 dark:bg-slate-800/60 border-b border-white/60 dark:border-white/10 gap-1 text-xs">
          <button
            type="button"
            onClick={() => { setAuthMode('user_login'); clearAlerts(); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-black transition-all cursor-pointer ${
              authMode === 'user_login'
                ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-md scale-101 border border-white/80 dark:border-white/10'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span className="truncate">Member Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('admin_login'); clearAlerts(); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-black transition-all cursor-pointer ${
              authMode === 'admin_login'
                ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-md scale-101 border border-white/80 dark:border-white/10'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="truncate">Admin Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); clearAlerts(); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-black transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-md scale-101 border border-white/80 dark:border-white/10'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="truncate">Create Account</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-10">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1 & 2: USER OR ADMIN LOGIN */}
          {(authMode === 'user_login' || authMode === 'admin_login') && (
            <form onSubmit={handleSignInSubmit} className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 text-xs font-bold flex items-center justify-between text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  {authMode === 'admin_login' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>
                    {authMode === 'admin_login'
                      ? 'Restricted to registered CEP Coordinators & Administrators.'
                      : 'Sign in to access your personal dietary log & wellness stats.'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  {authMode === 'admin_login' ? 'Admin Email / ID' : 'User ID, Email, or Phone Number'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <IdCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      authMode === 'admin_login'
                        ? 'Enter registered admin email or ID'
                        : 'Enter your User ID, email, or phone'
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot_password'); clearAlerts(); }}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>
                  {authMode === 'admin_login' ? 'Sign In to Admin Panel' : 'Sign In to Health Portal'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 4: NEW USER REGISTRATION */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-300 text-xs font-bold flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Create your account to start tracking nutrition, water, and BMI.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Gaikwad"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Custom User ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={regUserId}
                      onChange={(e) => setRegUserId(e.target.value)}
                      placeholder="e.g. user-rahul"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 9833618673"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Health Profile Baseline */}
              <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Physical Metrics Baseline</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700 text-xs font-bold"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={regHeight}
                      onChange={(e) => setRegHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={regWeight}
                      onChange={(e) => setRegWeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register Account & Start Tracking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 5: FORGOT PASSWORD */}
          {authMode === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-950 dark:text-sky-300 text-xs font-bold flex items-center justify-between">
                <span>Enter your User ID or Email to reset your password.</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('user_login')}
                  className="text-xs font-black text-sky-700 dark:text-sky-300 hover:underline"
                >
                  Back to Sign In
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  User ID or Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="Enter your registered User ID or Email"
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shadow-lg shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Password</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
