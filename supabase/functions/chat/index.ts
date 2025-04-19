import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { lesson1Content } from './lessons/lesson1.ts';
import { systemPrompt } from './SystemPrompt.ts';
import { projectBuilderContent } from './tools/project-builder.ts';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  selectedLesson: string;
  preferences: {
    theme: string;
    tone: string;
    difficulty: string;
    learning_style: string;
  };
  isIncorrectAttempt?: boolean;
}

function buildSystemPrompt(preferences: ChatRequest['preferences']): string {
  return `You are a tutor with the following characteristics:
- Theme: ${preferences.theme}
- Tone: ${preferences.tone}
- Teaching Style: ${preferences.learning_style}
- Difficulty Level: ${preferences.difficulty}

${systemPrompt}`;
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Received request:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      throw new Error('Missing DeepSeek API key');
    }

    const requestData = await req.json();
    console.log(`[${requestId}] Request data:`, JSON.stringify(requestData, null, 2));

    const { messages, preferences, isIncorrectAttempt }: ChatRequest = requestData;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences format');
    }

    const systemMessage = {
      role: 'system',
      content: buildSystemPrompt(preferences),
    };

    // Add context about incorrect attempt if applicable
    const contextMessages = isIncorrectAttempt
      ? [
          systemMessage,
          {
            role: 'system',
            content: 'The user\'s previous attempt was incorrect. Provide themed feedback and guidance.',
          },
          ...messages,
        ]
      : [systemMessage, ...messages];

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[${requestId}] DeepSeek API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.log(`[${requestId}] Error processing request:`, {
      error: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({
        error: error.message,
        requestId: requestId
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});