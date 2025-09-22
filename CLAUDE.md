# Master Shredder Project

## 🎯 PROJECT OVERVIEW

**Master Shredder** is an AI-powered nutrition tracking web application that uses Claude AI to analyze food descriptions through natural language conversation.

**Current Status**: ✅ **LIVE IN PRODUCTION** - https://master-shredder.vercel.app

---

## 🌐 LIVE DEPLOYMENT

**Production URL**: https://master-shredder.vercel.app
**Status**: ✅ Live and ready for use
**Auto-deploys**: Every GitHub push triggers new deployment
**Claude AI**: ✅ Working with real API integration
**Backend API**: ✅ Vercel serverless functions handle Claude API calls

**What Works:**
- ✅ Real Claude AI nutrition analysis (no CORS errors!)
- ✅ Interactive editing of AI assumptions and macros
- ✅ Natural language food input processing
- ✅ Automatic deployments on every code change
- ✅ Public access from any browser/device

---

## 📋 PROJECT SESSIONS LOG

### Session 1 - Initial Setup & Basic App (Sept 19, 2025)
- ✅ Created React + TypeScript + Vite application
- ✅ Built nutrition tracking with local storage
- ✅ Responsive design for desktop & mobile
- ✅ Daily dashboard with meal sections

### Session 2 - AI Integration & CORS Resolution (Sept 22, 2025)
- ✅ Integrated Claude API for intelligent food analysis
- ✅ Built conversational nutrition chat interface
- ✅ Added interactive editing of AI-generated nutrition data
- ✅ Resolved environment variable access issues (Vite vs React)
- ✅ Identified CORS limitation requiring backend solution
- ✅ Set up Git repository with comprehensive documentation
- ✅ **AUTOMATION**: Built automatic Git backup + documentation system
- 🔄 **NEXT**: Backend server + Vercel deployment

### Auto-Update - 2025-09-22
**Files Changed**: 4 files
- `AUTO_BACKUP_GUIDE.md`
- `CLAUDE.md`
- `package.json`
- `scripts/auto-commit.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 5 files
- `AUTO_BACKUP_GUIDE.md`
- `README.md`
- `package-lock.json`
- `package.json`
- `scripts/auto-watcher.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `README.md`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 6 files
- `DEPLOYMENT_GUIDE.md`
- `api/analyze-food.js`
- `src/App.tsx`
- `src/components/NutritionChatProduction.tsx`
- `src/services/claudeNutritionServiceProduction.ts`
- `vercel.json`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `DEPLOYMENT_GUIDE.md`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 4 files
- `VERCEL_SETUP.md`
- `package.json`
- `scripts/auto-commit.js`
- `scripts/deploy.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 5 files
- `.gitignore`
- `CLAUDE.md`
- `package.json`
- `scripts/vercel-auto-deploy.js`
- `vercel.json`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `README.md`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `README.md`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 2 files
- `package.json`
- `scripts/update-claude-model.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `CLAUDE_MODEL_UPDATES.md`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 2 files
- `CLAUDE_MODEL_UPDATES.md`
- `scripts/update-claude-model.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `test-claude-api.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `test-claude-api.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 2 files
- `package.json`
- `scripts/test-models.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 3 files
- `api/analyze-food.js`
- `scripts/update-claude-model.js`
- `test-generic-model.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 2 files
- `api/analyze-food.js`
- `test-simple-models.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `test-exact-api-call.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `api/analyze-food.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 2 files
- `api/analyze-food.js`
- `test-sonnet-4.js`

**Auto-committed**: Changes automatically backed up to GitHub

### Auto-Update - 2025-09-22
**Files Changed**: 1 files
- `api/analyze-food.js`

**Auto-committed**: Changes automatically backed up to GitHub

---

## 🏗️ CURRENT ARCHITECTURE

### Frontend (React + TypeScript + Vite)
```
src/
├── components/
│   ├── NutritionChatInteractive.tsx  # Working AI chat interface
│   ├── Header.tsx                    # Date picker & navigation
│   ├── Dashboard.tsx                 # Daily nutrition summary
│   ├── MealSection.tsx               # Breakfast/Lunch/Dinner/Snacks
│   └── ErrorBoundary.tsx             # Error handling
├── services/
│   └── claudeNutritionService.ts     # Claude API integration (CORS blocked)
├── utils/
│   ├── claudeTest.ts                 # API connectivity testing
│   ├── storage.ts                    # Local storage management
│   └── calculations.ts               # Nutrition calculations
├── types/
│   ├── nutrition.ts                  # Core data models
│   └── conversation.ts               # AI chat types
└── styles/
    └── App.css                       # Complete responsive styling
```

### Environment Configuration
```
.env.local:
VITE_CLAUDE_API_KEY=sk-ant-api03-... (configured)
VITE_CLAUDE_MODEL=claude-3-sonnet-20240229
```

---

## 🚀 HOW TO RUN LOCALLY

```bash
cd /Users/matthewlimeri/coderepo/master-shredder
npm run dev
# Open http://localhost:5173
```

**Testing AI Integration**:
1. Click "Add Food" on any meal
2. Click "🧪 Test Claude API" button
3. See CORS error (expected) - confirms API key is working

---

## 🎯 CURRENT FEATURES

### ✅ Working Features
- **Daily Nutrition Dashboard**: Real-time calorie/macro tracking
- **Multi-meal Management**: Breakfast, Lunch, Dinner, Snacks
- **Date Navigation**: View nutrition for any date
- **Local Data Persistence**: Saves to browser storage
- **AI Chat Interface**: Conversational food entry (simulated responses)
- **Interactive Editing**: Edit AI assumptions and recalculate
- **Responsive Design**: Works on desktop and mobile
- **Claude API Integration**: Configured but blocked by CORS
- **🤖 AUTOMATED BACKUPS**: Smart Git commits + documentation updates

### 🔄 In Progress
- **Backend Server**: Node.js/Express to proxy Claude API calls
- **GitHub Repository**: Version control and backup
- **Vercel Deployment**: Public web app deployment

---

## 🧠 AI FEATURES IMPLEMENTED

### Conversational Interface
- Natural language food description: "grilled chicken breast with rice and vegetables"
- AI generates nutrition breakdown with detailed assumptions
- Interactive editing of macros and ingredients
- Confidence scoring for AI estimates

### Smart Analysis Capabilities
- Infers cooking methods and hidden ingredients
- Estimates portions when not specified
- Accounts for oils, seasonings, and preparation methods
- Provides ingredient-by-ingredient breakdowns

### Example User Flow
```
User: "scrambled eggs with cheese for breakfast"
AI: "I analyzed your breakfast - 2 large eggs (140 cal) scrambled in 1 tsp butter (35 cal)
     with 1 oz cheddar cheese (110 cal). Total: 285 calories, 20g protein, 2g carbs, 22g fat.

     My assumptions:
     • 2 large eggs (common breakfast portion)
     • 1 tsp butter for cooking
     • 1 oz cheddar cheese (standard serving)"

User: [Can edit any values inline and recalculate]
```

---

## 🔧 TECHNICAL CHALLENGES SOLVED

### Environment Variables
- **Issue**: `process.env` not available in Vite
- **Solution**: Use `import.meta.env` with `VITE_` prefix

### CORS Limitation
- **Issue**: Browser security blocks direct Claude API calls
- **Status**: Identified, requires backend proxy
- **Next**: Build Express server for API proxying

### Component Architecture
- **Interactive Chat**: `NutritionChatInteractive.tsx` with inline editing
- **Error Handling**: Graceful fallbacks when AI services fail
- **State Management**: Real-time updates with confidence scoring

---

## 🤖 AUTOMATION SYSTEM

### Automatic Git Backup + Documentation
**Never lose work or forget to document changes!**

**Quick Commands:**
```bash
npm run save              # Auto-analyze, commit, document, push
npm run save "message"    # Custom message + auto-documentation
npm run backup           # Quick checkpoint backup
npm run sync             # Sync with remote + backup local changes
```

**What Happens Automatically:**
- ✅ **Smart Analysis**: Categorizes changes (components, services, utils, etc.)
- ✅ **Meaningful Commits**: Generates descriptive commit messages
- ✅ **Documentation Updates**: Updates CLAUDE.md with session info
- ✅ **GitHub Backup**: Pushes to GitHub with clean history
- ✅ **Claude Code Ready**: Maintains context for future sessions

**VS Code Integration:**
- Auto-save on focus change
- Auto-formatting on save
- Custom task for one-click backup
- Git auto-fetch for sync

**Files:**
- `scripts/auto-commit.js` - Main automation script
- `.vscode/settings.json` - VS Code configuration
- `AUTO_BACKUP_GUIDE.md` - Complete usage guide

---

## 🎯 NEXT PHASE REQUIREMENTS

### Backend Server (Node.js + Express)
```
/backend
├── server.js              # Express server with Claude API proxy
├── routes/
│   └── api.js             # /api/analyze-food endpoint
├── middleware/
│   └── cors.js            # Proper CORS configuration
└── .env                   # Server-side environment variables
```

### Deployment Pipeline
1. **GitHub Repository**: Version control + collaboration
2. **Vercel Frontend**: Static React app deployment
3. **Vercel Functions**: Backend API serverless functions
4. **Environment Secrets**: Secure API key management

### Production Features
- User authentication (optional for MVP)
- Cloud data persistence (replace localStorage)
- Mobile app preparation (API-first design)
- Performance optimization for public use

---

## 📁 PROJECT FILES SUMMARY

### Key Configuration Files
- `package.json`: React + TypeScript + Vite dependencies
- `vite.config.ts`: Build configuration
- `tsconfig.json`: TypeScript configuration
- `.env.local`: Environment variables (git-ignored)
- `.gitignore`: Excludes node_modules, dist, .env files

### Core Application Files
- `src/App.tsx`: Main application component
- `src/main.tsx`: Application entry point
- `src/types/*`: TypeScript type definitions
- `src/components/*`: React components
- `src/services/*`: API integration services
- `src/utils/*`: Helper functions and utilities

### Documentation
- `CLAUDE.md`: This file - comprehensive project documentation
- `README.md`: Setup and usage instructions

---

## 🚀 READY FOR BACKEND DEVELOPMENT

The frontend is **production-ready** and fully functional with simulated AI responses. The next critical step is building the backend server to enable real Claude API integration for a publicly deployable nutrition tracking application.

**Status**: Ready to proceed with backend development + GitHub + Vercel setup! 🎯