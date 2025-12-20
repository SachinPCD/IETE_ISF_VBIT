// Quiz Data with timer
const quizData = {
  title: "Web Development Fundamentals",
  timeLimit: 600, // 10 minutes in seconds
  questions: [
    {
      id: 1,
      type: "single",
      text: "Which CSS feature enables creating complex layouts with both rows and columns without using floats or positioning?",
      options: [
        "CSS Flexbox",
        "CSS Grid",
        "CSS Multi-column Layout",
        "CSS Box Model"
      ],
      correct: [1],
      explanation: "CSS Grid is specifically designed for two-dimensional layouts."
    },
    {
      id: 2,
      type: "multi",
      text: "Which of the following are considered core principles of web accessibility?",
      options: [
        "Perceivable - Information must be presentable to users in ways they can perceive",
        "Operable - Interface must be operable by all users",
        "Beautiful - Interface must be visually appealing",
        "Understandable - Information must be understandable to all users",
        "Robust - Content must be robust enough to be interpreted reliably"
      ],
      correct: [0, 1, 3, 4],
      explanation: "The four principles of WCAG are Perceivable, Operable, Understandable, and Robust."
    },
    {
      id: 3,
      type: "boolean",
      text: "JavaScript's `const` declaration prevents mutation of objects and arrays.",
      options: ["True", "False"],
      correct: [1],
      explanation: "`const` prevents reassignment but not mutation of objects/arrays."
    },
    {
      id: 4,
      type: "single",
      text: "Which performance optimization technique involves loading critical resources first?",
      options: [
        "Code Splitting",
        "Lazy Loading",
        "Critical CSS",
        "Tree Shaking"
      ],
      correct: [2],
      explanation: "Critical CSS involves extracting CSS needed for above-the-fold content."
    },
    {
      id: 5,
      type: "multi",
      text: "Which React hooks are used for managing side effects and component lifecycle?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useLayoutEffect",
        "useReducer"
      ],
      correct: [1, 3],
      explanation: "useEffect handles side effects, useLayoutEffect runs before painting."
    }
  ]
};

// State Management
let currentQuestion = 0;
let answers = [];
let results = null;
let timeLeft = quizData.timeLimit;
let timerInterval = null;
let quizStartTime = null;
let quizEndTime = null;
let isQuizStarted = false;

// DOM Elements
const elements = {
  questionText: document.getElementById('questionText'),
  questionType: document.getElementById('typeText'),
  optionsContainer: document.getElementById('optionsContainer'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  submitBtn: document.getElementById('submitBtn'),
  progressText: document.getElementById('progressText'),
  questionDots: document.getElementById('questionDots'),
  timer: document.getElementById('timer'),
  timerText: document.getElementById('timerText'),
  resultsModal: document.getElementById('resultsModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  scorePercent: document.getElementById('scorePercent'),
  resultStatus: document.getElementById('resultStatus'),
  correctCount: document.getElementById('correctCount'),
  wrongCount: document.getElementById('wrongCount'),
  unansweredCount: document.getElementById('unansweredCount'),
  timeTaken: document.getElementById('timeTaken'),
  answersReview: document.getElementById('answersReview'),
  restartBtn: document.getElementById('restartBtn'),
  startBtn: document.getElementById('startBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  startQuizPopup: document.getElementById('startQuizPopup'),
  quizContainer: document.getElementById('quizContainer')
};

// Timer Functions
function startTimer() {
  // Clear any existing timer first
  stopTimer();
  
  quizStartTime = Date.now();
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      stopTimer();
      timeUp();
    }
  }, 1000); // 1000ms = 1 second
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  elements.timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Update timer color based on remaining time
  elements.timer.classList.remove('warning', 'danger');
  
  if (timeLeft <= 60) {
    elements.timer.classList.add('danger');
  } else if (timeLeft <= 180) {
    elements.timer.classList.add('warning');
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  quizEndTime = Date.now();
}

function timeUp() {
  showResults(true);
}

function getTimeTaken() {
  const endTime = quizEndTime || Date.now();
  const timeSpent = Math.floor((endTime - quizStartTime) / 1000);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize Quiz Popup
function initQuizPopup() {
  // Show start popup initially
  elements.startQuizPopup.style.display = 'flex';
  elements.quizContainer.style.display = 'none';
}

// Start quiz function
function startQuiz() {
  isQuizStarted = true;
  elements.startQuizPopup.style.display = 'none';
  elements.quizContainer.style.display = 'flex';
  
  // Initialize quiz state
  currentQuestion = 0;
  answers = quizData.questions.map(q => q.type === 'multi' ? [] : null);
  timeLeft = quizData.timeLimit;
  results = null;
  
  // Load the first question
  loadQuestion(currentQuestion);
  createQuestionDots();
  updateProgress();
  
  // Start the timer properly
  startTimer();
}

// Cancel quiz function
function cancelQuiz() {
  window.history.back();
}

// Load Question
function loadQuestion(index) {
  const question = quizData.questions[index];
  
  // Update question info
  elements.questionText.textContent = question.text;
  elements.questionType.textContent = getQuestionTypeLabel(question.type);
  
  // Clear previous options
  elements.optionsContainer.innerHTML = '';
  
  // Create options
  question.options.forEach((option, optionIndex) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    
    // Check if this option is selected
    const isSelected = question.type === 'multi' 
      ? answers[index]?.includes(optionIndex)
      : answers[index] === optionIndex;
    
    if (isSelected) {
      optionDiv.classList.add('selected');
    }
    
    // Create option content based on question type
    let optionContent = '';
    if (question.type === 'multi') {
      optionContent = `
        <div class="option-checkbox"></div>
        <div class="option-letter">${String.fromCharCode(65 + optionIndex)}</div>
        <div class="option-text">${option}</div>
      `;
    } else if (question.type === 'boolean') {
      optionContent = `
        <div class="option-radio"></div>
        <div class="option-letter">${optionIndex === 0 ? 'T' : 'F'}</div>
        <div class="option-text">${option}</div>
      `;
    } else {
      optionContent = `
        <div class="option-radio"></div>
        <div class="option-letter">${String.fromCharCode(65 + optionIndex)}</div>
        <div class="option-text">${option}</div>
      `;
    }
    
    optionDiv.innerHTML = optionContent;
    optionDiv.addEventListener('click', () => selectOption(optionIndex));
    
    elements.optionsContainer.appendChild(optionDiv);
  });
  
  // Update navigation buttons
  elements.prevBtn.disabled = index === 0;
  elements.nextBtn.disabled = index === quizData.questions.length - 1;
  
  // Update question dots
  updateQuestionDots();
}

// Select Option
function selectOption(optionIndex) {
  const question = quizData.questions[currentQuestion];
  
  if (question.type === 'multi') {
    // Multiple select
    if (!answers[currentQuestion]) {
      answers[currentQuestion] = [];
    }
    
    const index = answers[currentQuestion].indexOf(optionIndex);
    if (index === -1) {
      answers[currentQuestion].push(optionIndex);
    } else {
      answers[currentQuestion].splice(index, 1);
    }
  } else {
    // Single select or boolean
    answers[currentQuestion] = optionIndex;
  }
  
  loadQuestion(currentQuestion);
  updateProgress();
}

// Get Question Type Label
function getQuestionTypeLabel(type) {
  switch (type) {
    case 'multi': return 'Multiple Select';
    case 'boolean': return 'True/False';
    default: return 'Single Choice';
  }
}

// Update Progress
function updateProgress() {
  const answered = answers.filter(answer => 
    answer !== null && (Array.isArray(answer) ? answer.length > 0 : true)
  ).length;
  
  elements.progressText.textContent = `${answered}/${quizData.questions.length}`;
}

// Create Question Dots
function createQuestionDots() {
  elements.questionDots.innerHTML = '';
  
  quizData.questions.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'question-dot';
    dot.textContent = index + 1;
    dot.addEventListener('click', () => {
      currentQuestion = index;
      loadQuestion(currentQuestion);
    });
    
    elements.questionDots.appendChild(dot);
  });
  
  updateQuestionDots();
}

// Update Question Dots
function updateQuestionDots() {
  const dots = elements.questionDots.querySelectorAll('.question-dot');
  
  dots.forEach((dot, index) => {
    dot.classList.remove('current', 'answered');
    
    if (index === currentQuestion) {
      dot.classList.add('current');
    }
    
    const answer = answers[index];
    if (answer !== null && (Array.isArray(answer) ? answer.length > 0 : true)) {
      dot.classList.add('answered');
    }
  });
}

// Calculate Results
function calculateResults() {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  
  const reviewData = quizData.questions.map((question, index) => {
    const answer = answers[index];
    const correctIndices = question.correct;
    
    let status = 'unanswered';
    let isCorrect = false;
    
    if (answer === null || (Array.isArray(answer) && answer.length === 0)) {
      unanswered++;
      status = 'unanswered';
    } else {
      if (question.type === 'multi') {
        // For multi-select, all correct answers must be selected
        const sortedAnswer = [...answer].sort();
        const sortedCorrect = [...correctIndices].sort();
        
        isCorrect = sortedAnswer.length === sortedCorrect.length &&
                   sortedAnswer.every((val, idx) => val === sortedCorrect[idx]);
      } else {
        isCorrect = correctIndices.includes(answer);
      }
      
      if (isCorrect) {
        correct++;
        status = 'correct';
      } else {
        wrong++;
        status = 'wrong';
      }
    }
    
    return {
      question: question.text,
      userAnswer: answer,
      correctAnswer: correctIndices,
      options: question.options,
      explanation: question.explanation,
      status: status,
      isCorrect: isCorrect
    };
  });
  
  const totalQuestions = quizData.questions.length;
  const scorePercent = Math.round((correct / totalQuestions) * 100);
  
  results = {
    scorePercent,
    correct,
    wrong,
    unanswered,
    reviewData,
    passed: scorePercent >= 70,
    timeTaken: getTimeTaken()
  };
  
  return results;
}

// Show Results
function showResults(autoSubmit = false) {
  stopTimer();
  const results = calculateResults();
  
  // Update modal content
  elements.scorePercent.textContent = `${results.scorePercent}%`;
  
  if (autoSubmit) {
    elements.resultStatus.textContent = 'Time Up!';
    elements.resultStatus.style.color = '#ef4444';
  } else {
    elements.resultStatus.textContent = results.passed ? 'Passed!' : 'Try Again';
    elements.resultStatus.style.color = results.passed ? '#10b981' : '#ef4444';
  }
  
  elements.correctCount.textContent = results.correct;
  elements.wrongCount.textContent = results.wrong;
  elements.unansweredCount.textContent = results.unanswered;
  elements.timeTaken.textContent = results.timeTaken;
  
  // Set score circle
  const scoreCircle = document.querySelector('.score-circle');
  if (scoreCircle) {
    scoreCircle.style.setProperty('--score-percent', `${results.scorePercent}%`);
  }
  
  // Render answers review
  renderAnswersReview(results.reviewData);
  
  // Show modal
  elements.resultsModal.style.display = 'flex';
}

// Render Answers Review
function renderAnswersReview(reviewData) {
  elements.answersReview.innerHTML = '';
  
  reviewData.forEach((review, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${review.status}`;
    
    // Get user answer text
    let userAnswerText = 'Not answered';
    if (review.userAnswer !== null) {
      if (Array.isArray(review.userAnswer) && review.userAnswer.length > 0) {
        userAnswerText = review.userAnswer
          .map(i => `${String.fromCharCode(65 + i)}. ${review.options[i]}`)
          .join('<br>');
      } else if (!Array.isArray(review.userAnswer)) {
        userAnswerText = `${String.fromCharCode(65 + review.userAnswer)}. ${review.options[review.userAnswer]}`;
      }
    }
    
    // Get correct answer text
    const correctAnswerText = review.correctAnswer
      .map(i => `${String.fromCharCode(65 + i)}. ${review.options[i]}`)
      .join('<br>');
    
    reviewItem.innerHTML = `
      <div class="review-question">Q${index + 1}: ${review.question}</div>
      <div class="review-answer">
        <div class="answer-box ${review.isCorrect ? 'correct' : 'wrong'}">
          <strong>Your Answer:</strong>
          <div>${userAnswerText}</div>
        </div>
        <div class="answer-box correct">
          <strong>Correct Answer:</strong>
          <div>${correctAnswerText}</div>
        </div>
      </div>
      ${review.explanation ? `<div style="margin-top: 10px; color: #666; font-size: 0.9rem; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 6px;">${review.explanation}</div>` : ''}
    `;
    
    elements.answersReview.appendChild(reviewItem);
  });
}

// Event Listeners Setup
function setupEventListeners() {
  // Start and cancel buttons
  elements.startBtn.addEventListener('click', startQuiz);
  elements.cancelBtn.addEventListener('click', cancelQuiz);
  
  // Quiz navigation
  elements.prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion);
    }
  });
  
  elements.nextBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.questions.length - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
    }
  });
  
  // Submit button
  elements.submitBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to submit the quiz?')) {
      showResults(false);
    }
  });
  
  // Results modal
  elements.closeModalBtn.addEventListener('click', () => {
    elements.resultsModal.style.display = 'none';
  });
  
  // Restart button
  elements.restartBtn.addEventListener('click', function() {
    window.location.href = "../index.html";
  });
  
  // Close modal when clicking outside
  elements.resultsModal.addEventListener('click', (e) => {
    if (e.target === elements.resultsModal) {
      elements.resultsModal.style.display = 'none';
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initQuizPopup();
  setupEventListeners();
});