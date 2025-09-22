# 🚀 Automated Vercel Setup Instructions

## 🎯 One-Time Setup (Do This Once)

### Step 1: Create Vercel Account & Deploy
1. **Go to [vercel.com/new](https://vercel.com/new)**
2. **Sign up with GitHub** (if not already signed up)
3. **Import `fit-me` repository**

### Step 2: Configure Project Settings
**Framework**: Vite ✅ (auto-detected)
**Build Command**: `npm run build` ✅ (auto-detected)
**Output Directory**: `dist` ✅ (auto-detected)
**Root Directory**: `./` ✅ (default)

### Step 3: Add Environment Variables (CRITICAL!)
Click **"Environment Variables"** and add these **exact** variables:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_CLAUDE_API_KEY` | `[YOUR_CLAUDE_API_KEY_FROM_.ENV.LOCAL]` | Production, Preview, Development |
| `VITE_CLAUDE_MODEL` | `claude-3-sonnet-20240229` | Production, Preview, Development |

⚠️ **Important**: Add to ALL environments (Production, Preview, Development)

### Step 4: Deploy
1. **Click "Deploy"**
2. **Wait 2-3 minutes** for first deployment
3. **Get your live URL!** (e.g., `https://fit-me-nutrition.vercel.app`)

## 🔄 Automatic Deployments (Already Configured!)

After the one-time setup above, **every change will automatically deploy**:

### How It Works:
1. **You make changes** to your code
2. **Run `npm run save`** (or changes auto-trigger via watcher)
3. **Changes push to GitHub**
4. **Vercel automatically deploys** new version
5. **Live site updates in 2-3 minutes**

### Commands Available:
```bash
npm run save              # Auto-commit + deploy
npm run deploy            # Manual deploy only
npm run deploy-prod       # Build + deploy
```

## 🧪 Connect Vercel CLI (Optional)

To enable CLI auto-deployment, run once:
```bash
vercel login              # Login with GitHub
vercel                    # Link to your deployed project
```

After this, `npm run save` will automatically deploy after each Git push!

## ✅ Verification

After setup, verify:
1. **Live URL loads** your nutrition app
2. **Add Food** opens Claude chat
3. **Claude API works** (no CORS errors!)
4. **Push a test change** and see auto-deployment

## 🎉 You're Done!

Your Master Shredder app now has:
- ✅ **Live public URL**
- ✅ **Real Claude AI integration**
- ✅ **Automatic deployments**
- ✅ **Zero-effort workflow**

Every `npm run save` will:
1. Commit changes to GitHub
2. Trigger new deployment
3. Update live site automatically

**No more manual steps needed!** 🚀