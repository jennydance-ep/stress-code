// URL for the published Google Sheets data as JSON
const sheetURL = 'https://spreadsheets.google.com/feeds/list/2PACX-1vR2OsanzdAnpMxuS7OdJWZINvJnUF3KHriB9C5viYbNYw-VL3E4yT5sFFP02Dwve6BmRIlV6Gch9hRb/od6/public/values?alt=json';


// Function to load data from Google Sheets
function loadWordData() {
  fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
      // Parse the data and extract the relevant information (adjust column indices if necessary)
      const entries = data.feed.entry;
      const randomIndex = Math.floor(Math.random() * entries.length); // Get a random word

      // Extract the data for the target word and its stress details
      const targetWord = entries[randomIndex]['gsx$word']['$t'];
      const syllableCount = entries[randomIndex]['gsx$syllables']['$t'];
      const primaryStress = entries[randomIndex]['gsx$primarystress']['$t'];
      const secondaryStress = entries[randomIndex]['gsx$secondarystress']['$t'];

      // Update the game interface with the fetched data
      updateGame(targetWord, syllableCount, primaryStress, secondaryStress);
    })
    .catch(error => {
      console.error("Error fetching data from Google Sheets:", error);
    });
}

// Function to update the game interface with the data
function updateGame(targetWord, syllableCount, primaryStress, secondaryStress) {
  // Set the target word and stress information to the respective HTML elements
  document.getElementById("target-word").textContent = targetWord;
  document.getElementById("syllable-count").textContent = syllableCount;
  document.getElementById("primary-stress").textContent = primaryStress;
  document.getElementById("secondary-stress").textContent = secondaryStress;

  // Optionally, you can reset the padlock values or other game elements here
}

// Call the function when the page loads
window.onload = loadWordData;
