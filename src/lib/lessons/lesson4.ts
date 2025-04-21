import { Challenge } from '../types';

export const lesson4Content: Challenge[] = [
  {
    id: 'lesson4-challenge1',
    primerAndChallenge: `📝 **Function Basics**

Functions are reusable blocks of code:
\`\`\`
def function_name():
    # code here
function_name() #calls function
\`\`\`

🧪 **Challenge**:
Define a function named unlock_gate that prints "Gate Opened!" and call the function.`,
    correctSolution: `def unlock_gate():
    print("Gate Opened!")
unlock_gate()`,
    reward: '🔓 +10 points, "Function Summoner" Badge'
  },
  {
    id: 'lesson4-challenge2',
    primerAndChallenge: `🔄 **Code Reusability**

Functions allow us to write code once and use it multiple times:
\`\`\`
greet()  # First call
greet()  # Second call
\`\`\`

🧪 **Challenge**:
Define a function greet() that prints 'Hello, Adventurer!' and call it twice.`,
    correctSolution: `def greet():
    print("Hello, Adventurer!")
greet()
greet()`,
    reward: '🔁 +15 points, "Code Reuser" Badge'
  },
  {
    id: 'lesson4-challenge3',
    primerAndChallenge: `📥 **Function Parameters**

Functions can accept inputs (parameters):
\`\`\`
def example(example_input):
    print(example_input)
\`\`\`

🧪 **Challenge**:
Create a function welcome(name) that prints "Welcome, [name]!"`,
    correctSolution: `def welcome(name):
    print(f"Welcome, {name}!")
welcome("Alice")`,
    reward: '👋 +15 points, "Name Enchanter" Badge'
  },
  {
    id: 'lesson4-challenge4',
    primerAndChallenge: `➕ **Multiple Parameters**

Functions can take multiple inputs:
\`\`\`
def example(param1, param2):
    # use both parameters here
\`\`\`

🧪 **Challenge**:
Write a function add(a, b) that takes two numbers and prints their sum.`,
    correctSolution: `def add(a, b):
    print(a + b)
add(3, 5)`,
    reward: '🧮 +15 points, "Addition Altar" Badge'
  },
  {
    id: 'lesson4-challenge5',
    primerAndChallenge: `🔄 **Return Values**

Functions can send back values using return:
\`\`\`
def example():
    return some_return_variable
\`\`\`

🧪 **Challenge**:
Write a function square(num) that returns the square of a number.
Store the result in a variable and print it.`,
    correctSolution: `def square(num):
    return num * num
result = square(4)
print(result)`,
    reward: '📊 +20 points, "Return Master" Badge'
  },
  {
    id: 'lesson4-challenge6',
    primerAndChallenge: `🌍 **Global Variables**
    
Local variables only exist inside the function where they are defined 
\`\`\`
def secret():
    message = "This is hidden!"
secret()
print(message)  # This will cause an error!
\`\`\`

Use global variables to modify variables outside functions:
\`\`\`
def example():
    global x
    x = 10
example() # ← this is essential to assign the variable
print(x) #x is now revealed outside of the function!
\`\`\`

🧪 **Challenge**:
Create a function 'reveal' that makes a global variable message 'Now I can be seen!' accessible outside the function.`,
    correctSolution: `def reveal():
    global message
    message = "Now I can be seen!"
reveal()
print(message)`,
    reward: '🌐 +20 points, "Global Wizard" Badge'
  },
  {
    id: 'lesson4-challenge7',
    primerAndChallenge: `λ **Lambda Functions**

Lambda functions are short, one-line functions:
\`\`\`
square = lambda x: x * x
\`\`\`

🧪 **Challenge**:
Write a lambda function that takes a number 'x' and returns its cube.`,
    correctSolution: `cube = lambda x: x ** 3
print(cube(3))`,
    reward: 'λ +15 points, "Lambda Sorcerer" Badge'
  },
  {
    id: 'lesson4-challenge8',
    primerAndChallenge: `λ **Quick Lambda**

Lambda functions are perfect for simple operations:
\`\`\`
add = lambda x, y: x + y
\`\`\`

🧪 **Challenge**:
Write a lambda function add that takes two arguments and returns their sum.`,
    correctSolution: `add = lambda x, y: x + y
print(add(4, 7))`,
    reward: '⚡ +15 points, "Lambda Master" Badge'
  },
  {
    id: 'lesson4-challenge9',
    primerAndChallenge: `🔄 **Function Integration**

You can combine multiple concepts in a single function:
- Parameters
- Conditionals
- Return values

🧪 **Challenge**:
Write a function calculate(operation, x, y) that:
- Takes operation ("add" or "multiply") and two numbers ("x" or "y")
- Returns the result of the operation or "Invalid operation" if the operation is invalid.
Test with both operations!`,
    correctSolution: `def calculate(operation, x, y):
    if operation == "add":
        return x + y
    elif operation == "multiply":
        return x * y
    else:
        return "Invalid operation"
print(calculate("add", 5, 10))
print(calculate("multiply", 3, 4))`,
    reward: '🎓 +30 points, "Function Grandmaster" Badge'
  }
];