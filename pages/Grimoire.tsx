import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Download, Upload, BookOpen, Lightbulb, Tag, ChevronRight, ChevronDown } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  domain: number;
  tags: string[];
  created: number;
  modified: number;
}

const Grimoire: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  const [editMode, setEditMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

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

  const templates = [
    {
      name: "Concept Note",
      content: "# Concept: [Name]\n\n## Definition\n[Clear definition]\n\n## Key Principles\n- Principle 1\n- Principle 2\n\n## Applications\n[Real-world applications]\n\n## Connections\n[Links to other concepts]\n\n## Questions\n[Open questions to explore]"
    },
    {
      name: "Learning Log",
      content: "# Learning Log - [Date]\n\n## What I Learned\n[Key insights]\n\n## Challenges\n[Difficulties encountered]\n\n## Breakthroughs\n[Aha moments]\n\n## Next Steps\n[What to study next]"
    },
    {
      name: "Problem Solution",
      content: "# Problem: [Title]\n\n## Problem Statement\n[Describe the problem]\n\n## Analysis\n[Break down the problem]\n\n## Solution Approach\n[Your solution]\n\n## Implementation\n[Code/steps]\n\n## Results\n[Outcome and learnings]"
    },
    {
      name: "Book Notes",
      content: "# Book: [Title]\n**Author:** [Name]\n**Domain:** [Domain]\n\n## Key Ideas\n1. [Idea 1]\n2. [Idea 2]\n\n## Quotes\n> [Quote 1]\n\n## My Thoughts\n[Personal reflections]\n\n## Action Items\n- [ ] [Action 1]"
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('grimoire_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('grimoire_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = (template?: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: template || '',
      domain: selectedDomain || 1,
      tags: [],
      created: Date.now(),
      modified: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditMode(true);
    setShowTemplates(false);
  };

  const updateNote = (updates: Partial<Note>) => {
    if (!selectedNote) return;
    
    const updated = {
      ...selectedNote,
      ...updates,
      modified: Date.now()
    };
    
    setSelectedNote(updated);
    setNotes(notes.map(n => n.id === updated.id ? updated : n));
  };

  const deleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  };

  const toggleDomain = (domainId: number) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grimoire-export-${Date.now()}.json`;
    a.click();
  };

  const importNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setNotes([...imported, ...notes]);
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === null || note.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const notesByDomain = domainNames.map(domain => ({
    ...domain,
    notes: filteredNotes.filter(n => n.domain === domain.id)
  }));

  const extractKeywords = (content: string): string[] => {
    const words = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    return [...new Set(words)].slice(0, 10);
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Left Panel - Domain Tree */}
      <div className="w-64 bg-dark-card/90 backdrop-blur-xl border-r border-dark-border flex flex-col">
        <div className="p-4 border-b border-dark-border">
          <Link to="/" className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-mono text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-gold" />
            <h2 className="font-bold font-mono text-gold">THE GRIMOIRE</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {notesByDomain.map(domain => (
            <div key={domain.id} className="mb-1">
              <button
                onClick={() => toggleDomain(domain.id)}
                className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  {expandedDomains.has(domain.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>{domain.icon}</span>
                  <span className="text-gray-300">{domain.name}</span>
                </div>
                <span className="text-xs text-gray-500">{domain.notes.length}</span>
              </button>
              
              {expandedDomains.has(domain.id) && (
                <div className="ml-6 space-y-1">
                  {domain.notes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note);
                        setEditMode(false);
                      }}
                      className={`w-full p-2 rounded text-left text-xs transition-all ${
                        selectedNote?.id === note.id
                          ? 'bg-neon-blue/10 text-neon-blue border-l-2 border-neon-blue'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="truncate">{note.title}</div>
                      <div className="text-[10px] text-gray-600 mt-1">
                        {new Date(note.modified).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-dark-border space-y-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full p-2 bg-neon-blue/10 border border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-all text-sm font-mono flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={exportNotes}
              className="flex-1 p-2 bg-dark-bg border border-dark-border rounded text-xs hover:border-neon-blue transition-all"
            >
              <Download className="w-3 h-3 mx-auto" />
            </button>
            <label className="flex-1 p-2 bg-dark-bg border border-dark-border rounded text-xs hover:border-neon-blue transition-all cursor-pointer">
              <Upload className="w-3 h-3 mx-auto" />
              <input type="file" accept=".json" onChange={importNotes} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Center Panel - Editor */}
      <div className="flex-1 flex flex-col">
        {showTemplates && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4 text-gold">Choose Template</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => createNote()}
                  className="p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-blue transition-all text-left"
                >
                  <div className="font-bold mb-1">Blank Note</div>
                  <div className="text-xs text-gray-500">Start from scratch</div>
                </button>
                {templates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => createNote(template.content)}
                    className="p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-blue transition-all text-left"
                  >
                    <div className="font-bold mb-1">{template.name}</div>
                    <div className="text-xs text-gray-500">Structured template</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className="w-full p-2 bg-dark-bg border border-dark-border rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedNote ? (
          <>
            <div className="p-4 border-b border-dark-border bg-dark-card/50 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateNote({ title: e.target.value })}
                  className="text-2xl font-bold bg-transparent border-none outline-none text-white flex-1"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-3 py-1 rounded text-sm font-mono transition-all ${
                      editMode ? 'bg-neon-blue text-black' : 'bg-dark-bg border border-dark-border'
                    }`}
                  >
                    {editMode ? 'Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 bg-red-500/10 border border-red-500 text-red-500 rounded hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editMode && (
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => applyFormatting('bold')} className="p-2 bg-dark-bg border border-dark-border rounded hover:border-neon-blue text-xs font-bold">B</button>
                  <button onClick={() => applyFormatting('italic')} className="p-2 bg-dark-bg border border-dark-border rounded hover:border-neon-blue text-xs italic">I</button>
                  <button onClick={() => applyFormatting('underline')} className="p-2 bg-dark-bg border border-dark-border rounded hover:border-neon-blue text-xs underline">U</button>
                  <div className="w-px h-6 bg-dark-border" />
                  <button onClick={() => applyFormatting('insertUnorderedList')} className="p-2 bg-dark-bg border border-dark-border rounded hover:border-neon-blue text-xs">• List</button>
                  <button onClick={() => applyFormatting('insertOrderedList')} className="p-2 bg-dark-bg border border-dark-border rounded hover:border-neon-blue text-xs">1. List</button>
                  <div className="w-px h-6 bg-dark-border" />
                  <select
                    onChange={(e) => {
                      const domain = parseInt(e.target.value);
                      updateNote({ domain });
                    }}
                    value={selectedNote.domain}
                    className="px-3 py-1 bg-dark-bg border border-dark-border rounded text-xs focus:outline-none focus:border-neon-blue"
                  >
                    {domainNames.map(d => (
                      <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Modified: {new Date(selectedNote.modified).toLocaleString()}</span>
                <span>•</span>
                <span>{countWords(selectedNote.content)} words</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {editMode ? (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => updateNote({ content: e.currentTarget.textContent || '' })}
                  className="min-h-full bg-dark-bg/30 rounded-lg p-6 outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedNote.content.replace(/\n/g, '<br>') }}
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-mono">Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Intelligence */}
      <div className="w-64 bg-dark-card/90 backdrop-blur-xl border-l border-dark-border flex flex-col">
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-bold font-mono text-gold uppercase">Intelligence</h3>
          </div>
        </div>

        {selectedNote ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Words:</span>
                  <span className="text-neon-blue font-mono">{countWords(selectedNote.content)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Characters:</span>
                  <span className="text-neon-blue font-mono">{selectedNote.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lines:</span>
                  <span className="text-neon-blue font-mono">{selectedNote.content.split('\n').length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {extractKeywords(selectedNote.content).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gold/10 border border-gold/30 text-gold rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <Tag className="w-3 h-3" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedNote.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => updateNote({ tags: selectedNote.tags.filter((_, i) => i !== idx) })}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    updateNote({ tags: [...selectedNote.tags, e.currentTarget.value.trim()] });
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-xs focus:outline-none focus:border-neon-blue"
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Related Notes</h4>
              <div className="space-y-1">
                {notes
                  .filter(n => n.id !== selectedNote.id && n.domain === selectedNote.domain)
                  .slice(0, 5)
                  .map(note => (
                    <button
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className="w-full p-2 bg-dark-bg border border-dark-border rounded text-xs text-left hover:border-neon-blue transition-all truncate"
                    >
                      {note.title}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const flashcard = `Q: [Question]\nA: ${selectedNote.content.slice(0, 100)}...`;
                    navigator.clipboard.writeText(flashcard);
                    alert('Flashcard copied to clipboard!');
                  }}
                  className="w-full p-2 bg-dark-bg border border-dark-border rounded text-xs hover:border-neon-blue transition-all"
                >
                  Create Flashcard
                </button>
                <button
                  onClick={() => {
                    const markdown = `# ${selectedNote.title}\n\n${selectedNote.content}`;
                    const blob = new Blob([markdown], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedNote.title}.md`;
                    a.click();
                  }}
                  className="w-full p-2 bg-dark-bg border border-dark-border rounded text-xs hover:border-neon-blue transition-all"
                >
                  Export as Markdown
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-xs text-gray-500 text-center">
              Select a note to see intelligence insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grimoire;
