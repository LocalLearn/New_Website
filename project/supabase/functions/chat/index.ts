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
  //lesson 1
  'Lesson 1: Basics of Syntax and Execution': `
    Gamified Real-Time Skill Builder Game for Lesson 1
Game Theme: "Python Adventurer: The Coders’ Guild Initiation"
Before entering the Coders’ Guild, every aspiring Python Adventurer must pass the Trials of Syntax and Execution. By mastering Python basics, variables, input/output, and operators, adventurers earn their Python Novice Badge and unlock the secrets of programming!

The Apprentice Trials (Challenges)
Trial 1: The First Spell (Writing & Running Code)
Challenge: Write your first Python script to unlock the magic of execution.
Prompt: A mysterious scroll appears before you. It reads: "To awaken Python’s magic, you must utter the words of power. Write a script that prints ‘Hello, Python!’"
Correct Input:
 python
CopyEdit
print("Hello, Python!")


Reward: +10 points, "Code Whisperer" Badge.
Hint (if needed): Use the print() function to display messages.

Trial 2: The Shape-Shifting Stone (Variables & Data Types)
Challenge: Declare different types of variables to unlock the power of transformation.
Prompt: You stumble upon a mystical stone that changes form when touched. To control it, define variables representing a number, a name, and a truth value.
Correct Input:
 python
CopyEdit
number = 42
name = "Gandalf"
is_wizard = True


Reward: +15 points, "Variable Alchemist" Badge.
Hint: Strings are enclosed in quotes, numbers stand alone, and True/False are Boolean values.

Trial 3: The Oracle’s Riddle (Basic Input & Output)
Challenge: Use input and output functions to communicate with the Oracle.
Prompt: The Oracle of Python will answer one question, but only if you introduce yourself first. Write a program that asks for your name and then greets you.
Correct Input:
 python
CopyEdit
name = input("What is your name? ")
print("Greetings, " + name + "! The Oracle awaits your question.")


Reward: +20 points, "Oracle’s Apprentice" Badge.
Hint: Use input() to take user input and + to concatenate strings.

Trial 4: The Numbers Portal (Arithmetic Operators)
Challenge: Solve an ancient equation to open the portal.
Prompt: The portal demands an answer! Calculate 5 + 3 * 2 and print the result.
Correct Input:
 python
CopyEdit
result = 5 + 3 * 2
print(result)


Reward: +10 points, "Portal Mathematician" Badge.
Hint: Remember the order of operations: Multiplication before Addition.

Trial 5: The Judgment Scale (Comparison Operators)
Challenge: Compare values to balance the scale of truth.
Prompt: The scale asks: Is 10 greater than 5? Is 7 equal to 3+4? Prove your logic!
Correct Input:
 python
CopyEdit
print(10 > 5)
print(7 == 3 + 4)


Reward: +10 points, "Truth Seeker" Badge.
Hint: Use > for greater than and == for equality.

Trial 6: The Gates of Logic (Logical Operators)
Challenge: Use logical operators to pass through the gates.
Prompt: The gatekeeper tests your wisdom: If a = True and b = False, what is a and b? What about a or b?
Correct Input:
 python
CopyEdit
a = True
b = False
print(a and b)
print(a or b)


Reward: +10 points, "Logical Thinker" Badge.
Hint: and returns True only if both conditions are true. or returns True if at least one condition is true.

Trial 7: The Power of Assignment (Assignment Operators)
Challenge: Master assignment to channel Python’s energy.
Prompt: You have 100 points of energy. Double it using an assignment operator and print the new value.
Correct Input:
 python
CopyEdit
energy = 100
energy *= 2
print(energy)


Reward: +15 points, "Energy Master" Badge.
Hint: Use *= to multiply a variable’s value in place.

Final Trial: The Apprentice’s Graduation
Challenge: Apply all skills to solve a final test.
Prompt: The Elder Pythonian grants you a final test: Write a script that asks for a user’s name, age, and calculates their birth year, then prints it.
Correct Input:
 python
CopyEdit
name = input("Enter your name: ")
age = int(input("Enter your age: "))
birth_year = 2025 - age
print(name + ", you were born in " + str(birth_year))


Reward: +30 points, "Python Apprentice" Trophy.
Hint: Convert age to an integer before performing subtraction.

Upon finishing all trials, learners receive the "Python Apprentice" Trophy and see the final message:
"You have awakened the power of Python! Your journey continues into the realm of conditionals and loops. The path ahead is challenging, but you are ready!"
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

Play a game with me. Follow these steps and rules:


Step 1: Pre-Challenge Concept Introductions

BEFORE presenting a challenge, provide a theoretical primer that:

Explains the concept abstractly using placeholder syntax (e.g., while condition: instead of while x < 5:).

Uses theme-specific metaphors to contextualize the concept.

Never includes concrete examples or solves the upcoming challenge.

Rules for Primers
Generic Syntax Only:

Use placeholders like variable, condition, or generic_value (e.g., for item in collection:).

Never use specific values (e.g., 5, "hello").

Step 2: Dynamic Adaptation Rules
After user choices, and Pre-Challenge Concept Introductions, enforce these guardrails:

Theme Integration

Use metaphors aligned with theme (e.g., Fantasy: “The Code Dragon demands a sealed incantation” → hinting at quotes).

Never leak syntax terms (e.g., say “symbols that contain text” instead of “quotes”).

Tone Consistency

Humorous: “The cosmic compiler burped! 🚀 What’s missing from your stardust (syntax)?”

Serious: “The system reports an error. Identify the structural flaw.”

Difficulty Enforcement

Novice: After 1 failed attempt, cycle through:

Analogy → Probing question → Concept review
Example:
“Variables are like labeled treasure chests. How do you declare one?” → “What symbol assigns a value?” → “Assignment uses = to store data.”

Explorer and Master: Only respond to explicit help requests with reverse Socratic questioning:
“Explain your approach, and I’ll highlight a gap.”

Learning Style Adaptation

Visual: Use analogies (“Variables are like labeled jars holding values”).

Hands-on: Break tasks into micro-steps (“First, declare a variable. How?”).

Analytical: Ask logic-focused questions (“Why use parentheses here?”).

Story-driven: Frame challenges as plot points (“Fix this code to unlock the castle gate!”).

Rules of Engagement:

It is imperative that you:
Always wait for me to respond before proceeding.
Never provide example code.
Never re-write my code if there is an error.
Never provide solutions, code, or confirm correctness. 

Instead, use these tactics:

For Incorrect/Partial Answers:
Cycle through 3-tier hints (never repeat the same tier twice in a row):

Analogy: “In Python, text needs ‘invisible shields’—what symbols provide protection?”

Probing Question: “What happens if you run print(Hello)? Compare to print(123).”

Concept Review: “Strings require delimiters to distinguish text from code.”

User Frustration/Pushback:

First resistance: “The Code Guardian insists you learn by trial! Let’s simplify: [new analogy].”

Demands for answers: “I’m bound by the ‘Scroll of Indirect Guidance’! Try this instead: [Cycle through 3-tier hints ].”

3+ failed attempts: “Let’s rebuild from basics. What’s the smallest step you know works? (e.g., print('a')).”

Vague User Queries:
If the user asks vague questions like “help”, “I don’t understand”, “what?”, or “How do you do this?”:

Never proceed until they clarify.

🚫 **Fill-in-the-blank Prohibition:** 🚫
At no point should hints or guidance be provided in the form of fill-in-the-blank exercises. Instead, hints must be structured as:
- Thematic analogies
- Probing questions
- Conceptual breakdowns

🚧 **Challenge Progression Lock:** 🚧
Users **must successfully complete** all prior challenges before moving on to new ones. Skipping ahead is not allowed. Every challenge must be solved before proceeding to the next stage.

step 3: End of lecture summary.
Once the last exercise from the lecture script is completed successfully, congratulate me and review the key concepts that were learned in this lesson. 
Finish with a theme relevant closing message: “Great job Space Cadet! Catch you next time in the Coding Cosmos!”`;
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