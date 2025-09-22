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

              {editingEntry === entry.id ? null : (
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

      {editingEntry && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <div className="edit-header">
              <h3>Edit Nutrition Values</h3>
              <div className="editing-meal-info">
                {entries.find(e => e.id === editingEntry)?.name}
              </div>
            </div>

            <div className="nutrition-edit-form-fullscreen">
              <div className="nutrition-edit-row-fullscreen">
                <label className="nutrition-edit-label-fullscreen">Calories:</label>
                <input
                  type="number"
                  value={editValues.calories}
                  onChange={(e) => setEditValues(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                  className="nutrition-edit-input-fullscreen"
                />
                <span className="nutrition-unit-fullscreen">cal</span>
              </div>

              <div className="nutrition-edit-row-fullscreen">
                <label className="nutrition-edit-label-fullscreen">Protein:</label>
                <input
                  type="number"
                  step="0.1"
                  value={editValues.protein}
                  onChange={(e) => setEditValues(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                  className="nutrition-edit-input-fullscreen"
                />
                <span className="nutrition-unit-fullscreen">g</span>
              </div>

              <div className="nutrition-edit-row-fullscreen">
                <label className="nutrition-edit-label-fullscreen">Carbs:</label>
                <input
                  type="number"
                  step="0.1"
                  value={editValues.carbs}
                  onChange={(e) => setEditValues(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                  className="nutrition-edit-input-fullscreen"
                />
                <span className="nutrition-unit-fullscreen">g</span>
              </div>

              <div className="nutrition-edit-row-fullscreen">
                <label className="nutrition-edit-label-fullscreen">Fats:</label>
                <input
                  type="number"
                  step="0.1"
                  value={editValues.fats}
                  onChange={(e) => setEditValues(prev => ({ ...prev, fats: parseFloat(e.target.value) || 0 }))}
                  className="nutrition-edit-input-fullscreen"
                />
                <span className="nutrition-unit-fullscreen">g</span>
              </div>
            </div>

            <div className="edit-actions-fullscreen">
              <button className="save-btn-fullscreen" onClick={() => saveEdits(editingEntry)}>
                💾 Save Changes
              </button>
              <button className="cancel-btn-fullscreen" onClick={cancelEditing}>
                ✗ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSection;