import { DailyMeals, FoodEntry } from '../types/nutrition';

const STORAGE_KEY = 'fit-me-data';

export const getStoredMeals = (date: string): DailyMeals => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}-${date}`);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        breakfast: parsed.breakfast.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })),
        lunch: parsed.lunch.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })),
        dinner: parsed.dinner.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })),
        snacks: parsed.snacks.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      };
    }
  } catch (error) {
    console.error('Error loading meals from storage:', error);
  }

  return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  };
};

export const storeMeals = (date: string, meals: DailyMeals): void => {
  try {
    localStorage.setItem(`${STORAGE_KEY}-${date}`, JSON.stringify(meals));
  } catch (error) {
    console.error('Error saving meals to storage:', error);
  }
};

export const addFoodEntry = (date: string, mealType: keyof DailyMeals, entry: FoodEntry): void => {
  const meals = getStoredMeals(date);
  meals[mealType].push(entry);
  storeMeals(date, meals);
};

export const removeFoodEntry = (date: string, mealType: keyof DailyMeals, entryId: string): void => {
  const meals = getStoredMeals(date);
  meals[mealType] = meals[mealType].filter(entry => entry.id !== entryId);
  storeMeals(date, meals);
};

export const updateFoodEntry = (date: string, mealType: keyof DailyMeals, entryId: string, updatedEntry: Partial<FoodEntry>): void => {
  const meals = getStoredMeals(date);
  const entryIndex = meals[mealType].findIndex(entry => entry.id === entryId);
  if (entryIndex !== -1) {
    meals[mealType][entryIndex] = { ...meals[mealType][entryIndex], ...updatedEntry };
    storeMeals(date, meals);
  }
};

// Helper functions that return updated meals (for App.tsx compatibility)
export const removeFoodEntryAndGetMeals = (meals: DailyMeals, entryId: string, date: string): DailyMeals => {
  // Find which meal type contains this entry and remove it
  const updatedMeals = { ...meals };
  for (const mealType of ['breakfast', 'lunch', 'dinner', 'snacks'] as (keyof DailyMeals)[]) {
    updatedMeals[mealType] = meals[mealType].filter(entry => entry.id !== entryId);
  }
  storeMeals(date, updatedMeals);
  return updatedMeals;
};

export const updateFoodEntryAndGetMeals = (meals: DailyMeals, updatedEntry: FoodEntry, date: string): DailyMeals => {
  const updatedMeals = { ...meals };
  // Find which meal type contains this entry and update it
  for (const mealType of ['breakfast', 'lunch', 'dinner', 'snacks'] as (keyof DailyMeals)[]) {
    const entryIndex = meals[mealType].findIndex(entry => entry.id === updatedEntry.id);
    if (entryIndex !== -1) {
      updatedMeals[mealType][entryIndex] = updatedEntry;
      break;
    }
  }
  storeMeals(date, updatedMeals);
  return updatedMeals;
};