'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterBar } from '@/components/FilterBar';
import { SidebarFilter } from '@/components/SidebarFilter';
import { HeroBanner } from '@/components/HeroBanner';
import { FeaturesSection } from '@/components/FeaturesSection';
import { getProducts, getCategories } from '@/lib/data';
import { useStore } from '@/store/useStore';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { CategoryGrid } from '@/components/CategoryGrid';
import { multilingualSearchIds, STOPWORDS } from '@/lib/multilingualSearch';

export default function Home() {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery, wishlist, selectedCategory, setSelectedCategory } = useStore();
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc' | 'wishlist'>('none');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [mounted, setMounted] = useState(false);

  // Debounced values
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  // No AI search state needed — multilingual search is instant & local

  // Auto scroll to top when searching
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('sort') === 'wishlist') {
        setSortOrder('wishlist');
        // Scroll down to products optionally
        setTimeout(() => {
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }

      const handleReset = () => {
        setSelectedCategory('All');
        setSortOrder('none');
        setMinPrice('');
        setMaxPrice('');
      };
      window.addEventListener('resetFilters', handleReset);
      return () => window.removeEventListener('resetFilters', handleReset);
    }
  }, []);

  const products = useMemo(() => getProducts(), []);
  const categories = useMemo(() => getCategories(), []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;
    if (sortOrder === 'wishlist') {
      result = result.filter((p) => wishlist.includes(p.id));
    }

    if (debouncedSearchQuery) {
      if (debouncedSearchQuery === '@wishlist') {
        result = result.filter((p) => wishlist.includes(p.id));
      } else {
        // Strip punctuation and lowercase
        const lowerQuery = debouncedSearchQuery.toLowerCase().replace(/[?!.,]/g, '');

        // 1. English text match — try full phrase first, then individual meaningful tokens
        const tokens = lowerQuery
          .split(/\s+/)
          .filter((w) => w.length > 2 && !STOPWORDS.has(w));

        const englishMatches = new Set(
          result
            .filter((p) => {
              const name = p.name.toLowerCase();
              const desc = p.description.toLowerCase();
              // Full phrase match OR any meaningful keyword token matches
              return (
                name.includes(lowerQuery) ||
                desc.includes(lowerQuery) ||
                tokens.some((token) => name.includes(token) || desc.includes(token))
              );
            })
            .map((p) => p.id)
        );

        // 2. Multilingual keyword match (French + Kinyarwanda) — instant, no API
        const multilingualMatches = multilingualSearchIds(lowerQuery);

        // 3. Union of both sets
        const allMatchedIds = new Set([...englishMatches, ...multilingualMatches]);
        result = result.filter((p) => allMatchedIds.has(p.id));
      }
    } else if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (debouncedMinPrice && !isNaN(Number(debouncedMinPrice))) {
      result = result.filter(p => p.price >= Number(debouncedMinPrice));
    }

    if (debouncedMaxPrice && !isNaN(Number(debouncedMaxPrice))) {
      result = result.filter(p => p.price <= Number(debouncedMaxPrice));
    }

    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, debouncedSearchQuery, selectedCategory, sortOrder, debouncedMinPrice, debouncedMaxPrice, wishlist]);

  const paginatedProducts = filteredAndSortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedProducts.length;
  const isSearchActive = !!debouncedSearchQuery.trim();

  return (
    <div className="space-y-2 md:space-y-6 w-full overflow-hidden">
      {!searchQuery.trim() && (
        <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-3 pb-2 md:min-h-[calc(100vh-72px)] md:justify-between">
          <HeroBanner />
          <FeaturesSection />
          <CategoryGrid />
        </div>
      )}
      
      <div id="products-section" className="flex flex-col lg:flex-row gap-6 relative pt-0 md:pt-4">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-max">
          <SidebarFilter
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 w-full overflow-hidden">
          {/* Mobile FilterBar */}
          <div className="lg:hidden mb-4">
            <FilterBar
              categories={categories}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
          
          {!mounted ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={paginatedProducts} />
              {hasMore && (
                <div className="mt-8 flex justify-center pb-8 lg:pb-0">
                  <Button 
                    variant="outline" 
                    className="w-full max-w-sm rounded-full py-6 font-semibold"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                  >
                    {t('loadMore')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
