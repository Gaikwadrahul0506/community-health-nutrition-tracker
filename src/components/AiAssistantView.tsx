import React, { useState, useRef, useEffect } from 'react';
import {
  UserProfile,
  DayRecord,
  ChatMessage,
  UserAccount,
  FoodItem,
  BmiCalculationRecord,
  HabitChecklistItem,
  HealthSlot
} from '../types';
import {
  Sparkles,
  Send,
  Bot,
  RefreshCw,
  Lightbulb,
  Copy,
  Check,
  Flame,
  Droplet,
  UtensilsCrossed,
  Activity,
  Heart
} from 'lucide-react';

interface AiAssistantViewProps {
  profile: UserProfile;
  currentDayRecord: DayRecord;
  currentUser?: UserAccount | null;
  dayRecords?: DayRecord[];
  foodsDatabase?: FoodItem[];
  bmiHistory?: BmiCalculationRecord[];
  habits?: HabitChecklistItem[];
  slots?: HealthSlot[];
  calorieBudget?: number;
  waterGoalGlasses?: number;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  profile,
  currentDayRecord,
  currentUser,
  dayRecords = [],
  foodsDatabase = [],
  bmiHistory = [],
  habits = [],
  slots = [],
  calorieBudget = 2000,
  waterGoalGlasses = 8
}) => {
  // Compute today's active metrics
  const todayMeals = currentDayRecord.meals || [];
  const todayExercises = currentDayRecord.exercises || [];
  const todayCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const todayProtein = todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const todayCarbs = todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const todayFats = todayMeals.reduce((sum, m) => sum + (m.fats || 0), 0);
  const todayWater = currentDayRecord.waterGlasses || 0;
  const todayExerciseMins = todayExercises.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
  const todayExerciseCalories = todayExercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  const userCalorieBudget = profile.customCalorieGoal || calorieBudget || 2000;
  const userWaterGoal = profile.customWaterGoalGlasses || waterGoalGlasses || 8;
  const remainingCalories = userCalorieBudget - todayCalories;
  const remainingWaterGlasses = Math.max(0, userWaterGoal - todayWater);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 Hello **${currentUser?.name || 'there'}**! I'm your **NutriTrack AI Health & Fitness Coach**.\n\nI can help you with:\n- 🥗 **Diet & Nutrition**: Calorie analysis, macro tracking, balanced Indian meals\n- 💧 **Hydration**: Daily water targets and hydration habits\n- 🏃 **Workouts & Activity**: Customized home or gym exercise routines\n- ⚖️ **Weight & BMI**: Science-backed strategies to reach your goals\n\nAsk me any question below or pick a quick suggestion to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      title: '📊 Analyze Today\'s Intake',
      prompt: 'Please analyze my logged meals and calorie intake for today. Am I on track with my health goals?'
    },
    {
      title: '💧 Check Water & Hydration',
      prompt: 'How many glasses of water have I logged today, how many are remaining, and what are good tips to stay hydrated?'
    },
    {
      title: '🍲 High-Protein Indian Diet',
      prompt: 'Suggest a healthy, high-protein Indian diet plan including dal, paneer, sprouts, and whole grains.'
    },
    {
      title: '🏃 20-Min Home Workout',
      prompt: `Suggest a 20-minute daily home workout routine suitable for my goal of ${profile.goal ? profile.goal.replace(/_/g, ' ') : 'general fitness'}.`
    },
    {
      title: '🍎 Healthy Snack Ideas',
      prompt: 'What are some nutritious, low-calorie Indian snacks I can eat between meals without exceeding my calorie limit?'
    }
  ];

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = (textOverride || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fullUserContext = {
      name: currentUser.name,
      goal: profile.goal,
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      targetWeight: profile.targetWeight,
      bmi: profile.bmi,
      bmiCategory: profile.bmiCategory,
      activityLevel: profile.activityLevel,
      calorieBudget: userCalorieBudget,
      waterGoal: userWaterGoal,
      todayCalories,
      todayWaterGlasses: todayWater,
      todayProtein,
      todayCarbs,
      todayFats,
      todayExerciseCalories,
      todayExerciseMins,
      todayMeals,
      todayExercises
    };

    // Safety timeout after 25 seconds for network resilience
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000);

    try {
      setMessages((prev) => [...prev, initialAssistantMsg]);

      let replyGenerated = false;

      try {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            history: messages.slice(-6).map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              content: m.content
            })),
            userContext: fullUserContext
          }),
          signal: controller.signal
        });

        if (response.ok) {
          const data = await response.json();
          const finalReply = data.reply || 'Here is your health guidance. Keep staying active and properly nourished!';
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: finalReply } : msg
            )
          );
          replyGenerated = true;
        }
      } catch (fetchErr) {
        console.warn('API chat request failed or timed out:', fetchErr);
      }

      if (!replyGenerated) {
        throw new Error('Local fallback triggered');
      }
    } catch (err) {
      // High quality context-aware response fallback
      const lower = textToSend.toLowerCase();
      let fallbackText = "";

      if (lower.includes('breakfast') || lower.includes('morning meal') || lower.includes('nashta')) {
        fallbackText = `☀️ **Nutritious Breakfast Recommendations for ${currentUser.name.split(' ')[0]}**:\n\n1. 🥞 **Oats & Vegetable Besan Chilla:** High fiber & complex carbs (~280 kcal, 12g protein).\n2. 🍳 **Paneer Bhurji with 1 Phulka:** High satiety & sustained energy (~320 kcal, 18g protein).\n3. 🥣 **Sprouted Moong & Pomegranate Salad:** Rich in live enzymes & vitamins (~220 kcal, 14g protein).\n4. 🥚 **Boiled Eggs with Whole Wheat Toast:** Complete amino acid profile (~260 kcal, 15g protein).\n\n💡 Drink a glass of warm lemon water before breakfast for optimal digestion!`;
      } else if (lower.includes('protein') || lower.includes('soya') || lower.includes('paneer') || lower.includes('dal')) {
        fallbackText = `💪 **High-Protein Food Sources**:\n\n- 🌱 **Vegetarian:** Soya chunks (52g/100g), Low-fat Paneer (18g/100g), Boiled Moong/Chana Sprouts (14g/cup), Greek Yogurt (10g/100g), Tofu (14g/100g), Lentils/Dal (9g/bowl).\n- 🍗 **Non-Vegetarian:** Chicken breast (31g/100g), Whole eggs (6g/egg), Fish (22g/100g).\n\n🎯 Aim for **1.2g - 1.6g of protein per kg of body weight** daily to preserve lean muscle and support metabolism.`;
      } else if (lower.includes('weight loss') || lower.includes('fat loss') || lower.includes('belly fat') || lower.includes('deficit')) {
        fallbackText = `🔥 **Fat Loss Strategy for ${currentUser.name.split(' ')[0]}**:\n\n1. ⚖️ **Calorie Deficit:** Maintain a 300-400 kcal deficit under your **${userCalorieBudget} kcal** budget.\n2. 🥗 **50-25-25 Plate Method:** 50% fiber vegetables, 25% lean protein, 25% whole grains.\n3. 🚶 **Daily Steps:** Aim for 8,000–10,000 steps + 3 bodyweight strength sessions weekly.\n4. 💧 **Hydration:** You've logged **${todayWater}/${userWaterGoal} glasses** today—stay well hydrated to avoid mistaking thirst for hunger!`;
      } else if (lower.includes('workout') || lower.includes('exercise') || lower.includes('surya namaskar') || lower.includes('routine')) {
        fallbackText = `🏃 **Recommended 20-Minute Home Workout Routine**:\n\n- **Warmup:** 3 mins arm circles & high knees.\n- **Round (Repeat 3-4x):**\n  1. Bodyweight Squats: 15–20 reps\n  2. Standard / Incline Push-ups: 10–15 reps\n  3. Surya Namaskar: 4 continuous flowing rounds\n  4. Plank Hold: 30–45 seconds\n  5. Reverse Lunges: 12 reps per leg\n\n📊 You have logged **${todayExerciseCalories} kcal burned (${todayExerciseMins} mins)** today!`;
      } else if (lower.includes('water') || lower.includes('drink') || lower.includes('hydrat')) {
        fallbackText = `💧 **Hydration Status Today:**\n- **Logged:** ${todayWater} / ${userWaterGoal} glasses (${todayWater * 250} ml)\n- **Remaining:** ${remainingWaterGlasses} glasses (${remainingWaterGlasses * 250} ml)\n\n${
          remainingWaterGlasses === 0
            ? '🎉 Great job! You have reached your daily hydration goal.'
            : `💡 **Tip:** Drinking ${remainingWaterGlasses} more glasses throughout the day will boost energy, skin health, and digestion!`
        }`;
      } else if (lower.includes('snack') || lower.includes('craving') || lower.includes('evening')) {
        fallbackText = `🍿 **Healthy Low-Calorie Indian Snacks**:\n\n1. **Roasted Makhana (Fox nuts):** ~100 kcal / cup with chaat masala.\n2. **Roasted Chana:** ~120 kcal (6g protein, high fiber).\n3. **Cucumber & Carrot Sticks with Mint Curd Dip:** ~60 kcal.\n4. **Spiced Masala Chaas (Buttermilk):** ~45 kcal, great for gut health.`;
      } else if (lower.includes('bmi') || lower.includes('weight')) {
        fallbackText = `⚖️ **Body Profile & BMI Metrics:**\n- **Weight:** ${profile.weight || 70} kg (Target: ${profile.targetWeight || 'Maintenance'} kg)\n- **BMI:** ${profile.bmi || 23.6} (${profile.bmiCategory || 'Normal weight'})\n\n💡 Healthy Asian-Indian BMI is **18.5 - 22.9 kg/m²**. Maintain balanced nutrition and strength exercise to optimize body composition!`;
      } else if (lower.includes('calorie') || lower.includes('meal') || lower.includes('eat') || lower.includes('food') || lower.includes('log')) {
        fallbackText = `🥗 **Your Nutrition & Calorie Status Today:**\n- **Consumed:** ${todayCalories} / ${userCalorieBudget} kcal (${remainingCalories >= 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal over budget`})\n- **Macros:** ${todayProtein}g protein, ${todayCarbs}g carbs, ${todayFats}g fats\n- **Logged Meals:** ${todayMeals.length} items\n\n💡 Log all your daily meals in the **Nutrition Tracker** for automatic macro breakdown!`;
      } else {
        fallbackText = `Hello ${currentUser.name.split(' ')[0]}! 🌟\n\nHere is your current health snapshot:\n- 🥗 **Calories Logged:** ${todayCalories} / ${userCalorieBudget} kcal\n- 💧 **Hydration:** ${todayWater} / ${userWaterGoal} glasses\n- 🏃 **Active Burn:** ${todayExerciseCalories} kcal (${todayExerciseMins} mins)\n\nFeel free to ask me for custom diet plans, healthy recipes, calorie breakdowns, or workout tips!`;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: fallbackText } : msg
        )
      );
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history refreshed! How can I assist you with your diet, hydration, workouts, or wellness goals today, ${currentUser.name.split(' ')[0]}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Health & Fitness Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              NutriTrack AI Assistant
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ask anything about your calories, meals, Indian diet plans, workouts, hydration, or health goals.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleClearChat}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400">Calories Today</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {todayCalories} / {userCalorieBudget} kcal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <Droplet className="w-4 h-4 text-sky-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400">Water Logged</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {todayWater} / {userWaterGoal} gl ({todayWater * 250}ml)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <Flame className="w-4 h-4 text-rose-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400">Active Burn</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {todayExerciseCalories} kcal ({todayExerciseMins}m)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <Activity className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400">BMI Metric</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {profile.bmi || 23.6} ({profile.bmiCategory || 'Normal'})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[600px] overflow-hidden">
        {/* Chat Bar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>NutriTrack AI Coach</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ready to answer your nutrition, workouts, and wellness questions
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
            ⚡ Online
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.role === 'assistant';
            if (isAi && !msg.content && isLoading) {
              return (
                <div key={msg.id} className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="max-w-[85%] rounded-3xl px-5 py-4 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1 text-slate-500">Generating advice...</span>
                  </div>
                </div>
              );
            }

            if (isAi && !msg.content && !isLoading) {
              return null;
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 text-xs sm:text-sm leading-relaxed relative group ${
                    isAi
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line font-medium">{msg.content}</div>
                  
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px]">
                    {isAi ? (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-70 hover:opacity-100 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span></span>
                    )}

                    <span className={isAi ? 'text-slate-400' : 'text-emerald-100'}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Try:</span>
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold shrink-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {qp.title}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask any question about meals, calories, water, workouts, or health tips..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={handleStopGenerating}
              className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
