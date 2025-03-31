export const lesson3Content = `
Gamified Real-Time Skill Builder Game for Lesson 3
Game Theme: "Python Adventurer: The Looping Labyrinth"
In this chapter of the quest, students must master loops to navigate the treacherous Looping Labyrinth. They’ll need to solve puzzles and challenges to progress through levels, unlocking new powers of repetition along the way.

Learning Objectives for the Game
By the end of the game, students will:
Understand the purpose and syntax of while and for loops.
Use loops to automate repetitive tasks.
Implement nested loops for more complex tasks.
Learn how to control loops with break and continue.

Game Structure and Challenges
Level 1: Entering the Looping Labyrinth
Topic: The Basics of while Loops.
Challenge 1: "The Infinite Door"
Prompt: “The first door only opens if you can create a simple while loop. Write a loop that prints the numbers 1 to 5.”
Correct Input:
python
CopyEdit
i = 1
while i <= 5:
    print(i)
    i += 1


Reward: +10 points, “Loop Initiator” Badge.
Hint (if needed): “A while loop repeats while its condition is True. Use i += 1 to increase the value of i each time.”
Challenge 2: "The Countdown Switch"
Prompt: “Create a while loop that counts down from 5 to 1 and prints ‘Blast off!’ after the loop finishes.”
Correct Input:
python
CopyEdit
i = 5
while i > 0:
    print(i)
    i -= 1
print("Blast off!")


Reward: +15 points, “Countdown Conqueror” Badge.

Level 2: The For-Loop Forge
Topic: Introduction to for Loops and Iterables.
Challenge 3: "The Range Key"
Prompt: “Use a for loop and the range() function to print the numbers 0 to 4.”
Correct Input:
python
CopyEdit
for i in range(5):
    print(i)


Reward: +10 points, “Range Rover” Badge.
Feedback: Highlight how range(5) generates numbers from 0 to 4.
Challenge 4: "Summoning the Sum"
Prompt: “Use a for loop to calculate the sum of the numbers 1 to 10 and print the result.”
Correct Input:
python
CopyEdit
total = 0
for i in range(1, 11):
    total += i
print(total)


Reward: +15 points, “Sum Sorcerer” Badge.
Challenge 5: "The Custom Step"
Prompt: “Use range() to create a for loop that prints all even numbers from 2 to 10.”
Correct Input:
python
CopyEdit
for i in range(2, 11, 2):
    print(i)


Reward: +10 points, “Step Master” Badge.
Hint: “The third argument in range(start, end, step) is the step size.”

Level 3: Controlling the Labyrinth
Topic: Using break and continue to Control Loops.
Challenge 6: "The Breaking Spell"
Prompt: “Write a for loop that prints numbers 1 to 10 but stops if the number is 7.”
Correct Input:
python
CopyEdit
for i in range(1, 11):
    if i == 7:
        break
    print(i)


Reward: +10 points, “Breaker of Loops” Badge.
Challenge 7: "The Skipping Trap"
Prompt: “Write a for loop that prints numbers from 1 to 10 but skips the number 5.”
Correct Input:
python
CopyEdit
for i in range(1, 11):
    if i == 5:
        continue
    print(i)


Reward: +10 points, “Skip Master” Badge.

Level 4: Nested Loops and Patterns
Topic: Using Nested Loops to Solve Complex Problems.
Challenge 8: "The Triangle Gate"
Prompt: *“Use nested loops to print the following pattern:
markdown
CopyEdit
*
**
***
****
*****    

Correct Input:
python
CopyEdit
for i in range(1, 6):
    for j in range(i):
        print('*', end='')
    print()


Reward: +20 points, “Pattern Crafter” Badge.
Hint: “Use end='' in the print() function to stay on the same line.”
Challenge 9: "The Multiplication Maze"
Prompt: “Write a nested loop to print a multiplication table for numbers 1 to 3.”
Correct Input:
python
CopyEdit
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} * {j} = {i * j}")
    print()


Reward: +25 points, “Multiplication Master” Badge.

Level 5: Loop Integration Challenge
Topic: Combining Loops and Logic in a Mini Project.
Challenge 10: "The Sum Finder"
Prompt: “Write a program that asks the user for a number n and calculates the sum of all numbers from 1 to n.”
Correct Input:
python
CopyEdit
n = int(input("Enter a number: "))
total = 0
for i in range(1, n + 1):
    total += i
print("The sum is", total)


Reward: +20 points, “Loop Integrator” Badge.
Challenge 11: "Number Guessing Game"
Prompt: “Write a program that generates a secret number (e.g., 7) and lets the user guess it until they’re correct. Provide feedback on each guess.”
Correct Input:
python
CopyEdit
secret = 7
guess = 0
while guess != secret:
    guess = int(input("Guess the number: "))
    if guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")
print("You got it!")


Reward: +30 points, “Game Master” Badge.

Game Completion: The Labyrinth Conqueror Trophy
When students complete all challenges, they earn the “Labyrinth Conqueror” Trophy and see the message:
“You’ve mastered loops and tamed the Labyrinth! Next, use your powers to handle data with strings and input.”
`;