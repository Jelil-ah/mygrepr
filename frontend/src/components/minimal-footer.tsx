'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Clock, Heart, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function MinimalFooter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 py-3 px-6',
        'border-t backdrop-blur-sm',
        isDark
          ? 'bg-background/90 border-border'
          : 'bg-white/90 border-slate-200'
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
        {/* Copyright */}
        <span className="flex items-center gap-1">
          © 2026 Jelil Ahounou. All rights reserved. Made with{' '}
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          {' '}and{' '}
          <Code className="h-3 w-3" />
        </span>

        {/* Clock */}
        <span className="flex items-center gap-1.5 font-mono tabular-nums">
          <Clock className="h-3.5 w-3.5" />
          {time}
        </span>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors',
            'border text-muted-foreground',
            isDark
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-foreground'
              : 'bg-slate-100 border-slate-200 hover:bg-slate-200 hover:text-foreground'
          )}
        >
          <ArrowUp className="h-3 w-3" />
          Back to top
        </button>
      </div>
    </footer>
  );
}
