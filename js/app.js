const mediumAlbums = [
    { name: "Rumours", src: "img/rumours.jpg" },
    { name: "Purple Rain", src: "img/purple-rain.jpg" },
    { name: "The White Album", src: "img/white-album.jpg" },
    { name: "The Downward Spiral", src: "img/downward-spiral.jpg" },
    { name: "The Tortured Poets Department", src: "img/tortured-poets-department.jpg" },
    { name: "Nirvana Unplugged", src: "img/nirvana-unplugged.jpg" },
    { name: "The Black Album", src: "img/black-album.jpg" },
    { name: "The Miseducation of Lauryn Hill", src: "img/miseducation.jpg" },
    { name: "Pet Sounds", src: "img/pet-sounds.jpg" },
    { name: "Thriller", src: "img/thriller.jpg" },
    { name: "The Love Below", src: "img/love-below.jpg" },
    { name: "OK Computer", src: "img/ok-computer.jpg" },
    { name: "Back To Black", src: "img/back-to-black.jpg" },
    { name: "Tragic kingdom", src: "img/tragic-kingdom.jpg" },
    { name: "Baduizm", src: "img/baduizm.jpg" },
    { name: "Dark Side of the Moon", src: "img/dark-side-of-the-moon.jpg" },
    { name: "Appetite For Destruction", src: "img/appetite-for-destruction.jpg" },
    { name: "Illmatic", src: "img/illmatic.jpg" },
    { name: "Chris Gaines", src: "img/chris-gaines.jpg" },
    { name: "Songs in the Key of Life", src: "img/songs-in-key-of-life.jpg" },
    { name: "London Calling", src: "img/london-calling.jpg" },
    { name: "Cowboy Carter", src: "img/cowboy-carter.jpg" },
    { name: "Californication", src: "img/californication.jpg" },
    { name: "Sublime", src: "img/sublime.jpg" },
    { name: "Jagged Little Pill", src: "img/jagged-little-pill.jpg" },
];

let albums = [];
let currentAlbumIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
const gridSize = 8;
let gridBoxes = [];
let totalBoxes = gridSize * gridSize;

document.addEventListener('DOMContentLoaded', () => {
    setupSplashScreen();
});

function setupSplashScreen() {
    document.getElementById('medium-btn').addEventListener('click', () => startGame(mediumAlbums));
}

function startGame(selectedAlbums) {
    albums = selectedAlbums;
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    startNewRound();

    document.getElementById('submit-btn').addEventListener('click', checkGuess);

    // Add event listener for the "Enter" key
    document.getElementById('guess-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && document.getElementById('submit-btn').disabled === false) {
            checkGuess();
        }
    });
}

function startNewRound() {
    // Re-enable the submit button
    document.getElementById('submit-btn').disabled = false;

    // Ensure the album sequence is in order
    currentAlbum = albums[currentAlbumIndex % albums.length];
    document.getElementById('totalQuestions').textContent = albums.length;
    document.getElementById('album-cover').src = currentAlbum.src;

    document.getElementById('guess-input').value = '';
    document.getElementById('feedback').textContent = '';

    createGridOverlay();
    resetTimer();
    startTimer();
}

function checkGuess() {
    const userGuess = document.getElementById('guess-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');

    // check if the enter key was pressed without a guess
    if (userGuess === '') {
        feedback.textContent = "Please enter a guess!";
        return;
    }
    if (userGuess === currentAlbum.name.toLowerCase()) {
        feedback.textContent = `That's it! The album is "${currentAlbum.name}".`;
        increaseScore();
        stopTimer();
        revealFullImage();
        currentAlbumIndex++;  // Move to the next album in sequence
        // disable submit button
        document.getElementById('submit-btn').disabled = true;
        setTimeout(startNewRound, 3000);  // Wait 3 seconds before starting a new round
    } else {
        feedback.textContent = "Incorrect, try again!";
    }

    // if last album, show results
    if (currentAlbumIndex === albums.length) {
        showResults();
    }
}

function createGridOverlay() {
    const grid = document.getElementById('cover-grid');
    grid.innerHTML = ''; // Clear any existing grid
    gridBoxes = [];  // Clear previous grid references

    // Create a grid of divs to cover the image
    for (let i = 0; i < totalBoxes; i++) {
        const box = document.createElement('div');
        box.classList.add('grid-box');
        grid.appendChild(box);
        gridBoxes.push(box);  // Add each box to the array
    }
}

function revealRandomBox() {
    if (gridBoxes.length > 36) {
        // Select a random box to reveal
        const randomIndex = Math.floor(Math.random() * gridBoxes.length);
        const randomBox = gridBoxes[randomIndex];
        randomBox.style.opacity = '0';  // Hide the box (reveal part of the image)
        gridBoxes.splice(randomIndex, 1);  // Remove the box from the array
    }
}

function revealFullImage() {
    // Remove all remaining boxes instantly to reveal the full image
    gridBoxes.forEach(box => box.style.opacity = '0');
}

function increaseScore() {
    score++;
    document.getElementById('score').textContent = score;
}

function resetTimer() {
    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;
}

function startTimer() {
    const revealInterval = 60 / totalBoxes;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        // Reveal a random box at appropriate intervals
        if (timeLeft % Math.ceil(revealInterval) === 0) {
            revealRandomBox();
        }

        if (timeLeft <= 0) {
            stopTimer();
            document.getElementById('feedback').textContent = `Time's up! The album is "${currentAlbum.name}".`;
            revealFullImage();
            currentAlbumIndex++;  // Move to the next album in sequence
            // if last album, show results
            if (currentAlbumIndex === albums.length) {
                showResults();
            } else {
                setTimeout(startNewRound, 3000);  // Start a new round after 3 seconds
            }
        }
    }, 1000);  // Tick down every second
}

function stopTimer() {
    clearInterval(timerInterval);  // Stop the timer
}

function showResults() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    let passingScore = (score / albums.length) * 100;

    if (passingScore >= 70) {
        document.getElementById('results-text-one').textContent = "Congratulations!";
        document.getElementById('results-text-two').textContent = "You're a true music aficionado!";
        document.getElementById('results-score').textContent = "You've scored " + score + " out of " + albums.length + "!";
    } else {
        document.getElementById('results-text-one').textContent = "Bummer!";
        document.getElementById('results-text-two').textContent = "Please Try Again!";
        document.getElementById('results-score').textContent = "You've scored " + score + " out of " + albums.length;
    }
}
