export const testClaudeAPI = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  console.log('🧪 Starting Claude API test...');
  console.log('API Key present:', !!apiKey);
  console.log('API Key preview:', apiKey ? `${apiKey.substring(0, 20)}...` : 'None');

  if (!apiKey || apiKey === 'your_claude_api_key_here') {
    return {
      success: false,
      message: 'Claude API key not configured. Please set REACT_APP_CLAUDE_API_KEY in .env.local'
    };
  }

  try {
    console.log('🌐 Making request to Claude API...');

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
          content: 'Say "API test successful" in exactly 3 words'
        }]
      })
    });

    console.log('📡 Response received:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response data:', data);
      return {
        success: true,
        message: `✅ Claude API connected successfully!`,
        data: data.content[0]?.text || 'API connected!'
      };
    } else {
      const error = await response.text();
      console.error('❌ API Error:', response.status, error);
      return {
        success: false,
        message: `❌ Claude API Error ${response.status}: ${error}`
      };
    }
  } catch (error) {
    console.error('❌ Network/CORS Error:', error);

    // Check if it's a CORS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: `❌ CORS Error: Direct API calls from browser are blocked. This is expected - we need a backend proxy to call Claude API. Error: ${error.message}`
      };
    }

    return {
      success: false,
      message: `❌ Network Error: ${error}`
    };
  }
};

export const checkEnvironmentVariables = () => {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  console.log('Environment Variables Check:');
  console.log('REACT_APP_CLAUDE_API_KEY:', apiKey ? 'Present' : 'Missing');
  console.log('Key preview:', apiKey ? `${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}` : 'N/A');

  return {
    hasApiKey: !!(apiKey && apiKey !== 'your_claude_api_key_here'),
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}` : 'Not configured'
  };
};