
function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  if (highScores.length === 0) {
    highScoreContainer.textContent = 'No high scores available.';
  } else {
    highScoreContainer.innerHTML = '';
    highScores.forEach((score, index) => {
      const scoreItem = document.createElement('div');
      scoreItem.innerHTML = `#${index + 1}: ${score.initials} - ${score.score}%`;
      highScoreContainer.appendChild(scoreItem);
    });
  }
}



const startButton = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const choicesList = document.getElementById('choices');
const submitButton = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const resultElement = document.getElementById('result');
const timerElement = document.getElementById('timer');
const pauseButton = document.getElementById('pause-btn');

const scoreForm = document.getElementById('score-form');
const initialsInput = document.getElementById('initials');
const submitScoreButton = document.getElementById('submit-score');

submitScoreButton.addEventListener('click', submitScore);
pauseButton.addEventListener('click', pauseTimer);


function submitScore(event) {
  event.preventDefault();

  let initials = initialsInput.value.trim(); // Get the initials from the input field

  // Check if initials are provided
  if (initials.length === 0) {
    initials = prompt('Please enter your initials (up to 3 characters):');
    if (!initials) {
      // User canceled the prompt or entered an empty value
      return;
    }
  } else if (initials.length > 3) {
    alert('Initials can only be up to 3 characters long. Please enter valid initials.');
    return;
  }

  initials = initials.slice(0, 3); // Limit initials to 3 characters

  const scoreData = { initials, score };

  console.log('User initials:', initials); // Log the initials to the console

  // Save the score with initials
  saveScore(scoreData);

  // Reset the form
  initialsInput.value = '';

  // TODO: Implement any additional logic you need after submitting the score (e.g., redirect to a score page, show a leaderboard, etc.)
}




let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft; // Declare timeLeft as a global variable
let isPaused = false;
let quizCompleted = false; // Flag variable to track quiz completion

// Define your questions as an array of objects
const questions = [

  {
    question: 'Which of the following is NOT a valid Java identifier?',
    choices: ['myVariable', '123variable', '_variable', 'ariable123'],
    correctAnswer: '123variable'
  },
  {
    question: 'Which of the following is the correct way to declare and initialize a constant variable in Java?',
    choices: ['constant int x = 5;', 'final x = 5;', 'final int x = 5;', 'int x = final 5;'],
    correctAnswer: 'final int x = 5;'
  },
  {
    question: 'Which HTML tag is used to define a hyperlink?',
    choices: ['<a>', '<h1>', '<p>', '<div>'],
    correctAnswer: '<a>'
  },
  {
    question: 'What is the purpose of the break statement in Java?',
    choices: ['It terminates the current loop or switch statement.', 
    'It skips the current iteration of a loop.',
     'It transfers the program control to a specified label.',
      'It throws an exception to be caught by a try-catch block.'],
    correctAnswer: 'It terminates the current loop or switch statement.'
  },
  {
    question: 'Which tag is used to define the main heading of a webpage in HTML?',
    choices: ['a) <header>', 'b) <title>', 'c) <h1>', 'd) <main>'],
    correctAnswer: 'c) <h1>'
  },
  // Add more questions as needed
];

startButton.addEventListener('click', startQuiz);
// submitButton.addEventListener('click', submitAnswer);

function startQuiz() {
  startButton.style.display = 'none';
  pauseButton.style.display = 'inline-block'; // Show the pause button
  quizContainer.style.display = 'block';
  displayQuestion();
  startTimer();

  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;

  // ... Existing code ...
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  questionElement.textContent = question.question;
  choicesList.innerHTML = '';
  question.choices.forEach(choice => {
    const listItem = document.createElement('li');
    const choiceButton = document.createElement('button');
    choiceButton.textContent = choice;
    listItem.appendChild(choiceButton);
    choicesList.appendChild(listItem);
    choiceButton.addEventListener('click', () => selectAnswer(choiceButton));
  });
}

function selectAnswer(selectedButton) {
  const selectedAnswer = selectedButton.textContent;
  const question = questions[currentQuestionIndex];
  if (selectedAnswer === question.correctAnswer) {
    score++;
    resultElement.textContent = 'Correct!';
    resultContainer.className = 'correct';
  } else {
    // Subtract time from the clock if the answer is incorrect
    timeLeft -= 10; // Adjust the time penalty as needed
    resultElement.textContent = 'Incorrect!';
    resultContainer.className = 'incorrect';
  }
  resultContainer.style.display = 'block';

  // Update the score display
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(() => {
      resultContainer.style.display = 'none';
      displayQuestion();
    }, 1000);
  } else {
    setTimeout(() => {
      resultContainer.style.display = 'none';
      endQuiz();
    }, 1000);
  }
}



function endQuiz() {
  clearInterval(timer);
  quizContainer.style.display = 'none';
  const scorePercentage = (score / questions.length) * 100;
  resultElement.textContent = `Quiz completed! Your score: ${scorePercentage}%`;
  resultContainer.style.display = 'block';

  if (timeLeft > 0) {
    console.log('Quiz completed!');
  } else {
    console.log('Time is up!');
  }
  // Check if the quiz has already been completed
  if (quizCompleted) {
    return; // Exit the function if the quiz is already completed
  }
  quizCompleted = true; // Set the quizCompleted flag to true

  // ... Existing code ...

  // Get the user initials from the submit button
  const initials = submitButton.value.trim();
  const userScore = {
    initials,
    score: scorePercentage
  };
  saveScore(userScore);

  // Display the name and score
  const userNameElement = document.getElementById('user-name');
  userNameElement.innerHTML = `Name: ${userScore.initials}`;

  const userScoreElement = document.getElementById('user-score');
  userScoreElement.innerHTML = `Score: ${userScore.score}`;

  // Create a back button
  const backButton = document.createElement('button');
  backButton.textContent = 'Start Over';
  resultContainer.appendChild(backButton);

  // Add event listener to the back button
  backButton.addEventListener('click', () => {
    // Reset the quiz and start over
    currentQuestionIndex = 0;
    score = 0;
    startQuiz();
  });

  // Update the high score display
  displayHighScores();
}


function saveScore(userScore) {
  // Implement your logic to save the initials and score
  // For example, you can make an API call or store them in localStorage
  // Here's a simple example using localStorage:
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(userScore);
  localStorage.setItem('highScores', JSON.stringify(highScores));

  // Update the high score display
  displayHighScores();

  // Update the HTML to display the score and initials
  const scoreElement = document.getElementById('user-score');
  scoreElement.innerHTML = `Score: ${userScore.score}`;

  const initialsElement = document.getElementById('user-initials');
  initialsElement.innerHTML = `Initials: ${userScore.initials}`;

  // You can customize the HTML structure and styling as needed
}


function startTimer() {
  timeLeft = 60; // Set the desired quiz duration in seconds

  timer = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      if (timeLeft >= 0) {
        timerElement.textContent = `Time remaining: ${timeLeft} seconds`;
      } else {
        clearInterval(timer);
        endQuiz();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseButton.textContent = 'Resume'; // Update the button text to "Resume"
  } else {
    pauseButton.textContent = 'Pause'; // Update the button text to "Pause"
  }
}

const highScoreButton = document.getElementById("high-score-btn");
const highScoreContainer = document.getElementById("high-score-container");

highScoreButton.addEventListener('click', displayHighScores);

function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  if (highScores.length === 0) {
    highScoreContainer.textContent = 'No high scores available.';
  } else {
    highScoreContainer.innerHTML = '';
    highScores.forEach((score, index) => {
      const scoreItem = document.createElement('div');
      scoreItem.innerHTML = `#${index + 1}: ${score.initials} - ${score.score}%`;
      highScoreContainer.appendChild(scoreItem);
    });
  }
}

// Add an event listener to detect when the window size changes
window.addEventListener('resize', handleScreenSize);

// Function to handle different screen sizes
function handleScreenSize() {
  if (window.innerWidth < 768) {
    // Code to execute for small screens (width less than 768px)
    // For example, you can modify the layout, styling, or behavior for small screens
    // Here's an example:
    highScoreContainer.classList.add('small-screen');
  } else {
    // Code to execute for larger screens
    // Remove any modifications made for small screens
    highScoreContainer.classList.remove('small-screen');
  }
}

// Call the function initially to apply the appropriate code for the current screen size
handleScreenSize();
