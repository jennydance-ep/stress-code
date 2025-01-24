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
    // ✅ Preload and play audio first
    const drumSounds = [
        "ba-dah-ba-dah-dah.mp3",
        "drumroll.mp3",
        "guitarstrumslow.mp3",
    ];
    const randomDrum = drumSounds[Math.floor(Math.random() * drumSounds.length)];
    const drumroll = new Audio(randomDrum);

    drumroll.play().catch(error => console.error("Audio play failed:", error));

    // ✅ Colorful alert box (replacing confetti)
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

    // ✅ Hide alert box after 2 seconds, then reset game
    setTimeout(() => {
        alertBox.remove();
        resetGame();
    }, 2000);
}

function resetGame() {
    document.querySelectorAll(".input-box").forEach((box) => {
        box.value = "";
        box.classList.remove("correct", "incorrect");
    });

    // ✅ Fetch a new random word
    setTimeout(loadWordData, 500); // Small delay for smoother transition
}

console.log("✅ Adding event listeners..."); 

document.getElementById("submit").addEventListener("click", checkAnswer);
document.getElementById("toggle-ipa").addEventListener("click", toggleIPA);

console.log("✅ Calling loadWordData() now..."); 
loadWordData();  // This should trigger the fetch request

console.log("✅ loadWordData() was called! Waiting for response...");
