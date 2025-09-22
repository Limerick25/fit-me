import { useState, useRef, useEffect } from 'react';
import { MealType } from '../types/nutrition';
import { testClaudeAPI, checkEnvironmentVariables } from '../utils/claudeTest';

interface EditableNutrition {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  assumptions: string[];
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    nutrition: { calories: number; protein: number; carbs: number; fats: number };
    inferred: boolean;
  }>;
}

interface InteractiveMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  nutrition?: EditableNutrition;
  isEditing?: boolean;
}

interface NutritionChatInteractiveProps {
  mealType: MealType;
  onMealConfirmed: (meal: any) => void;
  onCancel: () => void;
}

const NutritionChatInteractive = ({ mealType, onMealConfirmed, onCancel }: NutritionChatInteractiveProps) => {
  const [messages, setMessages] = useState<InteractiveMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMeal, setSuggestedMeal] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage: InteractiveMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Hi! I'm Master Shredder, your nutrition assistant. Tell me about your ${mealType} - what did you eat? I'll analyze it and show you my assumptions so you can edit anything that looks off!`,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [mealType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const extractNumber = (text: string, keyword: string): number | null => {
    const regex = new RegExp(`(\\d+)\\s*${keyword}`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : null;
  };

  const analyzeFood = async (description: string): Promise<EditableNutrition> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('chicken')) {
      const size = lowerDesc.includes('8') ? 8 : 6;
      return {
        name: 'Grilled Chicken with Rice',
        calories: size * 35 + 220 + 40, // chicken + rice + oil
        protein: size * 6.5 + 5,
        carbs: 45,
        fats: size * 1 + 2 + 4.5,
        confidence: 0.85,
        assumptions: [
          `Assuming ${size}oz chicken breast (boneless, skinless)`,
          'Assuming 1 cup cooked brown rice',
          'Assuming 1 tsp olive oil for cooking',
          'Assuming basic seasoning (salt & pepper)',
          'Assuming grilled cooking method',
          'Assuming no additional sauces or butter'
        ],
        ingredients: [
          {
            name: 'Chicken Breast',
            amount: size,
            unit: 'oz',
            nutrition: { calories: size * 35, protein: size * 6.5, carbs: 0, fats: size * 1 },
            inferred: false
          },
          {
            name: 'Brown Rice (cooked)',
            amount: 1,
            unit: 'cup',
            nutrition: { calories: 220, protein: 5, carbs: 45, fats: 2 },
            inferred: false
          },
          {
            name: 'Olive Oil',
            amount: 1,
            unit: 'tsp',
            nutrition: { calories: 40, protein: 0, carbs: 0, fats: 4.5 },
            inferred: true
          }
        ]
      };
    } else if (lowerDesc.includes('salmon')) {
      return {
        name: 'Grilled Salmon',
        calories: 350,
        protein: 40,
        carbs: 0,
        fats: 20,
        confidence: 0.8,
        assumptions: [
          'Assuming 6oz salmon fillet (Atlantic)',
          'Assuming grilled with minimal oil',
          'Assuming wild-caught salmon',
          'Assuming no breading or sauces',
          'Assuming skin removed'
        ],
        ingredients: [
          {
            name: 'Salmon Fillet',
            amount: 6,
            unit: 'oz',
            nutrition: { calories: 350, protein: 40, carbs: 0, fats: 20 },
            inferred: false
          }
        ]
      };
    } else if (lowerDesc.includes('greek yogurt') || lowerDesc.includes('yogurt')) {
      const hasBlueberries = lowerDesc.includes('blueberr');
      const baseCalories = 130; // Chobani nonfat plain
      const berryCalories = hasBlueberries ? 80 : 0;

      return {
        name: hasBlueberries ? 'Greek Yogurt with Blueberries' : 'Greek Yogurt',
        calories: baseCalories + berryCalories,
        protein: hasBlueberries ? 22 : 20,
        carbs: hasBlueberries ? 28 : 8,
        fats: hasBlueberries ? 0.5 : 0,
        confidence: 0.75,
        assumptions: [
          'Assuming 1 cup (227g) Chobani Plain Nonfat Greek Yogurt',
          ...(hasBlueberries ? [
            'Assuming 1/2 cup fresh blueberries (74g)',
            'Assuming organic blueberries, not frozen or dried'
          ] : []),
          'Assuming no added sweeteners or granola',
          'Assuming served plain without honey or sugar',
          'Based on USDA nutrition database values',
          'Common breakfast/snack portion size'
        ],
        ingredients: [
          {
            name: 'Chobani Plain Nonfat Greek Yogurt',
            amount: 1,
            unit: 'cup',
            nutrition: { calories: 130, protein: 20, carbs: 8, fats: 0 },
            inferred: false
          },
          ...(hasBlueberries ? [{
            name: 'Fresh Blueberries',
            amount: 0.5,
            unit: 'cup',
            nutrition: { calories: 80, protein: 2, carbs: 20, fats: 0.5 },
            inferred: false
          }] : [])
        ]
      };
    } else if (lowerDesc.includes('egg')) {
      const eggCount = this.extractNumber(lowerDesc, 'egg') || 2;
      const hasToast = lowerDesc.includes('toast');
      const eggCalories = eggCount * 70;
      const toastCalories = hasToast ? 80 : 0;
      const butterCalories = hasToast ? 36 : 12; // butter for cooking eggs

      return {
        name: `${eggCount} Scrambled Eggs${hasToast ? ' with Toast' : ''}`,
        calories: eggCalories + toastCalories + butterCalories,
        protein: eggCount * 6 + (hasToast ? 3 : 0),
        carbs: eggCount * 1 + (hasToast ? 15 : 0),
        fats: eggCount * 5 + (hasToast ? 4 : 1),
        confidence: 0.8,
        assumptions: [
          `Assuming ${eggCount} large grade A eggs (50g each)`,
          'Assuming scrambled cooking method with 1 tsp butter',
          'Assuming cage-free or conventional eggs',
          ...(hasToast ? [
            'Assuming 1 slice whole wheat bread, toasted',
            'Assuming 1 tsp butter on toast',
            'Assuming standard sandwich bread (28g slice)'
          ] : []),
          'No salt, pepper, or other seasonings counted',
          'Based on USDA FoodData Central values'
        ],
        ingredients: [
          {
            name: 'Large Eggs',
            amount: eggCount,
            unit: 'piece',
            nutrition: { calories: eggCalories, protein: eggCount * 6, carbs: eggCount * 1, fats: eggCount * 5 },
            inferred: false
          },
          {
            name: 'Butter (for cooking)',
            amount: hasToast ? 2 : 1,
            unit: 'tsp',
            nutrition: { calories: hasToast ? 36 : 12, protein: 0, carbs: 0, fats: hasToast ? 4 : 1 },
            inferred: true
          },
          ...(hasToast ? [{
            name: 'Whole Wheat Bread',
            amount: 1,
            unit: 'slice',
            nutrition: { calories: 80, protein: 3, carbs: 15, fats: 1 },
            inferred: false
          }] : [])
        ]
      };
    } else {
      return {
        name: 'Mixed Meal',
        calories: 300,
        protein: 20,
        carbs: 30,
        fats: 10,
        confidence: 0.4,
        assumptions: [
          'Need more specific details to provide accurate analysis',
          'Generic estimate based on limited information',
          'Please describe: portion size, cooking method, brand if known',
          'Example: "1 cup oatmeal with banana and almond milk"',
          'More details = higher accuracy and confidence'
        ],
        ingredients: [
          {
            name: description,
            amount: 1,
            unit: 'serving',
            nutrition: { calories: 300, protein: 20, carbs: 30, fats: 10 },
            inferred: true
          }
        ]
      };
    }
  };

  const handleTestClaudeAPI = async () => {
    setApiTestResult('Testing Claude API...');

    const envCheck = checkEnvironmentVariables();
    console.log('Environment check:', envCheck);

    const result = await testClaudeAPI();
    setApiTestResult(result.success ?
      `${result.message} Response: ${result.data}` :
      result.message
    );
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: InteractiveMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const analysis = await analyzeFood(currentInput);

      const assistantMessage: InteractiveMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I analyzed "${currentInput}" and here's what I found. You can edit any of the numbers or assumptions below:`,
        timestamp: new Date(),
        nutrition: analysis
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestedMeal(analysis);

    } catch (error) {
      console.error('Error analyzing food:', error);
      const errorMessage: InteractiveMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble analyzing that. Could you try describing your meal again?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNutritionEdit = (messageId: string, field: keyof Pick<EditableNutrition, 'calories' | 'protein' | 'carbs' | 'fats'>, value: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.nutrition) {
        const updatedNutrition = { ...msg.nutrition, [field]: value };
        // Recalculate confidence based on edits
        updatedNutrition.confidence = Math.max(0.9, updatedNutrition.confidence);
        setSuggestedMeal(updatedNutrition);
        return { ...msg, nutrition: updatedNutrition };
      }
      return msg;
    }));
  };

  const handleAssumptionEdit = (messageId: string, index: number, newAssumption: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.nutrition) {
        const updatedAssumptions = [...msg.nutrition.assumptions];
        updatedAssumptions[index] = newAssumption;
        const updatedNutrition = { ...msg.nutrition, assumptions: updatedAssumptions };
        setSuggestedMeal(updatedNutrition);
        return { ...msg, nutrition: updatedNutrition };
      }
      return msg;
    }));
  };

  const toggleEditMode = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isEditing: !msg.isEditing };
      }
      return msg;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfirmMeal = () => {
    if (suggestedMeal) {
      onMealConfirmed(suggestedMeal);
    }
  };

  const requestRecalculation = () => {
    setCurrentInput("Please recalculate based on my edits");
    handleSendMessage();
  };

  return (
    <div className="nutrition-chat-overlay">
      <div className="nutrition-chat-modal">
        <div className="chat-header">
          <h2>🥗 Master Shredder - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
          <button
            className="test-api-btn"
            onClick={handleTestClaudeAPI}
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🧪 Test Claude API
          </button>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        {apiTestResult && (
          <div style={{
            padding: '10px',
            margin: '10px',
            background: '#f0f0f0',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '13px',
            border: '1px solid #ddd'
          }}>
            <strong>🧪 Claude API Test Result:</strong>
            <div style={{ marginTop: '5px' }}>{apiTestResult}</div>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>

                {message.nutrition && (
                  <div className="suggested-meal">
                    <div className="meal-header-controls">
                      <h4>📊 Nutrition Breakdown:</h4>
                      <button
                        className={`edit-toggle-btn ${message.isEditing ? 'active' : ''}`}
                        onClick={() => toggleEditMode(message.id)}
                      >
                        {message.isEditing ? '💾 Done Editing' : '✏️ Edit'}
                      </button>
                    </div>

                    <div className="meal-summary">
                      <div className="meal-name">{message.nutrition.name}</div>

                      <div className="editable-nutrition">
                        <div className="nutrition-row">
                          <label>Calories:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              value={message.nutrition.calories}
                              onChange={(e) => handleNutritionEdit(message.id, 'calories', parseInt(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.nutrition.calories} cal</span>
                          )}
                        </div>

                        <div className="nutrition-row">
                          <label>Protein:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={message.nutrition.protein}
                              onChange={(e) => handleNutritionEdit(message.id, 'protein', parseFloat(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.nutrition.protein}g</span>
                          )}
                        </div>

                        <div className="nutrition-row">
                          <label>Carbs:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={message.nutrition.carbs}
                              onChange={(e) => handleNutritionEdit(message.id, 'carbs', parseFloat(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.nutrition.carbs}g</span>
                          )}
                        </div>

                        <div className="nutrition-row">
                          <label>Fats:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={message.nutrition.fats}
                              onChange={(e) => handleNutritionEdit(message.id, 'fats', parseFloat(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.nutrition.fats}g</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="assumptions-section">
                      <h5>🤔 My Assumptions:</h5>
                      <div className="assumptions-list">
                        {message.nutrition.assumptions.map((assumption, index) => (
                          <div key={index} className="assumption-item">
                            {message.isEditing ? (
                              <input
                                type="text"
                                value={assumption}
                                onChange={(e) => handleAssumptionEdit(message.id, index, e.target.value)}
                                className="assumption-input"
                              />
                            ) : (
                              <span className="assumption-text">• {assumption}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="confidence-indicator">
                      <span className={`confidence ${message.nutrition.confidence > 0.8 ? 'high' : message.nutrition.confidence > 0.6 ? 'medium' : 'low'}`}>
                        Confidence: {Math.round(message.nutrition.confidence * 100)}%
                      </span>
                    </div>

                    {message.isEditing && (
                      <div className="edit-actions">
                        <button className="recalculate-btn" onClick={requestRecalculation}>
                          🔄 Ask me to recalculate
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-section">
          {suggestedMeal && (
            <div className="meal-confirmation">
              <p>Ready to log this meal?</p>
              <div className="confirmation-buttons">
                <button className="confirm-btn" onClick={handleConfirmMeal}>
                  ✅ Log This Meal
                </button>
                <button className="edit-btn" onClick={() => setCurrentInput("Actually, let me make some changes...")}>
                  💬 Continue Chat
                </button>
              </div>
            </div>
          )}

          <div className="chat-input">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you ate... (e.g., 'grilled chicken breast with brown rice')"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isLoading}
              className="send-btn"
            >
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChatInteractive;