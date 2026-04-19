'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

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

  // Hide hero when user is actively searching
  if (searchQuery.trim()) return null;

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF8800] via-[#FF6B00] to-[#E05500] text-white">
      {/* Decorative background circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-12 md:py-16 md:px-12">
        {/* Text content */}
        <div className="flex-1 space-y-5 text-center md:text-left">
          <p className="text-lg md:text-xl font-medium text-white/90 tracking-wide">
            🛒 {t('heroWelcome')}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight min-h-[2.5em] md:min-h-[1.3em]">
            <span>{displayedText}</span>
            <span className="inline-block w-[3px] h-[1em] bg-white ml-1 align-text-bottom animate-pulse" />
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-lg">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-white text-[#FF6B00] hover:bg-white/90 font-bold text-base px-8 shadow-lg shadow-black/20"
            >
              {t('heroShopNow')}
            </Button>
          </div>
        </div>

        {/* Large Logo */}
        <div className="hidden md:flex items-center justify-center shrink-0">
          <div className="bg-white rounded-full p-3 h-44 w-44 flex items-center justify-center shadow-2xl shadow-black/30 ring-4 ring-white/30">
            <Image src="/logo.jpg" alt="Simba Logo" width={160} height={160} className="rounded-full object-cover" />
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 transition-transform hover:scale-105">
            <div className="p-2 bg-white/20 rounded-lg">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t('heroFeature1Title')}</p>
              <p className="text-xs text-white/75">{t('heroFeature1Desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 transition-transform hover:scale-105">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t('heroFeature2Title')}</p>
              <p className="text-xs text-white/75">{t('heroFeature2Desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 transition-transform hover:scale-105">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t('heroFeature3Title')}</p>
              <p className="text-xs text-white/75">{t('heroFeature3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
