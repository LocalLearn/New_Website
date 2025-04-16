import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { lesson1Content } from './lessons/lesson1.ts';
import { lesson2Content } from './lessons/lesson2.ts';
import { lesson3Content } from './lessons/lesson3.ts';
import { lesson4Content } from './lessons/lesson4.ts';
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
}

const LESSONS_CONTENT = {
  'Lesson 1: Basics of Syntax and Execution': lesson1Content,
  'Lesson 2: Control Flow with Conditionals': lesson2Content,
  'Lesson 3: Loops and Iteration': lesson3Content,
  'Lesson 4: Functions and Scope': lesson4Content,
  'Project Builder Tool': projectBuilderContent,
} as const;

function buildSystemPrompt(selectedLesson: string, preferences: ChatRequest['preferences']): string {
  try {
    console.log('Building system prompt for lesson:', selectedLesson);
    const lessonContent = LESSONS_CONTENT[selectedLesson as keyof typeof LESSONS_CONTENT];
    
    if (!lessonContent) {
      throw new Error(`Invalid lesson selected: ${selectedLesson}`);
    }
    
    if (selectedLesson === 'Project Builder Tool') {
      console.log('Using Project Builder content');
      return lessonContent;
    }

    return `You are a tutor with the following characteristics:
- Theme: ${preferences.theme}
- Tone: ${preferences.tone}
- Teaching Style: ${preferences.learning_style}
- Difficulty Level: ${preferences.difficulty}

Current Lesson: ${selectedLesson}
${lessonContent}

Teaching Instructions: ${systemPrompt}`;
  } catch (error) {
    console.log('Error building system prompt:', error);
    throw new Error(`Failed to build system prompt: ${error.message}`);
  }
}

serve(async (req) => {
  // Add detailed request logging
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

    const { messages, selectedLesson, preferences }: ChatRequest = requestData;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    if (!selectedLesson) {
      throw new Error('Selected lesson is required');
    }

    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences format');
    }

    console.log(`[${requestId}] Selected Lesson:`, selectedLesson);

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