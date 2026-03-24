console.log("✅ script.js is running!");

// ✅ Supabase Configuration
// Replace YOUR_PROJECT_URL and YOUR_ANON_KEY with your real Supabase project values before deploying.
// The anon/public key is safe to include in frontend code — it is read-only and protected by
// Row Level Security (RLS) in Supabase, so it cannot be used to modify or delete data.
const supabaseUrl = "https://zkgovetpvhrttbwjzerk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZ292ZXRwdmhydHRid2p6ZXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTA1MzQsImV4cCI6MjA4OTY4NjUzNH0.4iq2HOfLM60QRSW_CgH9u_pC001eeF2aCq81wA_m4HQ";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ✅ Preload sounds on page load
const drumSounds = [
    "ba-dah-ba-dah-dah.mp3",
    "drumroll.mp3",
    "guitarstrumslow.mp3",
    "hightolow.mp3",
    "longdrum.mp3",
    "ratatat.mp3",
    "shortroll.mp3",
];
const preloadedSounds = drumSounds.map(src => {
    const audio = new Audio(src);
    audio.load();  
    return audio;
});

// ✅ Keep track of recently shown words (Must be outside the function to persist)
let recentWords = [];

// ✅ Track words completed for feedback popup trigger
let wordsCompletedThisSession = 0;

// ✅ Tracks whether the current word has been attempted before
let firstAttempt = true;
let attemptCount = 0;

// ✅ Fallback word data used if the Supabase fetch fails
const fallbackRows = [
    ["Word", "PartOfSpeech", "Syllables", "PrimaryStress", "SchwaCount", "IPA"],
    ["architecture", "noun", "4", "1", "1", "/ˈɑː.kɪ.tek.tʃər/"],
    ["vegetable", "noun", "3", "1", "2", "/ˈvedʒ.tə.bəl/"],
    ["responsible", "adjective", "4", "2", "1", "/rɪˈspɒn.sɪ.bəl/"],
    ["unpredictable", "adjective", "5", "3", "1", "/ˌʌn.prɪˈdɪk.tə.bəl/"],
    ["convincing", "adjective", "3", "2", "0", "/kənˈvɪn.sɪŋ/"],
    ["proactive", "adjective", "3", "2", "0", "/prəʊˈæk.tɪv/"],
    ["decorate", "verb", "3", "1", "1", "/ˈdek.ə.reɪt/"],
    ["comfortable", "adjective", "3", "1", "2", "/ˈkʌmf.tə.bəl/"],
    ["photograph", "noun", "3", "1", "1", "/ˈfəʊ.tə.ɡrɑːf/"],
    ["environment", "noun", "4", "2", "1", "/ɪnˈvaɪ.rən.mənt/"]
];

// ✅ Load word data from Supabase
async function loadWordData() {
    try {
        console.log("Fetching data from Supabase...");
        const { data, error } = await supabaseClient
            .from("words")
            .select("word, syllable_count, primary_stress, schwa_count, ipa");

        if (error) throw error;

        const rows = data;

        function getRandomWord(rows) {
            let randomRow;
            let attempts = 0;
            do {
                randomRow = rows[Math.floor(Math.random() * rows.length)];
                attempts++;
            } while (recentWords.includes(randomRow.word) && attempts < 100);

            recentWords.push(randomRow.word);
            if (recentWords.length > 50) recentWords.shift();

            return randomRow;
        }

        const randomRow = getRandomWord(rows);

        const wordData = {
            word: randomRow.word,
            syllables: String(randomRow.syllable_count),
            primaryStress: String(randomRow.primary_stress),
            schwaCount: String(randomRow.schwa_count),
            ipa: randomRow.ipa,
        };

        displayWord(wordData);
        // ✅ track word loaded
        gtag('event', 'word_attempted', {
            'word': wordData.word
        });
    } catch (error) {
        console.warn("Error loading from Supabase, using fallback data:", error);
        const rows = fallbackRows;

        function getRandomWordFallback(rows) {
            let randomRow;
            let attempts = 0;
            do {
                randomRow = rows[Math.floor(Math.random() * (rows.length - 1)) + 1];
                attempts++;
            } while (recentWords.includes(randomRow[0]) && attempts < 100);

            recentWords.push(randomRow[0]);
            if (recentWords.length > 50) recentWords.shift();
            return randomRow;
        }

        const randomRow = getRandomWordFallback(rows);
        const wordData = {
            word: randomRow[0],
            syllables: randomRow[2],
            primaryStress: randomRow[3],
            schwaCount: randomRow[4],
            ipa: randomRow[5],
        };
        displayWord(wordData);
    }
}

// ✅ Display word and associated data
function displayWord(wordData) {
    console.log("Selected Word Data:", wordData);
    document.getElementById("target-word").innerText = wordData.word || "No word found";
    document.getElementById("ipa-text").innerText = wordData.ipa || "No IPA available";
    document.getElementById("ipa-text").style.display = "none";
    window.currentWordData = wordData;

    // ✅ reset the flag for each new word
    firstAttempt = true;
    attemptCount = 0;  
}

// ✅ Toggle IPA visibility
function toggleIPA() {
    const ipaElement = document.getElementById("ipa-text");
    ipaElement.style.display = ipaElement.style.display === "none" ? "inline" : "none";
}

// ✅ *CUT* Score Tracker: Load and Save Scores
function loadScoreData() {
    return {
        score: localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0,
        streak: localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0,
        lastPlayedDate: localStorage.getItem("lastPlayedDate") || ""
    };
}

function saveScoreData(score, streak) {
    localStorage.setItem("score", score);
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastPlayedDate", new Date().toISOString().split('T')[0]); // Save only YYYY-MM-DD
}

// ✅ *CUT* Helper function to check if days are consecutive
function isConsecutiveDay(previousDate, currentDate) {
    const prev = new Date(previousDate);
    const curr = new Date(currentDate);
    const difference = (curr - prev) / (1000 * 60 * 60 * 24); // Convert to days
    return difference === 1; // Returns true if they are consecutive days
}

// ✅ *CUT* Update Score and Streak
function updateScore() {
    let { score, streak, lastPlayedDate } = loadScoreData();
    const today = new Date().toISOString().split('T')[0]; // Get current date

    if (lastPlayedDate === today) {
        score += 1; // ✅ Correct: add 1 to score only
    } else {
        streak = (lastPlayedDate && isConsecutiveDay(lastPlayedDate, today)) ? streak + 1 : 1;  
        score = 1; // ✅ Reset score for a new day
    }

    saveScoreData(score, streak);
    updateScoreDisplay(); // ✅ Ensure UI updates correctly
}

// ✅ *CUT* Update Score Display
function updateScoreDisplay() {
    const { score, streak } = loadScoreData();
    const scoreEl = document.getElementById("current-score");
    const streakEl = document.getElementById("current-streak");

    if (scoreEl) {
        scoreEl.innerText = score;
    }

    if (streakEl) {
        streakEl.innerText = streak;
    }
}

// ✅ Check answers
function checkAnswer() {
    if (!window.currentWordData) {
        console.error("Error: No word data available!");
        return; // Stop function execution if data is missing
    }
      attemptCount++;  // ✅ attempt count

    const { syllables, primaryStress, schwaCount } = window.currentWordData;

    const syllableInput = document.getElementById("syllables");
    const primaryStressInput = document.getElementById("primary-stress");
    const schwaCountInput = document.getElementById("schwa-count");

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

    if (schwaCountInput.value === schwaCount) {
        schwaCountInput.classList.add("correct");
        schwaCountInput.classList.remove("incorrect");
    } else {
        schwaCountInput.classList.add("incorrect");
        schwaCountInput.classList.remove("correct");
        allCorrect = false;
    }

    if (allCorrect) {
    updateScore();

    // ✅ track correct answers
    gtag('event', 'word_correct', {
        'word': window.currentWordData.word
    });

    if (firstAttempt) {
        gtag('event', 'word_correct_first_attempt', {
            'word': window.currentWordData.word
        });
    }

    // ✅ mark that first attempt window has passed
    firstAttempt = false;

    // ✅ *THIS NEEDS REVIEWING, + SECTION BELOW* Auto-reveal IPA for confirmation
    document.getElementById("ipa-text").style.display = "inline";
    document.getElementById("toggle-ipa").checked = true;

    document.getElementById("feedback-message").style.display = "none";
    celebrateWin();

    // ✅ Show feedback popup after 3 words completed
    wordsCompletedThisSession++;
    if (wordsCompletedThisSession === 3) {
        maybeShowFeedbackPopup();
    }
} else {
    document.getElementById("feedback-message").textContent =
      "Try Again: Change answers in orange. You can reveal the IPA spelling if you need help!";
    document.getElementById("feedback-message").style.display = "block";

    // ❌ Do NOT auto-reveal IPA
    document.getElementById("ipa-text").style.display = "none";
    document.getElementById("toggle-ipa").checked = false;
}
}

// ✅ Share Functionality
function shareGame() {
    const gameURL = window.location.href;
    const shareText = `I'm playing Stress Code! Can you beat my score? 🔥 Play here: ${gameURL}`;

    if (navigator.share) {
        // ✅ Use Web Share API if available
        navigator.share({
            title: "Stress Code Game",
            text: shareText,
            url: gameURL
        }).then(() => console.log("Shared successfully!"))
        .catch(error => console.error("Error sharing:", error));
    } else {
        // ✅ Fallback: Copy to clipboard & show alert
        navigator.clipboard.writeText(gameURL)
            .then(() => alert("✅ Link copied! Share it with friends."))
            .catch(error => console.error("Clipboard error:", error));
    }
}

// ✅ Celebrate Win function with preloaded sounds
function celebrateWin() {
    const drumroll = preloadedSounds[Math.floor(Math.random() * preloadedSounds.length)];
    drumroll.currentTime = 0;
    drumroll.play().catch(error => console.error("Audio play failed:", error));

    // ✅ Colorful alert box
    const alertBox = document.createElement("div");
    alertBox.innerText = "🎉 Well done! All answers are correct. 🎉";
    alertBox.style.position = "fixed";
    alertBox.style.top = "50%";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translate(-50%, -50%)";
    alertBox.style.padding = "20px";
    alertBox.style.backgroundColor = "#28a745"; // Green success color
    alertBox.style.color = "white";
    alertBox.style.fontSize = "20px";
    alertBox.style.fontWeight = "bold";
    alertBox.style.borderRadius = "8px";
    alertBox.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    alertBox.style.textAlign = "center";
    alertBox.style.zIndex = "1000";

    document.body.appendChild(alertBox);

    setTimeout(() => {
    alertBox.remove();
    document.getElementById("next-word-btn").style.display = "inline-block";
    }, 2000);
}

// ✅ Reset Game
function resetGame() {
    document.querySelectorAll(".input-box").forEach((box) => {
        box.value = "";
        box.classList.remove("correct", "incorrect");
    });

    const ipaToggle = document.getElementById("toggle-ipa");
    const ipaText = document.getElementById("ipa-text");

    ipaToggle.checked = false;  
    ipaText.style.display = "none"; 

    // Hide the feedback message
    const feedbackMessage = document.getElementById("feedback-message");
    feedbackMessage.style.display = "none";
    
    updateScoreDisplay();
    setTimeout(loadWordData, 500);
}

// ✅ *TIDY THIS SECTION - RESTORE ON-BOARDING POP-UP?* Onboarding Pop-up Functionality
function showOnboardingPopup(forceShow = false) {
    const hasSeenPopup = localStorage.getItem("seenPopup");

    // 🚀 Disable automatic pop-up on first open but keep the ability to show it manually
    if (forceShow) {
        document.getElementById("onboarding-popup").style.display = "flex";
    }
}

function closeOnboardingPopup() {
    document.getElementById("onboarding-popup").style.display = "none";
    localStorage.setItem("seenPopup", "true"); // ✅ Remember that the user has seen it
}

// ✅ Feedback Pop-up: Show after 3 words if not already answered
function maybeShowFeedbackPopup() {
    if (localStorage.getItem("userRole")) return; // Already answered
    document.getElementById("feedback-popup").style.display = "block";
}

function submitFeedbackRole(role) {
    localStorage.setItem("userRole", role);
    document.getElementById("feedback-popup").style.display = "none";
    gtag('event', 'user_role_feedback', { 'role': role });
}

function dismissFeedbackPopup() {
    document.getElementById("feedback-popup").style.display = "none";
    localStorage.setItem("userRole", "dismissed");
}

// ✅ Add event listeners properly
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Adding event listeners...");

    document.getElementById("submit").addEventListener("click", checkAnswer);
    document.getElementById("toggle-ipa").addEventListener("click", toggleIPA);
    document.getElementById("next-word-btn").addEventListener("click", () => {
    document.getElementById("next-word-btn").style.display = "none";
    resetGame();
    });

    // ✅ Add event listeners for pop-up buttons
    document.getElementById("close-popup").addEventListener("click", closeOnboardingPopup);
    document.getElementById("info-btn").addEventListener("click", () => showOnboardingPopup(true));

    // ✅ Fix: Ensure the Share Button exists before adding an event listener
    const shareBtn = document.getElementById("share-btn");
    if (shareBtn) {
        shareBtn.addEventListener("click", shareGame);
        console.log("✅ Share button event listener added!");
    } else {
        console.warn("⚠️ Share button not found in the DOM!");
    }

    // ✅ Feedback popup event listeners
    document.querySelectorAll(".feedback-role-btn").forEach(btn => {
        btn.addEventListener("click", () => submitFeedbackRole(btn.dataset.role));
    });
    document.getElementById("feedback-dismiss").addEventListener("click", dismissFeedbackPopup);

    console.log("✅ Calling loadWordData() now...");
    loadWordData();
    updateScoreDisplay(); // ✅ Load the score when page loads
});

console.log("✅ loadWordData() was called! Waiting for response...");






