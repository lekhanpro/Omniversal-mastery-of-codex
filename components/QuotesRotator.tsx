import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { quotes } from '../quotes-data';

const QuotesRotator: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const pauseAuto = (): void => {
    setIsPaused(true);
    window.setTimeout(() => setIsPaused(false), 6000);
  };

  const handlePrev = (): void => {
    pauseAuto();
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleNext = (): void => {
    pauseAuto();
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const currentQuote = quotes[currentIndex];

  return (
    <div className="relative flex min-h-[300px] flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-6 font-cinzel text-2xl leading-relaxed text-[var(--codex-text-strong)] md:text-3xl">
            "{currentQuote.text}"
          </p>
          <p className="mb-3 text-lg text-[var(--codex-text-soft)]">- {currentQuote.author}</p>
          <span className="inline-block rounded-full border border-[var(--codex-primary)]/35 bg-[var(--codex-primary)]/10 px-4 py-1.5 text-sm font-mono text-[var(--codex-primary)]">
            {currentQuote.domain}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="glass-button flex h-12 w-12 items-center justify-center rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="glass-button flex h-12 w-12 items-center justify-center rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setCurrentIndex(idx);
              pauseAuto();
            }}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'w-8 bg-[var(--codex-primary)]'
                : 'w-2 bg-[rgba(var(--codex-border-rgb),0.48)] hover:bg-[var(--codex-primary)]/65'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuotesRotator;
