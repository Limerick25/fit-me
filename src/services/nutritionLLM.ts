import {
  NutritionAnalysisRequest,
  NutritionAnalysisResponse,
  ParsedMeal,
  MealIngredient,
  UserProfile
} from '../types/conversation';

export class NutritionLLMService {
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    // In Phase 2, these would come from environment variables
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages'; // Claude API
    this.apiKey = 'demo-mode'; // Always use demo mode for now
  }

  async analyzeFood(request: NutritionAnalysisRequest): Promise<NutritionAnalysisResponse> {
    try {
      if (this.apiKey === 'demo-mode') {
        // For now, use sophisticated simulation until Claude API is integrated
        return await this.simulateAdvancedAnalysis(request);
      }

      // Real Claude API call would go here
      const response = await this.callClaudeAPI(request);
      return response;
    } catch (error) {
      console.error('LLM Analysis Error:', error);
      throw new Error('Failed to analyze food. Please try again.');
    }
  }

  private async callClaudeAPI(request: NutritionAnalysisRequest): Promise<NutritionAnalysisResponse> {
    const prompt = this.buildNutritionPrompt(request);

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseClaudeResponse(data.content[0].text, request);
  }

  private buildNutritionPrompt(request: NutritionAnalysisRequest): string {
    const { userInput, conversationHistory, userProfile, mealType } = request;

    return `You are Master Shredder, an expert nutrition assistant helping users track their food intake. You have deep knowledge of nutrition, cooking, brands, and food preparation.

USER PROFILE:
- Favorite brands: ${userProfile.preferences.favoriteBrands.join(', ') || 'None yet'}
- Common ingredients: ${userProfile.preferences.commonIngredients.join(', ') || 'None yet'}
- Allergies: ${userProfile.preferences.allergies.join(', ') || 'None'}
- Typical portions: ${JSON.stringify(userProfile.preferences.typicalPortionSizes)}
- Recent meals: ${userProfile.mealHistory.slice(-3).map(m => m.name).join(', ') || 'None yet'}

CONVERSATION HISTORY:
${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

CURRENT USER INPUT: "${userInput}"
MEAL TYPE: ${mealType}

TASK: Analyze this food description and respond conversationally. You should:

1. INTERPRET the food intelligently, inferring:
   - Likely cooking methods and ingredients not explicitly mentioned
   - Probable brands based on user history or common choices
   - Hidden ingredients (oils, seasonings, etc.)
   - Realistic portion sizes

2. PROVIDE a nutritional breakdown including:
   - Individual ingredients with amounts
   - Calories, protein, carbs, fats for each component
   - Total meal nutrition
   - Mark what was inferred vs. explicitly stated

3. RESPOND conversationally and ask clarifying questions if needed

4. LEARN from the interaction to update user preferences

Respond in this JSON format:
{
  "response": "Conversational response to user",
  "suggestedMeal": {
    "name": "Meal name",
    "description": "Detailed description",
    "ingredients": [
      {
        "name": "ingredient name",
        "amount": number,
        "unit": "unit",
        "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fats": 0},
        "brand": "brand if inferred",
        "preparation": "cooking method",
        "inferred": true/false
      }
    ],
    "totalNutrition": {"calories": 0, "protein": 0, "carbs": 0, "fats": 0},
    "confidence": 0.0-1.0,
    "inferredDetails": ["what was inferred"],
    "questions": ["clarifying questions if needed"]
  },
  "needsMoreInfo": true/false,
  "confidenceLevel": "high/medium/low",
  "followUpQuestions": ["questions"],
  "updatedProfile": {"preferences": {"newPreferences": "learned"}}
}`;
  }

  private async simulateAdvancedAnalysis(request: NutritionAnalysisRequest): Promise<NutritionAnalysisResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { userInput, userProfile, mealType } = request;
    const lowerInput = userInput.toLowerCase();

    // Sophisticated analysis based on input
    if (lowerInput.includes('chicken breast')) {
      return this.analyzeChickenMeal(userInput, userProfile, mealType);
    } else if (lowerInput.includes('salmon') || lowerInput.includes('fish')) {
      return this.analyzeSalmonMeal(userInput, userProfile, mealType);
    } else if (lowerInput.includes('egg')) {
      return this.analyzeEggMeal(userInput, userProfile, mealType);
    } else {
      return this.analyzeGenericMeal(userInput, userProfile, mealType);
    }
  }

  private analyzeChickenMeal(input: string, profile: UserProfile, mealType: string): NutritionAnalysisResponse {
    const lowerInput = input.toLowerCase();

    // Extract details
    const hasOil = lowerInput.includes('olive oil') || lowerInput.includes('oil');
    const hasRice = lowerInput.includes('rice');
    const size = lowerInput.includes('8 ounce') ? 8 : 6; // default 6oz

    const ingredients: MealIngredient[] = [
      {
        name: 'Chicken Breast (boneless, skinless)',
        amount: size,
        unit: 'oz',
        nutrition: { calories: size * 35, protein: size * 6.5, carbs: 0, fats: size * 1 },
        brand: profile.preferences.favoriteBrands.includes('Perdue') ? 'Perdue' : 'Generic',
        preparation: 'Grilled',
        inferred: false
      }
    ];

    if (hasOil) {
      ingredients.push({
        name: 'Olive Oil',
        amount: 1,
        unit: 'tbsp',
        nutrition: { calories: 120, protein: 0, carbs: 0, fats: 14 },
        preparation: 'For cooking',
        inferred: false
      });
    } else {
      // Infer cooking fat
      ingredients.push({
        name: 'Cooking Spray or Oil',
        amount: 0.5,
        unit: 'tsp',
        nutrition: { calories: 20, protein: 0, carbs: 0, fats: 2 },
        preparation: 'For cooking',
        inferred: true
      });
    }

    if (hasRice) {
      const riceAmount = lowerInput.includes('2 cup') ? 2 : 1;
      ingredients.push({
        name: 'Brown Rice (cooked)',
        amount: riceAmount,
        unit: 'cup',
        nutrition: { calories: riceAmount * 220, protein: riceAmount * 5, carbs: riceAmount * 45, fats: riceAmount * 2 },
        inferred: false
      });
    }

    // Add likely seasonings
    ingredients.push({
      name: 'Salt & Pepper',
      amount: 1,
      unit: 'pinch',
      nutrition: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      inferred: true
    });

    const totalNutrition = ingredients.reduce((total, ing) => ({
      calories: total.calories + ing.nutrition.calories,
      protein: total.protein + ing.nutrition.protein,
      carbs: total.carbs + ing.nutrition.carbs,
      fats: total.fats + ing.nutrition.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const suggestedMeal: ParsedMeal = {
      id: Date.now().toString(),
      name: `Grilled Chicken Breast ${hasRice ? 'with Brown Rice' : ''}`,
      description: `${size}oz grilled chicken breast${hasRice ? ' served with brown rice' : ''}`,
      ingredients,
      totalNutrition,
      confidence: 0.85,
      inferredDetails: [
        'Added cooking oil/spray for preparation',
        'Assumed grilled cooking method',
        'Added basic seasonings (salt & pepper)'
      ],
      questions: hasRice ? [] : ['Would you like to add any sides like rice, vegetables, or salad?']
    };

    return {
      response: `Got it! I see you had a ${size}oz chicken breast${hasRice ? ' with brown rice' : ''}. I've estimated the nutrition including likely cooking oil and seasonings. ${hasRice ? 'Nice balanced meal with protein and carbs!' : 'Great lean protein choice!'} Does this breakdown look accurate to you?`,
      suggestedMeal,
      needsMoreInfo: !hasRice,
      confidenceLevel: 'high',
      followUpQuestions: hasRice ? [] : ['Any sides with that chicken?'],
      updatedProfile: {
        preferences: {
          ...profile.preferences,
          commonIngredients: [...new Set([...profile.preferences.commonIngredients, 'chicken breast'])]
        }
      }
    };
  }

  private analyzeSalmonMeal(input: string, profile: UserProfile, mealType: string): NutritionAnalysisResponse {
    const suggestedMeal: ParsedMeal = {
      id: Date.now().toString(),
      name: 'Grilled Salmon',
      description: 'Grilled salmon fillet with seasonings',
      ingredients: [
        {
          name: 'Salmon Fillet',
          amount: 6,
          unit: 'oz',
          nutrition: { calories: 350, protein: 40, carbs: 0, fats: 20 },
          preparation: 'Grilled',
          inferred: false
        },
        {
          name: 'Olive Oil',
          amount: 1,
          unit: 'tsp',
          nutrition: { calories: 40, protein: 0, carbs: 0, fats: 4.5 },
          preparation: 'For cooking',
          inferred: true
        }
      ],
      totalNutrition: { calories: 390, protein: 40, carbs: 0, fats: 24.5 },
      confidence: 0.8,
      inferredDetails: ['Added cooking oil', 'Assumed standard 6oz portion'],
      questions: ['What did you have as sides with the salmon?']
    };

    return {
      response: "Excellent choice with the salmon! I'm estimating a 6oz fillet with a little oil for cooking. That's about 390 calories with fantastic omega-3s. What did you have alongside it?",
      suggestedMeal,
      needsMoreInfo: true,
      confidenceLevel: 'medium',
      followUpQuestions: ['Any vegetables or starches with the salmon?']
    };
  }

  private analyzeEggMeal(input: string, profile: UserProfile, mealType: string): NutritionAnalysisResponse {
    const eggCount = this.extractNumber(input, 'egg') || 2;

    const suggestedMeal: ParsedMeal = {
      id: Date.now().toString(),
      name: `${eggCount} Scrambled Eggs`,
      description: `${eggCount} large eggs, scrambled`,
      ingredients: [
        {
          name: 'Large Eggs',
          amount: eggCount,
          unit: 'piece',
          nutrition: { calories: eggCount * 70, protein: eggCount * 6, carbs: eggCount * 1, fats: eggCount * 5 },
          inferred: false
        },
        {
          name: 'Butter',
          amount: 1,
          unit: 'tsp',
          nutrition: { calories: 34, protein: 0, carbs: 0, fats: 4 },
          preparation: 'For cooking',
          inferred: true
        }
      ],
      totalNutrition: { calories: eggCount * 70 + 34, protein: eggCount * 6, carbs: eggCount, fats: eggCount * 5 + 4 },
      confidence: 0.9,
      inferredDetails: ['Added butter for cooking'],
      questions: mealType === 'breakfast' ? ['Any toast, fruit, or other sides?'] : []
    };

    return {
      response: `Perfect! ${eggCount} eggs are a great protein source. I've included a bit of butter for cooking. ${mealType === 'breakfast' ? 'What else did you have for breakfast?' : 'Anything else with those eggs?'}`,
      suggestedMeal,
      needsMoreInfo: mealType === 'breakfast',
      confidenceLevel: 'high',
      followUpQuestions: mealType === 'breakfast' ? ['Toast? Fruit? Coffee?'] : []
    };
  }

  private analyzeGenericMeal(input: string, profile: UserProfile, mealType: string): NutritionAnalysisResponse {
    return {
      response: "I'd love to help you track that! Can you tell me a bit more about what you ate? For example, what type of protein, any grains or vegetables, and roughly how much?",
      needsMoreInfo: true,
      confidenceLevel: 'low',
      followUpQuestions: [
        'What was the main protein?',
        'Any grains, rice, or bread?',
        'What vegetables did you have?',
        'How was it prepared?'
      ]
    };
  }

  private extractNumber(text: string, keyword: string): number | null {
    const regex = new RegExp(`(\\d+)\\s*${keyword}`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : null;
  }

  private parseClaudeResponse(response: string, request: NutritionAnalysisRequest): NutritionAnalysisResponse {
    try {
      // Parse JSON response from Claude
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        response: response,
        needsMoreInfo: true,
        confidenceLevel: 'low'
      };
    }
  }
}