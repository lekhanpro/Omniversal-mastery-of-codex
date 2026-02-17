import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Calendar, Award, Zap, BookOpen } from 'lucide-react';

interface ProgressData {
  domain: number;
  mastery: number;
  timeSpent: number;
  notesCount: number;
  quizScore: number;
  lastActive: number;
}

const Observatory: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

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
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const notes = JSON.parse(localStorage.getItem('grimoire_notes') || '[]');
    const arenaStreak = parseInt(localStorage.getItem('arena_best_streak') || '0');
    
    const data: ProgressData[] = domainNames.map(domain => {
      const domainNotes = notes.filter((n: any) => n.domain === domain.id);
      const mastery = Math.min(100, (domainNotes.length * 10) + (arenaStreak * 5));
      
      return {
        domain: domain.id,
        mastery,
        timeSpent: Math.floor(Math.random() * 120) + 30,
        notesCount: domainNotes.length,
        quizScore: 75 + Math.floor(Math.random() * 25),
        lastActive: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      };
    });

    setProgressData(data);
  };

  const getTotalStats = () => {
    return {
      totalMastery: Math.round(progressData.reduce((sum, d) => sum + d.mastery, 0) / progressData.length),
      totalTime: progressData.reduce((sum, d) => sum + d.timeSpent, 0),
      totalNotes: progressData.reduce((sum, d) => sum + d.notesCount, 0),
      avgQuizScore: Math.round(progressData.reduce((sum, d) => sum + d.quizScore, 0) / progressData.length)
    };
  };

  const stats = getTotalStats();
  const selected = selectedDomain ? progressData.find(d => d.domain === selectedDomain) : null;

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
              <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                📡 OBSERVATORY
              </h1>
              <p className="text-gray-400 text-sm mt-1">Track your progress across all domains</p>
            </div>
          </div>

          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  timeRange === range
                    ? 'bg-neon-blue text-black'
                    : 'bg-dark-card border border-dark-border hover:border-neon-blue'
                }`}
              >
                {range === 'week' ? '7D' : range === 'month' ? '30D' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-neon-blue" />
              <span className="text-xs text-gray-500">OVERALL</span>
            </div>
            <div className="text-3xl font-bold text-neon-blue mb-1">{stats.totalMastery}%</div>
            <div className="text-sm text-gray-400">Average Mastery</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-green-500" />
              <span className="text-xs text-gray-500">TIME</span>
            </div>
            <div className="text-3xl font-bold text-green-500 mb-1">{stats.totalTime}h</div>
            <div className="text-sm text-gray-400">Total Study Time</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <span className="text-xs text-gray-500">NOTES</span>
            </div>
            <div className="text-3xl font-bold text-purple-500 mb-1">{stats.totalNotes}</div>
            <div className="text-sm text-gray-400">Notes Created</div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-gold" />
              <span className="text-xs text-gray-500">QUIZ</span>
            </div>
            <div className="text-3xl font-bold text-gold mb-1">{stats.avgQuizScore}%</div>
            <div className="text-sm text-gray-400">Avg Quiz Score</div>
          </div>
        </div>

        {/* Domain Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-neon-blue">Domain Mastery</h2>
            <div className="space-y-4">
              {progressData.map(data => {
                const domain = domainNames.find(d => d.id === data.domain)!;
                return (
                  <div
                    key={data.domain}
                    onClick={() => setSelectedDomain(data.domain)}
                    className="cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{domain.icon}</span>
                        <span className="font-medium">{domain.name}</span>
                      </div>
                      <span className="font-mono text-sm" style={{ color: domain.color }}>
                        {data.mastery}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${data.mastery}%`,
                          backgroundColor: domain.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-neon-blue">
              {selected ? domainNames.find(d => d.id === selectedDomain)?.name : 'Select a Domain'}
            </h2>
            
            {selected ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Mastery Level</div>
                    <div className="text-2xl font-bold text-neon-blue">{selected.mastery}%</div>
                  </div>
                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Time Spent</div>
                    <div className="text-2xl font-bold text-green-500">{selected.timeSpent}h</div>
                  </div>
                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Notes</div>
                    <div className="text-2xl font-bold text-purple-500">{selected.notesCount}</div>
                  </div>
                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Quiz Score</div>
                    <div className="text-2xl font-bold text-gold">{selected.quizScore}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">Last Active</div>
                  <div className="text-sm text-gray-300">
                    {new Date(selected.lastActive).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/domain/${selectedDomain}`}
                    className="flex-1 px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-all text-center font-mono text-sm"
                  >
                    Study Domain
                  </Link>
                  <Link
                    to="/arena"
                    className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-blue transition-all text-center font-mono text-sm"
                  >
                    Take Quiz
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Click on a domain to see detailed progress</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/arena"
            className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 rounded-xl p-6 hover:border-red-500 transition-all group"
          >
            <Zap className="w-8 h-8 text-red-500 mb-3" />
            <h3 className="text-lg font-bold mb-2 group-hover:text-red-500 transition-colors">Test Your Knowledge</h3>
            <p className="text-sm text-gray-400">Take a quiz to improve your mastery</p>
          </Link>

          <Link
            to="/grimoire"
            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all group"
          >
            <BookOpen className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-bold mb-2 group-hover:text-purple-500 transition-colors">Create Notes</h3>
            <p className="text-sm text-gray-400">Document your learning journey</p>
          </Link>

          <Link
            to="/oracle"
            className="bg-gradient-to-r from-gold/20 to-yellow-500/20 border border-gold/30 rounded-xl p-6 hover:border-gold transition-all group"
          >
            <span className="text-4xl mb-3 block">🔮</span>
            <h3 className="text-lg font-bold mb-2 group-hover:text-gold transition-colors">Ask the Oracle</h3>
            <p className="text-sm text-gray-400">Get AI-powered guidance</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Observatory;
