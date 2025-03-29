import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { lesson1Content } from './lessons/lesson1.ts';
import { lesson2Content } from './lessons/lesson2.ts';
import { lesson3Content } from './lessons/lesson3.ts';
import { lesson4Content } from './lessons/lesson4.ts';
import { systemPrompt } from './SystemPrompt.ts';

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
}

const LESSONS_CONTENT = {
  'Lesson 1: Basics of Syntax and Execution': lesson1Content,
  'Lesson 2: Control Flow with Conditionals': lesson2Content,
  'Lesson 3: Loops and Iteration': lesson3Content,
  'Lesson 4: Functions and Scope': lesson4Content,
};

function containsDirectCode(text: string): boolean {
  const codePatterns = [
    /```python[\s\S]*?```/,
    /\bdef\s+\w+\s*\([^)]*\):/,
    /\bclass\s+\w+:/,
    /\bif\s+__name__\s*==\s*['"]__main__['"]/,
    /\bprint\s*\([^)]*\)/,
    /\bfor\s+\w+\s+in\s+/,
    /\bwhile\s+.*:/,
    /\btry\s*:/,
    /\bexcept\s+.*:/,
    /\bimport\s+\w+/,
    /\bfrom\s+\w+\s+import\s+/,
  ];

  return codePatterns.some(pattern => pattern.test(text));
}

function buildSystemPrompt(selectedLesson: string, preferences: ChatRequest['preferences']): string {
  const lessonContent = LESSONS_CONTENT[selectedLesson as keyof typeof LESSONS_CONTENT] || '';
  
  return `You are a tutor with the following characteristics:
- Theme: ${preferences.theme}
- Tone: ${preferences.tone}
- Teaching Style: ${preferences.learning_style}
- Difficulty Level: ${preferences.difficulty}

Current Lesson: ${selectedLesson}
${lessonContent}

Teaching Instructions: ${systemPrompt}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      throw new Error('Missing DeepSeek API key');
    }

    const { messages, selectedLesson, preferences }: ChatRequest = await req.json();

    // Add system message at the start
    const systemMessage = {
      role: 'system',
      content: buildSystemPrompt(selectedLesson, preferences),
    };

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Check for direct code in the response
    if (containsDirectCode(generatedText)) {
      // If direct code is found, request a new response with stronger guidance
      const newSystemMessage = {
        role: 'system',
        content: `${systemMessage.content}\n\nIMPORTANT: DO NOT provide direct code solutions. Instead, offer guidance, pseudocode, or conceptual explanations.`,
      };

      const retryResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [newSystemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!retryResponse.ok) {
        throw new Error(`DeepSeek API error on retry: ${retryResponse.statusText}`);
      }

      const retryData = await retryResponse.json();
      return new Response(JSON.stringify(retryData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});