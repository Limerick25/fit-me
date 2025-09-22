#!/usr/bin/env node

/**
 * Test the simplest possible Claude models
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

// Test the most basic models that should definitely exist
const BASIC_MODELS = [
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-3-opus-20240229'
];

async function testModel(model) {
  try {
    console.log(`\n🧪 Testing: ${model}`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: 'Say "test successful" if you can read this.'
        }]
      })
    });

    console.log(`Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS: ${model}`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ FAILED: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Testing basic Claude models...\n');

  const workingModels = [];

  for (const model of BASIC_MODELS) {
    const works = await testModel(model);
    if (works) {
      workingModels.push(model);
    }
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 RESULTS:');
  console.log('Working models:', workingModels);

  if (workingModels.length > 0) {
    console.log(`\n✅ Use this model: ${workingModels[0]}`);
  } else {
    console.log('\n❌ No working models found - check your API key');
  }
}

main().catch(console.error);