import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  UserProfile,
  DayRecord,
  FoodItem,
  MealEntry,
  ExerciseEntry,
  SurveyResponse,
  SurveyQuestion,
  FeedbackSubmission,
  HabitChecklistItem,
  UserAccount,
  BmiCalculationRecord,
  HealthSlot,
  SlotStatus
} from './types';
import {
  loadUsers,
  saveUsers,
  loadCurrentUser,
  saveCurrentUser,
  loadProfile,
  saveProfile,
  loadDayRecords,
  saveDayRecords,
  loadFoods,
  saveFoods,
  loadSurveys,
  saveSurveys,
  loadCommunityQuestions,
  saveCommunityQuestions,
  loadFeedback,
  saveFeedback,
  loadHabits,
  saveHabits,
  loadBmiHistory,
  saveBmiHistory,
  loadSlots,
  saveSlots,
  getTodayString,
  getOrCreateDay,
  populateSampleDemoData,
  DEFAULT_PROFILE
} from './utils/storage';
import {
  calculateCalorieNeeds,
  calculateWaterGoalGlasses
} from './utils/healthCalculators';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { NutritionTrackerView } from './components/NutritionTrackerView';
import { WaterTrackerView } from './components/WaterTrackerView';
import { BmiCalculatorView } from './components/BmiCalculatorView';
import { ExerciseTrackerView } from './components/ExerciseTrackerView';
import { AiAssistantView } from './components/AiAssistantView';
import { HealthTipsView } from './components/HealthTipsView';
import { CommunitySurveyView } from './components/CommunitySurveyView';
import { UserProfileView } from './components/UserProfileView';
import { FeedbackView } from './components/FeedbackView';
import { AdminPanelView } from './components/AdminPanelView';
import { LoginPageView } from './components/LoginPageView';
import { WebsiteLoadingScreen } from './components/WebsiteLoadingScreen';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { SlotBookingModal } from './components/SlotBookingModal';
import { DatabaseModal } from './components/DatabaseModal';
import { AnimatePresence } from 'motion/react';

// Firestore Cloud Database Services
import {
  fetchUsersFromFirestore,
  saveUserToFirestore,
  deleteUserFromFirestore,
  subscribeToUsers,
  fetchFoodsFromFirestore,
  saveFoodToFirestore,
  deleteFoodFromFirestore,
  fetchSlotsFromFirestore,
  saveSlotToFirestore,
  deleteSlotFromFirestore,
  subscribeToSlots,
  fetchQuestionsFromFirestore,
  saveQuestionToFirestore,
  deleteQuestionFromFirestore,
  subscribeToQuestions,
  fetchFeedbackFromFirestore,
  saveFeedbackToFirestore,
  deleteFeedbackFromFirestore,
  subscribeToFeedback,
  fetchSurveysFromFirestore,
  saveSurveyToFirestore,
  subscribeToSurveys,
  fetchUserDayRecordsFromFirestore,
  saveDayRecordToFirestore,
  fetchBmiHistoryFromFirestore,
  saveBmiRecordToFirestore,
  fetchHabitsFromFirestore,
  saveHabitToFirestore,
  seedAllDataToFirestore,
  DatabaseSyncState
} from './services/firestoreService';

// Icons
import {
  Home,
  LayoutDashboard,
  UtensilsCrossed,
  Droplet,
  Activity,
  Sparkles,
  Scale,
  ShieldCheck,
  Bot,
  MessageSquare,
  KeyRound,
  CalendarCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nutritrack_theme_v2') || localStorage.getItem('cep_health_theme_v1');
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Active navigation tab (starts on 'login' after startup loading screen)
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');

  // Website Startup Loading Animation State
  const [isLoadingWebsite, setIsLoadingWebsite] = useState(true);

  // User Accounts & Authentication State
  const [users, setUsers] = useState<UserAccount[]>(loadUsers);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(loadCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Health Consultation & Camp Slots State (Admin & Community Booking)
  const [slots, setSlots] = useState<HealthSlot[]>(loadSlots);
  const [isSlotBookingModalOpen, setIsSlotBookingModalOpen] = useState(false);

  // App-wide data states (scoped to currentUser where appropriate)
  const [profile, setProfile] = useState<UserProfile>(() => currentUser?.profile || loadProfile());
  const [dayRecords, setDayRecords] = useState<Record<string, DayRecord>>(() => currentUser ? loadDayRecords(currentUser.id) : {});
  const [foodsDatabase, setFoodsDatabase] = useState<FoodItem[]>(loadFoods);
  const [surveys, setSurveys] = useState<SurveyResponse[]>(loadSurveys);
  const [communityQuestions, setCommunityQuestions] = useState<SurveyQuestion[]>(loadCommunityQuestions);
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>(loadFeedback);
  const [habits, setHabits] = useState<HabitChecklistItem[]>(loadHabits);
  const [bmiHistory, setBmiHistory] = useState<BmiCalculationRecord[]>(() => currentUser ? loadBmiHistory(currentUser.id) : []);

  // Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  // Firebase Firestore Database Synchronization State
  const [dbSyncState, setDbSyncState] = useState<DatabaseSyncState>({
    isConnected: true,
    isSyncing: false,
    lastSyncedAt: null,
    counts: {
      users: loadUsers().length,
      foods: loadFoods().length,
      slots: loadSlots().length,
      questions: loadCommunityQuestions().length,
      feedback: loadFeedback().length,
      surveys: loadSurveys().length,
      dayRecords: 0,
      bmiHistory: 0,
      habits: loadHabits().length
    },
    error: null
  });

  // Automatically initialize and seed Firestore on app startup
  useEffect(() => {
    let unsubscribeUsers: (() => void) | undefined;
    let unsubscribeSlots: (() => void) | undefined;
    let unsubscribeQuestions: (() => void) | undefined;
    let unsubscribeFeedback: (() => void) | undefined;
    let unsubscribeSurveys: (() => void) | undefined;

    const initializeFirestoreData = async () => {
      try {
        // Upload initial data to Firestore if not already seeded
        const seedResult = await seedAllDataToFirestore(false);
        if (seedResult.success) {
          setDbSyncState((prev) => ({
            ...prev,
            isConnected: true,
            lastSyncedAt: new Date().toISOString(),
            counts: seedResult.counts
          }));
        }

        // Fetch latest collections from Firestore and synchronize local state
        const [cloudUsers, cloudFoods, cloudSlots, cloudQuestions, cloudFeedback, cloudSurveys, cloudHabits] =
          await Promise.all([
            fetchUsersFromFirestore(),
            fetchFoodsFromFirestore(),
            fetchSlotsFromFirestore(),
            fetchQuestionsFromFirestore(),
            fetchFeedbackFromFirestore(),
            fetchSurveysFromFirestore(),
            fetchHabitsFromFirestore()
          ]);

        if (cloudUsers.length > 0) {
          setUsers(cloudUsers);
          saveUsers(cloudUsers);
        }
        if (cloudFoods.length > 0) {
          setFoodsDatabase(cloudFoods);
          saveFoods(cloudFoods);
        }
        if (cloudSlots.length > 0) {
          setSlots(cloudSlots);
          saveSlots(cloudSlots);
        }
        if (cloudQuestions.length > 0) {
          setCommunityQuestions(cloudQuestions);
          saveCommunityQuestions(cloudQuestions);
        }
        if (cloudFeedback.length > 0) {
          setFeedbackList(cloudFeedback);
          saveFeedback(cloudFeedback);
        }
        if (cloudSurveys.length > 0) {
          setSurveys(cloudSurveys);
          saveSurveys(cloudSurveys);
        }
        if (cloudHabits.length > 0) {
          setHabits(cloudHabits);
          saveHabits(cloudHabits);
        }

        // Setup real-time listeners for live updates across browser tabs
        unsubscribeUsers = subscribeToUsers((updatedUsers) => {
          if (updatedUsers.length > 0) {
            setUsers(updatedUsers);
            saveUsers(updatedUsers);
          }
        });

        unsubscribeSlots = subscribeToSlots((updatedSlots) => {
          if (updatedSlots.length > 0) {
            setSlots(updatedSlots);
            saveSlots(updatedSlots);
          }
        });

        unsubscribeQuestions = subscribeToQuestions((updatedQuestions) => {
          if (updatedQuestions.length > 0) {
            setCommunityQuestions(updatedQuestions);
            saveCommunityQuestions(updatedQuestions);
          }
        });

        unsubscribeFeedback = subscribeToFeedback((updatedFeedback) => {
          if (updatedFeedback.length > 0) {
            setFeedbackList(updatedFeedback);
            saveFeedback(updatedFeedback);
          }
        });

        unsubscribeSurveys = subscribeToSurveys((updatedSurveys) => {
          if (updatedSurveys.length > 0) {
            setSurveys(updatedSurveys);
            saveSurveys(updatedSurveys);
          }
        });
      } catch (err) {
        console.warn('Firestore initialization sync notice:', err);
      }
    };

    initializeFirestoreData();

    return () => {
      unsubscribeUsers?.();
      unsubscribeSlots?.();
      unsubscribeQuestions?.();
      unsubscribeFeedback?.();
      unsubscribeSurveys?.();
    };
  }, []);

  // Synchronize user specific records from Firestore when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    const loadUserDataFromCloud = async () => {
      try {
        const [cloudDays, cloudBmi] = await Promise.all([
          fetchUserDayRecordsFromFirestore(currentUser.id),
          fetchBmiHistoryFromFirestore(currentUser.id)
        ]);
        if (Object.keys(cloudDays).length > 0) {
          setDayRecords(cloudDays);
          saveDayRecords(cloudDays, currentUser.id);
        }
        if (cloudBmi.length > 0) {
          setBmiHistory(cloudBmi);
          saveBmiHistory(cloudBmi, currentUser.id);
        }
      } catch (e) {
        console.warn('Could not fetch user records from Firestore:', e);
      }
    };
    loadUserDataFromCloud();
  }, [currentUser?.id]);

  // Update dynamic count summary in sync state
  useEffect(() => {
    setDbSyncState((prev) => ({
      ...prev,
      counts: {
        users: users.length,
        foods: foodsDatabase.length,
        slots: slots.length,
        questions: communityQuestions.length,
        feedback: feedbackList.length,
        surveys: surveys.length,
        dayRecords: Object.keys(dayRecords).length,
        bmiHistory: bmiHistory.length,
        habits: habits.length
      }
    }));
  }, [
    users.length,
    foodsDatabase.length,
    slots.length,
    communityQuestions.length,
    feedbackList.length,
    surveys.length,
    dayRecords,
    bmiHistory.length,
    habits.length
  ]);

  // Full manual sync handler to push all local data to Firestore
  const handleManualSyncAll = async () => {
    const result = await seedAllDataToFirestore(true);
    if (result.success) {
      setDbSyncState((prev) => ({
        ...prev,
        lastSyncedAt: new Date().toISOString(),
        counts: result.counts
      }));
      showToast('All website data successfully saved to Firebase Firestore!');
    } else {
      showToast(result.message);
    }
  };

  // Toast / notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Enforce mandatory login: guard tab switches
  const handleNavigateTab = (tab: ActiveTab) => {
    if (!currentUser && tab !== 'login') {
      setActiveTab('login');
      showToast('Login is compulsory. Please sign in to access this feature.');
      return;
    }
    setActiveTab(tab);
  };

  // Sync theme to DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nutritrack_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nutritrack_theme_v2', 'light');
    }
  }, [isDark]);

  // Handle user switch or login
  const handleUserChange = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    saveCurrentUser(newUser);
    setProfile(newUser.profile);
    const userDays = loadDayRecords(newUser.id);
    setDayRecords(userDays);
    const userBmi = loadBmiHistory(newUser.id);
    setBmiHistory(userBmi);
    setActiveTab(newUser.role === 'admin' ? 'admin' : 'home');
    showToast(`Signed in as ${newUser.name} (${newUser.role.toUpperCase()})`);
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    saveUserToFirestore(newUser).catch((e) => console.warn('Cloud user save:', e));
    handleUserChange(newUser);
  };

  const handleUpdateUserPassword = (userId: string, newPass: string) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, password: newPass } : u));
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    const target = updatedUsers.find((u) => u.id === userId);
    if (target) {
      saveUserToFirestore(target).catch((e) => console.warn('Cloud password update:', e));
    }
    if (currentUser && currentUser.id === userId) {
      const updatedCurr = { ...currentUser, password: newPass };
      setCurrentUser(updatedCurr);
      saveCurrentUser(updatedCurr);
    }
    showToast('Password updated successfully!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    setActiveTab('login');
    showToast('You have been signed out. Login is compulsory.');
  };

  // Slot Management Handlers (Admin Operations)
  const handleCreateSlot = (newSlotData: Omit<HealthSlot, 'id' | 'createdAt' | 'bookedCount' | 'bookings'>) => {
    const newSlot: HealthSlot = {
      ...newSlotData,
      id: `slot-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      bookedCount: 0,
      bookings: []
    };
    const updated = [newSlot, ...slots];
    setSlots(updated);
    saveSlots(updated);
    saveSlotToFirestore(newSlot).catch((e) => console.warn('Cloud slot create:', e));
    showToast(`Created slot "${newSlot.title}"! 📅`);
  };

  const handleDeleteSlot = (slotId: string) => {
    const updated = slots.filter((s) => s.id !== slotId);
    setSlots(updated);
    saveSlots(updated);
    deleteSlotFromFirestore(slotId).catch((e) => console.warn('Cloud slot delete:', e));
    showToast('Consultation slot deleted.');
  };

  const handleEditSlot = (updatedSlot: HealthSlot) => {
    const updated = slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s));
    setSlots(updated);
    saveSlots(updated);
    saveSlotToFirestore(updatedSlot).catch((e) => console.warn('Cloud slot edit:', e));
    showToast(`Updated health consultation slot "${updatedSlot.title}"! 📅`);
  };

  const handleUpdateSlotStatus = (slotId: string, status: SlotStatus) => {
    const updated = slots.map((s) => (s.id === slotId ? { ...s, status } : s));
    setSlots(updated);
    saveSlots(updated);
    const target = updated.find((s) => s.id === slotId);
    if (target) {
      saveSlotToFirestore(target).catch((e) => console.warn('Cloud slot status update:', e));
    }
    showToast(`Slot status updated to ${status}.`);
  };

  const handleAddSlotCapacity = (slotId: string, additional: number) => {
    const updated = slots.map((s) => {
      if (s.id === slotId) {
        const newCap = s.capacity + additional;
        const newStatus = s.status === 'full' ? 'open' : s.status;
        return { ...s, capacity: newCap, status: newStatus };
      }
      return s;
    });
    setSlots(updated);
    saveSlots(updated);
    const target = updated.find((s) => s.id === slotId);
    if (target) {
      saveSlotToFirestore(target).catch((e) => console.warn('Cloud slot capacity update:', e));
    }
    showToast(`Added +${additional} slots capacity! 🎟️`);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === 'admin-rahul' || userId === 'admin-rohini') {
      showToast('Cannot delete system administrator accounts.');
      return;
    }
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    saveUsers(updated);
    deleteUserFromFirestore(userId).catch((e) => console.warn('Cloud user delete:', e));
    showToast('User account removed.');
  };

  // Slot Booking Handlers (Community User Operations)
  const handleBookSlot = (slotId: string, notes?: string) => {
    if (!currentUser) {
      setActiveTab('login');
      showToast('Please sign in first to book a consultation slot.');
      return;
    }

    const updated = slots.map((s) => {
      if (s.id === slotId) {
        // Check if user already booked
        if (s.bookings?.some((b) => b.userId === currentUser.id)) {
          return s;
        }

        const newBooking = {
          id: `book-${Date.now()}`,
          slotId: s.id,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userPhone: currentUser.phone,
          notes: notes?.trim() || '',
          bookedAt: new Date().toLocaleString(),
          status: 'confirmed' as const
        };

        const existingBookings = s.bookings || [];
        const newBookings = [...existingBookings, newBooking];
        const newCount = newBookings.length;
        const newStatus: SlotStatus = newCount >= s.capacity ? 'full' : s.status;

        return {
          ...s,
          bookings: newBookings,
          bookedCount: newCount,
          status: newStatus
        };
      }
      return s;
    });

    setSlots(updated);
    saveSlots(updated);
    const target = updated.find((s) => s.id === slotId);
    if (target) {
      saveSlotToFirestore(target).catch((e) => console.warn('Cloud slot booking:', e));
    }
    showToast(`Slot successfully booked for ${currentUser.name}! ✅`);
  };

  const handleCancelSlotBooking = (slotId: string) => {
    if (!currentUser) return;

    const updated = slots.map((s) => {
      if (s.id === slotId) {
        const existingBookings = s.bookings || [];
        const newBookings = existingBookings.filter((b) => b.userId !== currentUser.id);
        const newCount = newBookings.length;
        const newStatus: SlotStatus = s.status === 'full' ? 'open' : s.status;

        return {
          ...s,
          bookings: newBookings,
          bookedCount: newCount,
          status: newStatus
        };
      }
      return s;
    });

    setSlots(updated);
    saveSlots(updated);
    const target = updated.find((s) => s.id === slotId);
    if (target) {
      saveSlotToFirestore(target).catch((e) => console.warn('Cloud cancel booking:', e));
    }
    showToast('Your slot booking has been cancelled.');
  };

  // Today string
  const todayKey = getTodayString();
  const currentDayRecord = getOrCreateDay(dayRecords, todayKey);

  // Auto-calculated goals
  const calorieBudget = profile.customCalorieGoal || calculateCalorieNeeds(profile);
  const waterGoalGlasses = profile.customWaterGoalGlasses || calculateWaterGoalGlasses(profile.weight);

  // Update day records
  const updateCurrentDayRecord = (updater: (prev: DayRecord) => DayRecord) => {
    const updatedDay = updater(currentDayRecord);
    const updatedMap = {
      ...dayRecords,
      [todayKey]: updatedDay
    };
    setDayRecords(updatedMap);
    if (currentUser) {
      saveDayRecords(updatedMap, currentUser.id);
      saveDayRecordToFirestore(currentUser.id, todayKey, updatedDay).catch((e) =>
        console.warn('Cloud day record update:', e)
      );
    }
  };

  // Nutrition Handlers
  const handleAddMealEntry = (entry: Omit<MealEntry, 'id' | 'timestamp'>) => {
    const newEntry: MealEntry = {
      ...entry,
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    updateCurrentDayRecord((prev) => ({
      ...prev,
      meals: [...(prev.meals || []), newEntry]
    }));
    showToast(`Logged ${entry.name} (${entry.calories} kcal) 🥗`);
  };

  const handleDeleteMealEntry = (mealId: string) => {
    updateCurrentDayRecord((prev) => ({
      ...prev,
      meals: (prev.meals || []).filter((m) => m.id !== mealId)
    }));
    showToast('Meal item removed.');
  };

  const handleAddNewCustomFood = (food: Omit<FoodItem, 'id' | 'isCustom'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `custom-food-${Date.now()}`,
      isCustom: true
    };
    const updated = [newFood, ...foodsDatabase];
    setFoodsDatabase(updated);
    saveFoods(updated);
    saveFoodToFirestore(newFood).catch((e) => console.warn('Cloud food save:', e));
    showToast(`Added "${food.name}" to foods directory.`);
  };

  // Water Handlers
  const handleAddWater = (ml: number = 250) => {
    updateCurrentDayRecord((prev) => {
      const newTotal = (prev.waterTotalMl || 0) + ml;
      const glasses = Math.round(newTotal / 250);
      return {
        ...prev,
        waterTotalMl: newTotal,
        waterGlasses: glasses
      };
    });
    showToast(`+${ml}ml water logged 💧`);
  };

  const handleRemoveWater = (ml: number = 250) => {
    updateCurrentDayRecord((prev) => {
      const newTotal = Math.max(0, (prev.waterTotalMl || 0) - ml);
      const glasses = Math.round(newTotal / 250);
      return {
        ...prev,
        waterTotalMl: newTotal,
        waterGlasses: glasses
      };
    });
    showToast(`-${ml}ml water removed.`);
  };

  const handleResetWater = () => {
    updateCurrentDayRecord((prev) => ({
      ...prev,
      waterTotalMl: 0,
      waterGlasses: 0
    }));
    showToast('Water tracker reset for today.');
  };

  // Exercise Handlers
  const handleAddExercise = (exercise: Omit<ExerciseEntry, 'id' | 'timestamp'>) => {
    const newEntry: ExerciseEntry = {
      ...exercise,
      id: `ex-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    updateCurrentDayRecord((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), newEntry]
    }));
    showToast(`Logged workout: ${exercise.name} (${exercise.caloriesBurned} kcal burned) 🔥`);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    updateCurrentDayRecord((prev) => ({
      ...prev,
      exercises: (prev.exercises || []).filter((e) => e.id !== exerciseId)
    }));
    showToast('Exercise session removed.');
  };

  // BMI History Handlers
  const handleSaveBmiRecord = (record: Omit<BmiCalculationRecord, 'id' | 'timestamp' | 'userId'>) => {
    const newRecord: BmiCalculationRecord = {
      ...record,
      id: `bmi-${Date.now()}`,
      userId: currentUser.id,
      timestamp: new Date().toISOString()
    };
    const updated = [newRecord, ...bmiHistory];
    setBmiHistory(updated);
    saveBmiHistory(updated, currentUser.id);
    saveBmiRecordToFirestore(newRecord).catch((e) => console.warn('Cloud BMI save:', e));
    showToast('BMI assessment saved to health history! ⚖️');
  };

  const handleDeleteBmiRecord = (id: string) => {
    const updated = bmiHistory.filter((r) => r.id !== id);
    setBmiHistory(updated);
    saveBmiHistory(updated, currentUser.id);
    showToast('BMI history record deleted.');
  };

  // Habit Checklist
  const handleToggleHabit = (habitId: string) => {
    const updated = habits.map((h) => (h.id === habitId ? { ...h, completed: !h.completed } : h));
    setHabits(updated);
    saveHabits(updated);
    const target = updated.find((h) => h.id === habitId);
    if (target) {
      saveHabitToFirestore(target).catch((e) => console.warn('Cloud habit save:', e));
    }
  };

  // Survey Handlers
  const handleSubmitSurvey = (surveyData: Omit<SurveyResponse, 'id' | 'timestamp' | 'userId'>) => {
    const newSurvey: SurveyResponse = {
      ...surveyData,
      id: `survey-${Date.now()}`,
      userId: currentUser?.id || 'community-member',
      timestamp: new Date().toISOString()
    };
    const updated = [newSurvey, ...surveys];
    setSurveys(updated);
    saveSurveys(updated);
    saveSurveyToFirestore(newSurvey).catch((e) => console.warn('Cloud survey save:', e));
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    showToast('Thank you for completing the Community Nutrition Survey! 📋');
  };

  const handleVoteQuestion = (questionId: string, optionIdOrIndex: string | number) => {
    const updated = communityQuestions.map((q) => {
      if (q.id === questionId) {
        const newOptions = (q.options || []).map((opt, idx) => {
          const isMatch =
            typeof optionIdOrIndex === 'number'
              ? idx === optionIdOrIndex
              : opt.id === optionIdOrIndex || idx.toString() === optionIdOrIndex;
          return isMatch ? { ...opt, votes: (opt.votes || 0) + 1 } : opt;
        });
        return {
          ...q,
          options: newOptions,
          totalVotes: (q.totalVotes || 0) + 1
        };
      }
      return q;
    });
    setCommunityQuestions(updated);
    saveCommunityQuestions(updated);
    const target = updated.find((q) => q.id === questionId);
    if (target) {
      saveQuestionToFirestore(target).catch((e) => console.warn('Cloud vote save:', e));
    }
    showToast('Your vote has been recorded! 🗳️');
  };

  const handleCreateCommunityQuestion = (q: Omit<SurveyQuestion, 'id' | 'createdAt' | 'totalVotes'>) => {
    const safeOptions = (q.options || []).map((opt, idx) => ({
      id: opt.id || `opt-${Date.now()}-${idx + 1}`,
      text: opt.text,
      votes: opt.votes || 0
    }));
    const newQ: SurveyQuestion = {
      ...q,
      id: `cq-${Date.now()}`,
      options: safeOptions,
      createdBy: q.createdBy || currentUser?.name || 'CEP Admin',
      createdAt: new Date().toISOString().split('T')[0],
      totalVotes: 0
    };
    const updated = [newQ, ...communityQuestions];
    setCommunityQuestions(updated);
    saveCommunityQuestions(updated);
    saveQuestionToFirestore(newQ).catch((e) => console.warn('Cloud question create:', e));
    showToast('New community survey created! 📊');
  };

  const handleDeleteCommunityQuestion = (id: string) => {
    const updated = communityQuestions.filter((q) => q.id !== id);
    setCommunityQuestions(updated);
    saveCommunityQuestions(updated);
    deleteQuestionFromFirestore(id).catch((e) => console.warn('Cloud question delete:', e));
    showToast('Survey question deleted.');
  };

  // Feedback Handlers
  const handleSubmitFeedback = (fb: Omit<FeedbackSubmission, 'id' | 'timestamp' | 'userId'>) => {
    const newFeedback: FeedbackSubmission = {
      ...fb,
      id: `fb-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      timestamp: new Date().toISOString()
    };
    const updatedList = [newFeedback, ...feedbackList];
    setFeedbackList(updatedList);
    saveFeedback(updatedList);
    saveFeedbackToFirestore(newFeedback).catch((e) => console.warn('Cloud feedback save:', e));
    showToast('Feedback submitted successfully. Thank you! 📩');
  };

  const handleUpdateFeedbackStatus = (
    id: string,
    status: FeedbackSubmission['status'],
    adminNote?: string
  ) => {
    const updated = feedbackList.map((f) =>
      f.id === id ? { ...f, status, adminNote: adminNote ?? f.adminNote } : f
    );
    setFeedbackList(updated);
    saveFeedback(updated);
    const target = updated.find((f) => f.id === id);
    if (target) {
      saveFeedbackToFirestore(target).catch((e) => console.warn('Cloud feedback update:', e));
    }
    showToast(`Feedback updated to ${status}.`);
  };

  const handleDeleteFeedback = (id: string) => {
    const updated = feedbackList.filter((f) => f.id !== id);
    setFeedbackList(updated);
    saveFeedback(updated);
    deleteFeedbackFromFirestore(id).catch((e) => console.warn('Cloud feedback delete:', e));
    showToast('Feedback deleted.');
  };

  // Profile update
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    saveProfile(newProfile);

    // Update in currentUser and users list if logged in
    if (currentUser) {
      const updatedUser = { ...currentUser, profile: newProfile };
      setCurrentUser(updatedUser);
      saveCurrentUser(updatedUser);

      const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      saveUserToFirestore(updatedUser).catch((e) => console.warn('Cloud profile update:', e));
    }

    showToast('Profile updated successfully! 👤');
  };

  // Reset all data
  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all tracked meals, water, and exercise records?')) {
      localStorage.clear();
      setProfile(DEFAULT_PROFILE);
      setDayRecords({});
      saveProfile(DEFAULT_PROFILE);
      showToast('All local logs have been reset.');
    }
  };

  // Populate sample demo data
  const handlePopulateSampleData = () => {
    if (!currentUser) {
      showToast('Please sign in to generate and explore sample demo logs.');
      return;
    }
    const { profile: demoProf, days: demoDays } = populateSampleDemoData(currentUser);
    setProfile(demoProf);
    setDayRecords(demoDays);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.4 } });
    showToast('Sample community demo logs loaded! Check Dashboard & Trackers.');
  };

  // Aggregate metrics for child views
  const todayCalories = (currentDayRecord?.meals || []).reduce((sum, m) => sum + (m.calories || 0), 0);
  const todayWaterGlasses = Math.round((currentDayRecord?.waterTotalMl || 0) / 250);
  const todayExerciseMins = (currentDayRecord?.exercises || []).reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-400 dark:from-slate-950 dark:via-teal-950/80 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Website Startup Loading Screen Animation */}
      <AnimatePresence mode="wait">
        {isLoadingWebsite && (
          <WebsiteLoadingScreen
            onComplete={() => {
              setIsLoadingWebsite(false);
              setActiveTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient background light orbs for frosted glass refraction */}
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-emerald-300/40 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-sky-300/40 dark:bg-sky-600/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-teal-200/40 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Toast Notification Alert with Frosted Glass */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/60 dark:border-white/15 text-xs font-bold animate-in slide-in-from-right-5 duration-200 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <div className="relative z-40 px-3 sm:px-6 pt-3">
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
          isDark={isDark}
          setIsDark={setIsDark}
          profile={profile}
          currentUser={currentUser}
          onOpenAuthModal={() => setActiveTab('login')}
          onPopulateSampleData={handlePopulateSampleData}
          onLogout={handleLogout}
          onOpenDatabaseModal={isAdmin ? () => setIsDatabaseModalOpen(true) : undefined}
        />
      </div>

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-8">
            <HomeView
              setActiveTab={setActiveTab}
              profile={profile}
              todayCalories={todayCalories}
              calorieBudget={calorieBudget}
              todayWaterGlasses={todayWaterGlasses}
              waterGoalGlasses={waterGoalGlasses}
              todayExerciseMins={todayExerciseMins}
            />

            {/* Health Camps & Consultation Slots Showcase Card */}
            <div className="rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <CalendarCheck2 className="w-4 h-4" />
                  <span>Free CEP Health Consultation & Camp Slots</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Reserve a 1-on-1 Nutrition or BMI Health Slot
                </h3>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Book your reserved time with Coordinators Rahul Gaikwad or Rohini Sharma for personalized dietary planning, body fat analysis, and active lifestyle coaching.
                </p>
              </div>
              <button
                onClick={() => setIsSlotBookingModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-700/20 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>Explore & Book Slots ({slots.filter((s) => s.status === 'open').length} Open)</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardView
              todayRecord={currentDayRecord}
              dayRecords={dayRecords}
              profile={profile}
              calorieBudget={calorieBudget}
              waterGoalGlasses={waterGoalGlasses}
              setActiveTab={setActiveTab}
              onAddGlassOfWater={() => handleAddWater(250)}
            />

            {/* Quick consultation slot launcher */}
            <div className="p-5 rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Need Personalized Nutrition Advice?
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Book a free health camp or online consultation slot with CEP coordinators.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSlotBookingModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
              >
                View Available Slots
              </button>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <NutritionTrackerView
            currentDayRecord={currentDayRecord}
            foodsDatabase={foodsDatabase}
            calorieBudget={calorieBudget}
            onAddMealEntry={handleAddMealEntry}
            onDeleteMealEntry={handleDeleteMealEntry}
            onAddNewCustomFood={handleAddNewCustomFood}
          />
        )}

        {activeTab === 'water' && (
          <WaterTrackerView
            currentDayRecord={currentDayRecord}
            waterGoalGlasses={waterGoalGlasses}
            onAddWater={handleAddWater}
            onRemoveWater={handleRemoveWater}
            onResetWater={handleResetWater}
          />
        )}

        {activeTab === 'bmi' && (
          <BmiCalculatorView
            profile={profile}
            bmiHistory={bmiHistory}
            onUpdateProfile={handleUpdateProfile}
            onSaveBmiRecord={handleSaveBmiRecord}
            onDeleteBmiRecord={handleDeleteBmiRecord}
          />
        )}

        {activeTab === 'exercise' && (
          <ExerciseTrackerView
            currentDayRecord={currentDayRecord}
            profile={profile}
            onAddExercise={handleAddExercise}
            onDeleteExercise={handleDeleteExercise}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AiAssistantView
            profile={profile}
            currentDayRecord={currentDayRecord}
            currentUser={currentUser}
            dayRecords={dayRecords}
            foodsDatabase={foodsDatabase}
            bmiHistory={bmiHistory}
            habits={habits}
            slots={slots}
            calorieBudget={calorieBudget}
            waterGoalGlasses={waterGoalGlasses}
          />
        )}

        {activeTab === 'tips' && (
          <HealthTipsView
            habits={habits}
            onToggleHabit={handleToggleHabit}
          />
        )}

        {activeTab === 'survey' && (
          <CommunitySurveyView
            surveys={surveys}
            communityQuestions={communityQuestions}
            currentUser={currentUser}
            onSubmitSurvey={handleSubmitSurvey}
            onVoteQuestion={handleVoteQuestion}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            profile={profile}
            onSaveProfile={(newProf) => {
              setProfile(newProf);
              saveProfile(newProf);
            }}
            onResetAllData={handleResetAllData}
            onExportReport={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackView
            feedbacks={feedbackList}
            onSubmitFeedback={handleSubmitFeedback}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView
            currentUser={currentUser}
            users={users}
            feedbacks={feedbackList}
            surveys={surveys}
            communityQuestions={communityQuestions}
            slots={slots}
            onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
            onDeleteFeedback={handleDeleteFeedback}
            onCreateSurveyQuestion={handleCreateCommunityQuestion}
            onDeleteSurveyQuestion={handleDeleteCommunityQuestion}
            onCreateSlot={handleCreateSlot}
            onEditSlot={handleEditSlot}
            onDeleteSlot={handleDeleteSlot}
            onUpdateSlotStatus={handleUpdateSlotStatus}
            onAddSlotCapacity={handleAddSlotCapacity}
            onDeleteUser={handleDeleteUser}
            onOpenAuthModal={() => setActiveTab('login')}
            onLoginSuccess={handleUserChange}
            onNavigateToTab={setActiveTab}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}

        {activeTab === 'login' && (
          <LoginPageView
            currentUser={currentUser}
            registeredUsers={users}
            onLoginSuccess={handleUserChange}
            onRegisterUser={handleRegisterUser}
            onUpdateUserPassword={handleUpdateUserPassword}
            onNavigateToTab={setActiveTab}
          />
        )}
      </main>

      {/* Authentication & User ID Switching Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        registeredUsers={users}
        onLoginSuccess={handleUserChange}
        onRegisterUser={handleRegisterUser}
      />

      {/* Health Consultation & Camp Slot Booking Modal */}
      <SlotBookingModal
        isOpen={isSlotBookingModalOpen}
        onClose={() => setIsSlotBookingModalOpen(false)}
        slots={slots}
        currentUser={currentUser}
        onBookSlot={handleBookSlot}
        onCancelBooking={handleCancelSlotBooking}
      />

      {/* Firebase Cloud Firestore Database Explorer & Migration Modal (Admin Only) */}
      {isAdmin && (
        <DatabaseModal
          isOpen={isDatabaseModalOpen}
          onClose={() => setIsDatabaseModalOpen(false)}
          syncState={dbSyncState}
          onSyncAll={handleManualSyncAll}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        todayRecord={currentDayRecord}
        calorieBudget={calorieBudget}
        waterGoalGlasses={waterGoalGlasses}
      />

      {/* Bottom Mobile Quick Nav Bar in Frosted Glass */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-white/60 dark:border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => { handleNavigateTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'home' ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-400'}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => { handleNavigateTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'dashboard' ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-400'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => { handleNavigateTab('nutrition'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'nutrition' ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-400'}`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Meals</span>
        </button>

        <button
          onClick={() => { handleNavigateTab('exercise'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'exercise' ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-400'}`}
        >
          <Activity className="w-5 h-5" />
          <span>Workout</span>
        </button>

        <button
          onClick={() => { handleNavigateTab('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'login' ? 'text-teal-700 dark:text-teal-300 font-black' : 'text-slate-700 dark:text-slate-400'}`}
        >
          <KeyRound className="w-5 h-5" />
          <span>Login</span>
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => { handleNavigateTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'admin' ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-400'}`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <Footer
        setActiveTab={handleNavigateTab}
        onOpenAuthModal={() => handleNavigateTab('login')}
      />
    </div>
  );
}
