'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--editorial-bg)] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-6xl font-bold text-indigo-600 mb-4">404</p>
        <h1 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">{t('notfound.title')}</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 max-w-sm">
          {t('notfound.description')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t('notfound.back')}
        </Link>
      </div>
    </div>
  );
}
