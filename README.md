# 🥗 Master Shredder ⚡

AI-powered nutrition tracking with conversational food analysis using Claude Sonnet 4. **LIVE & FULLY FUNCTIONAL!** 🌐

**🎉 Try it now: [master-shredder.vercel.app](https://master-shredder.vercel.app)**

## 🚀 Features

### ✅ **Production-Ready Features**
- **🤖 Claude Sonnet 4 Integration**: Advanced AI nutrition analysis
- **💬 Streamlined Food Entry**: Simple "What did you eat?" workflow
- **📊 Real-time Nutrition Tracking**: Live dashboard with daily totals
- **✏️ Full-Screen Editing**: Professional edit experience for any meal entry
- **🗑️ Delete Functionality**: Remove meals with one click
- **📱 Responsive Design**: Perfect on desktop, tablet, and mobile
- **🔗 Transparent Sources**: Clear distinction between assumptions and data sources

### 🧠 **AI-Powered Analysis**
- **Smart Portion Estimation**: "1 cup (227g)" instead of "average serving"
- **Brand Recognition**: Identifies specific brands (Chobani, Dannon, etc.)
- **Cooking Method Detection**: Accounts for oils, seasonings, preparation
- **Confidence Scoring**: Shows how certain the AI is about estimates

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **AI Integration**: Claude Sonnet 4 (Anthropic) via Vercel serverless functions
- **Deployment**: Vercel with automatic GitHub integration
- **Backend**: Vercel serverless functions (solves CORS, secures API keys)
- **Styling**: Modern CSS with responsive design
- **Data**: Local storage (browser-based)

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/master-shredder.git
cd master-shredder

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Claude API key to .env.local
VITE_CLAUDE_API_KEY=your_claude_api_key_here
VITE_CLAUDE_MODEL=claude-3-sonnet-20240229

# Start ZERO-EFFORT development mode (RECOMMENDED)
npm start
```

**🎉 That's it!** The app runs at [http://localhost:5173](http://localhost:5173) and **automatically commits all your changes to GitHub** as you code!

### 🤖 Zero-Effort Development
- **Code normally** in VS Code
- **Files auto-save** after 1 second
- **Auto-commits** 10 seconds after you stop editing
- **Auto-pushes** to GitHub with smart commit messages
- **Auto-updates** documentation
- **Never lose work again!**

## 🎯 How to Use

1. **Add a Meal**: Click "Add Food" on any meal section
2. **Describe Your Food**: Type naturally: "grilled chicken breast with rice and steamed broccoli"
3. **Review AI Analysis**: See detailed nutrition breakdown with ingredient assumptions
4. **Edit & Refine**: Modify any values and let AI recalculate
5. **Log Your Meal**: Save to your daily nutrition tracking

### Example Interactions

```
You: "scrambled eggs with cheese for breakfast"

AI: I analyzed your breakfast:
• 2 large eggs (140 cal) - common breakfast portion
• 1 tsp butter for cooking (35 cal)
• 1 oz cheddar cheese (110 cal) - standard serving

Total: 285 calories, 20g protein, 2g carbs, 22g fat
Confidence: 85%

[All values are editable inline]
```

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
├── services/           # API integration
├── utils/              # Helper functions
├── types/              # TypeScript definitions
└── styles/             # CSS styling
```

### Key Files
- `src/components/NutritionChatProduction.tsx` - Production AI chat interface
- `src/components/MealSection.tsx` - Meal display with edit/delete functionality
- `api/analyze-food.js` - Vercel serverless function for Claude API
- `src/utils/storage.ts` - Local storage management with CRUD operations
- `CLAUDE.md` - Comprehensive project documentation

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚧 Current Limitations

- **CORS Restriction**: Direct browser → Claude API calls are blocked
- **Backend Required**: Need Express server for production deployment
- **Local Storage Only**: Data not synced across devices

## 🎯 Roadmap

### Phase 1: Backend Integration ✨ Next
- [ ] Express server with Claude API proxy
- [ ] Vercel deployment pipeline
- [ ] Environment variable management

### Phase 2: Production Features
- [ ] User authentication
- [ ] Cloud data persistence
- [ ] Mobile app development
- [ ] Advanced nutrition analytics

## 🤝 Contributing

This is a personal project currently in active development. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Claude AI Documentation](https://docs.anthropic.com/)
- [Project Documentation](CLAUDE.md)
- [GitHub Repository](https://github.com/Limerick25/master-shredder)
- [Live Demo](https://master-shredder.vercel.app) (Coming Soon)

---

Built with ❤️ and Claude AI
