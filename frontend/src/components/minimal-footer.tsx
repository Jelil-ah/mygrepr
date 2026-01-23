'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Clock, Heart, Code } from 'lucide-react';

export function MinimalFooter() {
  const [time, setTime] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl backdrop-blur-sm border bg-card/95 border-border shadow-lg">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {/* Copyright */}
        <span className="flex items-center gap-1.5">
          © 2026 Jelil Ahounou. All rights reserved. Made with{' '}
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          {' '}and{' '}
          <Code className="h-3 w-3" />
        </span>

        <span className="w-px h-4 bg-border" />

        {/* Clock */}
        <span className="flex items-center gap-1.5 font-mono tabular-nums">
          <Clock className="h-3.5 w-3.5" />
          {time}
        </span>

        <span className="w-px h-4 bg-border" />

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to top</span>
        </button>
      </div>
    </footer>
  );
}
