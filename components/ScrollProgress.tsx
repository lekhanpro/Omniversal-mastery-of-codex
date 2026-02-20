import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[999] h-0.5 bg-gradient-to-r from-[var(--codex-primary)] via-[#c9a84c] to-[var(--codex-primary-soft)] transition-all duration-100"
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

export default ScrollProgress;
