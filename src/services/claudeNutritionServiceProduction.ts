interface NutritionAnalysis {
  response: string;
  meal?: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    confidence: number;
    assumptions: string[];
    ingredients: Array<{
      name: string;
      amount: number;
      unit: string;
      nutrition: { calories: number; protein: number; carbs: number; fats: number };
      inferred: boolean;
    }>;
  };
}

export class ClaudeNutritionServiceProduction {
  private apiUrl: string;

  constructor() {
    // Use production API endpoint or local for development
    this.apiUrl = import.meta.env.PROD
      ? '/api/analyze-food'  // Production: use Vercel serverless function
      : '/api/analyze-food'; // Development: same endpoint (will proxy through Vite)
  }

  async analyzeFood(
    userInput: string,
    conversationHistory: any[] = [],
    userProfile: any = {}
  ): Promise<NutritionAnalysis> {

    if (!userInput?.trim()) {
      throw new Error('Please provide a food description to analyze');
    }

    try {
      console.log('🌐 Calling production API:', this.apiUrl);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput.trim(),
          conversationHistory: conversationHistory.slice(-4), // Limit history
          userProfile: userProfile
        })
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', response.status, errorData);

        // In development, if API not available, provide mock response
        if (response.status === 404 && !import.meta.env.PROD) {
          console.log('🔧 Using mock response for development');
          return this.generateMockResponse(userInput);
        }

        throw new Error(
          errorData.details ||
          errorData.error ||
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('✅ API Response received:', data.success);

      if (!data.success) {
        throw new Error(data.error || 'API call was not successful');
      }

      return data.analysis;

    } catch (error) {
      console.error('❌ Claude API Error:', error);

      // Provide helpful fallback response
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          response: `I'd love to analyze "${userInput}" for you, but I'm having trouble connecting to the nutrition analysis service. Please check your internet connection and try again.`,
          meal: undefined
        };
      }

      return {
        response: `Sorry, I encountered an error while analyzing "${userInput}": ${error.message}. Please try again or contact support if this continues.`,
        meal: undefined
      };
    }
  }

  isConfigured(): boolean {
    // In production, we assume the backend is properly configured
    // The API endpoint will return appropriate errors if not
    return true;
  }

  private generateMockResponse(userInput: string): NutritionAnalysis {
    // Generate realistic mock data based on common foods
    const mockData = this.getMockDataForFood(userInput.toLowerCase());

    return {
      response: `I analyzed your "${userInput}" - here's my nutritional breakdown. This is a mock response for development since the Claude API isn't available locally.`,
      meal: {
        name: userInput,
        calories: mockData.calories,
        protein: mockData.protein,
        carbs: mockData.carbs,
        fats: mockData.fats,
        confidence: 0.85,
        assumptions: [
          `Estimated ${mockData.portion} portion size`,
          `Standard cooking method assumed`,
          `No additional oils or seasonings estimated`
        ],
        ingredients: [
          {
            name: userInput,
            amount: 1,
            unit: 'serving',
            nutrition: {
              calories: mockData.calories,
              protein: mockData.protein,
              carbs: mockData.carbs,
              fats: mockData.fats
            },
            inferred: true
          }
        ]
      }
    };
  }

  private getMockDataForFood(food: string): { calories: number; protein: number; carbs: number; fats: number; portion: string } {
    // Simple keyword matching for common foods
    if (food.includes('chicken') || food.includes('grilled chicken')) {
      return { calories: 380, protein: 42, carbs: 35, fats: 8, portion: '4oz chicken + 1 cup rice' };
    }
    if (food.includes('rice')) {
      return { calories: 320, protein: 28, carbs: 45, fats: 6, portion: '1 cup cooked rice + protein' };
    }
    if (food.includes('salad')) {
      return { calories: 150, protein: 8, carbs: 12, fats: 9, portion: 'medium bowl' };
    }
    if (food.includes('egg')) {
      return { calories: 280, protein: 20, carbs: 2, fats: 22, portion: '2 large eggs' };
    }
    // Default for any unrecognized food
    return { calories: 250, protein: 15, carbs: 30, fats: 8, portion: 'medium' };
  }
}