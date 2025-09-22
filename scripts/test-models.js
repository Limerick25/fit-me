#!/usr/bin/env node

/**
 * 🧪 Claude Model Tester
 *
 * Tests different Claude models to see which ones work with your API key
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

const MODELS_TO_TEST = [
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20240229',
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
  'claude-opus-4-1-20250805',
  'claude-sonnet-4-20250514'
];

async function testModel(model) {
  try {
    console.log(`🧪 Testing ${model}...`);

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
          content: 'Analyze this food: "1 cup greek yogurt". Respond with just calories.'
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const responseText = data.content[0]?.text || 'No response';
      console.log(`✅ ${model}: WORKS - ${responseText.substring(0, 50)}...`);
      return { model, works: true, response: responseText };
    } else {
      const errorText = await response.text();
      console.log(`❌ ${model}: FAILED - ${response.status}`);
      return { model, works: false, error: response.status };
    }
  } catch (error) {
    console.log(`❌ ${model}: ERROR - ${error.message}`);
    return { model, works: false, error: error.message };
  }
}

async function testAllModels() {
  console.log('🎯 Testing Claude models with your API key...\n');

  const results = [];

  for (const model of MODELS_TO_TEST) {
    const result = await testModel(model);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }

  console.log('\n📊 Test Results Summary:');
  console.log('========================');

  const workingModels = results.filter(r => r.works);
  const failedModels = results.filter(r => !r.works);

  console.log('\n✅ Working Models:');
  workingModels.forEach(result => {
    console.log(`  ${result.model}`);
  });

  console.log('\n❌ Failed Models:');
  failedModels.forEach(result => {
    console.log(`  ${result.model} (${result.error})`);
  });

  if (workingModels.length > 0) {
    const recommended = workingModels[0]; // First working model
    console.log(`\n🎯 Recommended Model: ${recommended.model}`);
    console.log('\nTo use this model:');
    console.log(`1. Update .env.local: VITE_CLAUDE_MODEL=${recommended.model}`);
    console.log(`2. Update Vercel: echo "${recommended.model}" | vercel env add VITE_CLAUDE_MODEL production`);
    console.log(`3. Deploy: vercel --prod --yes`);
  }
}

testAllModels().catch(console.error);