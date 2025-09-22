import { UserProfile, ConversationMessage, ParsedMeal } from '../types/conversation';

export class UserMemoryService {
  private storageKey = 'master-shredder-user-profile';

  getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          conversationHistory: parsed.conversationHistory?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) || [],
          mealHistory: parsed.mealHistory?.map((meal: any) => ({
            ...meal,
            timestamp: new Date(meal.timestamp)
          })) || []
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }

    return this.createDefaultProfile();
  }

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  addConversationMessage(message: ConversationMessage): void {
    const profile = this.getUserProfile();
    profile.conversationHistory.push(message);

    // Keep only last 50 messages to prevent storage bloat
    if (profile.conversationHistory.length > 50) {
      profile.conversationHistory = profile.conversationHistory.slice(-50);
    }

    profile.lastUpdated = new Date();
    this.saveUserProfile(profile);
  }

  addMealToHistory(meal: ParsedMeal): void {
    const profile = this.getUserProfile();
    profile.mealHistory.push(meal);

    // Keep only last 100 meals
    if (profile.mealHistory.length > 100) {
      profile.mealHistory = profile.mealHistory.slice(-100);
    }

    profile.lastUpdated = new Date();
    this.saveUserProfile(profile);
  }

  updatePreferences(updates: Partial<UserProfile['preferences']>): void {
    const profile = this.getUserProfile();
    profile.preferences = { ...profile.preferences, ...updates };
    profile.lastUpdated = new Date();
    this.saveUserProfile(profile);
  }

  learnFromMeal(meal: ParsedMeal): void {
    const profile = this.getUserProfile();
    const preferences = profile.preferences;

    // Learn favorite brands
    meal.ingredients.forEach(ingredient => {
      if (ingredient.brand && !preferences.favoriteBrands.includes(ingredient.brand)) {
        preferences.favoriteBrands.push(ingredient.brand);
      }
    });

    // Learn common ingredients
    meal.ingredients.forEach(ingredient => {
      const baseIngredient = ingredient.name.split('(')[0].trim(); // Remove parentheses details
      if (!preferences.commonIngredients.includes(baseIngredient)) {
        preferences.commonIngredients.push(baseIngredient);
      }
    });

    // Learn typical portion sizes
    meal.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      const portion = `${ingredient.amount} ${ingredient.unit}`;

      // If we've seen this ingredient before, check if portion is consistent
      if (!preferences.typicalPortionSizes[key]) {
        preferences.typicalPortionSizes[key] = portion;
      }
    });

    // Learn cooking methods
    meal.ingredients.forEach(ingredient => {
      if (ingredient.preparation && !preferences.cookingMethods.includes(ingredient.preparation)) {
        preferences.cookingMethods.push(ingredient.preparation);
      }
    });

    this.updatePreferences(preferences);
  }

  getRecentConversation(limit: number = 10): ConversationMessage[] {
    const profile = this.getUserProfile();
    return profile.conversationHistory.slice(-limit);
  }

  getRecentMeals(limit: number = 10): ParsedMeal[] {
    const profile = this.getUserProfile();
    return profile.mealHistory.slice(-limit);
  }

  getFavoriteIngredients(limit: number = 10): string[] {
    const profile = this.getUserProfile();
    const ingredientCount: Record<string, number> = {};

    // Count ingredient frequency
    profile.mealHistory.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        const name = ingredient.name.split('(')[0].trim();
        ingredientCount[name] = (ingredientCount[name] || 0) + 1;
      });
    });

    // Sort by frequency and return top items
    return Object.entries(ingredientCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name]) => name);
  }

  getMealPatterns(): {
    commonBreakfasts: string[];
    commonLunches: string[];
    commonDinners: string[];
    averageCalories: number;
    averageProtein: number;
  } {
    const profile = this.getUserProfile();
    const breakfasts: string[] = [];
    const lunches: string[] = [];
    const dinners: string[] = [];
    let totalCalories = 0;
    let totalProtein = 0;

    profile.mealHistory.forEach(meal => {
      // This would need to be enhanced to track meal timing
      // For now, categorize by keywords
      const name = meal.name.toLowerCase();
      if (name.includes('breakfast') || name.includes('egg') || name.includes('oatmeal')) {
        breakfasts.push(meal.name);
      } else if (name.includes('lunch') || name.includes('salad') || name.includes('sandwich')) {
        lunches.push(meal.name);
      } else {
        dinners.push(meal.name);
      }

      totalCalories += meal.totalNutrition.calories;
      totalProtein += meal.totalNutrition.protein;
    });

    return {
      commonBreakfasts: [...new Set(breakfasts)].slice(0, 5),
      commonLunches: [...new Set(lunches)].slice(0, 5),
      commonDinners: [...new Set(dinners)].slice(0, 5),
      averageCalories: profile.mealHistory.length > 0 ? Math.round(totalCalories / profile.mealHistory.length) : 0,
      averageProtein: profile.mealHistory.length > 0 ? Math.round(totalProtein / profile.mealHistory.length) : 0
    };
  }

  clearHistory(): void {
    const profile = this.createDefaultProfile();
    this.saveUserProfile(profile);
  }

  private createDefaultProfile(): UserProfile {
    return {
      preferences: {
        favoriteBrands: [],
        commonIngredients: [],
        allergies: [],
        dietaryRestrictions: [],
        typicalPortionSizes: {},
        cookingMethods: []
      },
      mealHistory: [],
      conversationHistory: [],
      lastUpdated: new Date()
    };
  }

  exportProfile(): string {
    const profile = this.getUserProfile();
    return JSON.stringify(profile, null, 2);
  }

  importProfile(profileJson: string): void {
    try {
      const profile = JSON.parse(profileJson);
      this.saveUserProfile(profile);
    } catch (error) {
      throw new Error('Invalid profile format');
    }
  }
}