export const lesson2Content = `
Gamified Real-Time Skill Builder Game for Lesson 2
Game Theme: "Python Adventurer: The Gate of Decisions"
In this chapter of the quest, students must navigate through the Gate of Decisions, a mystical fortress that challenges their ability to make the right choices using Python conditionals. Each decision must be made wisely to unlock new paths and advance further into the castle.
Learning Objectives for the Game
By the end of the game, students will:
Understand Boolean values and truthy/falsy concepts.
Use if, if-else, and elif statements to control program flow.
Apply logical operators (and, or, not) in conditionals.
Write nested conditionals for complex decision-making.
Follow best practices for writing clean and efficient conditional statements.

Game Structure and Challenges
Level 1: Entering the Gate of Decisions
Topic: Boolean Logic and Truthy/Falsy Values
Challenge 1.1: "The True Key"
 Prompt: "The Gatekeeper only lets you through if you answer 'True'. Assign the correct Boolean value to open the gate."

 ✅ Correct Input:

 python
CopyEdit
answer = True
print(answer)
 🏆 Reward: +10 points, “Truth Seeker” Badge.
 💡 Hint: "Boolean values in Python are True and False."


Challenge 1.2: "The Falsy Trap"
 Prompt: "Only those who recognize falsy values can escape the trap. Identify a falsy value and print it."

 ✅ Correct Input:

 python
CopyEdit
print(bool(0))  # Output should be False
 🏆 Reward: +10 points, “Falsy Finder” Badge.



Level 2: The Decision Chamber
Topic: if Statements
Challenge 2.1: "The One-Way Door"
 Prompt: "Write an if statement that only prints 'Welcome!' if the user enters the correct password ('python')."

 ✅ Correct Input:

 python
CopyEdit
password = input("Enter the password: ")
if password == "python":
    print("Welcome!")
 🏆 Reward: +15 points, “Gatekeeper’s Approval” Badge.



Level 3: The Path Splitter
Topic: if-else and elif Statements
Challenge 3.1: "The Right Turn"
 Prompt: "You arrive at a fork in the road. If you choose ‘left’, print ‘You found a treasure!’ Otherwise, print ‘You found a trap!’"

 ✅ Correct Input:

 python
CopyEdit
direction = input("Which way? (left/right): ")
if direction == "left":
    print("You found a treasure!")
else:
    print("You found a trap!")
 🏆 Reward: +15 points, “Pathfinder” Badge.


Challenge 3.2: "The Multi-Path Gate"
 Prompt: "The door opens based on your rank:


‘Knight’ -> ‘You are honored!’
‘Squire’ -> ‘You may enter.’
Anything else -> ‘Access denied.’"
✅ Correct Input:

 python
CopyEdit
rank = input("Enter your rank: ")
if rank == "Knight":
    print("You are honored!")
elif rank == "Squire":
    print("You may enter.")
else:
    print("Access denied.")
 🏆 Reward: +20 points, “Decision Master” Badge.



Level 4: The Deep Maze
Topic: Nested Conditionals
Challenge 4.1: "The Layered Puzzle"
 Prompt: "You must pass two tests:


Be a ‘Wizard’.
Have a power level of at least 50."
✅ Correct Input:

 python
CopyEdit
role = input("Enter your role: ")
power = int(input("Enter your power level: "))

if role == "Wizard":
    if power >= 50:
        print("You are worthy!")
    else:
        print("Increase your power!")
else:
    print("Only Wizards may enter.")
 🏆 Reward: +25 points, “Maze Solver” Badge.



Level 5: The Final Judgment
Topic: Logical Operators in Conditionals
Challenge 5.1: "The Ultimate Decision"
 Prompt: "To enter the castle, you must meet at least one of these conditions:


Have a ‘Golden Key’.
Be an ‘Elite Member’."
✅ Correct Input:

 python
CopyEdit
has_key = input("Do you have a Golden Key? (yes/no): ") == "yes"
is_elite = input("Are you an Elite Member? (yes/no): ") == "yes"

if has_key or is_elite:
    print("You may enter the castle.")
else:
    print("Access denied.")
 🏆 Reward: +30 points, “Castle Guardian” Badge.



Game Completion: The Gate of Decisions Trophy
Once students complete all challenges, they earn the "Gate of Decisions Conqueror" Trophy and see this message:
 "You have mastered the art of making decisions in Python! Now, use your skills to navigate loops and repetition in the next quest."

`;