import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, Target, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Drill {
  id: string;
  domain: number;
  title: string;
  description: string;
  type: 'flashcard' | 'practice' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  streak: number;
}

const Forge: React.FC = () => {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);

  const domainNames = [
    { id: 1, name: "Physical Mastery", icon: "⚔️" },
    { id: 2, name: "Mind & Cognition", icon: "🧠" },
    { id: 3, name: "AI & ML", icon: "🤖" },
    { id: 4, name: "Physics", icon: "⚛️" },
    { id: 5, name: "Philosophy", icon: "🏛️" },
    { id: 6, name: "Economics", icon: "💰" },
    { id: 7, name: "Language", icon: "📚" },
    { id: 8, name: "Biology", icon: "🧬" },
    { id: 9, name: "Cybersecurity", icon: "🔒" },
    { id: 10, name: "Future Intelligence", icon: "🔮" }
  ];

  const flashcards = [
    { q: "What is neuroplasticity?", a: "The brain's ability to form new neural connections and reorganize itself throughout life." },
    { q: "Define overfitting in ML", a: "When a model learns training data too well, including noise, reducing generalization to new data." },
    { q: "What is entropy?", a: "A measure of disorder or randomness in a system; in thermodynamics, unavailable energy." },
    { q: "Explain the Socratic method", a: "Teaching through asking questions to stimulate critical thinking and illuminate ideas." },
    { q: "What is opportunity cost?", a: "The value of the next best alternative foregone when making a decision." }
  ];

  useEffect(() => {
    loadDrills();
    const streak = parseInt(localStorage.getItem('forge_daily_streak') || '0');
    setDailyStreak(streak);
  }, []);

  const loadDrills = () => {
    const saved = localStorage.getItem('forge_drills');
    if (saved) {
      setDrills(JSON.parse(saved));
    } else {
      const defaultDrills: Drill[] = domainNames.flatMap(domain => [
        {
          id: `${domain.id}-flashcard`,
          domain: domain.id,
          title: `${domain.name} Flashcards`,
          description: 'Quick review of key concepts',
          type: 'flashcard',
          difficulty: 'easy',
          completed: false,
          streak: 0
        },
        {
          id: `${domain.id}-practice`,
          domain: domain.id,
          title: `${domain.name} Practice`,
          description: 'Hands-on exercises and problems',
          type: 'practice',
          difficulty: 'medium',
          completed: false,
          streak: 0
        },
        {
          id: `${domain.id}-challenge`,
          domain: domain.id,
          title: `${domain.name} Challenge`,
          description: 'Advanced mastery test',
          type: 'challenge',
          difficulty: 'hard',
          completed: false,
          streak: 0
        }
      ]);
      setDrills(defaultDrills);
      localStorage.setItem('forge_drills', JSON.stringify(defaultDrills));
    }
  };

  const startDrill = (drill: Drill) => {
    setActiveDrill(drill);
    setCurrentCard(0);
    setShowAnswer(false);
  };

  const completeDrill = (success: boolean) => {
    if (!activeDrill) return;

    const updated = drills.map(d => {
      if (d.id === activeDrill.id) {
        return {
          ...d,
          completed: success,
          streak: success ? d.streak + 1 : 0
        };
      }
      return d;
    });

    setDrills(updated);
    localStorage.setItem('forge_drills', JSON.stringify(updated));

    if (success) {
      const newStreak = dailyStreak + 1;
      setDailyStreak(newStreak);
      localStorage.setItem('forge_daily_streak', newStreak.toString());
    }

    setActiveDrill(null);
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      completeDrill(true);
    }
  };

  const filteredDrills = selectedDomain
    ? drills.filter(d => d.domain === selectedDomain)
    : drills;

  if (activeDrill && activeDrill.type === 'flashcard') {
    const card = flashcards[currentCard];
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">
              Card {currentCard + 1} / {flashcards.length}
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 mb-4">
              <div
                className="bg-neon-blue h-2 rounded-full transition-all"
                style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-12 min-h-[400px] flex items-center justify-center cursor-pointer hover:border-neon-blue transition-all"
          >
            <div className="text-center">
              <div className="text-2xl font-bold mb-8">
                {showAnswer ? card.a : card.q}
              </div>
              <div className="text-sm text-gray-500">
                {showAnswer ? 'Click for next card' : 'Click to reveal answer'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveDrill(null)}
              className="flex-1 px-6 py-3 bg-dark-card border border-dark-border rounded-lg hover:border-red-500 hover:text-red-500 transition-all font-mono"
            >
              Quit
            </button>
            {showAnswer && (
              <button
                onClick={nextCard}
                className="flex-1 px-6 py-3 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-all font-mono font-bold"
              >
                {currentCard < flashcards.length - 1 ? 'Next Card' : 'Complete'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                ⚒️ THE FORGE
              </h1>
              <p className="text-gray-400 text-sm mt-1">Practice and master your skills</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-mono text-sm">Streak: <span className="text-orange-500">{dailyStreak}</span></span>
            </div>
          </div>
        </div>

        {/* Domain Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDomain(null)}
              className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                selectedDomain === null
                  ? 'bg-neon-blue text-black'
                  : 'bg-dark-card border border-dark-border hover:border-neon-blue'
              }`}
            >
              All Domains
            </button>
            {domainNames.map(domain => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                  selectedDomain === domain.id
                    ? 'bg-neon-blue text-black'
                    : 'bg-dark-card border border-dark-border hover:border-neon-blue'
                }`}
              >
                {domain.icon} {domain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Drills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrills.map(drill => {
            const domain = domainNames.find(d => d.id === drill.domain)!;
            const typeColors = {
              flashcard: 'blue',
              practice: 'green',
              challenge: 'red'
            };
            const color = typeColors[drill.type];

            return (
              <div
                key={drill.id}
                className={`bg-dark-card/60 backdrop-blur-md border border-${color}-500/30 rounded-xl p-6 hover:border-${color}-500 transition-all group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{domain.icon}</span>
                  {drill.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>

                <h3 className="text-lg font-bold mb-2">{drill.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{drill.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 uppercase">{drill.difficulty}</span>
                  </div>
                  {drill.streak > 0 && (
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-mono text-orange-500">{drill.streak}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => startDrill(drill)}
                  className={`w-full px-4 py-2 bg-${color}-500/10 border border-${color}-500 text-${color}-500 rounded-lg hover:bg-${color}-500/20 transition-all font-mono text-sm`}
                >
                  {drill.completed ? 'Practice Again' : 'Start Drill'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-sm text-gray-400">Completed</span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              {drills.filter(d => d.completed).length}
            </div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-400">In Progress</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">
              {drills.filter(d => !d.completed).length}
            </div>
          </div>

          <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-sm text-gray-400">Daily Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{dailyStreak}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forge;
