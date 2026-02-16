# Setup Guide - Omniversal Codex

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Groq API Key (for The Oracle)

#### Option A: Environment Variable (Recommended for Development)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your free Groq API key:
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up or log in
   - Create a new API key
   - Copy the key (starts with `gsk_`)

3. Add your key to `.env`:
   ```
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```

#### Option B: In-Browser Setup (Recommended for Production)
- When you first open The Oracle (`/oracle.html`), you'll be prompted to enter your API key
- The key is stored securely in your browser's localStorage
- No server-side storage needed

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to Vercel
```bash
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

---

## 📁 Project Structure

```
Omniversal-mastery-of-codex/
├── public/
│   ├── knowledge-map.html    # 3D Interactive Knowledge Map
│   └── oracle.html            # AI Chat Interface with Groq
├── src/
│   ├── components/            # React components
│   ├── pages/                 # React pages
│   ├── data.ts               # Domain data (2000+ topics)
│   └── types.ts              # TypeScript types
├── .env.example              # Environment variables template
├── .env                      # Your local environment (gitignored)
└── vercel.json               # Vercel deployment config
```

---

## 🗺️ Accessing the New Features

### 3D Knowledge Map
- **URL**: `/knowledge-map.html`
- **Features**: 
  - Interactive physics-based visualization
  - 10 domain planets + 160 subject moons
  - Search, zoom, pan, heat map mode
  - No API key required

### The Oracle (AI Chat)
- **URL**: `/oracle.html`
- **Features**:
  - AI tutor powered by Groq (llama-3.3-70b)
  - 10 domain contexts
  - Challenge mode with timer
  - Session save/load/export
  - **Requires**: Groq API key

### Main React App
- **URL**: `/` (root)
- **Features**:
  - Dashboard with all 20 domains
  - Domain detail pages
  - Progress tracking
  - Quotes rotator

---

## 🔑 Groq API Key Setup

### For Development (Local)
Add to `.env`:
```
VITE_GROQ_API_KEY=gsk_your_key_here
```

### For Production (Vercel)
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `VITE_GROQ_API_KEY` = `gsk_your_key_here`
4. Redeploy

### For Users (In-Browser)
Users can add their own API key directly in The Oracle interface:
1. Open `/oracle.html`
2. Enter API key in the modal
3. Key is saved to localStorage
4. Works immediately

---

## 🎨 Customization

### Update Mastery Levels (Knowledge Map)
Edit `public/knowledge-map.html`, find the `masteryData` object:
```javascript
const masteryData = {
  1: 65,  // Mathematics - 65%
  2: 80,  // Computer Science - 80%
  // ... update percentages
};
```

### Add More Domains
Edit `src/data.ts` to add new domains with topics.

### Customize Oracle Behavior
Edit the system prompt in `public/oracle.html`:
```javascript
function getSystemPrompt() {
  return {
    role: 'system',
    content: `You are the Oracle...`
  };
}
```

---

## 🐛 Troubleshooting

### "Knowledge Map shows old version"
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Make sure you're accessing `/knowledge-map.html` not `/knowledge-map`
- Check that files are in `public/` folder

### "Oracle API key not working"
- Verify key starts with `gsk_`
- Check key is active at console.groq.com
- Try entering key manually in the Oracle modal
- Check browser console for error messages

### "Build fails"
- Run `npm install` to ensure all dependencies are installed
- Check Node version (requires Node 16+)
- Delete `node_modules` and `package-lock.json`, then reinstall

### "Vercel deployment issues"
- Ensure `vercel.json` is properly configured
- Check build logs in Vercel dashboard
- Verify environment variables are set in Vercel

---

## 📊 Features Overview

### Main React App
- ✅ 20 comprehensive domains
- ✅ 2000+ topics across all domains
- ✅ Progress tracking with localStorage
- ✅ Cosmic canvas background animation
- ✅ Responsive design
- ✅ Domain detail pages with tabs

### 3D Knowledge Map (`/knowledge-map.html`)
- ✅ Physics-based force-directed layout
- ✅ 10 domain planets with unique colors
- ✅ 160 orbiting subject moons
- ✅ Interactive pan, zoom, search
- ✅ Heat map mode for mastery visualization
- ✅ Connection lines with animated dots
- ✅ Big Bang intro animation
- ✅ Pure vanilla JS (no libraries)

### The Oracle (`/oracle.html`)
- ✅ Groq API integration (llama-3.3-70b)
- ✅ 10 domain contexts with Socratic teaching
- ✅ Challenge mode with 5-minute timer
- ✅ Session save/load/export
- ✅ Concept extraction and tagging
- ✅ Live token counter
- ✅ Suggested follow-ups per domain
- ✅ Mastery notes with auto-save
- ✅ Keyboard shortcuts
- ✅ Animated starfield background

---

## 🔗 Useful Links

- **Groq Console**: https://console.groq.com
- **Groq API Docs**: https://console.groq.com/docs
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/lekhanpro/Omniversal-mastery-of-codex

---

## 📝 Notes

- The `.env` file is gitignored for security
- Always use `.env.example` as a template
- Never commit API keys to version control
- Users can use their own API keys in The Oracle
- All data is stored locally (localStorage)
- No backend server required

---

Enjoy your Omniversal Codex! 🌌✨
