export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestedMeal?: ParsedMeal;
    confidence?: number;
    needsMoreInfo?: string[];
  };
}

export interface ParsedMeal {
  id: string;
  name: string;
  description?: string;
  ingredients?: MealIngredient[];
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
  confidence?: number;
  assumptions?: string[];
  sources?: Array<{ name: string; url?: string; note?: string }>;
  questions?: string[];
}

export interface MealIngredient {
  name: string;
  amount: number;
  unit: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  brand?: string;
  preparation?: string;
  inferred: boolean; // true if LLM inferred this ingredient
}

export interface UserProfile {
  preferences: {
    favoriteBrands: string[];
    commonIngredients: string[];
    allergies: string[];
    dietaryRestrictions: string[];
    typicalPortionSizes: Record<string, string>;
    cookingMethods: string[];
  };
  mealHistory: ParsedMeal[];
  conversationHistory: ConversationMessage[];
  lastUpdated: Date;
}

export interface NutritionAnalysisRequest {
  userInput: string;
  conversationHistory: ConversationMessage[];
  userProfile: UserProfile;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

export interface NutritionAnalysisResponse {
  response: string;
  suggestedMeal?: ParsedMeal;
  needsMoreInfo: boolean;
  confidenceLevel: 'high' | 'medium' | 'low';
  followUpQuestions?: string[];
  updatedProfile?: Partial<UserProfile>;
}