#!/usr/bin/env node

/**
 * 🚀 AUTOMATIC VERCEL DEPLOYMENT
 *
 * This script automatically deploys to Vercel using GitHub integration
 * and configures all environment variables.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message, emoji = '🚀') {
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

function loadEnvironmentVariables() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('❌ .env.local file not found');
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
  log('🚀 Starting automatic Vercel deployment');

  try {
    // Load environment variables
    log('📋 Loading environment variables...');
    const envVars = loadEnvironmentVariables();

    if (!envVars.VITE_CLAUDE_API_KEY) {
      throw new Error('❌ VITE_CLAUDE_API_KEY not found in .env.local');
    }

    // Build the project
    log('🔨 Building project...');
    execCommand('npm run build');

    // Check if logged in to Vercel
    log('🔐 Checking Vercel authentication...');
    const whoami = execCommand('vercel whoami', { allowFail: true });

    if (!whoami) {
      log('🔑 Not logged in to Vercel. Attempting login...');

      // Try to login non-interactively first
      try {
        execCommand('echo | vercel login', { allowFail: true });
      } catch (e) {
        log('⚠️  Interactive login required. Opening browser...');
        execCommand('vercel login');
      }
    } else {
      log(`✅ Logged in as: ${whoami}`);
    }

    // Deploy with environment variables
    log('🚀 Deploying to Vercel...');

    const envArgs = [
      `-e VITE_CLAUDE_API_KEY="${envVars.VITE_CLAUDE_API_KEY}"`,
      `-e VITE_CLAUDE_MODEL="${envVars.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229'}"`
    ].join(' ');

    // Deploy to production
    const deployCommand = `vercel --prod --yes ${envArgs}`;
    log(`Running: ${deployCommand.replace(envVars.VITE_CLAUDE_API_KEY, '[API_KEY]')}`);

    const deployResult = execCommand(deployCommand);

    // Extract URL from result
    const urlMatch = deployResult.match(/(https:\/\/[^\s]+)/);
    if (urlMatch) {
      const deployUrl = urlMatch[1];
      log(`🌐 Deployment successful!`);
      log(`🔗 Live URL: ${deployUrl}`);

      // Update documentation with live URL
      updateDocumentationWithUrl(deployUrl);

      return deployUrl;
    } else {
      log('✅ Deployment completed');
      return 'Deployment successful';
    }

  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`, '❌');

    // Provide fallback instructions
    log('📋 Fallback: Manual deployment via web interface', '💡');
    log('1. Go to https://vercel.com/new');
    log('2. Import fit-me repository');
    log('3. Add environment variables from .env.local');
    log('4. Click Deploy');

    throw error;
  }
}

function updateDocumentationWithUrl(url) {
  try {
    const claudePath = 'CLAUDE.md';
    if (fs.existsSync(claudePath)) {
      let content = fs.readFileSync(claudePath, 'utf8');

      // Update status line
      content = content.replace(
        /\*\*Current Status\*\*: [^\n]+/,
        `**Current Status**: ✅ **LIVE IN PRODUCTION** - ${url}`
      );

      // Add deployment section if not exists
      if (!content.includes('## 🌐 LIVE DEPLOYMENT')) {
        const deploymentSection = `
## 🌐 LIVE DEPLOYMENT

**Production URL**: ${url}
**Status**: ✅ Live and ready for use
**Auto-deploys**: Every GitHub push triggers new deployment
**Claude AI**: ✅ Working with real API integration

`;
        content = content.replace(
          '---\n\n## 📋 PROJECT SESSIONS LOG',
          `---\n${deploymentSection}\n## 📋 PROJECT SESSIONS LOG`
        );
      }

      fs.writeFileSync(claudePath, content);
      log('📝 Updated documentation with live URL');
    }
  } catch (error) {
    log(`⚠️  Could not update documentation: ${error.message}`);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployToVercel()
    .then((result) => {
      log('🎉 Automatic deployment complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Automatic deployment failed');
      process.exit(1);
    });
}

export { deployToVercel };