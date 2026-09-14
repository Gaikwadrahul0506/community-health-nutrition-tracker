import React, { useState } from 'react';
import {
  MealType,
  MealEntry,
  FoodItem,
  DayRecord
} from '../types';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Search,
  Check,
  ChevronDown,
  Apple,
  Coffee,
  Sun,
  Sunset,
  Cookie,
  Flame,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NutritionTrackerViewProps {
  currentDayRecord: DayRecord;
  foodsDatabase: FoodItem[];
  calorieBudget: number;
  onAddMealEntry: (meal: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  onDeleteMealEntry: (mealId: string) => void;
  onAddNewCustomFood: (food: Omit<FoodItem, 'id'>) => void;
}

export const NutritionTrackerView: React.FC<NutritionTrackerViewProps> = ({
  currentDayRecord,
  foodsDatabase,
  calorieBudget,
  onAddMealEntry,
  onDeleteMealEntry,
  onAddNewCustomFood
}) => {
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState<number>(1);

  // Custom food modal / drawer
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 plate / bowl');
  const [customCals, setCustomCals] = useState<number>(200);
  const [customProtein, setCustomProtein] = useState<number>(6);
  const [customCarbs, setCustomCarbs] = useState<number>(28);
  const [customFats, setCustomFats] = useState<number>(5);
  const [customFiber, setCustomFiber] = useState<number>(3);

  // Filtered food list
  const safeFoods = foodsDatabase || [];
  const safeMeals = currentDayRecord?.meals || [];

  const filteredFoods = safeFoods.filter((f) =>
    (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group meals
  const mealsByType: Record<MealType, MealEntry[]> = {
    breakfast: safeMeals.filter((m) => m.mealType === 'breakfast'),
    lunch: safeMeals.filter((m) => m.mealType === 'lunch'),
    dinner: safeMeals.filter((m) => m.mealType === 'dinner'),
    snacks: safeMeals.filter((m) => m.mealType === 'snacks')
  };

  const totalCaloriesEaten = safeMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = Math.round(safeMeals.reduce((sum, m) => sum + (m.protein || 0), 0) * 10) / 10;
  const totalCarbs = Math.round(safeMeals.reduce((sum, m) => sum + (m.carbs || 0), 0) * 10) / 10;
  const totalFats = Math.round(safeMeals.reduce((sum, m) => sum + (m.fats || 0), 0) * 10) / 10;
  const totalFiber = Math.round(safeMeals.reduce((sum, m) => sum + (m.fiber || 0), 0) * 10) / 10;

  const mealCategoryMeta: Record<MealType, { title: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }> = {
    breakfast: { title: 'Breakfast', icon: Coffee, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800/60' },
    lunch: { title: 'Lunch', icon: Sun, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800/60' },
    dinner: { title: 'Dinner', icon: Sunset, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800/60' },
    snacks: { title: 'Snacks & Drinks', icon: Cookie, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/60' }
  };

  const handleSelectFoodAndLog = (food: FoodItem) => {
    onAddMealEntry({
      foodId: food.id,
      name: food.name,
      servingSize: food.servingSize,
      servings: servings,
      calories: Math.round(food.calories * servings),
      protein: Math.round(food.protein * servings * 10) / 10,
      carbs: Math.round(food.carbs * servings * 10) / 10,
      fats: Math.round(food.fats * servings * 10) / 10,
      fiber: food.fiber ? Math.round(food.fiber * servings * 10) / 10 : 0,
      mealType: selectedMealType
    });
    setSelectedFood(null);
    setServings(1);
    setSearchQuery('');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
  };

  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddNewCustomFood({
      name: customName.trim(),
      servingSize: customServing.trim() || '1 serving',
      calories: Number(customCals) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fats: Number(customFats) || 0,
      fiber: Number(customFiber) || 0,
      category: 'Custom Item',
      isCustom: true
    });

    // Also auto-log to currently selected meal
    onAddMealEntry({
      name: customName.trim(),
      servingSize: customServing.trim() || '1 serving',
      servings: 1,
      calories: Number(customCals) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fats: Number(customFats) || 0,
      fiber: Number(customFiber) || 0,
      mealType: selectedMealType
    });

    setIsCustomModalOpen(false);
    setCustomName('');
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Daily Meal & Calorie Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Nutrition & Calorie Summary
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Log foods across Breakfast, Lunch, Dinner, and Snacks to monitor daily caloric intake and macro balance.
            </p>
          </div>

          {/* Calorie Dial / Stat */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Calories</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalCaloriesEaten} <span className="text-xs font-semibold text-slate-400">/ {calorieBudget} kcal</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {Math.min(100, Math.round((totalCaloriesEaten / calorieBudget) * 100))}%
            </div>
          </div>
        </div>

        {/* Macro Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 block">Protein</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalProtein}g</div>
            <span className="text-[10px] text-slate-500">~{Math.round(totalProtein * 4)} kcal</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 block">Carbohydrates</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalCarbs}g</div>
            <span className="text-[10px] text-slate-500">~{Math.round(totalCarbs * 4)} kcal</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 block">Fats</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalFats}g</div>
            <span className="text-[10px] text-slate-500">~{Math.round(totalFats * 9)} kcal</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">Dietary Fiber</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalFiber}g</div>
            <span className="text-[10px] text-slate-500">Digestion & Gut</span>
          </div>
        </div>
      </div>

      {/* Food Search & Log Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Add Food to Today's Meals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select meal category and search our verified wholesome community food list or create a custom dish.
            </p>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200 hover:text-emerald-600 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>+ Custom Food Item</span>
          </button>
        </div>

        {/* Meal Category Select Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((type) => {
            const isSelected = selectedMealType === type;
            const meta = mealCategoryMeta[type];
            const Icon = meta.icon;

            return (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : meta.color}`} />
                <span className="capitalize">{type}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search healthy foods (e.g. Oatmeal, Dal, Brown Rice, Roti, Eggs, Apple)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Quick Food Items Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Click to add to <strong>{selectedMealType.toUpperCase()}</strong>:</span>
            <span>{filteredFoods.length} items available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => handleSelectFoodAndLog(food)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {food.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {food.servingSize} • P: {food.protein}g C: {food.carbs}g F: {food.fats}g
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    {food.calories} kcal
                  </span>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Meal Category Sections */}
      <div className="space-y-6">
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((mealType) => {
          const items = mealsByType[mealType];
          const mealCals = items.reduce((s, m) => s + m.calories, 0);
          const meta = mealCategoryMeta[mealType];
          const Icon = meta.icon;

          return (
            <div
              key={mealType}
              className={`rounded-3xl p-6 border ${meta.border} bg-white dark:bg-slate-900 shadow-xs space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${meta.bg} ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                      {mealType}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {items.length} {items.length === 1 ? 'item recorded' : 'items recorded'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {mealCals} <span className="text-xs font-medium text-slate-500">kcal</span>
                  </span>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  No food logged yet for {mealType}. Search foods above to add!
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                            {item.servingSize} {item.servings > 1 ? `(x${item.servings})` : ''}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex gap-3">
                          <span>Protein: <strong>{item.protein}g</strong></span>
                          <span>Carbs: <strong>{item.carbs}g</strong></span>
                          <span>Fats: <strong>{item.fats}g</strong></span>
                          {item.fiber ? <span>Fiber: <strong>{item.fiber}g</strong></span> : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.calories} kcal
                        </span>
                        <button
                          onClick={() => onDeleteMealEntry(item.id)}
                          title="Remove item"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Food Item Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Custom Food Dish
                </h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomFood} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dish / Food Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Homemade Vegetable Curry"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Portion Size
                  </label>
                  <input
                    type="text"
                    value={customServing}
                    onChange={(e) => setCustomServing(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={customCals}
                    onChange={(e) => setCustomCals(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={customFats}
                    onChange={(e) => setCustomFats(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={customFiber}
                    onChange={(e) => setCustomFiber(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Save & Log to {selectedMealType.toUpperCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
