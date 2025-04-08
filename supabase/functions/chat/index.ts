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
  const lessonContent = LESSONS_CONTENT[selectedLesson as keyof typeof LESSONS_CONTENT] || '';
  
  if (selectedLesson === 'Project Builder Tool') {
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
      throw new Error(`DeepSeek API error: ${response.statusText}`);
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});