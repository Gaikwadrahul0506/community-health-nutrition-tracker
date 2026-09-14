import { UserProfile, ExerciseType } from '../types';

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  minIdealWeightKg: number;
  maxIdealWeightKg: number;
  healthAdvice: string[];
}

export function calculateBMI(heightCm: number, weightKg: number): BmiResult {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: 'Normal weight',
      color: '#10B981',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      description: 'Please provide valid height and weight measurements.',
      minIdealWeightKg: 0,
      maxIdealWeightKg: 0,
      healthAdvice: ['Enter your details to calculate your BMI and personalized recommendations.']
    };
  }

  const heightInMeters = heightCm / 100;
  const bmiRaw = weightKg / (heightInMeters * heightInMeters);
  const bmi = Math.round(bmiRaw * 10) / 10;

  const minIdealWeightKg = Math.round(18.5 * heightInMeters * heightInMeters * 10) / 10;
  const maxIdealWeightKg = Math.round(24.9 * heightInMeters * heightInMeters * 10) / 10;

  if (bmi < 18.5) {
    return {
      bmi,
      category: 'Underweight',
      color: '#3B82F6',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
      badgeText: 'text-blue-800 dark:text-blue-300',
      description: 'Your BMI is below the standard healthy range. Consider nutrient-dense wholesome foods.',
      minIdealWeightKg,
      maxIdealWeightKg,
      healthAdvice: [
        'Include protein-rich foods like lentils, eggs, dairy, paneer/tofu, and nuts in every meal.',
        'Add healthy calorie-dense foods such as avocados, peanut butter, dried fruits, and seeds.',
        'Engage in strength training 2-3 times weekly to build lean muscle mass.',
        'Consult with a community healthcare provider or certified nutritionist for tailored guidance.'
      ]
    };
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return {
      bmi,
      category: 'Normal weight',
      color: '#10B981',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      description: 'Great job! Your BMI falls within the healthy, optimal weight range for your height.',
      minIdealWeightKg,
      maxIdealWeightKg,
      healthAdvice: [
        'Maintain a balanced diet rich in vegetables, whole grains, lean proteins, and healthy fats.',
        'Stay physically active with at least 150 minutes of moderate aerobic exercise per week.',
        'Keep up regular hydration (at least 8 glasses / 2 liters of water daily).',
        'Ensure 7-8 hours of quality restful sleep each night to support body recovery.'
      ]
    };
  } else if (bmi >= 25 && bmi <= 29.9) {
    return {
      bmi,
      category: 'Overweight',
      color: '#F59E0B',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-800 dark:text-amber-300',
      description: 'Your BMI indicates slightly above the ideal range. Small consistent lifestyle shifts can make a big difference.',
      minIdealWeightKg,
      maxIdealWeightKg,
      healthAdvice: [
        'Focus on portion awareness and replace refined sugars/fried items with high-fiber whole foods.',
        'Aim for a daily 30-45 minute brisk walk, cycling, or swimming session.',
        'Drink water before meals to promote satiety and avoid sugary beverages.',
        'Track your daily meals and snacks consistently in the tracker below.'
      ]
    };
  } else {
    return {
      bmi,
      category: 'Obese',
      color: '#EF4444',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
      badgeText: 'text-rose-800 dark:text-rose-300',
      description: 'Your BMI is in the obese category, which can elevate risks for cardiovascular health, diabetes, and joint strain.',
      minIdealWeightKg,
      maxIdealWeightKg,
      healthAdvice: [
        'Adopt sustainable, long-term dietary habits rather than crash diets.',
        'Start with low-impact cardiovascular activities like swimming, water aerobics, or daily walking.',
        'Prioritize fiber-rich vegetables, pulses, and lean proteins to feel full with fewer calories.',
        'Partner with a healthcare professional or community health camp for guided support.'
      ]
    };
  }
}

// Mifflin-St Jeor formula for BMR + TDEE
export function calculateCalorieNeeds(profile: UserProfile): number {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  if (!weight || !height || !age) return 2000;

  let bmr: number;
  if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  if (goal === 'weight_loss') {
    return Math.max(1200, Math.round(tdee - 450));
  } else if (goal === 'muscle_gain') {
    return Math.round(tdee + 350);
  } else {
    return Math.round(tdee);
  }
}

export function calculateWaterGoalGlasses(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 8;
  const mlNeeded = weightKg * 35;
  const glasses = Math.round(mlNeeded / 250);
  return Math.max(6, Math.min(14, glasses));
}

// MET Table for Exercise Calorie Calculations
const MET_VALUES: Record<ExerciseType, Record<'low' | 'moderate' | 'high', number>> = {
  walking: { low: 2.8, moderate: 3.5, high: 4.5 },
  running: { low: 7.0, moderate: 9.0, high: 11.5 },
  cycling: { low: 4.5, moderate: 6.8, high: 9.0 },
  yoga: { low: 2.5, moderate: 3.3, high: 4.5 },
  gym: { low: 3.8, moderate: 5.5, high: 7.5 },
  swimming: { low: 5.0, moderate: 7.0, high: 9.5 },
  sports: { low: 5.0, moderate: 7.0, high: 8.5 },
  calisthenics: { low: 4.0, moderate: 6.5, high: 8.5 },
  traditional: { low: 4.5, moderate: 7.0, high: 9.5 },
  daily_life: { low: 2.5, moderate: 3.8, high: 5.0 },
  hiit: { low: 6.5, moderate: 9.5, high: 12.0 },
  custom: { low: 3.5, moderate: 5.0, high: 7.0 },
};

export function calculateExerciseCalories(
  type: ExerciseType,
  durationMinutes: number,
  intensity: 'low' | 'moderate' | 'high',
  weightKg: number = 65
): number {
  const met = MET_VALUES[type]?.[intensity] || 4.0;
  const durationHours = durationMinutes / 60;
  const calories = met * weightKg * durationHours;
  return Math.round(calories);
}
