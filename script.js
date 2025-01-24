console.log("✅ script.js is running!");

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
        console.log("Full Google Sheets Data:", data);
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
    console.log("Selected Word Data:", wordData);  // Debugging step

    document.getElementById("target-word").innerText = wordData.word || "No word found";
    document.getElementById("part-of-speech").innerText = wordData.partOfSpeech || "No part of speech";
    document.getElementById("ipa-text").innerText = wordData.ipa || "No IPA available";
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

    // List of drumroll sound files  
const drumSounds = [
    "ba-dah-ba-dah-dah.mp3",
    "drumroll.mp3",
    "guitarstrumslow.mp3",
];

// Pick a random drum sound  
const randomDrum = drumSounds[Math.floor(Math.random() * drumSounds.length)];

// Play the selected sound  
const drumroll = new Audio(randomDrum);
drumroll.currentTime = 0;
drumroll.play().catch(error => console.error("Audio play failed:", error));

    alert("Well done! All answers are correct.");
    // ✅ Call resetGame() to load a new word
    setTimeout(resetGame, 1000); // Add delay so the player sees the celebration
}

function resetGame() {
    document.querySelectorAll(".input-box").forEach((box) => {
        box.value = "";
        box.classList.remove("correct", "incorrect");
    });

    // Reload new word from Google Sheets
    loadWordData();
}

console.log("✅ Adding event listeners..."); 

document.getElementById("submit").addEventListener("click", checkAnswer);
document.getElementById("toggle-ipa").addEventListener("click", toggleIPA);

console.log("✅ Calling loadWordData() now..."); 
loadWordData();  // This should trigger the fetch request

console.log("✅ loadWordData() was called! Waiting for response...");  
