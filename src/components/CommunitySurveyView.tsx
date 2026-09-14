import React, { useState, useEffect } from 'react';
import { SurveyResponse, SurveyQuestion, UserAccount } from '../types';
import {
  ClipboardList,
  CheckCircle2,
  Users,
  BarChart3,
  Sparkles,
  PieChart,
  Send,
  HelpCircle,
  Activity,
  Droplet,
  Salad,
  Moon,
  Check,
  Vote,
  TrendingUp,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommunitySurveyViewProps {
  surveys: SurveyResponse[];
  communityQuestions: SurveyQuestion[];
  currentUser?: UserAccount | null;
  onSubmitSurvey: (survey: Omit<SurveyResponse, 'id' | 'timestamp'>) => void;
  onVoteQuestion: (questionId: string, optionId: string) => void;
}

export const CommunitySurveyView: React.FC<CommunitySurveyViewProps> = ({
  surveys = [],
  communityQuestions = [],
  currentUser,
  onSubmitSurvey,
  onVoteQuestion
}) => {
  const safeSurveys = surveys || [];
  const safeCommunityQuestions = communityQuestions || [];

  const userKey = currentUser?.id || 'community_guest';
  const storageKey = `cep_poll_votes_${userKey}`;

  const [activeSubTab, setActiveSubTab] = useState<'polls' | 'form' | 'stats'>('polls');
  const [votedMap, setVotedMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Re-sync voted map if user switches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setVotedMap(saved ? JSON.parse(saved) : {});
    } catch {
      setVotedMap({});
    }
  }, [userKey]);

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State for Comprehensive Audit
  const [ageGroup, setAgeGroup] = useState('18-25');
  const [gender, setGender] = useState(currentUser?.profile?.gender === 'female' ? 'Female' : 'Male');
  const [dietPreference, setDietPreference] = useState(
    currentUser?.profile?.dietaryPreference === 'vegetarian'
      ? 'Vegetarian'
      : currentUser?.profile?.dietaryPreference === 'vegan'
      ? 'Vegan'
      : 'Vegetarian'
  );
  const [fruitVegServings, setFruitVegServings] = useState('3-4 servings');
  const [waterIntakeGlasses, setWaterIntakeGlasses] = useState('7-8 glasses');
  const [exerciseFrequency, setExerciseFrequency] = useState('3-4 days/week');
  const [sleepHours, setSleepHours] = useState('7-8 hours');
  const [fastFoodFrequency, setFastFoodFrequency] = useState('Once a week');
  const [awarenessRating, setAwarenessRating] = useState(4);
  const [primaryHealthGoal, setPrimaryHealthGoal] = useState('Overall Energy & Vitality');

  const handleVote = (questionId: string, optionId: string) => {
    if (votedMap[questionId]) return;
    const nextMap = { ...votedMap, [questionId]: optionId };
    setVotedMap(nextMap);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextMap));
    } catch (e) {
      console.warn('Storage vote write:', e);
    }
    onVoteQuestion(questionId, optionId);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSurvey({
      ageGroup,
      gender,
      dietPreference,
      fruitVegServings,
      waterIntakeGlasses,
      exerciseFrequency,
      sleepHours,
      fastFoodFrequency,
      awarenessRating,
      primaryHealthGoal
    });
    setSubmittedSuccess(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  // Compute Aggregated Statistics from Surveys
  const totalResponses = safeSurveys.length;
  const dietCounts: Record<string, number> = {};
  const waterCounts: Record<string, number> = {};
  const exerciseCounts: Record<string, number> = {};
  const sleepCounts: Record<string, number> = {};

  safeSurveys.forEach((s) => {
    dietCounts[s.dietPreference] = (dietCounts[s.dietPreference] || 0) + 1;
    waterCounts[s.waterIntakeGlasses] = (waterCounts[s.waterIntakeGlasses] || 0) + 1;
    exerciseCounts[s.exerciseFrequency] = (exerciseCounts[s.exerciseFrequency] || 0) + 1;
    sleepCounts[s.sleepHours] = (sleepCounts[s.sleepHours] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner in Frosted Glass */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2 shadow-xs">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
              <span>CEP Community Health & Nutrition Research</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Community Health Surveys & Polls
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Cast your vote on active community questions, take the CEP lifestyle audit, and inspect collective health trends.
            </p>
          </div>

          {/* Sub-tab Switcher: Live Polls vs Audit Form vs Insights */}
          <div className="flex flex-wrap items-center bg-white/60 dark:bg-white/10 p-1.5 rounded-2xl border border-white/60 dark:border-white/10 backdrop-blur-md self-start lg:self-auto gap-1">
            <button
              onClick={() => setActiveSubTab('polls')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeSubTab === 'polls'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Active Polls ({safeCommunityQuestions.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('form')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeSubTab === 'form'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Full Audit Form</span>
            </button>
            <button
              onClick={() => setActiveSubTab('stats')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeSubTab === 'stats'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Audit Insights ({totalResponses})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE COMMUNITY POLLS */}
      {activeSubTab === 'polls' && (
        <div className="space-y-6">
          {safeCommunityQuestions.length === 0 ? (
            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-12 border border-white/60 dark:border-white/10 text-center space-y-3">
              <Vote className="w-10 h-10 text-emerald-600 mx-auto opacity-70" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                No active community polls yet
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Our CEP nutrition coordinators publish weekly questions on hydration, local nutrition habits, and fitness.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safeCommunityQuestions.map((q) => {
                const hasVoted = Boolean(votedMap[q.id]);
                const selectedOptId = votedMap[q.id];
                const total = q.totalVotes || 0;

                return (
                  <div
                    key={q.id}
                    className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-950 dark:text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-500/30">
                          {q.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {total} Community {total === 1 ? 'Vote' : 'Votes'}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-950 dark:text-white leading-snug">
                        {q.title}
                      </h3>
                      {q.description && (
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* Options List */}
                    <div className="space-y-2.5 pt-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const optId = opt.id || `opt-${optIdx}`;
                        const percentage = total > 0 ? Math.round(((opt.votes || 0) / total) * 100) : 0;
                        const isSelected = selectedOptId === optId || selectedOptId === opt.id || selectedOptId === optIdx.toString();

                        return (
                          <button
                            key={optId}
                            onClick={() => handleVote(q.id, optId)}
                            disabled={hasVoted}
                            className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold transition-all relative overflow-hidden cursor-pointer border ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 shadow-sm'
                                : hasVoted
                                ? 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                                : 'border-white/60 dark:border-white/10 bg-white/60 dark:bg-white/10 hover:bg-white/90 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                            }`}
                          >
                            {/* Progress fill behind */}
                            {hasVoted && (
                              <div
                                style={{ width: `${percentage}%` }}
                                className="absolute inset-y-0 left-0 bg-emerald-500/20 rounded-2xl pointer-events-none transition-all duration-500"
                              />
                            )}

                            <div className="relative z-10 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2">
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                <span>{opt.text}</span>
                              </span>
                              {hasVoted && (
                                <span className="font-mono text-[11px] font-black text-emerald-800 dark:text-emerald-400 shrink-0">
                                  {opt.votes || 0} ({percentage}%)
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>Surveyed by {q.createdBy || 'CEP Health Team'}</span>
                      <span className={hasVoted ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}>
                        {hasVoted ? '✓ Vote Recorded' : 'Tap option to vote'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: COMPREHENSIVE CEP SURVEY FORM */}
      {activeSubTab === 'form' && (
        <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6 max-w-4xl mx-auto">
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                Thank You for Contributing to Community Health!
              </h3>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-md mx-auto">
                Your response has been safely recorded into the CEP Community database and mirrored to cloud storage.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Response</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('stats')}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Collective Audit Insights</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-white/40 dark:border-white/10 pb-4">
                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  Anonymous Community Survey Questionnaire
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Please answer truthfully to help our project evaluate local health and dietary standards.
                </p>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    1. Age Category *
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="Under 18">Under 18</option>
                    <option value="18-25">18 - 25 years (Youth / Student)</option>
                    <option value="26-39">26 - 39 years (Working Adult)</option>
                    <option value="40-59">40 - 59 years (Middle Age)</option>
                    <option value="60+">60+ years (Senior Community Member)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    2. Gender Identification *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Diet & Food Habits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    3. Primary Diet Preference *
                  </label>
                  <select
                    value={dietPreference}
                    onChange={(e) => setDietPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="Vegetarian">Vegetarian (Lacto-Ovo)</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan (100% Plant-Based)</option>
                    <option value="Pescatarian">Pescatarian (Fish & Seafood)</option>
                    <option value="Mixed / Flexitarian">Mixed / Flexitarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    4. Daily Fruit & Vegetable Servings *
                  </label>
                  <select
                    value={fruitVegServings}
                    onChange={(e) => setFruitVegServings(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="0-1 serving">0 - 1 serving (Low)</option>
                    <option value="2 servings">2 servings</option>
                    <option value="3-4 servings">3 - 4 servings (Recommended)</option>
                    <option value="4+ servings">4+ servings (Optimal)</option>
                  </select>
                </div>
              </div>

              {/* Water & Exercise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    5. Average Daily Water Intake *
                  </label>
                  <select
                    value={waterIntakeGlasses}
                    onChange={(e) => setWaterIntakeGlasses(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="1-3 glasses">1 - 3 glasses (Under 1 Liter)</option>
                    <option value="4-6 glasses">4 - 6 glasses (1L - 1.5L)</option>
                    <option value="7-8 glasses">7 - 8 glasses (Recommended ~2L)</option>
                    <option value="8+ glasses">8+ glasses (Over 2L)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    6. Physical Exercise Frequency *
                  </label>
                  <select
                    value={exerciseFrequency}
                    onChange={(e) => setExerciseFrequency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="Sedentary (0 days)">Sedentary (No active workouts)</option>
                    <option value="1-2 days/week">1 - 2 days per week</option>
                    <option value="3-4 days/week">3 - 4 days per week (Target)</option>
                    <option value="Daily (5+ days)">Daily (5+ days per week)</option>
                  </select>
                </div>
              </div>

              {/* Sleep & Fast Food */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    7. Nightly Sleep Duration *
                  </label>
                  <select
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="< 6 hours">Under 6 hours (Sleep Deficit)</option>
                    <option value="6-7 hours">6 - 7 hours</option>
                    <option value="7-8 hours">7 - 8 hours (Optimal Recovery)</option>
                    <option value="8+ hours">8+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    8. Fast Food / Street Snack Frequency *
                  </label>
                  <select
                    value={fastFoodFrequency}
                    onChange={(e) => setFastFoodFrequency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="Rarely / Never">Rarely or Never</option>
                    <option value="Once a week">Once a week</option>
                    <option value="2-3 times a week">2 - 3 times a week</option>
                    <option value="Almost daily">4+ times a week / Daily</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Anonymous Survey Contribution</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 3: COMMUNITY INSIGHTS */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Audit Responses</span>
              <div className="text-3xl font-black text-slate-950 dark:text-white">{totalResponses}</div>
              <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                Verified community members
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Dominant Diet Preference</span>
              <div className="text-2xl font-black text-slate-950 dark:text-white truncate">
                {Object.entries(dietCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Vegetarian'}
              </div>
              <p className="text-[11px] font-semibold text-teal-800 dark:text-teal-400">
                Majority choice in CEP zone
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active Workout Ratio</span>
              <div className="text-3xl font-black text-slate-950 dark:text-white">
                {Math.round((((exerciseCounts['3-4 days/week'] || 0) + (exerciseCounts['Daily (5+ days)'] || 0)) / Math.max(1, totalResponses)) * 100)}%
              </div>
              <p className="text-[11px] font-semibold text-sky-800 dark:text-sky-400">
                3+ workouts / week
              </p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Hydration Compliance</span>
              <div className="text-3xl font-black text-slate-950 dark:text-white">
                {Math.round((((waterCounts['7-8 glasses'] || 0) + (waterCounts['8+ glasses'] || 0)) / Math.max(1, totalResponses)) * 100)}%
              </div>
              <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                Meeting 2L standard
              </p>
            </div>
          </div>

          {/* Breakdown Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Dietary Pattern Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(dietCounts).map(([diet, count]) => {
                  const pct = Math.round((count / Math.max(1, totalResponses)) * 100);
                  return (
                    <div key={diet} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>{diet}</span>
                        <span>{count} responses ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-emerald-600 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Physical Exercise Frequency Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(exerciseCounts).map(([freq, count]) => {
                  const pct = Math.round((count / Math.max(1, totalResponses)) * 100);
                  return (
                    <div key={freq} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>{freq}</span>
                        <span>{count} responses ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-teal-600 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
