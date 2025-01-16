const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// Load word data from Google Sheets
async function loadWordData() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.json();

        const rows = data.values;
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const wordData = {
            word: randomRow[0],
            syllables: randomRow[1],
            primaryStress: randomRow[2],
            secondaryStress: randomRow[3],
        };

        displayWord(wordData);
    } catch (error) {
        console.error("Error loading word data:", error);
    }
}

function displayWord(wordData) {
    document.getElementById("target-word").innerText = wordData.word;
    window.currentWordData = wordData;
}

function checkAnswer() {
    const syllableInput = document.getElementById("syllable-input");
    const primaryStressInput = document.getElementById("primary-stress-input");
    const secondaryStressInput = document.getElementById("secondary-stress-input");

    const { syllables, primaryStress, secondaryStress } = window.currentWordData;

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

    if (secondaryStressInput.value === secondaryStress) {
        secondaryStressInput.classList.add("correct");
        secondaryStressInput.classList.remove("incorrect");
    } else {
        secondaryStressInput.classList.add("incorrect");
        secondaryStressInput.classList.remove("correct");
        allCorrect = false;
    }

    if (allCorrect) {
        alert("Well done! All answers are correct.");
    } else {
        document.getElementById("try-again").style.display = "block";
    }
}

function resetGame() {
    document.querySelectorAll(".input-box").forEach((box) => {
        box.value = "";
        box.classList.remove("correct", "incorrect");
    });

    document.getElementById("try-again").style.display = "none";

    loadWordData();
}

window.onload = loadWordData;
