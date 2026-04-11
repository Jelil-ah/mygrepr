'use client';

import { cn } from '@/lib/utils';

interface EyebrowProps {
  label: string;
  as?: 'h2' | 'h3' | 'h4' | 'span';
  className?: string;
}

export function Eyebrow({ label, as: Tag = 'span', className }: EyebrowProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Tag className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
        {label}
      </Tag>
      <span className="h-px w-12 bg-indigo-600/40" aria-hidden="true" />
    </div>
  );
}
