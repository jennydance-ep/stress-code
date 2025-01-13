// Google Sheets API JSON endpoint
const sheetURL =
  "https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=AIzaSyDn00TYF6ZfymjuWirL-CWZTc4Q4LLEtrE";

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

      const entries = data.values; // Access rows of data

      // Check if entries exist
      if (!entries || entries.length === 0) {
        throw new Error("No data found in the Google Sheet!");
      }

      // Skip the header row and pick a random word from the sheet
      const randomIndex = Math.floor(Math.random() * (entries.length - 1)) + 1; // Random from row 2 onwards
      const rowData = entries[randomIndex];

      // Extract the relevant columns based on their position in the row
      const targetWord = rowData[0]; // First column: Word
      const syllableCount = rowData[1]; // Second column: Syllables
      const primaryStress = rowData[2]; // Third column: Primary Stress
      const secondaryStress = rowData[3]; // Fourth column: Secondary Stress

      // Debugging: Log the selected word and stress data
      console.log("Selected Word Data:", {
        word: targetWord,
        syllables: syllableCount,
        primarystress: primaryStress,
        secondarystress: secondaryStress,
      });

      // Update the game interface with the fetched data
      updateGame(targetWord, syllableCount, primaryStress, secondaryStress);
    })
    .catch((error) => {
      console.error("Error fetching data from Google Sheets:", error);

      // Display an error message in the UI (optional)
      document.getElementById("target-word").textContent =
        "Error loading word data. Please try again later.";
    });
}

// Function to update the game interface with the fetched data
function updateGame(targetWord, syllableCount, primaryStress, secondaryStress) {
  // Update the target word display
  document.getElementById("target-word").textContent = targetWord;

  // Clear any previous inputs
  document.getElementById("syllable-input").value = "";
  document.getElementById("primary-stress-input").value = "";
  document.getElementById("secondary-stress-input").value = "";

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

// Function to check player inputs against correct answers
function checkAnswer() {
  // Retrieve player inputs
  const playerSyllables = document
    .getElementById("syllable-input")
    .value.trim();
  const playerPrimary = document
    .getElementById("primary-stress-input")
    .value.trim();
  const playerSecondary = document
    .getElementById("secondary-stress-input")
    .value.trim();

  // Compare player inputs with the stored correct answers
  const correct = window.correctAnswers; // Access the global correctAnswers object

  // Debugging: Log player inputs and correct answers
  console.log("Player Inputs:", {
    syllables: playerSyllables,
    primary: playerPrimary,
    secondary: playerSecondary,
  });

  console.log("Correct Answers:", correct);

  // Initialize feedback
  let isCorrect = true;

  if (playerSyllables !== correct.syllableCount) {
    document.getElementById("syllable-input").style.backgroundColor = "orange";
    isCorrect = false;
  } else {
    document.getElementById("syllable-input").style.backgroundColor = "green";
  }

  if (playerPrimary !== correct.primaryStress) {
    document.getElementById("primary-stress-input").style.backgroundColor =
      "orange";
    isCorrect = false;
  } else {
    document.getElementById("primary-stress-input").style.backgroundColor =
      "green";
  }

  if (playerSecondary !== correct.secondaryStress) {
    document.getElementById("secondary-stress-input").style.backgroundColor =
      "orange";
    isCorrect = false;
  } else {
    document.getElementById("secondary-stress-input").style.backgroundColor =
      "green";
  }

  // Provide overall feedback
  if (isCorrect) {
    alert("Well done! All answers are correct.");
  } else {
    alert("Some answers are incorrect. Try again!");
  }
}

// Call the function when the page loads
window.onload = loadWordData;
