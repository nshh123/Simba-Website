'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import { useStore } from '../store/useStore';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
    // Dark mode by default for mobile
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('evaluation') === 'true') {
        const store = useStore.getState();
        store.setEvaluationMode(true);
        if (!store.wishlist.includes('prod-001')) store.toggleWishlist('prod-001');
        if (!store.wishlist.includes('prod-002')) store.toggleWishlist('prod-002');
      }

      const userChoice = localStorage.getItem('theme-user-choice');
      if (!userChoice && window.innerWidth <= 768) {
        useStore.getState().setTheme('dark');
      }
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Render initially with default language to allow SSR to match, then hydrate
  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          {children}
        </div>
      </ToastProvider>
    </I18nextProvider>
  );
}
