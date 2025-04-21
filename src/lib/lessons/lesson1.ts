import { Challenge } from '../types';

export const lesson1Content: Challenge[] = [
  {
    id: 'challenge-1',
    primerAndChallenge: `📣 **Print Statement Basics**

In Python, the \`print()\` function is used to display messages or values on the screen.
You pass a message or a value inside the parentheses, typically as a string enclosed in quotes.

🧪 **Challenge**:  
Write a script that prints 'Hello, Python!' 🐍`,
    correctSolution: `print('Hello, Python!')`,
    reward: '🎉 +10 points, 🧙‍♂️ "Code Whisperer" Badge'
  },
  {
    id: 'challenge-2',
    primerAndChallenge: `📦 **Variables & Data Types**

Variables are names you assign to store values in a program. Use the \`=\` symbol to assign values.

📊 **Common Data Types**:
- 🔢 Integer (int) – whole numbers: 42  
- 📝 String (str) – text in quotes: "wizard"  
- ✅ Boolean (bool) – True or False  

✍️ Example pseudocode:  
\`variable_name = value\`

🧪 **Challenge**:  
Define variables \`number\`, \`name\`, and \`truth\` with the values: 42, "wizard", and True.`,
    correctSolution: `number = 42
name = "wizard"
truth = True`,
    reward: '✨ +15 points, 🧪 "Variable Alchemist" Badge'
  },
  {
    id: 'challenge-3',
    primerAndChallenge: `📥 **User Input & String Formatting**

The \`input()\` function asks the user for input. It always returns a string.

📘 Syntax:  
\`variable = input("Your prompt here")\`

🧵 **F-Strings** (Formatted Strings):  
Use \`f"Hello, {name}!"\` to embed variables.

🧪 **Challenge**:  
Ask the user "What is your name?" and greet them with "Hello, [name]!"`,
    correctSolution: `name = input("What is your name? ")
print(f"Hello, {name}!")`,
    reward: '🙌 +20 points, 🔮 "Oracle\'s Apprentice" Badge'
  },
  {
    id: 'challenge-4',
    primerAndChallenge: `➗ **Arithmetic Operators**

| ➕ Operator | 📖 Meaning        | 🧮 Example        |
|------------|------------------|------------------|
| +          | Addition         | 3 + 2 → 5         |
| -          | Subtraction      | 5 - 2 → 3         |
| *          | Multiplication   | 4 * 3 → 12        |
| /          | Division         | 10 / 2 → 5.0      |
| //         | Floor Division   | 7 // 2 → 3        |
| %          | Modulus          | 7 % 2 → 1         |
| **         | Exponentiation   | 2 ** 3 → 8        |

⚠️ **Note**: Multiplication and Division happen before Addition and Subtraction.

🧪 **Challenge**:  
Write a script that calculates \`5 + 3 * 2\` and prints the result.`,
    correctSolution: `print(5 + 3 * 2)`,
    reward: '➕ +10 points, 🧠 "Portal Mathematician" Badge'
  },
  {
    id: 'challenge-5',
    primerAndChallenge: `⚖️ **Comparison Operators**

| 🔧 Operator | 📖 Meaning                | 🔍 Example        |
|------------|---------------------------|-------------------|
| ==         | Equal to                  | 5 == 5 → True     |
| !=         | Not equal to              | 4 != 5 → True     |
| >          | Greater than              | 7 > 3 → True      |
| <          | Less than                 | 2 < 5 → True      |
| >=         | Greater than or equal to  | 5 >= 5 → True     |
| <=         | Less than or equal to     | 4 <= 5 → True     |

🧪 **Challenge**:  
Is 10 greater than 5?  
Is 7 equal to 3 + 4?  
Write a script to prove it!`,
    correctSolution: `print(10 > 5)
print(7 == 3 + 4)`,
    reward: '🔎 +10 points, 🧠 "Truth Seeker" Badge'
  },
  {
    id: 'challenge-6',
    primerAndChallenge: `🔗 **Logical Operators**

| 🔧 Operator | 📖 Description                          |
|------------|------------------------------------------|
| and        | True only if both conditions are True   |
| or         | True if at least one is True            |
| not        | Reverses the Boolean value              |

📘 **Truth Table**:

| A     | B     | A and B | A or B |
|-------|-------|---------|--------|
| True  | True  | True    | True   |
| True  | False | False   | True   |
| False | True  | False   | True   |
| False | False | False   | False  |

🧪 **Challenge**:  
If \`a = True\` and \`b = False\`, print the result of \`a and b\` and \`a or b\`.`,
    correctSolution: `a = True
b = False
print(a and b)
print(a or b)`,
    reward: '🧠 +10 points, 🧩 "Logical Thinker" Badge'
  },
  {
    id: 'challenge-7',
    primerAndChallenge: `🔄 **Compound Assignment Operators**

| 🔧 Operator | Equivalent       | 🧪 Example       |
|------------|------------------|------------------|
| +=         | x = x + y        | score += 10       |
| -=         | x = x - y        | lives -= 1        |
| *=         | x = x * y        | energy *= 2       |
| /=         | x = x / y        | speed /= 3        |

🧪 **Challenge**:  
You have 100 energy points ⚡. Double it using a compound assignment and print the result.`,
    correctSolution: `energy = 100
energy *= 2
print(energy)`,
    reward: '⚡ +15 points, 🧙‍♀️ "Energy Master" Badge'
  },
  {
    id: 'challenge-8',
    primerAndChallenge: `🔢 **Type Casting User Input**

All input from \`input()\` is a string.  
To do math, convert it using:
- \`int()\` – whole number  
- \`float()\` – decimal  
- \`str()\` – convert number to string

🧪 **Challenge**:  
Ask the user for their name and age, then calculate and print their birth year.

🧾 Prompts:
- "Enter your name: "  
- "Enter your age: "

📤 Output:  
\`<NAME>, you were born in <BIRTH_YEAR>\`

Variables: \`name\`, \`age\`, \`current_year\`, \`birth_year\``,
    correctSolution: `name = input("Enter your name: ")
age = int(input("Enter your age: "))
current_year = 2025
birth_year = current_year - age
print(f"{name}, you were born in {birth_year}")`,
    reward: '🎓 +30 points, 🐍 "Python Apprentice" Badge'
  }
];
