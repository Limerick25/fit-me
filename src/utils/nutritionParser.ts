import { FoodEntry, NutritionInfo } from '../types/nutrition';
import { generateId } from './calculations';

export interface ParsedFoodData {
  name: string;
  quantity: number;
  unit: string;
  nutrition: NutritionInfo;
}

// This function simulates calling an LLM API to parse natural language food descriptions
export const parseNaturalLanguageFood = async (description: string): Promise<ParsedFoodData[]> => {
  // For now, we'll use a local LLM-like parsing approach
  // In Phase 2, this would connect to Claude API or nutrition MCP server

  const prompt = `
Parse the following food description into structured nutrition data. Return a JSON array with each food item containing:
- name: descriptive name of the food
- quantity: estimated amount
- unit: appropriate unit (serving, cup, oz, grams, etc.)
- nutrition: object with calories, protein, carbs, fats (all numbers)

Food description: "${description}"

Example format:
[{
  "name": "Grilled chicken breast",
  "quantity": 1,
  "unit": "serving",
  "nutrition": {
    "calories": 250,
    "protein": 25,
    "carbs": 0,
    "fats": 5
  }
}]

Return only valid JSON:`;

  try {
    // Simulate LLM processing with built-in nutrition database
    const parsed = await simulateNutritionParsing(description);
    return parsed;
  } catch (error) {
    console.error('Error parsing food description:', error);
    throw new Error('Failed to parse food description. Please try manual entry.');
  }
};

// Simulated nutrition parsing (replace with actual LLM call in Phase 2)
const simulateNutritionParsing = async (description: string): Promise<ParsedFoodData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerDesc = description.toLowerCase();

  // Basic pattern matching for common foods (this would be replaced by LLM)
  const nutritionDatabase: Record<string, ParsedFoodData> = {
    'chicken breast': {
      name: 'Grilled Chicken Breast',
      quantity: 1,
      unit: 'serving',
      nutrition: { calories: 250, protein: 25, carbs: 0, fats: 5 }
    },
    'brown rice': {
      name: 'Brown Rice',
      quantity: 0.5,
      unit: 'cup',
      nutrition: { calories: 110, protein: 3, carbs: 22, fats: 1 }
    },
    'salmon': {
      name: 'Grilled Salmon',
      quantity: 1,
      unit: 'serving',
      nutrition: { calories: 300, protein: 28, carbs: 0, fats: 18 }
    },
    'broccoli': {
      name: 'Steamed Broccoli',
      quantity: 1,
      unit: 'cup',
      nutrition: { calories: 25, protein: 3, carbs: 5, fats: 0 }
    },
    'egg': {
      name: 'Large Egg',
      quantity: 1,
      unit: 'piece',
      nutrition: { calories: 70, protein: 6, carbs: 1, fats: 5 }
    },
    'banana': {
      name: 'Medium Banana',
      quantity: 1,
      unit: 'piece',
      nutrition: { calories: 105, protein: 1, carbs: 27, fats: 0 }
    },
    'oatmeal': {
      name: 'Oatmeal',
      quantity: 1,
      unit: 'cup',
      nutrition: { calories: 150, protein: 5, carbs: 27, fats: 3 }
    },
    'greek yogurt': {
      name: 'Greek Yogurt',
      quantity: 1,
      unit: 'cup',
      nutrition: { calories: 130, protein: 20, carbs: 9, fats: 0 }
    },
    'avocado': {
      name: 'Medium Avocado',
      quantity: 0.5,
      unit: 'piece',
      nutrition: { calories: 160, protein: 2, carbs: 9, fats: 15 }
    },
    'apple': {
      name: 'Medium Apple',
      quantity: 1,
      unit: 'piece',
      nutrition: { calories: 80, protein: 0, carbs: 21, fats: 0 }
    }
  };

  // Find matching foods in the description
  const foundFoods: ParsedFoodData[] = [];

  for (const [key, foodData] of Object.entries(nutritionDatabase)) {
    if (lowerDesc.includes(key)) {
      // Check for quantity modifiers
      let adjustedData = { ...foodData };

      // Look for quantity hints
      if (lowerDesc.includes('large') || lowerDesc.includes('big')) {
        adjustedData.nutrition = multiplyNutrition(adjustedData.nutrition, 1.3);
        adjustedData.name = `Large ${adjustedData.name}`;
      } else if (lowerDesc.includes('small') || lowerDesc.includes('little')) {
        adjustedData.nutrition = multiplyNutrition(adjustedData.nutrition, 0.7);
        adjustedData.name = `Small ${adjustedData.name}`;
      }

      foundFoods.push(adjustedData);
    }
  }

  // If no specific foods found, create a generic entry
  if (foundFoods.length === 0) {
    foundFoods.push({
      name: description.charAt(0).toUpperCase() + description.slice(1),
      quantity: 1,
      unit: 'serving',
      nutrition: { calories: 200, protein: 10, carbs: 20, fats: 8 }
    });
  }

  return foundFoods;
};

const multiplyNutrition = (nutrition: NutritionInfo, multiplier: number): NutritionInfo => ({
  calories: Math.round(nutrition.calories * multiplier),
  protein: Math.round(nutrition.protein * multiplier * 10) / 10,
  carbs: Math.round(nutrition.carbs * multiplier * 10) / 10,
  fats: Math.round(nutrition.fats * multiplier * 10) / 10
});

export const createFoodEntryFromParsed = (parsedData: ParsedFoodData): FoodEntry => ({
  id: generateId(),
  name: parsedData.name,
  quantity: parsedData.quantity,
  unit: parsedData.unit,
  nutrition: parsedData.nutrition,
  timestamp: new Date()
});