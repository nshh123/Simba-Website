'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Search, ShoppingCart, Sun, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CartDrawer } from './CartDrawer';
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs';

export function Navbar() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, theme, toggleTheme, setLanguage, setCartOpen, searchQuery, setSearchQuery } = useStore();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const language = useStore((state) => state.language);

  const langCode: Record<string, string> = { en: 'EN', fr: 'FR', rw: 'RW' };
  const current = langCode[language] || 'EN';

  const LanguageSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-white/20 transition-colors text-white border border-white/30 bg-white/10"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span>{current}</span>
        <svg className="h-3 w-3 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')}>
          {t('french')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('rw')}>
          {t('kinyarwanda')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const isManager = user?.publicMetadata?.role === 'manager';

  const handleResetHome = () => {
    setSearchQuery('');
    window.dispatchEvent(new Event('resetFilters'));
  };

  const ThemeToggle = () => (
    <button
      className="inline-flex items-center justify-center rounded-lg p-2 text-sm hover:bg-white/20 transition-colors text-white"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E07000] bg-[#FF8800] text-white shadow-md print:hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" onClick={handleResetHome} className="flex items-center gap-2">
            <div className="bg-white rounded-full p-0.5 h-10 w-10 flex items-center justify-center shrink-0">
              <Image src="/logo.jpg" alt="Simba Logo" width={36} height={36} className="rounded-full object-cover" />
            </div>
            <div className="flex flex-col text-white">
              <span className="font-bold text-lg leading-none tracking-tight">Simba Supermarket</span>
              <span className="hidden sm:inline-block text-xs leading-tight opacity-90 mt-0.5">Online Shopping</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center max-w-sm mx-4">
          <div className="relative w-full flex items-center text-foreground dark:text-gray-100">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search')}
              className="w-full pl-9 pr-9 bg-white dark:bg-gray-800 text-foreground dark:text-gray-100 border-white/30 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <Link href="/" onClick={handleResetHome} className="text-sm font-bold text-white hover:text-white/80 transition-colors">{t('home')}</Link>
            <Link href="/" onClick={() => setSearchQuery('@wishlist')} className="text-sm font-bold text-white hover:text-white/80 transition-colors cursor-pointer">{t('wishlist')}</Link>
            <Link href="/checkout" className="text-sm font-bold text-white hover:text-white/80 transition-colors">{t('checkout')}</Link>
          </div>
          
          <LanguageSelector />
          
          <div className="hidden md:flex gap-1">
            {mounted && <ThemeToggle />}
          </div>

          {isSignedIn && isManager && (
            <Link 
              href="/branch-dashboard" 
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-white border border-white/20 hover:bg-white/20 transition-all font-bold text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {t('dashboard')}
            </Link>
          )}

          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hidden md:inline-flex text-sm font-bold text-white hover:text-white/80 transition-colors">
                {t('myProfile')}
              </Link>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-white/40" } }} />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="hidden md:inline-flex items-center justify-center rounded-full bg-white text-[#FF8800] px-4 py-1.5 text-sm font-bold shadow-md hover:bg-gray-100 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}

          <button
            className="hidden md:inline-flex relative items-center justify-center rounded-lg border border-white/30 p-2 hover:bg-white/20 transition-colors text-white"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 text-white" />
            {mounted && totalItems > 0 && (
              <span
                className="absolute -right-2.5 -top-2.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[#FF8800] ring-2 ring-[#FF8800] text-xs font-black shadow-md shadow-black/20"
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
