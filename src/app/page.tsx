'use client'

import { useState, useEffect } from 'react'
import { 
  Home, Map, Sparkles, Flame, BookOpenText, Telescope, Hammer, Compass, 
  BarChart3, Menu, Moon, Sun, Search, Sword, Brain, Cpu, Bot, Atom, 
  TrendingUp, Scale, Mic, ShieldAlert, Globe, BookOpen, Palette, 
  Rocket, Scroll, Eye, Target, ChevronRight, X
} from 'lucide-react'

// Domain data structure
const domains = [
  { id: 1, name: 'Physical Mastery & Combat Systems', desc: 'Biomechanics, physiology, and combat intelligence unified for somatic dominance.', icon: Sword, color: '#4488ff' },
  { id: 2, name: 'Mind & Cognitive Science', desc: 'The architecture of intelligence, memory, perception, and consciousness.', icon: Brain, color: '#00ccaa' },
  { id: 3, name: 'Tech Creation & Digital Wizardry', desc: 'Full-spectrum creation: Engineering, Architecture, UI/UX, and DevOps.', icon: Cpu, color: '#aa44ff' },
  { id: 4, name: 'AI, Robotics & Automation', desc: 'Building intelligent agents, physical robotics, and autonomous systems.', icon: Bot, color: '#ff6644' },
  { id: 5, name: 'Scientific Intelligence & Systems', desc: 'Understanding the fundamental workings of reality from particles to ecosystems.', icon: Atom, color: '#ffcc44' },
  { id: 6, name: 'Strategic Business & Finance', desc: 'Mastering markets, capital allocation, and organizational leadership.', icon: TrendingUp, color: '#44ff88' },
  { id: 7, name: 'Philosophical Engineering', desc: 'Inner mastery, logic, ethics, and the engineering of the self.', icon: Scale, color: '#ff44aa' },
  { id: 8, name: 'Communication & Influence', desc: 'The art of rhetoric, persuasion, storytelling, and negotiation.', icon: Mic, color: '#88ff44' },
  { id: 9, name: 'Cybernetics & Cybersecurity', desc: 'Control systems, digital defense, ethical hacking, and information warfare.', icon: ShieldAlert, color: '#ff8844' },
  { id: 10, name: 'Future Intelligence & Foresight', desc: 'Forecasting, scenario planning, and architecting the trajectory of civilization.', icon: Telescope, color: '#44aaff' },
  { id: 11, name: 'Global Intelligence & Cultural Fluency', desc: 'Global strategy, anthropology, diplomacy, and geopolitical systems thinking.', icon: Globe, color: '#65d4ff' },
  { id: 12, name: 'Meta-Learning & Ultra Cognition', desc: 'Ability to learn anything, master anything, adapt to anything, and think at higher levels.', icon: BookOpen, color: '#9d7dff' },
  { id: 13, name: 'Creative Arts & Expression', desc: 'Ability to create, express, design, imagine, craft, and bring ideas to life.', icon: Palette, color: '#ff79d7' },
  { id: 14, name: 'Public Systems & Civic Innovation', desc: 'Mastery in how human societies are managed, governed, regulated, developed, and improved.', icon: Scale, color: '#ffd166' },
  { id: 15, name: 'Deep Computing & Data Mastery', desc: 'Solving the hardest computational problems using advanced algorithms, math, and high-performance systems.', icon: Cpu, color: '#7df9c1' },
  { id: 16, name: 'Social Engineering & Behavioral Design', desc: 'Understanding and engineering collective behavior, social dynamics, and mass psychology.', icon: Brain, color: '#ff9f7a' },
  { id: 17, name: 'Planetary Health & Resilient Futures', desc: 'Climate science, sustainability, ecological systems, and environmental stewardship.', icon: Globe, color: '#7dc9ff' },
  { id: 18, name: 'Space Exploration & Cosmological Engineering', desc: 'Space systems, astrophysics, orbital mechanics, and interplanetary civilization.', icon: Rocket, color: '#ffb366' },
  { id: 19, name: 'Civilization Building & Strategic Design', desc: 'Long-term thinking, institutional design, and building systems that last millennia.', icon: Scroll, color: '#d4a5ff' },
  { id: 20, name: 'Mythic Mastery & Esoteric Systems', desc: 'Archetypal intelligence, symbolic systems, mythological frameworks, and transcendent knowledge.', icon: Eye, color: '#66ffcc' },
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
          setTimeout(() => setIsLoading(false), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[1200] flex flex-col items-center justify-center gap-8 bg-black">
        <svg viewBox="0 0 220 220" className="h-28 w-28">
          <path 
            d="M110 18 L136 78 L202 86 L150 128 L165 196 L110 160 L55 196 L70 128 L18 86 L84 78 Z" 
            fill="transparent" 
            stroke="#c9a84c" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{
              strokeDasharray: '400',
              strokeDashoffset: 400 - (loadingProgress / 100) * 400,
              transition: 'stroke-dashoffset 0.1s ease'
            }}
          />
        </svg>
        <div className="h-2 w-64 overflow-hidden rounded-full border border-[#c9a84c]/40 bg-black/40">
          <div 
            className="h-full bg-gradient-to-r from-[#7f6426] via-[#c9a84c] to-[#f6dc93] transition-all duration-100"
            style={{ width: `${Math.min(loadingProgress, 100)}%` }}
          />
        </div>
        <p className="font-serif text-lg tracking-wide text-[#d7b97a]">Initializing the Codex...</p>
      </div>
    )
  }

  return (
    <div className={`relative flex min-h-screen ${isDark ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 animated-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      
      {/* Noise overlay for depth */}
      <div className="fixed inset-0 z-[1] noise-overlay pointer-events-none" />

      {/* Mobile Header */}
      <header className="glass fixed left-0 right-0 top-0 z-[1000] flex h-14 items-center justify-between border-b border-white/10 px-4 md:hidden">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="glass-button rounded-lg p-2.5 text-white/80 hover:text-white"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <a className="font-mono text-sm tracking-[0.24em] text-[#c9a84c]" href="#/">
          CODEX
        </a>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="glass-button rounded-lg p-2.5 text-white/80 hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`glass-strong fixed inset-y-0 left-0 z-[999] w-[290px] border-r border-white/10 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <a className="font-mono text-sm tracking-[0.28em] text-[#c9a84c]" href="#/">
              OMNIVERSAL CODEX
            </a>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="glass-button rounded-lg p-2 text-white/80 hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="mt-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="mb-3 px-2 pt-4 text-xs uppercase tracking-[0.2em] text-white/50">
              Navigation
            </div>
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all duration-300 ${
                    item.active
                      ? 'border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#c9a84c]'
                      : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            {/* Domains List */}
            <div className="mt-6 mb-3 px-2 text-xs uppercase tracking-[0.2em] text-white/50">
              Domains
            </div>
            <div className="space-y-1 pb-8">
              {domains.slice(0, 10).map((domain) => (
                <a
                  key={domain.id}
                  href={`#/domain/${domain.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  <domain.icon className="h-4 w-4" style={{ color: domain.color }} />
                  <span className="truncate">{domain.id}. {domain.name}</span>
                </a>
              ))}
              <button className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-[#c9a84c] transition-all duration-200 hover:bg-white/10">
                <ChevronRight className="h-4 w-4" />
                <span>View all 20 domains...</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-4 py-3 text-[11px] text-white/40">
            CODEX v2.0 | 2898 Subjects | 20 Domains
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto pt-14 md:ml-[290px] md:pt-0">
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8 md:py-12">
          
          {/* Hero Section */}
          <section className="mb-8 rounded-2xl glass-card p-6 md:p-8">
            <h1 className="hero-shimmer text-3xl font-bold tracking-wide md:text-5xl lg:text-6xl">
              Omniversal Mastery of Codex
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-white/60 md:text-base leading-relaxed">
              Navigate your 20-domain mastery architecture. Use keyboard shortcuts:{' '}
              <span className="font-mono text-[#c9a84c]">1-0</span> jump to cards,
              <span className="font-mono text-[#c9a84c]"> / </span> focus search, 
              <span className="font-mono text-[#c9a84c]"> Esc</span> clear.
            </p>
            
            {/* Search */}
            <div className="mt-6 relative max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search domain, subdomain, concept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40"
              />
            </div>
          </section>

          {/* Today's Focus */}
          <section className="mb-8 rounded-2xl glass-card p-6 border-[#c9a84c]/30 hover:border-[#c9a84c]/50">
            <div className="mb-3 flex items-center gap-2 text-[#e4ca87]">
              <Target className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Today&apos;s Focus</h2>
            </div>
            <p className="mb-2 text-sm text-white/80">
              Lowest completion domain: <span className="font-semibold text-[#e4ca87]">Physical Mastery & Combat Systems</span> (0.0%)
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-white/60">
              <li>Kinetic chain optimization</li>
              <li>Eccentric training</li>
              <li>Torque mechanics</li>
            </ul>
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#c9a84c]/60 bg-[#c9a84c]/10 px-5 py-2.5 text-sm text-[#e4ca87] transition-all duration-300 hover:bg-[#c9a84c]/20 hover:scale-[1.02]">
              Begin Study
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>

          {/* Domains Grid */}
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white md:text-2xl">Domains</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                {filteredDomains.length} visible
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDomains.map((domain) => (
                <article
                  key={domain.id}
                  className="glass-card overflow-hidden cursor-pointer group"
                >
                  <div className="flex w-full items-start gap-4 p-5">
                    {/* Icon */}
                    <div 
                      className="rounded-xl border p-2.5 transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        borderColor: `${domain.color}66`,
                        color: domain.color,
                        backgroundColor: `${domain.color}15`
                      }}
                    >
                      <domain.icon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-white group-hover:text-white/90">
                        {domain.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-white/50 leading-relaxed">
                        {domain.desc}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.random() * 30}%`,
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

          {/* Stats Section */}
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Total Subjects', value: '2,898', icon: BookOpenText },
              { label: 'Active Domains', value: '20', icon: Compass },
              { label: 'Mastery Paths', value: '156', icon: Map },
              { label: 'Hours Logged', value: '0', icon: BarChart3 },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-[#c9a84c]" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-[1000] glass-button rounded-full p-2 text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
