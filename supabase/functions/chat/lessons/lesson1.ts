export const lesson1Content = `
Game Theme: "Python Adventurer: The Coders' Guild Initiation"
In this opening chapter of the Coders' Guild saga, aspiring Python Adventurers face the Trials of Syntax and Execution—a sacred rite of passage for all who seek to master the language of code. Only those who complete all challenges will earn their place in the Coders' Guild and unlock the path to deeper magic.

Game Structure and Challenges
Level 1: Lighting the First Torch
Topic: Writing and running basic Python code using print().
Challenge 1: "The First Spell"
🧠 Primer: Outputting Messages with print()
 "In Python, the print() function is used to display messages or values on the screen.
 You pass a message or a value inside the parentheses, typically as a string enclosed in quotes.
 This is your primary tool for communicating with the user."

Prompt: "A mysterious scroll appears before you. It reads: "To awaken Python's magic, you must utter the words of power. Write a script that prints 'Hello, Python!'"

 🏆 Reward: +10 points, "Code Whisperer" Badge.

Challenge 2: "The Shape-Shifting Stone"
🧠 Primer: Variables and Basic Data Types
"Variables are names you assign to store values in a program. Use the = symbol to assign values.
Common data types:
Integer (int) – whole numbers: 42
String (str) – text in quotes: "wizard"
Boolean (bool) – True or False
Use the ‘=’ assignment operator to assign a value to a variable
Example pseudocode:
*variable_name* = *value*"
Prompt: "You stumble upon a mystical stone that changes form when touched. To control it, define variables representing a number, a name, and a truth value."

 🏆 Reward: +15 points, "Variable Alchemist" Badge.

Level 2: The Chamber of Forms
Topic: Declaring variables and working with basic data types (integers, strings, booleans).
Challenge 3: "The Oracle's Riddle"
🧠 Primer: Getting User Input and Displaying It
"The input() function lets you ask the user for information. It returns a string value.
Syntax:
*variable* = input(*prompt_string*)
Note: The value returned is always a string.
Combining Strings Using f-strings (Formatted Strings):
Allows you to embed variables inside curly braces within a string, prefixed with f.
f"Hello, {name}!""
Prompt: "The Oracle of Python will answer one question, but only if you introduce yourself first. Write a program that asks for your name and then greets you."

 🏆 Reward: +20 points, "Oracle's Apprentice" Badge.

Challenge 4: "The Numbers Portal"
🧠 Primer: Arithmetic Operators and Operator Precedence
"Python supports several arithmetic operations:
| Operator | Meaning          | Example        |
|----------|------------------|----------------|
| +      | Addition         | 3 + 2 → 5     |
| -      | Subtraction      | 5 - 2 → 3     |
| *      | Multiplication   | 4 * 3 → 12    |
| /      | Division         | 10 / 2 → 5.0  |
| //     | Floor Division   | 7 // 2 → 3    |
| %      | Modulus          | 7 % 2 → 1     |
| **     | Exponentiation   | 2 ** 3 → 8    |

Operator Precedence:
Some operations happen before others unless grouped by parentheses:
Multiplication (*) and Division (/) happen before Addition (+) and Subtraction (-)."

Prompt: "The portal demands an answer! Calculate 5 + 3 * 2 and print the result."

 🏆 Reward: +10 points, "Portal Mathematician" Badge.

Level 3: The Oracle’s Echo
Topic: Using input() and print() for basic input and output interactions.
Challenge 5: "The Judgment Scale"
🧠 Primer: Comparison Operators
"Comparison operators evaluate expressions and return a Boolean value: True or False.
| Operator | Meaning                   | Example          |
|----------|---------------------------|------------------|
| ==     | Equal to                  | 5 == 5 → True  |
| !=     | Not equal to              | 4 != 5 → True  |
| >      | Greater than              | 7 > 3 → True   |
| <      | Less than                 | 2 < 5 → True   |
| >=     | Greater than or equal to  | 5 >= 5 → True  |
| <=     | Less than or equal to     | 4 <= 5 → True  |

These are used to compare values or expressions."

Prompt: "The scale asks: Is 10 greater than 5? Is 7 equal to 3+4? Print to prove your logic!"

 🏆 Reward: +10 points, "Truth Seeker" Badge.

Challenge 6: The Gates of Logic (Logical Operators)
🧠 Primer: Logical Operators and Truth Tables
"Logical operators let you combine multiple Boolean conditions:
| Operator | Description                         |
|----------|-------------------------------------|
| and    | True only if both values are True   |
| or     | True if either value is True        |
| not    | Reverses the Boolean value          |


Truth Table for and and or:
| A     | B     | A and B | A or B |
|-------|-------|---------|--------|
| True  | True  | True    | True   |
| True  | False | False   | True   |
| False | True  | False   | True   |
| False | False | False   | False  |
"

Prompt: "The gatekeeper tests your wisdom: If a = True and b = False, what is a and b? What about a or b?"

 🏆 Reward: +10 points, "Logical Thinker" Badge.

Level 4: The Puzzle of Logic
Topic: Applying arithmetic, comparison, and logical operators to evaluate expressions.
Challenge 7: "The Power of Assignment"
🧠 Primer: Assignment and Compound Assignment Operators
"Assignment is done using =. You can also update a variable using compound assignment:
| Operator | Equivalent To | Example       |
|----------|---------------|---------------|
| +=     | x = x + y   | score += 10 |
| -=     | x = x - y   | lives -= 1  |
| *=     | x = x * y   | energy *= 2 |
| /=     | x = x / y   | speed /= 3  |
"

Prompt: "You have 100 points of energy. Double it using an assignment operator and print the new value."

 🏆 Reward: +15 points, "Energy Master" Badge.

Level 5: The Final Incantation
Topic: Combining input, variables, operators, and output to build a complete Python script.
Challenge 8: "The Apprentice's Graduation"
🧠 Primer: Type Casting
"When you use input(), the result is always a string, even if the user types a number. To perform calculations with that input, you must convert (cast) the string into a number.
Use int(*variable_here*) to cast a string to an integer:
You can also use:
float() — to convert to a decimal number
str() — to convert a number back into a string for printing"

Prompt: "The Elder Pythonian grants you a final test: Write a script that asks for a user's name, age, and calculates their birth year, then prints it."

 🏆 Reward: +30 points, "Python Apprentice" Badge.

Game Completion: The Python Apprentice’s Trophy
Upon completing all challenges, players receive the “Python Apprentice’s Trophy” and this message:
"You have awakened the power of Python syntax and execution! With this foundation, you are ready to face the next great trial—The Gate of Decisions, where true logic begins."
`;