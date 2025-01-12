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

      // Extract the rows of values from the sheet
      const rows = data.values;

      // Check if rows exist and have data
      if (!rows || rows.length < 2) {
        throw new Error("No data found in the Google Sheet!");
      }

      // Get headers (first row) and data (subsequent rows)
      const headers = rows[0]; // First row contains the column headers
      const dataRows = rows.slice(1); // Skip the headers row

      // Pick a random word from the data rows
      const randomIndex = Math.floor(Math.random() * dataRows.length);
      const selectedRow = dataRows[randomIndex];

      // Map headers to the corresponding values in the selected row
      const wordData = {};
      headers.forEach((header, index) => {
        wordData[header.toLowerCase()] = selectedRow[index];
      });

      // Debugging: Log the selected word and stress data
      console.log("Selected Word Data:", wordData);

      // Update the game interface with the fetched data
      updateGame(
        wordData.word,
        wordData.syllables,
        wordData["primary stress"],
        wordData["secondary stress"]
      );
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

  // You can optionally save these to global variables for checking answers later
  window.correctAnswers = {
    syllableCount,
    primaryStress,
    secondaryStress,
  };
}

// Call the function when the page loads
window.onload = loadWordData;
