const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, getQuestions, addScore, getScores } = require('./database.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend

initDB();

// API Routes
app.get('/api/questions', (req, res) => {
  getQuestions((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Transform to frontend format {question, options[], correct}
    const quizData = rows.map(row => ({
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correct: row.correct
    }));
    res.json(quizData);
  });
});

app.post('/api/scores', (req, res) => {
  const { name, score, total } = req.body;
  if (!name || score === undefined || total === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  addScore(name, score, total, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Score saved!' });
  });
});

app.get('/api/scores', (req, res) => {
  getScores((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Quiz backend running on http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
});

