import { Challenge } from '../types';

export const lesson1Content: Challenge[] = [
  {
    id: 'challenge-1',
    primerAndChallenge: `In Python, the print() function is used to display messages or values on the screen.
You pass a message or a value inside the parentheses, typically as a string enclosed in quotes.
This is your primary tool for communicating with the user.

A mysterious scroll appears before you. It reads: "To awaken Python's magic, you must utter the words of power. Write a script that prints 'Hello, Python!'"`,
    correctSolution: `print('Hello, Python!')`,
    reward: '+10 points, "Code Whisperer" Badge'
  },
  {
    id: 'challenge-2',
    primerAndChallenge: `Variables are names you assign to store values in a program. Use the = symbol to assign values.
Common data types:
Integer (int) – whole numbers: 42
String (str) – text in quotes: "wizard"
Boolean (bool) – True or False
Use the '=' assignment operator to assign a value to a variable
Example pseudocode:
*variable_name* = *value*

You stumble upon a mystical stone that changes form when touched. To control it, define variables representing a number, a name, and a truth value.`,
    correctSolution: `number = 42
name = "wizard"
is_magic = True`,
    reward: '+15 points, "Variable Alchemist" Badge'
  },
  {
    id: 'challenge-3',
    primerAndChallenge: `The input() function lets you ask the user for information. It returns a string value.
Syntax:
*variable* = input(*prompt_string*)
Note: The value returned is always a string.
Combining Strings Using f-strings (Formatted Strings):
Allows you to embed variables inside curly braces within a string, prefixed with f.
f"Hello, {name}!"

The Oracle of Python will answer one question, but only if you introduce yourself first. Write a program that asks for your name and then greets you.`,
    correctSolution: `name = input("What is your name? ")
print(f"Hello, {name}!")`,
    reward: '+20 points, "Oracle\'s Apprentice" Badge'
  },
  {
    id: 'challenge-4',
    primerAndChallenge: `Python supports several arithmetic operations:
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
Multiplication (*) and Division (/) happen before Addition (+) and Subtraction (-)

The portal demands an answer! Calculate 5 + 3 * 2 and print the result.`,
    correctSolution: `print(5 + 3 * 2)`,
    reward: '+10 points, "Portal Mathematician" Badge'
  },
  {
    id: 'challenge-5',
    primerAndChallenge: `Comparison operators evaluate expressions and return a Boolean value: True or False.
| Operator | Meaning                   | Example          |
|----------|---------------------------|------------------|
| ==     | Equal to                  | 5 == 5 → True  |
| !=     | Not equal to              | 4 != 5 → True  |
| >      | Greater than              | 7 > 3 → True   |
| <      | Less than                 | 2 < 5 → True   |
| >=     | Greater than or equal to  | 5 >= 5 → True  |
| <=     | Less than or equal to     | 4 <= 5 → True  |

These are used to compare values or expressions.

The scale asks: Is 10 greater than 5? Is 7 equal to 3+4? Print to prove your logic!`,
    correctSolution: `print(10 > 5)
print(7 == 3 + 4)`,
    reward: '+10 points, "Truth Seeker" Badge'
  },
  {
    id: 'challenge-6',
    primerAndChallenge: `Logical operators let you combine multiple Boolean conditions:
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

The gatekeeper tests your wisdom: If a = True and b = False, what is a and b? What about a or b?`,
    correctSolution: `a = True
b = False
print(a and b)
print(a or b)`,
    reward: '+10 points, "Logical Thinker" Badge'
  },
  {
    id: 'challenge-7',
    primerAndChallenge: `Assignment is done using =. You can also update a variable using compound assignment:
| Operator | Equivalent To | Example       |
|----------|---------------|---------------|
| +=     | x = x + y   | score += 10 |
| -=     | x = x - y   | lives -= 1  |
| *=     | x = x * y   | energy *= 2 |
| /=     | x = x / y   | speed /= 3  |

You have 100 points of energy. Double it using an assignment operator and print the new value.`,
    correctSolution: `energy = 100
energy *= 2
print(energy)`,
    reward: '+15 points, "Energy Master" Badge'
  },
  {
    id: 'challenge-8',
    primerAndChallenge: `When you use input(), the result is always a string, even if the user types a number. To perform calculations with that input, you must convert (cast) the string into a number.
Use int(*variable_here*) to cast a string to an integer:
You can also use:
float() — to convert to a decimal number
str() — to convert a number back into a string for printing

The Elder Pythonian grants you a final test: Write a script that asks for a user's name, age, and calculates their birth year, then prints it.`,
    correctSolution: `name = input("Enter your name: ")
age = int(input("Enter your age: "))
current_year = 2025
birth_year = current_year - age
print(f"{name}, you were born in {birth_year}")`,
    reward: '+30 points, "Python Apprentice" Badge'
  }
];