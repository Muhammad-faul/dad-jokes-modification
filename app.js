const jokeButton = document.getElementById('jokeButton');
const jokeText = document.getElementById('jokeText');
const speakButton = document.getElementById('speakButton');
const languageSelect = document.getElementById('languageSelect');
const copyButton = document.getElementById('copyButton');
const themeButton = document.getElementById('themeButton');
const themeIcon = document.getElementById('themeIcon');
const timerButton = document.getElementById('timerButton');
const programmingButton = document.getElementById('programmingButton');
const punButton = document.getElementById('punButton');
const randomCategoryButton = document.getElementById('randomCategoryButton');
const favoriteButton = document.getElementById('favoriteButton');
const shareButton = document.getElementById('shareButton');
const favoriteList = document.getElementById('favoriteList');

let jokeTimer;

// Function to fetch a random joke from the API
async function fetchJoke(category = '') {
  let url = 'https://icanhazdadjoke.com/';
  if (category === 'programming') {
    url = 'https://v2.jokeapi.dev/joke/Programming?type=single';
  } else if (category === 'pun') {
    url = 'https://v2.jokeapi.dev/joke/Pun?type=single';
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
    const jokeData = await response.json();
    jokeText.textContent = jokeData.joke || jokeData.error || 'Oops! No joke found.';
    jokeText.style.animation = 'fadeIn 1s forwards';
    playSound();
    speakJoke(jokeText.textContent);  // Automatically speak the joke
  } catch (error) {
    jokeText.textContent = 'Oops! Something went wrong. Please try again later.';
  }
}

// Function to speak joke
function speakJoke(joke) {
  const utterance = new SpeechSynthesisUtterance(joke);
  speechSynthesis.speak(utterance);
}

// Event listener for "Speak Joke" button
speakButton.addEventListener('click', () => {
  const joke = jokeText.textContent;
  speakJoke(joke);  // Speak the current joke
});

// Function to translate joke
async function translateJoke(joke, targetLanguage) {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: joke,
        source: 'en',
        target: targetLanguage,
        format: 'text',
      }),
    });
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error translating joke:', error);
  }
}

// Event listener for language selection
languageSelect.addEventListener('change', async (event) => {
  const selectedLanguage = event.target.value;
  const joke = jokeText.textContent;

  if (selectedLanguage !== 'en') {
    const translatedJoke = await translateJoke(joke, selectedLanguage);
    jokeText.textContent = translatedJoke;
  } else {
    jokeText.textContent = joke;  // Reset to original joke if English is selected
  }
});

// Function to play sound on button click
function playSound() {
    const audio = new Audio('https://www.soundjay.com/button/beep-08b.mp3'); // URL baru yang berfungsi
    audio.play().catch(error => {
      console.log("Error playing sound: ", error);
    });
  }  

  document.getElementById('jokeButton').addEventListener('click', function() {
    const audio = new Audio('./sounds/beep-07.mp3');
    audio.play().catch(error => {
      console.log("Error playing sound: ", error);
    });
  });  
  
  // Event listener for "Speak Joke" button
  speakButton.addEventListener('click', () => {
    const joke = jokeText.textContent;
    speakJoke(joke);  // Speak the current joke
    playSound();      // Play sound when the button is clicked
  });  

// Function to toggle dark/light theme and change icon
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    themeIcon.textContent = 'light_mode'; // Change icon to light mode
  } else {
    themeIcon.textContent = 'dark_mode'; // Change icon to dark mode
  }
  toggleLogo();
}

// Function to change logo based on theme
function toggleLogo() {
  const logo = document.getElementById('logoImage');
  if (document.body.classList.contains('dark-mode')) {
    logo.src = 'logo-dark.png'; // Logo for dark mode
  } else {
    logo.src = 'logo-light.png'; // Logo for light mode
  }
}

// Event listener for theme toggle button
themeButton.addEventListener('click', toggleTheme);

// Auto toggle theme based on time of day (dark mode after 6 PM)
function autoChangeTheme() {
  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Function to start joke timer (every 5 seconds)
function startJokeTimer() {
  if (jokeTimer) clearInterval(jokeTimer);
  jokeTimer = setInterval(() => fetchJoke(), 5000);
}

// Function to copy the joke to clipboard
function copyJoke() {
  navigator.clipboard.writeText(jokeText.textContent).then(() => {
    alert('Joke copied to clipboard!');
  });
}

// Function to add the current joke to favorites
function addToFavorites() {
  const newFavorite = document.createElement('li');
  newFavorite.textContent = jokeText.textContent;
  favoriteList.appendChild(newFavorite);
}

// Function to randomize joke category
function getRandomCategory() {
  const categories = ['programming', 'pun'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  fetchJoke(randomCategory);
}

// Function to share the joke via social media
function shareJoke() {
  const joke = encodeURIComponent(jokeText.textContent);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${joke}`;
  window.open(twitterUrl, '_blank');
}

// Event listeners for buttons
jokeButton.addEventListener('click', () => fetchJoke());
copyButton.addEventListener('click', copyJoke);
timerButton.addEventListener('click', startJokeTimer);
programmingButton.addEventListener('click', () => fetchJoke('programming'));
punButton.addEventListener('click', () => fetchJoke('pun'));
randomCategoryButton.addEventListener('click', getRandomCategory);
favoriteButton.addEventListener('click', addToFavorites);
shareButton.addEventListener('click', shareJoke);

// Auto toggle theme based on time
autoChangeTheme();

// Fetch a joke when the page loads or when needed
fetchJoke();
