import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Topic } from '../types';
import { useShareProgress } from '../contexts/ShareProgressContext';
import { appendActivity, DOMAIN_COLORS } from '../utils/codex';

interface AccordionProps {
  topic: Topic;
  defaultOpen?: boolean;
  index: number;
  domainId: number;
}

const Accordion: React.FC<AccordionProps> = ({ topic, defaultOpen = false, index, domainId }) => {
  const { isReadOnly, sharedProgress } = useShareProgress();
  const accent = DOMAIN_COLORS[domainId] ?? '#c9a84c';
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [checkedPoints, setCheckedPoints] = useState<Set<number>>(new Set());
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const completion = useMemo(() => {
    if (topic.points.length === 0) return 0;
    return (checkedPoints.size / topic.points.length) * 100;
  }, [checkedPoints, topic.points.length]);

  useEffect(() => {
    const checked = new Set<number>();
    topic.points.forEach((_, pointIdx) => {
      const key = `codex_d${domainId}_s${index}_p${pointIdx}`;
      const value = isReadOnly ? sharedProgress[key] : localStorage.getItem(key);
      if (value === 'true') checked.add(pointIdx);
    });
    setCheckedPoints(checked);
  }, [domainId, index, isReadOnly, sharedProgress, topic.points]);

  useEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.scrollHeight);
  }, [isOpen, checkedPoints, topic.points.length]);

  useEffect(() => {
    const collapse = (): void => setIsOpen(false);
    window.addEventListener('codex-collapse-all', collapse as EventListener);
    return () => window.removeEventListener('codex-collapse-all', collapse as EventListener);
  }, []);

  const togglePoint = (pointIdx: number): void => {
    if (isReadOnly) return;
    const key = `codex_d${domainId}_s${index}_p${pointIdx}`;
    const updated = new Set(checkedPoints);
    if (updated.has(pointIdx)) {
      updated.delete(pointIdx);
      localStorage.removeItem(key);
    } else {
      updated.add(pointIdx);
      localStorage.setItem(key, 'true');
      appendActivity('subject', [domainId], `Completed subject in Domain ${domainId}`);
    }
    setCheckedPoints(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const ringRadius = 17;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference - (completion / 100) * circumference;

  return (
    <div
      className="glass-panel relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:border-[var(--codex-primary)]/45"
      style={{ borderLeftColor: accent, borderLeftWidth: '4px' }}
    >

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative z-10 flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
      >
        <div className="min-w-0">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Subject Cluster {String(index + 1).padStart(2, '0')}</div>
          <h3 className="mt-1 truncate text-lg font-semibold text-[var(--codex-text-strong)]">{topic.title}</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <svg viewBox="0 0 44 44" className="h-10 w-10 -rotate-90">
              <circle cx="22" cy="22" r={ringRadius} fill="none" stroke="rgba(127, 145, 184, 0.24)" strokeWidth="3" />
              <circle
                cx="22"
                cy="22"
                r={ringRadius}
                fill="none"
                stroke={accent}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[var(--codex-text-soft)]">
              {checkedPoints.size}/{topic.points.length}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            style={{ color: accent }}
          />
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? contentHeight : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.8, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="border-t border-[var(--codex-border)] px-4 pb-4 pt-3">
          <ul className="grid gap-2 sm:grid-cols-2">
            {topic.points.map((point, pointIdx) => {
              const checked = checkedPoints.has(pointIdx);
              return (
                <motion.li
                  key={point}
                  className="subject-row rounded-lg px-2 py-2 transition hover:bg-white/10 active:bg-white/20"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pointIdx * 0.06, duration: 0.18 }}
                >
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--codex-text)]">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isReadOnly}
                      onChange={() => togglePoint(pointIdx)}
                      className="mt-0.5 h-4 w-4 rounded border-[var(--codex-border)] bg-transparent"
                      style={{ accentColor: accent }}
                    />
                    <span className={checked ? 'text-[#c9a84c] line-through' : ''}>{point}</span>
                  </label>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Accordion;
