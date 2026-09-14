import { FoodItem, HealthTip, HabitChecklistItem } from '../types';

export const INITIAL_FOOD_DATABASE: FoodItem[] = [
  // Breakfast items
  { id: 'f-1', name: 'Oatmeal with Berries & Honey', servingSize: '1 bowl (200g)', calories: 240, protein: 7, carbs: 45, fats: 4, fiber: 6, category: 'Breakfast' },
  { id: 'f-2', name: 'Boiled Eggs (2 large)', servingSize: '2 eggs (100g)', calories: 155, protein: 13, carbs: 1, fats: 11, fiber: 0, category: 'Breakfast' },
  { id: 'f-3', name: 'Whole Wheat Roti / Chapati (2 pcs)', servingSize: '2 rotis (70g)', calories: 170, protein: 6, carbs: 32, fats: 2, fiber: 5, category: 'Grains' },
  { id: 'f-4', name: 'Vegetable Poha', servingSize: '1 medium plate (180g)', calories: 220, protein: 4, carbs: 40, fats: 5, fiber: 3, category: 'Breakfast' },
  { id: 'f-5', name: 'Idli with Sambar (2 idlis + sambar)', servingSize: '1 set', calories: 210, protein: 7, carbs: 38, fats: 3, fiber: 4, category: 'Breakfast' },
  { id: 'f-6', name: 'Greek Yogurt with Seeds & Fruit', servingSize: '1 cup (150g)', calories: 180, protein: 15, carbs: 18, fats: 4, fiber: 3, category: 'Breakfast' },
  { id: 'f-7', name: 'Moong Dal Chilla (Savory Pancake)', servingSize: '2 chillas (120g)', calories: 210, protein: 12, carbs: 28, fats: 5, fiber: 6, category: 'Breakfast' },
  { id: 'f-8', name: 'Peanut Butter on Whole Wheat Toast', servingSize: '2 slices + 2 tbsp PB', calories: 290, protein: 10, carbs: 30, fats: 15, fiber: 4, category: 'Breakfast' },

  // Lunch & Dinner items
  { id: 'f-9', name: 'Cooked Brown Rice', servingSize: '1 cup (195g)', calories: 215, protein: 5, carbs: 45, fats: 2, fiber: 4, category: 'Grains' },
  { id: 'f-10', name: 'Cooked White Basmati Rice', servingSize: '1 cup (180g)', calories: 205, protein: 4, carbs: 45, fats: 0.5, fiber: 1, category: 'Grains' },
  { id: 'f-11', name: 'Yellow Dal Tadka / Lentil Soup', servingSize: '1 medium bowl (200g)', calories: 180, protein: 11, carbs: 26, fats: 4, fiber: 7, category: 'Main Dish' },
  { id: 'f-12', name: 'Mixed Vegetable Sabzi (Cooked with light oil)', servingSize: '1 bowl (180g)', calories: 140, protein: 4, carbs: 18, fats: 6, fiber: 5, category: 'Vegetables' },
  { id: 'f-13', name: 'Grilled Chicken Breast', servingSize: '150g', calories: 240, protein: 46, carbs: 0, fats: 5, fiber: 0, category: 'Protein' },
  { id: 'f-14', name: 'Paneer Bhurji / Cottage Cheese', servingSize: '100g', calories: 265, protein: 18, carbs: 5, fats: 20, fiber: 1, category: 'Protein' },
  { id: 'f-15', name: 'Tofu Vegetable Stir Fry', servingSize: '1 plate (220g)', calories: 190, protein: 14, carbs: 12, fats: 9, fiber: 4, category: 'Protein' },
  { id: 'f-16', name: 'Rajma / Kidney Bean Curry', servingSize: '1 bowl (200g)', calories: 230, protein: 13, carbs: 35, fats: 5, fiber: 9, category: 'Main Dish' },
  { id: 'f-17', name: 'Chole / Chickpea Masala', servingSize: '1 bowl (200g)', calories: 240, protein: 12, carbs: 36, fats: 6, fiber: 8, category: 'Main Dish' },
  { id: 'f-18', name: 'Baked Salmon with Herbs', servingSize: '1 fillet (150g)', calories: 280, protein: 34, carbs: 0, fats: 15, fiber: 0, category: 'Protein' },
  { id: 'f-19', name: 'Quinoa & Chickpea Salad', servingSize: '1 large bowl (250g)', calories: 290, protein: 12, carbs: 46, fats: 7, fiber: 8, category: 'Salad' },
  { id: 'f-20', name: 'Fresh Green Garden Salad with Lemon', servingSize: '1 bowl (150g)', calories: 65, protein: 2, carbs: 10, fats: 2, fiber: 4, category: 'Salad' },

  // Snacks & Beverages
  { id: 'f-21', name: 'Fresh Apple', servingSize: '1 medium (180g)', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, category: 'Fruit' },
  { id: 'f-22', name: 'Ripe Banana', servingSize: '1 medium (120g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.3, fiber: 3.1, category: 'Fruit' },
  { id: 'f-23', name: 'Roasted Almonds & Walnuts', servingSize: 'Handful (30g)', calories: 175, protein: 6, carbs: 5, fats: 16, fiber: 3, category: 'Snack' },
  { id: 'f-24', name: 'Roasted Makhana (Fox Nuts)', servingSize: '1 big bowl (35g)', calories: 125, protein: 3.5, carbs: 24, fats: 1.5, fiber: 4, category: 'Snack' },
  { id: 'f-25', name: 'Sprouted Moong Salad with Chaat Masala', servingSize: '1 bowl (150g)', calories: 140, protein: 9, carbs: 22, fats: 1.5, fiber: 6, category: 'Snack' },
  { id: 'f-26', name: 'Green Tea (Unsweetened)', servingSize: '1 cup (240ml)', calories: 2, protein: 0, carbs: 0.5, fats: 0, fiber: 0, category: 'Beverage' },
  { id: 'f-27', name: 'Fresh Buttermilk / Chaas with Jeera', servingSize: '1 glass (250ml)', calories: 60, protein: 3.5, carbs: 5, fats: 2, fiber: 0, category: 'Beverage' },
  { id: 'f-28', name: 'Fresh Tender Coconut Water', servingSize: '1 glass (240ml)', calories: 45, protein: 1.5, carbs: 9, fats: 0.5, fiber: 2.5, category: 'Beverage' },
];

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 'tip-1',
    title: 'The Plate Method for Community Nutrition',
    category: 'diet',
    tag: 'Nutrition Balance',
    iconName: 'Utensils',
    summary: 'Balance your meal plate into 3 simple sections for effortless portion control and balanced vitamins.',
    content: 'Fill half your plate with colorful vegetables and salads, one quarter with lean protein (dal, lentils, paneer, tofu, eggs, or fish), and one quarter with whole grain complex carbs (brown rice, whole wheat roti, millets). This naturally regulates blood sugar and keeps you feeling satisfied for hours.',
    actionableStep: 'Try building your next lunch using the 50% Veggies / 25% Protein / 25% Whole Grains proportion!'
  },
  {
    id: 'tip-2',
    title: 'Hydration: Why 8 Glasses Daily Matters',
    category: 'hydration',
    tag: 'Hydration',
    iconName: 'Droplets',
    summary: 'Adequate water intake boosts physical endurance, cognitive focus, kidney health, and skin vitality.',
    content: 'Even mild dehydration (1-2% body weight loss in fluids) can cause fatigue, headaches, reduced concentration, and false hunger cravings. Water helps digest nutrients, lubricates joints, and flushes metabolic waste through the kidneys.',
    actionableStep: 'Drink one full glass of lukewarm water right after waking up to kickstart your metabolism.'
  },
  {
    id: 'tip-3',
    title: '150 Minutes of Weekly Physical Activity',
    category: 'exercise',
    tag: 'Cardio & Strength',
    iconName: 'Activity',
    summary: 'The World Health Organization recommends at least 150 minutes of moderate aerobic activity weekly.',
    content: 'This equates to just 22 minutes of brisk walking or cycling a day. Regular movement enhances cardiovascular endurance, lowers hypertension risks, regulates insulin sensitivity, and releases endorphins that reduce anxiety and stress.',
    actionableStep: 'Schedule a 20-minute morning brisk walk or post-dinner family stroll today.'
  },
  {
    id: 'tip-4',
    title: 'Sleep Hygiene & Recovery for Health',
    category: 'sleep',
    tag: 'Restorative Sleep',
    iconName: 'Moon',
    summary: '7-8 hours of quality restful sleep is vital for cellular repair, hormone balance, and immune defense.',
    content: 'During deep non-REM and REM sleep phases, your body repairs muscle tissue, solidifies memories, and balances hunger hormones (ghrelin and leptin). Poor sleep spikes stress cortisol and encourages sweet cravings.',
    actionableStep: 'Power down blue-light screens 45 minutes before bed and keep your bedroom cool and dark.'
  },
  {
    id: 'tip-5',
    title: 'Mindful Eating & Sugar Reduction',
    category: 'diet',
    tag: 'Dietary Habits',
    iconName: 'Apple',
    summary: 'Eating slowly and swapping refined sugars for whole fruits prevents energy crashes and weight gain.',
    content: 'It takes approximately 20 minutes for your digestive system to signal fullness to your brain. Chew thoroughly, avoid eating in front of screens, and satisfy sweet cravings with seasonal whole fruits like apples, papayas, and berries.',
    actionableStep: 'Replace one sugary beverage or soda today with fresh lemon infused water or herbal green tea.'
  },
  {
    id: 'tip-6',
    title: 'Community Walking Groups & Daily Steps',
    category: 'community',
    tag: 'Social Fitness',
    iconName: 'Users',
    summary: 'Exercising in groups significantly improves consistency, emotional well-being, and social bonding.',
    content: 'Studies show that community walking buddies and fitness circles increase long-term adherence to healthy lifestyles by over 40%. Sharing progress creates supportive accountability across local neighborhoods.',
    actionableStep: 'Invite a neighbor, colleague, or family member to complete a 5,000-step walk together.'
  }
];

export const MOTIVATIONAL_QUOTES = [
  {
    quote: "Take care of your body. It's the only place you have to live in.",
    author: "Jim Rohn"
  },
  {
    quote: "Good health is not something we can buy. However, it can be an extremely valuable savings account.",
    author: "Anne Wilson Schaef"
  },
  {
    quote: "Small daily improvements over time lead to stunning, lasting results.",
    author: "Robin Sharma"
  },
  {
    quote: "A healthy outside starts from the inside.",
    author: "Robert Urich"
  },
  {
    quote: "Health is a state of complete harmony of the body, mind, and spirit.",
    author: "B.K.S. Iyengar"
  },
  {
    quote: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    author: "Buddha"
  }
];

export const DEFAULT_HABITS: HabitChecklistItem[] = [
  { id: 'h-1', text: 'Drank at least 8 glasses of water today', category: 'Hydration', completed: false },
  { id: 'h-2', text: 'Ate at least 2 servings of fresh vegetables & greens', category: 'Nutrition', completed: false },
  { id: 'h-3', text: 'Engaged in 30+ minutes of physical activity', category: 'Exercise', completed: false },
  { id: 'h-4', text: 'Avoided ultra-processed packaged snacks & soda', category: 'Nutrition', completed: false },
  { id: 'h-5', text: 'Got 7 to 8 hours of restorative sleep last night', category: 'Sleep', completed: false },
  { id: 'h-6', text: 'Checked and logged daily nutrition meals', category: 'Habits', completed: false }
];

export const BASELINE_COMMUNITY_STATS = {
  totalParticipants: 342,
  averageWaterGlasses: 6.2,
  averageDailyWalkMins: 38,
  balancedDietPercentage: 64,
  averageBmi: 23.4,
  fruitVegIntakeAvg: '2-3 servings/day',
  sleepAvgHours: 7.1,
};
