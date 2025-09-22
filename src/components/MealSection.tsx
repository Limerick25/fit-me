import { useState } from 'react';
import { FoodEntry, MealType } from '../types/nutrition';

interface MealSectionProps {
  title: string;
  mealType: MealType;
  entries: FoodEntry[];
  onAddFood: () => void;
  onDeleteEntry: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updatedEntry: Partial<FoodEntry>) => void;
}

const MealSection = ({ title, mealType, entries, onAddFood, onDeleteEntry, onUpdateEntry }: MealSectionProps) => {
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ calories: number; protein: number; carbs: number; fats: number }>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const mealTotal = entries.reduce(
    (total, entry) => total + entry.nutrition.calories,
    0
  );

  const startEditing = (entry: FoodEntry) => {
    setEditingEntry(entry.id);
    setEditValues({
      calories: entry.nutrition.calories,
      protein: entry.nutrition.protein,
      carbs: entry.nutrition.carbs,
      fats: entry.nutrition.fats
    });
  };

  const saveEdits = (entryId: string) => {
    onUpdateEntry(entryId, {
      nutrition: editValues
    });
    setEditingEntry(null);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
  };

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

              {editingEntry === entry.id ? (
                <div className="food-nutrition-edit">
                  <div className="nutrition-edit-form">
                    <div className="nutrition-edit-row">
                      <label className="nutrition-edit-label">Calories:</label>
                      <input
                        type="number"
                        value={editValues.calories}
                        onChange={(e) => setEditValues(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                        className="nutrition-edit-input"
                      />
                    </div>
                    <div className="nutrition-edit-row">
                      <label className="nutrition-edit-label">Protein:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editValues.protein}
                        onChange={(e) => setEditValues(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                        className="nutrition-edit-input"
                      />
                      <span className="nutrition-unit">g</span>
                    </div>
                    <div className="nutrition-edit-row">
                      <label className="nutrition-edit-label">Carbs:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editValues.carbs}
                        onChange={(e) => setEditValues(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                        className="nutrition-edit-input"
                      />
                      <span className="nutrition-unit">g</span>
                    </div>
                    <div className="nutrition-edit-row">
                      <label className="nutrition-edit-label">Fats:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editValues.fats}
                        onChange={(e) => setEditValues(prev => ({ ...prev, fats: parseFloat(e.target.value) || 0 }))}
                        className="nutrition-edit-input"
                      />
                      <span className="nutrition-unit">g</span>
                    </div>
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => saveEdits(entry.id)}>
                      💾 Save
                    </button>
                    <button className="cancel-btn" onClick={cancelEditing}>
                      ✗ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="food-nutrition">
                  <span className="food-calories">{entry.nutrition.calories} cal</span>
                  <div className="entry-actions">
                    <button className="edit-entry-btn" onClick={() => startEditing(entry)}>✏️</button>
                    <button className="delete-entry-btn" onClick={() => onDeleteEntry(entry.id)}>🗑️</button>
                  </div>
                </div>
              )}
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