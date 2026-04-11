'use client';

import { ETFInsight } from '@/lib/etf-data';
import { Post } from '@/types/post';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Star,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

interface ETFDetailDialogProps {
  etf: ETFInsight | null;
  open: boolean;
  onClose: () => void;
  onPostClick: (post: Post) => void;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `${diffDays}j`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}m`;
  return `${Math.floor(diffDays / 365)}a`;
}

export function ETFDetailDialog({ etf, open, onClose, onPostClick }: ETFDetailDialogProps) {
  const [copiedISIN, setCopiedISIN] = useState(false);
  const { t } = useLanguage();

  if (!etf) return null;

  const copyISIN = () => {
    navigator.clipboard.writeText(etf.isin);
    setCopiedISIN(true);
    setTimeout(() => setCopiedISIN(false), 2000);
  };

  const sortedPosts = [...etf.posts].sort((a, b) => (b.score || 0) - (a.score || 0));
  const isPopular = etf.sentiment === 'positive' && etf.mentions >= 2;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] p-0 gap-0 overflow-hidden" showCloseButton={true}>
        <ScrollArea className="max-h-[85vh]">
          <div className="px-6 py-6">
            {/* Header compact */}
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-2">
                  {isPopular && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                  <DialogTitle className="text-xl">{etf.ticker}</DialogTitle>
                  <DialogDescription className="sr-only">{t('etf.dialog_description')}</DialogDescription>
                  <Badge
                    className={`text-xs ${
                      etf.eligible === 'PEA'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-violet-500/20 text-violet-400'
                    }`}
                  >
                    {etf.eligible}
                  </Badge>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400">{etf.name}</p>
            </DialogHeader>

            {/* Info compacte en ligne */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4">
              <span className="text-stone-500 dark:text-stone-400">
                {etf.provider}
              </span>
              <span className={`font-mono ${
                parseFloat(etf.ter) <= 0.25 ? 'text-emerald-400' :
                parseFloat(etf.ter) <= 0.4 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {etf.ter}
              </span>
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                <TrendingUp className="h-3 w-3" />
                {etf.mentions} mentions
              </span>
            </div>

            {/* ISIN copiable */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--warm-hover)] mb-4">
              <code className="text-xs font-mono flex-1">{etf.isin}</code>
              <button
                onClick={copyISIN}
                className="p-1.5 hover:bg-[var(--paper-bg)] rounded transition-colors"
              >
                {copiedISIN ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                )}
              </button>
            </div>

            {/* Description courte */}
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">{etf.description}</p>

            {/* Liens */}
            <div className="flex gap-2 mb-6">
              <a
                href={`https://www.justetf.com/fr/find-etf.html?query=${etf.isin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                justETF
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(etf.ticker + ' ETF')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm bg-[var(--warm-hover)] hover:bg-[var(--warm-hover)] rounded-lg transition-colors"
              >
                Google
              </a>
            </div>

            <Separator className="mb-4" />

            {/* Posts Reddit - liste simple */}
            <h3 className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
              Posts ({etf.posts.length})
            </h3>

            <div className="space-y-2">
              {sortedPosts.slice(0, 8).map((post) => (
                <button
                  key={post.Id}
                  onClick={() => {
                    onPostClick(post);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-[var(--warm-hover)] transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1 shrink-0">
                      <ArrowUpRight className="h-3 w-3" />
                      {post.score}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-stone-400 dark:text-stone-500">
                        <span>r/{post.subreddit}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_a)}</span>
                        {post.num_comments && (
                          <>
                            <span>•</span>
                            <MessageSquare className="h-3 w-3" />
                            <span>{post.num_comments}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {etf.posts.length > 8 && (
                <p className="text-xs text-stone-400 dark:text-stone-500 text-center py-2">
                  + {etf.posts.length - 8} autres
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
