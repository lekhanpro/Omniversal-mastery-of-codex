import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { quotes } from '../quotes-data';

const QuotesRotator: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const currentQuote = quotes[currentIndex];

  return (
    <div className="relative min-h-[300px] flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl font-serif text-gray-100 mb-6 leading-relaxed">
            "{currentQuote.text}"
          </p>
          <p className="text-lg text-gray-400 mb-3">
            — {currentQuote.author}
          </p>
          <span className="inline-block px-4 py-1.5 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-neon-blue text-sm font-mono">
            {currentQuote.domain}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-dark-card border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-dark-card border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 mt-6">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 6000);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-neon-blue w-8' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuotesRotator;
