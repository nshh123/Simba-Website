'use client';

import { useTranslation } from 'react-i18next';
import { Home, Grid3x3, ShoppingCart, Settings, Sun, Moon, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function MobileBottomNav() {
  const { t } = useTranslation();
  const { cart, theme, toggleTheme, setCartOpen, setSearchQuery } = useStore();
  const [activeTab, setActiveTab] = useState('home');
  const { isSignedIn } = useAuth();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeClick = () => {
    setActiveTab('home');
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('resetFilters'));
    }
    if (pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoriesClick = () => {
    setActiveTab('browse');
    if (pathname !== '/') {
      router.push('/#products-section');
    } else {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCart = () => {
    setCartOpen(true);
    setActiveTab('cart');
  };

  return (
    <>
      {/* Floating cart pill — visible when cart has items */}
      {totalItems > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-20 left-4 md:bottom-8 md:right-24 md:left-auto z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg shadow-primary/30 animate-in slide-in-from-bottom-3 fade-in duration-300 hover:scale-105 hover:shadow-xl transition-all print:hidden"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-bold text-sm">{totalItems}</span>
          <span className="text-xs opacity-80">•</span>
          <span className="font-semibold text-sm">{total.toLocaleString('en-US')} RWF</span>
        </button>
      )}

      {/* Bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t safe-area-bottom print:hidden">
        <div className="flex items-center justify-between py-1 px-1">
          <button 
            onClick={handleHomeClick}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 px-1 rounded-lg transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[9px] font-medium truncate w-full text-center">{t('home')}</span>
          </button>

          <button 
            onClick={handleCategoriesClick}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 px-1 rounded-lg transition-colors ${activeTab === 'browse' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Grid3x3 className="h-5 w-5" />
            <span className="text-[9px] font-medium truncate w-full text-center">{t('browseShort', { defaultValue: t('categories') })}</span>
          </button>

          <button 
            onClick={openCart}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 px-1 rounded-lg transition-colors relative ${activeTab === 'cart' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[8px] font-bold min-w-[14px] h-3.5 flex items-center justify-center rounded-full px-0.5">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium truncate w-full text-center">{t('checkout')}</span>
          </button>

          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 text-muted-foreground overflow-hidden">
            {isSignedIn ? (
              <Button render={<Link href="/profile" />} variant="ghost" className="h-auto p-0 flex flex-col gap-0.5 hover:bg-transparent w-full">
                <User className={`h-5 w-5 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[9px] font-medium truncate w-full text-center ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>{t('myProfile')}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <button className="flex flex-col items-center gap-0.5 w-full">
                  <User className="h-5 w-5" />
                  <span className="text-[9px] font-medium truncate w-full text-center">Sign in</span>
                </button>
              </SignInButton>
            )}
          </div>

          <button 
            onClick={toggleTheme}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 px-1 rounded-lg transition-colors text-muted-foreground overflow-hidden"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="text-[9px] font-medium truncate w-full text-center">{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
