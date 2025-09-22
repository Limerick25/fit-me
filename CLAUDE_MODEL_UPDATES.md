# 🤖 Claude Model Auto-Updates

This guide ensures your Master Shredder app always uses the latest and most powerful Claude model available.

## 🎯 Current Setup

**Current Model**: `claude-3-5-sonnet-20241022` (Claude 3.5 Sonnet - Latest Available)

**Why Claude 3.5 Sonnet?**
- 🧠 Most capable model currently available via API
- 🔥 Excellent performance on complex reasoning tasks
- ⚡ Fast response times with high intelligence
- 📊 Superior nutrition analysis capabilities
- ✅ Proven reliability and availability

## ⚡ Auto-Update Commands

```bash
# Check & update to latest model (defaults to Opus)
npm run update-model

# Force update to latest Opus model
npm run update-model-opus

# Use latest Sonnet model (faster, cheaper)
npm run update-model-sonnet
```

## 🔄 What the Auto-Updater Does

1. **Checks current model** against latest available
2. **Updates `.env.local`** for local development
3. **Updates Vercel environment** for production
4. **Triggers deployment** with new model
5. **Updates documentation** with change log
6. **Tests the deployment** and reports success

## 📅 How to Stay Current

### Option 1: Manual Updates (Recommended)
Run this monthly or when you hear about new Claude releases:
```bash
npm run update-model
```

### Option 2: Check Anthropic News
- Follow [@AnthropicAI](https://twitter.com/AnthropicAI)
- Check [Anthropic Blog](https://www.anthropic.com/news)
- Monitor [Claude API Docs](https://docs.anthropic.com/en/docs/about-claude/models)

### Option 3: Automated Checking (Future Enhancement)
The script could be enhanced to:
- Check Anthropic API for latest models
- Run weekly via GitHub Actions
- Auto-update when new models are detected

## 🎯 Model Selection Guide

### **Claude Opus 4.1** (Default - Best Choice)
- **Use for**: Production nutrition analysis
- **Strengths**: Most accurate, best reasoning, superior food knowledge
- **Cost**: Higher but worth it for quality

### **Claude Sonnet 4** (Alternative)
- **Use for**: High-volume applications
- **Strengths**: Fast, efficient, still very capable
- **Cost**: Much cheaper than Opus

### **Claude Haiku 3.5** (Budget Option)
- **Use for**: Simple food logging
- **Strengths**: Fastest, cheapest
- **Cost**: Lowest cost option

## 🔧 Manual Model Updates

If you want to manually set a specific model:

1. **Update `.env.local`:**
   ```bash
   VITE_CLAUDE_MODEL=claude-opus-4-1-20250805
   ```

2. **Update Vercel:**
   ```bash
   vercel env rm VITE_CLAUDE_MODEL production
   echo "claude-opus-4-1-20250805" | vercel env add VITE_CLAUDE_MODEL production
   ```

3. **Deploy:**
   ```bash
   vercel --prod --yes
   ```

## 📊 Model Performance Comparison

| Model | Speed | Intelligence | Cost | Best For |
|-------|-------|-------------|------|----------|
| Opus 4.1 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$$ | Production nutrition analysis |
| Sonnet 4 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$ | High-volume applications |
| Haiku 3.5 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | $ | Simple food logging |

## 🚨 Model Deprecation Alerts

Anthropic occasionally deprecates old models. Signs to watch for:
- API errors about model not found
- Deprecation notices in Anthropic documentation
- Performance degradation

**Quick Fix:**
```bash
npm run update-model
```

## 🎉 Benefits of Latest Models

**Improved Nutrition Analysis:**
- Better ingredient recognition
- More accurate portion estimation
- Superior brand knowledge
- Enhanced cooking method understanding

**Enhanced User Experience:**
- Faster response times
- More natural conversations
- Better error handling
- Improved assumption explanations

## 🔮 Future Automation

Planned enhancements for the model updater:
- [ ] Real-time model availability checking
- [ ] Automatic weekly model updates
- [ ] Performance benchmarking
- [ ] Cost optimization alerts
- [ ] A/B testing between models

---

**💡 Pro Tip**: Always test your app after model updates to ensure everything works correctly. The automation handles deployment, but manual testing ensures quality!

**🌐 Test your updates**: https://fit-me-nutrition.vercel.app