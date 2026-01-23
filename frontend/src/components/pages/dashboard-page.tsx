'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, isPostNew, getDataFreshness } from '@/lib/utils';
import { Post, CATEGORY_COLORS } from '@/types/post';
import { getETFInsights } from '@/lib/nocodb';
import { FileText, TrendingUp, DollarSign, BarChart3, ChevronDown, ArrowUp, MessageSquare, ArrowRight, Heart, Award, Sparkles, Clock, ExternalLink } from 'lucide-react';
import { ETFComparison } from '@/components/dashboard/etf-comparison';
import { PostDetail } from '@/components/dashboard/post-detail';
import { isPostFavorite, togglePostFavorite, getFavorites } from '@/lib/favorites';
import Link from 'next/link';

interface DashboardPageProps {
  posts: Post[];
}

export function DashboardPage({ posts }: DashboardPageProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showETF, setShowETF] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState<Set<string>>(new Set());

  // Load favorites on mount
  useEffect(() => {
    const favorites = getFavorites();
    setFavoritePosts(new Set(favorites.posts));
  }, []);

  // Data freshness
  const freshness = useMemo(() => getDataFreshness(posts), [posts]);

  const handleToggleFavorite = (e: React.MouseEvent, redditId: string) => {
    e.stopPropagation(); // Prevent opening post detail
    const isNowFavorite = togglePostFavorite(redditId);
    setFavoritePosts(prev => {
      const newSet = new Set(prev);
      if (isNowFavorite) {
        newSet.add(redditId);
      } else {
        newSet.delete(redditId);
      }
      return newSet;
    });
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalMontant = posts.reduce((sum, p) => sum + (p.montant_total || p.montant_max || 0), 0);

    // Count posts that mention ETFs using text search
    const etfInsights = getETFInsights(posts);
    const postsWithETF = new Set<string>();
    etfInsights.forEach(etf => {
      etf.posts.forEach(p => postsWithETF.add(p.reddit_id));
    });
    const etfMentions = postsWithETF.size;

    const avgScore = posts.length > 0
      ? Math.round(posts.reduce((sum, p) => sum + (p.score || 0), 0) / posts.length)
      : 0;

    return { totalPosts, totalMontant, etfMentions, avgScore };
  }, [posts]);

  // Dynamic insights
  const dynamicInsights = useMemo(() => {
    // Most active category
    const categoryCounts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.category) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      }
    });
    const topCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0];

    // Average patrimoine (from posts that have it)
    const postsWithPatrimoine = posts.filter(p => p.patrimoine && p.patrimoine > 0);
    const avgPatrimoine = postsWithPatrimoine.length > 0
      ? Math.round(postsWithPatrimoine.reduce((sum, p) => sum + (p.patrimoine || 0), 0) / postsWithPatrimoine.length)
      : 0;

    // Average age of authors
    const postsWithAge = posts.filter(p => p.age_auteur && p.age_auteur > 0);
    const avgAge = postsWithAge.length > 0
      ? Math.round(postsWithAge.reduce((sum, p) => sum + (p.age_auteur || 0), 0) / postsWithAge.length)
      : 0;

    // Best advice (from most upvoted post with key_advice)
    const postsWithAdvice = posts.filter(p => p.key_advice);
    const bestAdvicePost = postsWithAdvice.sort((a, b) => (b.score || 0) - (a.score || 0))[0];

    return {
      topCategory: topCategory ? { name: topCategory[0], count: topCategory[1] } : null,
      avgPatrimoine,
      avgAge,
      bestAdvicePost,
    };
  }, [posts]);

  const formatMontant = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M€`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K€`;
    return `${n}€`;
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <main className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">

          <h1
            className="text-3xl font-bold mb-2 font-sans text-foreground"
          >
            Dashboard
          </h1>
          <p
            className="text-sm font-sans text-muted-foreground"
          >
            Vue d'ensemble des conseils financiers Reddit
          </p>
          {/* Freshness indicator */}
          <div className={cn(
            'flex items-center gap-2 mt-2 text-xs',
            freshness.hoursAgo < 24 ? 'text-green-500' : freshness.hoursAgo < 72 ? 'text-amber-500' : 'text-muted-foreground'
          )}>
            <Clock className="w-3 h-3" />
            <span>{freshness.label}</span>
            {freshness.hoursAgo < 24 && (
              <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-medium">
                Frais
              </span>
            )}
          </div>
        </div>

        {/* Two Collapsible Sections - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 items-start">

          {/* Stats Summary - Collapsible */}
          <div className="rounded-xl border overflow-hidden border-border bg-card">
            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <span className="text-sm font-medium flex items-center gap-2 text-foreground">
                <BarChart3 className="w-4 h-4 text-primary" />
                Statistiques
                <span className="text-xs text-muted-foreground ml-1">{stats.totalPosts} posts</span>
              </span>
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                showStats && 'rotate-180'
              )} />
            </button>
            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-lg font-bold">{stats.totalPosts}</p>
                          <p className="text-xs text-muted-foreground">Posts analysés</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-lg font-bold">{stats.etfMentions}</p>
                          <p className="text-xs text-muted-foreground">Mentionnent ETF</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-lg font-bold">{formatMontant(stats.totalMontant)}</p>
                          <p className="text-xs text-muted-foreground">Montants cités</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-lg font-bold">{stats.avgScore}</p>
                          <p className="text-xs text-muted-foreground">Upvotes moyen</p>
                        </div>
                      </div>
                    </div>
                    {dynamicInsights.topCategory && (
                      <div className="pt-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Top: <strong className="text-foreground">{dynamicInsights.topCategory.name}</strong> ({dynamicInsights.topCategory.count})</span>
                        {dynamicInsights.avgAge > 0 && <span>Âge moy: <strong className="text-foreground">{dynamicInsights.avgAge} ans</strong></span>}
                        {dynamicInsights.avgPatrimoine > 0 && <span>Patrimoine moy: <strong className="text-foreground">{formatMontant(dynamicInsights.avgPatrimoine)}</strong></span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ETF Mentions - Collapsible */}
          <div
            id="etf-comparison"
            className="rounded-xl border overflow-hidden border-border bg-card"
          >
            <button
              onClick={() => setShowETF(!showETF)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <span className="text-sm font-medium flex items-center gap-2 text-foreground">
                <TrendingUp className="w-4 h-4 text-green-500" />
                ETF mentionnés
                <span className="text-xs text-muted-foreground ml-1">{stats.etfMentions} posts</span>
              </span>
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                showETF && 'rotate-180'
              )} />
            </button>
            <AnimatePresence>
              {showETF && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <ETFComparison posts={posts} onPostClick={handlePostClick} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Best Advice Highlight */}
        {dynamicInsights.bestAdvicePost && (
          <div
            className="p-4 rounded-xl border mb-8 cursor-pointer hover:border-emerald-500/50 transition-colors border-border bg-card"
            onClick={() => handlePostClick(dynamicInsights.bestAdvicePost!)}
          >
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-500 uppercase tracking-wide font-medium">Conseil le plus upvoté</span>
                  <span className="text-xs text-muted-foreground">{dynamicInsights.bestAdvicePost.score} upvotes</span>
                </div>
                <p className="text-sm font-medium line-clamp-2">{dynamicInsights.bestAdvicePost.key_advice}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">— {dynamicInsights.bestAdvicePost.title}</p>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-500/50 shrink-0" />
            </div>
          </div>
        )}

        {/* Recent Posts - Main Content */}
        <div className="rounded-xl border p-5 border-border bg-card">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-primary" />
              Posts récents
            </h3>
            <Link
              href="/posts"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 8).map((post) => {
              const isFavorite = favoritePosts.has(post.reddit_id);
              return (
                <div
                  key={post.Id}
                  onClick={() => handlePostClick(post)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent/30 hover:border-primary/30 transition-all group cursor-pointer relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-medium text-white',
                            CATEGORY_COLORS[post.category] || 'bg-slate-500'
                          )}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          r/{post.subreddit}
                        </span>
                        {isPostNew(post.created_utc) && (
                          <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                            <Sparkles className="w-3 h-3" />
                            Nouveau
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors pr-8">
                        {post.title}
                      </h4>
                      {post.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {post.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.num_comments || 0}
                        </span>
                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Reddit
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Favorite button */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, post.reddit_id)}
                      className={cn(
                        'absolute top-4 right-4 p-1.5 rounded-md transition-colors',
                        isFavorite
                          ? 'text-red-500'
                          : 'text-muted-foreground/50 hover:text-red-500 opacity-0 group-hover:opacity-100'
                      )}
                      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {posts.length > 8 && (
            <div className="mt-4 text-center">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Voir les {posts.length - 8} autres posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Post Detail Modal */}
        <PostDetail
          post={selectedPost}
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      </div>
    </main>
  );
}
