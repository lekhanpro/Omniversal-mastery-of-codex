import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle, Calendar, Target } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  domain: number;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  domains: number[];
  milestones: Milestone[];
  progress: number;
  created: number;
}

const Cartography: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [showNewPath, setShowNewPath] = useState(false);
  const [newPathName, setNewPathName] = useState('');
  const [newPathDesc, setNewPathDesc] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<number[]>([]);

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

  useEffect(() => {
    const saved = localStorage.getItem('cartography_paths');
    if (saved) {
      setPaths(JSON.parse(saved));
    } else {
      const defaultPaths: LearningPath[] = [
        {
          id: '1',
          name: 'AI Mastery Track',
          description: 'Complete path to AI/ML expertise',
          domains: [2, 3, 4],
          milestones: [
            { id: 'm1', title: 'Learn Python basics', domain: 3, completed: false, dueDate: '2026-03-01', priority: 'high' },
            { id: 'm2', title: 'Study neural networks', domain: 3, completed: false, dueDate: '2026-03-15', priority: 'high' },
            { id: 'm3', title: 'Build first ML model', domain: 3, completed: false, dueDate: '2026-04-01', priority: 'medium' }
          ],
          progress: 0,
          created: Date.now()
        }
      ];
      setPaths(defaultPaths);
      localStorage.setItem('cartography_paths', JSON.stringify(defaultPaths));
    }
  }, []);

  const savePaths = (updated: LearningPath[]) => {
    setPaths(updated);
    localStorage.setItem('cartography_paths', JSON.stringify(updated));
  };

  const createPath = () => {
    if (!newPathName.trim()) return;

    const newPath: LearningPath = {
      id: Date.now().toString(),
      name: newPathName,
      description: newPathDesc,
      domains: selectedDomains,
      milestones: [],
      progress: 0,
      created: Date.now()
    };

    savePaths([newPath, ...paths]);
    setShowNewPath(false);
    setNewPathName('');
    setNewPathDesc('');
    setSelectedDomains([]);
    setSelectedPath(newPath);
  };

  const deletePath = (id: string) => {
    if (confirm('Delete this learning path?')) {
      savePaths(paths.filter(p => p.id !== id));
      if (selectedPath?.id === id) setSelectedPath(null);
    }
  };

  const toggleMilestone = (pathId: string, milestoneId: string) => {
    const updated = paths.map(path => {
      if (path.id === pathId) {
        const milestones = path.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const progress = Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100) || 0;
        return { ...path, milestones, progress };
      }
      return path;
    });
    savePaths(updated);
    if (selectedPath?.id === pathId) {
      setSelectedPath(updated.find(p => p.id === pathId) || null);
    }
  };

  const addMilestone = (pathId: string) => {
    const title = prompt('Milestone title:');
    if (!title) return;

    const updated = paths.map(path => {
      if (path.id === pathId) {
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          title,
          domain: path.domains[0] || 1,
          completed: false,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium'
        };
        return { ...path, milestones: [...path.milestones, newMilestone] };
      }
      return path;
    });
    savePaths(updated);
    if (selectedPath?.id === pathId) {
      setSelectedPath(updated.find(p => p.id === pathId) || null);
    }
  };

  const deleteMilestone = (pathId: string, milestoneId: string) => {
    const updated = paths.map(path => {
      if (path.id === pathId) {
        const milestones = path.milestones.filter(m => m.id !== milestoneId);
        const progress = milestones.length > 0
          ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
          : 0;
        return { ...path, milestones, progress };
      }
      return path;
    });
    savePaths(updated);
    if (selectedPath?.id === pathId) {
      setSelectedPath(updated.find(p => p.id === pathId) || null);
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
              <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                🗺️ CARTOGRAPHY
              </h1>
              <p className="text-gray-400 text-sm mt-1">Map your learning journey</p>
            </div>
          </div>

          <button
            onClick={() => setShowNewPath(true)}
            className="px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-all font-mono flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Path
          </button>
        </div>

        {showNewPath && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Create Learning Path</h3>
              
              <input
                type="text"
                value={newPathName}
                onChange={(e) => setNewPathName(e.target.value)}
                placeholder="Path name..."
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg mb-3 focus:outline-none focus:border-neon-blue"
              />

              <textarea
                value={newPathDesc}
                onChange={(e) => setNewPathDesc(e.target.value)}
                placeholder="Description..."
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg mb-3 focus:outline-none focus:border-neon-blue resize-none"
                rows={3}
              />

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Select domains:</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {domainNames.map(domain => (
                    <button
                      key={domain.id}
                      onClick={() => {
                        setSelectedDomains(prev =>
                          prev.includes(domain.id)
                            ? prev.filter(id => id !== domain.id)
                            : [...prev, domain.id]
                        );
                      }}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        selectedDomains.includes(domain.id)
                          ? 'bg-neon-blue text-black'
                          : 'bg-dark-bg border border-dark-border hover:border-neon-blue'
                      }`}
                    >
                      {domain.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewPath(false)}
                  className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createPath}
                  className="flex-1 px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-all font-bold"
                >
                  Create Path
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paths List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Your Paths</h2>
            <div className="space-y-3">
              {paths.map(path => (
                <div
                  key={path.id}
                  onClick={() => setSelectedPath(path)}
                  className={`bg-dark-card/60 backdrop-blur-md border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedPath?.id === path.id
                      ? 'border-neon-blue'
                      : 'border-dark-border hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{path.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePath(path.id);
                      }}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{path.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    {path.domains.map(domainId => {
                      const domain = domainNames.find(d => d.id === domainId);
                      return domain ? <span key={domainId} className="text-lg">{domain.icon}</span> : null;
                    })}
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div
                      className="bg-neon-blue h-2 rounded-full transition-all"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{path.progress}% complete</div>
                </div>
              ))}
            </div>
          </div>

          {/* Path Details */}
          <div className="lg:col-span-2">
            {selectedPath ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedPath.name}</h2>
                  <button
                    onClick={() => addMilestone(selectedPath.id)}
                    className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg hover:border-neon-blue transition-all text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </button>
                </div>

                <div className="bg-dark-card/60 backdrop-blur-md border border-dark-border rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-neon-blue" />
                      <span className="text-lg font-bold">Progress</span>
                    </div>
                    <span className="text-2xl font-bold text-neon-blue">{selectedPath.progress}%</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-neon-blue to-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${selectedPath.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPath.milestones.map(milestone => {
                    const domain = domainNames.find(d => d.id === milestone.domain);
                    const isOverdue = new Date(milestone.dueDate) < new Date() && !milestone.completed;
                    
                    return (
                      <div
                        key={milestone.id}
                        className={`bg-dark-card/60 backdrop-blur-md border rounded-xl p-4 transition-all ${
                          milestone.completed
                            ? 'border-green-500/30'
                            : isOverdue
                            ? 'border-red-500/30'
                            : 'border-dark-border'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleMilestone(selectedPath.id, milestone.id)}
                            className="mt-1"
                          >
                            {milestone.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-500" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                                {milestone.title}
                              </span>
                              {domain && <span className="text-sm">{domain.icon}</span>}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span className={isOverdue ? 'text-red-500' : ''}>
                                  {new Date(milestone.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded ${
                                milestone.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                                milestone.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-blue-500/20 text-blue-500'
                              }`}>
                                {milestone.priority}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteMilestone(selectedPath.id, milestone.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedPath.milestones.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No milestones yet. Add your first milestone to get started!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <p>Select a learning path or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartography;
