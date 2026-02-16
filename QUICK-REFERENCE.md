# Quick Reference - New Features

## 🎯 How to Access Everything

### Main Dashboard
**URL**: `https://your-domain.vercel.app/`
- Your existing React app with all 20 domains
- Domain detail pages
- Progress tracking

### 3D Knowledge Map (NEW!)
**URL**: `https://your-domain.vercel.app/knowledge-map.html`
- Interactive physics-based visualization
- Click planets to expand and see moons
- Search, zoom, pan controls
- Heat map toggle for mastery levels
- **No API key needed** ✅

### The Oracle AI Chat (NEW!)
**URL**: `https://your-domain.vercel.app/oracle.html`
- AI tutor powered by Groq
- 10 domain contexts
- Challenge mode
- Session management
- **Requires Groq API key** 🔑

---

## 🔑 Setting Up Groq API Key

### Option 1: For You (Development)
1. Create `.env` file in project root
2. Add: `VITE_GROQ_API_KEY=gsk_your_key_here`
3. Get key from: https://console.groq.com

### Option 2: For Users (Production)
- Users enter their own API key when they first open The Oracle
- Key is saved in browser localStorage
- No server configuration needed

### Option 3: Vercel Environment Variable
1. Go to Vercel project settings
2. Environment Variables section
3. Add: `VITE_GROQ_API_KEY` = `gsk_your_key_here`
4. Redeploy

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 📍 Navigation in Your App

The sidebar now has these links:
- 🏠 **Dashboard** - Main React app home
- 🗺️ **3D Knowledge Map** - Opens `/knowledge-map.html`
- 🔮 **The Oracle (AI Chat)** - Opens `/oracle.html`
- Then all 20 domains below

---

## ✅ What's Working Now

1. ✅ Main React app at `/`
2. ✅ 3D Knowledge Map at `/knowledge-map.html`
3. ✅ The Oracle at `/oracle.html`
4. ✅ Navigation links in sidebar
5. ✅ Environment variable support
6. ✅ Vercel routing configured
7. ✅ .env file gitignored

---

## 🔧 If Knowledge Map Still Shows Old Version

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check URL**: Make sure you're going to `/knowledge-map.html` not `/knowledge-map`
3. **Clear cache**: Browser settings → Clear browsing data
4. **Rebuild**: Run `npm run build` locally
5. **Redeploy**: Push to GitHub or run `vercel --prod`

---

## 📱 Mobile Access

Both new pages are fully responsive:
- Knowledge Map: Touch to drag, pinch to zoom
- Oracle: Sidebars collapse to drawers on mobile

---

## 🎨 Customization Quick Tips

### Change Mastery Levels (Knowledge Map)
Edit `public/knowledge-map.html` line ~90:
```javascript
const masteryData = {
  1: 65, 2: 80, 3: 55, // etc...
};
```

### Customize Oracle Personality
Edit `public/oracle.html` line ~280:
```javascript
function getSystemPrompt() {
  // Modify the system prompt here
}
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Old knowledge map showing" | Access `/knowledge-map.html` not `/knowledge-map` |
| "Oracle won't load" | Enter Groq API key in the modal |
| "API key not working" | Verify key starts with `gsk_` |
| "Build fails" | Run `npm install` and try again |
| "404 on HTML pages" | Rebuild and redeploy |

---

## 📊 File Locations

```
public/
├── knowledge-map.html  ← 3D visualization
└── oracle.html         ← AI chat

.env                    ← Your API key (gitignored)
.env.example            ← Template for others
```

---

## 🎯 Next Steps

1. ✅ Add your Groq API key to `.env`
2. ✅ Run `npm run dev` to test locally
3. ✅ Access `/knowledge-map.html` and `/oracle.html`
4. ✅ Push to GitHub (Vercel auto-deploys)
5. ✅ Share the links with others!

---

**Need help?** Check `SETUP-GUIDE.md` for detailed instructions.

**Want to customize?** All code is in `public/knowledge-map.html` and `public/oracle.html`.

Enjoy! 🌌✨
