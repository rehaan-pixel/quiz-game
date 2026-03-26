const mysql = require('mysql2');

let connection;
let dbConnected = false;

function initDB(callback) {
  if (dbConnected) {
    if (callback) callback(null);
    return;
  }

  connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'tiger',
    database: 'quiz'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('MySQL connection error:', err);
      dbConnected = false;
      if (callback) callback(err);
      return;
    }
    console.log('Connected to MySQL quiz database');
    dbConnected = true;
    if (callback) callback(null);
  });
}

function getQuestions(callback) {
  if (!dbConnected) {
    return callback(new Error('Database not connected'));
  }
  connection.query('SELECT * FROM questions', function(err, rows) {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

function addScore(name, score, total, callback) {
  if (!dbConnected) {
    return callback(new Error('Database not connected'));
  }
  connection.query(
    'INSERT INTO scores (name, score, total) VALUES (?, ?, ?)',
    [name, score, total],
    function(err, result) {
      callback(err);
    }
  );
}

function getScores(callback) {
  if (!dbConnected) {
    return callback(new Error('Database not connected'));
  }
  connection.query('SELECT * FROM scores ORDER BY date DESC', function(err, rows) {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

module.exports = { initDB, getQuestions, addScore, getScores };
