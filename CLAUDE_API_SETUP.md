# 🤖 Claude API Setup for Master Shredder

## Quick Setup (2 minutes)

### 1. Get Your Claude API Key
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up/login to your Anthropic account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

### 2. Add API Key to Master Shredder
1. Open the file: `/Users/matthewlimeri/coderepo/fit-me/.env.local`
2. Replace `your_claude_api_key_here` with your actual API key:

```bash
REACT_APP_CLAUDE_API_KEY=sk-ant-your-actual-key-here
```

### 3. Test the Integration
1. Save the file
2. Refresh your browser (the app will automatically reload)
3. Click "Add Food" - you should see "✅ Claude AI Connected" in the header
4. Try: "greek yogurt with blueberries"

## What You'll Get

**Real AI Analysis:**
- Claude will make specific, expert assumptions about brands, portions, cooking methods
- Much more intelligent than the demo responses
- Learns from conversation context
- Provides detailed reasoning for nutrition estimates

**Example Response:**
Instead of generic assumptions, Claude will say:
- "Assuming 1 cup (227g) Chobani Plain Nonfat Greek Yogurt"
- "Assuming 1/2 cup fresh organic blueberries (74g)"
- "Based on USDA FoodData Central nutritional values"
- "Typical breakfast portion for active adults"

## Troubleshooting

**"API Key Needed" warning?**
- Make sure you saved the `.env.local` file
- Restart the development server: `npm run dev`
- Check the API key doesn't have extra spaces

**API errors?**
- Verify your API key is active in Anthropic Console
- Check you have API credits available
- Ensure your key starts with `sk-ant-`

## Cost Information

- Claude API pricing is very reasonable
- Nutrition analysis requests are small
- Typical usage: $0.01-0.05 per conversation
- You can set usage limits in Anthropic Console

## Ready to Test!

Once configured, your nutrition chat will be powered by real Claude AI - the experience will be dramatically better than the demo!