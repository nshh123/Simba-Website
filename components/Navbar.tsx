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

export function Navbar() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, theme, toggleTheme, setLanguage, setCartOpen, searchQuery, setSearchQuery } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const LanguageSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-lg p-2 text-sm hover:bg-white/20 transition-colors text-white"
        aria-label="Select language"
      >
        <Globe className="h-5 w-5" />
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
    <header className="sticky top-0 z-50 w-full border-b border-[#E07000] bg-[#FF8800] text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/20 transition-colors text-white"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('search')}
                    className="w-full pl-8 text-foreground bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <LanguageSelector />
                  {mounted && <ThemeToggle />}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white rounded-full p-0.5 h-10 w-10 flex items-center justify-center shrink-0">
              <Image src="/logo.jpg" alt="Simba Logo" width={36} height={36} className="rounded-full object-cover" />
            </div>
            <div className="flex flex-col text-white">
              <span className="font-bold text-lg leading-none tracking-tight">Simba Supermarket</span>
              <span className="text-xs leading-tight opacity-90 mt-0.5">Online Shopping</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search')}
              className="w-full pl-8 text-foreground bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex gap-1">
            <LanguageSelector />
            {mounted && <ThemeToggle />}
          </div>

          <button
            className="relative inline-flex items-center justify-center rounded-lg border border-white/30 p-2 hover:bg-white/20 transition-colors text-white"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </button>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
