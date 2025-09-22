#!/usr/bin/env node

/**
 * Test the exact same API call structure as the Vercel function
 */

import fs from 'fs';

// Load environment variables
const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

const apiKey = envVars.VITE_CLAUDE_API_KEY;
const model = 'claude-3-haiku-20240307';

console.log('🧪 Testing exact API call structure as Vercel function');
console.log('Model:', model);
console.log('API Key present:', !!apiKey);

// Build the exact same prompt as the Vercel function
function buildNutritionPrompt(userInput, conversationHistory = [], userProfile = {}) {
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

async function testExactCall() {
  try {
    const userInput = "greek yogurt";
    const prompt = buildNutritionPrompt(userInput);

    console.log('\n📤 Making API call...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    console.log(`📊 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      return;
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';

    console.log('✅ Success! Response received:');
    console.log('Content length:', content.length);
    console.log('First 200 chars:', content.substring(0, 200));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testExactCall();