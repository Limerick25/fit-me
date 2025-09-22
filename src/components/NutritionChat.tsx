import { useState, useRef, useEffect } from 'react';
import { MealType } from '../types/nutrition';
import { ConversationMessage, ParsedMeal } from '../types/conversation';
import { NutritionLLMService } from '../services/nutritionLLM';
import { UserMemoryService } from '../services/userMemory';

interface NutritionChatProps {
  mealType: MealType;
  onMealConfirmed: (meal: ParsedMeal) => void;
  onCancel: () => void;
}

const NutritionChat = ({ mealType, onMealConfirmed, onCancel }: NutritionChatProps) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMeal, setSuggestedMeal] = useState<ParsedMeal | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const llmService = new NutritionLLMService();
  const memoryService = new UserMemoryService();

  useEffect(() => {
    try {
      console.log('NutritionChat mounting for meal type:', mealType);
      // Add initial greeting message
      const initialMessage: ConversationMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! I'm Master Shredder, your nutrition assistant. Tell me about your ${mealType} - what did you eat? Be as specific or general as you'd like, and I'll help figure out the nutrition details!`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      console.log('Initial message set successfully');
    } catch (error) {
      console.error('Error in NutritionChat useEffect:', error);
    }
  }, [mealType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const userProfile = memoryService.getUserProfile();
      const conversationHistory = memoryService.getRecentConversation(6);

      const response = await llmService.analyzeFood({
        userInput: currentInput,
        conversationHistory: [...conversationHistory, userMessage],
        userProfile,
        mealType
      });

      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metadata: {
          suggestedMeal: response.suggestedMeal,
          confidence: response.suggestedMeal?.confidence,
          needsMoreInfo: response.followUpQuestions
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save messages to memory
      memoryService.addConversationMessage(userMessage);
      memoryService.addConversationMessage(assistantMessage);

      // Update suggested meal if provided
      if (response.suggestedMeal) {
        setSuggestedMeal(response.suggestedMeal);
      }

      // Update user profile if provided
      if (response.updatedProfile) {
        memoryService.updatePreferences(response.updatedProfile.preferences || {});
      }

    } catch (error) {
      const errorMessage: ConversationMessage = {
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
      memoryService.addMealToHistory(suggestedMeal);
      memoryService.learnFromMeal(suggestedMeal);
      onMealConfirmed(suggestedMeal);
    }
  };

  const formatNutrition = (meal: ParsedMeal) => {
    return `${meal.totalNutrition.calories} cal | ${meal.totalNutrition.protein}g protein | ${meal.totalNutrition.carbs}g carbs | ${meal.totalNutrition.fats}g fat`;
  };

  return (
    <div className="nutrition-chat-overlay">
      <div className="nutrition-chat-modal">
        <div className="chat-header">
          <h2>🥗 Nutrition Chat - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                {message.metadata?.suggestedMeal && (
                  <div className="suggested-meal">
                    <h4>📊 Nutrition Breakdown:</h4>
                    <div className="meal-summary">
                      <div className="meal-name">{message.metadata.suggestedMeal.name}</div>
                      <div className="meal-nutrition">{formatNutrition(message.metadata.suggestedMeal)}</div>
                    </div>

                    <div className="meal-ingredients">
                      <h5>Ingredients:</h5>
                      {message.metadata.suggestedMeal.ingredients.map((ingredient, index) => (
                        <div key={index} className={`ingredient ${ingredient.inferred ? 'inferred' : ''}`}>
                          <span className="ingredient-name">
                            {ingredient.name} {ingredient.inferred && '(inferred)'}
                          </span>
                          <span className="ingredient-amount">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                          <span className="ingredient-calories">
                            {ingredient.nutrition.calories} cal
                          </span>
                        </div>
                      ))}
                    </div>

                    {message.metadata.suggestedMeal.inferredDetails.length > 0 && (
                      <div className="inferred-details">
                        <h5>💡 What I inferred:</h5>
                        <ul>
                          {message.metadata.suggestedMeal.inferredDetails.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="confidence-indicator">
                      <span className={`confidence ${message.metadata.confidence && message.metadata.confidence > 0.8 ? 'high' :
                        message.metadata.confidence && message.metadata.confidence > 0.6 ? 'medium' : 'low'}`}>
                        Confidence: {message.metadata.confidence ? Math.round(message.metadata.confidence * 100) : 0}%
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
                <button className="edit-btn" onClick={() => setCurrentInput("Actually, let me make some changes...")}>
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
              placeholder="Describe what you ate... (e.g., 'I had a chicken breast, probably 8oz, grilled with olive oil, and about 2 cups of brown rice')"
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

export default NutritionChat;