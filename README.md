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

## Embedding Stress Code on Your Website

Stress Code is free to embed on your school or teacher website using a simple iframe. This means your students can play the game without leaving your site.

### How to embed

Paste this code into your website wherever you'd like the game to appear:

    <iframe
      src="https://stress-code-english-pronunciation.netlify.app"       width="100%"
    height="700px"
    style="border: none;"
    title="Stress Code – English Pronunciation Game">
    </iframe>

You can adjust the `height` value to suit your page layout.

### Live example

You can see the game embedded in action at
[[www.jdenglishpronunciation.co.uk](https://www.jdenglishpronunciation.co.uk/practise-british-english-stress-and-ipa)].

### Privacy and tracking

When embedded via iframe, the game runs from its original hosted location.
Visitors may be tracked anonymously by Google Analytics as part of normal
site analytics. Please ensure your website's cookie/privacy notice covers
third-party embeds if you are based in the UK or EU.

### Self-hosting

You are also welcome to download and host your own copy of the game.
To set it up:

1. Download or clone this repository
2. Open `script.js` and replace the Supabase URL and anon key with your
   own Supabase project credentials (see Supabase Configuration comments
   in the file)
3. Open `index.html` in a browser to test locally
4. Deploy to any static hosting service such as Netlify or GitHub Pages

If you adapt the game, please keep a link back to the original project.

### Contributing

If you'd like to suggest an improvement or bug fix, please fork the repository and submit a pull request via GitHub. All contributions are welcome!

GitHub repository: https://github.com/jennydance-ep/stress-code

### Questions?

Contact jenny@jdenglishpronunciation.co.uk
