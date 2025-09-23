import { useState, useRef, useEffect } from 'react';
import { MealType } from '../types/nutrition';
import { ClaudeNutritionServiceProduction } from '../services/claudeNutritionServiceProduction';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  meal?: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    confidence: number;
    assumptions: string[];
    sources?: Array<{
      name: string;
      description: string;
      url: string;
      note?: string;
    }>;
    ingredients: Array<{
      name: string;
      amount: number;
      unit: string;
      nutrition: { calories: number; protein: number; carbs: number; fats: number };
      inferred: boolean;
    }>;
  };
  isEditing?: boolean;
}

interface NutritionChatProductionProps {
  mealType: MealType;
  onMealConfirmed: (meal: any) => void;
  onCancel: () => void;
}

const NutritionChatProduction = ({ mealType, onMealConfirmed, onCancel }: NutritionChatProductionProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMeal, setSuggestedMeal] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [claudeService] = useState(() => new ClaudeNutritionServiceProduction());

  useEffect(() => {
    // Start with empty messages for clean interface
    setMessages([]);
    setApiStatus('ready');
  }, [mealType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(-4).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call production Claude API through backend
      const analysis = await claudeService.analyzeFood(
        currentInput,
        conversationHistory,
        {} // User profile would come from memory service
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: analysis.response,
        timestamp: new Date(),
        meal: analysis.meal
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (analysis.meal) {
        setSuggestedMeal(analysis.meal);
      }

    } catch (error) {
      console.error('Error getting Claude analysis:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, I had trouble analyzing that. Could you try again?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNutritionEdit = (messageId: string, field: 'calories' | 'protein' | 'carbs' | 'fats', value: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.meal) {
        const updatedMeal = { ...msg.meal, [field]: value };
        // Boost confidence when user edits (they're correcting it)
        updatedMeal.confidence = Math.max(0.9, updatedMeal.confidence);
        setSuggestedMeal(updatedMeal);
        return { ...msg, meal: updatedMeal };
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
    setCurrentInput("Please recalculate based on my edits above");
  };

  return (
    <div className="nutrition-chat-overlay">
      <div className="nutrition-chat-modal">
        <div className="chat-header">
          <h2>Add Food Entry</h2>
          <div className="api-status">
            {apiStatus === 'checking' && (
              <span className="status-checking">🔄 Connecting...</span>
            )}
            {apiStatus === 'ready' && (
              <span className="status-good">Powered by Claude Sonnet 4</span>
            )}
            {apiStatus === 'error' && (
              <span className="status-error">❌ Connection Issue</span>
            )}
          </div>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>

                {message.meal && (
                  <div className="suggested-meal">
                    <div className="meal-header-controls">
                      <h4>🧠 Claude's Analysis:</h4>
                      <button
                        className={`edit-toggle-btn ${message.isEditing ? 'active' : ''}`}
                        onClick={() => toggleEditMode(message.id)}
                      >
                        {message.isEditing ? '💾 Done Editing' : '✏️ Edit'}
                      </button>
                    </div>

                    <div className="meal-summary">
                      <div className="meal-name">{message.meal.name}</div>

                      <div className="editable-nutrition">
                        <div className="nutrition-row">
                          <label>Calories:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              value={message.meal.calories}
                              onChange={(e) => handleNutritionEdit(message.id, 'calories', parseInt(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.meal.calories} cal</span>
                          )}
                        </div>

                        <div className="nutrition-row">
                          <label>Protein:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={message.meal.protein}
                              onChange={(e) => handleNutritionEdit(message.id, 'protein', parseFloat(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.meal.protein}g</span>
                          )}
                        </div>

                        <div className="nutrition-row">
                          <label>Carbs:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={message.meal.carbs}
                              onChange={(e) => handleNutritionEdit(message.id, 'carbs', parseFloat(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.meal.carbs}g</span>
                          )}
                        </div>

                        <div className="nutrition-row">
                          <label>Fats:</label>
                          {message.isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={message.meal.fats}
                              onChange={(e) => handleNutritionEdit(message.id, 'fats', parseFloat(e.target.value) || 0)}
                              className="nutrition-input"
                            />
                          ) : (
                            <span className="nutrition-value">{message.meal.fats}g</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="assumptions-section">
                      <h5>🤔 Assumptions:</h5>
                      <div className="assumptions-list">
                        {message.meal.assumptions.map((assumption, index) => (
                          <div key={index} className="assumption-item">
                            <span className="assumption-text">• {assumption}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {message.meal.sources && message.meal.sources.length > 0 && (
                      <div className="sources-section">
                        <h5>📚 Sources:</h5>
                        <div className="sources-list">
                          {message.meal.sources.map((source, index) => (
                            <div key={index} className="source-item">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-link"
                              >
                                📖 {source.name}
                              </a>
                              <div className="source-description">{source.description}</div>
                              {source.note && (
                                <div className="source-note">⚠️ {source.note}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="confidence-indicator">
                      <span className={`confidence ${message.meal.confidence > 0.8 ? 'high' : message.meal.confidence > 0.6 ? 'medium' : 'low'}`}>
                        AI Confidence: {Math.round(message.meal.confidence * 100)}%
                      </span>
                    </div>

                    {message.isEditing && (
                      <div className="edit-actions">
                        <button className="recalculate-btn" onClick={requestRecalculation}>
                          🔄 Ask Claude to recalculate
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
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  Claude is analyzing your food...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-section">
          {suggestedMeal && (
            <div className="meal-confirmation">
              <p>Ready to log this meal analyzed by Claude?</p>
              <div className="confirmation-buttons">
                <button className="confirm-btn" onClick={handleConfirmMeal}>
                  ✅ Log This Meal
                </button>
                <button className="edit-btn" onClick={() => setCurrentInput("Actually, let me clarify something...")}>
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
              placeholder="describe what you ate..."
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isLoading}
              className="send-btn"
            >
              {isLoading ? '⏳' : '🤖'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChatProduction;