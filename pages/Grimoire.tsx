import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FilePlus2,
  FolderTree,
  Import,
  NotebookPen,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react';
import { GrimoireNote } from '../types';
import { appendActivity, calculateReadTime, DOMAIN_COLORS, masteryDomains, readLS, uid, writeLS } from '../utils/codex';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const TEMPLATES: Array<{ name: string; html: string }> = [
  { name: 'Concept Breakdown', html: '<h2>Concept</h2><p>Definition and scope.</p><h2>Mechanics</h2><p>How it works.</p><h2>Applications</h2><p>Where to apply it.</p>' },
  { name: 'Book Summary', html: '<h2>Core Thesis</h2><p>Main argument.</p><h2>Key Insights</h2><p>Important takeaways.</p><h2>Action Notes</h2><p>What to implement.</p>' },
  { name: 'Experiment Notes', html: '<h2>Hypothesis</h2><p>What is being tested.</p><h2>Method</h2><p>Procedure and setup.</p><h2>Results</h2><p>Observed outcomes.</p>' },
  { name: 'Problem-Solution', html: '<h2>Problem</h2><p>Context and constraints.</p><h2>Solution</h2><p>Approach and reasoning.</p><h2>Validation</h2><p>Proof and next steps.</p>' },
  { name: 'Domain Map', html: '<h2>Foundations</h2><p>Core principles.</p><h2>Connections</h2><p>Cross-domain links.</p><h2>Mastery Path</h2><p>Sequenced next moves.</p>' },
];

const createNote = (domainId: number): GrimoireNote => ({
  id: uid('note'),
  title: 'Untitled Note',
  domain: domainId,
  subjects: [],
  body: '<p>Start writing...</p>',
  masteryLevel: 1,
  created: new Date().toISOString(),
  lastEdited: new Date().toISOString(),
  wordCount: 2,
  tags: [],
});

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const getKeyTerms = (html: string): string[] => {
  const words = stripHtml(html)
    .toLowerCase()
    .match(/[a-z]{7,}/g) ?? [];
  const counts = new Map<string, number>();
  words.forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

const parseFlashcards = (html: string): Flashcard[] => {
  const sections = html.split(/<h2[^>]*>/i).slice(1);
  return sections.map((section, index) => {
    const [frontRaw, ...rest] = section.split('</h2>');
    const front = frontRaw.replace(/<[^>]*>/g, '').trim() || `Card ${index + 1}`;
    const back = rest.join('</h2>').trim() || '<p>No details.</p>';
    return { id: `card-${index}`, front, back };
  });
};

const Grimoire: React.FC = () => {
  const savedUi = readLS<{ selectedId: string | null; leftOpen: boolean; rightOpen: boolean }>(
    'codex_grimoire_ui',
    { selectedId: null, leftOpen: false, rightOpen: false }
  );
  const [notes, setNotes] = useState<GrimoireNote[]>(() => readLS<GrimoireNote[]>('grimoire_notes', []));
  const [selectedId, setSelectedId] = useState<string | null>(savedUi.selectedId ?? notes[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<Set<number>>(new Set(masteryDomains.map((domain) => domain.id)));
  const [leftOpen, setLeftOpen] = useState(savedUi.leftOpen);
  const [rightOpen, setRightOpen] = useState(savedUi.rightOpen);
  const [tagInput, setTagInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dueMap, setDueMap] = useState<Record<string, string>>(() => readLS<Record<string, string>>('grimoire_flashcard_due', {}));
  const [savePulse, setSavePulse] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const statsCanvasRef = useRef<HTMLCanvasElement>(null);

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedId) ?? null, [notes, selectedId]);
  const filteredNotes = useMemo(
    () =>
      notes.filter((note) => {
        const text = `${note.title} ${stripHtml(note.body)} ${note.tags.join(' ')}`.toLowerCase();
        return text.includes(search.trim().toLowerCase());
      }),
    [notes, search]
  );

  const reviewDue = useMemo(() => {
    const threshold = Date.now() - 7 * 86_400_000;
    return notes.filter((note) => new Date(note.lastEdited).getTime() < threshold);
  }, [notes]);

  const relatedByTag = useMemo(() => {
    if (!selectedNote) return [];
    const tags = new Set(selectedNote.tags);
    return notes.filter((note) => note.id !== selectedNote.id && note.tags.some((tag) => tags.has(tag))).slice(0, 6);
  }, [notes, selectedNote]);

  const sameDomain = useMemo(() => {
    if (!selectedNote) return [];
    return notes.filter((note) => note.domain === selectedNote.domain && note.id !== selectedNote.id).slice(0, 6);
  }, [notes, selectedNote]);

  const flashcards = useMemo(() => (selectedNote ? parseFlashcards(selectedNote.body) : []), [selectedNote]);
  const currentFlashcard = flashcards[flashcardIndex];
  const keyTerms = selectedNote ? getKeyTerms(selectedNote.body) : [];

  useEffect(() => {
    writeLS('codex_grimoire_ui', { selectedId, leftOpen, rightOpen });
  }, [leftOpen, rightOpen, selectedId]);

  useEffect(() => {
    if (!selectedNote || !editorRef.current) return;
    if (editorRef.current.innerHTML !== selectedNote.body) {
      editorRef.current.innerHTML = selectedNote.body;
    }
  }, [selectedNote?.id]); // intentionally on note switch only

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      writeLS('grimoire_notes', notes);
      setSavePulse(true);
      window.setTimeout(() => setSavePulse(false), 800);
      if (selectedNote) appendActivity('note', [selectedNote.domain], `Saved note ${selectedNote.title}`);
    }, 1500);
    return () => window.clearTimeout(timeout);
  }, [notes]); // debounced autosave

  useEffect(() => {
    writeLS('grimoire_flashcard_due', dueMap);
  }, [dueMap]);

  useEffect(() => {
    if (!showStats || !statsCanvasRef.current) return;
    const canvas = statsCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const domainCounts = masteryDomains.map((domain) => notes.filter((note) => note.domain === domain.id).length);
    const maxCount = Math.max(1, ...domainCounts);
    domainCounts.forEach((count, index) => {
      const x = 20 + index * 26;
      const h = (count / maxCount) * 150;
      ctx.fillStyle = DOMAIN_COLORS[masteryDomains[index].id] ?? '#c9a84c';
      ctx.fillRect(x, 180 - h, 14, h);
    });
  }, [notes, showStats]);

  const updateSelected = (patch: Partial<GrimoireNote>): void => {
    if (!selectedNote) return;
    const nextBody = patch.body ?? selectedNote.body;
    const nextText = stripHtml(nextBody);
    const nextWordCount = nextText.length > 0 ? nextText.split(/\s+/).length : 0;
    const nextTags = [...new Set([...(patch.tags ?? selectedNote.tags), ...(patch.subjects ?? selectedNote.subjects)])];
    const updated: GrimoireNote = {
      ...selectedNote,
      ...patch,
      tags: nextTags,
      wordCount: nextWordCount,
      lastEdited: new Date().toISOString(),
    };
    setNotes((current) => current.map((note) => (note.id === selectedNote.id ? updated : note)));
  };

  const addNewNote = (domainId: number, templateHtml?: string): void => {
    const note = createNote(domainId);
    if (templateHtml) note.body = templateHtml;
    setNotes((current) => [note, ...current]);
    setSelectedId(note.id);
    setShowTemplates(false);
  };

  const deleteNote = (id: string): void => {
    if (!window.confirm('Delete this note permanently?')) return;
    setNotes((current) => current.filter((note) => note.id !== id));
    if (selectedId === id) setSelectedId(notes.find((note) => note.id !== id)?.id ?? null);
  };

  const exec = (command: string, value?: string): void => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      updateSelected({ body: editorRef.current.innerHTML });
    }
  };

  const addSubjectTag = (): void => {
    const value = tagInput.trim();
    if (!value || !selectedNote) return;
    if (!selectedNote.subjects.includes(value)) updateSelected({ subjects: [...selectedNote.subjects, value] });
    setTagInput('');
  };

  const rateFlashcard = (days: number): void => {
    if (!selectedNote || !currentFlashcard) return;
    const due = new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
    setDueMap((current) => ({ ...current, [`${selectedNote.id}:${currentFlashcard.id}`]: due }));
    setFlashcardIndex((current) => (current + 1) % Math.max(1, flashcards.length));
    setFlipped(false);
  };

  const exportAllNotes = (): void => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `grimoire-notes-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportCurrentHtml = (): void => {
    if (!selectedNote) return;
    const html = `<html><head><meta charset="utf-8"/><title>${selectedNote.title}</title></head><body>${selectedNote.body}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedNote.title.replace(/\s+/g, '-').toLowerCase() || 'note'}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(String(reader.result)) as GrimoireNote[];
        const existing = new Set(notes.map((note) => note.id));
        const merged = [...notes, ...incoming.filter((note) => !existing.has(note.id))];
        setNotes(merged);
      } catch {
        window.alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel relative min-h-[calc(100dvh-3.5rem)] overflow-hidden rounded-2xl border md:min-h-[100dvh]">
      <div className="grid min-h-[inherit] grid-cols-1 md:grid-cols-[220px_1fr_220px]">
        <aside className={`glass-panel-strong fixed inset-y-0 left-0 z-30 w-[220px] border-r p-3 transition-transform md:static md:translate-x-0 ${leftOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-cinzel text-xl text-[#e4ca87]">Grimoire</h2><button type="button" onClick={() => setLeftOpen(false)} className="md:hidden"><ChevronLeft className="h-4 w-4" /></button></div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes..." className="mb-3 w-full rounded border border-white/15 bg-black/55 px-2 py-1.5 text-xs text-white outline-none focus:border-[#c9a84c]" />
          <div className="mb-3 flex gap-1 text-[10px]"><button type="button" onClick={exportAllNotes} className="flex items-center gap-1 rounded border border-white/20 px-2 py-1"><Download className="h-3 w-3" /> JSON</button><button type="button" onClick={exportCurrentHtml} className="flex items-center gap-1 rounded border border-white/20 px-2 py-1"><NotebookPen className="h-3 w-3" /> HTML</button><label className="flex cursor-pointer items-center gap-1 rounded border border-white/20 px-2 py-1"><Import className="h-3 w-3" /> Import<input type="file" accept=".json" className="hidden" onChange={importNotes} /></label></div>
          <div className="space-y-1 overflow-y-auto">
            {masteryDomains.map((domain) => {
              const domainNotes = filteredNotes.filter((note) => note.domain === domain.id);
              const dueCount = domainNotes.reduce((sum, note) => sum + Object.keys(dueMap).filter((key) => key.startsWith(`${note.id}:`) && new Date(dueMap[key]).getTime() <= Date.now()).length, 0);
              const expanded = expandedDomains.has(domain.id);
              return (
                <div key={domain.id} className="rounded border border-white/8 bg-black/35">
                  <button type="button" onClick={() => setExpandedDomains((current) => { const next = new Set(current); if (next.has(domain.id)) next.delete(domain.id); else next.add(domain.id); return next; })} className="flex w-full items-center justify-between px-2 py-1.5 text-xs text-gray-300">
                    <span className="flex items-center gap-1"><FolderTree className="h-3 w-3" /> D{domain.id} ({domainNotes.length})</span>
                    <span className="flex items-center gap-1">{dueCount > 0 && <span className="rounded-full bg-red-500/20 px-1 text-red-300">{dueCount}</span>}{expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}</span>
                  </button>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="space-y-1 px-2 pb-2">
                        {domainNotes.map((note) => (
                          <button key={note.id} type="button" onClick={() => setSelectedId(note.id)} className={`w-full rounded px-2 py-1 text-left text-[11px] ${selectedId === note.id ? 'bg-[#c9a84c]/15 text-[#e4ca87]' : 'text-gray-400 hover:bg-white/10'}`}>
                            <div className="truncate">{note.title}</div>
                            <div className="flex items-center justify-between text-[10px]"><span>{new Date(note.lastEdited).toLocaleDateString()}</span><span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: note.masteryLevel >= 4 ? '#e4ca87' : '#666' }} /></div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>

        <main className={`relative flex min-h-[inherit] min-w-0 flex-col border-x border-white/10 ${savePulse ? 'shadow-[0_0_0_1px_rgba(201,168,76,0.7)_inset]' : ''}`}>
          <header className="glass-panel flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2 md:hidden"><button type="button" onClick={() => setLeftOpen(true)} className="rounded p-1 hover:bg-white/10"><FolderTree className="h-4 w-4" /></button><button type="button" onClick={() => setRightOpen(true)} className="rounded p-1 hover:bg-white/10"><Sparkles className="h-4 w-4" /></button></div>
            <div className="flex flex-wrap gap-1 text-xs">
              <button type="button" onClick={() => exec('bold')} className="rounded border border-white/20 px-2 py-1">Bold</button>
              <button type="button" onClick={() => exec('italic')} className="rounded border border-white/20 px-2 py-1">Italic</button>
              <button type="button" onClick={() => exec('underline')} className="rounded border border-white/20 px-2 py-1">Underline</button>
              <button type="button" onClick={() => exec('formatBlock', '<h2>')} className="rounded border border-white/20 px-2 py-1">Heading</button>
              <button type="button" onClick={() => exec('insertHTML', '<hr/>')} className="rounded border border-white/20 px-2 py-1">Divider</button>
              <button type="button" onClick={() => exec('insertHTML', '<pre><code>// code block</code></pre>')} className="rounded border border-white/20 px-2 py-1">Code</button>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => setShowTemplates(true)} className="rounded border border-white/20 px-2 py-1 text-xs">Templates</button>
              <button type="button" onClick={() => setShowFlashcards(true)} className="rounded border border-white/20 px-2 py-1 text-xs">Flashcards</button>
              <button type="button" onClick={() => setShowStats(true)} className="rounded border border-white/20 px-2 py-1 text-xs">Stats</button>
              <button type="button" onClick={() => addNewNote(selectedNote?.domain ?? masteryDomains[0].id)} className="rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-2 py-1 text-xs text-[#e4ca87]"><FilePlus2 className="h-3 w-3" /></button>
            </div>
          </header>

          {selectedNote ? (
            <div className="flex-1 overflow-y-auto p-4">
              <input value={selectedNote.title} onChange={(event) => updateSelected({ title: event.target.value })} className="mb-3 w-full bg-transparent font-cinzel text-3xl text-white outline-none" />
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <select value={selectedNote.domain} onChange={(event) => updateSelected({ domain: Number(event.target.value) })} className="rounded border border-white/20 bg-black/55 px-2 py-1 text-gray-200">
                  {masteryDomains.map((domain) => <option key={domain.id} value={domain.id}>D{domain.id} {domain.title}</option>)}
                </select>
                <div className="flex gap-1">{[1, 2, 3, 4, 5].map((level) => <button key={level} type="button" onClick={() => updateSelected({ masteryLevel: level as 1 | 2 | 3 | 4 | 5 })} className={`h-5 w-5 rounded-full ${selectedNote.masteryLevel >= level ? 'bg-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.5)]' : 'bg-white/20'}`} />)}</div>
                <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSubjectTag(); } }} placeholder="Add subject tag..." className="rounded border border-white/20 bg-black/55 px-2 py-1 text-gray-200" />
              </div>
              <div className="mb-3 flex flex-wrap gap-1">{selectedNote.subjects.map((subject) => <button key={subject} type="button" onClick={() => updateSelected({ subjects: selectedNote.subjects.filter((item) => item !== subject) })} className="rounded-full border border-[#c9a84c]/45 bg-[#c9a84c]/10 px-2 py-0.5 text-xs text-[#e4ca87]">{subject} ×</button>)}</div>
              <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={(event) => updateSelected({ body: (event.target as HTMLDivElement).innerHTML })} className="min-h-[340px] rounded-xl border border-white/10 bg-black/45 p-4 text-sm leading-relaxed text-gray-200 outline-none" />
              <div className="mt-2 text-right text-xs text-gray-500">{selectedNote.wordCount} words · {calculateReadTime(selectedNote.wordCount)} min read</div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">Create or select a note.</div>
          )}
        </main>

        <aside className={`glass-panel-strong fixed inset-y-0 right-0 z-30 w-[220px] border-l p-3 transition-transform md:static md:translate-x-0 ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-cinzel text-xl text-[#e4ca87]">Intelligence</h2><button type="button" onClick={() => setRightOpen(false)} className="md:hidden"><ChevronRight className="h-4 w-4" /></button></div>
          <div className="space-y-3 text-xs">
            <div className="rounded border border-white/10 bg-black/50 p-2"><div className="mb-1 uppercase tracking-[0.2em] text-gray-500">Connections</div>{relatedByTag.map((note) => <button key={note.id} type="button" onClick={() => setSelectedId(note.id)} className="block text-left text-gray-300 hover:text-[#e4ca87]">{note.title}</button>)}{relatedByTag.length === 0 && <span className="text-gray-500">No shared tags yet.</span>}</div>
            <div className="rounded border border-white/10 bg-black/50 p-2"><div className="mb-1 uppercase tracking-[0.2em] text-gray-500">This Domain</div>{sameDomain.map((note) => <button key={note.id} type="button" onClick={() => setSelectedId(note.id)} className="block text-left text-gray-300 hover:text-[#e4ca87]">{note.title}</button>)}{sameDomain.length === 0 && <span className="text-gray-500">No sibling notes.</span>}</div>
            <div className="rounded border border-white/10 bg-black/50 p-2"><div className="mb-1 uppercase tracking-[0.2em] text-gray-500">Key Terms</div>{keyTerms.map((term) => <span key={term} className="mr-1 inline-block rounded-full border border-white/15 px-2 py-0.5 text-[11px]">{term}</span>)}{keyTerms.length === 0 && <span className="text-gray-500">Write more to extract terms.</span>}</div>
            <div className="rounded border border-white/10 bg-black/50 p-2"><div className="mb-1 uppercase tracking-[0.2em] text-gray-500">Review Due</div>{reviewDue.slice(0, 5).map((note) => <button key={note.id} type="button" onClick={() => setSelectedId(note.id)} className="block text-left text-gray-300">{note.title}</button>)}{reviewDue.length === 0 && <span className="text-gray-500">All fresh.</span>}</div>
            <button type="button" onClick={() => { const random = notes[Math.floor(Math.random() * Math.max(1, notes.length))]; if (random) setSelectedId(random.id); }} className="inline-flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-[11px] text-gray-300"><Shuffle className="h-3 w-3" /> Random Note</button>
            {selectedNote && <button type="button" onClick={() => deleteNote(selectedNote.id)} className="inline-flex items-center gap-1 rounded border border-red-500/50 px-2 py-1 text-[11px] text-red-300"><X className="h-3 w-3" /> Delete Note</button>}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showTemplates && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-black/90 p-4">
              <h3 className="mb-3 font-cinzel text-2xl text-[#e4ca87]">Templates</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {TEMPLATES.map((template) => (
                  <button key={template.name} type="button" onClick={() => addNewNote(selectedNote?.domain ?? masteryDomains[0].id, template.html)} className="rounded border border-white/15 bg-black/45 px-3 py-2 text-left text-sm text-gray-200 hover:border-[#c9a84c]">
                    {template.name}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setShowTemplates(false)} className="mt-3 rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFlashcards && selectedNote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-black/90 p-5">
              <h3 className="mb-4 font-cinzel text-2xl text-[#e4ca87]">Flashcard Mode</h3>
              {currentFlashcard ? (
                <>
                  <div className="mb-4 perspective-1000">
                    <div className="relative h-48 w-full cursor-pointer preserve-3d transition-transform duration-500" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => setFlipped((current) => !current)}>
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/20 bg-black/55 p-4 backface-hidden text-center text-lg text-white">{currentFlashcard.front}</div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 p-4 backface-hidden text-center text-sm text-[#f3deb0]" style={{ transform: 'rotateY(180deg)' }} dangerouslySetInnerHTML={{ __html: currentFlashcard.back }} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button type="button" onClick={() => rateFlashcard(1)} className="rounded border border-red-400/50 px-2 py-1 text-red-300">Again (1d)</button>
                    <button type="button" onClick={() => rateFlashcard(3)} className="rounded border border-orange-400/50 px-2 py-1 text-orange-300">Hard (3d)</button>
                    <button type="button" onClick={() => rateFlashcard(7)} className="rounded border border-blue-400/50 px-2 py-1 text-blue-300">Good (7d)</button>
                    <button type="button" onClick={() => rateFlashcard(14)} className="rounded border border-green-400/50 px-2 py-1 text-green-300">Easy (14d)</button>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">No flashcards detected. Add at least one &lt;h2&gt; heading.</p>
              )}
              <button type="button" onClick={() => setShowFlashcards(false)} className="mt-4 rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-black/92 p-5">
              <div className="mb-3 flex items-center gap-2 text-[#e4ca87]"><BarChart3 className="h-5 w-5" /><h3 className="font-cinzel text-2xl">Grimoire Stats</h3></div>
              <canvas ref={statsCanvasRef} width={520} height={210} className="w-full rounded border border-white/10 bg-black/45" />
              <div className="mt-3 text-sm text-gray-300">Total notes: {notes.length} · Total words: {notes.reduce((sum, note) => sum + note.wordCount, 0)} · Longest note: {notes.reduce((max, note) => Math.max(max, note.wordCount), 0)} words</div>
              <button type="button" onClick={() => setShowStats(false)} className="mt-3 rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Grimoire;
