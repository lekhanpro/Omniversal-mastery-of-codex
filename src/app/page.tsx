'use client'

import { useState, useEffect } from 'react'
import { 
  Home, Map, Sparkles, Flame, BookOpenText, Telescope, Hammer, Compass, 
  BarChart3, Menu, Moon, Sun, Search, Sword, Brain, Cpu, Bot, Atom, 
  TrendingUp, Scale, Mic, ShieldAlert, Globe, BookOpen, Palette, 
  Rocket, Scroll, Eye, Target, ChevronRight, X, Zap, Hexagon
} from 'lucide-react'

// Domain data structure
const domains = [
  { id: 1, name: 'Physical Mastery & Combat Systems', desc: 'Biomechanics, physiology, and combat intelligence unified for somatic dominance.', icon: Sword, color: '#00a8ff' },
  { id: 2, name: 'Mind & Cognitive Science', desc: 'The architecture of intelligence, memory, perception, and consciousness.', icon: Brain, color: '#00ffc8' },
  { id: 3, name: 'Tech Creation & Digital Wizardry', desc: 'Full-spectrum creation: Engineering, Architecture, UI/UX, and DevOps.', icon: Cpu, color: '#a855f7' },
  { id: 4, name: 'AI, Robotics & Automation', desc: 'Building intelligent agents, physical robotics, and autonomous systems.', icon: Bot, color: '#ff6b35' },
  { id: 5, name: 'Scientific Intelligence & Systems', desc: 'Understanding the fundamental workings of reality from particles to ecosystems.', icon: Atom, color: '#ffd93d' },
  { id: 6, name: 'Strategic Business & Finance', desc: 'Mastering markets, capital allocation, and organizational leadership.', icon: TrendingUp, color: '#6bff8e' },
  { id: 7, name: 'Philosophical Engineering', desc: 'Inner mastery, logic, ethics, and the engineering of the self.', icon: Scale, color: '#ff5599' },
  { id: 8, name: 'Communication & Influence', desc: 'The art of rhetoric, persuasion, storytelling, and negotiation.', icon: Mic, color: '#a8ff00' },
  { id: 9, name: 'Cybernetics & Cybersecurity', desc: 'Control systems, digital defense, ethical hacking, and information warfare.', icon: ShieldAlert, color: '#ff8c42' },
  { id: 10, name: 'Future Intelligence & Foresight', desc: 'Forecasting, scenario planning, and architecting the trajectory of civilization.', icon: Telescope, color: '#42c5ff' },
  { id: 11, name: 'Global Intelligence & Cultural Fluency', desc: 'Global strategy, anthropology, diplomacy, and geopolitical systems thinking.', icon: Globe, color: '#00d4ff' },
  { id: 12, name: 'Meta-Learning & Ultra Cognition', desc: 'Ability to learn anything, master anything, adapt to anything, and think at higher levels.', icon: BookOpen, color: '#b388ff' },
  { id: 13, name: 'Creative Arts & Expression', desc: 'Ability to create, express, design, imagine, craft, and bring ideas to life.', icon: Palette, color: '#ff55cc' },
  { id: 14, name: 'Public Systems & Civic Innovation', desc: 'Mastery in how human societies are managed, governed, regulated, developed, and improved.', icon: Scale, color: '#ffcc00' },
  { id: 15, name: 'Deep Computing & Data Mastery', desc: 'Solving the hardest computational problems using advanced algorithms, math, and high-performance systems.', icon: Cpu, color: '#55ffc8' },
  { id: 16, name: 'Social Engineering & Behavioral Design', desc: 'Understanding and engineering collective behavior, social dynamics, and mass psychology.', icon: Brain, color: '#ffaa80' },
  { id: 17, name: 'Planetary Health & Resilient Futures', desc: 'Climate science, sustainability, ecological systems, and environmental stewardship.', icon: Globe, color: '#80d4ff' },
  { id: 18, name: 'Space Exploration & Cosmological Engineering', desc: 'Space systems, astrophysics, orbital mechanics, and interplanetary civilization.', icon: Rocket, color: '#ffbb66' },
  { id: 19, name: 'Civilization Building & Strategic Design', desc: 'Long-term thinking, institutional design, and building systems that last millennia.', icon: Scroll, color: '#cc99ff' },
  { id: 20, name: 'Mythic Mastery & Esoteric Systems', desc: 'Archetypal intelligence, symbolic systems, mythological frameworks, and transcendent knowledge.', icon: Eye, color: '#66ffdd' },
]

const navItems = [
  { name: 'Home', icon: Home, href: '#/', active: true },
  { name: 'Knowledge Map', icon: Map, href: '#/map' },
  { name: 'Oracle', icon: Sparkles, href: '#/oracle' },
  { name: 'Arena', icon: Flame, href: '#/arena' },
  { name: 'Grimoire', icon: BookOpenText, href: '#/grimoire' },
  { name: 'Observatory', icon: Telescope, href: '#/observatory' },
  { name: 'Forge', icon: Hammer, href: '#/forge' },
  { name: 'Cartography', icon: Compass, href: '#/cartography' },
  { name: 'Dashboard', icon: BarChart3, href: '#/dashboard' },
]

const stats = [
  { label: 'Total Subjects', value: '2,898', icon: BookOpenText },
  { label: 'Active Domains', value: '20', icon: Compass },
  { label: 'Mastery Paths', value: '156', icon: Map },
  { label: 'Hours Logged', value: '0', icon: BarChart3 },
]

// Futuristic Loading Screen Component
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="loading-screen">
      {/* Animated grid background */}
      <div className="loading-grid" />
      
      {/* Scanline effect */}
      <div className="loading-scanline" />
      
      {/* Corner decorations */}
      <div className="loading-corner loading-corner-tl" />
      <div className="loading-corner loading-corner-tr" />
      <div className="loading-corner loading-corner-bl" />
      <div className="loading-corner loading-corner-br" />
      
      {/* Floating particles */}
      <div className="loading-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      {/* Main hexagon animation */}
      <div className="loading-hexagon">
        {/* Outer hexagon */}
        <svg className="hexagon-outer" viewBox="0 0 100 100">
          <polygon
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            fill="none"
            stroke="rgba(201, 168, 76, 0.2)"
            strokeWidth="0.5"
          />
        </svg>
        
        {/* Middle hexagon */}
        <svg className="hexagon-middle" viewBox="0 0 100 100">
          <polygon
            points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
            fill="none"
            stroke="rgba(201, 168, 76, 0.3)"
            strokeWidth="0.5"
          />
        </svg>
        
        {/* Inner hexagon */}
        <svg className="hexagon-inner" viewBox="0 0 100 100">
          <polygon
            points="50,25 70,37.5 70,62.5 50,75 30,62.5 30,37.5"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="1"
          />
        </svg>
        
        {/* Core pulse */}
        <div className="loading-core">
          <Zap className="w-8 h-8 text-[#c9a84c] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="loading-text">
        <div className="loading-title">Initializing Codex</div>
        
        {/* Progress bar */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div 
              className="loading-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="loading-percentage">
            {Math.round(Math.min(progress, 100))}%
          </div>
          <div className="loading-status">
            {progress < 30 ? 'Loading knowledge modules...' :
             progress < 60 ? 'Synchronizing domains...' :
             progress < 90 ? 'Calibrating interface...' :
             'Ready to explore...'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OmniversalCodex() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    // Simulate loading animation
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 animated-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      
      {/* Grid overlay */}
      <div className="grid-overlay" />
      
      {/* Noise overlay for depth */}
      <div className="fixed inset-0 z-[2] noise-overlay pointer-events-none" />

      {/* Mobile Header */}
      <header className="glass fixed left-0 right-0 top-0 z-[1000] flex h-14 items-center justify-between border-b border-white/5 px-4 md:hidden">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="glass-button rounded-lg p-2.5 text-white/70 hover:text-white"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <a className="font-mono text-sm tracking-[0.24em] text-[#c9a84c]" href="#/">
          CODEX
        </a>
        <button 
          onClick={() => setIsDark(!isDark)}
          className="glass-button rounded-lg p-2.5 text-white/70 hover:text-white"
          aria-label="Toggle theme"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`glass-strong fixed inset-y-0 left-0 z-[999] w-[280px] border-r border-white/5 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
            <a className="font-mono text-sm tracking-[0.28em] text-[#c9a84c]" href="#/">
              OMNIVERSAL CODEX
            </a>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="glass-button rounded-lg p-2 text-white/60 hover:text-white hidden md:flex"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="mb-2 px-2 text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
              Navigation
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all duration-300 ${
                    item.active
                      ? 'border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c]'
                      : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            {/* Domains List */}
            <div className="mt-6 mb-2 px-2 text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
              Domains
            </div>
            <div className="space-y-0.5 pb-4">
              {domains.map((domain) => (
                <a
                  key={domain.id}
                  href={`#/domain/${domain.id}`}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/40 transition-all duration-200 hover:bg-white/5 hover:text-white/80"
                >
                  <domain.icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: domain.color }} />
                  <span className="truncate">{domain.id}. {domain.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 px-4 py-3">
            <div className="flex items-center justify-between text-[10px] text-white/30">
              <span>CODEX v2.0</span>
              <span>2898 Subjects</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto pt-14 md:ml-[280px] md:pt-0">
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8 md:py-12">
          
          {/* Hero Section */}
          <section className="glass-card mb-8 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="hero-shimmer text-2xl font-bold tracking-wide md:text-4xl lg:text-5xl">
                  Omniversal Mastery of Codex
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-white/50 md:text-base leading-relaxed">
                  Navigate your 20-domain mastery architecture. Use keyboard shortcuts:{' '}
                  <span className="font-mono text-[#c9a84c]/80">1-0</span> jump to cards,
                  <span className="font-mono text-[#c9a84c]/80"> / </span> focus search, 
                  <span className="font-mono text-[#c9a84c]/80"> Esc</span> clear.
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="mt-6 relative max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search domain, subdomain, concept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input py-3 pl-11 pr-4 text-sm text-white placeholder-white/30"
              />
            </div>
          </section>

          {/* Today's Focus */}
          <section className="glass-card mb-8 p-6 border-[#c9a84c]/20 hover:border-[#c9a84c]/40">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="glass-chip text-[#c9a84c] flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                <span>Focus</span>
              </div>
              <h2 className="text-lg font-medium text-white">Today&apos;s Priority</h2>
            </div>
            <p className="mb-2 text-sm text-white/60">
              Lowest completion domain: <span className="font-medium text-[#c9a84c]">Physical Mastery & Combat Systems</span>
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Kinetic chain optimization', 'Eccentric training', 'Torque mechanics'].map((item) => (
                <span key={item} className="glass-chip text-white/60">
                  {item}
                </span>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-5 py-2.5 text-sm text-[#c9a84c] transition-all duration-300 hover:bg-[#c9a84c]/20 hover:border-[#c9a84c]/50 hover:scale-[1.02]">
              Begin Study
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-2 gap-3 mb-8 md:grid-cols-4 md:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center group">
                <stat.icon className="h-4 w-4 mx-auto mb-2 text-[#c9a84c]/70 group-hover:text-[#c9a84c] transition-colors" />
                <div className="text-xl font-bold text-white md:text-2xl">{stat.value}</div>
                <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Domains Grid */}
          <section className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white md:text-xl">Knowledge Domains</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
                {filteredDomains.length} visible
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
              {filteredDomains.map((domain) => (
                <article
                  key={domain.id}
                  className="glass-card cursor-pointer group neon-border"
                >
                  <div className="flex w-full items-start gap-4 p-4 md:p-5">
                    {/* Icon */}
                    <div 
                      className="rounded-xl border p-2.5 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                      style={{ 
                        borderColor: `${domain.color}40`,
                        color: domain.color,
                        backgroundColor: `${domain.color}10`
                      }}
                    >
                      <domain.icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-white/90 group-hover:text-white truncate">
                        {domain.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-white/40 leading-relaxed">
                        {domain.desc}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-3 progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.random() * 25}%`,
                            backgroundColor: domain.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Footer Info */}
          <section className="glass-card p-6 text-center">
            <p className="text-xs text-white/30 uppercase tracking-wider">
              Knowledge is the only infinity
            </p>
            <p className="text-[10px] text-white/20 mt-2">
              Built with Glassmorphism & Material Expressive 3
            </p>
          </section>
        </div>
      </main>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-[1001] glass-button rounded-full p-2.5 text-white/70 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
