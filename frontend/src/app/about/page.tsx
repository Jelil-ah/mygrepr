'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Github, ExternalLink, TrendingUp, Brain, Database, Zap } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Agrégation Reddit',
    description: 'Collecte automatique des meilleurs posts de r/vosfinances, r/Bogleheads et autres communautés finance.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Brain,
    title: 'Analyse IA',
    description: 'Catégorisation intelligente, résumés et extraction des conseils clés via LLM local.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Database,
    title: 'ETF Database',
    description: 'Base de données de 40+ ETF avec détection automatique des tickers mentionnés.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Zap,
    title: 'Dashboard Temps Réel',
    description: 'Interface moderne pour explorer les tendances, comparer les ETF et découvrir les meilleurs conseils.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
];

const techStack = [
  { name: 'Next.js 15', category: 'Frontend' },
  { name: 'React 19', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Framer Motion', category: 'Animations' },
  { name: 'Python', category: 'Backend' },
  { name: 'PRAW', category: 'Reddit API' },
  { name: 'LM Studio', category: 'AI Local' },
  { name: 'NocoDB', category: 'Database' },
];

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className={cn(
              'text-4xl font-bold mb-4 font-sans',
              isDark ? 'text-slate-100' : 'text-slate-900'
            )}
          >
            À propos de Grepr
          </h1>
          <p
            className={cn(
              'text-lg font-sans max-w-2xl mx-auto',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            Agrégateur intelligent de conseils financiers Reddit avec analyse IA
          </p>
        </motion.div>

        {/* What is Grepr */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'p-6 rounded-xl border mb-8',
            isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
          )}
        >
          <h2
            className={cn(
              'text-xl font-semibold mb-4 font-sans',
              isDark ? 'text-slate-100' : 'text-slate-900'
            )}
          >
            Qu'est-ce que Grepr?
          </h2>
          <div className={cn('space-y-3 font-sans text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>
            <p>
              Grepr est un projet personnel qui agrège et analyse les conseils financiers des communautés Reddit francophones et anglophones.
            </p>
            <p>
              L'objectif est de faciliter la découverte des meilleures pratiques d'investissement, ETF populaires, et stratégies recommandées par la communauté.
            </p>
            <p>
              Toutes les analyses sont effectuées localement via LM Studio - aucune donnée n'est envoyée vers des services cloud.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={cn(
                  'p-5 rounded-xl border',
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                )}
              >
                <div className={cn('p-2 rounded-lg w-fit mb-3', feature.bg)}>
                  <Icon className={cn('h-5 w-5', feature.color)} />
                </div>
                <h3
                  className={cn(
                    'font-semibold mb-2 font-sans',
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  )}
                >
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    'text-sm font-sans',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'p-6 rounded-xl border mb-8',
            isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
          )}
        >
          <h2
            className={cn(
              'text-xl font-semibold mb-4 font-sans',
              isDark ? 'text-slate-100' : 'text-slate-900'
            )}
          >
            Stack Technique
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-sans',
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                )}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="https://github.com/Jelil-ah/grepr"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border font-sans text-sm transition-colors',
              isDark
                ? 'border-slate-700 hover:border-slate-500 text-slate-300'
                : 'border-slate-200 hover:border-slate-400 text-slate-700'
            )}
          >
            <Github className="h-4 w-4" />
            GitHub
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
          <a
            href="https://reddit.com/r/vosfinances"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border font-sans text-sm transition-colors',
              isDark
                ? 'border-slate-700 hover:border-slate-500 text-slate-300'
                : 'border-slate-200 hover:border-slate-400 text-slate-700'
            )}
          >
            r/vosfinances
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={cn(
            'text-center text-xs font-sans mt-8',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}
        >
          Ce projet est à but éducatif. Les informations présentées ne constituent pas des conseils financiers.
        </motion.p>
      </div>
    </main>
  );
}
