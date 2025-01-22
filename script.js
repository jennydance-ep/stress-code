const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// Feature toggle for 3-word limit
const LIMIT_WORDS_PER_DAY = false; // Change to true to enable limit
const MAX_WORDS_PER_DAY = 3;

// Load word data from Google Sheets
async function loadWordData() {
    try {
        console.log("Fetching data from Google Sheets...");
        const response = await fetch(sheetURL);
        const data = await response.json();
        console.log("Data received:", data);

        const rows = data.values;
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const wordData = {
            word: randomRow[0],
            partOfSpeech: randomRow[1],
            syllables: randomRow[2],
            primaryStress: randomRow[3],
            schwaCount: randomRow[4],
            ipa: randomRow[5],
        };

        displayWord(wordData);
    } catch (error) {
        console.error("Error loading word data:", error);
    }
}

function displayWord(wordData) {
    document.getElementById("target-word").innerText = wordData.word;
    document.getElementById("part-of-speech").innerText = wordData.partOfSpeech;
    document.getElementById("ipa-text").innerText = wordData.ipa;
    document.getElementById("ipa-text").style.display = "none";
    window.currentWordData = wordData;
}

function toggleIPA() {
    const ipaElement = document.getElementById("ipa-text");
    ipaElement.style.display = ipaElement.style.display === "none" ? "inline" : "none";
}

function checkAnswer() {
    const syllableInput = document.getElementById("syllables");
    const primaryStressInput = document.getElementById("primary-stress");
    const schwaCountInput = document.getElementById("schwa-count");

    const { syllables, primaryStress, schwaCount } = window.currentWordData;

    let allCorrect = true;

    if (syllableInput.value === syllables) {
        syllableInput.classList.add("correct");
        syllableInput.classList.remove("incorrect");
    } else {
        syllableInput.classList.add("incorrect");
        syllableInput.classList.remove("correct");
        allCorrect = false;
    }

    if (primaryStressInput.value === primaryStress) {
        primaryStressInput.classList.add("correct");
        primaryStressInput.classList.remove("incorrect");
    } else {
        primaryStressInput.classList.add("incorrect");
        primaryStressInput.classList.remove("correct");
        allCorrect = false;
    }

    if (schwaCountInput.value === schwaCount) {
        schwaCountInput.classList.add("correct");
        schwaCountInput.classList.remove("incorrect");
    } else {
        schwaCountInput.classList.add("incorrect");
        schwaCountInput.classList.remove("correct");
        allCorrect = false;
    }

    if (allCorrect) {
        celebrateWin();
    } else {
        alert("Try Again: make changes to any answers in orange boxes.");
    }
}

function celebrateWin() {
    for (let i = 0; i < 30; i++) {  // Generates 30 confetti pieces
        const confetti = document.createElement("div");
        confetti.classList.add("confetti-animation");

        // Randomize position and size
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = confetti.style.width;
        
        // Assign random color
        const colors = ["red", "blue", "purple", "gold", "green", "orange"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;

        // Assign fall speed based on color
        let duration;
        if (color === "red") {
            duration = 2; // Fastest fall
        } else if (color === "blue") {
            duration = 3; // Medium speed
        } else if (color === "purple") {
            duration = 4; // Slowest fall
        } else {
            duration = Math.random() * 2 + 2; // Random speed for other colors
        }

        confetti.style.animationDuration = `${duration}s`;

        document.body.appendChild(confetti);

        // Remove confetti after animation ends
        setTimeout(() => confetti.remove(), duration * 1000);
    }

    // Play sound effect  
    const drumroll = new Audio("ba-dah-ba-dah-dah.mp3");  
    drumroll.currentTime = 0;  // Reset audio to the start  
    drumroll.play().catch(error => console.error("Audio play failed:", error));  

    alert("Well done! All answers are correct.");
}

document.getElementById("submit").addEventListener("click", checkAnswer);
document.getElementById("toggle-ipa").addEventListener("click", toggleIPA);
window.onload = loadWordData;
