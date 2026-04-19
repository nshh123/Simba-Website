'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ToastProvider';
import { Product } from '@/types';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { t } = useTranslation();
  const addToCart = useStore((state) => state.addToCart);
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    const name = t(`products.${product.id}.name`, { defaultValue: product.name });
    showToast(`✓ ${name} (x${quantity}) ${t('addedToCart')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-1/2 aspect-square bg-muted shrink-0">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6 md:p-8 flex-1 justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {t(product.category.toLowerCase().replace(' ', '_'))}
                </p>
                <h2 className="text-2xl font-bold leading-tight">
                  {t(`products.${product.id}.name`, { defaultValue: product.name })}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`products.${product.id}.description`, { defaultValue: product.description })}
              </p>
              <p className="text-3xl font-extrabold text-primary">
                {product.price.toLocaleString('en-US')} <span className="text-base font-semibold">RWF</span>
              </p>
              {product.inStock ? (
                <span className="inline-block text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  ● {t('inStock', { defaultValue: 'In Stock' })}
                </span>
              ) : (
                <span className="inline-block text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  ● {t('outOfStock')}
                </span>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Qty:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    className="p-2 hover:bg-muted transition-colors rounded-l-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    className="p-2 hover:bg-muted transition-colors rounded-r-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                className="w-full font-bold text-primary-foreground gap-1.5 sm:gap-2 text-sm sm:text-base py-3 sm:py-5 h-auto flex flex-wrap justify-center whitespace-normal disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 leading-tight"
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {product.inStock ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {t('addToCart')} — {(product.price * quantity).toLocaleString('en-US')} RWF
                  </>
                ) : (
                  <span className="font-semibold text-lg">{t('outOfStock')}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
