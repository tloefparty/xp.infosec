# XP — Quest Board (pure HTML/CSS/JS)

No Python, no server, no build step. Just open it.

## Run it

Double-click `index.html` to open it in your browser. That's it.

(If a browser blocks local file access for any reason, you can also
right-click the folder → "Open with Live Server" in VS Code, or run
`python -m http.server` from inside this folder and visit
`http://localhost:8000` — but plain double-click works for almost everyone.)

## What's included

- `index.html` — the page
- `style.css` — visual design, including a full **dark mode** theme
  (toggle button top-right, remembers your choice)
- `script.js` — all logic: quest filtering, dark mode, and the profile editor
- `data.js` — the quest data (Paid / Free / Premium). Edit this file to add
  your own quests.

## Customizing your profile

Click the avatar icon or "Edit profile" on the stat card to set your own:
- Name
- Class / role
- Avatar (pick from 8 emoji options)

Your profile and theme choice are saved in the browser's local storage, so
they'll still be there next time you open the page on the same device.

## Adding quests

Open `data.js` and add a new object to the `QUESTS` array, following the
shape of the existing entries. Use `tier: "paid"`, `"free"`, or `"premium"`.
