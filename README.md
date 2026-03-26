# Simple Quiz App with MongoDB Backend

## Backend (MongoDB 'compress')
- Connected to `mongodb://localhost:27017/compress`
- APIs: GET /api/questions, POST /api/scores, GET /api/scores

## Run
```
cd backend
npm install
npm run dev
```
Open http://localhost:3000

## Seed Data (Mongo Shell)
```
use compress
db.questions.insertMany([{
  question: 'What is 2+2?',
  option1: '3',
  option2: '4',
  option3: '5',
  option4: '6',
  correct: 'option2'
}, {
  question: 'Capital of France?',
  option1: 'Berlin',
  option2: 'Madrid',
  option3: 'Paris',
  option4: 'Rome',
  correct: 'option3'
}])
```

## Migration from SQLite
1. Install sqlite cli if needed.
2. `sqlite3 quiz.db \"SELECT * FROM questions;\" | tail -n +2 > questions.csv`
3. Import CSV to MongoDB Compass (collections.questions).

MongoDB must be running locally.

