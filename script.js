console.log("✅ script.js is running!");

// ✅ Feature toggle for 3-word limit
const LIMIT_WORDS_PER_DAY = false; 
const MAX_WORDS_PER_DAY = 3;

// ✅ Google Sheets Data Source
const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// ✅ Preload sounds on page load
const drumSounds = [
    "ba-dah-ba-dah-dah.mp3",
    "drumroll.mp3",
    "guitarstrumslow.mp3",
];
const preloadedSounds = drumSounds.map(src => {
    const audio = new Audio(src);
    audio.load();  
    return audio;
});

// ✅ Load word data from Google Sheets
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

// ✅ Display word and associated data
function displayWord(wordData) {
    console.log("Selected Word Data:", wordData);
    document.getElementById("target-word").innerText = wordData.word || "No word found";
    document.getElementById("ipa-text").innerText = wordData.ipa || "No IPA available";
    document.getElementById("ipa-text").style.display = "none";
    window.currentWordData = wordData;
}

// ✅ Toggle IPA visibility (New Slider)
function toggleIPA() {
    const ipaElement = document.getElementById("ipa-text");
    ipaElement.style.display = ipaElement.style.display === "none" ? "inline" : "none";
}

// ✅ Score Tracker: Load and Save Scores
function loadScoreData() {
    return {
        score: localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0,
        streak: localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0,
        lastPlayedDate: localStorage.getItem("lastPlayedDate") || ""
    };
}

function saveScoreData(score, streak) {
    localStorage.setItem("score", score);
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastPlayedDate", new Date().toISOString().split('T')[0]); // Save only YYYY-MM-DD
}

// ✅ Helper function to check if days are consecutive
function isConsecutiveDay(previousDate, currentDate) {
    const prev = new Date(previousDate);
    const curr = new Date(currentDate);
    const difference = (curr - prev) / (1000 * 60 * 60 * 24); // Convert to days
    return difference === 1; // Returns true if they are consecutive days
}

// ✅ Update Score and Streak
function updateScore() {
    let { score, streak, lastPlayedDate } = loadScoreData();
    const today = new Date().toISOString().split('T')[0]; // Get current date

    if (lastPlayedDate === today) {
        score += 1; // ✅ Correct: add 1 to score only
    } else {
        streak = (lastPlayedDate && isConsecutiveDay(lastPlayedDate, today)) ? streak + 1 : 1;  
        score = 1; // ✅ Reset score for a new day
    }

    saveScoreData(score, streak);
    updateScoreDisplay(); // ✅ Ensure UI updates correctly
}

// ✅ Update Score Display
function updateScoreDisplay() {
    const { score, streak } = loadScoreData();
    document.getElementById("current-score").innerText = score;
    document.getElementById("current-streak").innerText = streak;
}

// ✅ Check answers
function checkAnswer() {
    if (!window.currentWordData) {
        console.error("Error: No word data available!");
        return; // Stop function execution if data is missing
    }

    const { syllables, primaryStress, schwaCount } = window.currentWordData;

    const syllableInput = document.getElementById("syllables");
    const primaryStressInput = document.getElementById("primary-stress");
    const schwaCountInput = document.getElementById("schwa-count");

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
        updateScore(); // ✅ Update score if correct
        celebrateWin();
    } else {
        alert("Try Again: make changes to any answers in orange boxes.");
    }
}

// ✅ Share Functionality
function shareGame() {
    const gameURL = window.location.href;
    const shareText = `I'm playing Stress Code! Can you beat my score? 🔥 Play here: ${gameURL}`;

    if (navigator.share) {
        // ✅ Use Web Share API if available
        navigator.share({
            title: "Stress Code Game",
            text: shareText,
            url: gameURL
        }).then(() => console.log("Shared successfully!"))
        .catch(error => console.error("Error sharing:", error));
    } else {
        // ✅ Fallback: Copy to clipboard & show alert
        navigator.clipboard.writeText(gameURL)
            .then(() => alert("✅ Link copied! Share it with friends."))
            .catch(error => console.error("Clipboard error:", error));
    }
}

// ✅ Celebrate Win function with preloaded sounds
function celebrateWin() {
    const drumroll = preloadedSounds[Math.floor(Math.random() * preloadedSounds.length)];
    drumroll.currentTime = 0;
    drumroll.play().catch(error => console.error("Audio play failed:", error));

    // ✅ Colorful alert box
    const alertBox = document.createElement("div");
    alertBox.innerText = "🎉 Well done! All answers are correct. 🎉";
    alertBox.style.position = "fixed";
    alertBox.style.top = "50%";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translate(-50%, -50%)";
    alertBox.style.padding = "20px";
    alertBox.style.backgroundColor = "#28a745"; // Green success color
    alertBox.style.color = "white";
    alertBox.style.fontSize = "20px";
    alertBox.style.fontWeight = "bold";
    alertBox.style.borderRadius = "8px";
    alertBox.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    alertBox.style.textAlign = "center";
    alertBox.style.zIndex = "1000";

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
        resetGame();
    }, 2000);
}

// ✅ Reset Game
function resetGame() {
    document.querySelectorAll(".input-box").forEach((box) => {
        box.value = "";
        box.classList.remove("correct", "incorrect");
    });

    const ipaToggle = document.getElementById("toggle-ipa");
    const ipaText = document.getElementById("ipa-text");

    ipaToggle.checked = false;  
    ipaText.style.display = "none"; 

    updateScoreDisplay();
    setTimeout(loadWordData, 500);
}

// ✅ Add event listeners properly
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Adding event listeners...");

    document.getElementById("submit").addEventListener("click", checkAnswer);
    document.getElementById("toggle-ipa").addEventListener("click", toggleIPA);

    // ✅ Fix: Ensure the Share Button exists before adding an event listener
    const shareBtn = document.getElementById("share-btn");
    if (shareBtn) {
        shareBtn.addEventListener("click", shareGame);
        console.log("✅ Share button event listener added!");
    } else {
        console.warn("⚠️ Share button not found in the DOM!");
    }

    console.log("✅ Calling loadWordData() now...");
    loadWordData();
    updateScoreDisplay(); // ✅ Load the score when page loads
});

console.log("✅ loadWordData() was called! Waiting for response...");
