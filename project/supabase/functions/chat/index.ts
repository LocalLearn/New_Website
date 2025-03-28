import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

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
  'Lesson 1: Basics of Syntax and Execution': `
    Python is a high-level programming language known for its simplicity and readability.
    Key concepts:
    - Variables and data types
    - Basic operators
    - Input/output operations
    - Comments and documentation
  `,
  'Lesson 2: Control Flow with Conditionals': `
    Control flow determines the order in which program instructions are executed.
    Key concepts:
    - If/else statements
    - Comparison operators
    - Logical operators
    - Switch case alternatives
  `,
  'Lesson 3: Loops and Iteration': `
    Loops allow you to repeat code blocks efficiently.
    Key concepts:
    - For loops
    - While loops
    - Loop control statements
    - Iterating over sequences
  `,
  'Lesson 4: Functions and Scope': `
    Functions are reusable blocks of code that perform specific tasks.
    Key concepts:
    - Function definition
    - Parameters and arguments
    - Return values
    - Variable scope
  `,
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
  
  return `You are a Python programming tutor with the following characteristics:
- Theme: ${preferences.theme}
- Tone: ${preferences.tone}
- Teaching Style: ${preferences.learning_style}
- Difficulty Level: ${preferences.difficulty}

Current Lesson: ${selectedLesson}
${lessonContent}

Guidelines:
1. Never provide direct code solutions
2. Guide students to discover solutions themselves
3. Use analogies and examples aligned with the chosen theme
4. Maintain the specified tone throughout responses
5. Adapt explanations to the student's learning style
6. Keep difficulty appropriate for the student's level
7. Focus on understanding over memorization
8. Encourage experimentation and learning from mistakes

If asked for code, provide pseudocode or high-level explanations instead.`;
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