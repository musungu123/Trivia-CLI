"use strict";

const readline = require("readline");

const timePerQuestion = 10;
const gameTime = 60;        

const questions = [
  { question: "What is the capital of Kenya?", choices: ["Mombasa", "Kisumu", "Nairobi", "Nakuru"], answer: 2 },
  { question: "What is 12 x 12?", choices: ["124", "132", "144", "154"], answer: 2 },
  { question: "Which planet is known as the Red Planet?", choices: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1 },
  { question: "What does JSON stand for?", choices: ["JavaScript Object Notation", "Java Standard Object Name", "JavaScript Oriented Network", "Joined Script Object Node"], answer: 0 },
  { question: "Which operator checks value AND type?", choices: ["==", "=", "===", "!="], answer: 2 }
];

const letters = ["A", "B", "C", "D"];

// ----- Game variables -----
let currentQuestion = 0; 
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timedOutCount = 0;
let gameStarted = false;
let gameOver = false;
let questionTimer;        // timer for one question
let gameTimer;            // timer for the whole game

// Set up reading from the keyboard
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ----- Functions -----

// Show the welcome message
function showWelcome() {
  console.log("=== Trivia Game ===");
  console.log(questions.length + " questions, " + timePerQuestion + " seconds each.");
  console.log("Type A, B, C or D to answer.");
  console.log("Press Enter to start.");
}

// Start the game
function startGame() {
  gameStarted = true;

  // Stop the whole game after gameTime seconds
  gameTimer = setTimeout(function () {
    console.log("\nThe game time is over!");
    endGame();
  }, gameTime * 1000);

  askQuestion();
}

// Show the current question and start its timer
function askQuestion() {
  const q = questions[currentQuestion];

  console.log("\nQuestion " + (currentQuestion + 1) + ": " + q.question);
  for (let i = 0; i < q.choices.length; i++) {
    console.log("  " + letters[i] + ") " + q.choices[i]);
  }

  // If the user takes too long, this runs
  questionTimer = setTimeout(function () {
    console.log("\nTime's up! The answer was " + letters[q.answer] + ") " + q.choices[q.answer]);
    timedOutCount++;
    nextQuestion();
  }, timePerQuestion * 1000);
}

// Check the user's answer and give feedback
function checkAnswer(input) {
  const q = questions[currentQuestion];
  const choice = letters.indexOf(input.trim().toUpperCase()); // A=0, B=1, C=2, D=3

  // If the user typed something that is not A-D, ask again
  if (choice === -1) {
    console.log("Please type A, B, C or D.");
    return;
  }

  clearTimeout(questionTimer); // stop the question timer

  if (choice === q.answer) {
    console.log("\nCorrect! +10 points");
    score = score + 10;
    correctCount++;
  } else {
    console.log("\nIncorrect. The answer was " + letters[q.answer] + ") " + q.choices[q.answer]);
    wrongCount++;
  }

  nextQuestion();
}

// Go to the next question (or finish)
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    askQuestion();
  } else {
    endGame();
  }
}

// Show the final results
function endGame() {
  if (gameOver) {
    return; 
  }
  gameOver = true;

  clearTimeout(questionTimer);
  clearTimeout(gameTimer);

  console.log("\n=== GAME OVER ===");
  console.log("Score: " + score);
  console.log("Correct: " + correctCount);
  console.log("Incorrect: " + wrongCount);
  console.log("Timed out: " + timedOutCount);

  rl.close(); // lets the program finish
}

// This runs every time the user types something and presses Enter
rl.on("line", function (input) {
  if (gameOver) {
    return;
  }

  if (gameStarted === false) {
    startGame();
  } else {
    checkAnswer(input);
  }
});

showWelcome();

