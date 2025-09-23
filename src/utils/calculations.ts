import { DailyMeals, DailyNutrition, FoodEntry } from '../types/nutrition';

export const calculateDailyNutrition = (meals: DailyMeals): DailyNutrition => {
  const allEntries = [
    ...meals.breakfast,
    ...meals.lunch,
    ...meals.dinner,
    ...meals.snacks
  ];

  return allEntries.reduce(
    (totals, entry) => ({
      calories: totals.calories + (entry.calories || 0),
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fats: totals.fats + (entry.fats || 0),
      fiber: totals.fiber + (entry.fiber || 0),
      sodium: totals.sodium + (entry.sodium || 0),
      sugar: totals.sugar + (entry.sugar || 0),
      saturatedFat: totals.saturatedFat + (entry.saturatedFat || 0),
      cholesterol: totals.cholesterol + (entry.cholesterol || 0),
      potassium: totals.potassium + (entry.potassium || 0),
      vitaminC: totals.vitaminC + (entry.vitaminC || 0),
      iron: totals.iron + (entry.iron || 0),
      calcium: totals.calcium + (entry.calcium || 0),
      vitaminA: totals.vitaminA + (entry.vitaminA || 0)
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sodium: 0,
      sugar: 0,
      saturatedFat: 0,
      cholesterol: 0,
      potassium: 0,
      vitaminC: 0,
      iron: 0,
      calcium: 0,
      vitaminA: 0
    }
  );
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};