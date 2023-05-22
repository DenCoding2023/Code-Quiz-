const startButton = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const choicesList = document.getElementById('choices');
const submitButton = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const resultElement = document.getElementById('result');


const scoreForm = document.getElementById('score-form');
const initialsInput = document.getElementById('initials');
const submitScoreButton = document.getElementById('submit-score');

submitScoreButton.addEventListener('click', submitScore);

function submitScore(event) {
  event.preventDefault();

  const initials = initialsInput.value.trim();
  const scoreData = { initials, score };

  // TODO: Implement the logic to save the score data (e.g., send it to a server, store in local storage, etc.)

  // Example: Logging the score data to the console
  console.log(scoreData);

  // Reset the form
  initialsInput.value = '';

  // TODO: Implement any additional logic you need after submitting the score (e.g., redirect to a score page, show a leaderboard, etc.)
}



let currentQuestionIndex = 0;
let score = 0;
let timer;

// Define your questions as an array of objects
const questions = [
  {
    question: 'Which of the following is NOT a valid Java identifier?',
    choices: ['myVariable', '123variable', '_variable', 'ariable123'],
    correctAnswer: '123variable'
  },
  {
    question: 'What is the largest planet in our solar system?',
    choices: ['Jupiter', 'Saturn', 'Mars', 'Earth'],
    correctAnswer: 'Jupiter'
  },
  // Add more questions as needed
];

startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', submitAnswer);

function startQuiz() {
  startButton.style.display = 'none';
  quizContainer.style.display = 'block';
  displayQuestion();
  startTimer();
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
  });
}

function submitAnswer() {
    const selectedButton = document.querySelector('button.selected');
    if (selectedButton) {
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
  
    const initials = prompt('Enter your initials:');
    const userScore = {
      initials,
      score: scorePercentage
    };
    saveScore(userScore);
  }
  

  function saveScore(initials, score) {
    // Implement your logic to save the initials and score
    // For example, you can make an API call or store them in localStorage
    // Here's a simple example using localStorage:
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const newScore = { initials, score };
    highScores.push(newScore);
    localStorage.setItem('highScores', JSON.stringify(highScores));
  
    // Update the HTML to display the score
    const scoreElement = document.getElementById('user-score');
    scoreElement.textContent = `Score: ${score}`;
  
    // Update the HTML to display the initials
    const initialsElement = document.getElementById('user-initials');
    initialsElement.textContent = `Initials: ${initials}`;
  
    // You can customize the HTML structure and styling as needed
  }
  
  
//   function saveScore(initials, score) {
//     // Implement your logic to save the initials and score
//     // For example, you can make an API call or store them in localStorage
//     // Here's a simple example using localStorage:
//     const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
//     const newScore = { initials, score };
//     highScores.push(newScore);
//     localStorage.setItem('highScores', JSON.stringify(highScores));
//   }
  

//   function saveScore(userScore) {
//     let scores = localStorage.getItem('scores');
//     if (scores) {
//       scores = JSON.parse(scores);
//       scores.push(userScore);
//     } else {
//       scores = [userScore];
//     }
//     localStorage.setItem('scores', JSON.stringify(scores));
//   }
  

  

// function startTimer() {
//   let timeLeft = 60; // Set the desired quiz duration in seconds

//   timer = setInterval(() => {
//     timeLeft--;
//     if (timeLeft >= 0) {
//       // Update the timer display
//       // You can modify this to fit your desired format
//       console.log(`Time remaining: ${timeLeft} seconds`);
//     } else {
//       clearInterval(timer);
//       endQuiz();
//     }
//   }, 1000);
// }

function startTimer() {
    let timeLeft = 60; // Set the desired quiz duration in seconds
    const timerElement = document.getElementById('timer');
  
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft >= 0) {
        // Update the timer display
        timerElement.textContent = `Time remaining: ${timeLeft} seconds`;
      } else {
        clearInterval(timer);
        endQuiz();
      }
    }, 1000);
  }
  