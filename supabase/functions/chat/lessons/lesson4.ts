export const lesson4Content = `
Gamified Real-Time Skill Builder Game for Lesson 4
Game Theme: "Python Adventurer: The Temple of Functions"
Deep within the Temple of Functions, powerful Python wizards have hidden ancient function scrolls that grant mastery over reusable code. Adventurers must unlock the secrets of functions, arguments, return values, and scope to harness the power of modular programming and claim the Function Master’s Staff!

Learning Objectives for the Game
By the end of the game, students will:
Understand what functions are and why they are useful.
Define and call functions in Python.
Use parameters, arguments, and return values effectively.
Understand variable scope (local vs. global variables).
Use lambda functions for concise operations.

Game Structure and Challenges
Level 1: The Function Gate
Topic: Introduction to Functions
Challenge 1: "The Call of Power"
 Prompt: "The gate only opens if you define and call a function named unlock_gate that prints 'Gate Opened!'."

Correct Input:
def unlock_gate():
    print("Gate Opened!")
unlock_gate()

 🏆 Reward: +10 points, “Function Summoner” Badge.

Challenge 2: "The Scroll of Reusability"
 Prompt: "Functions allow us to reuse code! Define a function greet() that prints ‘Hello, Adventurer!’ and call it twice."

Correct Input:
def greet():
    print("Hello, Adventurer!")
greet()
greet()

 🏆 Reward: +15 points, “Code Reuser” Badge.

Level 2: The Chamber of Arguments
Topic: Function Parameters and Arguments
Challenge 3: "The Personalized Portal"
 Prompt: "Define a function welcome(name) that takes a name as input and prints ‘Welcome, [name]!’"

Correct Input:
def welcome(name):
    print(f"Welcome, {name}!")
welcome("Alice")

 🏆 Reward: +15 points, “Name Enchanter” Badge.

Challenge 4: "The Addition Altar"
 Prompt: "Write a function add(a, b) that takes two numbers and prints their sum."

Correct Input:
def add(a, b):
    print(a + b)
add(3, 5)

 🏆 Reward: +15 points, “Math Mage” Badge.

Level 3: The Chamber of Return Values
Topic: Returning Values from Functions
Challenge 5: "The Magic Number"
 Prompt: "Define a function square(num) that returns the square of a number. Then, store the result in a variable and print it."

Correct Input:
def square(num):
    return num * num
result = square(4)
print(result)

 🏆 Reward: +20 points, “Return Master” Badge.

Challenge 6: "The Multiplier Scroll"
 Prompt: "Write a function multiply(x, y) that returns the product of two numbers, and print the result."

Correct Input:
def multiply(x, y):
    return x * y
print(multiply(6, 7))

 🏆 Reward: +20 points, “Multiplication Mage” Badge.

Level 4: The Dungeon of Scope
Topic: Function Scope and Lifetime
Challenge 7: "The Vanishing Variable"
 Prompt: "Define a function that declares a local variable inside it, then try printing it outside the function. Observe what happens!"

Correct Input:
def secret():
    message = "This is hidden!"
    print(message)
secret()
print(message)  # This will cause an error!

 🏆 Reward: +15 points, “Scope Guardian” Badge.

Challenge 8: "The Global Invocation"
 Prompt: "Modify the function so that the variable message is accessible outside the function using global."

Correct Input:
def reveal():
    global message
    message = "Now I can be seen!"
reveal()
print(message)

 🏆 Reward: +20 points, “Global Wizard” Badge.

Level 5: The Chamber of Shadows
Topic: Lambda Functions
Challenge 9: "The One-Line Spell"
 Prompt: "Write a lambda function that takes a number and returns its cube."

Correct Input:
cube = lambda x: x ** 3
print(cube(3))

 🏆 Reward: +15 points, “Lambda Sorcerer” Badge.

Challenge 10: "The Quick Adder"
 Prompt: "Write a lambda function add that takes two arguments and returns their sum."

Correct Input:
add = lambda x, y: x + y
print(add(4, 7))

 🏆 Reward: +15 points, “Lambda Master” Badge.

Bonus Level: The Final Challenge – The Function Masterpiece
Topic: Combining Functions
Challenge 11: "The Ultimate Spell"
 Prompt: "Write a function calculate(operation, x, y) that takes an operation ('add' or 'multiply') and two numbers, then returns the result."

Correct Input:
def calculate(operation, x, y):
    if operation == "add":
        return x + y
    elif operation == "multiply":
        return x * y
    else:
        return "Invalid operation"
print(calculate("add", 5, 10))
print(calculate("multiply", 3, 4))

 🏆 Reward: +30 points, “Function Grandmaster” Trophy.

Game Completion: The Function Master’s Staff
Upon completing all challenges, players receive the “Function Master’s Staff” and this message:
 "You have uncovered the secrets of functions and scope! With this power, you are ready to conquer even greater coding challenges."
`;