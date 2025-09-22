#!/usr/bin/env node

/**
 * Auto-watcher script for Master Shredder
 *
 * This script watches for file changes and automatically:
 * 1. Waits for a pause in editing (debounce)
 * 2. Analyzes changes
 * 3. Commits and pushes to GitHub
 * 4. Updates documentation
 *
 * Usage: npm run watch
 */

import chokidar from 'chokidar';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEBOUNCE_DELAY = 10000; // 10 seconds after last change
const WATCH_PATTERNS = [
  'src/**/*',
  'public/**/*',
  '*.md',
  '*.json',
  '*.js',
  '*.ts',
  '*.tsx',
  '*.css',
  '.env.example',
  'vite.config.*',
  'tsconfig.*',
  'eslint.config.*'
];

const IGNORE_PATTERNS = [
  'node_modules/**',
  'dist/**',
  'build/**',
  '.git/**',
  '*.log',
  '.env.local',
  '.DS_Store',
  'scripts/auto-watcher.js' // Don't watch ourselves
];

let debounceTimer = null;
let isCommitting = false;
let changedFiles = new Set();

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options }).trim();
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    log(error.message, 'error');
    return null;
  }
}

async function autoCommit() {
  if (isCommitting) {
    log('Already committing, skipping...');
    return;
  }

  isCommitting = true;

  try {
    log('🚀 Auto-committing changes...', 'info');

    // Check if there are actually changes to commit
    const statusOutput = execCommand('git status --porcelain');
    if (!statusOutput) {
      log('No changes to commit', 'info');
      return;
    }

    // Run our auto-commit script
    const result = execCommand('node scripts/auto-commit.js "Auto-commit: File changes detected"');

    if (result !== null) {
      log(`Successfully auto-committed ${changedFiles.size} file(s)`, 'success');
      changedFiles.clear();
    } else {
      log('Auto-commit failed', 'error');
    }

  } catch (error) {
    log(`Auto-commit error: ${error.message}`, 'error');
  } finally {
    isCommitting = false;
  }
}

function scheduleCommit() {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Schedule new commit after debounce delay
  debounceTimer = setTimeout(() => {
    autoCommit();
  }, DEBOUNCE_DELAY);
}

function startWatching() {
  log('🔍 Starting file watcher for automatic Git backups...', 'info');
  log(`⏱️  Debounce delay: ${DEBOUNCE_DELAY / 1000} seconds`, 'info');
  log('📁 Watching patterns:', 'info');
  WATCH_PATTERNS.forEach(pattern => console.log(`   - ${pattern}`));
  console.log('');

  const watcher = chokidar.watch(WATCH_PATTERNS, {
    ignored: IGNORE_PATTERNS,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });

  watcher.on('ready', () => {
    log('✅ File watcher ready. Monitoring for changes...', 'success');
    log('💡 Make changes to your files - they will auto-commit after 10 seconds of inactivity', 'info');
    console.log('');
  });

  watcher.on('add', (filePath) => {
    if (isCommitting) return;
    changedFiles.add(filePath);
    log(`📝 File added: ${filePath}`);
    scheduleCommit();
  });

  watcher.on('change', (filePath) => {
    if (isCommitting) return;
    changedFiles.add(filePath);
    log(`✏️  File changed: ${filePath}`);
    scheduleCommit();
  });

  watcher.on('unlink', (filePath) => {
    if (isCommitting) return;
    changedFiles.add(filePath);
    log(`🗑️  File deleted: ${filePath}`);
    scheduleCommit();
  });

  watcher.on('error', (error) => {
    log(`Watcher error: ${error}`, 'error');
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    log('🛑 Shutting down file watcher...', 'info');

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      log('⚡ Committing final changes before shutdown...', 'info');
      autoCommit().then(() => {
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });

  return watcher;
}

// Check if we're in a git repository
if (!execCommand('git rev-parse --git-dir')) {
  log('❌ Not in a Git repository. Please run this from your project root.', 'error');
  process.exit(1);
}

// Start watching
if (import.meta.url === `file://${process.argv[1]}`) {
  startWatching();
}

export { startWatching };