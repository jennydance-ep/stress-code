// Google Sheets API JSON endpoint
const sheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

// Function to load word data from Google Sheets
function loadWordData() {
  fetch(sheetURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Debugging: Log the full JSON data to understand its structure
      console.log("Google Sheets JSON Data:", data);

      const values = data.values;
      if (!values || values.length < 2) {
        throw new Error("No data found in the Google Sheet!");
      }

      // Parse the header row to match columns with expected keys
      const headers = values[0];
      const wordIndex = headers.indexOf("word");
      const syllablesIndex = headers.indexOf("syllables");
      const primaryStressIndex = headers.indexOf("primaryStress");
      const secondaryStressIndex = headers.indexOf("secondaryStress");

      if (
        wordIndex === -1 ||
        syllablesIndex === -1 ||
        primaryStressIndex === -1 ||
        secondaryStressIndex === -1
      ) {
        throw new Error(
          "Expected column headers (word, syllables, primaryStress, secondaryStress) not found!"
        );
      }

      // Pick a random word from the data (excluding header row)
      const randomIndex = Math.floor(Math.random() * (values.length - 1)) + 1;
      const selectedRow = values[randomIndex];

      const targetWord = selectedRow[wordIndex];
      const syllableCount = selectedRow[syllablesIndex];
      const primaryStress = selectedRow[primaryStressIndex];
      const secondaryStress = selectedRow[secondaryStressIndex];

      // Debugging: Log the selected word and stress data
      console.log("Selected Word Data:", {
        word: targetWord,
        syllables: syllableCount,
        primaryStress,
        secondaryStress,
      });

      // Update the game interface with the fetched data
      updateGame(targetWord, syllableCount, primaryStress, secondaryStress);
    })
    .catch((error) => {
      console.error("Error fetching data from Google Sheets:", error);

      // Display an error message in the UI
      document.getElementById("target-word").textContent =
        "Error loading word data. Please try again later.";
    });
}

// Function to update the game interface with the fetched data
function updateGame(targetWord, syllableCount, primaryStress, secondaryStress) {
  // Update the target word display
  document.getElementById("target-word").textContent = targetWord;

  // Clear any previous inputs
  document.querySelectorAll(".input-box").forEach((box) => {
    box.value = "";
    box.classList.remove("correct", "incorrect");
  });

  // Debugging: Store the correct answers (useful for logic implementation)
  console.log("Correct Answers Stored:", {
    syllableCount,
    primaryStress,
    secondaryStress,
  });

  // Save these to global variables for checking answers later
  window.correctAnswers = {
    syllableCount,
    primaryStress,
    secondaryStress,
  };
}

// Function to check the user's answers
function checkAnswer() {
  const userSyllableCount = document.getElementById("syllable-input").value;
  const userPrimaryStress = document.getElementById("primary-stress-input").value;
  const userSecondaryStress = document.getElementById("secondary-stress-input").value;

  const { syllableCount, primaryStress, secondaryStress } = window.correctAnswers;

  const syllableInput = document.getElementById("syllable-input");
  const primaryStressInput = document.getElementById("primary-stress-input");
  const secondaryStressInput = document.getElementById("secondary-stress-input");

  let allCorrect = true;

  if (userSyllableCount === syllableCount) {
    syllableInput.classList.add("correct");
  } else {
    syllableInput.classList.add("incorrect");
    allCorrect = false;
  }

  if (userPrimaryStress === primaryStress) {
    primaryStressInput.classList.add("correct");
  } else {
    primaryStressInput.classList.add("incorrect");
    allCorrect = false;
  }

  if (userSecondaryStress === secondaryStress) {
    secondaryStressInput.classList.add("correct");
  } else {
    secondaryStressInput.classList.add("incorrect");
    allCorrect = false;
  }

  if (allCorrect) {
    alert("Well done! All answers are correct.");
  } else {
    alert("Some answers are incorrect. Try again!");
  }
}

// Call the function when the page loads
window.onload = loadWordData;
