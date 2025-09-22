import { FoodEntry, MealType } from '../types/nutrition';

interface MealSectionProps {
  title: string;
  mealType: MealType;
  entries: FoodEntry[];
  onAddFood: () => void;
}

const MealSection = ({ title, mealType, entries, onAddFood }: MealSectionProps) => {
  const mealTotal = entries.reduce(
    (total, entry) => total + entry.nutrition.calories,
    0
  );

  return (
    <div className="meal-section">
      <div className="meal-header">
        <h3 className="meal-title">{title}</h3>
        <div className="meal-calories">{Math.round(mealTotal)} cal</div>
      </div>

      <div className="meal-entries">
        {entries.length === 0 ? (
          <p className="no-entries">No items logged yet</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="food-entry">
              <div className="food-info">
                <span className="food-name">{entry.name}</span>
                <span className="food-details">
                  {entry.quantity} {entry.unit}
                </span>
              </div>
              <div className="food-nutrition">
                <span className="food-calories">{entry.nutrition.calories} cal</span>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="add-food-btn" onClick={onAddFood}>
        + Add Food
      </button>
    </div>
  );
};

export default MealSection;