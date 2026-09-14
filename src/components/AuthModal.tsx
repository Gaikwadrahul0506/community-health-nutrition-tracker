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
  X,
  UserCheck,
  Scale,
  IdCard,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterUser: (user: UserAccount) => void;
  initialMode?: 'signin' | 'signup' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(
    initialMode === 'signup' ? 'signup' : 'signin'
  );

  // Sign in identifier
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [signupUserId, setSignupUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('user');
  const [height, setHeight] = useState('172');
  const [weight, setWeight] = useState('68');
  const [age, setAge] = useState('24');
  const [goal, setGoal] = useState<'healthy_lifestyle' | 'weight_loss' | 'muscle_gain'>('healthy_lifestyle');

  // Error state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Please enter your User ID, Email, or Phone number.');
      return;
    }

    // Check preconfigured admins first
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
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
        onLoginSuccess(targetAdmin);
        onClose();
        return;
      } else {
        setErrorMsg('Invalid password for Admin. Please check your credentials.');
        return;
      }
    }

    // Check registered and demo users
    const allUsers = [...registeredUsers, ...PRECONFIGURED_ADMINS, ...INITIAL_DEMO_USERS];
    const found = allUsers.find((u) => {
      const uId = u.id.toLowerCase();
      const uEmail = u.email.toLowerCase();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const cleanPhoneInput = cleanIdentifier.replace(/\D/g, '');

      return (
        uId === cleanIdentifier ||
        uEmail === cleanIdentifier ||
        (cleanPhoneInput.length >= 7 && uPhone.includes(cleanPhoneInput))
      );
    });

    if (found) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMsg('User account not found. Please check your credentials or register a new account.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email.');
      return;
    }

    const assignedId =
      signupUserId.trim() ||
      `${signupRole === 'admin' ? 'admin' : 'user'}-${name.trim().toLowerCase().replace(/\s+/g, '')}`;

    const numHeight = Number(height) || 170;
    const numWeight = Number(weight) || 65;
    const numAge = Number(age) || 24;

    const bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5;
    const targetCal = Math.round(
      goal === 'weight_loss' ? bmr * 1.35 - 400 : goal === 'muscle_gain' ? bmr * 1.35 + 350 : bmr * 1.35
    );

    const newUser: UserAccount = {
      id: assignedId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+91 9876543210',
      role: signupRole,
      joinDate: new Date().toISOString().split('T')[0],
      profile: {
        name: name.trim(),
        age: numAge,
        gender: 'male',
        height: numHeight,
        weight: numWeight,
        activityLevel: 'moderate',
        goal,
        customCalorieGoal: targetCal,
        customWaterGoalGlasses: Math.round((numWeight * 35) / 250)
      }
    };

    onRegisterUser(newUser);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg">NutriTrack Authentication</h3>
              <p className="text-xs text-emerald-100 font-medium">Community Health & Nutrition Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                  User ID, Email, or Phone
                </label>
                <div className="relative">
                  <IdCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your registered ID, email, or phone"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Authenticate & Access Tracker</span>
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Gaikwad"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                  Account Type
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="user">👤 Community Member</option>
                  <option value="admin">🛡️ CEP Coordinator (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

