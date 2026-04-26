'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const { t } = useTranslation();
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useStore();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('yourCart')}</SheetTitle>
        </SheetHeader>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <span className="text-muted-foreground">{t('emptyCart')}</span>
            <Button variant="outline" onClick={() => setCartOpen(false)}>{t('startShopping')}</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="font-medium line-clamp-1">{t(`products.${item.id}.name`, { defaultValue: item.name })}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" className="h-6 w-6 shrink-0" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 shrink-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString('en-US')} RWF</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 pb-2 border-t mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">{t('total')}</span>
                <span className="font-bold text-lg">{total.toLocaleString('en-US')} RWF</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {t('checkout')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
