import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [show, setShow] = useState<boolean>(() => !sessionStorage.getItem('codex_loaded'));
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 1800);
    const doneTimer = window.setTimeout(() => {
      sessionStorage.setItem('codex_loaded', 'true');
      setShow(false);
    }, 2200);

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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-[1200] flex flex-col items-center justify-center gap-10 bg-[#020617] backdrop-blur-3xl"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-[#c9a84c]/40"
        />
        {/* Inner pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-2 rounded-full border-2 border-[var(--codex-primary)]/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        />
        {/* Core Diamond */}
        <motion.div
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rotate-45 bg-gradient-to-tr from-[#c9a84c] to-[var(--codex-primary)] shadow-[0_0_25px_rgba(201,168,76,0.6)]"
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <h2 className="font-cinzel text-2xl font-bold tracking-[0.2em] text-white">
          OMNIVERSAL <span className="text-[#c9a84c]">CODEX</span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.2, y: 0 }}
                animate={{ opacity: 1, y: -4 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.15 }}
                className="h-1.5 w-1.5 rounded-full bg-[var(--codex-primary)]"
              />
            ))}
          </div>
          <span className="text-xs uppercase tracking-widest text-[var(--codex-text-muted)]">
            Awaiting Initialization
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
