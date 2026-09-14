import React, { useState, useMemo } from 'react';
import {
  DayRecord,
  ExerciseEntry,
  ExerciseType,
  UserProfile,
  ExerciseCategory,
  ExerciseDatabaseItem
} from '../types';
import {
  WORLD_EXERCISE_DATABASE,
  EXERCISE_CATEGORIES,
  calculateCaloriesBurned,
  getYoutubeEmbedUrl,
  getYoutubeDirectUrl,
  getYoutubeSearchUrl,
  getYoutubeThumbnailUrl
} from '../data/exerciseDatabase';
import {
  Activity,
  Flame,
  Plus,
  Trash2,
  Clock,
  Zap,
  Search,
  Dumbbell,
  Sparkles,
  Trophy,
  Shield,
  Heart,
  Globe,
  Info,
  CheckCircle2,
  Filter,
  Play,
  Video,
  ExternalLink,
  Youtube,
  Tv
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseTrackerViewProps {
  currentDayRecord: DayRecord;
  profile: UserProfile;
  onAddExercise: (exercise: Omit<ExerciseEntry, 'id' | 'timestamp'>) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

export const ExerciseTrackerView: React.FC<ExerciseTrackerViewProps> = ({
  currentDayRecord,
  profile,
  onAddExercise,
  onDeleteExercise
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all');

  // Video tutorial modal state
  const [viewingVideoExercise, setViewingVideoExercise] = useState<ExerciseDatabaseItem | null>(null);

  // Exercise selection state for quick-log modal/inline
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDatabaseItem | null>(null);
  const [modalDuration, setModalDuration] = useState<number>(30);
  const [modalNotes, setModalNotes] = useState<string>('');

  // Custom workout logger state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<ExerciseCategory>('cardio');
  const [customDuration, setCustomDuration] = useState<number>(30);
  const [customIntensity, setCustomIntensity] = useState<'low' | 'moderate' | 'high' | 'vigorous'>('moderate');
  const [customMet, setCustomMet] = useState<number>(5.0);
  const [customNotes, setCustomNotes] = useState('');

  const userWeight = profile?.weight && profile.weight > 20 ? profile.weight : 70;

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return WORLD_EXERCISE_DATABASE.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesIntensity = selectedIntensity === 'all' || item.intensity === selectedIntensity;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.targetMuscles.some((m) => m.toLowerCase().includes(q)) ||
        item.equipment.toLowerCase().includes(q) ||
        (item.benefits && item.benefits.toLowerCase().includes(q));

      return matchesCategory && matchesIntensity && matchesQuery;
    });
  }, [searchQuery, selectedCategory, selectedIntensity]);

  const handleQuickLogFromDb = (item: ExerciseDatabaseItem) => {
    setSelectedExercise(item);
    setModalDuration(30);
    setModalNotes('');
  };

  const handleConfirmDbLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise) return;

    const burned = calculateCaloriesBurned(selectedExercise.met, userWeight, modalDuration);

    onAddExercise({
      type: (selectedExercise.category as ExerciseType) || 'gym',
      name: selectedExercise.name,
      category: selectedExercise.category,
      durationMinutes: modalDuration,
      intensity: selectedExercise.intensity,
      caloriesBurned: burned,
      targetMuscles: selectedExercise.targetMuscles,
      notes: modalNotes.trim() || `${selectedExercise.equipment} • ${selectedExercise.targetMuscles.join(', ')}`
    });

    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    setSelectedExercise(null);
  };

  const handleLogCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const burned = calculateCaloriesBurned(customMet, userWeight, customDuration);

    onAddExercise({
      type: (customCategory as ExerciseType) || 'custom',
      name: customName.trim(),
      category: customCategory,
      durationMinutes: customDuration,
      intensity: customIntensity,
      caloriesBurned: burned,
      notes: customNotes.trim()
    });

    setCustomName('');
    setCustomNotes('');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const safeExercises = currentDayRecord?.exercises || [];
  const totalBurned = safeExercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  const totalMinutes = safeExercises.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Universal World Exercise Library & Real YouTube Video Tutorials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Comprehensive World Exercise & Activity Tracker
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Explore 50+ scientifically calibrated exercises from all around the world — Cardio, Powerlifting, Calisthenics, Yoga, Worldwide Sports, Indian Akhada Desi workouts, and daily functional activities, each with authentic real YouTube video form guides!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Today’s Energy Output ({profile?.weight || 70} kg body weight)
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalMinutes} <span className="text-xs font-semibold text-slate-400">mins ({totalBurned} kcal burned)</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switch: World Library vs Custom Workout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'library'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>World Exercise Database ({WORLD_EXERCISE_DATABASE.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Custom Activity Logger</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span>
          <span>100% Real YouTube Video Demonstrations Included</span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'library' ? (
        <div className="space-y-6">
          {/* Search and Category Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search exercises by name, muscle (e.g., quads, chest, core), sport, or equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedIntensity}
                  onChange={(e) => setSelectedIntensity(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  <option value="all">All Intensities</option>
                  <option value="low">Low Intensity</option>
                  <option value="moderate">Moderate Intensity</option>
                  <option value="high">High Intensity</option>
                  <option value="vigorous">Vigorous / Maximum</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All Domains ({WORLD_EXERCISE_DATABASE.length})
              </button>
              {EXERCISE_CATEGORIES.map((cat) => {
                const count = WORLD_EXERCISE_DATABASE.filter((e) => e.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((item) => {
              const cals30m = calculateCaloriesBurned(item.met, userWeight, 30);
              const intensityColor =
                item.intensity === 'vigorous'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  : item.intensity === 'high'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                  : item.intensity === 'moderate'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {item.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${intensityColor}`}>
                        {item.intensity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Muscle Groups */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.targetMuscles.slice(0, 3).map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {m}
                        </span>
                      ))}
                      {item.targetMuscles.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium self-center">
                          +{item.targetMuscles.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          MET {item.met} • 30 mins
                        </span>
                        <span className="text-base font-black text-rose-600 dark:text-rose-400">
                          ~{cals30m} <span className="text-xs font-semibold text-slate-500">kcal</span>
                        </span>
                      </div>

                      {item.youtubeUrl && (
                        <button
                          type="button"
                          onClick={() => setViewingVideoExercise(item)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-red-200 dark:border-red-800/80 shadow-2xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-red-600 dark:fill-red-400" />
                          <span>Video Guide</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickLogFromDb(item)}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Session</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExercises.length === 0 && (
            <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No exercises matched "{searchQuery}". Try searching another movement or switch category.</p>
            </div>
          )}
        </div>
      ) : (
        /* Custom Activity Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Log Custom Physical Activity
            </h3>

            <form onSubmit={handleLogCustomExercise} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Activity / Sport Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backyard cricket with kids, Stair climbing, Boxing heavy bag"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as ExerciseCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    {EXERCISE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Intensity Level
                  </label>
                  <select
                    value={customIntensity}
                    onChange={(e) => {
                      const lvl = e.target.value as 'low' | 'moderate' | 'high' | 'vigorous';
                      setCustomIntensity(lvl);
                      if (lvl === 'low') setCustomMet(3.5);
                      if (lvl === 'moderate') setCustomMet(5.5);
                      if (lvl === 'high') setCustomMet(8.0);
                      if (lvl === 'vigorous') setCustomMet(11.0);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="low">Low (Light Warmup)</option>
                    <option value="moderate">Moderate (Paced)</option>
                    <option value="high">High (Elevated Heart Rate)</option>
                    <option value="vigorous">Vigorous (All-Out Effort)</option>
                  </select>
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Duration (Minutes)
                  </label>
                  <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    {customDuration} minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workout Notes / Sets / Equipment
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4 sets of 12 reps, sunny weather, high energy"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Calculated Burn Display */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    Estimated Calories Burned ({userWeight} kg)
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {calculateCaloriesBurned(customMet, userWeight, customDuration)}{' '}
                    <span className="text-xs font-semibold text-slate-500">kcal</span>
                  </div>
                </div>
                <Flame className="w-8 h-8 text-rose-600" />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Record Custom Workout</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Exercise Science & MET Guide
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>What is MET?</strong> Metabolic Equivalent of Task (MET) is the standard physiological measure of the energy cost of physical activities.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>1 MET:</strong> Energy spent sitting quietly at rest (~1 kcal/kg/hour).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>3 - 6 METs:</strong> Moderate activity (brisk walk, gentle cycling, yoga, gardening).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>6+ METs:</strong> Vigorous exercise (jogging, football, HIIT, heavy weights, swimming).</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Today's Logged Workouts Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Today’s Logged Workouts ({safeExercises.length})
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            Total Output: {totalBurned} kcal
          </span>
        </div>

        {safeExercises.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <Activity className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No workouts recorded yet today.</p>
            <p className="text-[11px] text-slate-400">Pick any exercise above, watch the video tutorial, or click "Log Session" to track your physical movement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {safeExercises.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {entry.name}
                    </h4>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {entry.durationMinutes} mins
                      </span>
                      <span className="capitalize font-semibold text-rose-600 dark:text-rose-400">
                        {entry.intensity} intensity
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 truncate max-w-xs">{entry.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {entry.caloriesBurned} kcal
                  </span>
                  <button
                    onClick={() => onDeleteExercise(entry.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REAL YOUTUBE VIDEO TUTORIAL MODAL */}
      {viewingVideoExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                      YouTube Video Guide
                    </span>
                    <span className="text-slate-400 text-xs font-semibold">
                      MET {viewingVideoExercise.met}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight mt-0.5">
                    {viewingVideoExercise.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getYoutubeDirectUrl(viewingVideoExercise.youtubeUrl || viewingVideoExercise.youtubeVideoId, viewingVideoExercise.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  title="Watch directly on YouTube (Fixes any embed restriction)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Watch on YouTube</span>
                </a>
                <button
                  onClick={() => setViewingVideoExercise(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-red-400 transition-colors text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full aspect-video bg-black shrink-0">
              <iframe
                src={getYoutubeEmbedUrl(viewingVideoExercise.youtubeUrl || viewingVideoExercise.youtubeVideoId)}
                title={`${viewingVideoExercise.name} Video Tutorial`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Fallback Banner for restricted/errored embeds */}
            <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Video showing an error or disabled by creator? <strong>Open directly in YouTube for instant HD playback:</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={getYoutubeDirectUrl(viewingVideoExercise.youtubeUrl || viewingVideoExercise.youtubeVideoId, viewingVideoExercise.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Video (HD)
                </a>
                <a
                  href={getYoutubeSearchUrl(viewingVideoExercise.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-semibold inline-flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  Search Alternate Guides
                </a>
              </div>
            </div>

            {/* Modal Body & Info */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {viewingVideoExercise.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Target Muscles</span>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {viewingVideoExercise.targetMuscles.join(', ')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Equipment Needed</span>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {viewingVideoExercise.equipment}
                  </div>
                </div>
              </div>

              {viewingVideoExercise.benefits && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Health & Functional Benefit:</strong> {viewingVideoExercise.benefits}
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Burns approx. <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{calculateCaloriesBurned(viewingVideoExercise.met, userWeight, 30)} kcal</strong> per 30 minutes
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setViewingVideoExercise(null)}
                    className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Close Video
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const ex = viewingVideoExercise;
                      setViewingVideoExercise(null);
                      handleQuickLogFromDb(ex);
                    }}
                    className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Workout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Log Modal when clicking an exercise from the DB */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[11px] font-bold uppercase">
                  {selectedExercise.category} • MET {selectedExercise.met}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedExercise.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {selectedExercise.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div><strong>Target Muscles:</strong> {selectedExercise.targetMuscles.join(', ')}</div>
              <div><strong>Equipment:</strong> {selectedExercise.equipment}</div>
              {selectedExercise.benefits && <div><strong>Health Benefit:</strong> {selectedExercise.benefits}</div>}

              {selectedExercise.youtubeUrl && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" /> Real YouTube Video Available
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const item = selectedExercise;
                      setSelectedExercise(null);
                      setViewingVideoExercise(item);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-[11px] hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    Watch Tutorial ▶
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleConfirmDbLog} className="space-y-4">
              {/* Preset Duration Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setModalDuration(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        modalDuration === mins
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for precision */}
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={modalDuration}
                  onChange={(e) => setModalDuration(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <span className="text-sm font-black text-rose-600 dark:text-rose-400 w-16 text-right">
                  {modalDuration} mins
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Notes (Sets / Pace / Environment)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5km brisk morning session with friends"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Live Calorie Burn Display */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    Calculated Energy Burn ({userWeight} kg)
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {calculateCaloriesBurned(selectedExercise.met, userWeight, modalDuration)}{' '}
                    <span className="text-xs font-semibold text-slate-500">kcal</span>
                  </div>
                </div>
                <Flame className="w-8 h-8 text-rose-600" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedExercise(null)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log {modalDuration} mins to Today</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
