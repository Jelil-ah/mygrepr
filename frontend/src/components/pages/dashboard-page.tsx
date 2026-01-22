'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn, isPostNew, getDataFreshness } from '@/lib/utils';
import { Post, CATEGORY_COLORS } from '@/types/post';
import { getETFInsights } from '@/lib/nocodb';
import { FileText, TrendingUp, DollarSign, BarChart3, ChevronDown, ArrowUp, MessageSquare, ArrowRight, Heart, Flame, Award, Users, Sparkles, Clock } from 'lucide-react';
import { TopTendances } from '@/components/dashboard/top-tendances';
import { ETFComparison } from '@/components/dashboard/etf-comparison';
import { PostDetail } from '@/components/dashboard/post-detail';
import { isPostFavorite, togglePostFavorite, getFavorites } from '@/lib/favorites';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface DashboardPageProps {
  posts: Post[];
}

export function DashboardPage({ posts }: DashboardPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [highlightETF, setHighlightETF] = useState(false);
  const [showTopPosts, setShowTopPosts] = useState(false);
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

    // Top ETF mentioned
    const etfInsights = getETFInsights(posts);
    const topETF = etfInsights.length > 0 ? etfInsights[0] : null;

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

    // Most discussed post (by comments)
    const mostDiscussed = [...posts].sort((a, b) => (b.num_comments || 0) - (a.num_comments || 0))[0];

    return {
      topCategory: topCategory ? { name: topCategory[0], count: topCategory[1] } : null,
      topETF,
      avgPatrimoine,
      avgAge,
      bestAdvicePost,
      mostDiscussed,
    };
  }, [posts]);

  const formatMontant = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M€`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K€`;
    return `${n}€`;
  };

  const scrollToETF = () => {
    const etfSection = document.getElementById('etf-comparison');
    if (etfSection) {
      etfSection.scrollIntoView({ behavior: 'smooth' });
      setHighlightETF(true);
      setTimeout(() => setHighlightETF(false), 2000);
    }
  };

  const statCards = [
    {
      label: 'Posts analysés',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-blue-500',
      description: 'Posts Reddit analysés par IA',
      onClick: undefined,
    },
    {
      label: 'Mentionnent ETF',
      value: stats.etfMentions,
      icon: TrendingUp,
      color: 'text-green-500',
      description: 'Cliquez pour voir les ETF mentionnés',
      onClick: scrollToETF,
    },
    {
      label: '€ mentionnés',
      value: formatMontant(stats.totalMontant),
      icon: DollarSign,
      color: 'text-yellow-500',
      description: 'Montants cités dans les posts (épargne, investissement...)',
      onClick: undefined,
    },
    {
      label: 'Upvotes moyen',
      value: stats.avgScore,
      icon: BarChart3,
      color: 'text-purple-500',
      description: 'Popularité moyenne des posts sur Reddit',
      onClick: undefined,
    },
  ];

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className={cn(
              'text-3xl font-bold mb-2 font-sans',
              isDark ? 'text-slate-100' : 'text-slate-900'
            )}
          >
            Dashboard
          </h1>
          <p
            className={cn(
              'text-sm font-sans',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            Vue d'ensemble des conseils financiers Reddit
          </p>
          {/* Freshness indicator */}
          <div className={cn(
            'flex items-center gap-2 mt-2 text-xs',
            freshness.hoursAgo < 24 ? 'text-green-500' : freshness.hoursAgo < 72 ? 'text-amber-500' : 'text-slate-500'
          )}>
            <Clock className="w-3 h-3" />
            <span>{freshness.label}</span>
            {freshness.hoursAgo < 24 && (
              <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-medium">
                Frais
              </span>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={stat.onClick}
                className={cn(
                  'p-5 rounded-xl border group',
                  stat.onClick ? 'cursor-pointer' : 'cursor-help',
                  isDark
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-white border-slate-200',
                  stat.onClick && 'hover:border-green-500/50'
                )}
                title={stat.description}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn('w-4 h-4', stat.color)} />
                  <span
                    className={cn(
                      'text-xs font-sans uppercase tracking-wide',
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    )}
                  >
                    {stat.label}
                  </span>
                </div>
                <p
                  className={cn(
                    'text-2xl font-bold font-sans mb-1',
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  )}
                >
                  {stat.value}
                </p>
                <p
                  className={cn(
                    'text-[10px] font-sans leading-tight opacity-0 group-hover:opacity-100 transition-opacity',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}
                >
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Hot Category */}
          {dynamicInsights.topCategory && (
            <div
              className={cn(
                'p-4 rounded-xl border',
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Catégorie populaire</span>
              </div>
              <p className="font-semibold">{dynamicInsights.topCategory.name}</p>
              <p className="text-xs text-muted-foreground">{dynamicInsights.topCategory.count} posts</p>
            </div>
          )}

          {/* Top ETF */}
          {dynamicInsights.topETF && (
            <div
              className={cn(
                'p-4 rounded-xl border cursor-pointer hover:border-primary/50 transition-colors',
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              )}
              onClick={scrollToETF}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">ETF tendance</span>
              </div>
              <p className="font-semibold">{dynamicInsights.topETF.ticker}</p>
              <p className="text-xs text-muted-foreground">{dynamicInsights.topETF.mentions} mentions</p>
            </div>
          )}

          {/* Average Patrimoine */}
          {dynamicInsights.avgPatrimoine > 0 && (
            <div
              className={cn(
                'p-4 rounded-xl border',
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Patrimoine moyen</span>
              </div>
              <p className="font-semibold">{formatMontant(dynamicInsights.avgPatrimoine)}</p>
              <p className="text-xs text-muted-foreground">discuté dans les posts</p>
            </div>
          )}

          {/* Average Age */}
          {dynamicInsights.avgAge > 0 && (
            <div
              className={cn(
                'p-4 rounded-xl border',
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Âge moyen</span>
              </div>
              <p className="font-semibold">{dynamicInsights.avgAge} ans</p>
              <p className="text-xs text-muted-foreground">des auteurs</p>
            </div>
          )}
        </motion.div>

        {/* Best Advice Highlight */}
        {dynamicInsights.bestAdvicePost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={cn(
              'p-4 rounded-xl border mb-8 cursor-pointer hover:border-primary/50 transition-colors',
              isDark ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/30' : 'bg-gradient-to-r from-emerald-50 to-transparent border-emerald-200'
            )}
            onClick={() => handlePostClick(dynamicInsights.bestAdvicePost!)}
          >
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide font-medium">Conseil le plus upvoté</span>
                  <span className="text-xs text-muted-foreground">⬆️ {dynamicInsights.bestAdvicePost.score}</span>
                </div>
                <p className="text-sm font-medium line-clamp-2">{dynamicInsights.bestAdvicePost.key_advice}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">— {dynamicInsights.bestAdvicePost.title}</p>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-500/50 shrink-0" />
            </div>
          </motion.div>
        )}

        {/* Collapsible Sections - Side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
        >
          {/* Top Posts - Collapsible */}
          <div className={cn(
            'rounded-xl border overflow-hidden',
            isDark ? 'bg-card border-border' : 'bg-white border-slate-200'
          )}>
            <button
              onClick={() => setShowTopPosts(!showTopPosts)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <span className={cn(
                'text-sm font-medium flex items-center gap-2',
                isDark ? 'text-foreground' : 'text-slate-700'
              )}>
                <TrendingUp className="w-4 h-4 text-primary" />
                Posts populaires
              </span>
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                showTopPosts && 'rotate-180'
              )} />
            </button>
            <AnimatePresence>
              {showTopPosts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <TopTendances posts={posts} onPostClick={handlePostClick} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ETF Mentions - Collapsible */}
          <div
            id="etf-comparison"
            className={cn(
              'rounded-xl border overflow-hidden transition-shadow duration-300',
              isDark ? 'bg-card border-border' : 'bg-white border-slate-200',
              highlightETF && 'ring-2 ring-green-500 ring-offset-2'
            )}
          >
            <button
              onClick={() => setShowETF(!showETF)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <span className={cn(
                'text-sm font-medium flex items-center gap-2',
                isDark ? 'text-foreground' : 'text-slate-700'
              )}>
                <BarChart3 className="w-4 h-4 text-primary" />
                ETF mentionnés
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
        </motion.div>

        {/* Recent Posts - Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'rounded-xl border p-5',
            isDark ? 'bg-card border-border' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn(
              'text-lg font-semibold flex items-center gap-2',
              isDark ? 'text-foreground' : 'text-slate-900'
            )}>
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
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            CATEGORY_COLORS[post.category] || 'bg-slate-500'
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          r/{post.subreddit}
                        </span>
                        {isPostNew(post.created_utc) && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                              <Sparkles className="w-3 h-3" />
                              Nouveau
                            </span>
                          </>
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
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                Voir les {posts.length - 8} autres posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

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
