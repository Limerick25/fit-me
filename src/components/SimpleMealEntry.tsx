import { useState } from 'react';
import { MealType } from '../types/nutrition';

interface SimpleMealEntryProps {
  mealType: MealType;
  onCancel: () => void;
}

const SimpleMealEntry = ({ mealType, onCancel }: SimpleMealEntryProps) => {
  const [input, setInput] = useState('');

  return (
    <div className="meal-entry-overlay">
      <div className="meal-entry-modal">
        <div className="modal-header">
          <h2>Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="meal-entry-form">
          <div className="form-group">
            <label>Describe what you ate:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., grilled chicken with rice..."
              rows={4}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              The conversational nutrition assistant is being loaded...
            </p>
            <button onClick={onCancel} className="save-btn">
              Close for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMealEntry;