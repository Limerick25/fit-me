#!/usr/bin/env node

/**
 * Test if claude-sonnet-4-20250514 works with our API key
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
const model = 'claude-sonnet-4-20250514';

console.log('🧪 Testing Sonnet 4 model:', model);

async function testSonnet4() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
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
      return false;
    }

    const data = await response.json();
    console.log('✅ SUCCESS with Sonnet 4:', data.content[0]?.text);
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testSonnet4().then(success => {
  if (success) {
    console.log('\n🎉 Sonnet 4 works! Ready to upgrade.');
  } else {
    console.log('\n❌ Sonnet 4 not available with this API key.');
  }
});