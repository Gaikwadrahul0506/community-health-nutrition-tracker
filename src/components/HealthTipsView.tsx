import React, { useState } from 'react';
import { HealthTip, HabitChecklistItem } from '../types';
import { HEALTH_TIPS } from '../data/initialData';
import {
  HeartPulse,
  UtensilsCrossed,
  Activity,
  Moon,
  Droplet,
  CheckCircle2,
  Sparkles,
  BookOpen,
  CheckSquare,
  Square,
  Users,
  Lightbulb,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HealthTipsViewProps {
  habits: HabitChecklistItem[];
  onToggleHabit: (habitId: string) => void;
}

export const HealthTipsView: React.FC<HealthTipsViewProps> = ({
  habits,
  onToggleHabit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Guidelines', icon: Sparkles },
    { id: 'diet', label: 'Healthy Diet', icon: UtensilsCrossed },
    { id: 'exercise', label: 'Exercise & Fitness', icon: Activity },
    { id: 'sleep', label: 'Restful Sleep', icon: Moon },
    { id: 'hydration', label: 'Hydration Advice', icon: Droplet },
    { id: 'community', label: 'Community Wellness', icon: Users }
  ];

  const filteredTips = selectedCategory === 'all'
    ? HEALTH_TIPS
    : HEALTH_TIPS.filter((t) => t.category === selectedCategory);

  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const habitPercentage = Math.round((completedHabitsCount / habits.length) * 100);

  const handleToggle = (id: string) => {
    onToggleHabit(id);
    const target = habits.find((h) => h.id === id);
    if (target && !target.completed && completedHabitsCount + 1 === habits.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Evidence-Based Community Guidance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Health Tips & Daily Habit Checklist
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Practical nutritional advice, physical training recommendations, sleep hygiene tips, and daily wellness habits.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white px-5 py-3 rounded-2xl shadow-md shrink-0">
            <Award className="w-7 h-7" />
            <div>
              <span className="text-[11px] font-semibold opacity-90 block">Habits Checked Today</span>
              <span className="text-xl font-black">{completedHabitsCount} of {habits.length} ({habitPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Daily Health Habit Checklist */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Daily Community Habit Checklist
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tick off your healthy accomplishments for today.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden self-center">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${habitPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => handleToggle(habit.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                habit.completed
                  ? 'bg-emerald-100/80 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {habit.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <span className={`text-xs font-semibold leading-snug block ${habit.completed ? 'line-through opacity-85' : ''}`}>
                  {habit.text}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 mt-1 inline-block">
                  {habit.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Health Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {tip.tag}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {tip.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {tip.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {tip.summary}
              </p>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                {tip.content}
              </p>
            </div>

            {/* Actionable Step Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2.5 mt-4">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                  Actionable Today
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {tip.actionableStep}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
