import { useState, useRef, useEffect } from 'react';
import { MealType } from '../types/nutrition';

// Simplified types to avoid import issues
interface SimpleMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  nutrition?: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    confidence: number;
  };
}

interface NutritionChatFixedProps {
  mealType: MealType;
  onMealConfirmed: (meal: any) => void;
  onCancel: () => void;
}

const NutritionChatFixed = ({ mealType, onMealConfirmed, onCancel }: NutritionChatFixedProps) => {
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMeal, setSuggestedMeal] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      console.log('NutritionChatFixed mounting for meal type:', mealType);

      const initialMessage: SimpleMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! I'm Master Shredder, your nutrition assistant. Tell me about your ${mealType} - what did you eat? Be as specific or general as you'd like, and I'll help figure out the nutrition details!`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      console.log('Initial message set successfully');
    } catch (error) {
      console.error('Error in NutritionChatFixed useEffect:', error);
    }
  }, [mealType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeFood = async (description: string): Promise<any> => {
    // Simplified nutrition analysis (avoiding complex service imports for now)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('chicken')) {
      return {
        name: 'Grilled Chicken with Rice',
        ingredients: [
          {
            name: 'Chicken Breast',
            amount: 6,
            unit: 'oz',
            nutrition: { calories: 280, protein: 52, carbs: 0, fats: 6 },
            inferred: false
          },
          {
            name: 'Brown Rice',
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
        ],
        totalNutrition: { calories: 540, protein: 57, carbs: 45, fats: 12.5 },
        confidence: 0.85
      };
    } else if (lowerDesc.includes('salmon')) {
      return {
        name: 'Grilled Salmon',
        ingredients: [
          {
            name: 'Salmon Fillet',
            amount: 6,
            unit: 'oz',
            nutrition: { calories: 350, protein: 40, carbs: 0, fats: 20 },
            inferred: false
          }
        ],
        totalNutrition: { calories: 350, protein: 40, carbs: 0, fats: 20 },
        confidence: 0.8
      };
    } else {
      return {
        name: 'Mixed Meal',
        ingredients: [
          {
            name: description,
            amount: 1,
            unit: 'serving',
            nutrition: { calories: 300, protein: 20, carbs: 30, fats: 10 },
            inferred: true
          }
        ],
        totalNutrition: { calories: 300, protein: 20, carbs: 30, fats: 10 },
        confidence: 0.6
      };
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: SimpleMessage = {
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

      const assistantMessage: SimpleMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Great! I analyzed "${currentInput}" and found: ${analysis.name}. Total nutrition: ${analysis.totalNutrition.calories} calories, ${analysis.totalNutrition.protein}g protein, ${analysis.totalNutrition.carbs}g carbs, ${analysis.totalNutrition.fats}g fat. Does this look accurate?`,
        timestamp: new Date(),
        nutrition: {
          name: analysis.name,
          calories: analysis.totalNutrition.calories,
          protein: analysis.totalNutrition.protein,
          carbs: analysis.totalNutrition.carbs,
          fats: analysis.totalNutrition.fats,
          confidence: analysis.confidence
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestedMeal(analysis);

    } catch (error) {
      console.error('Error analyzing food:', error);
      const errorMessage: SimpleMessage = {
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

  return (
    <div className="nutrition-chat-overlay">
      <div className="nutrition-chat-modal">
        <div className="chat-header">
          <h2>🥗 Master Shredder - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>

                {message.nutrition && (
                  <div className="suggested-meal">
                    <h4>📊 Nutrition Breakdown:</h4>
                    <div className="meal-summary">
                      <div className="meal-name">{message.nutrition.name}</div>
                      <div className="meal-nutrition">
                        {message.nutrition.calories} cal | {message.nutrition.protein}g protein | {message.nutrition.carbs}g carbs | {message.nutrition.fats}g fat
                      </div>
                    </div>
                    <div className="confidence-indicator">
                      <span className={`confidence ${message.nutrition.confidence > 0.8 ? 'high' : message.nutrition.confidence > 0.6 ? 'medium' : 'low'}`}>
                        Confidence: {Math.round(message.nutrition.confidence * 100)}%
                      </span>
                    </div>
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
                <button className="edit-btn" onClick={() => setCurrentInput("Let me make some changes...")}>
                  ✏️ Make Changes
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

export default NutritionChatFixed;