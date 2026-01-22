'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { BarChart3, FileText, Settings, User, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/posts', label: 'Posts', icon: FileText },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

// Spring physics for smooth animations
const SMOOTH_SPRING = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 22,
  mass: 1,
};

const MORPH_TRANSITION = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Handle scroll state
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on scroll
  React.useEffect(() => {
    if (isMobileMenuOpen && isScrolled) {
      setIsMobileMenuOpen(false);
    }
  }, [isScrolled, isMobileMenuOpen]);

  // Only check theme after mounting to prevent hydration mismatch
  const isDark = mounted && theme === 'dark';

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pt-2 sm:pt-4 pointer-events-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...SMOOTH_SPRING, delay: 0.1 }}
    >
      <motion.nav
        layout
        className={cn(
          'flex flex-col pointer-events-auto relative overflow-hidden',
          'backdrop-blur-md border bg-card/90 border-border',
          isScrolled
            ? 'rounded-full py-2 px-3 shadow-xl'
            : 'rounded-2xl py-3 px-4 shadow-lg'
        )}
        animate={{
          width: isScrolled ? 'auto' : '100%',
          maxWidth: isScrolled ? 500 : 800,
        }}
        transition={MORPH_TRANSITION}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Name */}
          <Link
            href="/"
            className="flex items-center shrink-0 relative hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            {/* Logo */}
            <div
              className={cn(
                'rounded-lg overflow-hidden ring-2 shrink-0 transition-all duration-500 flex items-center justify-center',
                'bg-primary ring-primary/50',
                isScrolled ? 'w-7 h-7' : 'w-9 h-9'
              )}
            >
              <span
                className={cn(
                  'font-bold text-primary-foreground transition-all duration-500',
                  isScrolled ? 'text-xs' : 'text-sm'
                )}
              >
                G
              </span>
            </div>

            {/* Name - fades out when scrolled */}
            <span
              className={cn(
                'font-bold whitespace-nowrap hidden sm:block ml-3 transition-all duration-500 font-sans',
                isDark ? 'text-slate-100' : 'text-slate-900',
                isScrolled ? 'opacity-0 w-0 ml-0' : 'opacity-100'
              )}
            >
              GREPR
            </span>
          </Link>

          {/* Center: Nav Items */}
          <ul
            className={cn(
              'hidden md:flex items-center justify-center flex-1 transition-all duration-500',
              isScrolled ? 'gap-1' : 'gap-2'
            )}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center justify-center rounded-full transition-all duration-300 py-2',
                      isActive
                        ? 'text-primary'
                        : isDark
                          ? 'text-slate-300 hover:text-primary/80'
                          : 'text-slate-700 hover:text-primary',
                      isScrolled ? 'px-2' : 'px-4'
                    )}
                  >
                    {/* Active indicator pill */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className={cn(
                          'absolute inset-0 rounded-full',
                          isDark ? 'bg-primary/15' : 'bg-primary/10'
                        )}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 shrink-0 relative z-10" />
                    <span
                      className={cn(
                        'text-sm font-medium whitespace-nowrap transition-all duration-500 overflow-hidden relative z-10 font-sans',
                        isScrolled ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-2'
                      )}
                    >
                      {item.label}
                    </span>
                    {/* Active dot when collapsed */}
                    {isActive && isScrolled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Theme + Profile + Mobile Menu */}
          <div
            className={cn(
              'flex items-center transition-all duration-500',
              isScrolled ? 'gap-1' : 'gap-2'
            )}
          >
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={cn(
                'flex items-center justify-center rounded-full transition-all duration-500 shrink-0 hover:scale-110 active:scale-90',
                isDark
                  ? 'text-yellow-400 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100',
                isScrolled ? 'w-7 h-7' : 'w-9 h-9'
              )}
            >
              <motion.div
                className="transition-transform duration-500"
                animate={{ rotate: isDark ? 0 : 180 }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </button>

            {/* Profile Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  'flex items-center justify-center rounded-full transition-all duration-500 shrink-0 hover:scale-105 active:scale-95',
                  'bg-gradient-to-br from-primary to-primary/60',
                  isScrolled ? 'w-7 h-7' : 'w-9 h-9'
                )}
              >
                <User className="w-4 h-4 text-primary-foreground" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        'absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 py-1 border',
                        isDark
                          ? 'bg-slate-900 border-slate-700'
                          : 'bg-white border-slate-200'
                      )}
                    >
                      <div className={cn(
                        'px-4 py-3 border-b',
                        isDark ? 'border-slate-700' : 'border-slate-200'
                      )}>
                        <p className={cn(
                          'text-sm font-medium font-sans',
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        )}>Jelil</p>
                        <p className={cn(
                          'text-xs font-sans',
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        )}>jelil@grepr.app</p>
                      </div>
                      <Link
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-2 text-sm font-sans',
                          isDark
                            ? 'hover:bg-slate-800 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </Link>
                      <button
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-2 text-sm font-sans text-red-500',
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        )}
                        onClick={() => setProfileOpen(false)}
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden flex items-center justify-center rounded-full transition-all duration-500 shrink-0 active:scale-90',
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-slate-100',
                isScrolled ? 'w-7 h-7' : 'w-9 h-9'
              )}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div
                className={cn(
                  'pt-4 pb-2 border-t mt-3',
                  isDark ? 'border-slate-700' : 'border-slate-200'
                )}
              >
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-sans',
                            isActive
                              ? isDark
                                ? 'bg-primary/10 text-primary'
                                : 'bg-primary/10 text-primary'
                              : isDark
                                ? 'text-slate-300 hover:bg-slate-800'
                                : 'text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                  {/* Settings in mobile menu */}
                  <li>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-sans',
                        pathname === '/settings'
                          ? isDark
                            ? 'bg-primary/10 text-primary'
                            : 'bg-primary/10 text-primary'
                          : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Paramètres</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
          style={{ scaleX }}
        />
      </motion.nav>
    </motion.header>
  );
}
