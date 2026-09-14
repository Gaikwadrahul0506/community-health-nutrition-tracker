import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import {
  UtensilsCrossed,
  Droplet,
  Scale,
  Activity,
  HeartPulse,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Target,
  CheckCircle2,
  Salad,
  Flame,
  Moon,
  Sparkles,
  BookOpen,
  Bot
} from 'lucide-react';
import { MotivationalQuoteCard } from './MotivationalQuoteCard';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile;
  todayCalories: number;
  calorieBudget: number;
  todayWaterGlasses: number;
  waterGoalGlasses: number;
  todayExerciseMins: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  profile,
  todayCalories,
  calorieBudget,
  todayWaterGlasses,
  waterGoalGlasses,
  todayExerciseMins
}) => {
  const quickActions = [
    {
      id: 'nutrition' as ActiveTab,
      title: 'Nutrition Tracker',
      desc: 'Log meals (Breakfast, Lunch, Dinner, Snacks) and track calories & macros.',
      icon: UtensilsCrossed,
      color: 'from-amber-500 to-orange-500',
      badge: 'Meal Logging',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-amber-700 dark:text-amber-300'
    },
    {
      id: 'water' as ActiveTab,
      title: 'Water Intake Tracker',
      desc: 'Track daily 8-glass hydration with interactive fluid visualizer and reminders.',
      icon: Droplet,
      color: 'from-blue-500 to-cyan-500',
      badge: '8 Glasses Daily',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-blue-700 dark:text-blue-300'
    },
    {
      id: 'bmi' as ActiveTab,
      title: 'BMI Health Calculator',
      desc: 'Calculate Body Mass Index, discover ideal healthy weight range & health tips.',
      icon: Scale,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Body Composition',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'exercise' as ActiveTab,
      title: 'Exercise & Calorie Burn',
      desc: 'Log Walking, Running, Cycling, Yoga, Gym workouts with MET burn estimations.',
      icon: Activity,
      color: 'from-rose-500 to-pink-500',
      badge: 'Physical Activity',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-rose-700 dark:text-rose-300'
    },
    {
      id: 'ai_assistant' as ActiveTab,
      title: 'AI Health & Fitness Coach',
      desc: 'Get real-time answers on calories, Indian diet plans, hydration status, workouts, and wellness.',
      icon: Bot,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Smart AI',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'dashboard' as ActiveTab,
      title: 'Unified Health Dashboard',
      desc: 'View your real-time day overview, macro balance, and weekly progress charts.',
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      badge: 'Overview',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-purple-700 dark:text-purple-300'
    },
    {
      id: 'survey' as ActiveTab,
      title: 'Community Lifestyle Survey',
      desc: 'Participate in the CEP community research survey & explore collective community data.',
      icon: ClipboardList,
      color: 'from-teal-500 to-emerald-600',
      badge: 'CEP Research',
      bgLight: 'bg-white/40 dark:bg-white/5',
      borderLight: 'border-white/50 dark:border-white/10',
      textAccent: 'text-teal-700 dark:text-teal-300'
    }
  ];

  const benefitsNutrition = [
    'Sustained physical energy throughout the day without heavy sugar crashes',
    'Boosts immune resistance and accelerates cellular muscle recovery',
    'Protects against lifestyle diseases like diabetes, hypertension, and obesity',
    'Enhances cognitive performance, concentration, and emotional well-being'
  ];

  const benefitsExercise = [
    'Strengthens cardiovascular health and improves lung oxygen capacity',
    'Stimulates endorphin release to naturally relieve mental anxiety & stress',
    'Improves joint mobility, core stability, bone density, and posture',
    'Promotes deeper restorative sleep and metabolic calorie burning'
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner with Frosted Glass */}
      <section className="relative overflow-hidden rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl text-slate-900 dark:text-white p-6 sm:p-10 shadow-2xl border border-white/60 dark:border-white/10">
        {/* Background glow & decorative elements */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/60 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-white/60 dark:border-emerald-700/50 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Community Engagement Project (CEP) Initiative</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Nutrition and health tracking app <span className="text-emerald-700 dark:text-emerald-400">for community use</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
              Welcome, <span className="font-bold text-slate-900 dark:text-white">{profile.name || 'Friend'}</span>! Track your daily meals, stay hydrated with 8 glasses of water, calculate your BMI, log workouts, and join our neighborhood wellness survey.
            </p>
          </div>

          {/* Quick Snapshot / Live Counters in Frosted Glass */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-xs">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">Today's Calories</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {todayCalories} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">/ {calorieBudget} kcal</span>
              </div>
            </div>
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-xs">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 block mb-1">Water Hydration</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {todayWaterGlasses} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">/ {waterGoalGlasses} glasses</span>
              </div>
            </div>
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-xs">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block mb-1">Exercise Today</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {todayExerciseMins} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">mins active</span>
              </div>
            </div>
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-xs">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block mb-1">Target Goal</span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white capitalize truncate">
                {profile.goal.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Go to Today's Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className="px-5 py-3.5 rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white/80 text-slate-900 dark:text-white font-bold text-sm border border-white/60 dark:border-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-xs backdrop-blur-sm"
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Log a Meal</span>
            </button>
            <button
              onClick={() => setActiveTab('bmi')}
              className="px-5 py-3.5 rounded-2xl bg-white/40 dark:bg-white/10 hover:bg-white/60 text-slate-900 dark:text-white font-bold text-sm border border-white/50 dark:border-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-xs backdrop-blur-sm"
            >
              <Scale className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Check BMI</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_assistant')}
              className="px-5 py-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold text-sm border border-emerald-300 dark:border-emerald-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>
      </section>

      {/* Motivational Quote Banner */}
      <MotivationalQuoteCard />

      {/* Core Feature Navigator Cards with Frosted Glass */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Community Health Modules
            </h2>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Select any tracker below to monitor your personal wellness journey.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-bold text-emerald-900 dark:text-emerald-300 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className={`group p-6 rounded-3xl border ${action.borderLight} ${action.bgLight} backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-900/60 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-xs backdrop-blur-sm">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Module</span>
                  <ArrowRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About the CEP Project Section with Frosted Glass */}
      <section className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Community Engagement Project (CEP)
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              About This Project & Community Mission
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <div className="space-y-2 p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              1. Community Health Need
            </div>
            <p>
              Urban and student communities frequently face rising rates of sedentary habits, inadequate water intake, and nutrient-poor ultra-processed foods. This CEP initiative addresses health literacy gaps at a grassroots level.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
              <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              2. Accessible Digital Tool
            </div>
            <p>
              By providing an intuitive, private, zero-barrier web portal, community members can self-assess their BMI, track meals, calculate daily hydration targets, and log physical workouts with immediate visual feedback.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              3. Data Privacy & Local Storage
            </div>
            <p>
              All personal logs remain stored securely inside your web browser. No external tracking or commercial ads—created strictly as an educational and community enhancement resource.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits of Healthy Eating and Exercise */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Healthy Eating Benefits */}
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
              <Salad className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Nutritional Science
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Benefits of Balanced Eating
              </h3>
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            Fueling your body with whole grains, colorful vegetables, adequate proteins, and healthy fats delivers transformative benefits:
          </p>
          <ul className="space-y-3 pt-2">
            {benefitsNutrition.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('tips')}
              className="text-xs font-bold text-emerald-900 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Nutrition Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Regular Exercise Benefits */}
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-md">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-400">
                Active Living
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Benefits of Daily Physical Activity
              </h3>
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            Engaging in at least 30 minutes of moderate exercise such as walking, cycling, or yoga revitalizes both physical and mental health:
          </p>
          <ul className="space-y-3 pt-2">
            {benefitsExercise.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('exercise')}
              className="text-xs font-bold text-rose-800 dark:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Log Your Daily Workout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Community Survey Callout Banner with Frosted Glass */}
      <section className="rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 border border-white/60 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <ClipboardList className="w-4 h-4" />
            <span>Community Health Survey</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Have 2 minutes? Take the CEP Community Survey
          </h3>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Help our CEP research team analyze local nutrition patterns, average water intake, and weekly physical activity across participants.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('survey')}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Take 2-Min Survey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
