import { useState } from 'react';
import { FoodEntry, MealType } from '../types/nutrition';
import { generateId } from '../utils/calculations';
import { parseNaturalLanguageFood, createFoodEntryFromParsed, ParsedFoodData } from '../utils/nutritionParser';

interface MealEntryProps {
  mealType: MealType;
  onSave: (mealType: MealType, entry: FoodEntry) => void;
  onCancel: () => void;
}

const MealEntry = ({ mealType, onSave, onCancel }: MealEntryProps) => {
  const [entryMode, setEntryMode] = useState<'natural' | 'manual'>('natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResults, setParsedResults] = useState<ParsedFoodData[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'serving',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const handleNaturalLanguageParse = async () => {
    if (!naturalInput.trim()) {
      alert('Please describe what you ate');
      return;
    }

    setIsLoading(true);
    try {
      const results = await parseNaturalLanguageFood(naturalInput);
      setParsedResults(results);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to parse food description');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddParsedFood = (parsedData: ParsedFoodData) => {
    const entry = createFoodEntryFromParsed(parsedData);
    onSave(mealType, entry);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.calories) {
      alert('Please fill in the required fields: Food name, quantity, and calories');
      return;
    }

    const entry: FoodEntry = {
      id: generateId(),
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      nutrition: {
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0
      },
      timestamp: new Date()
    };

    onSave(mealType, entry);
  };

  return (
    <div className="meal-entry-overlay">
      <div className="meal-entry-modal">
        <div className="modal-header">
          <h2>Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="meal-entry-form">
          {/* Entry Mode Toggle */}
          <div className="entry-mode-toggle">
            <button
              type="button"
              className={`toggle-btn ${entryMode === 'natural' ? 'active' : ''}`}
              onClick={() => setEntryMode('natural')}
            >
              🗣️ Natural Language
            </button>
            <button
              type="button"
              className={`toggle-btn ${entryMode === 'manual' ? 'active' : ''}`}
              onClick={() => setEntryMode('manual')}
            >
              📝 Manual Entry
            </button>
          </div>

          {entryMode === 'natural' ? (
            <div className="natural-entry-section">
              <div className="form-group">
                <label htmlFor="natural-input">Describe what you ate:</label>
                <textarea
                  id="natural-input"
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                  placeholder="e.g., grilled chicken breast with brown rice and steamed broccoli"
                  rows={3}
                  className="natural-input"
                />
              </div>

              <button
                type="button"
                onClick={handleNaturalLanguageParse}
                disabled={isLoading || !naturalInput.trim()}
                className="parse-btn"
              >
                {isLoading ? '🤔 Analyzing...' : '✨ Parse Food'}
              </button>

              {parsedResults.length > 0 && (
                <div className="parsed-results">
                  <h3>Found these foods:</h3>
                  {parsedResults.map((result, index) => (
                    <div key={index} className="parsed-food-item">
                      <div className="food-summary">
                        <div className="food-name">{result.name}</div>
                        <div className="food-details">
                          {result.quantity} {result.unit} • {result.nutrition.calories} cal
                        </div>
                        <div className="food-macros">
                          P: {result.nutrition.protein}g | C: {result.nutrition.carbs}g | F: {result.nutrition.fats}g
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddParsedFood(result)}
                        className="add-parsed-btn"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="manual-entry-link">
                <p>Not finding what you're looking for? <button type="button" onClick={() => setEntryMode('manual')} className="link-btn">Try manual entry</button></p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="manual-entry-section">
              <div className="form-group">
                <label htmlFor="name">Food Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grilled chicken breast"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="1"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    <option value="serving">serving</option>
                    <option value="cup">cup</option>
                    <option value="oz">oz</option>
                    <option value="grams">grams</option>
                    <option value="piece">piece</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                  </select>
                </div>
              </div>

              <div className="nutrition-inputs">
                <h3>Nutrition Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="calories">Calories *</label>
                    <input
                      type="number"
                      id="calories"
                      name="calories"
                      value={formData.calories}
                      onChange={handleInputChange}
                      placeholder="250"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="protein">Protein (g)</label>
                    <input
                      type="number"
                      id="protein"
                      name="protein"
                      value={formData.protein}
                      onChange={handleInputChange}
                      placeholder="25"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="carbs">Carbs (g)</label>
                    <input
                      type="number"
                      id="carbs"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleInputChange}
                      placeholder="0"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fats">Fats (g)</label>
                    <input
                      type="number"
                      id="fats"
                      name="fats"
                      value={formData.fats}
                      onChange={handleInputChange}
                      placeholder="5"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Food
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealEntry;