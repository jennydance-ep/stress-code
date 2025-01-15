// Google Sheets API JSON endpoint
const sheetURL =
  "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// Function to load word data from Google Sheets
function loadWordData() {
  fetch(sheetURL)
    .then((response) => response.json())
    .then((data) => {
      const values = data.values.slice(1); // Skip header row
      const randomRow = values[Math.floor(Math.random() * values.length)];
      const wordData = {
        word: randomRow[0],
        syllables: randomRow[1],
        primaryStress: randomRow[2],
        secondaryStress: randomRow[3],
      };

      console.log("Selected Word Data:", wordData);
      document.getElementById("target-word").textContent =
        "Target Word: " + wordData.word;

      // Store correct answers globally
      window.correctAnswers = {
        syllableCount: wordData.syllables,
        primaryStress: wordData.primaryStress,
        secondaryStress: wordData.secondaryStress,
      };
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
}

function checkAnswer() {
  const userAnswers = {
    syllableCount: document.getElementById("syllable-input").value,
    primaryStress: document.getElementById("primary-stress-input").value,
    secondaryStress: document.getElementById("secondary-stress-input").value,
  };

  let allCorrect = true;

  // Validate answers
  for (const [key, value] of Object.entries(userAnswers)) {
    const inputElement = document.getElementById(`${key}-input`);
    if (value === window.correctAnswers[key]) {
      inputElement.classList.add("correct");
      inputElement.classList.remove("incorrect");
    } else {
      inputElement.classList.add("incorrect");
      inputElement.classList.remove("correct");
      allCorrect = false;
    }
  }

  if (allCorrect) {
    alert("Well done! All answers are correct.");
  } else {
    document.getElementById("try-again").style.display = "block";
  }
}

function tryAgain() {
  document.getElementById("syllable-input").value = "";
  document.getElementById("primary-stress-input").value = "";
  document.getElementById("secondary-stress-input").value = "";

  document.getElementById("syllable-input").classList.remove("correct", "incorrect");
  document.getElementById("primary-stress-input").classList.remove("correct", "incorrect");
  document.getElementById("secondary-stress-input").classList.remove("correct", "incorrect");

  document.getElementById("try-again").style.display = "none";
}

window.onload = loadWordData;
document.getElementById("check-answer").onclick = checkAnswer;
document.getElementById("try-again").onclick = tryAgain;
