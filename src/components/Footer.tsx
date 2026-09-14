import React from 'react';
import { ActiveTab } from '../types';
import {
  HeartPulse,
  Users,
  Award,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Lock
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuthModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAuthModal }) => {
  return (
    <footer className="bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-2xl text-slate-300 border-t border-white/30 dark:border-white/10 mt-16 transition-colors shadow-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Col 1: About the CEP Project (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">
                Nutri<span className="text-emerald-400">Track</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 backdrop-blur-xs">
                CEP 2026
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed font-medium">
              A community engagement initiative empowering neighborhood members and educational groups with transparent nutrition logging, 8-glass water habit tracking, BMI evaluations, and active lifestyle guidance.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm shadow-xs">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Community Driven
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm shadow-xs">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                CEP Project Submission
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Offline-Ready Storage
              </span>
            </div>
          </div>

          {/* Col 2: Quick Features Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Core Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
              <li>
                <button
                  onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  📊 Daily Health Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('nutrition'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  🍽️ Nutrition Tracker & Food DB
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('water'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  💧 8-Glass Water Hydration
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('bmi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  ⚖️ BMI Health Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('exercise'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  🏃 Exercise & Workout Log
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('ai_assistant'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  🤖 AI Health & Fitness Coach
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('survey'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  📝 Community Health Survey
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: CEP Project Admins Contact (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CEP Project Admins</span>
              </h4>
              <button
                onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-[11px] font-bold text-emerald-400 hover:underline"
              >
                Admin Panel →
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              {/* Admin 1 */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">Rahul Gaikwad</strong>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Lead Coordinator</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Mail className="w-3 h-3 text-emerald-400" />
                  <a href="mailto:gaikwadrahul0506@gmail.com" className="hover:underline text-emerald-300 truncate">
                    gaikwadrahul0506@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>+91 9833618673</span>
                </div>
              </div>

              {/* Admin 2 */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">Rohini Sharma</strong>
                  <span className="text-[10px] text-teal-400 font-bold uppercase">Nutrition Research</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Mail className="w-3 h-3 text-teal-400" />
                  <a href="mailto:rohin9324@gmail.com" className="hover:underline text-teal-300 truncate">
                    rohin9324@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Phone className="w-3 h-3 text-teal-400" />
                  <span>+91 9324408918</span>
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={onOpenAuthModal}
                className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin / User Sign In</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NutriTrack CEP Platform. Rahul Gaikwad & Rohini Sharma.</p>
          <p className="text-slate-400">
            Community Engagement Project for Public Health Literacy.
          </p>
        </div>
      </div>
    </footer>
  );
};
