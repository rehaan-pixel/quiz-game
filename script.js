let quizData = [];
let score = 0;
let answers = [];
let nameInput = null;
let currentQuestion = 0;
let navContainer = null;

const quizContainer = document.getElementById('quiz-container');
const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result-screen');
const allQuestionsEl = document.getElementById('all-questions');
const progressFillEl = document.getElementById('progress-fill');
const submitBtn = document.getElementById('submit-quiz');
const startQuizBtn = document.getElementById('start-quiz');
const restartQuizBtn = document.getElementById('restart-quiz');
const scoreEl = document.getElementById('score');
const nameEl = document.getElementById('player-name');
const leaderboardList = document.getElementById('leaderboard-list');

async function loadQuizData() {
  try {
    const response = await fetch('/api/questions');
    let data = await response.json();
    // Use backend {options: [...], correct: "option3"}
    quizData = data.map(row => ({
      question: row.question,
      options: row.options || [row.option1, row.option2, row.option3, row.option4],
      correct: parseInt(row.correct.charAt(row.correct.length - 1)) - 1
    }));
    console.log('Loaded & converted', quizData.length, 'questions, options:', quizData[0].options?.length);
  } catch (err) {
    console.error('Backend failed, using fallback');
    quizData = [
      {question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1},
      {question: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2},
      {question: "Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1},
      {question: "Largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3},
      {question: "Romeo and Juliet author?", options: ["Dickens", "Shakespeare", "Austen", "Twain"], correct: 1}
    ];
  }
}

function createNavigation() {
  if (navContainer) navContainer.remove();
  
  navContainer = document.createElement('div');
  navContainer.id = 'nav-container';
  navContainer.style.cssText = 'margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;';
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.onclick = () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      showCurrentQuestion();
    }
  };
  prevBtn.style.display = 'none';
  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.onclick = () => {
    if (currentQuestion < quizData.length - 1) {
      currentQuestion++;
    } else if (answers.every(a => a !== null)) {
      showResults();
      return;
    }
    showCurrentQuestion();
  };
  
  navContainer.appendChild(prevBtn);
  navContainer.appendChild(nextBtn);
  quizContainer.appendChild(navContainer);
}

startQuizBtn.addEventListener('click', async () => {
  nameInput = nameEl.value.trim() || 'Anonymous';
  if (!nameInput) return alert('Enter name for leaderboard!');
  
  await loadQuizData();
  if (quizData.length === 0) return alert('No questions loaded!');
  
  answers = new Array(quizData.length).fill(null);
  currentQuestion = 0;
  
  startScreen.style.display = 'none';
  quizContainer.style.display = 'block';
  submitBtn.style.display = 'none';
  
  showCurrentQuestion();
  createNavigation();
  updateProgress();
});

function showCurrentQuestion() {
  allQuestionsEl.innerHTML = '';
  
  const q = quizData[currentQuestion];
  const questionDiv = document.createElement('div');
  questionDiv.classList.add('question');
  
  const title = document.createElement('h3');
  title.textContent = `Question ${currentQuestion + 1} of ${quizData.length}: ${q.question}`;
  questionDiv.appendChild(title);
  
  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('options-group');
  
  q.options.forEach((option, index) => {
    const opt = document.createElement('div');
    opt.className = 'option' + (answers[currentQuestion] === index ? ' selected' : '');
    opt.textContent = option;
    opt.onclick = () => {
      answers[currentQuestion] = index;
      showCurrentQuestion();
    };
    optionsDiv.appendChild(opt);
  });
  
  questionDiv.appendChild(optionsDiv);
  allQuestionsEl.appendChild(questionDiv);
  
  // Update buttons
  if (navContainer && navContainer.children[0]) {
    navContainer.children[0].style.display = currentQuestion > 0 ? 'inline-block' : 'none';
  }
  if (navContainer && navContainer.children[1]) {
    navContainer.children[1].textContent = currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next';
  }
}

function updateProgress() {
  const answered = answers.filter(x => x !== null).length;
  progressFillEl.style.width = (answered / quizData.length * 100) + '%';
}

async function showResults() {
  if (navContainer) navContainer.style.display = 'none';
  quizContainer.style.display = 'none';
  resultScreen.style.display = 'block';
  
  score = 0;
  answers.forEach((ans, i) => {
    if (ans === quizData[i].correct) score++;
  });
  
  scoreEl.innerHTML = `You scored <strong>${score}/${quizData.length}</strong> (${Math.round(score/quizData.length*100)}%)`;
  
  // Save score
  try {
    await fetch('/api/scores', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: nameInput, score, total: quizData.length })
    });
  } catch(e) { console.error('Save error'); }
  
  // Leaderboard  
  try {
    const res = await fetch('/api/scores');
    const scores = await res.json();
    leaderboardList.innerHTML = scores.slice(0,10).map((s,i) => 
      `<div class="leaderboard-item">
        <span>${i+1}. ${s.name}</span>
        <span>${s.score}/${s.total}</span>
      </div>`
    ).join('') || 'No scores yet';
  } catch(e) { leaderboardList.innerHTML = 'Loading...'; }
}

restartQuizBtn.addEventListener('click', () => {
  resultScreen.style.display = 'none';
  startScreen.style.display = 'block';
  quizContainer.style.display = 'none';
  if (navContainer) navContainer.remove();
  nameEl.value = '';
  quizData = [];
  answers = [];
  currentQuestion = 0;
  scoreEl.innerHTML = 'Calculating...';
  leaderboardList.innerHTML = 'Loading scores...';
});
