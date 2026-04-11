// Centralized design tokens for Grepr
// Source colors and SourceBar swatches for the warm-paper editorial/cockpit system
// (vibes-v2 migration 2026-04-07)

// ─── Source (subreddit) colors ──────────────────────────────────
// Soft tinted pill — used by source tags in feed rows, hero, wire strip.
// Keys are normalized (lowercase, no "r/" prefix) to match data shape.
// 14-slot OKLCH-spaced palette covering all backend SUBREDDITS.
export const SOURCE_COLORS: Record<string, string> = {
  // Francophone
  'vosfinances':          'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  'vossous':              'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  // Europe
  'eupersonalfinance':    'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  'etfs_europe':          'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'ukpersonalfinance':    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  // Anglophone — ETF/Investing
  'bogleheads':           'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  'etfs':                 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  'investing':            'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  'portfolios':           'bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300',
  // Anglophone — Personal Finance
  'personalfinance':      'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  'financialindependence':'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
  'fire':                 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  'dividends':            'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
};

export const DEFAULT_SOURCE_COLOR = 'bg-stone-100 text-stone-700 dark:bg-stone-500/15 dark:text-stone-300';

export function getSourceColor(subreddit: string): string {
  return SOURCE_COLORS[subreddit?.toLowerCase()] || DEFAULT_SOURCE_COLOR;
}

// ─── Source bar colors ──────────────────────────────────────────
// Solid swatches paired with SOURCE_COLORS, used by <SourceBar />
// for proportional cross-community distribution visualization.
export const SOURCE_BAR_COLORS: Record<string, string> = {
  'vosfinances':          'bg-violet-500',
  'vossous':              'bg-blue-500',
  'eupersonalfinance':    'bg-orange-500',
  'etfs_europe':          'bg-emerald-500',
  'ukpersonalfinance':    'bg-amber-500',
  'bogleheads':           'bg-pink-500',
  'etfs':                 'bg-teal-500',
  'investing':            'bg-rose-500',
  'portfolios':           'bg-lime-500',
  'personalfinance':      'bg-sky-500',
  'financialindependence':'bg-fuchsia-500',
  'fire':                 'bg-cyan-500',
  'dividends':            'bg-indigo-500',
};

export const DEFAULT_SOURCE_BAR_COLOR = 'bg-stone-500';

export function getSourceBarColor(subreddit: string): string {
  return SOURCE_BAR_COLORS[subreddit?.toLowerCase()] || DEFAULT_SOURCE_BAR_COLOR;
}

// ─── Category colors ──────────────────────────────────────────
// Distinct color pairs for 16 AI-assigned categories.
// Used by category pills on feed rows, filter chips, dashboard.
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  'Stratégie ETF':       { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-500/15', darkText: 'dark:text-indigo-300' },
  'Allocation PEA':      { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-500/15', darkText: 'dark:text-blue-300' },
  'Épargne & Livrets':   { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-500/15', darkText: 'dark:text-emerald-300' },
  'Immobilier':          { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-500/15', darkText: 'dark:text-amber-300' },
  'Fiscalité':           { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-500/15', darkText: 'dark:text-rose-300' },
  'Crypto':              { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'dark:bg-orange-500/15', darkText: 'dark:text-orange-300' },
  'Assurance-vie':       { bg: 'bg-teal-100', text: 'text-teal-700', darkBg: 'dark:bg-teal-500/15', darkText: 'dark:text-teal-300' },
  'Conseil personnalisé':{ bg: 'bg-violet-100', text: 'text-violet-700', darkBg: 'dark:bg-violet-500/15', darkText: 'dark:text-violet-300' },
  'Budget & Frugalité':  { bg: 'bg-lime-100', text: 'text-lime-700', darkBg: 'dark:bg-lime-500/15', darkText: 'dark:text-lime-300' },
  'Bourse actions':      { bg: 'bg-sky-100', text: 'text-sky-700', darkBg: 'dark:bg-sky-500/15', darkText: 'dark:text-sky-300' },
  'Retraite & FIRE':     { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', darkBg: 'dark:bg-fuchsia-500/15', darkText: 'dark:text-fuchsia-300' },
  'Crédit & Dette':      { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-500/15', darkText: 'dark:text-red-300' },
  'Avis communautaire':  { bg: 'bg-cyan-100', text: 'text-cyan-700', darkBg: 'dark:bg-cyan-500/15', darkText: 'dark:text-cyan-300' },
  'Macro & Actualité':   { bg: 'bg-pink-100', text: 'text-pink-700', darkBg: 'dark:bg-pink-500/15', darkText: 'dark:text-pink-300' },
  'Carrière & Revenus':  { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-500/15', darkText: 'dark:text-purple-300' },
  'Autre':               { bg: 'bg-stone-100', text: 'text-stone-700', darkBg: 'dark:bg-stone-500/15', darkText: 'dark:text-stone-300' },
};

const DEFAULT_CATEGORY_COLOR = { bg: 'bg-stone-100', text: 'text-stone-700', darkBg: 'dark:bg-stone-500/15', darkText: 'dark:text-stone-300' };

export function getCategoryColor(category: string): string {
  const c = CATEGORY_COLORS[category] || DEFAULT_CATEGORY_COLOR;
  return `${c.bg} ${c.text} ${c.darkBg} ${c.darkText}`;
}
