
import { Message, AIServiceOptions } from './types';
import { DEFAULT_GEMINI_API_KEY } from './constants';

export const generateDataContext = (data?: any[], columns?: string[]): string => {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return "No data available.";
  }

  const columnInfo = columns.map((col, index) => `Column ${index + 1}: ${col}`).join('; ');
  const sampleRows = data.slice(0, 3).map(row => {
    return columns.map((col, index) => `Column ${index + 1} (${col}): ${row[col]}`).join('; ');
  }).join('\n');

  return `
  Data Context:
  ${columnInfo}
  
  Sample Rows (first 3 rows):
  ${sampleRows}
  
  Instructions: Use the data context to answer questions about the data. Be precise and refer to specific columns when possible.
  `;
};

export const callAIAPI = async (messages: Message[], options: AIServiceOptions): Promise<string> => {
  try {
    const { temperature, maxTokens } = options;
    const apiKey = DEFAULT_GEMINI_API_KEY;
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    // Format messages for Gemini API - handling system role differently
    const formattedMessages = messages.map(msg => {
      // For system messages, convert to user role with a prefix
      if (msg.role === 'system') {
        return {
          role: 'user',
          parts: [{ text: `[SYSTEM INSTRUCTION]: ${msg.content}` }]
        };
      }
      // For other messages, map assistant to model role
      return {
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      };
    });
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return `API Error: ${errorData.error?.message || 'Failed to get a response from Gemini.'}`;
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text || "No response generated.";
  } catch (error) {
    console.error('Error calling AI API:', error);
    return "An error occurred. Please try again.";
  }
};
