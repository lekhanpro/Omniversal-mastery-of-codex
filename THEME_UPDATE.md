# Theme Update Instructions

## Changes Made

1. **Dashboard Theme Fixed** - Dashboard now properly supports both light and dark modes
2. **Light Mode Improved** - Better contrast with slate colors for better readability
3. **Dark Mode Restored** - Original dark theme colors (#050505 bg, #00f3ff neon blue, etc.)
4. **Theme Toggle** - Sun/Moon icon in sidebar and mobile header

## To See the Changes

### If using the built version (dist folder):
1. Open `dist/index.html` in your browser
2. Clear browser cache: Press `Ctrl + Shift + Delete`
3. Hard refresh: Press `Ctrl + F5`
4. Click the Sun/Moon icon in the sidebar to toggle themes

### If using the development server:
1. **IMPORTANT**: Stop the dev server if running (Ctrl+C)
2. Run: `npm run dev`
3. Open the URL shown (usually http://localhost:5173)
4. Click the Sun/Moon icon to toggle between light and dark modes

## Oracle API Key

If Oracle is not working:
1. Make sure `.env` file has your valid Groq API key: `VITE_GROQ_API_KEY=your_key_here`
2. **RESTART the dev server** (Ctrl+C, then `npm run dev`)
3. Environment variables only load when the server starts

## Features

- **Light Mode**: Clean slate colors with good contrast
- **Dark Mode**: Original neon theme (#050505 background, neon blue/purple/green)
- **Dashboard**: Now matches the theme (light/dark)
- **Knowledge Map**: Circular rotating constellation with all 20 domains
- **Theme Toggle**: Available in sidebar and mobile header

## Troubleshooting

If changes are not visible:
1. Clear browser cache completely
2. Try incognito/private browsing mode
3. Make sure you're viewing the latest build
4. Check browser console for any errors (F12)
