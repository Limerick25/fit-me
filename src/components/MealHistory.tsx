import { DailyMeals, FoodEntry } from '../types/nutrition';

interface MealHistoryProps {
  meals: DailyMeals;
  onEditEntry: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onClose: () => void;
}

const MealHistory = ({ meals, onEditEntry, onDeleteEntry, onClose }: MealHistoryProps) => {
  const getAllMeals = (): (FoodEntry & { mealType: string })[] => {
    const allMeals: (FoodEntry & { mealType: string })[] = [];

    Object.entries(meals).forEach(([mealType, entries]) => {
      entries.forEach(entry => {
        allMeals.push({ ...entry, mealType });
      });
    });

    // Sort by time if available, otherwise by order added
    return allMeals.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      return 0;
    });
  };

  const allMeals = getAllMeals();

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snacks': return '🍪';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'var(--primary-yellow)';
      case 'lunch': return 'var(--primary-orange)';
      case 'dinner': return 'var(--accent-purple)';
      case 'snacks': return 'var(--primary-green)';
      default: return 'var(--text-muted)';
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';

    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (allMeals.length === 0) {
    return (
      <div className="meal-history">
        <div className="meal-history-header">
          {/* Force fresh build - no title banner */}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No meals logged yet</h3>
          <p>Start by adding your first meal of the day!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-history">
      <div className="meal-history-header">
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="meal-summary">
        <div className="summary-stat">
          <div className="stat-value">{allMeals.length}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="summary-stat">
          <div className="stat-value">{allMeals.reduce((sum, meal) => sum + meal.calories, 0)}</div>
          <div className="stat-label">Total Calories</div>
        </div>
        <div className="summary-stat">
          <div className="stat-value">{Math.round(allMeals.reduce((sum, meal) => sum + meal.protein, 0))}g</div>
          <div className="stat-label">Total Protein</div>
        </div>
      </div>

      <div className="meals-list">
        {allMeals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <div className="meal-header">
              <div className="meal-type-badge" style={{ backgroundColor: getMealTypeColor(meal.mealType) }}>
                <span className="meal-type-icon">{getMealTypeIcon(meal.mealType)}</span>
                <span className="meal-type-text">{meal.mealType}</span>
              </div>
              {meal.timestamp && (
                <div className="meal-time">{formatTime(meal.timestamp)}</div>
              )}
            </div>

            <div className="meal-info">
              <h3 className="meal-name">{meal.name}</h3>
              <div className="meal-nutrition">
                <span className="nutrition-item calories">
                  {Math.round(meal.calories)} cal
                </span>
                <span className="nutrition-item protein">
                  {Math.round(meal.protein)}g protein
                </span>
                <span className="nutrition-item carbs">
                  {Math.round(meal.carbs)}g carbs
                </span>
                <span className="nutrition-item fats">
                  {Math.round(meal.fats)}g fat
                </span>
              </div>

              {meal.assumptions && meal.assumptions.length > 0 && (
                <div className="meal-assumptions">
                  <div className="assumptions-label">Assumptions:</div>
                  <ul className="assumptions-list">
                    {meal.assumptions.slice(0, 2).map((assumption, index) => (
                      <li key={index}>{assumption}</li>
                    ))}
                    {meal.assumptions.length > 2 && (
                      <li>+{meal.assumptions.length - 2} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="meal-actions">
              <button onClick={() => onEditEntry(meal.id)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => onDeleteEntry(meal.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealHistory;