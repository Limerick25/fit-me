import { useState, useEffect } from 'react';

const ApiTest = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const key = process.env.REACT_APP_CLAUDE_API_KEY || 'NOT_FOUND';
    setApiKey(key);
    console.log('API Key from environment:', key);
  }, []);

  const testClaudeConnection = async () => {
    setTestResult('Testing...');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 50,
          messages: [{
            role: 'user',
            content: 'Say hello in exactly 3 words'
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Success: ${data.content[0]?.text || 'API connected!'}`);
      } else {
        const error = await response.text();
        setTestResult(`❌ Error ${response.status}: ${error}`);
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f0f0f0', margin: '1rem', borderRadius: '8px' }}>
      <h3>🔧 Claude API Debug Panel</h3>

      <div style={{ margin: '1rem 0' }}>
        <strong>API Key Status:</strong>
        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
          {apiKey === 'NOT_FOUND' ? '❌ Not Found' :
           apiKey === 'your_claude_api_key_here' ? '⚠️ Not Configured' :
           `✅ Loaded: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}`}
        </div>
      </div>

      <button
        onClick={testClaudeConnection}
        disabled={!apiKey || apiKey === 'NOT_FOUND' || apiKey === 'your_claude_api_key_here'}
        style={{
          padding: '0.5rem 1rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Claude Connection
      </button>

      {testResult && (
        <div style={{ margin: '1rem 0', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default ApiTest;