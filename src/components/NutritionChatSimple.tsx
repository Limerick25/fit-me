import { useState, useRef, useEffect } from 'react';
import { MealType } from '../types/nutrition';

interface NutritionChatSimpleProps {
  mealType: MealType;
  onCancel: () => void;
}

const NutritionChatSimple = ({ mealType, onCancel }: NutritionChatSimpleProps) => {
  const [messages, setMessages] = useState<Array<{id: string, role: string, content: string, timestamp: Date}>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      console.log('NutritionChatSimple mounting for meal type:', mealType);

      const initialMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! I'm Master Shredder, your nutrition assistant. Tell me about your ${mealType} - what did you eat?`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      console.log('Initial message set successfully');
    } catch (error) {
      console.error('Error in NutritionChatSimple useEffect:', error);
    }
  }, [mealType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you had: "${currentInput}". Let me analyze that for you! (This is a simplified version - the full LLM analysis is being debugged)`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble analyzing that. Could you try again?',
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
          <div className="chat-input">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you ate... (e.g., 'grilled chicken with rice')"
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

export default NutritionChatSimple;