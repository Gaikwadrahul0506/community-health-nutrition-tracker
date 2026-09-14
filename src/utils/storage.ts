import {
  UserProfile,
  DayRecord,
  FoodItem,
  SurveyResponse,
  SurveyQuestion,
  FeedbackSubmission,
  HabitChecklistItem,
  UserAccount,
  UserRole,
  BmiCalculationRecord,
  HealthSlot,
  SlotBooking
} from '../types';
import { INITIAL_FOOD_DATABASE, DEFAULT_HABITS } from '../data/initialData';

const KEYS = {
  USERS: 'nutritrack_users_v2',
  CURRENT_USER: 'nutritrack_current_user_v2',
  DAYS_PREFIX: 'nutritrack_days_user_',
  LEGACY_DAYS: 'cep_health_days_v1',
  FOODS: 'nutritrack_foods_v2',
  SURVEYS: 'nutritrack_surveys_v2',
  COMMUNITY_QUESTIONS: 'nutritrack_community_questions_v2',
  FEEDBACK: 'nutritrack_feedback_v2',
  HABITS: 'nutritrack_habits_v2',
  BMI_HISTORY: 'nutritrack_bmi_history_v2',
  THEME: 'nutritrack_theme_v2',
  SLOTS: 'nutritrack_health_slots_v2'
};

export const PRECONFIGURED_ADMINS: UserAccount[] = [
  {
    id: 'admin-rahul',
    name: 'Rahul Gaikwad',
    email: 'gaikwadrahul0506@gmail.com',
    phone: '9833618673',
    password: 'Rahul123456',
    role: 'admin',
    joinDate: '2026-01-10',
    profile: {
      name: 'Rahul Gaikwad',
      age: 23,
      gender: 'male',
      height: 176,
      weight: 70,
      activityLevel: 'active',
      goal: 'healthy_lifestyle',
      customCalorieGoal: 2300,
      customWaterGoalGlasses: 8
    }
  },
  {
    id: 'admin-rohini',
    name: 'Rohini Sharma',
    email: 'rohin9324@gmail.com',
    phone: '9324408918',
    password: 'Rahul123456',
    role: 'admin',
    joinDate: '2026-01-12',
    profile: {
      name: 'Rohini Sharma',
      age: 22,
      gender: 'female',
      height: 165,
      weight: 58,
      activityLevel: 'moderate',
      goal: 'healthy_lifestyle',
      customCalorieGoal: 2000,
      customWaterGoalGlasses: 8
    }
  }
];

export const INITIAL_DEMO_USERS: UserAccount[] = [
  ...PRECONFIGURED_ADMINS,
  {
    id: 'user-priya',
    name: 'Priya Patel',
    email: 'priya.patel@community.org',
    phone: '9820123456',
    password: '12345',
    role: 'user',
    joinDate: '2026-02-01',
    profile: {
      name: 'Priya Patel',
      age: 24,
      gender: 'female',
      height: 162,
      weight: 56,
      activityLevel: 'moderate',
      goal: 'weight_loss',
      customCalorieGoal: 1850,
      customWaterGoalGlasses: 8
    }
  },
  {
    id: 'user-amit',
    name: 'Amit Kumar',
    email: 'amit.kumar@community.org',
    phone: '9819988776',
    password: '12345',
    role: 'user',
    joinDate: '2026-02-15',
    profile: {
      name: 'Amit Kumar',
      age: 27,
      gender: 'male',
      height: 178,
      weight: 75,
      activityLevel: 'active',
      goal: 'muscle_gain',
      customCalorieGoal: 2500,
      customWaterGoalGlasses: 9
    }
  }
];

export const DEFAULT_PROFILE: UserProfile = PRECONFIGURED_ADMINS[0].profile;

/**
 * Deduplicates user accounts by canonical email and/or user ID.
 * - Guarantees each distinct person appears exactly ONCE.
 * - Merges duplicate records while preserving the user's richest profile,
 *   biometrics, role (admin takes precedence), credentials, and metadata.
 * - Guarantees preconfigured admins retain their canonical IDs and names.
 */
export function deduplicateUsers(users: UserAccount[]): UserAccount[] {
  if (!Array.isArray(users)) return [];

  const deduplicated: UserAccount[] = [];
  const seenEmails = new Map<string, number>(); // normalized email -> index in deduplicated
  const seenIds = new Map<string, number>();    // normalized id -> index in deduplicated

  for (const rawUser of users) {
    if (!rawUser) continue;

    const user = { ...rawUser };
    const normEmail = (user.email || '').trim().toLowerCase();
    const normId = (user.id || '').trim().toLowerCase();

    // Check if this matches Rahul
    const isRahul =
      normId === 'admin-rahul' ||
      normEmail === 'gaikwadrahul0506@gmail.com' ||
      (user.name?.toLowerCase().includes('rahul') && user.role === 'admin');

    // Check if this matches Rohini
    const isRohini =
      normId === 'admin-rohini' ||
      normEmail === 'rohin9324@gmail.com' ||
      (user.name?.toLowerCase().includes('rohini') && !isRahul);

    let matchIndex = -1;

    if (isRahul) {
      matchIndex = deduplicated.findIndex(
        (u) => u.id === 'admin-rahul' || u.email?.toLowerCase() === 'gaikwadrahul0506@gmail.com'
      );
    } else if (isRohini) {
      matchIndex = deduplicated.findIndex(
        (u) => u.id === 'admin-rohini' || u.email?.toLowerCase() === 'rohin9324@gmail.com'
      );
    } else {
      if (normEmail && seenEmails.has(normEmail)) {
        matchIndex = seenEmails.get(normEmail)!;
      } else if (normId && seenIds.has(normId)) {
        matchIndex = seenIds.get(normId)!;
      }
    }

    if (matchIndex === -1) {
      // First time seeing this user
      let canonicalUser = { ...user };
      if (isRahul) {
        canonicalUser = {
          ...PRECONFIGURED_ADMINS[0],
          ...user,
          id: 'admin-rahul',
          name: 'Rahul Gaikwad',
          email: 'gaikwadrahul0506@gmail.com',
          role: 'admin',
          password: 'Rahul123456',
          profile: {
            ...PRECONFIGURED_ADMINS[0].profile,
            ...(user.profile || {})
          }
        };
      } else if (isRohini) {
        canonicalUser = {
          ...PRECONFIGURED_ADMINS[1],
          ...user,
          id: 'admin-rohini',
          name: 'Rohini Sharma',
          email: 'rohin9324@gmail.com',
          role: 'admin',
          password: 'Rahul123456',
          profile: {
            ...PRECONFIGURED_ADMINS[1].profile,
            ...(user.profile || {})
          }
        };
      }

      const newIdx = deduplicated.length;
      deduplicated.push(canonicalUser);
      if (canonicalUser.email) seenEmails.set(canonicalUser.email.trim().toLowerCase(), newIdx);
      if (canonicalUser.id) seenIds.set(canonicalUser.id.trim().toLowerCase(), newIdx);
    } else {
      // Existing user found - merge non-destructively
      const existing = deduplicated[matchIndex];
      const mergedRole: UserRole =
        existing.role === 'admin' || user.role === 'admin' || isRahul || isRohini
          ? 'admin'
          : existing.role || user.role || 'user';

      const mergedProfile: UserProfile = {
        ...(existing.profile || {}),
        ...(user.profile || {}),
        name: user.profile?.name || existing.profile?.name || user.name || existing.name || 'Community Member',
        gender: user.profile?.gender || existing.profile?.gender || 'male',
        activityLevel: user.profile?.activityLevel || existing.profile?.activityLevel || 'moderate',
        customCalorieGoal:
          user.profile?.customCalorieGoal ||
          existing.profile?.customCalorieGoal,
        customWaterGoalGlasses:
          user.profile?.customWaterGoalGlasses ||
          existing.profile?.customWaterGoalGlasses,
        height: user.profile?.height || existing.profile?.height || 170,
        weight: user.profile?.weight || existing.profile?.weight || 65,
        age: user.profile?.age || existing.profile?.age || 24,
        goal: user.profile?.goal || existing.profile?.goal || 'healthy_lifestyle'
      };

      deduplicated[matchIndex] = {
        ...existing,
        ...user,
        id: existing.id,
        role: mergedRole,
        profile: mergedProfile,
        joinDate: existing.joinDate || user.joinDate,
        password: isRahul || isRohini ? 'Rahul123456' : user.password || existing.password
      };

      if (isRahul) {
        deduplicated[matchIndex].id = 'admin-rahul';
        deduplicated[matchIndex].name = 'Rahul Gaikwad';
        deduplicated[matchIndex].email = 'gaikwadrahul0506@gmail.com';
        deduplicated[matchIndex].role = 'admin';
        deduplicated[matchIndex].password = 'Rahul123456';
      } else if (isRohini) {
        deduplicated[matchIndex].id = 'admin-rohini';
        deduplicated[matchIndex].name = 'Rohini Sharma';
        deduplicated[matchIndex].email = 'rohin9324@gmail.com';
        deduplicated[matchIndex].role = 'admin';
        deduplicated[matchIndex].password = 'Rahul123456';
      }
    }
  }

  return deduplicated;
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// User Accounts Storage
export function loadUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    let list: UserAccount[] = raw ? JSON.parse(raw) : [...INITIAL_DEMO_USERS];

    if (!Array.isArray(list) || list.length === 0) {
      list = [...INITIAL_DEMO_USERS];
    }

    // Always combine with preconfigured admins and strictly deduplicate
    const combined = [...list, ...PRECONFIGURED_ADMINS];
    const deduplicated = deduplicateUsers(combined);

    // Save cleaned deduplicated list back to localStorage to eliminate stale duplicates
    try {
      localStorage.setItem(KEYS.USERS, JSON.stringify(deduplicated));
    } catch {}

    return deduplicated;
  } catch (e) {
    console.error('Error loading users', e);
  }
  return deduplicateUsers([...INITIAL_DEMO_USERS]);
}

export function saveUsers(users: UserAccount[]): void {
  try {
    const deduplicated = deduplicateUsers(users);
    localStorage.setItem(KEYS.USERS, JSON.stringify(deduplicated));
  } catch (e) {
    console.error('Error saving users', e);
  }
}

// Current Logged In User
export function loadCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (raw) {
      const user: UserAccount = JSON.parse(raw);
      if (user.id === 'admin-rahul' || user.email?.toLowerCase() === 'gaikwadrahul0506@gmail.com') {
        const updated: UserAccount = {
          ...user,
          id: 'admin-rahul',
          name: 'Rahul Gaikwad',
          email: 'gaikwadrahul0506@gmail.com',
          role: 'admin',
          password: 'Rahul123456'
        };
        try {
          localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updated));
        } catch {}
        return updated;
      }
      if (user.id === 'admin-rohini' || user.email?.toLowerCase() === 'rohin9324@gmail.com') {
        const updated: UserAccount = {
          ...user,
          id: 'admin-rohini',
          name: 'Rohini Sharma',
          email: 'rohin9324@gmail.com',
          role: 'admin',
          password: 'Rahul123456'
        };
        try {
          localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return user;
    }
  } catch (e) {
    console.error('Error loading current user', e);
  }
  // Login is compulsory for everyone - no default active session
  return null;
}

export function saveCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Error saving current user', e);
  }
}

// User Profile Convenience Helpers
export function loadProfile(): UserProfile {
  const currentUser = loadCurrentUser();
  return currentUser?.profile || DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  const currentUser = loadCurrentUser();
  if (currentUser) {
    currentUser.profile = profile;
    saveCurrentUser(currentUser);
  }
}

// Day Records (User-scoped)
export function loadDayRecords(userId: string = 'admin-rahul'): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(`${KEYS.DAYS_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);

    // Fallback to legacy days if loading for default admin
    const legacyRaw = localStorage.getItem(KEYS.LEGACY_DAYS);
    if (legacyRaw) return JSON.parse(legacyRaw);
  } catch (e) {
    console.error('Error loading day records', e);
  }
  return {};
}

export function saveDayRecords(records: Record<string, DayRecord>, userId: string = 'admin-rahul'): void {
  try {
    localStorage.setItem(`${KEYS.DAYS_PREFIX}${userId}`, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving day records', e);
  }
}

// Food Database
export function loadFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(KEYS.FOODS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading foods', e);
  }
  return INITIAL_FOOD_DATABASE;
}

export function saveFoods(foods: FoodItem[]): void {
  try {
    localStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
  } catch (e) {
    console.error('Error saving foods', e);
  }
}

// Community Questions / Surveys
export function getInitialCommunityQuestions(): SurveyQuestion[] {
  return [
    {
      id: 'q-1',
      title: 'How many standard glasses of water (250ml) do you drink daily?',
      category: 'Hydration',
      description: 'Understanding baseline community fluid hydration metrics.',
      totalVotes: 84,
      createdBy: 'Rahul Gaikwad (Admin)',
      createdAt: '2026-08-10',
      options: [
        { id: 'opt-1-1', text: '1 - 3 Glasses (Under 1 Liter)', votes: 12 },
        { id: 'opt-1-2', text: '4 - 6 Glasses (1L - 1.5 Liters)', votes: 28 },
        { id: 'opt-1-3', text: '7 - 8 Glasses (Optimal 2 Liters)', votes: 34 },
        { id: 'opt-1-4', text: '8+ Glasses (High Active Hydration)', votes: 10 }
      ]
    },
    {
      id: 'q-2',
      title: 'What is your primary wellness & fitness goal this month?',
      category: 'Fitness Goals',
      description: 'Identifying collective health priorities across the neighborhood.',
      totalVotes: 96,
      createdBy: 'Rohini Sharma (Admin)',
      createdAt: '2026-08-11',
      options: [
        { id: 'opt-2-1', text: 'Maintain healthy balanced lifestyle & energy', votes: 41 },
        { id: 'opt-2-2', text: 'Weight loss & sustainable calorie deficit', votes: 29 },
        { id: 'opt-2-3', text: 'Muscle gain, protein focus & strength', votes: 19 },
        { id: 'opt-2-4', text: 'Stress reduction, better sleep & recovery', votes: 7 }
      ]
    },
    {
      id: 'q-3',
      title: 'How frequently do you engage in 30+ minutes of physical activity?',
      category: 'Exercise',
      description: 'Tracking community cardiovascular and mobility habits.',
      totalVotes: 72,
      createdBy: 'Rahul Gaikwad (Admin)',
      createdAt: '2026-08-12',
      options: [
        { id: 'opt-3-1', text: 'Daily or 5+ days a week', votes: 24 },
        { id: 'opt-3-2', text: '3 to 4 days a week', votes: 31 },
        { id: 'opt-3-3', text: '1 to 2 days a week', votes: 13 },
        { id: 'opt-3-4', text: 'Rarely / mostly sedentary', votes: 4 }
      ]
    },
    {
      id: 'q-4',
      title: 'What is the biggest barrier to maintaining a healthy daily diet?',
      category: 'Nutrition Barriers',
      description: 'Pinpointing challenges to improve community workshops.',
      totalVotes: 65,
      createdBy: 'Rohini Sharma (Admin)',
      createdAt: '2026-08-13',
      options: [
        { id: 'opt-4-1', text: 'Busy schedule & lack of meal prep time', votes: 32 },
        { id: 'opt-4-2', text: 'High cost of fresh healthy organic groceries', votes: 14 },
        { id: 'opt-4-3', text: 'Social events, street food & cravings', votes: 15 },
        { id: 'opt-4-4', text: 'Lack of clear nutritional knowledge', votes: 4 }
      ]
    }
  ];
}

export function loadCommunityQuestions(): SurveyQuestion[] {
  try {
    const raw = localStorage.getItem(KEYS.COMMUNITY_QUESTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading community questions', e);
  }
  return getInitialCommunityQuestions();
}

export function saveCommunityQuestions(questions: SurveyQuestion[]): void {
  try {
    localStorage.setItem(KEYS.COMMUNITY_QUESTIONS, JSON.stringify(questions));
  } catch (e) {
    console.error('Error saving community questions', e);
  }
}

// Legacy Survey Responses (Audit table)
export function loadSurveys(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(KEYS.SURVEYS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading surveys', e);
  }
  return getInitialMockSurveys();
}

export function saveSurveys(surveys: SurveyResponse[]): void {
  try {
    localStorage.setItem(KEYS.SURVEYS, JSON.stringify(surveys));
  } catch (e) {
    console.error('Error saving surveys', e);
  }
}

// Feedback Submissions
export function getInitialFeedbackList(): FeedbackSubmission[] {
  return [
    {
      id: 'fb-1',
      userId: 'user-priya',
      name: 'Priya Patel',
      email: 'priya.patel@community.org',
      subject: 'Loving the Indian Food Database & Macro Calculations',
      category: 'nutrition',
      rating: 5,
      comments: 'The traditional meals like Dal Tadka, Brown Rice, and Poha are so accurate with exact calories and protein metrics. Really helping my weight loss goal!',
      status: 'resolved',
      timestamp: '2026-08-14T09:30:00Z',
      adminNote: 'Thank you Priya! We have added 30+ regional whole food entries.'
    },
    {
      id: 'fb-2',
      userId: 'user-amit',
      name: 'Amit Kumar',
      email: 'amit.kumar@community.org',
      subject: 'Suggestion: Add Hydration Reminder Sounds',
      category: 'suggestion',
      rating: 4,
      comments: 'The 8-glass water tracker circular ring looks great on mobile! Could we get an optional hourly chime reminder?',
      status: 'reviewed',
      timestamp: '2026-08-15T11:15:00Z',
      adminNote: 'Great suggestion Amit! We have queued this for the next update cycle.'
    },
    {
      id: 'fb-3',
      name: 'Sneha Deshmukh',
      email: 'sneha.deshmukh@community.org',
      subject: 'CEP Health Drive Workshop Inquiry',
      category: 'cep_inquiry',
      rating: 5,
      comments: 'Our neighborhood center wants to use NutriTrack for our upcoming 50-person community health audit this weekend. Can we export consolidated summaries?',
      status: 'pending',
      timestamp: '2026-08-16T08:00:00Z'
    },
    {
      id: 'fb-4',
      name: 'Vikas Patil',
      email: 'vikas.patil@outlook.com',
      subject: 'Frosted Glass UI & Charts look awesome!',
      category: 'general',
      rating: 5,
      comments: 'The area chart comparing calories consumed vs burned and the BMI history scale are so intuitive and polished.',
      status: 'resolved',
      timestamp: '2026-08-15T17:40:00Z',
      adminNote: 'Glad you like the modern glassmorphism interface!'
    }
  ];
}

export function loadFeedback(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(KEYS.FEEDBACK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading feedback', e);
  }
  return getInitialFeedbackList();
}

export function saveFeedback(feedback: FeedbackSubmission[]): void {
  try {
    localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(feedback));
  } catch (e) {
    console.error('Error saving feedback', e);
  }
}

// BMI Calculation History
export function getInitialBmiHistory(): BmiCalculationRecord[] {
  return [
    {
      id: 'bmi-1',
      userId: 'admin-rahul',
      height: 176,
      weight: 70,
      bmi: 22.6,
      category: 'Normal Weight',
      timestamp: '2026-08-16 08:30 AM'
    },
    {
      id: 'bmi-2',
      userId: 'admin-rahul',
      height: 176,
      weight: 71.5,
      bmi: 23.1,
      category: 'Normal Weight',
      timestamp: '2026-08-08 09:00 AM'
    },
    {
      id: 'bmi-3',
      userId: 'admin-rahul',
      height: 176,
      weight: 73,
      bmi: 23.6,
      category: 'Normal Weight',
      timestamp: '2026-07-25 08:15 AM'
    }
  ];
}

export function loadBmiHistory(userId: string = 'admin-rahul'): BmiCalculationRecord[] {
  try {
    const raw = localStorage.getItem(`${KEYS.BMI_HISTORY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading BMI history', e);
  }
  return getInitialBmiHistory();
}

export function saveBmiHistory(records: BmiCalculationRecord[], userId: string = 'admin-rahul'): void {
  try {
    localStorage.setItem(`${KEYS.BMI_HISTORY}_${userId}`, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving BMI history', e);
  }
}

// Health Consultation & Camp Slots (Admin & User Booking)
export function getInitialHealthSlots(): HealthSlot[] {
  return [
    {
      id: 'slot-1',
      title: 'Community Diet & Nutrition Assessment Camp',
      type: 'nutrition_consultation',
      doctorOrCoordinator: 'Rohini Sharma (Nutrition Lead)',
      coordinatorEmail: 'rohin9324@gmail.com',
      coordinatorPhone: '+91 9324408918',
      date: '2026-08-18',
      timeRange: '10:00 AM - 01:00 PM',
      location: 'Community Health Center, Hall A',
      venueType: 'in_person',
      capacity: 20,
      bookedCount: 14,
      status: 'open',
      description: 'One-on-one personalized caloric and macronutrient assessment, diet chart design, and local whole-food advice.',
      createdByAdminId: 'admin-rohini',
      createdAt: '2026-08-10',
      bookings: [
        {
          id: 'b-1',
          slotId: 'slot-1',
          userId: 'user-priya',
          userName: 'Priya Patel',
          userEmail: 'priya.patel@community.org',
          userPhone: '+91 9820123456',
          notes: 'Looking for a vegetarian meal plan for weight loss.',
          bookedAt: '2026-08-12 11:30 AM',
          status: 'confirmed'
        },
        {
          id: 'b-2',
          slotId: 'slot-1',
          userId: 'user-amit',
          userName: 'Amit Kumar',
          userEmail: 'amit.kumar@community.org',
          userPhone: '+91 9819988776',
          notes: 'High protein nutrition counseling for marathon training.',
          bookedAt: '2026-08-13 04:15 PM',
          status: 'confirmed'
        }
      ]
    },
    {
      id: 'slot-2',
      title: 'CEP Comprehensive BMI, BP & Body Composition Drive',
      type: 'bmi_wellness_check',
      doctorOrCoordinator: 'Rahul Gaikwad (Admin Lead)',
      coordinatorEmail: 'gaikwadrahul0506@gmail.com',
      coordinatorPhone: '+91 9833618673',
      date: '2026-08-20',
      timeRange: '09:00 AM - 12:30 PM',
      location: 'Main Auditorium, North Wing',
      venueType: 'in_person',
      capacity: 35,
      bookedCount: 22,
      status: 'open',
      description: 'Digital BMI measurement, body fat ratio analysis, blood pressure checkup, and hydration consultation.',
      createdByAdminId: 'admin-rahul',
      createdAt: '2026-08-11',
      bookings: []
    },
    {
      id: 'slot-3',
      title: 'Virtual 1-on-1 Fitness & Active Lifestyle Guidance',
      type: 'fitness_assessment',
      doctorOrCoordinator: 'Rahul Gaikwad (Admin Lead)',
      coordinatorEmail: 'gaikwadrahul0506@gmail.com',
      coordinatorPhone: '+91 9833618673',
      date: '2026-08-22',
      timeRange: '04:00 PM - 06:00 PM',
      location: 'NutriTrack Telehealth Live Room (Online)',
      venueType: 'online_consultation',
      capacity: 10,
      bookedCount: 8,
      status: 'open',
      description: 'Online exercise regimen customization, posture correction, and MET-based weekly training plan creation.',
      createdByAdminId: 'admin-rahul',
      createdAt: '2026-08-12',
      bookings: []
    },
    {
      id: 'slot-4',
      title: 'Elderly Nutrition & Bone Health Workshop',
      type: 'health_camp',
      doctorOrCoordinator: 'Rohini Sharma (Nutrition Lead)',
      coordinatorEmail: 'rohin9324@gmail.com',
      coordinatorPhone: '+91 9324408918',
      date: '2026-08-25',
      timeRange: '11:00 AM - 02:00 PM',
      location: 'Community Senior Center, Ground Floor',
      venueType: 'in_person',
      capacity: 25,
      bookedCount: 25,
      status: 'full',
      description: 'Calcium, Vitamin D, joint health, and balanced senior nutrition guidelines with interactive cooking demonstrations.',
      createdByAdminId: 'admin-rohini',
      createdAt: '2026-08-05',
      bookings: []
    }
  ];
}

export function loadSlots(): HealthSlot[] {
  try {
    const raw = localStorage.getItem(KEYS.SLOTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading slots', e);
  }
  return getInitialHealthSlots();
}

export function saveSlots(slots: HealthSlot[]): void {
  try {
    localStorage.setItem(KEYS.SLOTS, JSON.stringify(slots));
  } catch (e) {
    console.error('Error saving slots', e);
  }
}

// Habits
export function loadHabits(): HabitChecklistItem[] {
  try {
    const raw = localStorage.getItem(KEYS.HABITS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading habits', e);
  }
  return DEFAULT_HABITS;
}

export function saveHabits(habits: HabitChecklistItem[]): void {
  try {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Error saving habits', e);
  }
}

export function getOrCreateDay(records: Record<string, DayRecord>, dateStr: string): DayRecord {
  const existing = records ? records[dateStr] : null;
  if (existing) {
    return {
      date: existing.date || dateStr,
      meals: Array.isArray(existing.meals) ? existing.meals : [],
      waterLogs: Array.isArray(existing.waterLogs) ? existing.waterLogs : [],
      waterTotalMl: typeof existing.waterTotalMl === 'number' ? existing.waterTotalMl : 0,
      exercises: Array.isArray(existing.exercises) ? existing.exercises : []
    };
  }
  return {
    date: dateStr,
    meals: [],
    waterLogs: [],
    waterTotalMl: 0,
    exercises: []
  };
}

export function getInitialMockSurveys(): SurveyResponse[] {
  return [
    {
      id: 's-1',
      timestamp: '2026-08-14T10:30:00Z',
      ageGroup: '18-25',
      gender: 'Female',
      dietPreference: 'Vegetarian',
      fruitVegServings: '3-4 servings',
      waterIntakeGlasses: '7-8 glasses',
      exerciseFrequency: '3-4 days/week',
      sleepHours: '7-8 hours',
      fastFoodFrequency: 'Once a week',
      awarenessRating: 5,
      primaryHealthGoal: 'Energy & Mental Focus'
    },
    {
      id: 's-2',
      timestamp: '2026-08-14T14:15:00Z',
      ageGroup: '26-39',
      gender: 'Male',
      dietPreference: 'Non-Vegetarian',
      fruitVegServings: '2 servings',
      waterIntakeGlasses: '5-6 glasses',
      exerciseFrequency: '1-2 days/week',
      sleepHours: '6-7 hours',
      fastFoodFrequency: '2-3 times a week',
      awarenessRating: 4,
      primaryHealthGoal: 'Weight Management'
    },
    {
      id: 's-3',
      timestamp: '2026-08-15T09:45:00Z',
      ageGroup: '40-59',
      gender: 'Female',
      dietPreference: 'Vegetarian',
      fruitVegServings: '4+ servings',
      waterIntakeGlasses: '8+ glasses',
      exerciseFrequency: 'Daily (5+ days)',
      sleepHours: '7-8 hours',
      fastFoodFrequency: 'Rarely / Never',
      awarenessRating: 5,
      primaryHealthGoal: 'Heart Health & Immunity'
    },
    {
      id: 's-4',
      timestamp: '2026-08-15T16:20:00Z',
      ageGroup: '18-25',
      gender: 'Male',
      dietPreference: 'Mixed / Flexitarian',
      fruitVegServings: '2-3 servings',
      waterIntakeGlasses: '7-8 glasses',
      exerciseFrequency: '3-4 days/week',
      sleepHours: '7-8 hours',
      fastFoodFrequency: 'Once a week',
      awarenessRating: 4,
      primaryHealthGoal: 'Muscle Gain & Fitness'
    },
    {
      id: 's-5',
      timestamp: '2026-08-16T08:10:00Z',
      ageGroup: '60+',
      gender: 'Male',
      dietPreference: 'Vegetarian',
      fruitVegServings: '3-4 servings',
      waterIntakeGlasses: '6-7 glasses',
      exerciseFrequency: 'Daily (5+ days)',
      sleepHours: '6-7 hours',
      fastFoodFrequency: 'Rarely / Never',
      awarenessRating: 5,
      primaryHealthGoal: 'Healthy Aging & Mobility'
    }
  ];
}

// Generate realistic starter day records for demonstration
export function populateSampleDemoData(userAccount?: UserAccount): {
  profile: UserProfile;
  days: Record<string, DayRecord>;
} {
  const profile: UserProfile = userAccount
    ? userAccount.profile
    : {
        name: 'Rahul Gaikwad',
        age: 23,
        gender: 'male',
        height: 176,
        weight: 70,
        activityLevel: 'active',
        goal: 'healthy_lifestyle',
        customCalorieGoal: 2300,
        customWaterGoalGlasses: 8
      };

  const d = new Date();
  const days: Record<string, DayRecord> = {};

  // Create logs for past 7 days including today
  for (let i = 6; i >= 0; i--) {
    const pastDate = new Date(d);
    pastDate.setDate(d.getDate() - i);
    const dateKey = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${String(pastDate.getDate()).padStart(2, '0')}`;

    if (i === 0) {
      // Today
      days[dateKey] = {
        date: dateKey,
        meals: [
          {
            id: 'm-today-1',
            name: 'Oatmeal with Berries & Honey',
            servingSize: '1 bowl (200g)',
            servings: 1,
            calories: 240,
            protein: 7,
            carbs: 45,
            fats: 4,
            fiber: 6,
            mealType: 'breakfast',
            timestamp: new Date(pastDate.setHours(8, 30)).toISOString()
          },
          {
            id: 'm-today-2',
            name: 'Boiled Eggs (2 large)',
            servingSize: '2 eggs (100g)',
            servings: 1,
            calories: 155,
            protein: 13,
            carbs: 1,
            fats: 11,
            mealType: 'breakfast',
            timestamp: new Date(pastDate.setHours(8, 35)).toISOString()
          },
          {
            id: 'm-today-3',
            name: 'Cooked Brown Rice',
            servingSize: '1 cup (195g)',
            servings: 1,
            calories: 215,
            protein: 5,
            carbs: 45,
            fats: 2,
            fiber: 4,
            mealType: 'lunch',
            timestamp: new Date(pastDate.setHours(13, 0)).toISOString()
          },
          {
            id: 'm-today-4',
            name: 'Yellow Dal Tadka / Lentil Soup',
            servingSize: '1 medium bowl (200g)',
            servings: 1.5,
            calories: 270,
            protein: 16.5,
            carbs: 39,
            fats: 6,
            fiber: 10.5,
            mealType: 'lunch',
            timestamp: new Date(pastDate.setHours(13, 5)).toISOString()
          },
          {
            id: 'm-today-5',
            name: 'Fresh Green Garden Salad with Lemon',
            servingSize: '1 bowl (150g)',
            servings: 1,
            calories: 65,
            protein: 2,
            carbs: 10,
            fats: 2,
            fiber: 4,
            mealType: 'lunch',
            timestamp: new Date(pastDate.setHours(13, 10)).toISOString()
          },
          {
            id: 'm-today-6',
            name: 'Roasted Almonds & Walnuts',
            servingSize: 'Handful (30g)',
            servings: 1,
            calories: 175,
            protein: 6,
            carbs: 5,
            fats: 16,
            fiber: 3,
            mealType: 'snacks',
            timestamp: new Date(pastDate.setHours(16, 45)).toISOString()
          },
          {
            id: 'm-today-7',
            name: 'Green Tea (Unsweetened)',
            servingSize: '1 cup (240ml)',
            servings: 1,
            calories: 2,
            protein: 0,
            carbs: 0.5,
            fats: 0,
            fiber: 0,
            mealType: 'snacks',
            timestamp: new Date(pastDate.setHours(16, 50)).toISOString()
          }
        ],
        waterLogs: [
          { id: 'w-1', amountMl: 250, timestamp: '08:00 AM' },
          { id: 'w-2', amountMl: 250, timestamp: '09:45 AM' },
          { id: 'w-3', amountMl: 250, timestamp: '11:30 AM' },
          { id: 'w-4', amountMl: 250, timestamp: '01:30 PM' },
          { id: 'w-5', amountMl: 250, timestamp: '03:15 PM' },
          { id: 'w-6', amountMl: 250, timestamp: '05:00 PM' }
        ],
        waterTotalMl: 1500,
        exercises: [
          {
            id: 'e-1',
            type: 'walking',
            name: 'Morning Community Brisk Walk',
            durationMinutes: 35,
            intensity: 'moderate',
            caloriesBurned: 135,
            notes: 'Brisk pace around campus community garden',
            timestamp: '07:30 AM'
          },
          {
            id: 'e-2',
            type: 'yoga',
            name: 'Sun Salutations & Stretching',
            durationMinutes: 20,
            intensity: 'low',
            caloriesBurned: 65,
            notes: 'Morning mobility',
            timestamp: '08:05 AM'
          }
        ]
      };
    } else {
      // Past days
      const waterCount = Math.floor(6 + ((i * 3) % 4));
      const calsList = [1850, 1920, 2100, 2050, 1980, 2200];
      const exCalsList = [220, 310, 180, 250, 290, 340];
      const targetCal = calsList[i % calsList.length];
      const exCal = exCalsList[i % exCalsList.length];

      days[dateKey] = {
        date: dateKey,
        meals: [
          {
            id: `m-past-${i}-1`,
            name: 'Vegetable Poha & Sprouted Salad',
            servingSize: '1 plate',
            servings: 1,
            calories: 360,
            protein: 13,
            carbs: 62,
            fats: 6.5,
            mealType: 'breakfast',
            timestamp: '08:30 AM'
          },
          {
            id: `m-past-${i}-2`,
            name: 'Whole Wheat Roti & Dal & Sabzi',
            servingSize: '2 rotis + dal',
            servings: 1,
            calories: Math.round(targetCal * 0.4),
            protein: 24,
            carbs: 82,
            fats: 14,
            mealType: 'lunch',
            timestamp: '01:15 PM'
          },
          {
            id: `m-past-${i}-3`,
            name: 'Roasted Makhana & Fresh Fruit',
            servingSize: '1 bowl',
            servings: 1,
            calories: 220,
            protein: 4,
            carbs: 49,
            fats: 1.8,
            mealType: 'snacks',
            timestamp: '05:00 PM'
          },
          {
            id: `m-past-${i}-4`,
            name: 'Grilled Paneer / Tofu with Brown Rice',
            servingSize: '1 plate',
            servings: 1,
            calories: targetCal - 360 - Math.round(targetCal * 0.4) - 220,
            protein: 28,
            carbs: 55,
            fats: 20,
            mealType: 'dinner',
            timestamp: '08:00 PM'
          }
        ],
        waterLogs: Array.from({ length: waterCount }).map((_, idx) => ({
          id: `w-past-${i}-${idx}`,
          amountMl: 250,
          timestamp: `${8 + idx * 1.5}:00`
        })),
        waterTotalMl: waterCount * 250,
        exercises: [
          {
            id: `e-past-${i}`,
            type: i % 2 === 0 ? 'running' : 'cycling',
            name: i % 2 === 0 ? 'Evening Jogging' : 'Campus Cycling',
            durationMinutes: 30,
            intensity: 'moderate',
            caloriesBurned: exCal,
            timestamp: '06:00 PM'
          }
        ]
      };
    }
  }

  const activeUserId = userAccount ? userAccount.id : 'admin-rahul';
  saveDayRecords(days, activeUserId);

  return { profile, days };
}
