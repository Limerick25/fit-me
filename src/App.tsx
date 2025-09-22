import { useState, useEffect } from 'react';
import { DailyMeals, FoodEntry, MealType } from './types/nutrition';
import { ParsedMeal } from './types/conversation';
import { getStoredMeals, addFoodEntry, removeFoodEntry, updateFoodEntry } from './utils/storage';
import { calculateDailyNutrition, formatDate, generateId } from './utils/calculations';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MealSection from './components/MealSection';
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

  const handleDeleteEntry = (mealType: MealType, entryId: string) => {
    removeFoodEntry(dateString, mealType, entryId);
    const updatedMeals = getStoredMeals(dateString);
    setMeals(updatedMeals);
  };

  const handleUpdateEntry = (mealType: MealType, entryId: string, updatedEntry: Partial<FoodEntry>) => {
    updateFoodEntry(dateString, mealType, entryId, updatedEntry);
    const updatedMeals = getStoredMeals(dateString);
    setMeals(updatedMeals);
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
            onDeleteEntry={(entryId) => handleDeleteEntry('breakfast', entryId)}
            onUpdateEntry={(entryId, updatedEntry) => handleUpdateEntry('breakfast', entryId, updatedEntry)}
          />

          <MealSection
            title="Lunch"
            mealType="lunch"
            entries={meals.lunch}
            onAddFood={() => openMealEntry('lunch')}
            onDeleteEntry={(entryId) => handleDeleteEntry('lunch', entryId)}
            onUpdateEntry={(entryId, updatedEntry) => handleUpdateEntry('lunch', entryId, updatedEntry)}
          />

          <MealSection
            title="Dinner"
            mealType="dinner"
            entries={meals.dinner}
            onAddFood={() => openMealEntry('dinner')}
            onDeleteEntry={(entryId) => handleDeleteEntry('dinner', entryId)}
            onUpdateEntry={(entryId, updatedEntry) => handleUpdateEntry('dinner', entryId, updatedEntry)}
          />

          <MealSection
            title="Snacks"
            mealType="snacks"
            entries={meals.snacks}
            onAddFood={() => openMealEntry('snacks')}
            onDeleteEntry={(entryId) => handleDeleteEntry('snacks', entryId)}
            onUpdateEntry={(entryId, updatedEntry) => handleUpdateEntry('snacks', entryId, updatedEntry)}
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