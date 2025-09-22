interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

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

export class ClaudeNutritionService {
  private apiKey: string;
  private apiUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    try {
      this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
      console.log('Claude API key loaded:', this.apiKey ? 'API key found' : 'No API key');
      if (!this.apiKey || this.apiKey === 'your_claude_api_key_here') {
        console.warn('Claude API key not configured. Please set REACT_APP_CLAUDE_API_KEY in .env.local');
      }
    } catch (error) {
      console.error('Error initializing Claude service:', error);
      this.apiKey = '';
    }
  }

  async analyzeFood(
    userInput: string,
    conversationHistory: any[] = [],
    userProfile: any = {}
  ): Promise<NutritionAnalysis> {

    if (!this.apiKey || this.apiKey === 'your_claude_api_key_here') {
      throw new Error('Please configure your Claude API key in .env.local file');
    }

    const prompt = this.buildNutritionPrompt(userInput, conversationHistory, userProfile);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API Error:', response.status, errorText);
        throw new Error(`Claude API Error: ${response.status} - ${errorText}`);
      }

      const data: ClaudeResponse = await response.json();
      const content = data.content[0]?.text || '';

      return this.parseClaudeResponse(content);

    } catch (error) {
      console.error('Error calling Claude API:', error);

      // Fallback to simulated response if API fails
      return this.getFallbackResponse(userInput);
    }
  }

  private buildNutritionPrompt(userInput: string, conversationHistory: any[], userProfile: any): string {
    const recentHistory = conversationHistory.slice(-4).map(msg =>
      `${msg.role}: ${msg.content}`
    ).join('\n');

    return `You are Master Shredder, an expert nutrition assistant. You have deep knowledge of nutrition, brands, cooking methods, and food preparation. You help users track their food intake with intelligent, specific analysis.

USER PROFILE:
- Favorite brands: ${userProfile.favoriteBrands?.join(', ') || 'Unknown'}
- Recent meals: ${userProfile.recentMeals?.slice(-3).map((m: any) => m.name).join(', ') || 'None'}
- Dietary preferences: ${userProfile.dietaryPreferences?.join(', ') || 'None specified'}

CONVERSATION HISTORY:
${recentHistory}

CURRENT USER INPUT: "${userInput}"

TASK: Analyze this food description with expert nutrition knowledge. Make intelligent, specific assumptions about:
- Exact portion sizes (with weights/measurements)
- Specific brands (especially popular ones like Chobani, Dannon, etc.)
- Cooking methods and hidden ingredients (oils, seasonings, etc.)
- Preparation details that affect nutrition

Respond in this EXACT JSON format (no markdown, just JSON):
{
  "response": "Conversational response explaining your analysis",
  "meal": {
    "name": "Specific meal name",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number,
    "confidence": 0.0-1.0,
    "assumptions": [
      "Specific assumption with brand/quantity (e.g., 'Assuming 1 cup (227g) Chobani Plain Nonfat Greek Yogurt')",
      "Another specific assumption with reasoning",
      "Include cooking oils, seasonings, preparation methods",
      "Reference data sources (USDA, brand nutrition facts)"
    ],
    "ingredients": [
      {
        "name": "Specific ingredient name",
        "amount": number,
        "unit": "cup/oz/grams/etc",
        "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fats": 0},
        "inferred": false
      }
    ]
  }
}

Make your assumptions HIGHLY SPECIFIC and ACTIONABLE. Instead of "average portion" say "1 cup (227g)". Instead of "cooking oil" say "1 tsp olive oil". Be the nutrition expert users need!`;
  }

  private parseClaudeResponse(content: string): NutritionAnalysis {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      // If no JSON found, create a response from the text
      return {
        response: content,
        meal: undefined
      };
    } catch (error) {
      console.error('Error parsing Claude response:', error);
      return {
        response: content,
        meal: undefined
      };
    }
  }

  private getFallbackResponse(userInput: string): NutritionAnalysis {
    return {
      response: `I'd love to analyze "${userInput}" for you, but I need to connect to my nutrition database. Please make sure your Claude API key is configured in the .env.local file.`,
      meal: undefined
    };
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey !== 'your_claude_api_key_here');
  }
}