'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const addToCart = useStore((state) => state.addToCart);

  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <div className="relative aspect-square w-full">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">{t(`products.${product.id}.name`, { defaultValue: product.name })}</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4 flex-none">
        <CardTitle className="text-lg line-clamp-1">{t(`products.${product.id}.name`, { defaultValue: product.name })}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {t(`products.${product.id}.description`, { defaultValue: product.description })}
        </p>
        <p className="font-bold text-lg">
          {product.price.toLocaleString('en-US')} RWF
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full font-bold text-primary-foreground" 
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
        >
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
}
