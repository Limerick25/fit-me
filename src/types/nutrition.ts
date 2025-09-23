export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
  saturatedFat?: number;
  cholesterol?: number;
  potassium?: number;
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  vitaminA?: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
  saturatedFat?: number;
  cholesterol?: number;
  potassium?: number;
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  vitaminA?: number;
  quantity?: number;
  unit?: string;
  timestamp?: string;
  assumptions?: string[];
  sources?: Array<{ name: string; url?: string; note?: string }>;
  confidence?: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface DailyMeals {
  breakfast: FoodEntry[];
  lunch: FoodEntry[];
  dinner: FoodEntry[];
  snacks: FoodEntry[];
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
  saturatedFat?: number;
  cholesterol?: number;
  potassium?: number;
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  vitaminA?: number;
}