import { useState, useEffect } from 'react';
import { DailyMeals, FoodEntry, DailyNutrition } from './types/nutrition';
import { ParsedMeal } from './types/conversation';
import { getStoredMeals, addFoodEntry, removeFoodEntry, updateFoodEntry } from './utils/storage';
import { calculateDailyNutrition, formatDate, generateId } from './utils/calculations';
import Header from './components/Header';
import FitnessDashboard from './components/FitnessDashboard';
import FitnessActions from './components/FitnessActions';
import MealHistory from './components/MealHistory';
import NutritionChatProduction from './components/NutritionChatProduction';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

type ViewState = 'dashboard' | 'add-food' | 'view-food' | 'edit-entry';

function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<DailyMeals>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const dateString = formatDate(currentDate);

  useEffect(() => {
    const storedMeals = getStoredMeals(dateString);
    setMeals(storedMeals);
  }, [dateString]);

  // Calculate daily nutrition totals
  const dailyNutrition: DailyNutrition = calculateDailyNutrition(meals);

  // Get total number of meal entries
  const totalMealEntries = Object.values(meals).flat().length;

  const handleMealConfirmed = (parsedMeal: ParsedMeal) => {
    const foodEntry: FoodEntry = {
      id: generateId(),
      name: parsedMeal.name,
      calories: parsedMeal.calories,
      protein: parsedMeal.protein,
      carbs: parsedMeal.carbs,
      fats: parsedMeal.fats,
      fiber: parsedMeal.fiber,
      sodium: parsedMeal.sodium,
      sugar: parsedMeal.sugar,
      saturatedFat: parsedMeal.saturatedFat,
      cholesterol: parsedMeal.cholesterol,
      potassium: parsedMeal.potassium,
      vitaminC: parsedMeal.vitaminC,
      iron: parsedMeal.iron,
      calcium: parsedMeal.calcium,
      vitaminA: parsedMeal.vitaminA,
      quantity: parsedMeal.quantity,
      unit: parsedMeal.unit,
      timestamp: new Date().toISOString(),
      assumptions: parsedMeal.assumptions,
      sources: parsedMeal.sources,
      confidence: parsedMeal.confidence
    };

    // Default to snacks if no specific meal type chosen
    const mealType = 'snacks';
    const updatedMeals = addFoodEntry(meals, mealType, foodEntry, dateString);
    setMeals(updatedMeals);
    setCurrentView('dashboard');
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedMeals = removeFoodEntry(meals, entryId, dateString);
    setMeals(updatedMeals);
  };

  const handleEditEntry = (entryId: string) => {
    setEditingEntryId(entryId);
    setCurrentView('edit-entry');
  };

  const handleUpdateEntry = (updatedEntry: FoodEntry) => {
    const updatedMeals = updateFoodEntry(meals, updatedEntry, dateString);
    setMeals(updatedMeals);
    setEditingEntryId(null);
    setCurrentView('view-food');
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    setCurrentView('dashboard'); // Return to dashboard when changing dates
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'add-food':
        return (
          <ErrorBoundary>
            <div className="chat-container">
              <div className="chat-header">
                <h2>Add Food Entry</h2>
                <button
                  className="close-btn"
                  onClick={() => setCurrentView('dashboard')}
                >
                  ✕
                </button>
              </div>
              <NutritionChatProduction
                onMealConfirmed={handleMealConfirmed}
                onClose={() => setCurrentView('dashboard')}
              />
            </div>
          </ErrorBoundary>
        );

      case 'view-food':
        return (
          <MealHistory
            meals={meals}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onClose={() => setCurrentView('dashboard')}
          />
        );

      case 'edit-entry':
        // Find the entry being edited
        const entryToEdit = Object.values(meals)
          .flat()
          .find(entry => entry.id === editingEntryId);

        if (!entryToEdit) {
          setCurrentView('dashboard');
          return null;
        }

        return (
          <div className="edit-container">
            <div className="edit-header">
              <h2>Edit Food Entry</h2>
              <button
                className="close-btn"
                onClick={() => setCurrentView('view-food')}
              >
                ✕
              </button>
            </div>
            {/* Edit form would go here - for now, just show a placeholder */}
            <div className="edit-form">
              <p>Edit functionality coming soon...</p>
              <p>Entry: {entryToEdit.name}</p>
              <button onClick={() => setCurrentView('view-food')}>
                Back to Food List
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="main-content">
            <FitnessDashboard nutrition={dailyNutrition} />
            <FitnessActions
              onAddFood={() => setCurrentView('add-food')}
              onViewFood={() => setCurrentView('view-food')}
              totalMeals={totalMealEntries}
            />
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Header
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;