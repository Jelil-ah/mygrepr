import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'à l\'instant';
  if (diffMins < 60) return `il y a ${diffMins}min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  if (diffWeeks < 4) return `il y a ${diffWeeks}sem`;
  return `il y a ${diffMonths}mois`;
}

// Check if a post is new (< 24h old)
export function isPostNew(createdUtc: number | undefined): boolean {
  if (!createdUtc) return false;
  const now = Date.now() / 1000; // Convert to seconds
  const diffHours = (now - createdUtc) / 3600;
  return diffHours < 24;
}

// French subreddits list
const FRENCH_SUBREDDITS = ['vosfinances', 'vossous'];

// Get post language based on subreddit
export function getPostLanguage(subreddit: string | undefined): 'fr' | 'en' {
  if (!subreddit) return 'en';
  return FRENCH_SUBREDDITS.includes(subreddit.toLowerCase()) ? 'fr' : 'en';
}

// Get data freshness info
export function getDataFreshness(posts: { created_utc?: number }[]): {
  mostRecentDate: Date | null;
  hoursAgo: number;
  label: string;
} {
  if (!posts.length) {
    return { mostRecentDate: null, hoursAgo: Infinity, label: 'Aucune donnée' };
  }

  const validPosts = posts.filter(p => p.created_utc);
  if (!validPosts.length) {
    return { mostRecentDate: null, hoursAgo: Infinity, label: 'Date inconnue' };
  }

  const mostRecent = Math.max(...validPosts.map(p => p.created_utc!));
  const mostRecentDate = new Date(mostRecent * 1000);
  const hoursAgo = (Date.now() / 1000 - mostRecent) / 3600;

  let label: string;
  if (hoursAgo < 1) {
    label = 'Mis à jour il y a moins d\'1h';
  } else if (hoursAgo < 24) {
    label = `Mis à jour il y a ${Math.round(hoursAgo)}h`;
  } else {
    const daysAgo = Math.round(hoursAgo / 24);
    label = `Mis à jour il y a ${daysAgo}j`;
  }

  return { mostRecentDate, hoursAgo, label };
}
