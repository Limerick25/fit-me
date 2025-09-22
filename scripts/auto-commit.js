#!/usr/bin/env node

/**
 * Auto-commit script for Master Shredder
 *
 * This script:
 * 1. Analyzes changes in the repository
 * 2. Generates meaningful commit messages based on file changes
 * 3. Updates documentation automatically
 * 4. Commits and pushes to GitHub
 *
 * Usage: npm run save [optional-message]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function execCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', ...options }).trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    return null;
  }
}

function getCurrentTimestamp() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
}

function analyzeChanges() {
  // Get list of changed files
  const changedFiles = execCommand('git diff --cached --name-only') ||
                      execCommand('git diff --name-only') || '';

  const files = changedFiles.split('\n').filter(f => f.trim());

  const changes = {
    components: files.filter(f => f.includes('components/')),
    services: files.filter(f => f.includes('services/')),
    utils: files.filter(f => f.includes('utils/')),
    types: files.filter(f => f.includes('types/')),
    styles: files.filter(f => f.includes('styles/') || f.endsWith('.css')),
    config: files.filter(f => f.includes('package.json') || f.includes('vite.config') || f.includes('tsconfig')),
    docs: files.filter(f => f.endsWith('.md')),
    env: files.filter(f => f.includes('.env')),
    other: files.filter(f => !f.includes('components/') && !f.includes('services/') &&
                            !f.includes('utils/') && !f.includes('types/') &&
                            !f.includes('styles/') && !f.endsWith('.css') &&
                            !f.includes('package.json') && !f.includes('vite.config') &&
                            !f.includes('tsconfig') && !f.endsWith('.md') &&
                            !f.includes('.env'))
  };

  return { files, changes };
}

function generateCommitMessage(changes, customMessage) {
  if (customMessage) {
    return `${customMessage}

🤖 Auto-backup with documentation update

Co-Authored-By: Claude <noreply@anthropic.com>`;
  }

  const { changes: changeTypes } = changes;
  const parts = [];

  if (changeTypes.components.length > 0) {
    parts.push(`✨ Update components: ${changeTypes.components.map(f => path.basename(f, '.tsx')).join(', ')}`);
  }

  if (changeTypes.services.length > 0) {
    parts.push(`🔧 Update services: ${changeTypes.services.map(f => path.basename(f, '.ts')).join(', ')}`);
  }

  if (changeTypes.utils.length > 0) {
    parts.push(`🛠️ Update utilities: ${changeTypes.utils.map(f => path.basename(f, '.ts')).join(', ')}`);
  }

  if (changeTypes.styles.length > 0) {
    parts.push(`🎨 Update styling`);
  }

  if (changeTypes.config.length > 0) {
    parts.push(`⚙️ Update configuration`);
  }

  if (changeTypes.docs.length > 0) {
    parts.push(`📚 Update documentation`);
  }

  if (changeTypes.other.length > 0) {
    parts.push(`📁 Update project files`);
  }

  const title = parts.length > 0 ? parts[0] : '🔄 Project updates';
  const body = parts.length > 1 ? '\n\n' + parts.slice(1).join('\n') : '';

  return `${title}${body}

🤖 Auto-backup with documentation update

Co-Authored-By: Claude <noreply@anthropic.com>`;
}

function updateDocumentation(changes) {
  const claudeDocPath = 'CLAUDE.md';

  if (!fs.existsSync(claudeDocPath)) {
    console.log('⚠️  CLAUDE.md not found, skipping documentation update');
    return;
  }

  const currentDate = getCurrentTimestamp();
  const { files } = changes;

  // Read current documentation
  let claudeDoc = fs.readFileSync(claudeDocPath, 'utf8');

  // Create session update entry
  const sessionUpdate = `
### Auto-Update - ${currentDate}
**Files Changed**: ${files.length} files
${files.map(f => `- \`${f}\``).join('\n')}

**Auto-committed**: Changes automatically backed up to GitHub
`;

  // Find the sessions log section and add the update
  const sessionLogRegex = /(## 📋 PROJECT SESSIONS LOG\n\n)([\s\S]*?)(\n---)/;
  const match = claudeDoc.match(sessionLogRegex);

  if (match) {
    const beforeSessions = match[1];
    const existingSessions = match[2];
    const afterSessions = match[3];

    const updatedSessions = beforeSessions + existingSessions + sessionUpdate + afterSessions;
    claudeDoc = claudeDoc.replace(sessionLogRegex, updatedSessions);

    fs.writeFileSync(claudeDocPath, claudeDoc);
    console.log('✅ Updated CLAUDE.md with session information');
  } else {
    console.log('⚠️  Could not find sessions section in CLAUDE.md');
  }
}

function main() {
  console.log('🚀 Starting automatic Git backup and documentation update...\n');

  // Get custom message from command line args
  const customMessage = process.argv.slice(2).join(' ');

  // Check if we're in a git repository
  if (!execCommand('git rev-parse --git-dir')) {
    console.error('❌ Not in a Git repository');
    process.exit(1);
  }

  // Stage all changes
  console.log('📋 Staging changes...');
  execCommand('git add .');

  // Check if there are any changes to commit
  const statusOutput = execCommand('git status --porcelain');
  if (!statusOutput) {
    console.log('✅ No changes to commit. Repository is up to date.');
    return;
  }

  // Analyze changes
  const changes = analyzeChanges();
  console.log(`📊 Analyzed ${changes.files.length} changed files`);

  // Update documentation
  console.log('📚 Updating documentation...');
  updateDocumentation(changes);

  // Stage documentation updates
  execCommand('git add CLAUDE.md');

  // Generate commit message
  const commitMessage = generateCommitMessage(changes, customMessage);
  console.log('💬 Generated commit message:');
  console.log('---');
  console.log(commitMessage);
  console.log('---\n');

  // Commit changes
  console.log('💾 Committing changes...');
  execCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);

  // Push to origin
  console.log('☁️  Pushing to GitHub...');
  const pushResult = execCommand('git push origin main');

  if (pushResult !== null) {
    console.log('✅ Successfully backed up to GitHub!');
    console.log('🔗 Your changes are now safely stored and documented.');

    // Trigger automatic deployment to Vercel
    console.log('🚀 Triggering automatic deployment...');
    try {
      const deployResult = execCommand('vercel --prod --yes');
      if (deployResult) {
        console.log('🎉 Deployment successful! Your changes are now live.');

        // Extract URL from deploy result
        const urlMatch = deployResult.match(/(https:\/\/[^\s]+)/);
        if (urlMatch) {
          console.log(`🌐 Live URL: ${urlMatch[1]}`);
        }
      }
    } catch (deployError) {
      console.log('⚠️  Auto-deployment skipped. Run "npm run deploy" manually if needed.');
      console.log('💡 Ensure you\'re logged into Vercel with "vercel login"');
    }
  } else {
    console.log('⚠️  Push may have failed. Check your internet connection and GitHub access.');
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}