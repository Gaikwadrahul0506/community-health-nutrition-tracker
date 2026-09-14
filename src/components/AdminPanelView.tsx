import React, { useState } from 'react';
import {
  UserAccount,
  SurveyQuestion,
  SurveyResponse,
  FeedbackSubmission,
  FeedbackStatus,
  HealthSlot,
  SlotStatus,
  ActiveTab
} from '../types';
import { PRECONFIGURED_ADMINS } from '../utils/storage';
import {
  ShieldCheck,
  Users,
  MessageSquareHeart,
  ClipboardList,
  Sparkles,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Calendar,
  Filter,
  UserCheck,
  AlertCircle,
  Eye,
  BarChart3,
  Award,
  ChevronRight,
  CalendarCheck2,
  MapPin,
  Video,
  UserPlus,
  TrendingUp,
  X,
  LogIn,
  Edit3,
  Save,
  Lock,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPanelViewProps {
  currentUser?: UserAccount | null;
  users?: UserAccount[];
  registeredUsers?: UserAccount[];
  feedbacks?: FeedbackSubmission[];
  feedbackList?: FeedbackSubmission[];
  surveys?: SurveyResponse[];
  communityQuestions?: SurveyQuestion[];
  communitySurveys?: SurveyQuestion[];
  slots?: HealthSlot[];
  onUpdateFeedbackStatus: (feedbackId: string, status: FeedbackStatus, adminNote?: string) => void;
  onDeleteFeedback?: (feedbackId: string) => void;
  onCreateSurvey?: (survey: Omit<SurveyQuestion, 'id' | 'createdAt' | 'totalVotes'>) => void;
  onCreateSurveyQuestion?: (survey: Omit<SurveyQuestion, 'id' | 'createdAt' | 'totalVotes'>) => void;
  onDeleteSurvey?: (surveyId: string) => void;
  onDeleteSurveyQuestion?: (surveyId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onCreateSlot?: (slot: Omit<HealthSlot, 'id' | 'createdAt' | 'bookedCount' | 'bookings'>) => void;
  onEditSlot?: (slot: HealthSlot) => void;
  onDeleteSlot?: (slotId: string) => void;
  onUpdateSlotStatus?: (slotId: string, status: SlotStatus) => void;
  onAddSlotCapacity?: (slotId: string, additional: number) => void;
  onOpenAuthModal: () => void;
  onLoginSuccess?: (user: UserAccount) => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
  onOpenDatabaseModal?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  users = [],
  registeredUsers,
  feedbacks = [],
  feedbackList,
  surveys = [],
  communityQuestions = [],
  communitySurveys,
  slots = [],
  onUpdateFeedbackStatus,
  onDeleteFeedback,
  onCreateSurvey,
  onCreateSurveyQuestion,
  onDeleteSurvey,
  onDeleteSurveyQuestion,
  onDeleteUser,
  onCreateSlot,
  onEditSlot,
  onDeleteSlot,
  onUpdateSlotStatus,
  onAddSlotCapacity,
  onOpenAuthModal,
  onLoginSuccess,
  onNavigateToTab,
  onOpenDatabaseModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'users' | 'feedback' | 'surveys'>('overview');

  // Helper for Admin to directly login as any user
  const handleAdminLoginAsUser = (targetUser: UserAccount) => {
    if (onLoginSuccess) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      onLoginSuccess(targetUser);
      if (onNavigateToTab) {
        onNavigateToTab('dashboard');
      }
    }
  };

  // Inline Admin Unlock form state for restricted view
  const [unlockIdentifier, setUnlockIdentifier] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Unified safe arrays
  const allUsers = registeredUsers || users || [];
  const allFeedback = feedbackList || feedbacks || [];
  const allCommunityQuestions = communitySurveys || communityQuestions || [];
  const handleCreateSurveyAction = onCreateSurveyQuestion || onCreateSurvey || (() => {});
  const handleDeleteSurveyAction = onDeleteSurveyQuestion || onDeleteSurvey || (() => {});

  // Search & Filters
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [slotFilter, setSlotFilter] = useState<'all' | 'open' | 'full' | 'completed'>('all');

  // Create Survey State
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
  const [newSurveyTitle, setNewSurveyTitle] = useState('');
  const [newSurveyCategory, setNewSurveyCategory] = useState('Nutrition');
  const [newSurveyDesc, setNewSurveyDesc] = useState('');
  const [newOption1, setNewOption1] = useState('');
  const [newOption2, setNewOption2] = useState('');
  const [newOption3, setNewOption3] = useState('');
  const [newOption4, setNewOption4] = useState('');

  // Create Slot State
  const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  const [slotTitle, setSlotTitle] = useState('');
  const [slotType, setSlotType] = useState<HealthSlot['type']>('nutrition_consultation');
  const [slotCoordinator, setSlotCoordinator] = useState('Rahul Gaikwad (Admin Lead)');
  const [slotDate, setSlotDate] = useState('2026-08-20');
  const [slotTimeRange, setSlotTimeRange] = useState('10:00 AM - 01:00 PM');
  const [slotLocation, setSlotLocation] = useState('Community Health Center, Hall A');
  const [slotVenueType, setSlotVenueType] = useState<'in_person' | 'online_consultation'>('in_person');
  const [slotCapacity, setSlotCapacity] = useState('20');
  const [slotDescription, setSlotDescription] = useState('');

  // Edit Slot State
  const [editingSlot, setEditingSlot] = useState<HealthSlot | null>(null);

  // Selected slot for attendee inspection
  const [inspectSlotId, setInspectSlotId] = useState<string | null>(null);

  // Admin note editing for feedback
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Check if current user is an admin
  const isAdmin = currentUser?.role === 'admin';

  const handleInlinePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    const ident = unlockIdentifier.trim().toLowerCase();
    const pass = unlockPassword.trim();

    const isAdminRahul =
      ident === 'gaikwadrahul0506@gmail.com' ||
      ident === 'admin-rahul' ||
      ident === 'rahul' ||
      ident === 'admin' ||
      ident.replace(/\D/g, '') === '9833618673';

    const isAdminRohini =
      ident === 'rohin9324@gmail.com' ||
      ident === 'admin-rohini' ||
      ident === 'rohini' ||
      ident.replace(/\D/g, '') === '9324408918';

    if (isAdminRahul || isAdminRohini) {
      if (pass === 'Rahul123456' || pass.toLowerCase() === 'rahul123456' || pass === '12345') {
        const targetAdmin = isAdminRahul ? PRECONFIGURED_ADMINS[0] : PRECONFIGURED_ADMINS[1];
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
        if (onLoginSuccess) {
          onLoginSuccess(targetAdmin);
        }
      } else {
        setUnlockError('Incorrect password for Admin account. Please try again.');
      }
      return;
    }

    const foundUser = allUsers.find((u) => {
      const uId = (u.id || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const cleanPhoneInput = ident.replace(/\D/g, '');
      return (
        uId === ident ||
        uEmail === ident ||
        (cleanPhoneInput.length >= 7 && uPhone.includes(cleanPhoneInput))
      );
    });

    if (foundUser) {
      if (foundUser.role !== 'admin') {
        setUnlockError('Access Denied: This account does not have administrator privileges. Only registered CEP administrators can access the Admin Panel.');
        return;
      }
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      if (onLoginSuccess) {
        onLoginSuccess(foundUser);
      }
    } else {
      setUnlockError('Access Denied: Administrator account not found.');
    }
  };

  // If user is not admin, show restricted barrier
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white/60 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-8 border border-white/60 dark:border-white/10 shadow-2xl space-y-6 animate-in fade-in">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Admin Access Restricted</h2>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              The Admin Panel is reserved for registered CEP coordinators. Please sign in with your admin credentials.
            </p>
          </div>
        </div>

        {/* Secure Admin Sign In Form */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Admin Authorization</span>
          </h3>

          {unlockError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{unlockError}</span>
            </div>
          )}

          <form onSubmit={handleInlinePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                Admin Email or ID
              </label>
              <input
                type="text"
                value={unlockIdentifier}
                onChange={(e) => setUnlockIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Enter registered admin email"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate as Admin</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = allUsers.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const filteredFeedback = allFeedback.filter((fb) => {
    if (feedbackFilter === 'all') return true;
    return fb.status === feedbackFilter;
  });

  const filteredSlots = slots.filter((slot) => {
    if (slotFilter === 'all') return true;
    return slot.status === slotFilter;
  });

  // Handle create survey submit
  const handleCreateSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurveyTitle.trim() || !newOption1.trim() || !newOption2.trim()) return;

    const timestamp = Date.now();
    const options = [
      { id: `opt-${timestamp}-1`, text: newOption1.trim(), votes: 0 },
      { id: `opt-${timestamp}-2`, text: newOption2.trim(), votes: 0 },
      ...(newOption3.trim() ? [{ id: `opt-${timestamp}-3`, text: newOption3.trim(), votes: 0 }] : []),
      ...(newOption4.trim() ? [{ id: `opt-${timestamp}-4`, text: newOption4.trim(), votes: 0 }] : [])
    ];

    handleCreateSurveyAction({
      title: newSurveyTitle.trim(),
      category: newSurveyCategory,
      description: newSurveyDesc.trim(),
      options
    });

    setNewSurveyTitle('');
    setNewSurveyDesc('');
    setNewOption1('');
    setNewOption2('');
    setNewOption3('');
    setNewOption4('');
    setIsCreateSurveyOpen(false);
  };

  // Handle create slot submit
  const handleCreateSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim() || !onCreateSlot) return;

    onCreateSlot({
      title: slotTitle.trim(),
      type: slotType,
      doctorOrCoordinator: slotCoordinator.trim() || 'Rahul Gaikwad (Admin Lead)',
      date: slotDate,
      timeRange: slotTimeRange,
      location: slotLocation.trim(),
      venueType: slotVenueType,
      capacity: Number(slotCapacity) || 20,
      description: slotDescription.trim(),
      status: 'open'
    });

    setSlotTitle('');
    setSlotDescription('');
    setIsCreateSlotOpen(false);
  };

  // Handle edit slot submit
  const handleEditSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot || !onEditSlot) return;
    onEditSlot(editingSlot);
    setEditingSlot(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>CEP Coordinator Management Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              NutriTrack Admin Panel
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Manage consultation slots, community members, user feedback moderation, and nutrition surveys.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {onOpenDatabaseModal && (
              <button
                type="button"
                onClick={onOpenDatabaseModal}
                className="px-3 py-1.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-950 dark:text-emerald-200 border border-emerald-500/40 text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open Cloud Firestore Database Inspector"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Firestore DB</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}
            <span className="px-3 py-1.5 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-md flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin: {currentUser.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 dark:border-white/10 overflow-x-auto no-scrollbar gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/40'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview Stats</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'slots'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/40'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Health Consultation Slots ({slots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Members ({allUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/40'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Feedback ({allFeedback.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('surveys')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'surveys'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/40'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Community Surveys ({allCommunityQuestions.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Total Community Users</span>
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 dark:text-white">
                {allUsers.length}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                Active tracked profiles
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Consultation Slots</span>
                <CalendarCheck2 className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 dark:text-white">
                {slots.length}
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 font-bold">
                {slots.reduce((acc, s) => acc + (s.bookedCount || 0), 0)} Bookings recorded
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Submitted Feedback</span>
                <MessageSquareHeart className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 dark:text-white">
                {allFeedback.length}
              </div>
              <p className="text-[11px] text-sky-700 dark:text-sky-400 font-bold">
                {allFeedback.filter((f) => f.status === 'pending').length} pending review
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Survey Responses</span>
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 dark:text-white">
                {surveys.length + allCommunityQuestions.reduce((acc, q) => acc + (q.totalVotes || 0), 0)}
              </div>
              <p className="text-[11px] text-purple-700 dark:text-purple-400 font-bold">
                Total community votes
              </p>
            </div>
          </div>

          {/* Coordinators summary card */}
          <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-3">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>CEP Project Coordinators</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-1">
                <div className="font-black text-slate-950 dark:text-white">Rahul Gaikwad</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Lead Project Coordinator</div>
                <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">gaikwadrahul0506@gmail.com</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-1">
                <div className="font-black text-slate-950 dark:text-white">Rohini Sharma</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Nutrition Research & Outreach Lead</div>
                <div className="text-[11px] font-mono text-teal-700 dark:text-teal-400">rohin9324@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Firestore Cloud Database Card (Admin Only) */}
          {onOpenDatabaseModal && (
            <div className="bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-emerald-600/15 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-950 dark:text-white">Firebase Firestore Cloud Database</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">
                      Admin Access Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Real-time cloud database persistent state across users, consultation slots, survey responses, food databases, and habit tracking.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenDatabaseModal}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Database className="w-4 h-4" />
                <span>Open Cloud Database</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONSULTATION SLOTS & EDITING */}
      {activeTab === 'slots' && (
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Health Camp & Consultation Slots
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Create new consultation slots, edit details, increase capacity, and track registered attendees.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={slotFilter}
                onChange={(e) => setSlotFilter(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="all">All Slots ({slots.length})</option>
                <option value="open">Open Slots ({slots.filter((s) => s.status === 'open').length})</option>
                <option value="full">Full Slots ({slots.filter((s) => s.status === 'full').length})</option>
                <option value="completed">Completed ({slots.filter((s) => s.status === 'completed').length})</option>
              </select>

              <button
                type="button"
                onClick={() => setIsCreateSlotOpen(true)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Slot</span>
              </button>
            </div>
          </div>

          {/* Create Slot Modal */}
          {isCreateSlotOpen && (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Create New Health Consultation Slot</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreateSlotOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSlotSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Slot Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Free Blood Pressure & BMI Camp"
                      value={slotTitle}
                      onChange={(e) => setSlotTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Doctor / Lead Coordinator
                    </label>
                    <input
                      type="text"
                      value={slotCoordinator}
                      onChange={(e) => setSlotCoordinator(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Date (YYYY-MM-DD) *
                    </label>
                    <input
                      type="date"
                      required
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Time Range *
                    </label>
                    <input
                      type="text"
                      required
                      value={slotTimeRange}
                      onChange={(e) => setSlotTimeRange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Total Capacity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={slotCapacity}
                      onChange={(e) => setSlotCapacity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateSlotOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    Publish Slot
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Slot Modal / Form */}
          {editingSlot && (
            <div className="p-6 rounded-3xl bg-teal-500/10 border border-teal-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-600" />
                  <span>Edit Consultation Slot: {editingSlot.title}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSlotSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Slot Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSlot.title}
                      onChange={(e) => setEditingSlot({ ...editingSlot, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Coordinator / Doctor
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSlot.doctorOrCoordinator}
                      onChange={(e) => setEditingSlot({ ...editingSlot, doctorOrCoordinator: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={editingSlot.date}
                      onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Time Range
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSlot.timeRange}
                      onChange={(e) => setEditingSlot({ ...editingSlot, timeRange: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editingSlot.capacity}
                      onChange={(e) => setEditingSlot({ ...editingSlot, capacity: Number(e.target.value) || 20 })}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Status
                    </label>
                    <select
                      value={editingSlot.status}
                      onChange={(e) => setEditingSlot({ ...editingSlot, status: e.target.value as SlotStatus })}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    >
                      <option value="open">Open</option>
                      <option value="full">Full</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Slot Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Slots Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSlots.map((slot) => {
              const booked = slot.bookedCount || (slot.bookings ? slot.bookings.length : 0);
              const percentage = Math.min(100, Math.round((booked / slot.capacity) * 100));
              const isInspect = inspectSlotId === slot.id;

              return (
                <div
                  key={slot.id}
                  className="p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-lg space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            slot.status === 'open'
                              ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
                              : slot.status === 'full'
                              ? 'bg-rose-500/20 text-rose-900 dark:text-rose-300 border border-rose-500/30'
                              : 'bg-slate-500/20 text-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {slot.status}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-[10px] font-bold flex items-center gap-1">
                          {slot.venueType === 'online_consultation' ? <Video className="w-3 h-3 text-sky-500" /> : <MapPin className="w-3 h-3 text-emerald-600" />}
                          <span>{slot.venueType === 'online_consultation' ? 'Virtual Video Room' : 'In-Person'}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-950 dark:text-white">
                        {slot.title}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mt-0.5">
                        Coordinator: {slot.doctorOrCoordinator}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Edit Slot Button */}
                      <button
                        type="button"
                        onClick={() => setEditingSlot(slot)}
                        title="Edit slot details"
                        className="p-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-800 dark:text-teal-300 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteSlot && (
                        <button
                          onClick={() => onDeleteSlot(slot.id)}
                          title="Delete slot"
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pt-2 border-t border-white/40 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{slot.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{slot.timeRange}</span>
                    </div>
                  </div>

                  {/* Slot Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">
                        Booked: <strong className="text-slate-950 dark:text-white">{booked}</strong> / {slot.capacity} slots
                      </span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400">
                        {percentage}% Full
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          percentage >= 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1.5">
                      {onAddSlotCapacity && (
                        <button
                          type="button"
                          onClick={() => onAddSlotCapacity(slot.id, 5)}
                          title="Increase capacity by 5 slots"
                          className="px-2.5 py-1.5 rounded-xl bg-white/70 dark:bg-white/10 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-white/60 dark:border-white/10 hover:bg-emerald-500/20 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+5 Capacity</span>
                        </button>
                      )}

                      {onUpdateSlotStatus && (
                        <select
                          value={slot.status}
                          onChange={(e) => onUpdateSlotStatus(slot.id, e.target.value as SlotStatus)}
                          className="px-2 py-1 rounded-xl bg-white/70 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-white border border-white/60 dark:border-white/10"
                        >
                          <option value="open">Open</option>
                          <option value="full">Full</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectSlotId(isInspect ? null : slot.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-900 dark:text-emerald-300 text-[11px] font-black border border-emerald-500/30 cursor-pointer flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{isInspect ? 'Hide Attendees' : `Attendees (${booked})`}</span>
                    </button>
                  </div>

                  {/* Inspect Attendees List Drawer */}
                  {isInspect && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/90 border border-white/60 dark:border-white/10 space-y-2 text-xs">
                      <h5 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>Registered Attendees for this Slot</span>
                      </h5>

                      {slot.bookings && slot.bookings.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {slot.bookings.map((b) => (
                            <div
                              key={b.id}
                              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {b.userName}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {b.userEmail} • {b.userPhone}
                                </div>
                                {b.notes && (
                                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 italic mt-0.5">
                                    "{b.notes}"
                                  </div>
                                )}
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[9px] font-black">
                                Confirmed
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-xs italic">
                          No direct user registrations logged yet for this slot.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED USERS TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Registered Community Members
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Total {filteredUsers.length} user accounts registered on NutriTrack.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search member by name, ID, or email..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/60 dark:border-white/10 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3">User & Contact</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Biometrics</th>
                  <th className="py-3 px-3">Goal</th>
                  <th className="py-3 px-3">Joined</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40 dark:divide-white/5 font-semibold">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  const isSystemAdmin = u.id === 'admin-rahul' || u.id === 'admin-rohini';

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-white/40 dark:hover:bg-white/5 transition-colors ${
                        isCurrent ? 'bg-emerald-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-xs">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              ID: {u.id} • {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            u.role === 'admin'
                              ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {u.profile?.height}cm • {u.profile?.weight}kg ({u.profile?.age} yrs)
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-700 dark:text-slate-300">
                        {(u.profile?.goal || 'healthy_lifestyle').replace('_', ' ')}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {u.joinDate || '2026-02-01'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Login As This User Button */}
                          <button
                            type="button"
                            onClick={() => handleAdminLoginAsUser(u)}
                            title={`Sign in as ${u.name}`}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>{isCurrent ? 'Active' : 'Login as User'}</span>
                          </button>

                          {/* Delete non-admin user */}
                          {!isSystemAdmin && onDeleteUser && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove user account ${u.name}?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              title="Delete user account"
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-500/15 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEEDBACK & INQUIRIES MODERATION */}
      {activeTab === 'feedback' && (
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Feedback & Community Inquiries Moderation
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Review community suggestions, triage inquiries, and add coordinator resolution notes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={feedbackFilter}
                onChange={(e) => setFeedbackFilter(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="all">All Feedback ({allFeedback.length})</option>
                <option value="pending">Pending ({allFeedback.filter((f) => f.status === 'pending').length})</option>
                <option value="reviewed">Reviewed ({allFeedback.filter((f) => f.status === 'reviewed').length})</option>
                <option value="resolved">Resolved ({allFeedback.filter((f) => f.status === 'resolved').length})</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-semibold text-xs">
                No feedback submissions matching selected filter.
              </div>
            ) : (
              filteredFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-lg space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          fb.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                            : fb.status === 'reviewed'
                            ? 'bg-sky-500/20 text-sky-900 dark:text-sky-300'
                            : 'bg-amber-500/20 text-amber-900 dark:text-amber-300'
                        }`}
                      >
                        {fb.status}
                      </span>
                      <span className="text-xs font-black text-slate-950 dark:text-white">
                        {fb.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <select
                        value={fb.status}
                        onChange={(e) => onUpdateFeedbackStatus(fb.id, e.target.value as FeedbackStatus)}
                        className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-white border border-white/60 dark:border-white/10"
                      >
                        <option value="pending">Mark Pending</option>
                        <option value="reviewed">Mark Reviewed</option>
                        <option value="resolved">Mark Resolved</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(editingNoteId === fb.id ? null : fb.id);
                          setAdminNoteInput(fb.adminNote || '');
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold cursor-pointer"
                      >
                        {fb.adminNote ? 'Edit Response' : '+ Add Note'}
                      </button>

                      {onDeleteFeedback && (
                        <button
                          type="button"
                          onClick={() => onDeleteFeedback(fb.id)}
                          className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    "{fb.comments}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-2 border-t border-white/40 dark:border-white/10">
                    <div>
                      From: <strong className="text-slate-800 dark:text-slate-200">{fb.name}</strong> ({fb.email})
                    </div>
                    <div>Rating: {'★'.repeat(fb.rating || 5)}</div>
                  </div>

                  {/* Inline Admin Note Editor */}
                  {editingNoteId === fb.id ? (
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800 border border-emerald-500/30 space-y-2">
                      <label className="block text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                        Admin Official Response Note:
                      </label>
                      <input
                        type="text"
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        placeholder="e.g. Reviewed by Dr. Sharma. Added to upcoming feature release."
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 rounded-lg text-[10px] font-bold bg-slate-200 dark:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateFeedbackStatus(fb.id, fb.status, adminNoteInput.trim());
                            setEditingNoteId(null);
                          }}
                          className="px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-600 text-white"
                        >
                          Save Response Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    fb.adminNote && (
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-950 dark:text-emerald-300">
                        <strong>Admin Response:</strong> {fb.adminNote}
                      </div>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SURVEYS & QUESTIONNAIRES */}
      {activeTab === 'surveys' && (
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Community Health Survey Questionnaires
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Create new community health polls and review member voting distributions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateSurveyOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Survey</span>
            </button>
          </div>

          {/* Create Survey Modal */}
          {isCreateSurveyOpen && (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                  <span>Create New Community Survey Question</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreateSurveyOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSurveySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Survey Question Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. What is your primary hydration challenge?"
                      value={newSurveyTitle}
                      onChange={(e) => setNewSurveyTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Category
                    </label>
                    <select
                      value={newSurveyCategory}
                      onChange={(e) => setNewSurveyCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-white/60 dark:border-white/10 text-xs font-bold"
                    >
                      <option value="Nutrition">Nutrition & Calorie Balance</option>
                      <option value="Hydration">Hydration & Water Habits</option>
                      <option value="Physical Activity">Physical Activity & Exercise</option>
                      <option value="Preventive Health">Preventive Health</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Option 1 *</label>
                    <input
                      type="text"
                      required
                      value={newOption1}
                      onChange={(e) => setNewOption1(e.target.value)}
                      placeholder="Option 1"
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Option 2 *</label>
                    <input
                      type="text"
                      required
                      value={newOption2}
                      onChange={(e) => setNewOption2(e.target.value)}
                      placeholder="Option 2"
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateSurveyOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    Publish Survey
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Survey questions list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCommunityQuestions.map((q) => (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-[10px] font-black uppercase">
                      {q.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-950 dark:text-white mt-1">
                      {q.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSurveyAction(q.id)}
                    className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {q.options.map((opt, idx) => {
                    const total = q.totalVotes || 1;
                    const pct = Math.round((opt.votes / total) * 100);
                    return (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>{opt.text}</span>
                          <span>{opt.votes} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
