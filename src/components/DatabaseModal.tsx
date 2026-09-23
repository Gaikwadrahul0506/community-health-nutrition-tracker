import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  RefreshCw,
  X,
  Layers,
  Users,
  Utensils,
  Calendar,
  MessageSquare,
  HelpCircle,
  FileSpreadsheet,
  Activity,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DatabaseSyncState } from '../services/firestoreService';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: DatabaseSyncState;
  onSyncAll: () => Promise<void>;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  syncState,
  onSyncAll
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      await onSyncAll();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      setSyncSuccessMsg('All application records successfully saved to Firebase Firestore!');
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const collections = [
    {
      name: 'Users & Accounts',
      collection: 'users',
      count: syncState.counts.users,
      icon: Users,
      desc: 'Community accounts, roles, and profile settings'
    },
    {
      name: 'Nutritional Food Library',
      collection: 'foods',
      count: syncState.counts.foods,
      icon: Utensils,
      desc: 'Indian & international foods with calories and macros'
    },
    {
      name: 'Consultation & Camp Slots',
      collection: 'slots',
      count: syncState.counts.slots,
      icon: Calendar,
      desc: 'Doctor appointments, workshops, and user bookings'
    },
    {
      name: 'Survey Poll Questions',
      collection: 'communityQuestions',
      count: syncState.counts.questions,
      icon: HelpCircle,
      desc: 'Community nutrition questions and live voting counts'
    },
    {
      name: 'Community Feedback',
      collection: 'feedback',
      count: syncState.counts.feedback,
      icon: MessageSquare,
      desc: 'Reviews, suggestions, and community inquiries'
    },
    {
      name: 'Survey Audit Responses',
      collection: 'surveys',
      count: syncState.counts.surveys,
      icon: FileSpreadsheet,
      desc: 'Nutritional intake survey responses and analytics'
    },
    {
      name: 'Daily Meal & Activity Logs',
      collection: 'dayRecords',
      count: syncState.counts.dayRecords,
      icon: Activity,
      desc: 'User meals, water intake logs, and workout sessions'
    },
    {
      name: 'BMI Calculation History',
      collection: 'bmiHistory',
      count: syncState.counts.bmiHistory,
      icon: Layers,
      desc: 'Historical weight, height, and BMI assessments'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-white/60 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 flex-wrap">
                Firebase Firestore Cloud Database
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bold uppercase tracking-wider">
                  Live Cloud
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-400/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" /> Admin Exclusive
                </span>
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Real-time persistence for all NutriTrack website data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Status Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-emerald-950 dark:text-emerald-300">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firestore Connection: Connected & Ready
                </div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono mt-0.5">
                  Database ID: ai-studio-communityhealthn-09d4ac34
                </div>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All to Cloud'}</span>
            </button>
          </div>

          {syncSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
          )}

          {/* Collections Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Cloud Collections & Synced Records
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((col) => {
                const IconComponent = col.icon;
                return (
                  <div
                    key={col.collection}
                    className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 transition-all flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {col.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1">
                          {col.desc}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                          /{col.collection}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-black text-xs font-mono">
                        {col.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automated Cloud Synchronization
            </div>
            <p className="text-[11px] leading-relaxed">
              Every action taken in the app—such as user registration, consultation bookings, meal logs, water intake, workouts, BMI calculations, and survey responses—is automatically synchronized directly to your Cloud Firestore database.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {syncState.lastSyncedAt
              ? `Last synced: ${new Date(syncState.lastSyncedAt).toLocaleTimeString()}`
              : 'Real-time synchronization active'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
