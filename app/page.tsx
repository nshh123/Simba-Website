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
import { Product } from '@/types';

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

  const [aiSearchResults, setAiSearchResults] = useState<Product[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Trigger Groq Search when query changes
  useEffect(() => {
    let ignore = false;
    
    async function performAiSearch() {
      if (!debouncedSearchQuery.trim() || debouncedSearchQuery === '@wishlist') {
        setAiSearchResults(null);
        return;
      }
      
      setIsAiSearching(true);
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: debouncedSearchQuery }),
        });
        const data = await response.json();
        
        if (!ignore) {
          setAiSearchResults(data.matchedProducts || []);
        }
      } catch (error) {
        if (!ignore) {
          console.error("AI Search failed", error);
          setAiSearchResults(null);
        }
      } finally {
        if (!ignore) {
          setIsAiSearching(false);
        }
      }
    }
    
    performAiSearch();
    
    return () => {
      ignore = true;
    };
  }, [debouncedSearchQuery]);

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
        // 1. Get local exact/substring matches instantly
        const lowerQuery = debouncedSearchQuery.toLowerCase();
        
        // Improve local fallback: if user types conversational things like "do you have milk", 
        // extract likely nouns/keywords for an instant hit before AI returns
        const conversationalKeywords = ["do", "you", "have", "i", "need", "want", "search", "for", "please"];
        const cleanQuery = lowerQuery.split(" ").filter(w => !conversationalKeywords.includes(w)).join(" ").trim();

        let currentMatches = result.filter(
          (p) => {
            const name = p.name.toLowerCase();
            const desc = p.description.toLowerCase();
            const isMatch = name.includes(lowerQuery) || desc.includes(lowerQuery) || 
                   (cleanQuery.length > 2 && (name.includes(cleanQuery) || desc.includes(cleanQuery)));
            return isMatch;
          }
        );

        // 2. Merge with AI results (Union) if they are ready, to expand results contextually
        if (aiSearchResults !== null && !isAiSearching) {
          const mergedMap = new Map();
          currentMatches.forEach(p => mergedMap.set(p.id, p));
          aiSearchResults.forEach((p: Product) => mergedMap.set(p.id, p));
          result = Array.from(mergedMap.values());
        } else {
          result = currentMatches;
        }
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

  return (
    <div className="space-y-6">
      {!searchQuery.trim() && (
        <div className="min-h-[calc(100vh-120px)] flex flex-col justify-start gap-6 pt-6 pb-2">
          <HeroBanner />
          <FeaturesSection />
          <CategoryGrid />
        </div>
      )}
      
      <div id="products-section" className="flex flex-col lg:flex-row gap-6 relative pt-4">
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
          
          {!mounted || (isAiSearching && paginatedProducts.length === 0) ? (
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
