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

      // Check if values exist
      if (!data.values || data.values.length <= 1) {
        throw new Error("No data found in the Google Sheet!");
      }

      // Remove the header row and get only the data rows
      const rows = data.values.slice(1);

      // Pick a random row from the sheet
      const randomIndex = Math.floor(Math.random() * rows.length);
      const selectedRow = rows[randomIndex];

      // Extract the relevant columns (based on column order in your sheet)
      const targetWord = selectedRow[0]; // Assuming the "Word" column is first
      const syllableCount = selectedRow[1]; // Assuming "Syllables" column is second
      const primaryStress = selectedRow[2]; // Assuming "Primary Stress" column is third
      const secondaryStress = selectedRow[3]; // Assuming "Secondary Stress" column is fourth

      // Debugging: Log the selected word and stress data
      console.log("Selected Word:", targetWord);
      console.log("Syllable Count:", syllableCount);
      console.log("Primary Stress:", primaryStress);
      console.log("Secondary Stress:", secondaryStress);

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
  document.getElementById("syllable-input").value = "";
  document.getElementById("primary-stress-input").value = "";
  document.getElementById("secondary-stress-input").value = "";

  // Debugging: Store the correct answers (useful for logic implementation)
  console.log("Correct Answers Stored:", {
    syllableCount,
    primaryStress,
    secondaryStress,
  });

  // Optionally save these to global variables for checking answers later
  window.correctAnswers = {
    syllableCount,
    primaryStress,
    secondaryStress,
  };
}

// Call the function when the page loads
window.onload = loadWordData;
