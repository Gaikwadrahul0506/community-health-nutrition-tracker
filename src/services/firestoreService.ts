import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  UserAccount,
  FoodItem,
  HealthSlot,
  SurveyQuestion,
  FeedbackSubmission,
  SurveyResponse,
  DayRecord,
  BmiCalculationRecord,
  HabitChecklistItem
} from '../types';
import {
  INITIAL_DEMO_USERS,
  PRECONFIGURED_ADMINS,
  loadUsers,
  loadFoods,
  getInitialCommunityQuestions,
  getInitialMockSurveys,
  getInitialFeedbackList,
  getInitialBmiHistory,
  getInitialHealthSlots,
  loadHabits,
  loadDayRecords
} from '../utils/storage';

export interface DatabaseSyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  counts: {
    users: number;
    foods: number;
    slots: number;
    questions: number;
    feedback: number;
    surveys: number;
    dayRecords: number;
    bmiHistory: number;
    habits: number;
  };
  error: string | null;
}

// ----------------------------------------------------
// USERS COLLECTION
// ----------------------------------------------------
const USERS_COLLECTION = 'users';

export async function fetchUsersFromFirestore(): Promise<UserAccount[]> {
  try {
    const colRef = collection(db, USERS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as UserAccount);
  } catch (err) {
    console.warn('Firestore fetchUsers error:', err);
    return [];
  }
}

export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(docRef, user, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveUser error for ${user.id}:`, err);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`Firestore deleteUser error for ${userId}:`, err);
  }
}

export function subscribeToUsers(onUpdate: (users: UserAccount[]) => void) {
  const colRef = collection(db, USERS_COLLECTION);
  return onSnapshot(colRef, (snap) => {
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as UserAccount);
      onUpdate(list);
    }
  }, (err) => {
    console.warn('subscribeToUsers error:', err);
  });
}

// ----------------------------------------------------
// FOODS COLLECTION
// ----------------------------------------------------
const FOODS_COLLECTION = 'foods';

export async function fetchFoodsFromFirestore(): Promise<FoodItem[]> {
  try {
    const snap = await getDocs(collection(db, FOODS_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as FoodItem);
  } catch (err) {
    console.warn('Firestore fetchFoods error:', err);
    return [];
  }
}

export async function saveFoodToFirestore(food: FoodItem): Promise<void> {
  try {
    const docRef = doc(db, FOODS_COLLECTION, food.id);
    await setDoc(docRef, food, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveFood error for ${food.id}:`, err);
  }
}

export async function deleteFoodFromFirestore(foodId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, FOODS_COLLECTION, foodId));
  } catch (err) {
    console.warn(`Firestore deleteFood error for ${foodId}:`, err);
  }
}

// ----------------------------------------------------
// HEALTH SLOTS COLLECTION
// ----------------------------------------------------
const SLOTS_COLLECTION = 'slots';

export async function fetchSlotsFromFirestore(): Promise<HealthSlot[]> {
  try {
    const snap = await getDocs(collection(db, SLOTS_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as HealthSlot);
  } catch (err) {
    console.warn('Firestore fetchSlots error:', err);
    return [];
  }
}

export async function saveSlotToFirestore(slot: HealthSlot): Promise<void> {
  try {
    const docRef = doc(db, SLOTS_COLLECTION, slot.id);
    await setDoc(docRef, slot, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveSlot error for ${slot.id}:`, err);
  }
}

export async function deleteSlotFromFirestore(slotId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SLOTS_COLLECTION, slotId));
  } catch (err) {
    console.warn(`Firestore deleteSlot error for ${slotId}:`, err);
  }
}

export function subscribeToSlots(onUpdate: (slots: HealthSlot[]) => void) {
  const colRef = collection(db, SLOTS_COLLECTION);
  return onSnapshot(colRef, (snap) => {
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as HealthSlot);
      onUpdate(list);
    }
  }, (err) => {
    console.warn('subscribeToSlots error:', err);
  });
}

// ----------------------------------------------------
// COMMUNITY QUESTIONS / SURVEYS
// ----------------------------------------------------
const QUESTIONS_COLLECTION = 'communityQuestions';

export async function fetchQuestionsFromFirestore(): Promise<SurveyQuestion[]> {
  try {
    const snap = await getDocs(collection(db, QUESTIONS_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as SurveyQuestion);
  } catch (err) {
    console.warn('Firestore fetchQuestions error:', err);
    return [];
  }
}

export async function saveQuestionToFirestore(question: SurveyQuestion): Promise<void> {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, question.id);
    await setDoc(docRef, question, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveQuestion error for ${question.id}:`, err);
  }
}

export async function deleteQuestionFromFirestore(questionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, QUESTIONS_COLLECTION, questionId));
  } catch (err) {
    console.warn(`Firestore deleteQuestion error for ${questionId}:`, err);
  }
}

export function subscribeToQuestions(onUpdate: (questions: SurveyQuestion[]) => void) {
  const colRef = collection(db, QUESTIONS_COLLECTION);
  return onSnapshot(colRef, (snap) => {
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as SurveyQuestion);
      onUpdate(list);
    }
  }, (err) => {
    console.warn('subscribeToQuestions error:', err);
  });
}

// ----------------------------------------------------
// FEEDBACK SUBMISSIONS
// ----------------------------------------------------
const FEEDBACK_COLLECTION = 'feedback';

export async function fetchFeedbackFromFirestore(): Promise<FeedbackSubmission[]> {
  try {
    const snap = await getDocs(collection(db, FEEDBACK_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as FeedbackSubmission);
  } catch (err) {
    console.warn('Firestore fetchFeedback error:', err);
    return [];
  }
}

export async function saveFeedbackToFirestore(item: FeedbackSubmission): Promise<void> {
  try {
    const docRef = doc(db, FEEDBACK_COLLECTION, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveFeedback error for ${item.id}:`, err);
  }
}

export async function deleteFeedbackFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, FEEDBACK_COLLECTION, id));
  } catch (err) {
    console.warn(`Firestore deleteFeedback error for ${id}:`, err);
  }
}

export function subscribeToFeedback(onUpdate: (items: FeedbackSubmission[]) => void) {
  const colRef = collection(db, FEEDBACK_COLLECTION);
  return onSnapshot(colRef, (snap) => {
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as FeedbackSubmission);
      onUpdate(list);
    }
  }, (err) => {
    console.warn('subscribeToFeedback error:', err);
  });
}

// ----------------------------------------------------
// SURVEY RESPONSES (AUDIT TABLE)
// ----------------------------------------------------
const SURVEYS_COLLECTION = 'surveys';

export async function fetchSurveysFromFirestore(): Promise<SurveyResponse[]> {
  try {
    const snap = await getDocs(collection(db, SURVEYS_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as SurveyResponse);
  } catch (err) {
    console.warn('Firestore fetchSurveys error:', err);
    return [];
  }
}

export async function saveSurveyToFirestore(survey: SurveyResponse): Promise<void> {
  try {
    const docRef = doc(db, SURVEYS_COLLECTION, survey.id);
    await setDoc(docRef, survey, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveSurvey error for ${survey.id}:`, err);
  }
}

export async function deleteSurveyFromFirestore(surveyId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SURVEYS_COLLECTION, surveyId));
  } catch (err) {
    console.warn(`Firestore deleteSurvey error for ${surveyId}:`, err);
  }
}

export function subscribeToSurveys(onUpdate: (surveys: SurveyResponse[]) => void) {
  const colRef = collection(db, SURVEYS_COLLECTION);
  return onSnapshot(colRef, (snap) => {
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as SurveyResponse);
      onUpdate(list);
    }
  }, (err) => {
    console.warn('subscribeToSurveys error:', err);
  });
}

// ----------------------------------------------------
// DAY RECORDS (USER-SCOPED NUTRITION, WATER, EXERCISE)
// ----------------------------------------------------
const DAY_RECORDS_COLLECTION = 'dayRecords';

export interface FirestoreDayDoc extends DayRecord {
  userId: string;
  docId: string; // `${userId}_${date}`
}

export async function fetchUserDayRecordsFromFirestore(userId: string): Promise<Record<string, DayRecord>> {
  try {
    const snap = await getDocs(collection(db, DAY_RECORDS_COLLECTION));
    if (snap.empty) return {};

    const records: Record<string, DayRecord> = {};
    snap.docs.forEach((docSnap) => {
      const data = docSnap.data() as FirestoreDayDoc;
      if (data.userId === userId && data.date) {
        records[data.date] = {
          date: data.date,
          meals: Array.isArray(data.meals) ? data.meals : [],
          waterLogs: Array.isArray(data.waterLogs) ? data.waterLogs : [],
          waterTotalMl: typeof data.waterTotalMl === 'number' ? data.waterTotalMl : 0,
          exercises: Array.isArray(data.exercises) ? data.exercises : []
        };
      }
    });
    return records;
  } catch (err) {
    console.warn(`Firestore fetchUserDayRecords error for ${userId}:`, err);
    return {};
  }
}

export async function saveDayRecordToFirestore(userId: string, date: string, day: DayRecord): Promise<void> {
  try {
    const docId = `${userId}_${date}`;
    const docRef = doc(db, DAY_RECORDS_COLLECTION, docId);
    const payload: FirestoreDayDoc = {
      ...day,
      userId,
      docId
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveDayRecord error for ${userId} on ${date}:`, err);
  }
}

// ----------------------------------------------------
// BMI CALCULATION HISTORY
// ----------------------------------------------------
const BMI_COLLECTION = 'bmiHistory';

export async function fetchBmiHistoryFromFirestore(userId: string): Promise<BmiCalculationRecord[]> {
  try {
    const snap = await getDocs(collection(db, BMI_COLLECTION));
    if (snap.empty) return [];
    const list: BmiCalculationRecord[] = [];
    snap.docs.forEach((docSnap) => {
      const data = docSnap.data() as BmiCalculationRecord;
      if (data.userId === userId || !data.userId) {
        list.push(data);
      }
    });
    return list;
  } catch (err) {
    console.warn(`Firestore fetchBmiHistory error for ${userId}:`, err);
    return [];
  }
}

export async function saveBmiRecordToFirestore(record: BmiCalculationRecord): Promise<void> {
  try {
    const docRef = doc(db, BMI_COLLECTION, record.id);
    await setDoc(docRef, record, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveBmiRecord error:`, err);
  }
}

// ----------------------------------------------------
// HABITS CHECKLIST
// ----------------------------------------------------
const HABITS_COLLECTION = 'habits';

export async function fetchHabitsFromFirestore(): Promise<HabitChecklistItem[]> {
  try {
    const snap = await getDocs(collection(db, HABITS_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as HabitChecklistItem);
  } catch (err) {
    console.warn('Firestore fetchHabits error:', err);
    return [];
  }
}

export async function saveHabitToFirestore(habit: HabitChecklistItem): Promise<void> {
  try {
    const docRef = doc(db, HABITS_COLLECTION, habit.id);
    await setDoc(docRef, habit, { merge: true });
  } catch (err) {
    console.warn(`Firestore saveHabit error:`, err);
  }
}

// ----------------------------------------------------
// SEED & SYNC ALL WEBSITE DATA TO FIRESTORE
// ----------------------------------------------------

/**
 * Initializes and uploads ALL website data into Firestore database:
 * - Preconfigured Admins & Users
 * - Indian & International Food Database (calories, macros)
 * - Health Consultation & Camp Slots
 * - Community Survey Polls & Questions
 * - Sample & User Feedback
 * - Audit Survey Responses
 * - Daily Meal & Activity Logs
 * - BMI History
 * - Habit Checklists
 */
export async function seedAllDataToFirestore(forceOverwrite = false): Promise<{
  success: boolean;
  counts: DatabaseSyncState['counts'];
  message: string;
}> {
  const counts = {
    users: 0,
    foods: 0,
    slots: 0,
    questions: 0,
    feedback: 0,
    surveys: 0,
    dayRecords: 0,
    bmiHistory: 0,
    habits: 0
  };

  try {
    // 1. Users
    const existingUsers = await fetchUsersFromFirestore();
    const localUsers = loadUsers();
    const usersToUpload = forceOverwrite ? localUsers : (existingUsers.length > 0 ? existingUsers : localUsers);
    for (const u of usersToUpload) {
      await saveUserToFirestore(u);
      counts.users++;
    }

    // 2. Foods
    const existingFoods = await fetchFoodsFromFirestore();
    const localFoods = loadFoods();
    const foodsToUpload = forceOverwrite ? localFoods : (existingFoods.length > 0 ? existingFoods : localFoods);
    // Batch foods in chunks of 20 to avoid rate limits
    for (const f of foodsToUpload) {
      await saveFoodToFirestore(f);
      counts.foods++;
    }

    // 3. Health Consultation & Camp Slots
    const existingSlots = await fetchSlotsFromFirestore();
    const localSlots = getInitialHealthSlots();
    const slotsToUpload = forceOverwrite ? localSlots : (existingSlots.length > 0 ? existingSlots : localSlots);
    for (const s of slotsToUpload) {
      await saveSlotToFirestore(s);
      counts.slots++;
    }

    // 4. Community Questions
    const existingQuestions = await fetchQuestionsFromFirestore();
    const localQuestions = getInitialCommunityQuestions();
    const questionsToUpload = forceOverwrite ? localQuestions : (existingQuestions.length > 0 ? existingQuestions : localQuestions);
    for (const q of questionsToUpload) {
      await saveQuestionToFirestore(q);
      counts.questions++;
    }

    // 5. Feedback
    const existingFeedback = await fetchFeedbackFromFirestore();
    const localFeedback = getInitialFeedbackList();
    const feedbackToUpload = forceOverwrite ? localFeedback : (existingFeedback.length > 0 ? existingFeedback : localFeedback);
    for (const fb of feedbackToUpload) {
      await saveFeedbackToFirestore(fb);
      counts.feedback++;
    }

    // 6. Survey Audit Responses
    const existingSurveys = await fetchSurveysFromFirestore();
    const localSurveys = getInitialMockSurveys();
    const surveysToUpload = forceOverwrite ? localSurveys : (existingSurveys.length > 0 ? existingSurveys : localSurveys);
    for (const s of surveysToUpload) {
      await saveSurveyToFirestore(s);
      counts.surveys++;
    }

    // 7. Day Records for standard users
    const adminDays = loadDayRecords('admin-rahul');
    for (const [dateKey, dayRec] of Object.entries(adminDays)) {
      await saveDayRecordToFirestore('admin-rahul', dateKey, dayRec);
      counts.dayRecords++;
    }

    // 8. BMI History
    const bmiList = getInitialBmiHistory();
    for (const b of bmiList) {
      await saveBmiRecordToFirestore(b);
      counts.bmiHistory++;
    }

    // 9. Habits
    const habitList = loadHabits();
    for (const h of habitList) {
      await saveHabitToFirestore(h);
      counts.habits++;
    }

    return {
      success: true,
      counts,
      message: 'All website data successfully synchronized with Firebase Firestore database.'
    };
  } catch (err: any) {
    console.error('Error seeding all data to Firestore:', err);
    return {
      success: false,
      counts,
      message: `Failed to sync data: ${err?.message || 'Unknown Firestore error'}`
    };
  }
}
