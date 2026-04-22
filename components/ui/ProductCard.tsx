'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ToastProvider';
import { Product } from '@/types';

const BADGES: Record<string, { label: string; color: string }> = {
  'prod-001': { label: 'Popular', color: 'bg-blue-500' },
  'prod-002': { label: 'Premium', color: 'bg-purple-500' },
  'prod-006': { label: 'Premium', color: 'bg-purple-500' },
  'prod-009': { label: 'New', color: 'bg-green-500' },
  'prod-011': { label: 'Popular', color: 'bg-blue-500' },
  'prod-012': { label: 'Best Value', color: 'bg-amber-500' },
  'prod-015': { label: 'Sale', color: 'bg-red-500' },
  'prod-020': { label: 'New', color: 'bg-green-500' },
};

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: () => void }) {
  const { t } = useTranslation();
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const wishlist = useStore((state) => state.wishlist) || [];
  const { showToast } = useToast();

  const isFavorited = wishlist.includes(product.id);
  const badge = BADGES[product.id];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    const name = t(`products.${product.id}.name`, { defaultValue: product.name });
    showToast(`✓ ${name} ${t('addedToCart')}`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    const name = t(`products.${product.id}.name`, { defaultValue: product.name });
    showToast(isFavorited ? `${name} removed from wishlist` : `♥ ${name} added to wishlist`);
  };

  return (
    <Card className="group flex flex-col overflow-hidden h-full pt-0 gap-0 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 hover:border-primary/30 cursor-pointer" onClick={onQuickView}>
      <div className="relative aspect-square w-full overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">{t(`products.${product.id}.name`, { defaultValue: product.name })}</span>
          </div>
        )}
        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 z-10 px-2.5 py-1 text-xs font-bold text-white rounded-full shadow-md ${badge.color}`}>
            {badge.label}
          </span>
        )}
        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-200"
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 transition-colors duration-200 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground hover:text-red-500'}`} />
        </button>
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white font-bold text-lg">{t('outOfStock')}</span>
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <CardHeader className="p-4 flex-none">
        <CardTitle className="text-lg line-clamp-1 transition-colors duration-200 group-hover:text-primary">
          {t(`products.${product.id}.name`, { defaultValue: product.name })}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {t(`products.${product.id}.description`, { defaultValue: product.description })}
        </p>
        <p className="font-bold text-lg text-primary">
          {product.price.toLocaleString('en-US')} RWF
        </p>
      </CardContent>
      <div className="px-4 pb-4 pt-0">
        <Button 
          className="w-full font-bold text-primary-foreground gap-1.5 transition-all duration-200 group-hover:shadow-md disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 h-auto py-2 text-xs sm:text-sm flex flex-wrap justify-center whitespace-normal leading-tight" 
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="h-4 w-4" />
              {t('addToCart')}
            </>
          ) : (
            <>
              <span className="font-semibold text-sm">{t('outOfStock')}</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
