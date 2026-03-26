const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tiger',
  database: 'quiz'
});

connection.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
  console.log('Connected for seeding');
  
  const questions = [
    ['What is the capital of France?', 'Berlin', 'Madrid', 'Paris', 'Rome', 'option3'],
    ['Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'option2'],
    ['Largest star in our solar system?', 'Rigel', 'Sun', 'Betelgeuse', 'Sirius', 'option2'],
    ['How many continents are there on Earth?', '5', '6', '7', '8', 'option3'],
    ['What is the largest ocean on Earth?', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 'option4'],
    ['Nearest star to our solar system?', 'Betelgeuse', 'Proxima Centauri', 'Sirius', 'Rigel', 'option2'],
    ['Largest mammal on Earth?', 'Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus', 'option2']
  ];

  connection.query('DELETE FROM questions', (err) => {
    connection.query('INSERT INTO questions (question, option1, option2, option3, option4, correct) VALUES ?', [questions], (err) => {
      if (err) console.error('Seed error:', err);
      else console.log('✅ Seeded 7 questions with leaderboard ready!');
      connection.end();
      process.exit(0);
    });
  });
});
