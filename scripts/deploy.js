#!/usr/bin/env node

/**
 * 🚀 AUTOMATED DEPLOYMENT SCRIPT
 *
 * This script handles full deployment to Vercel with environment setup
 * and ensures all changes automatically deploy to production.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function log(message, emoji = '📦') {
  console.log(`${emoji} ${message}`);
}

function runCommand(command, description) {
  log(`${description}...`, '⚡');
  try {
    const result = execSync(command, {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return result.trim();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
}

function loadEnvironmentVariables() {
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('❌ .env.local file not found. Please create it with your Claude API key.');
  }

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

  return envVars;
}

async function deployToVercel() {
  log('🚀 Starting automated deployment to Vercel', '🚀');

  try {
    // Load environment variables
    const envVars = loadEnvironmentVariables();
    log(`Loaded ${Object.keys(envVars).length} environment variables`);

    // Check if vercel.json exists
    const vercelConfigPath = path.join(PROJECT_ROOT, 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      throw new Error('❌ vercel.json not found. Please ensure Vercel configuration exists.');
    }

    // Build the project first
    log('Building project for production...', '🔨');
    runCommand('npm run build', 'Building React app');

    // Deploy to Vercel
    log('Deploying to Vercel...', '🚀');

    // Build environment variable arguments for Vercel
    const envArgs = Object.entries(envVars)
      .map(([key, value]) => `-e ${key}="${value}"`)
      .join(' ');

    // Deploy with environment variables
    const deployResult = runCommand(
      `vercel --prod ${envArgs}`,
      'Deploying to production'
    );

    log('✅ Deployment successful!', '🎉');

    // Extract URL from deploy result
    const urlMatch = deployResult.match(/(https:\/\/[^\s]+)/);
    if (urlMatch) {
      const deployUrl = urlMatch[1];
      log(`🌐 Live URL: ${deployUrl}`, '🌐');

      // Update documentation with live URL
      updateDocumentationWithUrl(deployUrl);
    }

    return deployResult;

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);

    // Provide helpful instructions for manual setup
    log('📋 Manual setup instructions:', '📋');
    console.log(`
1. Go to https://vercel.com/new
2. Import your GitHub repository: master-shredder
3. Add these environment variables:
   - VITE_CLAUDE_API_KEY: ${envVars.VITE_CLAUDE_API_KEY ? '[Your API Key]' : 'Not found in .env.local'}
   - VITE_CLAUDE_MODEL: ${envVars.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229'}
4. Click Deploy
    `);

    throw error;
  }
}

function updateDocumentationWithUrl(url) {
  try {
    const claudePath = path.join(PROJECT_ROOT, 'CLAUDE.md');
    if (fs.existsSync(claudePath)) {
      let content = fs.readFileSync(claudePath, 'utf8');

      // Add deployment URL to the documentation
      const deploymentSection = `
## 🌐 LIVE DEPLOYMENT

**Production URL**: ${url}
**Status**: ✅ Live and ready for use
**Auto-deploys**: Every GitHub push triggers new deployment

`;

      // Insert after project overview
      content = content.replace(
        '**Current Status**: ✅ **Working prototype with AI chat interface, ready for backend integration**',
        `**Current Status**: ✅ **LIVE IN PRODUCTION - ${url}**`
      );

      // Add deployment section after overview
      content = content.replace(
        '---\n\n## 📋 PROJECT SESSIONS LOG',
        `---\n${deploymentSection}\n## 📋 PROJECT SESSIONS LOG`
      );

      fs.writeFileSync(claudePath, content);
      log('Updated CLAUDE.md with deployment URL', '📝');
    }
  } catch (error) {
    log(`Warning: Could not update documentation: ${error.message}`, '⚠️');
  }
}

// Main execution
if (require.main === module) {
  deployToVercel()
    .then(() => {
      log('🎉 Deployment automation complete!', '🎉');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Deployment automation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { deployToVercel };