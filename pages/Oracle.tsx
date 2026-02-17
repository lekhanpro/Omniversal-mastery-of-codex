import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Zap, Copy, Check, Plus, Download } from 'lucide-react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  isChallenge?: boolean;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  domain: number;
  timestamp: number;
}

const Oracle: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [challengeTimer, setChallengeTimer] = useState(0);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  useEffect(() => {
    const saved = localStorage.getItem('oracle_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isChallengeMode && challengeTimer > 0) {
      const timer = setInterval(() => {
        setChallengeTimer(prev => {
          if (prev <= 1) {
            setIsChallengeMode(false);
            addMessage('assistant', 'Time is up — what is your answer?');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isChallengeMode, challengeTimer]);

  const getSystemPrompt = (domain: number): string => {
    const domainName = domainNames.find(d => d.id === domain)?.name || 'Knowledge';
    return `You are the Oracle — the ancient intelligence at the heart of Lekhan's Omniversal Codex. You are a Socratic tutor of supreme depth across all 10 domains of knowledge: Mathematics, Computer Science, AI/ML, Physics, Philosophy, Economics, Language, Biology, Psychology, and Strategy.

Current active domain: ${domainName}

Your principles:
1. Always teach through questions first before giving answers
2. Connect every concept back to its domain fundamentals
3. Find and state connections to at least one other domain in every response
4. Use concrete examples, thought experiments, and analogies
5. Be concise but never shallow — depth over length
6. End every response with one powerful follow-up question to deepen thinking
7. If asked something outside the 10 domains, redirect wisely

Tone: wise, calm, precise, occasionally poetic. Never robotic.`;
  };

  const addMessage = (role: 'user' | 'assistant', content: string, isChallenge = false) => {
    setMessages(prev => [...prev, { role, content, isChallenge }]);
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    addMessage('user', messageToSend);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory: Message[] = [
        { role: 'system', content: getSystemPrompt(activeDomain) },
        ...messages.filter(m => m.role !== 'system'),
        { role: 'user', content: messageToSend }
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1024,
          temperature: 0.7,
          messages: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'No response';
      
      addMessage('assistant', assistantMessage);
      extractTopics(assistantMessage);
    } catch (error) {
      console.error('Oracle error:', error);
      addMessage('assistant', `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const startChallenge = async () => {
    const domainName = domainNames.find(d => d.id === activeDomain)?.name;
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 256,
          temperature: 0.8,
          messages: [
            { role: 'system', content: getSystemPrompt(activeDomain) },
            { role: 'user', content: `Generate one hard, thought-provoking question about ${domainName} that requires deep reasoning to answer. Just the question, nothing else.` }
          ]
        })
      });

      const data = await response.json();
      const challenge = data.choices[0]?.message?.content || 'Challenge failed to load';
      
      addMessage('assistant', challenge, true);
      setIsChallengeMode(true);
      setChallengeTimer(300);
    } catch (error) {
      console.error('Challenge error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTopics = (text: string) => {
    const words = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const uniqueTopics = [...new Set(words)].slice(0, 8);
    setTopics(uniqueTopics);
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const newSession = () => {
    if (messages.length > 0) {
      saveCurrentSession();
    }
    setMessages([]);
    setTopics([]);
    setCurrentSessionId('');
    setIsChallengeMode(false);
    setChallengeTimer(0);
  };

  const saveCurrentSession = () => {
    if (messages.length === 0) return;
    
    const session: Session = {
      id: currentSessionId || Date.now().toString(),
      title: messages.find(m => m.role === 'user')?.content.slice(0, 50) || 'New Session',
      messages,
      domain: activeDomain,
      timestamp: Date.now()
    };

    const updated = sessions.filter(s => s.id !== session.id);
    updated.unshift(session);
    setSessions(updated.slice(0, 20));
    localStorage.setItem('oracle_sessions', JSON.stringify(updated.slice(0, 20)));
    setCurrentSessionId(session.id);
  };

  const loadSession = (session: Session) => {
    saveCurrentSession();
    setMessages(session.messages);
    setActiveDomain(session.domain);
    setCurrentSessionId(session.id);
  };

  const exportSession = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oracle-session-${Date.now()}.txt`;
    a.click();
  };

  const formatMessage = (content: string, index: number) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '');
        return (
          <div key={i} className="relative my-4 bg-black/50 rounded-lg overflow-hidden border border-dark-border">
            <div className="flex items-center justify-between px-4 py-2 bg-dark-bg/50 border-b border-dark-border">
              <span className="text-xs font-mono text-gray-500">CODE</span>
              <button
                onClick={() => copyCode(code, index * 100 + i)}
                className="text-xs flex items-center gap-1 text-gray-400 hover:text-neon-blue transition-colors"
              >
                {copiedIndex === index * 100 + i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === index * 100 + i ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-gray-300">{code}</code>
            </pre>
          </div>
        );
      }
      return <p key={i} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Left Sidebar - Domains */}
      <div className="w-64 bg-dark-card/90 backdrop-blur-xl border-r border-dark-border flex flex-col">
        <div className="p-4 border-b border-dark-border">
          <Link to="/" className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-mono text-sm">Back</span>
          </Link>
          <h3 className="text-sm font-bold font-mono text-gold uppercase tracking-wider">Domains</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {domainNames.map(domain => (
            <button
              key={domain.id}
              onClick={() => setActiveDomain(domain.id)}
              className={`w-full p-3 rounded-lg mb-1 flex items-center gap-3 transition-all text-left ${
                activeDomain === domain.id
                  ? 'bg-gold/15 border-l-3 border-gold text-gold'
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <span className="text-lg">{domain.icon}</span>
              <span className="text-sm">{domain.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-dark-border">
          <h3 className="text-xs font-bold font-mono text-gold uppercase tracking-wider mb-3">Sessions</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto mb-3">
            {sessions.slice(0, 5).map(session => (
              <button
                key={session.id}
                onClick={() => loadSession(session)}
                className="w-full p-2 rounded text-left text-xs hover:bg-white/5 text-gray-400 truncate"
              >
                {session.title}
              </button>
            ))}
          </div>
          <button
            onClick={newSession}
            className="w-full p-2 bg-neon-blue/10 border border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-all text-sm font-mono flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>
      </div>

      {/* Center - Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-dark-border bg-dark-card/50 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-bold font-mono text-gold">THE ORACLE</h2>
              <p className="text-xs text-gray-500">llama-3.3-70b-versatile</p>
            </div>
          </div>
          <button
            onClick={startChallenge}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition-all text-sm font-mono flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            Challenge Me
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gold opacity-50" />
              <p className="text-lg font-mono">Ask the Oracle anything...</p>
              <p className="text-sm mt-2">Socratic wisdom across all domains</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-gold/10 border border-gold text-white'
                    : msg.isChallenge
                    ? 'bg-red-500/10 border border-red-500 text-white'
                    : 'bg-dark-card/60 border border-dark-border text-gray-200'
                }`}
              >
                {msg.isChallenge && (
                  <div className="flex items-center gap-2 mb-2 text-red-500 text-xs font-mono uppercase">
                    <Zap className="w-3 h-3" />
                    Challenge
                  </div>
                )}
                <div className="text-sm leading-relaxed">
                  {formatMessage(msg.content, idx)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-dark-card/60 border border-dark-border rounded-xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-dark-border bg-dark-card/50 backdrop-blur-xl">
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask the Oracle..."
              className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue resize-none"
              rows={2}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-6 bg-gold text-black rounded-lg hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Insights */}
      <div className="w-60 bg-dark-card/90 backdrop-blur-xl border-l border-dark-border flex flex-col">
        <div className="p-4 border-b border-dark-border">
          <h3 className="text-sm font-bold font-mono text-gold uppercase tracking-wider">Session Insights</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isChallengeMode && challengeTimer > 0 && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-red-500 text-xs font-mono uppercase">
                <Zap className="w-3 h-3" />
                Challenge Active
              </div>
              <div className="text-2xl font-mono text-red-500">
                {Math.floor(challengeTimer / 60)}:{(challengeTimer % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Topics Covered</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(`Explain ${topic} in depth`)}
                  className="px-2 py-1 bg-gold/10 border border-gold/30 text-gold rounded text-xs hover:bg-gold/20 transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Suggested Follow-ups</h4>
            <div className="space-y-2">
              {[
                "What are the deeper implications?",
                "How does this connect to other domains?",
                "Can you provide a concrete example?"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(suggestion)}
                  className="w-full p-2 bg-dark-bg border border-dark-border rounded text-xs text-left hover:border-neon-blue hover:text-neon-blue transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Actions</h4>
            <button
              onClick={exportSession}
              disabled={messages.length === 0}
              className="w-full p-2 bg-dark-bg border border-dark-border rounded text-xs hover:border-neon-blue hover:text-neon-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-3 h-3" />
              Export Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oracle;
