export type Locale = 'fr' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.explore': 'Explorer',
    'nav.etf': 'ETF',
    'nav.toggle_theme': 'Changer le theme',
    'nav.logout': 'Deconnexion',
    'nav.login': 'Connexion',
    'nav.open_menu': 'Ouvrir le menu',
    'nav.close_menu': 'Fermer le menu',

    // Footer
    'footer.copyright': '\u00a9 2026 Jelil Ahounou. Intelligence financiere par IA, extraite de Reddit.',
    'footer.about': 'A propos',

    // Dashboard
    'dashboard.posts': 'Posts',
    'dashboard.subreddits': 'Subreddits',
    'dashboard.new_one': 'nouveau',
    'dashboard.new_many': 'nouveaux',
    'dashboard.featured': 'A la une',
    'dashboard.latest_posts': 'Derniers posts',
    'dashboard.see_all': 'Voir tout',
    'dashboard.see_full_ranking': 'Voir le classement complet',
    'dashboard.discussed_in': 'Discute dans',
    'dashboard.live': 'En direct',
    'dashboard.top_etfs': 'Top 5 ETF',
    'dashboard.last_update': 'Derniere maj',
    'dashboard.section_data': 'Donnees',
    'dashboard.active_sources': 'Sources actives',
    'dashboard.total_posts': 'Total posts',

    // Posts page
    'posts.period': 'Periode',
    'posts.all': 'Tout',
    'posts.7days': '7 jours',
    'posts.30days': '30 jours',
    'posts.90days': '90 jours',
    'posts.language': 'Langue',
    'posts.lang_all': 'Tous',
    'posts.lang_fr': 'Francais',
    'posts.lang_en': 'Anglais',
    'posts.categories': 'Categories',
    'posts.sources': 'Sources',
    'posts.clear_filters': 'Effacer les filtres',
    'posts.search_placeholder': 'Rechercher dans les titres et resumes...',
    'posts.sort_quality': 'Pertinents',
    'posts.sort_score': 'Plus votes',
    'posts.sort_date': 'Plus recents',
    'posts.sort_confidence': 'Fiabilite',
    'posts.feed': 'Fil',
    'posts.no_results': 'Aucun post trouve.',
    'posts.load_more': 'Voir plus ({count} restants)',
    'posts.filters': 'Filtres',
    'posts.clear_all': 'Tout effacer',
    'posts.apply': 'Appliquer',

    // ETF page
    'etf.title': 'Classement ETF',
    'etf.subtitle': 'ETF les plus mentionnes par la communaute Reddit francophone',
    'etf.tracked': 'ETF suivis',
    'etf.mentions': 'Mentions',
    'etf.positive_sentiment': 'Sentiment positif',
    'etf.ranking': 'Classement',
    'etf.filter_all': 'Tous',
    'etf.col_rank': '#',
    'etf.col_ticker': 'Ticker',
    'etf.col_provider': 'Fournisseur',
    'etf.col_mentions': 'Mentions',
    'etf.col_sentiment': 'Sentiment',
    'etf.col_ter': 'TER',
    'etf.col_eligible': 'Eligible',
    'etf.col_isin': 'ISIN',
    'etf.col_link': 'Lien',
    'etf.copy_isin': 'Copier ISIN',
    'etf.view_justetf': 'Voir sur justETF',
    'etf.no_results': 'Aucun ETF trouve pour ce filtre.',
    'etf.sentiment_positive': 'Positif',
    'etf.sentiment_neutral': 'Neutre',
    'etf.sentiment_mixed': 'Divise',
    'etf.legend_click': 'Cliquer sur une ligne pour voir les details',

    // Post article
    'article.back': 'Retour aux posts',
    'article.consensus': 'Consensus',
    'article.consensus_fort': 'La communaute est largement d\'accord sur ce sujet',
    'article.consensus_moyen': 'Opinions globalement alignees avec quelques nuances',
    'article.consensus_faible': 'Peu de commentaires pour etablir un consensus',
    'article.consensus_divise': 'La communaute est divisee sur ce sujet',
    'article.votes': 'votes',
    'article.comments': 'commentaires',
    'article.ai_summary': 'Resume IA',
    'article.key_advice': 'Conseil cle',
    'article.financial_data': 'Donnees financieres',
    'article.patrimoine': 'Patrimoine',
    'article.annual_income': 'Revenus annuels',
    'article.age': 'Age',
    'article.max_amount': 'Montant max',
    'article.years': 'ans',
    'article.original_content': 'Contenu original',
    'article.top_comment': 'Meilleur commentaire',
    'article.view_reddit': 'Voir sur Reddit',
    'article.share': 'Partager',
    'article.copied': 'Copie !',
    'article.stats': 'Statistiques',
    'article.published': 'Publie',
    'article.ratio': 'Ratio',
    'article.tags': 'Tags',
    'article.etfs_mentioned': 'ETFs mentionnes',
    'article.similar': 'Similaires',

    // About page
    'about.title': 'A propos de Grepr',
    'about.subtitle': 'Intelligence financiere par IA, extraite des communautes Reddit',
    'about.what_is': 'Qu\'est-ce que Grepr ?',
    'about.desc1': 'Grepr agregge et analyse les conseils financiers des communautes Reddit francophones et anglophones.',
    'about.desc2': 'Notre objectif : faire remonter les meilleures pratiques d\'investissement, les ETFs populaires et les strategies recommandees par la communaute.',
    'about.desc3': 'L\'analyse est realisee par Groq AI (LLaMA 3.3 70B) pour la categorisation et les resumes.',
    'about.feat_aggregation': 'Agregation Reddit',
    'about.feat_aggregation_desc': 'Collecte automatique depuis r/vosfinances, r/Bogleheads et d\'autres communautes finance.',
    'about.feat_ai': 'Analyse IA',
    'about.feat_ai_desc': 'Categorisation intelligente, resumes et extraction de conseils cles via Groq AI.',
    'about.feat_etf': 'Base ETF',
    'about.feat_etf_desc': '40+ ETFs avec detection automatique des tickers dans les posts.',
    'about.feat_dashboard': 'Tableau de bord',
    'about.feat_dashboard_desc': 'Interface moderne pour explorer les tendances, comparer les ETFs et decouvrir les meilleurs conseils.',
    'about.technologies': 'Technologies',
    'about.disclaimer': 'Ce projet a un but educatif. Les informations presentees ne constituent pas un conseil financier.',

    // Utils
    'utils.just_now': 'a l\'instant',
    'utils.min_ago': 'il y a {n}min',
    'utils.hours_ago': 'il y a {n}h',
    'utils.days_ago': 'il y a {n}j',
    'utils.weeks_ago': 'il y a {n}sem',
    'utils.months_ago': 'il y a {n}mois',
    'utils.no_data': 'Aucune donnee',
    'utils.all_periods': 'Toutes periodes',
    'utils.updated_less_1h': 'Mis a jour il y a moins d\'1h',
    'utils.updated_hours': 'Mis a jour il y a {n}h',
    'utils.updated_days': 'Mis a jour il y a {n}j',
    'utils.confidence_high': 'Fiable',
    'utils.confidence_medium': 'Modere',
    'utils.confidence_low': 'Faible',

    // Email gate
    'gate.title': 'Accede a Grepr',
    'gate.subtitle': 'Entre ton email pour continuer',
    'gate.placeholder': 'ton@email.com',
    'gate.submit': 'Continuer',
    'gate.loading': 'Envoi...',
    'gate.error_invalid': 'Email invalide',
    'gate.error_generic': 'Erreur. Reessaie.',
    'gate.privacy': 'On utilise ton email uniquement pour te tenir au courant.',

    // Accessibility
    'a11y.skip_nav': 'Aller au contenu principal',

    // Dashboard
    'dashboard.value_prop': 'Intelligence financiere par IA, extraite des communautes Reddit francophones et anglophones.',

    // ETF
    'etf.legend': 'Legende',
    'etf.dialog_description': 'Details et statistiques de l\'ETF selectionne',
    'etf.copy_ticker': 'Copier le ticker',
    'etf.table_caption': 'Classement des ETF par nombre de mentions Reddit',

    // Login
    'login.title': 'Connexion',
    'login.subtitle': 'Connectez-vous pour acceder a Grepr',
    'login.google': 'Continuer avec Google',
    'login.error': 'Erreur d\'authentification. Veuillez reessayer.',
    'login.error_config': 'Erreur de configuration. Contactez l\'administrateur.',

    // 404
    'notfound.title': 'Page introuvable',
    'notfound.description': 'La page que vous cherchez n\'existe pas ou a ete deplacee.',
    'notfound.back': 'Retour a l\'accueil',

    // Error
    'error.title': 'Une erreur est survenue',
    'error.description': 'Quelque chose s\'est mal passe. Veuillez reessayer.',
    'error.retry': 'Reessayer',

    // Posts
    'posts.page_title': 'Explorer les posts',
    'posts.search_label': 'Rechercher des posts',
    'posts.clear_search': 'Effacer la recherche',
    'posts.filter_count': '{count} posts affiches',
    'posts.period_filter': 'Filtrer par periode',
    'posts.language_filter': 'Filtrer par langue',
    'posts.sort_filter': 'Trier les resultats',
    'posts.category_filter': 'Filtrer par categorie',
    'posts.source_filter': 'Filtrer par source',

    // Article
    'article.sidebar': 'Informations du post',
    'article.related_title': 'Posts similaires',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.explore': 'Explore',
    'nav.etf': 'ETF',
    'nav.toggle_theme': 'Toggle theme',
    'nav.logout': 'Log out',
    'nav.login': 'Log in',
    'nav.open_menu': 'Open menu',
    'nav.close_menu': 'Close menu',

    // Footer
    'footer.copyright': '\u00a9 2026 Jelil Ahounou. AI-powered financial intelligence from Reddit.',
    'footer.about': 'About',

    // Dashboard
    'dashboard.posts': 'Posts',
    'dashboard.subreddits': 'Subreddits',
    'dashboard.new_one': 'new',
    'dashboard.new_many': 'new',
    'dashboard.featured': 'Featured',
    'dashboard.latest_posts': 'Latest posts',
    'dashboard.see_all': 'See all',
    'dashboard.see_full_ranking': 'See full rankings',
    'dashboard.discussed_in': 'Discussed in',
    'dashboard.live': 'Live',
    'dashboard.top_etfs': 'Top 5 ETFs',
    'dashboard.last_update': 'Last update',
    'dashboard.section_data': 'Data',
    'dashboard.active_sources': 'Active sources',
    'dashboard.total_posts': 'Total posts',

    // Posts page
    'posts.period': 'Period',
    'posts.all': 'All',
    'posts.7days': '7 days',
    'posts.30days': '30 days',
    'posts.90days': '90 days',
    'posts.language': 'Language',
    'posts.lang_all': 'All',
    'posts.lang_fr': 'French',
    'posts.lang_en': 'English',
    'posts.categories': 'Categories',
    'posts.sources': 'Sources',
    'posts.clear_filters': 'Clear filters',
    'posts.search_placeholder': 'Search titles and summaries...',
    'posts.sort_quality': 'Best reads',
    'posts.sort_score': 'Most voted',
    'posts.sort_date': 'Most recent',
    'posts.sort_confidence': 'Reliability',
    'posts.feed': 'Feed',
    'posts.no_results': 'No posts found.',
    'posts.load_more': 'Load more ({count} remaining)',
    'posts.filters': 'Filters',
    'posts.clear_all': 'Clear all',
    'posts.apply': 'Apply',

    // ETF page
    'etf.title': 'ETF Rankings',
    'etf.subtitle': 'Most mentioned ETFs by the Reddit finance community',
    'etf.tracked': 'ETFs tracked',
    'etf.mentions': 'Mentions',
    'etf.positive_sentiment': 'Positive sentiment',
    'etf.ranking': 'Rankings',
    'etf.filter_all': 'All',
    'etf.col_rank': '#',
    'etf.col_ticker': 'Ticker',
    'etf.col_provider': 'Provider',
    'etf.col_mentions': 'Mentions',
    'etf.col_sentiment': 'Sentiment',
    'etf.col_ter': 'TER',
    'etf.col_eligible': 'Eligible',
    'etf.col_isin': 'ISIN',
    'etf.col_link': 'Link',
    'etf.copy_isin': 'Copy ISIN',
    'etf.view_justetf': 'View on justETF',
    'etf.no_results': 'No ETF found for this filter.',
    'etf.sentiment_positive': 'Positive',
    'etf.sentiment_neutral': 'Neutral',
    'etf.sentiment_mixed': 'Mixed',
    'etf.legend_click': 'Click a row for details',

    // Post article
    'article.back': 'Back to posts',
    'article.consensus': 'Consensus',
    'article.consensus_fort': 'The community largely agrees on this topic',
    'article.consensus_moyen': 'Generally aligned opinions with some nuance',
    'article.consensus_faible': 'Too few comments to establish consensus',
    'article.consensus_divise': 'The community is divided on this topic',
    'article.votes': 'votes',
    'article.comments': 'comments',
    'article.ai_summary': 'AI Summary',
    'article.key_advice': 'Key advice',
    'article.financial_data': 'Financial data',
    'article.patrimoine': 'Net worth',
    'article.annual_income': 'Annual income',
    'article.age': 'Age',
    'article.max_amount': 'Max amount',
    'article.years': 'yo',
    'article.original_content': 'Original content',
    'article.top_comment': 'Top comment',
    'article.view_reddit': 'View on Reddit',
    'article.share': 'Share',
    'article.copied': 'Copied!',
    'article.stats': 'Statistics',
    'article.published': 'Posted',
    'article.ratio': 'Ratio',
    'article.tags': 'Tags',
    'article.etfs_mentioned': 'ETFs mentioned',
    'article.similar': 'Similar',

    // About page
    'about.title': 'About Grepr',
    'about.subtitle': 'AI-powered financial intelligence from Reddit communities',
    'about.what_is': 'What is Grepr?',
    'about.desc1': 'Grepr aggregates and analyzes financial advice from French and English Reddit communities.',
    'about.desc2': 'Our goal: surface the best investment practices, popular ETFs, and community-recommended strategies.',
    'about.desc3': 'Analysis is powered by Groq AI (LLaMA 3.3 70B) for categorization and summaries.',
    'about.feat_aggregation': 'Reddit Aggregation',
    'about.feat_aggregation_desc': 'Automated collection from r/vosfinances, r/Bogleheads and other finance communities.',
    'about.feat_ai': 'AI Analysis',
    'about.feat_ai_desc': 'Smart categorization, summaries and key advice extraction via Groq AI.',
    'about.feat_etf': 'ETF Database',
    'about.feat_etf_desc': '40+ ETFs with automatic ticker detection in posts.',
    'about.feat_dashboard': 'Dashboard',
    'about.feat_dashboard_desc': 'Modern interface to explore trends, compare ETFs and discover the best advice.',
    'about.technologies': 'Technologies',
    'about.disclaimer': 'This project is educational. The information presented does not constitute financial advice.',

    // Utils
    'utils.just_now': 'just now',
    'utils.min_ago': '{n}min ago',
    'utils.hours_ago': '{n}h ago',
    'utils.days_ago': '{n}d ago',
    'utils.weeks_ago': '{n}w ago',
    'utils.months_ago': '{n}mo ago',
    'utils.no_data': 'No data',
    'utils.all_periods': 'All periods',
    'utils.updated_less_1h': 'Updated less than 1h ago',
    'utils.updated_hours': 'Updated {n}h ago',
    'utils.updated_days': 'Updated {n}d ago',
    'utils.confidence_high': 'Reliable',
    'utils.confidence_medium': 'Moderate',
    'utils.confidence_low': 'Low',

    // Email gate
    'gate.title': 'Access Grepr',
    'gate.subtitle': 'Enter your email to continue',
    'gate.placeholder': 'you@email.com',
    'gate.submit': 'Continue',
    'gate.loading': 'Sending...',
    'gate.error_invalid': 'Invalid email',
    'gate.error_generic': 'Error. Try again.',
    'gate.privacy': 'We only use your email to keep you posted.',

    // Accessibility
    'a11y.skip_nav': 'Skip to main content',

    // Dashboard
    'dashboard.value_prop': 'AI-powered financial intelligence from French and English Reddit communities.',

    // ETF
    'etf.legend': 'Legend',
    'etf.dialog_description': 'Details and statistics for the selected ETF',
    'etf.copy_ticker': 'Copy ticker',
    'etf.table_caption': 'ETF ranking by Reddit mention count',

    // Login
    'login.title': 'Log in',
    'login.subtitle': 'Sign in to access Grepr',
    'login.google': 'Continue with Google',
    'login.error': 'Authentication error. Please try again.',
    'login.error_config': 'Configuration error. Contact the administrator.',

    // 404
    'notfound.title': 'Page not found',
    'notfound.description': 'The page you are looking for does not exist or has been moved.',
    'notfound.back': 'Back to home',

    // Error
    'error.title': 'Something went wrong',
    'error.description': 'An error occurred. Please try again.',
    'error.retry': 'Try again',

    // Posts
    'posts.page_title': 'Explore posts',
    'posts.search_label': 'Search posts',
    'posts.clear_search': 'Clear search',
    'posts.filter_count': '{count} posts shown',
    'posts.period_filter': 'Filter by period',
    'posts.language_filter': 'Filter by language',
    'posts.sort_filter': 'Sort results',
    'posts.category_filter': 'Filter by category',
    'posts.source_filter': 'Filter by source',

    // Article
    'article.sidebar': 'Post information',
    'article.related_title': 'Similar posts',
  },
};

export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  let str = translations[locale][key] || translations['fr'][key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
