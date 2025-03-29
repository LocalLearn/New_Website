export const lesson1Content = `
Gamified Real-Time Skill Builder Game for Lesson 1
Game Theme: "Python Adventurer: The Coders' Guild Initiation"
Before entering the Coders' Guild, every aspiring Python Adventurer must pass the Trials of Syntax and Execution. By mastering Python basics, variables, input/output, and operators, adventurers earn their Python Novice Badge and unlock the secrets of programming!

The Apprentice Trials (Challenges)
Trial 1: The First Spell (Writing & Running Code)
Challenge: Write your first Python script to unlock the magic of execution.
Prompt: A mysterious scroll appears before you. It reads: "To awaken Python's magic, you must utter the words of power. Write a script that prints 'Hello, Python!'"
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

Trial 3: The Oracle's Riddle (Basic Input & Output)
Challenge: Use input and output functions to communicate with the Oracle.
Prompt: The Oracle of Python will answer one question, but only if you introduce yourself first. Write a program that asks for your name and then greets you.
Correct Input:
 python
CopyEdit
name = input("What is your name? ")
print("Greetings, " + name + "! The Oracle awaits your question.")


Reward: +20 points, "Oracle's Apprentice" Badge.
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
Challenge: Master assignment to channel Python's energy.
Prompt: You have 100 points of energy. Double it using an assignment operator and print the new value.
Correct Input:
 python
CopyEdit
energy = 100
energy *= 2
print(energy)


Reward: +15 points, "Energy Master" Badge.
Hint: Use *= to multiply a variable's value in place.

Final Trial: The Apprentice's Graduation
Challenge: Apply all skills to solve a final test.
Prompt: The Elder Pythonian grants you a final test: Write a script that asks for a user's name, age, and calculates their birth year, then prints it.
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
`;