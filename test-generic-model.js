#!/usr/bin/env node

/**
 * Test generic Claude model name
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

console.log('🧪 Testing generic model name: claude-3-haiku');

async function testGenericModel() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Analyze this food: "greek yogurt". Respond with just calories.'
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
    console.log('✅ Success with claude-3-haiku:', data.content[0]?.text);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGenericModel();