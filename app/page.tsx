'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterBar } from '@/components/FilterBar';
import { HeroBanner } from '@/components/HeroBanner';
import { getProducts, getCategories } from '@/lib/data';
import { useStore } from '@/store/useStore';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';

export default function Home() {
  const { searchQuery, setSearchQuery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = useMemo(() => getProducts(), []);
  const categories = useMemo(() => getCategories(), []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="space-y-6">
      <HeroBanner />
      <div id="products-section">
        <FilterBar
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        
        {!mounted ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={filteredAndSortedProducts} />
        )}
      </div>
    </div>
  );
}
