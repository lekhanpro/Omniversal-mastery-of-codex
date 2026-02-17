import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BookOpen, Zap, Target, Calendar, Award, Flame } from 'lucide-react';

interface DashboardData {
  totalNotes: number;
  arenaStreak: number;
  oracleSessions: number;
  forgeStreak: number;
  learningPaths: number;
  totalMastery: number;
  recentActivity: Activity[];
  domainProgress: DomainProgress[];
}

interface Activity {
  type: 'note' | 'quiz' | 'chat' | 'drill' | 'milestone';
  title: string;
  timestamp: number;
  domain?: number;
}

interface DomainProgress {
  domain: number;
  notes: number;
  quizzes: number;
  mastery: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    totalNotes: 0,
    arenaStreak: 0,
    oracleSessions: 0,
    forgeStreak: 0,
    learningPaths: 0,
    totalMastery: 0,
    recentActivity: [],
    domainProgress: []
  });

  const domainNames = [
    { id: 1, name: "Physical Mastery", icon: "⚔️", color: "#4488ff" },
    { id: 2, name: "Mind & Cognition", icon: "🧠", color: "#00ffcc" },
    { id: 3, name: "AI & ML", icon: "🤖", color: "#aa44ff" },
    { id: 4, name: "Physics", icon: "⚛️", color: "#ff6644" },
    { id: 5, name: "Philosophy", icon: "🏛️", color: "#ffcc44" },
    { id: 6, name: "Economics", icon: "💰", color: "#44ff88" },
    { id: 7, name: "Language", icon: "📚", color: "#ff44aa" },
    { id: 8, name: "Biology", icon: "🧬", color: "#88ff44" },
    { id: 9, name: "Cybersecurity", icon: "🔒", color: "#ff8844" },
    { id: 10, name: "Future Intelligence", icon: "🔮", color: "#44aaff" }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load from all localStorage sources
    const notes = JSON.parse(localStorage.getItem('grimoire_notes') || '[]');
    const arenaStreak = parseInt(localStorage.getItem('arena_best_streak') || '0');
    const oracleSessions = JSON.parse(localStorage.getItem('oracle_sessions') || '[]');
    const forgeStreak = parseInt(localStorage.getItem('forge_daily_streak') || '0');
    const paths = JSON.parse(localStorage.getItem('cartography_paths') || '[]');

    // Calculate domain progress
    const domainProgress: DomainProgress[] = domainNames.map(domain => {
      const domainNotes = notes.filter((n: any) => n.domain === domain.id);
      const mastery = Math.min(100, (domainNotes.length * 10) + (arenaStreak * 5));
      
      return {
        domain: domain.id,
        notes: domainNotes.length,
        quizzes: Math.floor(Math.random() * 10),
        mastery
      };
    });

    // Generate recent activity
    const recentActivity: Activity[] = [
      ...notes.slice(0, 3).map((n: any) => ({
        type: 'note' as const,
        title: n.title,
        timestamp: n.modified,
        domain: n.domain
      })),
      ...oracleSessions.slice(0, 2).map((s: any) => ({
        type: 'chat' as const,
        title: s.title,
        timestamp: s.timestamp,
        domain: s.domain
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    const totalMastery = Math.round(
      domainProgress.reduce((sum, d) => sum + d.mastery, 0) / domainProgress.length
    );

    setData({
      totalNotes: notes.length,
      arenaStreak,
      oracleSessions: oracleSessions.length,
      forgeStreak,
      learningPaths: paths.length,
      totalMastery,
      recentActivity,
      domainProgress
    });
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'note': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <Zap className="w-4 h-4" />;
      case 'chat': return <span className="text-sm">🔮</span>;
      case 'drill': return <Target className="w-4 h-4" />;
      case 'milestone': return <Award className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'note': return 'text-purple-500';
      case 'quiz': return 'text-red-500';
      case 'chat': return 'text-gold';
      case 'drill': return 'text-orange-500';
      case 'milestone': return 'text-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-mono text-sm">Back</span>
            </Link>
            <div>
              <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">
                📊 DASHBOARD
              </h1>
              <p className="text-gray-400 text-sm mt-1">Your learning command center</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-neon-blue" />
            </div>
            <div className="text-2xl font-bold text-neon-blue mb-1">{data.totalMastery}%</div>
            <div className="text-xs text-gray-400">Mastery</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-500 mb-1">{data.totalNotes}</div>
            <div className="text-xs text-gray-400">Notes</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-500 mb-1">{data.arenaStreak}</div>
            <div className="text-xs text-gray-400">Arena</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🔮</span>
            </div>
            <div className="text-2xl font-bold text-gold mb-1">{data.oracleSessions}</div>
            <div className="text-xs text-gray-400">Sessions</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500 mb-1">{data.forgeStreak}</div>
            <div className="text-xs text-gray-400">Forge</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🗺️</span>
            </div>
            <div className="text-2xl font-bold text-green-500 mb-1">{data.learningPaths}</div>
            <div className="text-xs text-gray-400">Paths</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Domain Progress */}
          <div className="lg:col-span-2 bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
              Domain Progress
            </h2>
            <div className="space-y-4">
              {data.domainProgress.map(progress => {
                const domain = domainNames.find(d => d.id === progress.domain)!;
                return (
                  <div key={progress.domain}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{domain.icon}</span>
                        <span className="text-sm font-medium">{domain.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{progress.notes} notes</span>
                        <span className="font-mono" style={{ color: domain.color }}>
                          {progress.mastery}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${progress.mastery}%`,
                          backgroundColor: domain.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neon-blue" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-dark-bg/50 rounded-lg hover:bg-dark-bg transition-all"
                  >
                    <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{activity.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    {activity.domain && (
                      <span className="text-sm">
                        {domainNames.find(d => d.id === activity.domain)?.icon}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No recent activity yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/knowledge-map"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-neon-blue transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">🗺️</span>
            <div className="text-sm font-mono group-hover:text-neon-blue transition-colors">Knowledge Map</div>
          </Link>

          <Link
            to="/oracle"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-gold transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">🔮</span>
            <div className="text-sm font-mono group-hover:text-gold transition-colors">Oracle</div>
          </Link>

          <Link
            to="/arena"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-red-500 transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">⚔️</span>
            <div className="text-sm font-mono group-hover:text-red-500 transition-colors">Arena</div>
          </Link>

          <Link
            to="/grimoire"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-purple-500 transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">📖</span>
            <div className="text-sm font-mono group-hover:text-purple-500 transition-colors">Grimoire</div>
          </Link>

          <Link
            to="/observatory"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-blue-500 transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">📡</span>
            <div className="text-sm font-mono group-hover:text-blue-500 transition-colors">Observatory</div>
          </Link>

          <Link
            to="/forge"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-orange-500 transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">⚒️</span>
            <div className="text-sm font-mono group-hover:text-orange-500 transition-colors">Forge</div>
          </Link>

          <Link
            to="/cartography"
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-green-500 transition-all group text-center"
          >
            <span className="text-3xl mb-2 block">🗺️</span>
            <div className="text-sm font-mono group-hover:text-green-500 transition-colors">Cartography</div>
          </Link>

          <button
            onClick={loadDashboardData}
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 hover:border-neon-blue transition-all group text-center"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-neon-blue" />
            <div className="text-sm font-mono group-hover:text-neon-blue transition-colors">Refresh</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
