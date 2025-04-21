import { Challenge } from '../types';

export const lesson3Content: Challenge[] = [
  {
    id: 'lesson3-challenge1',
    primerAndChallenge: `🔄 **While Loop Basics**

A while loop repeats code as long as a condition is True:
\`\`\`
while condition:
    # code to repeat
\`\`\`

🧪 **Challenge**:
Write a while loop that prints numbers 1 to 5.`,
    correctSolution: `i = 1
while i <= 5:
    print(i)
    i += 1`,
    reward: '🔁 +10 points, "Loop Initiator" Badge'
  },
  {
    id: 'lesson3-challenge2',
    primerAndChallenge: `⏰ **Countdown Loop**

Use a while loop to count down:
\`\`\`
while number > 0:
    # countdown code
\`\`\`

🧪 **Challenge**:
Create a countdown from 5 to 1, then print "Blast off!"`,
    correctSolution: `i = 5
while i > 0:
    print(i)
    i -= 1
print("Blast off!")`,
    reward: '🚀 +15 points, "Countdown Conqueror" Badge'
  },
  {
    id: 'lesson3-challenge3',
    primerAndChallenge: `🔄 **For Loop with Range**

The range() function generates a sequence of numbers:
- range(5): 0 to 4
- range(1, 6): 1 to 5

🧪 **Challenge**:
Use a for loop with range() to print numbers 0 to 4.`,
    correctSolution: `for i in range(5):
    print(i)`,
    reward: '📊 +10 points, "Range Rover" Badge'
  },
  {
    id: 'lesson3-challenge4',
    primerAndChallenge: `➕ **Loop with Accumulator**

Use a variable to accumulate values in a loop:
\`\`\`
total = 0
#Some loop in range:
    total = total + i
\`\`\`

🧪 **Challenge**:
Calculate the sum of numbers 1 to 10 using a for loop.`,
    correctSolution: `total = 0
for i in range(1, 11):
    total += i
print(total)`,
    reward: '💫 +15 points, "Sum Sorcerer" Badge'
  },
  {
    id: 'lesson3-challenge5',
    primerAndChallenge: `🦿 **Custom Step Range**

Use range(start, stop, step) to count by specific intervals:
\`\`\`
range(0, 10, 2): 0, 2, 4, 6, 8
\`\`\`

🧪 **Challenge**:
Use range() to print all even numbers from 2 to 10.`,
    correctSolution: `for i in range(2, 11, 2):
    print(i)`,
    reward: '👣 +10 points, "Step Master" Badge'
  },
  {
    id: 'lesson3-challenge6',
    primerAndChallenge: `⛔ **Break Statement**

Use break to exit a loop early:
\`\`\`
while True:
    if condition:
        break
\`\`\`

🧪 **Challenge**:
Write a for loop that prints numbers 1 to 10 but stops if the number is 7.`,
    correctSolution: `for i in range(1, 11):
    if i == 7:
        break
    print(i)`,
    reward: '🛑 +10 points, "Breaker of Loops" Badge'
  },
  {
    id: 'lesson3-challenge7',
    primerAndChallenge: `⏭️ **Continue Statement**

Use continue to skip the current iteration:
\`\`\`
for item in sequence:
    if condition:
        continue
    # rest of the code
\`\`\`

🧪 **Challenge**:
Write a for loop that prints numbers from 1 to 10 but skips the number 5.`,
    correctSolution: `for i in range(1, 11):
    if i == 5:
        continue
    print(i)`,
    reward: '⏩ +10 points, "Skip Master" Badge'
  },
  {
    id: 'lesson3-challenge8',
    primerAndChallenge: `🔲 **Nested Loops**

Create patterns using loops within loops:
\`\`\`
for outer in range:
    for inner in range:
        # code here
\`\`\`

🧪 **Challenge**:
Use nested loops to print the following pattern. Use end='' in the print() function to stay on the same line:
*
**
***
****
*****`,
    correctSolution: `for i in range(1, 6):
    for j in range(i):
        print('*', end='')
    print()`,
    reward: '🎨 +20 points, "Pattern Crafter" Badge'
  },
  {
    id: 'lesson3-challenge9',
    primerAndChallenge: `✖️ **Multiplication Table**

Use nested loops to create a multiplication grid:
\`\`\`
for i in range:
    for j in range:
        # calculate and print
\`\`\`

🧪 **Challenge**:
Write a nested loop to print a multiplication table for numbers 1 to 3.`,
    correctSolution: `for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} * {j} = {i * j}")
    print()`,
    reward: '📝 +25 points, "Multiplication Master" Badge'
  },
  {
    id: 'lesson3-challenge10',
    primerAndChallenge: `➕ **Sum Calculator**

Combine loops with user input:
\`\`\`
n = int(input())
# use loop to calculate
\`\`\`

🧪 **Challenge**:
Write a program that asks the user for a number n and calculates the sum of all numbers from 1 to n.`,
    correctSolution: `n = int(input("Enter a number: "))
total = 0
for i in range(1, n + 1):
    total += i
print("The sum is", total)`,
    reward: '🧮 +20 points, "Loop Integrator" Badge'
  },
  {
    id: 'lesson3-challenge11',
    primerAndChallenge: `🎮 **Number Guessing Game**

Create an interactive game using loops:
- Generate a secret number (e.g., 7)
- Let user guess until correct
- Provide feedback on each guess

🧪 **Challenge**:
Write a program that generates a secret number (7) and lets the user guess it until they're correct. Provide feedback on each guess.`,
    correctSolution: `secret = 7
guess = 0
while guess != secret:
    guess = int(input("Guess the number: "))
    if guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")
print("You got it!")`,
    reward: '🎯 +30 points, "Game Master" Badge'
  }
];