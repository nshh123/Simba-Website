'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';

const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: 'Full Name must be at least 2 characters' }),
  phone: z.string().regex(/^(\+250|0)?[7][2389]\d{7}$/, { message: 'Invalid Rwandan phone number' }),
  district: z.string().min(1, { message: 'District is required' }),
  sector: z.string().min(1, { message: 'Sector is required' }),
  instructions: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutState = 'form' | 'processing' | 'success';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cart, clearCart } = useStore();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('form');
  const [orderId, setOrderId] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (checkoutState === 'success') {
      clearCart();
    }
  }, [checkoutState, clearCart]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      district: '',
      sector: '',
      instructions: '',
    },
  });

  const onSubmit = (_data: CheckoutFormValues) => {
    setCheckoutState('processing');
    setTimeout(() => {
      setOrderId('ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      setCheckoutState('success');
    }, 4000);
  };

  if (checkoutState === 'processing') {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] max-w-md text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-8" />
        <h2 className="text-2xl font-bold mb-4">Processing MoMo Payment</h2>
        <p className="text-muted-foreground text-lg">
          Initiating MoMo push... Please check your phone to enter your PIN.
        </p>
      </div>
    );
  }

  if (checkoutState === 'success') {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
        {windowDimensions.width > 0 && (
          <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={500} />
        )}
        <CheckCircle className="h-24 w-24 text-green-500 mb-8" />
        <h1 className="text-4xl font-bold mb-4">Order Successful!</h1>
        <p className="text-xl text-muted-foreground mb-2">Thank you for your purchase.</p>
        <p className="text-lg font-medium mb-12">Your order number is: <span className="font-bold">{orderId}</span></p>
        <Button render={<Link href="/" />} size="lg">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t('checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Name
                </label>
                <Input placeholder="John Doe" {...form.register('fullName')} />
                {form.formState.errors.fullName && (
                  <p className="text-[0.8rem] text-destructive font-medium">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Phone Number
                </label>
                <Input placeholder="0780000000" {...form.register('phone')} />
                {form.formState.errors.phone && (
                  <p className="text-[0.8rem] text-destructive font-medium">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    District
                  </label>
                  <Input placeholder="Gasabo" {...form.register('district')} />
                  {form.formState.errors.district && (
                    <p className="text-[0.8rem] text-destructive font-medium">
                      {form.formState.errors.district.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sector
                  </label>
                  <Input placeholder="Remera" {...form.register('sector')} />
                  {form.formState.errors.sector && (
                    <p className="text-[0.8rem] text-destructive font-medium">
                      {form.formState.errors.sector.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Delivery Instructions (Optional)
                </label>
                <Textarea placeholder="Apartment number, gate code, etc." {...form.register('instructions')} />
                {form.formState.errors.instructions && (
                  <p className="text-[0.8rem] text-destructive font-medium">
                    {form.formState.errors.instructions.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-6"
                disabled={!form.formState.isValid || cart.length === 0}
              >
                Proceed to Payment
              </Button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-muted p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded overflow-hidden shrink-0 bg-background">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-1">{t(`products.${item.id}.name`, { defaultValue: item.name })}</h3>
                    <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                    <p className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString('en-US')} RWF</p>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
              )}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{total.toLocaleString('en-US')} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>Calculated next step</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg">
                <span>{t('total')}</span>
                <span>{total.toLocaleString('en-US')} RWF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
