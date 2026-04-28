'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { getProducts } from '@/lib/data';

export function HeroBanner() {
  const { t } = useTranslation();
  const searchQuery = useStore((state) => state.searchQuery);
  const [displayedText, setDisplayedText] = useState('');

  const fullText = t('heroTitle');

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    const timer = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [fullText]);

  const totalProducts = getProducts().length;

  // Hide hero when user is actively searching
  if (searchQuery.trim()) return null;

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF8800] via-[#FF6B00] to-[#E05500] text-white w-full">
      {/* Decorative background circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-5 px-5 py-5 md:py-4 md:px-8 w-full min-w-0">
        {/* Text content */}
        <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left min-w-0 w-full">
          <p className="text-sm md:text-xl font-medium text-white/90 tracking-wide">
            🛒 {t('heroWelcome')}
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white/90 backdrop-blur-md border border-white/20 mx-auto md:mx-0 shadow-sm">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
             {t('heroProductCount', { count: totalProducts })}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight min-h-[2em] md:min-h-0 break-words w-full">
            <span>{displayedText}</span>
            <span className="inline-block w-[3px] h-[1em] bg-white ml-1 align-text-bottom animate-pulse" />
          </h1>
          <p className="text-sm md:text-lg text-white/85 max-w-lg hidden sm:block">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-white text-[#FF6B00] hover:bg-white/90 font-bold text-sm md:text-base px-6 md:px-8 shadow-lg shadow-black/20"
            >
              {t('heroShopNow')}
            </Button>
          </div>
        </div>

        {/* Logo — hidden on mobile to save space */}
        <div className="hidden md:flex items-center justify-center shrink-0">
          <div className="bg-white rounded-full p-2 h-28 w-28 flex items-center justify-center shadow-2xl shadow-black/30 ring-4 ring-white/30">
            <Image src="/logo.jpg" alt="Simba Logo" width={100} height={100} className="rounded-full object-cover" />
          </div>
        </div>

        {/* Feature pills — hidden on mobile (shown in FeaturesSection below) */}
        <div className="hidden md:flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 transition-transform hover:scale-105">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-xs">{t('heroFeature1Title')}</p>
              <p className="text-[10px] text-white/75">{t('heroFeature1Desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 transition-transform hover:scale-105">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-xs">{t('heroFeature2Title')}</p>
              <p className="text-[10px] text-white/75">{t('heroFeature2Desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 transition-transform hover:scale-105">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-xs">{t('heroFeature3Title')}</p>
              <p className="text-[10px] text-white/75">{t('heroFeature3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
