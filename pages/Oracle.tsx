import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FolderOpen,
  KeyRound,
  MessageSquareMore,
  Save,
  Send,
  Sparkles,
} from 'lucide-react';
import { appendActivity, masteryDomains, uid } from '../utils/codex';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  isChallenge?: boolean;
  conceptTags?: string[];
}

interface SessionRecord {
  id: string;
  timestamp: number;
  domain: number;
  history: Message[];
}

const CONFIG = { model: 'llama-3.3-70b-versatile', maxTokens: 1024, temperature: 0.7 };

const SUGGESTIONS: Record<number, string[]> = Object.fromEntries(
  masteryDomains.map((domain) => [
    domain.id,
    [
      `What is the deepest leverage point in ${domain.title}?`,
      `How does ${domain.title} connect to another domain you value?`,
      `What hard question should guide your next week in ${domain.title}?`,
      `What misconception in ${domain.title} slows mastery most?`,
      `What experiment would test your current beliefs in ${domain.title}?`,
    ],
  ])
);

const systemPrompt = (domainName: string): string =>
  `You are the Oracle of Lekhan's Omniversal Codex — a Socratic tutor across all 17 domains. Active domain: ${domainName}. Always teach through questions first. Connect every concept to at least one other domain. End every response with one powerful follow-up question. Tone: wise, precise, occasionally poetic.`;

const extractConceptTags = (text: string): string[] => {
  const items = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) ?? [];
  return [...new Set(items)].slice(0, 8);
};

const randomPick = <T,>(items: T[], count: number): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy.slice(0, count);
};

const splitCode = (text: string): Array<{ type: 'text' | 'code'; value: string }> => {
  const regex = /```([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; value: string }> = [];
  let last = 0;
  let match = regex.exec(text);
  while (match) {
    if (match.index > last) parts.push({ type: 'text', value: text.slice(last, match.index) });
    parts.push({ type: 'code', value: match[1].trim() });
    last = regex.lastIndex;
    match = regex.exec(text);
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
};

const playBell = (): void => {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1);
};

const Oracle: React.FC = () => {
  const [domainId, setDomainId] = useState(masteryDomains[0]?.id ?? 1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(!localStorage.getItem('codex_groq_key'));
  const [apiKey, setApiKey] = useState(localStorage.getItem('codex_groq_key') ?? '');
  const [keyDraft, setKeyDraft] = useState(localStorage.getItem('codex_groq_key') ?? '');
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [challengeSeconds, setChallengeSeconds] = useState(0);
  const [masteryNotes, setMasteryNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<string[]>(randomPick(SUGGESTIONS[domainId] ?? [], 3));
  const chatRef = useRef<HTMLDivElement>(null);
  const prevDomainRef = useRef(domainId);

  const domain = useMemo(() => masteryDomains.find((entry) => entry.id === domainId) ?? masteryDomains[0], [domainId]);

  const tokenCount = Math.ceil(messages.reduce((sum, item) => sum + item.content.length, 0) / 4);
  const topicsCovered = useMemo(
    () => [...new Set(messages.flatMap((message) => message.conceptTags ?? []))].slice(0, 20),
    [messages]
  );

  useEffect(() => {
    const saved = localStorage.getItem('oracle_sessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved) as SessionRecord[]);
      } catch {
        setSessions([]);
      }
    }
  }, []);

  useEffect(() => {
    setMasteryNotes(localStorage.getItem(`oracle_notes_${domainId}`) ?? '');
    setSuggested(randomPick(SUGGESTIONS[domainId] ?? [], 3));
  }, [domainId]);

  useEffect(() => {
    localStorage.setItem(`oracle_notes_${domainId}`, masteryNotes);
  }, [domainId, masteryNotes]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (challengeSeconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setChallengeSeconds((value) => {
        if (value <= 1) {
          playBell();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [challengeSeconds]);

  useEffect(() => {
    if (prevDomainRef.current !== domainId && messages.length > 0) {
      setMessages((current) => [
        ...current,
        { id: uid('oracle'), role: 'assistant', content: `The lens shifts to ${domain?.title}. What aspect calls to you?`, createdAt: Date.now() },
      ]);
    }
    prevDomainRef.current = domainId;
  }, [domainId, domain?.title, messages.length]);

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (event.ctrlKey) {
        const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9 };
        if (event.key in map) {
          const next = masteryDomains[map[event.key]];
          if (next) {
            event.preventDefault();
            setDomainId(next.id);
          }
        }
      }
      if (event.key === 'Escape') setInput('');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const persistSessions = (next: SessionRecord[]): void => {
    setSessions(next);
    localStorage.setItem('oracle_sessions', JSON.stringify(next));
  };

  const saveSession = (): void => {
    if (messages.length === 0) return;
    const next = [{ id: uid('session'), timestamp: Date.now(), domain: domainId, history: messages }, ...sessions].slice(0, 20);
    persistSessions(next);
  };

  const exportTxt = (): void => {
    const text = messages.map((msg) => `[${msg.role}] ${msg.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `oracle-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const sendToOracle = async (prompt: string, challenge = false): Promise<void> => {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }
    if (!challenge) {
      setMessages((current) => [...current, { id: uid('oracle'), role: 'user', content: prompt, createdAt: Date.now() }]);
    }
    setLoading(true);
    setInput('');

    const history = messages.map((msg) => ({ role: msg.role, content: msg.content }));
    const groqBody = {
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
      messages: [
        { role: 'system', content: systemPrompt(domain?.title ?? `Domain ${domainId}`) },
        ...history,
        {
          role: 'user',
          content: challenge
            ? `Generate one hard thought-provoking question about ${domain?.title}. Just the question, nothing else.`
            : prompt,
        },
      ],
    };

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(groqBody),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content?.trim() ?? 'No response.';
      setMessages((current) => [
        ...current,
        {
          id: uid('oracle'),
          role: 'assistant',
          content: text,
          createdAt: Date.now(),
          isChallenge: challenge,
          conceptTags: extractConceptTags(text),
        },
      ]);
      if (challenge) setChallengeSeconds(300);
      appendActivity('oracle', [domainId], challenge ? 'Oracle challenge started' : 'Oracle response');
    } catch (error) {
      setMessages((current) => [
        ...current,
        { id: uid('oracle'), role: 'assistant', content: `Oracle error: ${error instanceof Error ? error.message : 'Unknown error'}.`, createdAt: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = (): void => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    void sendToOracle(trimmed);
  };

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-black/55 md:min-h-[100dvh]">
      <div className="grid min-h-[inherit] grid-cols-1 md:grid-cols-[260px_1fr_240px]">
        <aside className={`fixed inset-y-0 left-0 z-30 w-[260px] border-r border-white/10 bg-black/92 p-4 transition-transform md:static md:translate-x-0 ${leftOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-cinzel text-xl text-[#e4ca87]">Domains</h2><button type="button" className="md:hidden" onClick={() => setLeftOpen(false)}><ChevronLeft className="h-4 w-4" /></button></div>
          <div className="mb-4 space-y-1 overflow-y-auto">{masteryDomains.map((entry) => <button key={entry.id} type="button" onClick={() => { setDomainId(entry.id); setLeftOpen(false); }} className={`w-full rounded-md px-3 py-2 text-left text-sm ${entry.id === domainId ? 'border border-[#c9a84c]/70 bg-[#c9a84c]/15 text-[#e4ca87]' : 'text-gray-300 hover:bg-white/10'}`}>D{entry.id}. {entry.title}</button>)}</div>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-500"><span>Sessions</span><button type="button" className="rounded border border-white/20 px-2 py-1 text-[10px]" onClick={() => setMessages([])}>New</button></div>
          <div className="space-y-2 overflow-y-auto">{sessions.map((session) => <button key={session.id} type="button" onClick={() => { setDomainId(session.domain); setMessages(session.history); setLeftOpen(false); }} className="block w-full rounded border border-white/10 bg-black/45 px-3 py-2 text-left text-xs text-gray-300"><div className="text-[10px] text-gray-500">{new Date(session.timestamp).toLocaleDateString()}</div><div className="line-clamp-2">{session.history.find((item) => item.role === 'user')?.content ?? 'Untitled'}</div></button>)}</div>
        </aside>

        <main className="flex min-h-[inherit] min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 bg-black/55 px-3 py-3 md:px-5">
            <div className="flex items-center gap-2 md:hidden"><button type="button" onClick={() => setLeftOpen(true)} className="rounded p-2 hover:bg-white/10"><FolderOpen className="h-4 w-4" /></button><button type="button" onClick={() => setRightOpen(true)} className="rounded p-2 hover:bg-white/10"><MessageSquareMore className="h-4 w-4" /></button></div>
            <div className="flex min-w-0 items-center gap-2"><span className="truncate rounded-full border border-[#c9a84c]/55 bg-[#c9a84c]/10 px-2 py-1 text-xs text-[#e4ca87]">{domain?.title}</span><span className="hidden rounded-full border border-white/20 px-2 py-1 text-xs text-gray-400 md:inline">{CONFIG.model}</span></div>
            <div className="flex items-center gap-2"><button type="button" onClick={() => void sendToOracle('challenge', true)} className="rounded border border-[#c9a84c]/65 bg-[#c9a84c]/10 px-3 py-1.5 text-xs text-[#e4ca87]">Challenge Me</button><button type="button" onClick={() => setShowKeyModal(true)} className="rounded border border-white/20 p-1.5"><KeyRound className="h-4 w-4" /></button></div>
          </header>

          <div ref={chatRef} className="flex-1 space-y-4 overflow-y-auto px-3 py-4 md:px-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-xl border px-4 py-3 text-sm ${message.role === 'user' ? 'border-[#c9a84c]/70 bg-[#c9a84c]/10 text-[#f5e9c1]' : 'border-white/15 bg-black/50 text-gray-200'}`}>
                  {message.role === 'assistant' && <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#c9a84c]"><Sparkles className="h-3.5 w-3.5" /> Oracle {message.isChallenge && <span className="rounded border border-red-500/60 px-1.5 py-0.5 text-red-300">Challenge</span>}</div>}
                  {splitCode(message.content).map((part, index) => part.type === 'code' ? (
                    <div key={`${message.id}-${index}`} className="my-3 rounded border border-white/15 bg-[#0c111d]">
                      <div className="flex justify-end border-b border-white/10 px-2 py-1"><button type="button" onClick={() => { void navigator.clipboard.writeText(part.value); setCopiedCode(`${message.id}-${index}`); window.setTimeout(() => setCopiedCode(null), 1200); }} className="text-xs text-gray-400">{copiedCode === `${message.id}-${index}` ? 'Copied' : 'Copy'}</button></div>
                      <pre className="overflow-x-auto p-3 font-mono text-xs text-[#dbe3ff]">{part.value}</pre>
                    </div>
                  ) : message.role === 'assistant' ? (
                    <motion.p key={`${message.id}-${index}`} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.02 } } }} className="leading-relaxed">
                      {part.value.split(/\s+/).filter(Boolean).map((word, i) => <motion.span key={`${word}-${i}`} variants={{ hidden: { opacity: 0, y: 3 }, visible: { opacity: 1, y: 0 } }} className="mr-1 inline-block">{word}</motion.span>)}
                    </motion.p>
                  ) : <p key={`${message.id}-${index}`} className="leading-relaxed">{part.value}</p>)}
                  {message.conceptTags && message.conceptTags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{message.conceptTags.map((tag) => <button key={tag} type="button" onClick={() => void sendToOracle(`Explain ${tag} in depth`)} className="rounded-full border border-[#c9a84c]/45 bg-[#c9a84c]/10 px-2 py-0.5 text-[11px] text-[#e4ca87]">{tag}</button>)}</div>}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="rounded-xl border border-white/15 bg-black/50 px-4 py-3"><div className="flex gap-1">{[0, 1, 2].map((dot) => <span key={dot} className="h-2 w-2 rounded-full bg-[#c9a84c]" style={{ animation: `pulse-warning 0.8s ease-in-out ${dot * 150}ms infinite` }} />)}</div></div></div>}
          </div>

          <footer className="border-t border-white/10 bg-black/55 px-3 py-3 md:px-5">
            <div className="mb-2 flex flex-wrap gap-2"><button type="button" onClick={saveSession} className="inline-flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-xs text-gray-300"><Save className="h-3.5 w-3.5" /> Save Session</button><button type="button" onClick={exportTxt} className="inline-flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-xs text-gray-300"><Download className="h-3.5 w-3.5" /> Export .txt</button></div>
            <div className="flex items-end gap-2"><textarea value={input} onChange={(event) => { setInput(event.target.value); event.currentTarget.style.height = 'auto'; event.currentTarget.style.height = `${Math.min(180, event.currentTarget.scrollHeight)}px`; }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder="Ask the Oracle..." className="max-h-44 min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-black/55 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]" /><button type="button" onClick={submit} className="rounded-xl border border-[#c9a84c]/75 bg-[#c9a84c]/15 p-3 text-[#e4ca87]" disabled={loading}><Send className="h-4 w-4" /></button></div>
          </footer>
        </main>

        <aside className={`fixed inset-y-0 right-0 z-30 w-[240px] border-l border-white/10 bg-black/92 p-4 transition-transform md:static md:translate-x-0 ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-cinzel text-xl text-[#e4ca87]">Oracle Intel</h2><button type="button" className="md:hidden" onClick={() => setRightOpen(false)}><ChevronRight className="h-4 w-4" /></button></div>
          <div className="space-y-4 text-xs">
            <div className="rounded border border-white/10 bg-black/50 p-3"><div className="mb-1 uppercase tracking-[0.2em] text-gray-500">Token Counter</div><div className="font-mono text-lg text-[#e4ca87]">{tokenCount}</div>{challengeSeconds > 0 && <div className="mt-2 text-[11px] text-red-300">Challenge: {Math.floor(challengeSeconds / 60)}:{String(challengeSeconds % 60).padStart(2, '0')}</div>}</div>
            <div className="rounded border border-white/10 bg-black/50 p-3"><div className="mb-2 uppercase tracking-[0.2em] text-gray-500">Topics Covered</div><div className="flex flex-wrap gap-1">{topicsCovered.length === 0 ? <span className="text-gray-500">No tags yet</span> : topicsCovered.map((topic) => <span key={topic} className="rounded-full border border-[#c9a84c]/45 bg-[#c9a84c]/10 px-2 py-0.5 text-[11px] text-[#e4ca87]">{topic}</span>)}</div></div>
            <div className="rounded border border-white/10 bg-black/50 p-3"><div className="mb-2 uppercase tracking-[0.2em] text-gray-500">Suggested Follow-Ups</div><div className="space-y-2">{suggested.map((question) => <button key={question} type="button" onClick={() => void sendToOracle(question)} className="w-full rounded border border-white/10 px-2 py-1 text-left text-[11px] text-gray-300 hover:border-[#c9a84c]">{question}</button>)}</div></div>
            <div className="rounded border border-white/10 bg-black/50 p-3"><div className="mb-2 uppercase tracking-[0.2em] text-gray-500">Mastery Notes</div><textarea value={masteryNotes} onChange={(event) => setMasteryNotes(event.target.value)} className="h-28 w-full resize-none rounded border border-white/10 bg-black/55 p-2 text-[11px] text-gray-200 outline-none focus:border-[#c9a84c]" /></div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showKeyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur">
            <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} className="w-full max-w-md rounded-2xl border border-white/15 bg-black/85 p-5">
              <h3 className="mb-2 font-cinzel text-xl text-[#e4ca87]">Groq API Key</h3>
              <p className="mb-3 text-sm text-gray-400">Paste your key. It will be stored locally as <code>codex_groq_key</code>.</p>
              <input value={keyDraft} onChange={(event) => setKeyDraft(event.target.value)} placeholder="gsk_..." className="mb-4 w-full rounded border border-white/15 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]" />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowKeyModal(false)} className="rounded border border-white/15 px-3 py-1.5 text-sm text-gray-300">Later</button><button type="button" onClick={() => { const clean = keyDraft.trim(); if (!clean) return; localStorage.setItem('codex_groq_key', clean); setApiKey(clean); setShowKeyModal(false); }} className="rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-3 py-1.5 text-sm text-[#e4ca87]">Save Key</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Oracle;
