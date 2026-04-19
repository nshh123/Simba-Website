'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchX } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ui/ProductCard';
import { QuickViewModal } from './QuickViewModal';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { t } = useTranslation();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center border rounded-xl bg-muted/30">
        <SearchX className="h-12 w-12 text-muted-foreground/60" />
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">{t('noResultsTitle')}</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {t('noResultsMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={() => setQuickViewProduct(product)}
          />
        ))}
      </div>
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
