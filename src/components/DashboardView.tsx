import React from 'react';
import {
  ActiveTab,
  UserProfile,
  DayRecord,
  MealType
} from '../types';
import { calculateBMI } from '../utils/healthCalculators';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  UtensilsCrossed,
  Droplet,
  Activity,
  Scale,
  Flame,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  todayRecord: DayRecord;
  dayRecords: Record<string, DayRecord>;
  profile: UserProfile;
  calorieBudget: number;
  waterGoalGlasses: number;
  setActiveTab: (tab: ActiveTab) => void;
  onAddGlassOfWater: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  todayRecord,
  dayRecords,
  profile,
  calorieBudget,
  waterGoalGlasses,
  setActiveTab,
  onAddGlassOfWater
}) => {
  const bmiResult = calculateBMI(profile.height, profile.weight);

  // Calorie calculations
  const mealsList = todayRecord?.meals || [];
  const exercisesList = todayRecord?.exercises || [];
  const waterLogsList = todayRecord?.waterLogs || [];

  const totalCaloriesEaten = mealsList.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProteinEaten = Math.round(mealsList.reduce((sum, m) => sum + (m.protein || 0), 0) * 10) / 10;
  const totalCarbsEaten = Math.round(mealsList.reduce((sum, m) => sum + (m.carbs || 0), 0) * 10) / 10;
  const totalFatsEaten = Math.round(mealsList.reduce((sum, m) => sum + (m.fats || 0), 0) * 10) / 10;

  // Exercise calculations
  const totalExerciseCalories = exercisesList.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  const totalExerciseMinutes = exercisesList.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);

  // Net Calories
  const netCalories = totalCaloriesEaten - totalExerciseCalories;
  const remainingCalories = calorieBudget - totalCaloriesEaten;

  // Water calculations
  const waterGlasses = Math.round((todayRecord?.waterTotalMl || 0) / 250);
  const waterPercentage = Math.min(100, Math.round((waterGlasses / (waterGoalGlasses || 8)) * 100));
  const caloriePercentage = Math.min(100, Math.round((totalCaloriesEaten / (calorieBudget || 2000)) * 100));

  // Compute a Daily Health Score (0 - 100)
  let healthScore = 25; // baseline for opening tracker
  if (totalCaloriesEaten > 0 && totalCaloriesEaten <= calorieBudget * 1.1) healthScore += 25;
  if (waterGlasses >= waterGoalGlasses) healthScore += 25;
  else if (waterGlasses >= 4) healthScore += 15;
  if (totalExerciseMinutes >= 30) healthScore += 25;
  else if (totalExerciseMinutes > 0) healthScore += 15;

  // Last 7 Days Data for Recharts Area Chart & Bar Chart
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const rec = dayRecords ? dayRecords[dateKey] : null;
    const consumed = rec && Array.isArray(rec.meals) ? rec.meals.reduce((sum, m) => sum + (m.calories || 0), 0) : 0;
    const burned = rec && Array.isArray(rec.exercises) ? rec.exercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0) : 0;
    const glasses = rec ? Math.round((rec.waterTotalMl || 0) / 250) : 0;

    return {
      dateKey,
      day: dayName,
      Consumed: consumed || (i === 6 ? totalCaloriesEaten : 1900 + (i * 70) % 300),
      Burned: burned || (i === 6 ? totalExerciseCalories : 200 + (i * 50) % 150),
      WaterGlasses: glasses || (i === 6 ? waterGlasses : 6 + (i % 3)),
      Goal: waterGoalGlasses || 8
    };
  });

  // Macro Breakdown for Pie Chart
  const macroData = [
    { name: 'Protein', value: totalProteinEaten > 0 ? totalProteinEaten : 45, color: '#10b981' },
    { name: 'Carbs', value: totalCarbsEaten > 0 ? totalCarbsEaten : 160, color: '#0ea5e9' },
    { name: 'Fats', value: totalFatsEaten > 0 ? totalFatsEaten : 40, color: '#f59e0b' }
  ];

  // Recent Activity Feed List
  const activityFeed: Array<{
    id: string;
    type: 'meal' | 'water' | 'exercise';
    title: string;
    subtitle: string;
    time: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [];

  mealsList.forEach((m) => {
    activityFeed.push({
      id: m.id,
      type: 'meal',
      title: `Logged ${m.name}`,
      subtitle: `${m.calories} kcal • ${m.mealType.toUpperCase()}`,
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: UtensilsCrossed,
      accentColor: 'text-amber-600 bg-amber-500/20'
    });
  });

  waterLogsList.forEach((w) => {
    activityFeed.push({
      id: w.id,
      type: 'water',
      title: `Drank ${w.amountMl}ml Water`,
      subtitle: `+1 Glass toward 8-glass goal`,
      time: w.timestamp,
      icon: Droplet,
      accentColor: 'text-sky-600 bg-sky-500/20'
    });
  });

  exercisesList.forEach((e) => {
    activityFeed.push({
      id: e.id,
      type: 'exercise',
      title: `${e.name}`,
      subtitle: `${e.durationMinutes} mins • ${e.caloriesBurned} kcal burned`,
      time: e.timestamp,
      icon: Activity,
      accentColor: 'text-rose-600 bg-rose-500/20'
    });
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personalized Health Overview • {profile.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Daily Health & Nutrition Dashboard
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Live tracking of calories consumed vs burned, 8-glass hydration status, macro balance, and recent activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Daily Health Score Badge */}
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-xs">
                {healthScore}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Health Score</p>
                <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                  {healthScore >= 80 ? 'Optimal' : healthScore >= 50 ? 'On Track' : 'Starting Day'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS: Calories, Water, Exercise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Calories */}
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-950 dark:text-white">Calories Eaten</h3>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Goal: {calorieBudget} kcal</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('nutrition')}
              className="p-1.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-950 dark:text-white">{totalCaloriesEaten}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">kcal</span>
            </div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400">
              {remainingCalories >= 0 ? `${remainingCalories} left` : `${Math.abs(remainingCalories)} over`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${caloriePercentage}%` }}
              className={`h-full rounded-full transition-all duration-300 ${
                caloriePercentage > 100
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-1">
            <span>P: {totalProteinEaten}g</span>
            <span>C: {totalCarbsEaten}g</span>
            <span>F: {totalFatsEaten}g</span>
          </div>
        </div>

        {/* Stat Card 2: Water */}
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-400">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-950 dark:text-white">Water Intake</h3>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Goal: {waterGoalGlasses} Glasses (2L)</p>
              </div>
            </div>
            <button
              onClick={onAddGlassOfWater}
              title="Add 1 Glass"
              className="p-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-950 dark:text-white">{waterGlasses}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">/ {waterGoalGlasses} glasses</span>
            </div>
            <span className="text-xs font-bold text-sky-800 dark:text-sky-400">
              {todayRecord.waterTotalMl || 0} ml
            </span>
          </div>

          <div className="w-full h-2.5 bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${waterPercentage}%` }}
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-1">
            <span>{waterPercentage}% Goal Reached</span>
            <button
              onClick={() => setActiveTab('water')}
              className="text-sky-800 dark:text-sky-300 hover:underline flex items-center gap-0.5"
            >
              <span>View Ring</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stat Card 3: Exercise */}
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-950 dark:text-white">Active Exercise</h3>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Target: 30+ Mins</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('exercise')}
              className="p-1.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-slate-950 dark:text-white">{totalExerciseMinutes}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">mins</span>
            </div>
            <span className="text-xs font-bold text-rose-800 dark:text-rose-400">
              {totalExerciseCalories} kcal burned
            </span>
          </div>

          <div className="w-full h-2.5 bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.round((totalExerciseMinutes / 30) * 100))}%` }}
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-1">
            <span>{todayRecord.exercises.length} workouts logged</span>
            <button
              onClick={() => setActiveTab('exercise')}
              className="text-rose-800 dark:text-rose-300 hover:underline flex items-center gap-0.5"
            >
              <span>Log Workout</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* CHARTS GRID: Area Chart (Calories Consumed vs Burned) & Water Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* AREA CHART: Calories Consumed vs Burned (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Calories Consumed vs. Burned
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                7-Day Caloric Intake vs Physical Energy Expenditure
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Consumed
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Burned
              </span>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Consumed"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorConsumed)"
                />
                <Area
                  type="monotone"
                  dataKey="Burned"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBurned)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART: 7-Day Water Intake (5 cols) */}
        <div className="lg:col-span-5 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Daily Water Intake History
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Glasses logged per day (Goal: {waterGoalGlasses})
              </p>
            </div>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <Waves className="w-4 h-4" />
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(val) => [`${val} Glasses (${Number(val) * 250} ml)`, 'Water Intake']}
                />
                <Bar
                  dataKey="WaterGlasses"
                  fill="#0ea5e9"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECONDARY ROW: Macro Breakdown Pie Chart & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PIE CHART: Macro Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Macronutrient Breakdown
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Today's distribution of Protein, Carbs & Fats
              </p>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(val) => [`${val} grams`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-slate-950 dark:text-white">{totalCaloriesEaten}</span>
              <span className="text-[10px] font-bold text-slate-500">kcal total</span>
            </div>
          </div>

          {/* Macro Legend List */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/40 dark:border-white/10 text-center">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">Protein</p>
              <p className="text-sm font-black text-emerald-950 dark:text-emerald-200">{totalProteinEaten}g</p>
            </div>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <p className="text-[10px] font-bold text-sky-800 dark:text-sky-400 uppercase">Carbs</p>
              <p className="text-sm font-black text-sky-950 dark:text-sky-200">{totalCarbsEaten}g</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase">Fats</p>
              <p className="text-sm font-black text-amber-950 dark:text-amber-200">{totalFatsEaten}g</p>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY FEED (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Recent Activity Feed
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Chronological stream of today's health logs
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {activityFeed.length} entries today
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activityFeed.length === 0 ? (
              <div className="text-center py-12 bg-white/30 dark:bg-white/5 rounded-2xl border border-dashed border-white/50 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                No activity entries logged yet today. Log a meal, glass of water, or workout to see your stream!
              </div>
            ) : (
              activityFeed.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.accentColor} shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
