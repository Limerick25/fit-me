# 🚀 Vercel Deployment Guide

This guide will help you deploy Fit Me to Vercel so it's publicly accessible from any browser.

## 📋 Prerequisites

✅ **GitHub Repository**: https://github.com/Limerick25/fit-me
✅ **Claude API Key**: Your API key from Anthropic Console
✅ **Vercel Account**: Free account at [vercel.com](https://vercel.com)

## 🎯 Step-by-Step Deployment

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. **Choose "Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project
1. **Click "New Project"** on Vercel dashboard
2. **Find "fit-me"** in your GitHub repositories list
3. **Click "Import"** next to fit-me

### Step 3: Configure Project Settings
**Framework Preset**: `Vite` (should auto-detect)
**Root Directory**: `./` (leave as default)
**Build Command**: `npm run build` (should auto-detect)
**Output Directory**: `dist` (should auto-detect)
**Install Command**: `npm install` (should auto-detect)

### Step 4: Add Environment Variables (CRITICAL!)
**Click "Environment Variables" section**

Add these **exact** variables:

| Name | Value |
|------|-------|
| `VITE_CLAUDE_API_KEY` | `[YOUR_CLAUDE_API_KEY_FROM_.ENV.LOCAL]` |
| `VITE_CLAUDE_MODEL` | `claude-3-sonnet-20240229` |

**Important**:
- Add to **Production**, **Preview**, and **Development** environments
- Values are case-sensitive
- No quotes needed

### Step 5: Deploy
1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build to complete
3. **Get your live URL!**

## 🎉 Your Live App

After deployment, you'll get:
- **Live URL**: `https://fit-me-nutrition.vercel.app`
- **Production ready** nutrition tracking app
- **Real Claude AI** integration working
- **Automatic deployments** on every GitHub push

## 🔧 Features That Will Work

### ✅ Working Features
- **Daily nutrition dashboard**
- **Add food with natural language**
- **Real Claude AI analysis** (no more CORS errors!)
- **Interactive editing** of AI assumptions
- **Responsive design** on all devices
- **Automatic documentation** updates
- **Professional URLs** you can share

### 🚀 Production Architecture
```
User Browser → Vercel Frontend (React) → Vercel Serverless API → Claude API → Response
```

## 🛠️ Automatic Updates

Every time you:
1. **Make changes** to your code
2. **Run** `npm run save` or `npm start` (auto-commits)
3. **Changes push** to GitHub automatically
4. **Vercel deploys** new version automatically (2-3 minutes)

**You have continuous deployment!** 🎯

## 🐛 Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure `VITE_CLAUDE_API_KEY` starts with `sk-ant-api03-`
- Verify all values are in Production, Preview, and Development

### API Not Working
- Check Functions tab in Vercel dashboard
- Look for `/api/analyze-food` function
- Check function logs for errors

### Environment Variables
- Must be `VITE_` prefixed for frontend access
- Case sensitive
- No spaces or quotes

## 🎯 Next Steps

After deployment:
1. **Test the live app** with real food descriptions
2. **Share the URL** with friends/family
3. **Monitor usage** in Vercel dashboard
4. **Continue development** with automatic deployments

## 🔗 Useful Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Function Logs**: Vercel Dashboard → Your Project → Functions
- **Deployments**: Vercel Dashboard → Your Project → Deployments
- **GitHub Integration**: Auto-deploys on every push

---

**🚀 Ready to deploy? Follow the steps above and you'll have a live nutrition tracking app in minutes!**