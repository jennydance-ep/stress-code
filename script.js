// Google Sheets API JSON endpoint
const sheetURL =
  https://sheets.googleapis.com/v4/spreadsheets/1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY/values/Sheet1?key=<YOUR-API-KEY>


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

      const entries = data.feed.entry;

      // Check if entries exist
      if (!entries || entries.length === 0) {
        throw new Error("No data found in the Google Sheet!");
      }

      // Pick a random word from the sheet
      const randomIndex = Math.floor(Math.random() * entries.length);

      // Extract the relevant columns (update 'gsx$...' keys as per your sheet headers)
      const targetWord = entries[randomIndex]["gsx$word"]["$t"];
      const syllableCount = entries[randomIndex]["gsx$syllables"]["$t"];
      const primaryStress = entries[randomIndex]["gsx$primarystress"]["$t"];
      const secondaryStress = entries[randomIndex]["gsx$secondarystress"]["$t"];

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
