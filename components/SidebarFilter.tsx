'use client';

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarFilterProps {
  categories: string[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortOrder: 'none' | 'asc' | 'desc' | 'wishlist';
  setSortOrder: (val: 'none' | 'asc' | 'desc' | 'wishlist') => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
}

export function SidebarFilter({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: SidebarFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 p-6 bg-card rounded-xl border shadow-sm">
      {/* Search */}
      <div>
        <h3 className="font-semibold mb-3">{t('search')}</h3>
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <h3 className="font-semibold mb-3">{t('recommended')}</h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc' | 'wishlist')}
          className="w-full h-10 appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <option value="none">{t('recommended')}</option>
          <option value="wishlist">{t('wishlist')}</option>
          <option value="asc">{t('priceLowToHigh')}</option>
          <option value="desc">{t('priceHighToLow')}</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">{t('categories')}</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-left text-sm py-1.5 px-3 rounded-md transition-colors ${selectedCategory === 'All' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
          >
            {t('all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left text-sm py-1.5 px-3 rounded-md transition-colors ${selectedCategory === cat ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
            >
              {t(cat.toLowerCase().replace(' ', '_'))}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">{t('priceRange')} (RWF)</h3>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder={t('min')} 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full"
          />
          <span className="text-muted-foreground">-</span>
          <Input 
            type="number" 
            placeholder={t('max')} 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
