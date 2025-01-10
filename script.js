// https://docs.google.com/spreadsheets/d/e/2PACX-1vR2OsanzdAnpMxuS7OdJWZINvJnUF3KHriB9C5viYbNYw-VL3E4yT5sFFP02Dwve6BmRIlV6Gch9hRb/pubhtml
const sheetID = "1pG3Lwsljg-px-e9hFyo7SFpWX2suAWeQuuig65Od7YY";
const range = "Sheet1"; // Stress Code words

// Google Sheets API URL
const sheetURL = `https://spreadsheets.google.com/feeds/cells/${sheetID}/1/public/full?alt=json`;

// Function to load data from Google Sheets
function loadWordData() {
  fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
      const entries = data.feed.entry;
      
      // Example: Getting the target word from the first row
      const targetWord = entries[0].content.$t;  // Adjust based on the actual cell position
      const syllableCount = entries[1].content.$t;  // Adjust for the syllable count
      const primaryStress = entries[2].content.$t;  // Adjust for primary stress
      const secondaryStress = entries[3].content.$t;  // Adjust for secondary stress
      
      // Now you can update your game with this data
      updateGame(targetWord, syllableCount, primaryStress, secondaryStress);
    })
    .catch(error => {
      console.error("Error fetching data from Google Sheets:", error);
    });
}

// Function to update the game interface with the data
function updateGame(targetWord, syllableCount, primaryStress, secondaryStress) {
  document.getElementById("target-word").textContent = targetWord;
  document.getElementById("syllable-count").textContent = syllableCount;
  document.getElementById("primary-stress").textContent = primaryStress;
  document.getElementById("secondary-stress").textContent = secondaryStress;
}

// Call the function when the page loads
window.onload = loadWordData;
