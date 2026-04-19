'use client';

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortOrder: 'none' | 'asc' | 'desc';
  setSortOrder: (val: 'none' | 'asc' | 'desc') => void;
}

export function FilterBar({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
}: FilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center overflow-hidden">
        <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2 flex-1 scroll-smooth">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
            className="whitespace-nowrap"
          >
            {t('all')}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap"
            >
              {t(cat.toLowerCase().replace(' ', '_'))}
            </Button>
          ))}
        </div>

        <div className="relative w-[180px] shrink-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
            className="w-full h-8 appearance-none rounded-lg border border-input bg-transparent py-1.5 pr-8 pl-3 text-sm outline-none cursor-pointer hover:bg-accent/50 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="none">{t('recommended')}</option>
            <option value="asc">{t('priceLowToHigh')}</option>
            <option value="desc">{t('priceHighToLow')}</option>
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}
