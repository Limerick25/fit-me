#!/usr/bin/env node

/**
 * Test Claude API connection directly
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
const model = envVars.VITE_CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

console.log('🧪 Testing Claude API connection...');
console.log(`📋 API Key: ${apiKey ? apiKey.substring(0, 20) + '...' : 'NOT FOUND'}`);
console.log(`🤖 Model: ${model}`);

async function testClaudeAPI() {
  try {
    console.log('\n📡 Making API request to Claude...');

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
          content: 'Hello! Just testing the API connection. Please respond with "API working!"'
        }]
      })
    });

    console.log(`📊 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));

    if (data.content && data.content[0]) {
      console.log('🎉 Claude says:', data.content[0].text);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.message.includes('not_found_error')) {
      console.log('\n💡 Suggestion: The model might not exist. Try these models:');
      console.log('  - claude-3-5-sonnet-20241022');
      console.log('  - claude-3-opus-20240229');
      console.log('  - claude-3-haiku-20240307');
    }
  }
}

testClaudeAPI();