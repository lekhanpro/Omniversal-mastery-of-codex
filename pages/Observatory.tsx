import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Filter, Plus, Shuffle, Star, Table2, Upload } from 'lucide-react';
import { appendActivity, DOMAIN_COLORS, masteryDomains, readLS, uid, writeLS } from '../utils/codex';

type ResourceType = 'Book' | 'Paper' | 'Course' | 'Video' | 'Podcast' | 'Website' | 'AI Tool' | 'Practice Platform';
type ResourceStatus = 'Want to Explore' | 'Currently Studying' | 'Completed' | 'Reference';

interface Resource {
  id: string;
  title: string;
  author: string;
  type: ResourceType;
  domains: number[];
  status: ResourceStatus;
  rating: number;
  url: string;
  takeaway: string;
  difficulty: number;
  createdAt: string;
  notes: string;
  quotes: string[];
  progress: number;
  references: string[];
}

const TYPES: ResourceType[] = ['Book', 'Paper', 'Course', 'Video', 'Podcast', 'Website', 'AI Tool', 'Practice Platform'];
const STATUSES: ResourceStatus[] = ['Want to Explore', 'Currently Studying', 'Completed', 'Reference'];

const createEmptyResource = (): Resource => ({
  id: '',
  title: '',
  author: '',
  type: 'Book',
  domains: [],
  status: 'Want to Explore',
  rating: 3,
  url: '',
  takeaway: '',
  difficulty: 3,
  createdAt: new Date().toISOString(),
  notes: '',
  quotes: [],
  progress: 0,
  references: [],
});

const Observatory: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(() => readLS<Resource[]>('observatory_resources', []));
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<Resource>(createEmptyResource());
  const [view, setView] = useState<'shelf' | 'list'>('shelf');
  const [selected, setSelected] = useState<Resource | null>(null);
  const [showSerendipity, setShowSerendipity] = useState<Resource | null>(null);
  const [domainFilter, setDomainFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'all'>('all');
  const [minRating, setMinRating] = useState(1);
  const statsCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    writeLS('observatory_resources', resources);
  }, [resources]);

  useEffect(() => {
    const canvas = statsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const byStatus = STATUSES.map((status) => resources.filter((resource) => resource.status === status).length);
    const total = Math.max(1, byStatus.reduce((sum, value) => sum + value, 0));

    let x = 20;
    byStatus.forEach((count, index) => {
      const width = (count / total) * 300;
      ctx.fillStyle = ['#9ca3af', '#44aaff', '#c9a84c', '#7ce8b5'][index];
      ctx.fillRect(x, 18, width, 20);
      x += width;
    });

    const domainCounts = masteryDomains.map((domain) => resources.filter((resource) => resource.domains.includes(domain.id)).length);
    const maxCount = Math.max(1, ...domainCounts);
    domainCounts.forEach((count, index) => {
      const barHeight = (count / maxCount) * 110;
      ctx.fillStyle = DOMAIN_COLORS[masteryDomains[index].id];
      ctx.fillRect(20 + index * 18, 170 - barHeight, 12, barHeight);
    });
  }, [resources]);

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        if (domainFilter && !resource.domains.includes(domainFilter)) return false;
        if (typeFilter !== 'all' && resource.type !== typeFilter) return false;
        if (statusFilter !== 'all' && resource.status !== statusFilter) return false;
        if (resource.rating < minRating) return false;
        return true;
      }),
    [domainFilter, minRating, resources, statusFilter, typeFilter]
  );

  const addResource = (): void => {
    if (!formData.title.trim() || formData.domains.length === 0) return;
    const primaryDomain = formData.domains[0];
    const entry: Resource = {
      ...formData,
      id: `OBS-${primaryDomain}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setResources((current) => [entry, ...current]);
    setFormData(createEmptyResource());
    setFormOpen(false);
    appendActivity('resource', formData.domains, `Added resource ${entry.title}`);
  };

  const updateResource = (resource: Resource): void => {
    setResources((current) => current.map((item) => (item.id === resource.id ? resource : item)));
    setSelected(resource);
  };

  const exportJson = (): void => {
    const blob = new Blob([JSON.stringify(resources, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `observatory-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(String(reader.result)) as Resource[];
        const existing = new Set(resources.map((resource) => resource.id));
        setResources((current) => [...current, ...incoming.filter((resource) => !existing.has(resource.id))]);
      } catch {
        window.alert('Invalid JSON');
      }
    };
    reader.readAsText(file);
  };

  const triggerSerendipity = (): void => {
    const candidates = resources.filter((resource) => resource.status === 'Want to Explore');
    if (candidates.length === 0) return;
    setShowSerendipity(candidates[Math.floor(Math.random() * candidates.length)]);
  };

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-cinzel text-3xl text-white">The Observatory</h1>
        <div className="flex flex-wrap gap-2 text-xs">
          <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-1 rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-3 py-1.5 text-[#e4ca87]"><Plus className="h-3.5 w-3.5" /> Add Resource</button>
          <button type="button" onClick={() => setView((current) => (current === 'shelf' ? 'list' : 'shelf'))} className="inline-flex items-center gap-1 rounded border border-white/20 px-3 py-1.5 text-gray-300"><Table2 className="h-3.5 w-3.5" /> {view === 'shelf' ? 'List View' : 'Shelf View'}</button>
          <button type="button" onClick={triggerSerendipity} className="inline-flex items-center gap-1 rounded border border-white/20 px-3 py-1.5 text-gray-300"><Shuffle className="h-3.5 w-3.5" /> Serendipity</button>
          <button type="button" onClick={exportJson} className="inline-flex items-center gap-1 rounded border border-white/20 px-3 py-1.5 text-gray-300"><Download className="h-3.5 w-3.5" /> Export</button>
          <label className="inline-flex cursor-pointer items-center gap-1 rounded border border-white/20 px-3 py-1.5 text-gray-300"><Upload className="h-3.5 w-3.5" /> Import<input type="file" accept=".json" className="hidden" onChange={importJson} /></label>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/45 p-3 text-xs">
        <Filter className="h-3.5 w-3.5 text-gray-400" />
        <select value={domainFilter ?? ''} onChange={(event) => setDomainFilter(event.target.value ? Number(event.target.value) : null)} className="rounded border border-white/20 bg-black/50 px-2 py-1">
          <option value="">All Domains</option>
          {masteryDomains.map((domain) => <option key={domain.id} value={domain.id}>D{domain.id} {domain.title}</option>)}
        </select>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as ResourceType | 'all')} className="rounded border border-white/20 bg-black/50 px-2 py-1">
          <option value="all">All Types</option>
          {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ResourceStatus | 'all')} className="rounded border border-white/20 bg-black/50 px-2 py-1">
          <option value="all">All Status</option>
          {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <label className="ml-auto flex items-center gap-1 text-gray-300">Min rating <input type="range" min={1} max={5} value={minRating} onChange={(event) => setMinRating(Number(event.target.value))} /> {minRating}</label>
      </div>

      {view === 'shelf' ? (
        <div className="space-y-4">
          {masteryDomains.map((domain) => {
            const domainResources = filtered.filter((resource) => resource.domains.includes(domain.id));
            const done = domainResources.filter((resource) => resource.status === 'Completed').length;
            return (
              <div key={domain.id} className="rounded-xl border border-white/10 bg-black/45 p-3">
                <div className="mb-2 text-sm text-gray-300">D{domain.id}. {domain.title}</div>
                <div className="flex min-h-[170px] items-end gap-2 overflow-x-auto border-b border-white/10 pb-4">
                  {domainResources.map((resource, index) => {
                    const height = 120 + (index % 5) * 10;
                    const opacity = resource.status === 'Want to Explore' ? 0.5 : resource.status === 'Currently Studying' ? 0.8 : 1;
                    return (
                      <button
                        key={resource.id}
                        type="button"
                        onClick={() => setSelected(resource)}
                        className="relative flex w-9 shrink-0 items-end justify-center overflow-hidden rounded-t border border-white/20 bg-gradient-to-b from-black/20 to-black/60 px-1 text-[9px] text-gray-200 transition hover:-translate-y-1 hover:rotate-[-1deg]"
                        style={{ height, opacity, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {resource.title.slice(0, 20)}
                        {resource.status === 'Completed' && <Star className="absolute right-0 top-0 h-3 w-3 text-[#e4ca87]" style={{ transform: 'rotate(180deg)' }} />}
                      </button>
                    );
                  })}
                  {domainResources.length === 0 && <span className="text-xs text-gray-500">No resources yet.</span>}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Completed {done}/{domainResources.length || 0}
                  <div className="mt-1 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${domainResources.length === 0 ? 0 : (done / domainResources.length) * 100}%`, backgroundColor: DOMAIN_COLORS[domain.id] }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/45 p-3">
          <div className="mb-2 text-xs text-gray-500">{filtered.length} of {resources.length} resources</div>
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-gray-500">
              <tr><th className="p-2">ID</th><th className="p-2">Title</th><th className="p-2">Author</th><th className="p-2">Type</th><th className="p-2">Domains</th><th className="p-2">Status</th><th className="p-2">Rating</th><th className="p-2">Difficulty</th><th className="p-2">Date</th></tr>
            </thead>
            <tbody>
              {filtered.map((resource) => (
                <tr key={resource.id} className="cursor-pointer border-t border-white/8 text-gray-300 hover:bg-white/5" onClick={() => setSelected(resource)}>
                  <td className="p-2">{resource.id}</td>
                  <td className="p-2">{resource.title}</td>
                  <td className="p-2">{resource.author}</td>
                  <td className="p-2">{resource.type}</td>
                  <td className="p-2">{resource.domains.map((domain) => `D${domain}`).join(', ')}</td>
                  <td className="p-2">{resource.status}</td>
                  <td className="p-2">{'★'.repeat(resource.rating)}</td>
                  <td className="p-2">{resource.difficulty}</td>
                  <td className="p-2">{new Date(resource.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-white/10 bg-black/45 p-4">
        <h2 className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">Reading Stats</h2>
        <canvas ref={statsCanvasRef} width={360} height={190} className="w-full max-w-xl rounded border border-white/10 bg-black/35" />
      </section>

      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="fixed bottom-0 right-0 top-0 z-40 w-full max-w-md overflow-y-auto border-l border-white/15 bg-black/95 p-4">
            <h2 className="mb-3 font-cinzel text-2xl text-[#e4ca87]">Add Resource</h2>
            <div className="space-y-2 text-sm">
              <input value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <input value={formData.author} onChange={(event) => setFormData((current) => ({ ...current, author: event.target.value }))} placeholder="Author" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <select value={formData.type} onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value as ResourceType }))} className="w-full rounded border border-white/20 bg-black/55 px-3 py-2">{TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select>
              <div className="flex flex-wrap gap-1">{masteryDomains.map((domain) => { const active = formData.domains.includes(domain.id); return <button key={domain.id} type="button" onClick={() => setFormData((current) => { const has = current.domains.includes(domain.id); const next = has ? current.domains.filter((item) => item !== domain.id) : current.domains.length < 3 ? [...current.domains, domain.id] : current.domains; return { ...current, domains: next }; })} className={`rounded-full border px-2 py-1 text-xs ${active ? 'border-[#c9a84c]/70 bg-[#c9a84c]/12 text-[#e4ca87]' : 'border-white/20 text-gray-300'}`}>D{domain.id}</button>; })}</div>
              <select value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as ResourceStatus }))} className="w-full rounded border border-white/20 bg-black/55 px-3 py-2">{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <label className="block">Rating {formData.rating}<input type="range" min={1} max={5} value={formData.rating} onChange={(event) => setFormData((current) => ({ ...current, rating: Number(event.target.value) }))} className="w-full" /></label>
              <input value={formData.url} onChange={(event) => setFormData((current) => ({ ...current, url: event.target.value }))} placeholder="URL" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <textarea value={formData.takeaway} onChange={(event) => setFormData((current) => ({ ...current, takeaway: event.target.value }))} placeholder="Personal Takeaway" className="h-24 w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <label className="block">Difficulty {formData.difficulty}<input type="range" min={1} max={5} value={formData.difficulty} onChange={(event) => setFormData((current) => ({ ...current, difficulty: Number(event.target.value) }))} className="w-full" /></label>
            </div>
            <div className="mt-4 flex gap-2"><button type="button" onClick={addResource} className="rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-3 py-1.5 text-[#e4ca87]">Save</button><button type="button" onClick={() => setFormOpen(false)} className="rounded border border-white/20 px-3 py-1.5 text-gray-300">Cancel</button></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4">
            <div className="grid w-full max-w-5xl gap-4 rounded-2xl border border-white/15 bg-black/92 p-5 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#102240] to-[#1c111e] p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">{selected.id}</div>
                <h3 className="font-cinzel text-2xl text-white">{selected.title}</h3>
                <p className="text-sm text-gray-400">{selected.author}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>Type: <span className="text-gray-300">{selected.type}</span></div>
                <div>Status: <span className="text-gray-300">{selected.status}</span></div>
                <div>Domains: <span className="text-gray-300">{selected.domains.map((domain) => `D${domain}`).join(', ')}</span></div>
                <div>Rating: <span className="text-[#e4ca87]">{'★'.repeat(selected.rating)}</span></div>
                <textarea value={selected.notes} onChange={(event) => updateResource({ ...selected, notes: event.target.value })} placeholder="Notes" className="h-24 w-full rounded border border-white/15 bg-black/55 p-2 text-xs" />
                <input value={selected.quotes[0] ?? ''} onChange={(event) => updateResource({ ...selected, quotes: [event.target.value, ...selected.quotes.slice(1, 5)] })} placeholder="Key Quote" className="w-full rounded border border-white/15 bg-black/55 p-2 text-xs" />
                <label className="block">Reading Progress {selected.progress}%<input type="range" min={0} max={100} value={selected.progress} onChange={(event) => updateResource({ ...selected, progress: Number(event.target.value) })} className="w-full" /></label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updateResource({ ...selected, status: 'Currently Studying' })} className="rounded border border-white/20 px-2 py-1 text-xs">Start Reading</button>
                  <button type="button" onClick={() => updateResource({ ...selected, status: 'Completed', progress: 100 })} className="rounded border border-[#c9a84c]/70 px-2 py-1 text-xs text-[#e4ca87]">Mark Complete</button>
                  <button type="button" onClick={() => setSelected(null)} className="rounded border border-white/20 px-2 py-1 text-xs">Close</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSerendipity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle,#000000_20%,#1f1a12_65%,#000000_100%)]">
            <div className="text-center">
              <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="font-cinzel text-4xl text-[#e4ca87]">{showSerendipity.title}</motion.h2>
              <p className="mt-2 text-gray-300">{showSerendipity.author}</p>
              <button type="button" onClick={() => { setSelected(showSerendipity); setShowSerendipity(null); }} className="mt-6 rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-4 py-2 text-[#e4ca87]">
                Accept the Journey
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Observatory;
