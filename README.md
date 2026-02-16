# Lekhan's Omniversal Codex

A comprehensive digital library for personal evolution, future intelligence, and high-performance skill building. This React application provides an immersive, interactive experience for exploring and tracking mastery across multiple knowledge domains.

## 🌌 Features

### Cosmic Background Animation
- **Living Nebula System**: 8 organic blob shapes using Bezier curve interpolation that morph and breathe
- **Deep Space Colors**: Purple, amber, and teal gradients with low opacity for atmospheric depth
- **Star Field**: 200 stars in 3 tiers (tiny, medium, large) with twinkling effects
- **Shooting Stars**: 3 shooting stars that streak across randomly every 4-8 seconds
- **60 FPS Performance**: Smooth Canvas 2D API animation

### Knowledge Domains
- **17 Comprehensive Domains**: From Physical Mastery to Planetary Health
- **Expandable Subjects**: Each domain contains detailed subdomains with specific topics
- **Progress Tracking**: Check off individual topics and track your learning progress
- **Subject Checkboxes**: Click any topic to mark as learned (persists in localStorage)
- **Progress Bars**: Visual progress indicators on each subdomain
- **Resources Tab**: Curated books and courses for each domain

### Domain Constellation Map
- **Interactive Canvas**: 10 domain nodes arranged in a circle formation
- **Connection Lines**: Gold lines showing relationships between related domains
- **Hover Tooltips**: Shows domain name and topic count
- **Progress Visualization**: Each node displays completion percentage
- **Click to Navigate**: Click any node to jump to that domain

### Codex Quotes Rotator
- **12 Inspirational Quotes**: From great thinkers like Feynman, Einstein, Turing, Nietzsche
- **Auto-Rotation**: Fades to new quote every 6 seconds
- **Manual Controls**: Previous/Next buttons and dot indicators
- **Domain Tags**: Each quote tagged with its related domain

### Weekly Study Planner
- **7-Day Grid**: Plan your study schedule for the entire week
- **Domain Selection**: Choose which domain to focus on each day
- **Goal Setting**: Set specific goals for each day
- **Visual Feedback**: Days with selected domains glow gold
- **Persistent Storage**: All data saved to localStorage
- **Clear Week**: Reset all planning data with confirmation

### UI/UX Enhancements
- **Scroll Progress Bar**: 2px gradient bar at top showing scroll position
- **Smooth Animations**: Framer Motion for fluid transitions
- **Responsive Design**: Mobile-first with hamburger navigation
- **Dark Theme**: Cyberpunk-inspired color scheme with neon accents
- **Glass Morphism**: Backdrop blur effects for depth

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 6** - Navigation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Canvas 2D API** - Cosmic background animation

## 📁 Project Structure

```
├── components/
│   ├── Accordion.tsx          # Expandable subject lists with checkboxes
│   ├── CosmicCanvas.tsx       # Background nebula animation
│   ├── ConstellationMap.tsx   # Interactive domain map
│   ├── Icons.tsx              # Icon mapping
│   ├── Layout.tsx             # Main layout with sidebar
│   ├── QuotesRotator.tsx      # Rotating quotes section
│   ├── ScrollProgress.tsx     # Scroll indicator
│   └── WeeklyPlanner.tsx      # Study planning grid
├── pages/
│   ├── Home.tsx               # Landing page with all sections
│   ├── DomainView.tsx         # Individual domain details
│   └── KnowledgeMap.tsx       # Knowledge exploration
├── data.ts                    # Domain data structure
├── quotes-data.ts             # Quotes and connections
├── types.ts                   # TypeScript interfaces
└── App.tsx                    # Main app component
```

## 💾 Data Persistence

All user progress is stored in browser localStorage:
- Subject completion checkboxes: `codex_d{domainId}_s{subdomainIdx}_p{pointIdx}`
- Weekly planner domain: `planner_day{dayIndex}_domain`
- Weekly planner goals: `planner_day{dayIndex}_goal`

## 🎯 Domains Included

1. Physical Mastery & Combat Systems
2. Mind & Cognitive Science
3. Tech Creation & Digital Wizardry
4. AI, Robotics & Automation
5. Scientific Intelligence & Systems
6. Strategic Business & Finance
7. Philosophical Engineering
8. Communication & Influence
9. Cybernetics & Cybersecurity
10. Future Intelligence & Foresight
11. Global Intelligence & Cultural Fluency
12. Meta-Learning & Ultra Cognition
13. Creative Arts & Expression
14. Public Systems & Civic Innovation
15. Deep Computing & Data Mastery
16. Social Engineering & Behavioral Design
17. Planetary Health & Resilient Futures

## 🌟 Future Enhancements

- Export/import progress data
- Study statistics and analytics
- Spaced repetition reminders
- Community features
- Mobile app version

## 📝 License

Personal project - All rights reserved

---

Built with 💙 by Lekhan
