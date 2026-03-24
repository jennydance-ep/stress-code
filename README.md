# stress-code
Stress Code game

## Local Setup

This is a plain HTML/CSS/JS project with no build tool. To run it locally:

1. Clone or download the repository.
2. Open `script.js` and replace the two placeholder values near the top of the file:
   ```js
   const supabaseUrl = "YOUR_PROJECT_URL";
   const supabaseKey = "YOUR_ANON_KEY";
   ```
   Substitute your real Supabase project URL and anon/public key, both found in your Supabase dashboard under **Project Settings → API**.
3. Open `index.html` in a browser (or use a local server such as VS Code Live Server).

**Note:** The anon/public key is safe to include in frontend code. It is read-only and protected by Row Level Security (RLS) in Supabase.
