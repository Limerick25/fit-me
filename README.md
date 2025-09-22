# 🥗 Master Shredder ⚡

AI-powered nutrition tracking with conversational food analysis using Claude AI.

## 🚀 Features

- **Conversational Food Entry**: Describe meals in natural language
- **AI-Powered Analysis**: Claude AI infers ingredients, portions, and cooking methods
- **Interactive Editing**: Modify AI assumptions and recalculate nutrition
- **Daily Tracking**: Complete nutrition dashboard with macro tracking
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **AI Integration**: Claude API (Anthropic)
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
- `src/components/NutritionChatInteractive.tsx` - Main AI chat interface
- `src/services/claudeNutritionService.ts` - Claude API integration
- `src/utils/storage.ts` - Local storage management
- `CLAUDE.md` - Detailed project documentation

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
