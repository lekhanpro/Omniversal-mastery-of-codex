import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [show, setShow] = useState<boolean>(() => !sessionStorage.getItem('codex_loaded'));
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 1600);
    const doneTimer = window.setTimeout(() => {
      sessionStorage.setItem('codex_loaded', 'true');
      setShow(false);
    }, 2000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-[1200] flex flex-col items-center justify-center gap-8 bg-[var(--codex-bg)] backdrop-blur-3xl"
    >
      <svg viewBox="0 0 220 220" className="h-28 w-28">
        <motion.path
          d="M110 18 L136 78 L202 86 L150 128 L165 196 L110 160 L55 196 L70 128 L18 86 L84 78 Z"
          fill="transparent"
          stroke="#c9a84c"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>

      <div className="h-2 w-64 overflow-hidden rounded-full border border-[var(--codex-gold)]/40 bg-[var(--codex-text)]/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[#7f6426] via-[#c9a84c] to-[#f6dc93]"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      <p className="font-serif text-lg tracking-wide text-[#d7b97a]">Initializing the Codex...</p>
    </motion.div>
  );
};

export default LoadingScreen;
