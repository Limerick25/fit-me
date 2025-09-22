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
}