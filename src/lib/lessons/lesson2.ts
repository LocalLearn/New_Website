import { Challenge } from '../types';

export const lesson2Content: Challenge[] = [
  {
    id: 'lesson2-challenge1',
    primerAndChallenge: `✨ **Boolean Values**

In Python, True and False are special Boolean values:
- True: represents a condition that is correct
- False: represents a condition that is incorrect

🧪 **Challenge**:
The Gatekeeper only lets you through if you answer 'True'. Assign the correct Boolean value to open the gate.`,
    correctSolution: `answer = True
print(answer)`,
    reward: '🔑 +10 points, "Truth Seeker" Badge'
  },
  {
    id: 'lesson2-challenge2',
    primerAndChallenge: `❌ **Falsy Values**

Python has several values that are considered "falsy":
- False: Boolean false
- None: represents nothing
- 0: zero in any numeric type
- Empty sequences: "", [], {}

🧪 **Challenge**:
Only those who recognize falsy values can escape the trap. Identify a falsy value and print it using bool().`,
    correctSolution: `print(bool(0))`,
    reward: '🔍 +10 points, "Falsy Finder" Badge'
  },
  {
    id: 'lesson2-challenge3',
    primerAndChallenge: `🚪 **Simple If Statements**

Control program flow with if statements:
\`\`\`python
if condition:
    # code to run if condition is True
\`\`\`

🧪 **Challenge**:
Write an if statement that only prints 'Welcome!' if the user enters the correct password ('python').`,
    correctSolution: `password = input("Enter the password: ")
if password == "python":
    print("Welcome!")`,
    reward: '🔐 +15 points, "Gatekeeper\'s Approval" Badge'
  },
  {
    id: 'lesson2-challenge4',
    primerAndChallenge: `🔄 **If-Else Statements**

Handle both True and False conditions:
\`\`\`python
if condition:
    # code for True
else:
    # code for False
\`\`\`

🧪 **Challenge**:
You arrive at a fork in the road. If you choose 'left', print 'You found a treasure!' Otherwise, print 'You found a trap!'`,
    correctSolution: `direction = input("Which way? (left/right): ")
if direction == "left":
    print("You found a treasure!")
else:
    print("You found a trap!")`,
    reward: '🗺️ +15 points, "Pathfinder" Badge'
  },
  {
    id: 'lesson2-challenge5',
    primerAndChallenge: `🏰 **Multiple Conditions with elif**

Handle multiple conditions in sequence:
\`\`\`python
if condition1:
    # code for first condition
elif condition2:
    # code for second condition
else:
    # code if no conditions match
\`\`\`

🧪 **Challenge**:
The door opens based on your rank:
'Knight' -> 'You are honored!'
'Squire' -> 'You may enter.'
Anything else -> 'Access denied.'`,
    correctSolution: `rank = input("Enter your rank: ")
if rank == "Knight":
    print("You are honored!")
elif rank == "Squire":
    print("You may enter.")
else:
    print("Access denied.")`,
    reward: '👑 +20 points, "Decision Master" Badge'
  },
  {
    id: 'lesson2-challenge6',
    primerAndChallenge: `📦 **Nested Conditionals**

Place if statements inside other if statements:
\`\`\`python
if outer_condition:
    if inner_condition:
        # code for both conditions True
    else:
        # code for outer True, inner False
else:
    # code for outer False
\`\`\`

🧪 **Challenge**:
You must pass two tests:
Be a 'Wizard'.
Have a power level of at least 50.`,
    correctSolution: `role = input("Enter your role: ")
power = int(input("Enter your power level: "))
if role == "Wizard":
    if power >= 50:
        print("You are worthy!")
    else:
        print("Increase your power!")
else:
    print("Only Wizards may enter.")`,
    reward: '🧙‍♂️ +25 points, "Maze Solver" Badge'
  },
  {
    id: 'lesson2-challenge7',
    primerAndChallenge: `🔗 **Logical Operators**

Combine conditions using and, or, not:
\`\`\`python
if condition1 and condition2:  # both must be True
if condition1 or condition2:   # at least one must be True
if not condition:             # True if condition is False
\`\`\`

🧪 **Challenge**:
To enter the castle, you must meet at least one of these conditions:
Have a 'Golden Key'.
Be an 'Elite Member'.
Write a script that asks "Do you have a Golden Key? (yes/no): "
and "Are you an Elite Member? (yes/no): "
`
    ,
    correctSolution: `has_key = input("Do you have a Golden Key? (yes/no): ") == "yes"
is_elite = input("Are you an Elite Member? (yes/no): ") == "yes"
if has_key or is_elite:
    print("You may enter the castle.")
else:
    print("Access denied.")`,
    reward: '🏰 +30 points, "Castle Guardian" Badge'
  }
];