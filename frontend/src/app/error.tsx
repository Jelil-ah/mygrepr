'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('error.title');
  }, [t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--editorial-bg)] px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-stone-900 dark:text-stone-100">{t('error.title')}</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
          {t('error.description')}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t('error.retry')}
        </button>
      </div>
    </div>
  );
}
