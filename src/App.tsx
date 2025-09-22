import { useState, useEffect } from 'react';
import { DailyMeals, FoodEntry, MealType } from './types/nutrition';
import { ParsedMeal } from './types/conversation';
import { getStoredMeals, addFoodEntry } from './utils/storage';
import { calculateDailyNutrition, formatDate, generateId } from './utils/calculations';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MealSection from './components/MealSection';
import NutritionChatInteractive from './components/NutritionChatInteractive';
import NutritionChatProduction from './components/NutritionChatProduction';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<DailyMeals>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [showMealEntry, setShowMealEntry] = useState<{
    show: boolean;
    mealType: MealType | null;
  }>({ show: false, mealType: null });

  const dateString = formatDate(currentDate);

  useEffect(() => {
    const storedMeals = getStoredMeals(dateString);
    setMeals(storedMeals);
  }, [dateString]);

  const handleMealConfirmed = (mealType: MealType, parsedMeal: ParsedMeal) => {
    // Convert ParsedMeal ingredients to FoodEntry objects and add them
    parsedMeal.ingredients.forEach(ingredient => {
      const foodEntry: FoodEntry = {
        id: generateId(),
        name: ingredient.name,
        quantity: ingredient.amount,
        unit: ingredient.unit,
        nutrition: ingredient.nutrition,
        timestamp: new Date()
      };
      addFoodEntry(dateString, mealType, foodEntry);
    });

    const updatedMeals = getStoredMeals(dateString);
    setMeals(updatedMeals);
    setShowMealEntry({ show: false, mealType: null });
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const openMealEntry = (mealType: MealType) => {
    setShowMealEntry({ show: true, mealType });
  };

  const closeMealEntry = () => {
    setShowMealEntry({ show: false, mealType: null });
  };

  const dailyNutrition = calculateDailyNutrition(meals, dateString);

  return (
    <div className="app">
      <Header currentDate={currentDate} onDateChange={handleDateChange} />

      <main className="main-content">
        <Dashboard nutrition={dailyNutrition} />

        <div className="meals-container">
          <MealSection
            title="Breakfast"
            mealType="breakfast"
            entries={meals.breakfast}
            onAddFood={() => openMealEntry('breakfast')}
          />

          <MealSection
            title="Lunch"
            mealType="lunch"
            entries={meals.lunch}
            onAddFood={() => openMealEntry('lunch')}
          />

          <MealSection
            title="Dinner"
            mealType="dinner"
            entries={meals.dinner}
            onAddFood={() => openMealEntry('dinner')}
          />

          <MealSection
            title="Snacks"
            mealType="snacks"
            entries={meals.snacks}
            onAddFood={() => openMealEntry('snacks')}
          />
        </div>
      </main>

      {showMealEntry.show && showMealEntry.mealType && (
        <ErrorBoundary fallback={
          <div className="meal-entry-overlay">
            <div className="meal-entry-modal">
              <div className="modal-header">
                <h2>Error Loading Chat</h2>
                <button className="close-btn" onClick={closeMealEntry}>×</button>
              </div>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Sorry, there was an error loading the nutrition chat.</p>
                <button onClick={closeMealEntry} className="save-btn">
                  Close and Try Again
                </button>
              </div>
            </div>
          </div>
        }>
          <NutritionChatProduction
            mealType={showMealEntry.mealType}
            onMealConfirmed={(meal) => handleMealConfirmed(showMealEntry.mealType!, meal)}
            onCancel={closeMealEntry}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;