export type ActiveTab =
  | 'home'
  | 'dashboard'
  | 'nutrition'
  | 'water'
  | 'bmi'
  | 'exercise'
  | 'ai_assistant'
  | 'tips'
  | 'survey'
  | 'profile'
  | 'feedback'
  | 'admin'
  | 'login';

export type UserRole = 'admin' | 'user';

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type HealthGoal = 'weight_loss' | 'maintenance' | 'muscle_gain' | 'healthy_lifestyle' | 'manage_health';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  goal: HealthGoal;
  customCalorieGoal?: number;
  customWaterGoalGlasses?: number;
}

export interface UserAccount {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  joinDate: string;
  profile: UserProfile;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber?: number; // grams
  category?: string;
  isCustom?: boolean;
}

export interface MealEntry {
  id: string;
  foodId?: string;
  name: string;
  servingSize: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  mealType: MealType;
  timestamp: string; // ISO string
}

export interface WaterLogEntry {
  id: string;
  amountMl: number;
  timestamp: string;
}

export type ExerciseCategory =
  | 'cardio'
  | 'strength'
  | 'calisthenics'
  | 'yoga'
  | 'sports'
  | 'traditional'
  | 'daily_life'
  | 'hiit';

export interface ExerciseDatabaseItem {
  id: string;
  name: string;
  category: ExerciseCategory;
  met: number; // Metabolic Equivalent of Task
  intensity: 'low' | 'moderate' | 'high' | 'vigorous';
  targetMuscles: string[];
  equipment: string;
  description: string;
  caloriesPerMin70kg: number;
  benefits?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
}

export type ExerciseType =
  | 'walking'
  | 'running'
  | 'cycling'
  | 'yoga'
  | 'gym'
  | 'swimming'
  | 'sports'
  | 'calisthenics'
  | 'traditional'
  | 'daily_life'
  | 'hiit'
  | 'custom';

export interface ExerciseEntry {
  id: string;
  type: ExerciseType;
  name: string;
  category?: ExerciseCategory;
  durationMinutes: number;
  intensity: 'low' | 'moderate' | 'high' | 'vigorous';
  caloriesBurned: number;
  targetMuscles?: string[];
  notes?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender?: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'model' | 'system';
  content?: string;
  text?: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  meals: MealEntry[];
  waterLogs: WaterLogEntry[];
  waterTotalMl: number;
  exercises: ExerciseEntry[];
  waterGlasses?: number;
}

export interface BmiCalculationRecord {
  id: string;
  userId?: string;
  height: number;
  weight: number;
  bmi: number;
  category: string;
  timestamp: string;
}

export interface HealthTip {
  id: string;
  title: string;
  category: 'diet' | 'exercise' | 'sleep' | 'hydration' | 'community';
  summary: string;
  content: string;
  actionableStep: string;
  iconName: string;
  tag: string;
}

export interface SurveyOption {
  id: string;
  text: string;
  votes: number;
}

export interface SurveyQuestion {
  id: string;
  title: string;
  category: string;
  description?: string;
  options: SurveyOption[];
  totalVotes: number;
  createdBy: string;
  createdAt: string;
  userVotedOptionId?: string;
}

export interface SurveyResponse {
  id: string;
  userId?: string;
  timestamp: string;
  ageGroup: string;
  gender: string;
  dietPreference: string;
  fruitVegServings: string;
  waterIntakeGlasses: string;
  exerciseFrequency: string;
  sleepHours: string;
  fastFoodFrequency: string;
  awarenessRating: number;
  primaryHealthGoal: string;
}

export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved';

export interface FeedbackSubmission {
  id: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  rating: number;
  category: 'general' | 'nutrition' | 'community' | 'suggestion' | 'cep_inquiry';
  comments: string;
  status: FeedbackStatus;
  timestamp: string;
  adminNote?: string;
}

export interface HabitChecklistItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
}

export type SlotStatus = 'open' | 'filling' | 'full' | 'completed' | 'cancelled';

export interface SlotBooking {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  notes?: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled' | 'attended';
}

export interface HealthSlot {
  id: string;
  title: string;
  type: 'nutrition_consultation' | 'bmi_wellness_check' | 'fitness_assessment' | 'health_camp' | 'general';
  doctorOrCoordinator: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  date: string; // YYYY-MM-DD
  timeRange: string; // e.g. "10:00 AM - 12:00 PM"
  location: string;
  venueType: 'in_person' | 'online_consultation';
  capacity: number;
  bookedCount: number;
  status: SlotStatus;
  description: string;
  bookings?: SlotBooking[];
  createdByAdminId: string;
  createdAt: string;
}

