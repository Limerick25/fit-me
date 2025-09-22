# Master Shredder - Technical Plan

## STEP 2: PLAN Phase 🔄

## PROJECT ROADMAP 🗺️

**PHASE 1: Web App** (Claude Code is building now) ⬅️ **WE ARE HERE**
- React + TypeScript nutrition tracker
- Local storage for data
- Manual meal entry
- Basic nutrition calculations

**PHASE 2: Add AI Chat with Master Shredder personality**
- AI assistant for nutrition advice
- Personality-driven interactions
- Meal suggestions and guidance

**PHASE 3: Cloud sync for cross-device data**
- User accounts and authentication
- Database backend for data sync
- Access from multiple devices

**PHASE 4: SMS integration**
- Text-based meal logging
- SMS notifications and reminders
- Quick nutrition queries via text

**PHASE 5: Mobile app**
- Native iOS/Android app
- Camera-based food recognition
- Offline capabilities

## PHASE 1 FOCUS: Foundation for Future Growth

### Technology Stack (Smart Choices for Scaling!)
- **Frontend**: React 18 with TypeScript
- **Styling**: Vanilla CSS (clean and simple, easy to maintain)
- **Storage**: Browser localStorage (Phase 1) → Database (Phase 3)
- **Build Tool**: Vite (fast and modern)
- **Package Manager**: npm

**Why These Choices Set Us Up for Success**:
- **React**: Perfect foundation for both web (Phase 1) and mobile (Phase 5)
- **TypeScript**: Will be crucial for AI integration (Phase 2) and complex features
- **Component Architecture**: Easy to add chat components (Phase 2) and new features
- **Clean Data Models**: Will translate perfectly to cloud storage (Phase 3)

### Project Structure
```
fit-me/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MealSection.tsx
│   │   ├── MealEntry.tsx
│   │   └── NutritionSummary.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── nutrition.ts
│   ├── utils/              # Helper functions
│   │   ├── storage.ts      # localStorage functions
│   │   └── calculations.ts # nutrition calculations
│   ├── styles/             # CSS files
│   │   └── App.css
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                 # Static files
└── package.json           # Dependencies
```

### Data Models (TypeScript Types)
```typescript
// Nutrition info for a food item
interface NutritionInfo {
  calories: number;
  protein: number;    // grams
  carbs: number;      // grams
  fats: number;       // grams
}

// A single food entry
interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;       // "cup", "oz", "grams", etc.
  nutrition: NutritionInfo;
  timestamp: Date;
}

// Meals organized by type
interface DailyMeals {
  breakfast: FoodEntry[];
  lunch: FoodEntry[];
  dinner: FoodEntry[];
  snacks: FoodEntry[];
}
```

### Component Breakdown
1. **Header**: App name + date picker
2. **Dashboard**: Main container holding everything
3. **NutritionSummary**: Shows daily totals (calories, protein, carbs, fats)
4. **MealSection**: Container for each meal type (breakfast, lunch, etc.)
5. **MealEntry**: Form to add new food items

### Development Steps (Build Phase Preview)
1. Set up React + TypeScript project with Vite
2. Create basic component structure
3. Build data types and localStorage utilities
4. Create the main dashboard layout
5. Add meal entry functionality
6. Implement nutrition calculations
7. Make it responsive
8. Test and refine

### Why These Choices?
- **React + TypeScript**: Gives us type safety and component reusability
- **Vite**: Much faster than Create React App
- **Vanilla CSS**: Keeps it simple, easy to understand
- **localStorage**: No server needed, works offline
- **Component architecture**: Easy to add features later

## Future Phase Considerations Built Into Phase 1

**For Phase 2 (AI Chat)**:
- Component structure allows easy addition of chat interface
- Data models designed to work with AI recommendations
- TypeScript will help with AI API integrations

**For Phase 3 (Cloud Sync)**:
- Data models match what we'll need for database storage
- localStorage functions can be easily swapped for API calls
- User authentication can be added to existing header

**For Phase 4 (SMS)**:
- Same data models work for text-based input
- Meal entry logic can be reused for SMS parsing

**For Phase 5 (Mobile)**:
- React components can be adapted for React Native
- TypeScript types remain the same across platforms

## Ready to Build Phase 1! 🚀

This will create a clean, working prototype you can run with `npm run dev` that serves as the perfect foundation for all future phases!