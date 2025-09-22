import { DailyMeals, DailyNutritionSummary, FoodEntry } from '../types/nutrition';

export const calculateMealNutrition = (entries: FoodEntry[]) => {
  return entries.reduce(
    (totals, entry) => ({
      calories: totals.calories + entry.nutrition.calories,
      protein: totals.protein + entry.nutrition.protein,
      carbs: totals.carbs + entry.nutrition.carbs,
      fats: totals.fats + entry.nutrition.fats
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

export const calculateDailyNutrition = (meals: DailyMeals, date: string): DailyNutritionSummary => {
  const allEntries = [
    ...meals.breakfast,
    ...meals.lunch,
    ...meals.dinner,
    ...meals.snacks
  ];

  const totals = calculateMealNutrition(allEntries);

  return {
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein * 10) / 10,
    totalCarbs: Math.round(totals.carbs * 10) / 10,
    totalFats: Math.round(totals.fats * 10) / 10,
    date
  };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};