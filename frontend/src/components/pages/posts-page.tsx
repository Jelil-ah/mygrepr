'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn, isPostNew, getPostLanguage, getDataFreshness } from '@/lib/utils';
import { Post, CATEGORIES, CATEGORY_COLORS } from '@/types/post';
import { Search, X, ChevronLeft, ChevronRight, ExternalLink, MessageSquare, ArrowUp, Calendar, Filter, LayoutGrid, List, Globe, Clock, Sparkles } from 'lucide-react';

interface PostsPageProps {
  posts: Post[];
}

export function PostsPage({ posts }: PostsPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'fr' | 'en'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Data freshness
  const freshness = useMemo(() => getDataFreshness(posts), [posts]);

  // Category stats
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return CATEGORIES.map((cat) => ({ category: cat, count: counts[cat] || 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  // Subreddit stats
  const subredditStats = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.subreddit) {
        counts[p.subreddit] = (counts[p.subreddit] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([subreddit, count]) => ({ subreddit, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category || '');

      const matchesSubreddit =
        selectedSubreddits.length === 0 || selectedSubreddits.includes(p.subreddit || '');

      const matchesLanguage =
        selectedLanguage === 'all' || getPostLanguage(p.subreddit) === selectedLanguage;

      return matchesSearch && matchesCategory && matchesSubreddit && matchesLanguage;
    });
  }, [posts, searchQuery, selectedCategories, selectedSubreddits, selectedLanguage]);

  // Navigation
  const currentIndex = selectedPost
    ? filteredPosts.findIndex((p) => p.Id === selectedPost.Id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedPost(filteredPosts[currentIndex - 1]);
    }
  }, [currentIndex, filteredPosts]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredPosts.length - 1) {
      setSelectedPost(filteredPosts[currentIndex + 1]);
    }
  }, [currentIndex, filteredPosts]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSubreddit = (sub: string) => {
    setSelectedSubreddits((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubreddits([]);
    setSelectedLanguage('all');
    setSearchQuery('');
  };

  const hasFilters = selectedCategories.length > 0 || selectedSubreddits.length > 0 || selectedLanguage !== 'all' || searchQuery;

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1
            className={cn(
              'text-3xl font-bold mb-2 font-sans',
              isDark ? 'text-slate-100' : 'text-slate-900'
            )}
          >
            Posts
          </h1>
          <p
            className={cn(
              'text-sm font-sans',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            Parcourez les conseils financiers de Reddit
          </p>
          {/* Freshness indicator */}
          <div className={cn(
            'flex items-center gap-2 mt-2 text-xs',
            freshness.hoursAgo < 24 ? 'text-green-500' : 'text-slate-500'
          )}>
            <Clock className="w-3 h-3" />
            <span>{freshness.label}</span>
          </div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <div className="relative flex-1">
            <Search
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg border font-sans text-sm',
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              )}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border font-sans text-sm',
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700',
                showFilters && 'border-primary text-primary'
              )}
            >
              <Filter className="w-4 h-4" />
              Filtres
              {hasFilters && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  {selectedCategories.length + selectedSubreddits.length + (searchQuery ? 1 : 0)}
                </span>
              )}
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans text-sm text-red-500',
                  isDark ? 'bg-red-500/10' : 'bg-red-50'
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex rounded-lg overflow-hidden border dark:border-slate-700 border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2.5',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-slate-800/50 text-slate-400'
                      : 'bg-white text-slate-500'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2.5',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-slate-800/50 text-slate-400'
                      : 'bg-white text-slate-500'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {/* Language filter */}
            <div className="flex rounded-lg overflow-hidden border dark:border-slate-700 border-slate-200">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={cn(
                  'px-3 py-2 text-xs font-medium',
                  selectedLanguage === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-slate-800/50 text-slate-400'
                      : 'bg-white text-slate-500'
                )}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedLanguage('fr')}
                className={cn(
                  'px-3 py-2 text-xs font-medium flex items-center gap-1',
                  selectedLanguage === 'fr'
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-slate-800/50 text-slate-400'
                      : 'bg-white text-slate-500'
                )}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={cn(
                  'px-3 py-2 text-xs font-medium flex items-center gap-1',
                  selectedLanguage === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                      ? 'bg-slate-800/50 text-slate-400'
                      : 'bg-white text-slate-500'
                )}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div
                className={cn(
                  'p-4 rounded-xl border',
                  isDark
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-white border-slate-200'
                )}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Categories */}
                  <div>
                    <h4
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wide mb-3 font-sans',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      Catégories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categoryStats.map(({ category, count }) => {
                        const isSelected = selectedCategories.includes(category);
                        return (
                          <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-sans transition-all',
                              isSelected
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : isDark
                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            )}
                          >
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full',
                                CATEGORY_COLORS[category] || 'bg-slate-500'
                              )}
                            />
                            {category}
                            <span className="text-xs opacity-60">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subreddits */}
                  <div>
                    <h4
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wide mb-3 font-sans',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      Sources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {subredditStats.map(({ subreddit, count }) => {
                        const isSelected = selectedSubreddits.includes(subreddit);
                        return (
                          <button
                            key={subreddit}
                            onClick={() => toggleSubreddit(subreddit)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-sans transition-all',
                              isSelected
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : isDark
                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            )}
                          >
                            r/{subreddit}
                            <span className="text-xs opacity-60">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p
          className={cn(
            'text-sm font-sans mb-4',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          {filteredPosts.length} résultats
        </p>

        {/* Posts Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            viewMode === 'grid'
              ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          )}
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedPost(post)}
              className={cn(
                'rounded-xl border cursor-pointer transition-all',
                isDark
                  ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  : 'bg-white border-slate-200 hover:border-slate-300',
                viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center gap-4'
              )}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-sans',
                          CATEGORY_COLORS[post.category || ''] || 'bg-slate-500',
                          'text-white'
                        )}
                      >
                        {post.category}
                      </div>
                      {isPostNew(post.created_utc) && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-sans bg-amber-500 text-white">
                          <Sparkles className="w-3 h-3" />
                          Nouveau
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-sans',
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      )}
                    >
                      r/{post.subreddit}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      'font-medium text-sm mb-2 line-clamp-2 font-sans',
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    )}
                  >
                    {post.title}
                  </h3>

                  {post.summary && (
                    <p
                      className={cn(
                        'text-xs line-clamp-2 mb-3 font-sans',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      {post.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex items-center gap-1',
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        )}
                      >
                        <ArrowUp className="w-3 h-3" />
                        {post.score}
                      </span>
                      <span
                        className={cn(
                          'flex items-center gap-1',
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        )}
                      >
                        <MessageSquare className="w-3 h-3" />
                        {post.num_comments}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-sans',
                        CATEGORY_COLORS[post.category || ''] || 'bg-slate-500',
                        'text-white'
                      )}
                    >
                      {post.category}
                    </div>
                    {isPostNew(post.created_utc) && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-sans bg-amber-500 text-white">
                        <Sparkles className="w-3 h-3" />
                        New
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'font-medium text-sm truncate font-sans',
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      )}
                    >
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-sans shrink-0">
                    <span
                      className={cn(
                        'flex items-center gap-1',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      <ArrowUp className="w-3 h-3" />
                      {post.score}
                    </span>
                    <span
                      className={cn(
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      )}
                    >
                      r/{post.subreddit}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedPost(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className={cn(
                'fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto rounded-2xl border',
                isDark
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white border-slate-200'
              )}
            >
              {/* Modal Header */}
              <div
                className={cn(
                  'sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-md',
                  isDark
                    ? 'bg-slate-900/90 border-slate-700'
                    : 'bg-white/90 border-slate-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex <= 0}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isDark
                        ? 'hover:bg-slate-800 disabled:opacity-30'
                        : 'hover:bg-slate-100 disabled:opacity-30'
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span
                    className={cn(
                      'text-sm font-sans',
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    )}
                  >
                    {currentIndex + 1} / {filteredPosts.length}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex >= filteredPosts.length - 1}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isDark
                        ? 'hover:bg-slate-800 disabled:opacity-30'
                        : 'hover:bg-slate-100 disabled:opacity-30'
                    )}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-sans',
                      CATEGORY_COLORS[selectedPost.category || ''] || 'bg-slate-500',
                      'text-white'
                    )}
                  >
                    {selectedPost.category}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-sans',
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    )}
                  >
                    r/{selectedPost.subreddit}
                  </span>
                </div>

                <h2
                  className={cn(
                    'text-xl font-bold mb-4 font-sans',
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  )}
                >
                  {selectedPost.title}
                </h2>

                {selectedPost.summary && (
                  <div
                    className={cn(
                      'p-4 rounded-lg mb-4',
                      isDark ? 'bg-slate-800/50' : 'bg-slate-100'
                    )}
                  >
                    <p
                      className={cn(
                        'text-sm font-sans',
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      )}
                    >
                      {selectedPost.summary}
                    </p>
                  </div>
                )}

                {/* ETFs */}
                {selectedPost.etf_detected && selectedPost.etf_detected.length > 0 && (
                  <div className="mb-4">
                    <h4
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wide mb-2 font-sans',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      ETFs mentionnés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.etf_detected.map((etf) => (
                        <span
                          key={etf}
                          className={cn(
                            'px-2 py-1 rounded text-xs font-sans',
                            isDark
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-700'
                          )}
                        >
                          {etf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Link */}
                {selectedPost.url && (
                  <a
                    href={selectedPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans',
                      'bg-primary text-primary-foreground hover:brightness-110 transition-all'
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir sur Reddit
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
