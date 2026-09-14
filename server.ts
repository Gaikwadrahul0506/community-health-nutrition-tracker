import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms))
  ]);
}

// Helper for multi-model generation cascade with resilient timeout per model
async function generateContentWithFallback(client: GoogleGenAI, fullPrompt: string) {
  const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash", "gemini-3.1-pro-preview"];
  for (const model of models) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model,
          contents: fullPrompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 1400
          }
        }),
        18000
      );
      if (response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed or timed out:`, err?.message || err);
    }
  }
  return null;
}

// Helper for structured JSON meal analysis
async function analyzeMealWithFallback(client: GoogleGenAI, prompt: string) {
  const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];
  for (const model of models) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 700
          }
        }),
        15000
      );
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Meal analysis with ${model} failed:`, err?.message || err);
    }
  }
  return null;
}

// Comprehensive offline & fallback health/fitness expert query responder
function generateExpertDirectResponse(message: string, userContext: any = {}): string {
  const lower = (message || '').toLowerCase().trim();
  const userName = userContext.name ? userContext.name.split(' ')[0] : 'friend';
  const eaten = userContext.todayCalories || userContext.todaySummary?.totalCaloriesEaten || 0;
  const target = userContext.calorieBudget || userContext.targetCalories || 2000;
  const remainingCals = target - eaten;
  const drunk = userContext.todayWaterGlasses || userContext.todaySummary?.totalWaterGlasses || 0;
  const waterGoal = userContext.waterGoal || userContext.targetWaterGlasses || 8;
  const remainingWater = Math.max(0, waterGoal - drunk);
  const burned = userContext.todayExerciseCalories || userContext.todaySummary?.totalExerciseBurned || 0;
  const activeMins = userContext.todayExerciseMins || 0;
  const bmi = userContext.bmi || 23.6;
  const bmiCat = userContext.bmiCategory || 'Normal weight';
  const goal = userContext.goal || 'General Health';

  // 1. Breakfast suggestions
  if (lower.includes('breakfast') || lower.includes('morning meal') || lower.includes('nashta')) {
    return `☀️ **Nutritious, Balanced Breakfast Ideas for ${userName}** (Tailored for ${goal}):

1. 🥞 **Oats & Vegetable Chilla / Pancake (Veg)**
   - *Ingredients:* 40g powdered rolled oats, besan (gram flour), chopped spinach, tomato, onions, green chili.
   - *Nutrition:* ~280 kcal | 12g Protein | 42g Carbs | 6g Fiber.
   - *Benefits:* High fiber keeps you full until lunch with steady energy release.

2. 🍳 **Paneer Bhurji with 1 Whole Wheat Roti (High Protein Veg)**
   - *Ingredients:* 75g low-fat paneer, capsicum, tomato, turmeric, cumin, 1 multi-grain phulka.
   - *Nutrition:* ~320 kcal | 18g Protein | 26g Carbs | 12g Healthy Fats.
   - *Benefits:* Sustained muscle preservation and excellent satiety.

3. 🥚 **Egg & Avocado Toast / Boiled Eggs (Non-Veg)**
   - *Ingredients:* 2 boiled or poached eggs + 1 whole wheat toast + 1 cup unsweetened green tea.
   - *Nutrition:* ~260 kcal | 15g Protein | 18g Carbs | 11g Healthy Fats.

4. 🥣 **Sprouted Moong & Pomegranate Salad Bowl**
   - *Ingredients:* 1 cup steamed green moong sprouts, chaat masala, lemon juice, roasted peanuts, pomegranate seeds.
   - *Nutrition:* ~220 kcal | 14g Protein | 34g Carbs | 8g Fiber.

💡 **Coach Tip:** Start your morning with 1-2 glasses of lukewarm water with lemon to kickstart digestion!`;
  }

  // 2. High Protein / Protein Sources
  if (lower.includes('protein') || lower.includes('soya') || lower.includes('paneer') || lower.includes('lentil')) {
    return `💪 **Top High-Protein Sources & Recommendations for ${userName}**:

🎯 **Your Target:** Aim for **1.2g - 1.6g of protein per kg of body weight** (e.g. ~70-100g daily for a 65kg adult).

🌱 **Top Vegetarian Protein Powerhouses:**
- **Soya Chunks / Meal:** 52g Protein per 100g raw (~340 kcal) — The highest plant-based protein source!
- **Low-Fat Paneer / Cottage Cheese:** 18-20g Protein per 100g (~260 kcal).
- **Lentils / Dals (Moong, Toor, Chana, Masoor):** 8-10g Protein per cooked bowl.
- **Sprouted Moong / Kala Chana:** 12-15g Protein per cooked cup.
- **Greek Yogurt / Hung Curd:** 10-12g Protein per 100g.
- **Tofu:** 14g Protein per 100g (low calorie & low carb).

🍗 **Top Non-Vegetarian Sources:**
- **Chicken Breast (Grilled/Boiled):** 31g Protein per 100g (~165 kcal).
- **Whole Eggs / Egg Whites:** 6g Protein per whole egg | 3.6g Protein per egg white.
- **Fish (Rohu, Katla, Salmon, Tuna):** 20-25g Protein per 100g.

💡 **Quick Macro Strategy:** Ensure every main meal contains at least 15-25g of protein to maintain lean muscle and curb hunger spikes.`;
  }

  // 3. Weight Loss / Fat Loss / Belly Fat
  if (lower.includes('weight loss') || lower.includes('fat loss') || lower.includes('lose weight') || lower.includes('belly fat') || lower.includes('deficit')) {
    return `🔥 **Science-Backed Weight & Fat Loss Guide for ${userName}**:

1. ⚖️ **Maintain a Moderate Calorie Deficit (300-500 kcal/day)**
   - Based on your target budget of **${target} kcal**, eating ~${Math.max(1400, target - 400)} kcal allows steady, sustainable fat loss (~0.5 kg per week) without slowing metabolism.

2. 🥦 **Plate Portioning Rule (50-25-25)**
   - **50% of your plate:** High-fiber vegetables & salads (cucumber, tomato, cabbage, spinach, gourds).
   - **25% of your plate:** Clean protein (paneer, lentils, sprouts, eggs, chicken, tofu).
   - **25% of your plate:** Complex whole carbohydrates (brown rice, whole wheat roti, ragi, quinoa).

3. 💧 **Hydration & Meal Timing:**
   - Drink 1 large glass of water 20 minutes before meals.
   - Stop eating 2.5 to 3 hours before sleep to reduce overnight acid reflux and improve fat oxidation.

4. 🏃 **Combine Strength Training + NEAT (Daily Steps):**
   - Aim for 8,000–10,000 daily steps.
   - Perform bodyweight strength workouts (Squats, Push-ups, Surya Namaskar) 3-4 days a week to preserve muscle while burning fat.

📊 **Your Status Today:** You've logged **${eaten} kcal** (${remainingCals >= 0 ? `${remainingCals} kcal left in budget` : `${Math.abs(remainingCals)} kcal over budget`}).`;
  }

  // 4. Muscle Gain / Bulking
  if (lower.includes('muscle') || lower.includes('bulk') || lower.includes('gain weight') || lower.includes('hypertrophy')) {
    return `🏋️ **Lean Muscle Building & Hypertrophy Blueprint**:

1. 📈 **Calorie Surplus (250–400 kcal above maintenance):**
   - Eat slightly above your daily expenditure to give muscles the building blocks to grow.

2. 🥩 **High Protein Intake (1.6g–2.2g per kg):**
   - Distribute protein across 4–5 feedings (every 3–4 hours) with ~25-35g per meal.

3. 🏋️‍♂️ **Progressive Overload Principle:**
   - Focus on compound movements: **Squats, Deadlifts, Bench Press, Pull-ups, Overhead Press, and Dips**.
   - Gradually increase weight or reps each week.

4. 💤 **Sleep & Recovery:**
   - Muscles grow during deep sleep. Prioritize 7.5–8.5 hours of quality sleep to optimize growth hormone production.`;
  }

  // 5. Workout / Exercise / Surya Namaskar / Routine
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('surya namaskar') || lower.includes('gym') || lower.includes('routine') || lower.includes('circuit')) {
    return `🏃 **Recommended 20-Minute Home Workout Routine**:

Warm-up (3 mins): Arm circles, torso twists, high knees, light jumping jacks.

🔥 **The 4-Round Functional Circuit (45s work, 15s rest):**
1. **Bodyweight Squats / Baithak:** 15–20 reps (Strengthens quads, glutes, core).
2. **Standard / Incline Push-ups / Dand:** 10–15 reps (Builds chest, triceps, shoulders).
3. **Surya Namaskar (Sun Salutation):** 4–6 continuous flowing rounds (Full body flexibility & cardio).
4. **Plank Hold:** 30–45 seconds (Core stability and posture).
5. **Reverse Lunges:** 12 reps per leg (Balance and unilateral leg power).

Rest 60 seconds between rounds. Repeat 3 to 4 times!

📊 **Today's Activity:** You've logged **${activeMins} mins** and burned **${burned} kcal** today. Keep moving!`;
  }

  // 6. Water / Hydration
  if (lower.includes('water') || lower.includes('hydrat') || lower.includes('drink') || lower.includes('fluid')) {
    return `💧 **Personalized Hydration Report for ${userName}**:

- 🚰 **Logged Today:** **${drunk} glasses** (${drunk * 250} ml / ${(drunk * 0.25).toFixed(1)} L)
- 🎯 **Daily Target:** **${waterGoal} glasses** (${waterGoal * 250} ml / ${(waterGoal * 0.25).toFixed(1)} L)
- ⏳ **Remaining to Goal:** **${remainingWater} glasses** (${remainingWater * 250} ml)

${remainingWater === 0 ? '🎉 **Goal Achieved!** Fantastic job staying completely hydrated today.' : '💡 **Action:** Sip a glass now to boost cellular recovery, improve skin glow, and support digestive enzymes.'}

✨ **Optimal Hydration Schedule:**
- 1 glass upon waking up (flushes toxins).
- 1 glass 30 mins before each meal (improves portion control).
- 1 glass during/after workouts (replaces sweat electrolytes).
- Avoid chugging huge volumes right before bed.`;
  }

  // 7. Calorie / Logged Intake / Status check
  if (lower.includes('calorie') || lower.includes('how much did i eat') || lower.includes('my log') || lower.includes('summary') || lower.includes('progress today')) {
    return `📊 **Your Real-Time NutriTrack Snapshot Today**:

- 🥗 **Calories Consumed:** **${eaten} kcal** / ${target} kcal target
- 📉 **Budget Balance:** **${remainingCals >= 0 ? `${remainingCals} kcal remaining` : `${Math.abs(remainingCals)} kcal above budget`}**
- 💧 **Hydration Logged:** **${drunk} / ${waterGoal} glasses** (${drunk * 250} ml)
- 🏃 **Active Exercise:** **${burned} kcal burned** across ${activeMins} active minutes
- ⚖️ **Profile Metric:** BMI **${bmi}** (${bmiCat})

${eaten === 0 ? '💡 You haven\'t logged any meals today yet! Head over to the **Nutrition Tracker** to log your breakfast or lunch.' : `You have logged your nutrition well today. Keep balancing your macros with whole grains and adequate protein!`}`;
  }

  // 8. Specific Food Calories (Roti, Rice, Dal, Biryani, Pizza, Fruit)
  if (lower.includes('roti') || lower.includes('chapati') || lower.includes('rice') || lower.includes('biryani') || lower.includes('samosa') || lower.includes('egg') || lower.includes('banana') || lower.includes('apple')) {
    return `🍎 **Nutritional Breakdown for Common Foods**:

- 🫓 **1 Whole Wheat Phulka Roti (No Ghee, 35g dough):** ~85 kcal | 3g Protein | 18g Carbs | 0.5g Fat | 2g Fiber.
- 🫓 **1 Roti with 1 tsp Ghee:** ~125 kcal | 3g Protein | 18g Carbs | 5g Fat.
- 🍚 **1 Medium Bowl Cooked White Rice (150g):** ~195 kcal | 4g Protein | 43g Carbs | 0.4g Fat.
- 🍚 **1 Medium Bowl Cooked Brown Rice (150g):** ~170 kcal | 4g Protein | 36g Carbs | 1.5g Fat | 3g Fiber.
- 🍲 **1 Katori Toor / Moong Dal (150ml):** ~120-140 kcal | 7-9g Protein | 18g Carbs | 3g Fat.
- 🍛 **1 Plate Chicken / Veg Dum Biryani (300g):** ~450-550 kcal | 18-24g Protein | 55g Carbs | 16-22g Fat.
- 🥟 **1 Fried Samosa:** ~250-290 kcal | 4g Protein | 30g Carbs | 15g Fat (High trans-fat).
- 🥚 **1 Whole Boiled Egg (Large):** ~74 kcal | 6.3g Protein | 0.4g Carbs | 5g Healthy Fat.
- 🍌 **1 Medium Banana (118g):** ~105 kcal | 1.3g Protein | 27g Carbs | 3g Fiber (Rich in Potassium).

💡 *Want to log any of these? Go to the **Nutrition Tracker** tab to add them with automatic calorie & macro tracking!*`;
  }

  // 9. Diabetes / Blood Sugar / PCOS / Thyroid
  if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('pcos') || lower.includes('pcod') || lower.includes('thyroid') || lower.includes('blood pressure') || lower.includes('bp')) {
    return `🩺 **Therapeutic Nutrition & Lifestyle Guidelines for ${userName}**:

1. 🌾 **Focus on Low-Glycemic Index (GI) Carbohydrates:**
   - Prefer ragi, jowar, bajra, steel-cut oats, and whole pulses over maida, refined flour, and processed white bread.
   - Fiber slows glucose absorption and reduces insulin spikes.

2. 🥗 **Fiber First Sequencing:**
   - Eat salad/vegetables first, protein second, and carbs last during meals to reduce blood glucose spikes by up to 35%.

3. 🌿 **Functional Spices & Herbs:**
   - **Cinnamon (Dalchini):** Helps improve cellular insulin sensitivity.
   - **Fenugreek Seeds (Methi Dana):** Soaked overnight, aids carbohydrate metabolism.
   - **Amla & Turmeric:** Potent anti-inflammatory support for thyroid and metabolic balance.

4. 🚶‍♂️ **The 10-Minute Post-Meal Walk:**
   - A light 10-minute stroll immediately after lunch and dinner allows muscles to absorb glucose without requiring high insulin surges.`;
  }

  // 10. Intermittent Fasting (IF)
  if (lower.includes('fasting') || lower.includes('intermittent') || lower.includes('16:8') || lower.includes('fast')) {
    return `⏳ **Intermittent Fasting (16:8 Protocol) Guide**:

1. ⏰ **The Schedule:**
   - **Eating Window (8 Hours):** e.g., 11:30 AM to 7:30 PM.
   - **Fasting Window (16 Hours):** 7:30 PM to 11:30 AM the next morning.

2. ☕ **What You Can Drink During Fasting:**
   - Plain water, warm lemon water (without honey), black coffee, and unsweetened green tea (zero calories, will NOT break your fast).

3. 🍽️ **How to Break the Fast:**
   - Break your fast with easily digestible protein & fiber (e.g. soaked almonds + boiled eggs or sprouts salad) rather than heavy refined carbohydrates.

4. 💡 **Benefits:** Promotes cellular autophagy, enhances insulin sensitivity, and naturally simplifies calorie restriction.`;
  }

  // 11. Snacks / Healthy Munching
  if (lower.includes('snack') || lower.includes('craving') || lower.includes('evening') || lower.includes('hunger')) {
    return `🍿 **Healthy, Low-Calorie Indian Snack Ideas**:

1. 🌰 **Roasted Makhana (Fox Nuts) with Chaat Masala:**
   - ~100 kcal per cup | Crunchy, rich in magnesium, low sodium.
2. 🥜 **Roasted Chana (Bengal Gram):**
   - ~120 kcal per 30g | 6g Protein | 6g Fiber | Very filling.
3. 🥒 **Cucumber & Carrot Sticks with Curd Dip (Mint & Garlic):**
   - ~60 kcal | Rich in prebiotics, cooling, and crisp.
4. 🥜 **Handful of Soaked Almonds & Walnuts (6-8 pcs):**
   - ~130 kcal | Healthy Omega-3 fatty acids for brain & heart health.
5. 🍵 **Spiced Masala Buttermilk (Chaas):**
   - ~45 kcal | Excellent digestive aid, high calcium, zero oil.`;
  }

  // 12. General Greeting & Direct Answer
  return `Hello ${userName}! 🌟 I am your **NutriTrack AI Health & Fitness Coach**.

Regarding your query: **"${message}"**

Here is science-backed guidance personalized to your **${goal}** profile:
- 🥗 **Daily Energy Balance:** Your target is **${target} kcal/day** (consumed today: **${eaten} kcal**, **${Math.max(0, target - eaten)} kcal** remaining).
- 💧 **Hydration State:** You've logged **${drunk} of ${waterGoal} glasses** of water.
- 🏃 **Active Exercise:** **${burned} kcal burned** across ${activeMins} active minutes.
- ⚖️ **Body Metric:** BMI is currently **${bmi}** (${bmiCat}).

💡 **Actionable Advice:**
1. Focus on consistent, whole-food nutrition with a balance of protein, complex carbs, and dietary fiber.
2. Maintain regular daily movement (such as brisk walking, Surya Namaskar, or strength circuits).
3. Feel free to ask me for specific meal recipes, exercise breakdowns, or calorie estimates for any food!`;
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // AI Health Coach Chat endpoint (Fast Response)
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, conversationHistory = [], history = [], userContext = {} } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "A message string is required." });
        return;
      }

      const client = getGeminiClient();

      // Format rich context representation
      const mealsSummary = (userContext.todayMeals || userContext.todaySummary?.mealsLogged || [])
        .map((m: any) => typeof m === 'string' ? `- ${m}` : `- ${m.name || 'Item'} (${m.mealType || 'Meal'}): ${m.calories || 0} kcal, ${m.protein || 0}g protein, ${m.carbs || 0}g carbs, ${m.fats || 0}g fats`)
        .join('\n') || 'No meals logged yet today.';

      const exercisesSummary = (userContext.todayExercises || [])
        .map((e: any) => `- ${e.name || 'Exercise'} (${e.category || 'Workout'}): ${e.durationMinutes || 0} mins, ${e.caloriesBurned || 0} kcal burned`)
        .join('\n') || 'No workouts logged yet today.';

      const habitsSummary = (userContext.habits || [])
        .map((h: any) => `- [${h.completed ? 'COMPLETED' : 'PENDING'}] ${h.title} (${h.category || 'General'})`)
        .join('\n') || 'No habits configured.';

      const slotsSummary = (userContext.bookedSlots || [])
        .map((s: any) => `- ${s.doctorName || 'Doctor'} (${s.specialty || 'Consultation'}) on ${s.date} at ${s.timeSlot} [Status: ${s.status}]`)
        .join('\n') || 'No appointments currently booked.';

      const chatHistoryList = (history.length > 0 ? history : conversationHistory)
        .slice(-6)
        .map((h: any) => `${h.role === 'model' || h.role === 'assistant' ? 'AI Coach' : 'User'}: ${h.content || h.text || ''}`)
        .join('\n');

      if (!client) {
        // High-quality local rule engine matching user questions
        const expertReply = generateExpertDirectResponse(message, userContext);
        res.json({ reply: expertReply, model: 'local-expert-rules' });
        return;
      }

      const fullPrompt = `You are the "NutriTrack AI Health & Fitness Coach", an empathetic, elite nutrition scientist and personal fitness trainer for a community health initiative.

CRITICAL INSTRUCTION:
- Answer the user's specific question DIRECTLY and COMPREHENSIVELY with practical details, portion sizes, scientific rationale, and clean bullet points.
- Do NOT just spit out a generic daily calorie status unless the user asked for their daily log/status summary.
- If asked about Indian or international foods, give exact calorie, protein, carbs, and fat estimates.
- If asked about workouts, explain step-by-step form and repetitions.
- If relevant, tailor the advice to their personal profile, daily calorie budget, and goal (${userContext.goal || 'General Health'}).

=== USER HEALTH PROFILE & LIVE LOGS ===
- User Name: ${userContext.name || 'Friend'} (Goal: ${userContext.goal || 'General Health'}, Activity: ${userContext.activityLevel || 'Moderate'})
- Age: ${userContext.age || 'N/A'}, Gender: ${userContext.gender || 'N/A'}, Height: ${userContext.height || 'N/A'} cm, Weight: ${userContext.weight || 'N/A'} kg
- Daily Target Calories: ${userContext.calorieBudget || userContext.targetCalories || 2000} kcal (Consumed Today: ${userContext.todayCalories || userContext.todaySummary?.totalCaloriesEaten || 0} kcal, Remaining: ${(userContext.calorieBudget || 2000) - (userContext.todayCalories || 0)} kcal)
- Hydration: ${userContext.todayWaterGlasses || 0} / ${userContext.waterGoal || 8} glasses (${(userContext.todayWaterGlasses || 0) * 250} ml)
- Workouts Today: ${userContext.todayExerciseCalories || 0} kcal burned (${userContext.todayExerciseMins || 0} mins)
- Today's Meals Logged:
${mealsSummary}
- Today's Workouts Logged:
${exercisesSummary}

${chatHistoryList ? `=== RECENT CONVERSATION HISTORY ===\n${chatHistoryList}\n` : ''}
=== USER QUESTION TO ANSWER ===
"${message}"

Provide a structured, helpful, and direct answer:`;

      let replyText = "";
      let usedModel = "local-fallback";
      
      const genResult = await generateContentWithFallback(client, fullPrompt);
      if (genResult && genResult.text) {
        replyText = genResult.text;
        usedModel = genResult.model;
      }

      if (!replyText) {
        replyText = generateExpertDirectResponse(message, userContext);
      }

      res.json({ reply: replyText, model: usedModel });
    } catch (err: any) {
      console.error("Gemini Chat API Error:", err);
      const fallback = generateExpertDirectResponse(req.body?.message || '', req.body?.userContext || {});
      res.json({
        reply: fallback,
        model: "expert-offline-fallback"
      });
    }
  });

  // AI Health Coach Real-Time Streaming endpoint (SSE for instant token delivery)
  app.post("/api/gemini/stream", async (req, res) => {
    try {
      const { message, history = [], userContext = {} } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "A message string is required." });
        return;
      }

      const client = getGeminiClient();

      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (!client) {
        const expertReply = generateExpertDirectResponse(message, userContext);
        res.write(`data: ${JSON.stringify({ chunk: expertReply, done: false })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
        return;
      }

      const mealsSummary = (userContext.todayMeals || [])
        .map((m: any) => `- ${m.name || 'Item'} (${m.mealType || 'Meal'}): ${m.calories || 0} kcal, ${m.protein || 0}g protein`)
        .join('\n') || 'No meals logged yet today.';

      const exercisesSummary = (userContext.todayExercises || [])
        .map((e: any) => `- ${e.name || 'Exercise'}: ${e.durationMinutes || 0} mins, ${e.caloriesBurned || 0} kcal burned`)
        .join('\n') || 'No workouts logged yet today.';

      const fullPrompt = `You are the NutriTrack AI Health & Fitness Coach.
User: ${userContext.name || 'Friend'} (Goal: ${userContext.goal || 'General Health'}, Calories Today: ${userContext.todayCalories || 0}/${userContext.calorieBudget || 2000} kcal, Water: ${userContext.todayWaterGlasses || 0}/${userContext.waterGoal || 8} glasses)
Meals Today: ${mealsSummary}
Workouts Today: ${exercisesSummary}

Answer this user's question directly with clear formatting and actionable steps:
"${message}"`;

      let streamedAny = false;
      const streamModels = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash", "gemini-3.1-pro-preview"];

      for (const model of streamModels) {
        try {
          const streamResult = await client.models.generateContentStream({
            model,
            contents: fullPrompt,
            config: {
              temperature: 0.7,
              maxOutputTokens: 1200
            }
          });

          for await (const chunk of streamResult) {
            const textChunk = chunk.text;
            if (textChunk) {
              streamedAny = true;
              res.write(`data: ${JSON.stringify({ chunk: textChunk, done: false })}\n\n`);
            }
          }

          if (streamedAny) {
            break;
          }
        } catch (streamErr) {
          console.warn(`Stream with ${model} failed, trying next:`, streamErr);
        }
      }

      if (!streamedAny) {
        const fallbackText = generateExpertDirectResponse(message, userContext);
        res.write(`data: ${JSON.stringify({ chunk: fallbackText, done: false })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err: any) {
      console.error("Gemini Stream Error:", err);
      const fallback = generateExpertDirectResponse(req.body?.message || '', req.body?.userContext || {});
      res.write(`data: ${JSON.stringify({ chunk: fallback, done: false })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  });

  // AI Meal Analysis endpoint (Fast Response)
  app.post("/api/gemini/analyze-meal", async (req, res) => {
    try {
      const { mealText } = req.body;
      if (!mealText) {
        res.status(400).json({ error: "Meal description is required." });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        // Rule-based fallback
        res.json({
          name: mealText,
          servingSize: "1 typical serving",
          calories: 250,
          protein: 8,
          carbs: 35,
          fats: 7,
          fiber: 4,
          category: "General",
          tips: "A balanced serving providing moderate energy."
        });
        return;
      }

      const prompt = `Analyze this food or meal description: "${mealText}".
Provide a realistic nutritional estimate for 1 standard serving.
Respond with ONLY valid JSON with this exact structure:
{
  "name": "Proper food name",
  "servingSize": "e.g. 1 bowl (200g) or 2 pcs",
  "calories": 250,
  "protein": 10,
  "carbs": 35,
  "fats": 7,
  "fiber": 4,
  "category": "Breakfast | Main Dish | Protein | Grains | Vegetables | Fruit | Salad | Snack | Beverage",
  "tips": "Brief 1-sentence health tip about this food"
}`;

      try {
        const rawText = await analyzeMealWithFallback(client, prompt);
        if (rawText) {
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          res.json(parsed);
          return;
        }
      } catch (aiErr) {
        console.warn("AI meal analysis fallback:", aiErr);
      }

      res.json({
        name: mealText,
        servingSize: "1 typical serving",
        calories: 280,
        protein: 9,
        carbs: 40,
        fats: 8,
        fiber: 4,
        category: "General",
        tips: "Nutritious option. Remember to balance with adequate protein and hydration."
      });
    } catch (err) {
      console.error("Meal analysis error:", err);
      res.status(500).json({ error: "Could not analyze meal" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NutriTrack full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
