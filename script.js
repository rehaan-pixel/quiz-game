// Simple Quiz Data - Beginner friendly questions
const quizData = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Text Making Language"],
        correct: 0
    },
    {
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h1>", "<h6>", "<heading>", "<head>"],
        correct: 0
    },
    {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"],
        correct: 2
    },
    {
        question: "Which CSS property controls the text size?",
        options: ["text-size", "font-style", "text-size", "font-size"],
        correct: 3
    },
    {
        question: "JavaScript files have the extension:",
        options: [".js", ".javascript", ".jvs", ".jscript"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let answers = new Array(quizData.length).fill(null);

const quizContainer = document.getElementById('quiz-container');
const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result-screen');
const allQuestionsEl = document.getElementById('all-questions');

const progressFillEl = document.getElementById('progress-fill');
const submitBtn = document.getElementById('submit-quiz');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const startQuizBtn = document.getElementById('start-quiz');
const restartQuizBtn = document.getElementById('restart-quiz');
const scoreEl = document.getElementById('score');

// Start Quiz
startQuizBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    score = 0;
    answers = new Array(quizData.length).fill(null);
    showAllQuestions();
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'none';
}

// Show All Questions - Single Page
function showAllQuestions() {
    allQuestionsEl.innerHTML = '';
    
    quizData.forEach((q, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Question ${qIndex + 1}: ${q.question}`;
        questionDiv.appendChild(questionTitle);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options-group');
        
        q.options.forEach((option, optIndex) => {
            const optDiv = document.createElement('div');
            optDiv.textContent = option;
            optDiv.classList.add('option');
            optDiv.addEventListener('click', (e) => selectOption(qIndex, optIndex, optDiv));
            optionsDiv.appendChild(optDiv);
        });
        
        questionDiv.appendChild(optionsDiv);
        allQuestionsEl.appendChild(questionDiv);
    });
}

// Select Option
function selectOption(qIndex, optIndex, optEl) {
    // Remove previous selection for this question
    const questionOptions = optEl.parentNode.querySelectorAll('.option');
    questionOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Select this option
    optEl.classList.add('selected');
    
    // Save answer
    answers[qIndex] = optIndex;
    
    const answeredCount = answers.filter(a => a !== null).length;
    if (answeredCount === quizData.length) {
        submitBtn.style.display = 'inline-block';
    }
}



// Update Progress
function updateProgress() {
    const answeredCount = answers.filter(a => a !== null).length;
    const progressPercent = (answeredCount / quizData.length) * 100;
    progressFillEl.style.width = progressPercent + '%';
}

// Submit Quiz
submitBtn.addEventListener('click', () => {
    const unanswered = answers.some(a => a === null);
    if (unanswered) {
        alert('Please answer all questions!');
        return;
    }
    showResults();
});

// Show Results
function showResults() {
    quizContainer.style.display = 'none';
    resultScreen.style.display = 'block';
    
    // Calculate score
    score = 0;
    answers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });
    
    const percentage = Math.round((score / quizData.length) * 100);
    scoreEl.innerHTML = `You scored <strong>${score}/${quizData.length}</strong> (${percentage}%)`;
}

// Restart Quiz
restartQuizBtn.addEventListener('click', () => {
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
});
