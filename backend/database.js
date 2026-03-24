const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'quiz.db');
const db = new sqlite3.Database(dbPath);

function initDB() {
  db.serialize(() => {
    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      option1 TEXT NOT NULL,
      option2 TEXT NOT NULL,
      option3 TEXT NOT NULL,
      option4 TEXT NOT NULL,
      correct INTEGER NOT NULL
    )`);

    // Scores table
    db.run(`CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed 7 sample questions
    const seedQuestions = [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: 2
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
      },
      {
        question: "Largest star in our solar system?",
        options: ["Rigel", "Sun", "Betelgeuse", "Sirius"],
        correct: 1
      },
      {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        correct: 2
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
      },
      {
        question: "Nearest star to our solar system (after Sun)?",
        options: ["Betelgeuse", "Proxima Centauri", "Sirius", "Rigel"],
        correct: 1
      },
      {
        question: "What is the largest mammal on Earth?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
      }
    ];

    // Insert if not exists
    seedQuestions.forEach(q => {
      db.get("SELECT id FROM questions WHERE question = ?", [q.question], (err, row) => {
        if (!row) {
          db.run(
            `INSERT INTO questions (question, option1, option2, option3, option4, correct)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [q.question, q.options[0], q.options[1], q.options[2], q.options[3], q.correct]
          );
        }
      });
    });

    console.log('Database initialized with 7 questions at', dbPath);
  });
}

function getQuestions(callback) {
  db.all("SELECT * FROM questions", [], callback);
}

function addScore(name, score, total, callback) {
  db.run(
    "INSERT INTO scores (name, score, total) VALUES (?, ?, ?)",
    [name, score, total],
    callback
  );
}

function getScores(callback) {
  db.all("SELECT * FROM scores ORDER BY date DESC LIMIT 10", [], callback);
}

module.exports = { initDB, getQuestions, addScore, getScores, db };
