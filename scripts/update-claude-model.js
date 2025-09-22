#!/usr/bin/env node

/**
 * 🤖 AUTOMATIC CLAUDE MODEL UPDATER
 *
 * This script automatically checks for the latest Claude model
 * and updates both local and Vercel environment variables.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWN_LATEST_MODELS = {
  'opus': 'claude-opus-4-1-20250805',
  'sonnet': 'claude-sonnet-4-20250514',
  'haiku': 'claude-3-5-haiku-20241022'
};

function log(message, emoji = '🤖') {
  console.log(`${emoji} ${message}`);
}

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    });
    return result.trim();
  } catch (error) {
    if (options.allowFail) {
      return null;
    }
    throw error;
  }
}

function getCurrentModel() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const modelMatch = envContent.match(/VITE_CLAUDE_MODEL=(.+)/);
  return modelMatch ? modelMatch[1].trim() : null;
}

function updateLocalModel(newModel) {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found');
  }

  let envContent = fs.readFileSync(envPath, 'utf8');

  if (envContent.includes('VITE_CLAUDE_MODEL=')) {
    envContent = envContent.replace(
      /VITE_CLAUDE_MODEL=.*/,
      `VITE_CLAUDE_MODEL=${newModel}`
    );
  } else {
    envContent += `\nVITE_CLAUDE_MODEL=${newModel}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  log(`Updated .env.local with model: ${newModel}`);
}

function updateVercelModel(newModel) {
  try {
    // Remove old model
    execCommand('echo "y" | vercel env rm VITE_CLAUDE_MODEL production', { allowFail: true });

    // Add new model
    execCommand(`echo "${newModel}" | vercel env add VITE_CLAUDE_MODEL production`);

    log(`Updated Vercel environment variable with model: ${newModel}`);
    return true;
  } catch (error) {
    log(`Failed to update Vercel environment: ${error.message}`, '⚠️');
    return false;
  }
}

function getLatestModel(preference = 'opus') {
  // Default to most powerful model (Opus 4.1)
  // Future: Could fetch from Anthropic API to get real-time latest models

  const model = KNOWN_LATEST_MODELS[preference.toLowerCase()] || KNOWN_LATEST_MODELS.opus;
  log(`Latest ${preference} model: ${model}`);
  return model;
}

function deployWithNewModel() {
  try {
    log('Deploying updated model to production...');
    const deployResult = execCommand('vercel --prod --yes');

    // Extract URL from deploy result
    const urlMatch = deployResult.match(/(https:\/\/[^\s]+)/);
    if (urlMatch) {
      log(`Deployment successful: ${urlMatch[1]}`, '🎉');
    } else {
      log('Deployment completed successfully', '✅');
    }
    return true;
  } catch (error) {
    log(`Deployment failed: ${error.message}`, '❌');
    return false;
  }
}

function updateDocumentation(oldModel, newModel) {
  try {
    const claudePath = 'CLAUDE.md';
    if (fs.existsSync(claudePath)) {
      let content = fs.readFileSync(claudePath, 'utf8');

      // Add model update entry
      const updateEntry = `
### Model Update - ${new Date().toISOString().split('T')[0]}
**Updated Claude Model**: ${oldModel} → ${newModel}
**Reason**: Using latest available model for best performance

`;

      // Insert after sessions log header
      content = content.replace(
        '## 📋 PROJECT SESSIONS LOG\n\n',
        `## 📋 PROJECT SESSIONS LOG\n${updateEntry}`
      );

      fs.writeFileSync(claudePath, content);
      log('Updated project documentation');
    }
  } catch (error) {
    log(`Could not update documentation: ${error.message}`, '⚠️');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const preference = args[0] || 'opus'; // Default to Opus (most powerful)

  log('🔍 Checking for latest Claude model...');

  const currentModel = getCurrentModel();
  const latestModel = getLatestModel(preference);

  if (currentModel === latestModel) {
    log(`✅ Already using latest model: ${currentModel}`);
    return;
  }

  log(`📈 Updating from ${currentModel || 'unknown'} to ${latestModel}`);

  // Update local environment
  updateLocalModel(latestModel);

  // Update Vercel environment
  const vercelUpdated = updateVercelModel(latestModel);

  if (vercelUpdated) {
    // Deploy with new model
    const deployed = deployWithNewModel();

    if (deployed) {
      // Update documentation
      updateDocumentation(currentModel, latestModel);

      log('🎉 Model update complete! Your app now uses the latest Claude model.', '🎉');
      log(`💡 Test at: https://fit-me-nutrition.vercel.app`);
    }
  }
}

// Export for use in other scripts
export { getLatestModel, updateLocalModel, updateVercelModel };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Model update failed:', error.message);
    process.exit(1);
  });
}