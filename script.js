
// Updated script.js

const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// Load data from Google Sheet
async function loadWordData() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.json();
        
        const rows = data.values;
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const selectedWord = {
            word: randomRow[0],
            syllables: randomRow[1],
            primaryStress: randomRow[2],
            secondaryStress: randomRow[3],
        };

        displayWord(selectedWord);
    } catch (error) {
        console.error("Error loading word data:", error);
    }
}

function displayWord(wordData) {
    document.getElementById("target-word").innerText = wordData.word;
    // Store word data for later checks
    window.currentWordData = wordData;
}

function checkAnswer() {
    const syllableInput = document.getElementById("syllable-input").value;
    const primaryStressInput = document.getElementById("primary-stress-input").value;
    const secondaryStressInput = document.getElementById("secondary-stress-input").value;

    const { syllables, primaryStress, secondaryStress } = window.currentWordData;

    if (
        syllableInput === syllables &&
        primaryStressInput === primaryStress &&
        secondaryStressInput === secondaryStress
    ) {
        alert("Well done! All answers are correct.");
    } else {
        alert("Incorrect answers. Please try again.");
        highlightAnswers(syllableInput, primaryStressInput, secondaryStressInput);
    }
}

function highlightAnswers(syllable, primaryStress, secondaryStress) {
    const { syllables, primaryStress: correctPrimary, secondaryStress: correctSecondary } = window.currentWordData;

    document.getElementById("syllable-input").classList.toggle("correct", syllable === syllables);
    document.getElementById("primary-stress-input").classList.toggle("correct", primaryStress === correctPrimary);
    document.getElementById("secondary-stress-input").classList.toggle("correct", secondaryStress === correctSecondary);

    document.getElementById("syllable-input").classList.toggle("incorrect", syllable !== syllables);
    document.getElementById("primary-stress-input").classList.toggle("incorrect", primaryStress !== correctPrimary);
    document.getElementById("secondary-stress-input").classList.toggle("incorrect", secondaryStress !== correctSecondary);
}

function resetGame() {
    document.getElementById("syllable-input").value = "";
    document.getElementById("primary-stress-input").value = "";
    document.getElementById("secondary-stress-input").value = "";

    document.getElementById("syllable-input").classList.remove("correct", "incorrect");
    document.getElementById("primary-stress-input").classList.remove("correct", "incorrect");
    document.getElementById("secondary-stress-input").classList.remove("correct", "incorrect");

    loadWordData();
}

// Load the word data when the page loads
window.onload = loadWordData;
