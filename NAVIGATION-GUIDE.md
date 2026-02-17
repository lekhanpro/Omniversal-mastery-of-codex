# 🧭 Navigation Guide - Omniversal Codex

## Quick Access

Your complete navigation structure is now:

```
Home | 🗺️ Knowledge Map | 🔮 Oracle | ⚔️ Arena | 📖 Grimoire | 📡 Observatory | ⚒️ Forge | 🗺️ Cartography | 📊 Dashboard
```

---

## 📍 Where to Find Each Feature

### In the Sidebar (Left Navigation)

When you're on any page with the Layout (Home, Observatory, Forge, Cartography, Dashboard), you'll see the sidebar with:

**Features Section:**
1. 🗺️ Knowledge Map - 3D visualization
2. 🔮 Oracle - AI chat
3. ⚔️ Arena - Quiz system
4. 📖 Grimoire - Notes
5. 📡 Observatory - Progress tracking
6. ⚒️ Forge - Practice drills
7. 🗺️ Cartography - Learning paths
8. 📊 Dashboard - Overview

**Domains Section:**
- All 10 domains listed below

---

## 🎯 When to Use Each Page

### 🏠 **Home** - Start Here
- Browse all 10 domains
- Search for topics
- Read inspirational quotes
- Jump to any domain

### 🗺️ **Knowledge Map** - Visualize
- See how domains connect
- Interactive 3D network
- Heat map of your mastery
- Beautiful visualization

### 🔮 **Oracle** - Learn
- Ask AI questions
- Get Socratic guidance
- Challenge mode for hard questions
- Save conversation sessions
- **Uses your Groq API key from .env**

### ⚔️ **Arena** - Test
- Take quizzes (80 questions total)
- 3 modes: Domain Drill, Speed Round, Gauntlet
- Track your streak
- See results with radar chart

### 📖 **Grimoire** - Document
- Write notes
- Organize by domain
- Use templates
- Tag and search
- Export as Markdown

### 📡 **Observatory** - Monitor
- See overall progress
- Domain-by-domain stats
- Time spent tracking
- Quick links to improve

### ⚒️ **Forge** - Practice
- Flashcard drills
- Practice exercises
- Challenge problems
- Build daily streak

### 🗺️ **Cartography** - Plan
- Create learning paths
- Set milestones
- Track due dates
- Organize your journey

### 📊 **Dashboard** - Overview
- See everything at once
- Recent activity
- All stats combined
- Quick access to all features

---

## 🔄 Data Flow

All pages share data through localStorage:

```
Grimoire (write notes) 
    ↓
Observatory (track progress)
    ↓
Dashboard (show overview)

Arena (take quizzes)
    ↓
Observatory (update mastery)
    ↓
Dashboard (show streak)

Oracle (chat sessions)
    ↓
Dashboard (show session count)

Forge (practice drills)
    ↓
Observatory (track streak)
    ↓
Dashboard (show progress)

Cartography (learning paths)
    ↓
Dashboard (show path count)
```

---

## 🎨 Visual Cues

Each feature has its own color theme:

- 🗺️ Knowledge Map: **Purple/Blue**
- 🔮 Oracle: **Gold**
- ⚔️ Arena: **Red/Yellow**
- 📖 Grimoire: **Purple**
- 📡 Observatory: **Blue**
- ⚒️ Forge: **Orange**
- 🗺️ Cartography: **Green**
- 📊 Dashboard: **Blue/Purple gradient**

---

## ⌨️ Keyboard Shortcuts

### Oracle
- `Enter` - Send message
- `Shift + Enter` - New line

### Arena
- Click to select answer
- Progress bar shows completion

### Grimoire
- Rich text toolbar for formatting
- `Enter` in tag input - Add tag

---

## 📱 Mobile Navigation

On mobile devices:
1. Tap the **menu icon** (☰) in top-left
2. Sidebar slides in from left
3. Tap any feature to navigate
4. Sidebar auto-closes after selection

---

## 🚀 Recommended Workflow

### For New Users:
1. **Home** - Explore domains
2. **Knowledge Map** - See the big picture
3. **Oracle** - Ask questions about a domain
4. **Grimoire** - Take notes from Oracle
5. **Arena** - Test your knowledge
6. **Dashboard** - Check your progress

### For Daily Practice:
1. **Dashboard** - Check today's stats
2. **Forge** - Do daily drills
3. **Arena** - Take a quick quiz
4. **Observatory** - Review progress
5. **Cartography** - Update milestones

### For Deep Learning:
1. **Cartography** - Plan learning path
2. **Oracle** - Deep dive with AI
3. **Grimoire** - Document insights
4. **Forge** - Practice concepts
5. **Arena** - Test mastery
6. **Observatory** - Track improvement

---

## 🔍 Finding Things

### Search Functionality:
- **Home**: Search domains and topics
- **Knowledge Map**: Search nodes
- **Grimoire**: Search all notes
- **Forge**: Filter by domain

### Filtering:
- **Observatory**: Time range (7D, 30D, All)
- **Forge**: Domain filter
- **Cartography**: By learning path

---

## 💡 Pro Tips

1. **Use Dashboard as your daily starting point** - It shows everything at a glance

2. **Oracle + Grimoire combo** - Ask Oracle questions, immediately document in Grimoire

3. **Arena after learning** - Take domain quizzes right after studying that domain

4. **Forge for daily practice** - Build your streak with quick flashcard sessions

5. **Cartography for goals** - Set milestones and track them weekly

6. **Observatory for motivation** - Watch your mastery percentages grow

7. **Knowledge Map for inspiration** - See connections you didn't know existed

---

## 🎯 Quick Links

From any page, you can:
- Click **Home icon** in sidebar to return to main page
- Click **Back arrow** (on full-screen pages) to return
- Use **Dashboard** to access all features quickly

---

## 📊 Progress Tracking

Your progress is automatically tracked:
- **Notes written** → Grimoire
- **Quizzes taken** → Arena
- **Drills completed** → Forge
- **Sessions saved** → Oracle
- **Milestones achieved** → Cartography

All visible in:
- **Observatory** (detailed)
- **Dashboard** (overview)

---

## 🔧 Troubleshooting

### Oracle not working?
- Check `.env` file has `VITE_GROQ_API_KEY`
- Restart dev server after adding key

### Knowledge Map blank?
- Refresh the page
- Check browser console for errors
- Canvas needs time to initialize

### Data not syncing?
- All data is in localStorage
- Check browser allows localStorage
- Try refreshing Dashboard

---

**Happy Learning! 🚀**

Navigate freely between all 8 pages - they all work together to create your complete learning system.
