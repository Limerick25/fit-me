/**
 * Vercel Serverless Function for Claude API
 *
 * This function proxies requests to Claude API to solve CORS issues
 * and keeps the API key secure on the server side.
 */

export default async function handler(req, res) {
  // Enable CORS for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Get Claude API key from environment variables
    // Note: Vercel uses both VITE_ prefixed and non-prefixed vars
    const apiKey = process.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
    // Hardcode the working model for now
    const model = 'claude-sonnet-4-20250514';

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      model: model,
      rawModel: process.env.VITE_CLAUDE_MODEL,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('CLAUDE')),
      apiKeyLength: apiKey?.length,
      apiKeyPrefix: apiKey?.substring(0, 10) + '...'
    });

    if (!apiKey) {
      return res.status(500).json({
        error: 'Claude API key not configured',
        details: 'Please set VITE_CLAUDE_API_KEY in Vercel environment variables'
      });
    }

    // Extract request data
    const { userInput, conversationHistory = [], userProfile = {} } = req.body;

    if (!userInput) {
      return res.status(400).json({
        error: 'Missing required field: userInput',
        details: 'Please provide userInput in the request body'
      });
    }

    // Build the nutrition analysis prompt
    const prompt = buildNutritionPrompt(userInput, conversationHistory, userProfile);

    // Log the exact request being made
    const requestBody = {
      model: model,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    };

    console.log('Claude API request:', {
      url: 'https://api.anthropic.com/v1/messages',
      model: model,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      requestBodyModel: requestBody.model
    });

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API Error:', {
        status: claudeResponse.status,
        model: model,
        apiKey: apiKey ? 'present' : 'missing',
        errorText: errorText
      });
      return res.status(claudeResponse.status).json({
        error: 'Claude API Error',
        details: errorText,
        status: claudeResponse.status,
        modelUsed: model
      });
    }

    const data = await claudeResponse.json();
    const content = data.content[0]?.text || '';

    // Parse Claude's response
    const analysis = parseClaudeResponse(content);

    // Return successful response
    res.status(200).json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

function buildNutritionPrompt(userInput, conversationHistory, userProfile) {
  const recentHistory = conversationHistory.slice(-4).map(msg =>
    `${msg.role}: ${msg.content}`
  ).join('\n');

  return `You are Master Shredder, an expert nutrition assistant. You have deep knowledge of nutrition, brands, cooking methods, and food preparation. You help users track their food intake with intelligent, specific analysis.

USER PROFILE:
- Favorite brands: ${userProfile.favoriteBrands?.join(', ') || 'Unknown'}
- Recent meals: ${userProfile.recentMeals?.slice(-3).map(m => m.name).join(', ') || 'None'}
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
      "Include cooking oils, seasonings, preparation methods"
    ],
    "sources": [
      {
        "name": "USDA FoodData Central",
        "description": "Nutritional data for plain nonfat Greek yogurt",
        "url": "https://fdc.nal.usda.gov/fdc-app.html#/food-details/171265/nutrients",
        "note": "Based on training data knowledge - not real-time lookup"
      },
      {
        "name": "Chobani Nutrition Facts",
        "description": "Brand-specific nutrition information",
        "url": "https://www.chobani.com/products/",
        "note": "Based on training data knowledge - not real-time lookup"
      }
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

function parseClaudeResponse(content) {
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