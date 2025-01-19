const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// Load word data from Google Sheets
async function loadWordData() {
    try {
        console.log("Fetching data from Google Sheets..."); // Debugging
        const response = await fetch(sheetURL);
        const data = await response.json();
        console.log("Data received:", data); // Debugging

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
    const syllableInput = document.getElementById("syllables"); // Fixed ID
    const primaryStressInput = document.getElementById("primary-stress"); // Fixed ID
    const secondaryStressInput = document.getElementById("secondary-stress"); // Fixed ID

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

// ✅ Add event listener for the Submit button
document.getElementById("submit").addEventListener("click", checkAnswer);

// ✅ Ensure the game loads word data when the page loads
window.onload = loadWordData;
