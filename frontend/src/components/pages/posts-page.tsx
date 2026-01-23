'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, isPostNew, getPostLanguage, getDataFreshness } from '@/lib/utils';
import { Post, CATEGORIES, CATEGORY_COLORS } from '@/types/post';
import { Search, X, MessageSquare, ArrowUp, Filter, LayoutGrid, List, Clock, Sparkles } from 'lucide-react';
import { PostDetail } from '@/components/dashboard/post-detail';

interface PostsPageProps {
  posts: Post[];
}

export function PostsPage({ posts }: PostsPageProps) {
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
    <main className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">

          <h1
            className={cn(
              'text-3xl font-bold mb-2 font-sans',
              'text-foreground'
            )}
          >
            Posts
          </h1>
          <p
            className={cn(
              'text-sm font-sans',
              'text-muted-foreground'
            )}
          >
            Parcourez les conseils financiers de Reddit
          </p>
          {/* Freshness indicator */}
          <div className={cn(
            'flex items-center gap-2 mt-2 text-xs',
            freshness.hoursAgo < 24 ? 'text-green-500' : 'text-muted-foreground'
          )}>
            <Clock className="w-3 h-3" />
            <span>{freshness.label}</span>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">

          <div className="relative flex-1">
            <Search
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                'text-muted-foreground'
              )}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border font-sans text-sm bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border font-sans text-sm bg-card border-border text-muted-foreground',
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans text-sm text-red-500 bg-red-50 dark:bg-red-500/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2.5',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground'
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
                    : 'bg-card text-muted-foreground'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {/* Language filter */}
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={cn(
                  'px-3 py-2 text-xs font-medium',
                  selectedLanguage === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground'
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
                    : 'bg-card text-muted-foreground'
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
                    : 'bg-card text-muted-foreground'
                )}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>

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
                className="p-4 rounded-xl border bg-card border-border"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Categories */}
                  <div>
                    <h4
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wide mb-3 font-sans',
                        'text-muted-foreground'
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
                                : 'bg-muted text-muted-foreground hover:bg-accent'
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
                        'text-muted-foreground'
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
                                : 'bg-muted text-muted-foreground hover:bg-accent'
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
            'text-muted-foreground'
          )}
        >
          {filteredPosts.length} résultats
        </p>

        {/* Posts Grid/List */}
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          )}
        >
          {filteredPosts.map((post) => (
            <div
              key={post.Id}
              onClick={() => setSelectedPost(post)}
              className={cn(
                'rounded-xl border cursor-pointer transition-all bg-card border-border hover:border-primary/30 hover:-translate-y-0.5',
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
                        'text-muted-foreground'
                      )}
                    >
                      r/{post.subreddit}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      'font-medium text-sm mb-2 line-clamp-2 font-sans',
                      'text-foreground'
                    )}
                  >
                    {post.title}
                  </h3>

                  {post.summary && (
                    <p
                      className={cn(
                        'text-xs line-clamp-2 mb-3 font-sans',
                        'text-muted-foreground'
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
                          'text-muted-foreground'
                        )}
                      >
                        <ArrowUp className="w-3 h-3" />
                        {post.score}
                      </span>
                      <span
                        className={cn(
                          'flex items-center gap-1',
                          'text-muted-foreground'
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
                        'text-foreground'
                      )}
                    >
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-sans shrink-0">
                    <span
                      className={cn(
                        'flex items-center gap-1',
                        'text-muted-foreground'
                      )}
                    >
                      <ArrowUp className="w-3 h-3" />
                      {post.score}
                    </span>
                    <span
                      className={cn(
                        'text-muted-foreground'
                      )}
                    >
                      r/{post.subreddit}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetail
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filteredPosts.length - 1}
        currentIndex={currentIndex}
        totalCount={filteredPosts.length}
      />
    </main>
  );
}
