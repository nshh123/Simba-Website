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
import { Loader2, CheckCircle, MapPin, Printer } from 'lucide-react';
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
  const [isLocating, setIsLocating] = useState(false);
  const [receiptCart, setReceiptCart] = useState(cart);
  const [receiptTotal, setReceiptTotal] = useState(0);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleGetLocation = () => {
    // ... logic remains
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const currentInstructions = form.getValues('instructions') || '';
        form.setValue(
          'instructions', 
          currentInstructions ? `${currentInstructions}\n\n${t('checkoutLiveLocation')}: ${mapsLink}` : `${t('checkoutLiveLocation')}: ${mapsLink}`,
          { shouldValidate: true }
        );
        
        if (!form.getValues('district')) form.setValue('district', t('checkoutLiveLocation'), { shouldValidate: true });
        if (!form.getValues('sector')) form.setValue('sector', t('checkoutLiveLocation'), { shouldValidate: true });
        
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      }
    );
  };

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

  const onSubmit = (data: CheckoutFormValues) => {
    setCheckoutState('processing');
    setReceiptCart([...cart]);
    setReceiptTotal(total);
    setTimeout(() => {
      setOrderId('ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      setCheckoutState('success');
    }, 4000);
  };

  if (checkoutState === 'processing') {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] max-w-md text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-8" />
        <h2 className="text-2xl font-bold mb-4">{t('checkoutProcessing')}</h2>
        <p className="text-muted-foreground text-lg">
          {t('checkoutProcessingDesc')}
        </p>
      </div>
    );
  }

  if (checkoutState === 'success') {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* On-screen Success View */}
        <div className="print:hidden flex flex-col items-center justify-center w-full">
          {windowDimensions.width > 0 && (
            <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={500} />
          )}
          <CheckCircle className="h-24 w-24 text-green-500 mb-8" />
          <h1 className="text-4xl font-bold mb-4">{t('checkoutSuccess')}</h1>
          <p className="text-xl text-muted-foreground mb-2">{t('checkoutThankYou')}</p>
          <p className="text-lg font-medium mb-12">{t('checkoutOrderNumber')}: <span className="font-bold">{orderId}</span></p>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button render={<Link href="/" />} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              {t('checkoutReturnHome', { defaultValue: 'Return Home' })}
            </Button>
            <Button size="lg" onClick={() => window.print()} className="font-bold gap-2">
              <Printer className="h-5 w-5" /> 
              {t('checkoutPrintReceipt', { defaultValue: 'Print Receipt' })}
            </Button>
          </div>
        </div>

        {/* Hidden Printable Receipt */}
        <div className="hidden print:block w-full text-left max-w-2xl mx-auto p-8 border-2 border-primary/20 rounded-xl mt-[-5rem]">
          <div className="flex items-center justify-between border-b pb-6 mb-6 gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#FF8800] rounded-full p-2 h-14 w-14 flex items-center justify-center shrink-0">
                <Image src="/logo.jpg" alt="Simba Logo" width={40} height={40} className="rounded-full object-cover" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold m-0">SIMBA</h2>
                <p className="text-sm font-semibold tracking-widest text-[#FF8800]">SUPERMARKET</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800">RECEIPT</h1>
              <p className="text-sm text-gray-500 font-medium">Order #: {orderId}</p>
              <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-lg border-b pb-2 mb-3">Order Details</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Item</th>
                  <th className="pb-2 font-medium text-center">Qty</th>
                  <th className="pb-2 font-medium text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {receiptCart.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 pr-2">{t(`products.${item.id}.name`, { defaultValue: item.name })}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-medium">{(item.price * item.quantity).toLocaleString('en-US')} RWF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2">
              <div className="flex justify-between font-bold text-xl pt-2 border-t-2 border-gray-800">
                <span>Total</span>
                <span>{receiptTotal.toLocaleString('en-US')} RWF</span>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-gray-500 font-medium border-t pt-6">
            <p className="text-lg text-gray-800 font-bold mb-1">Thank you for shopping with us!</p>
            <p>KG 7 Ave, Kigali, Rwanda  |  +250 795 306 295</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t('checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('checkoutDeliveryInfo')}</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('checkoutFullName')}
                </label>
                <Input {...form.register('fullName')} />
                {form.formState.errors.fullName && (
                  <p className="text-[0.8rem] text-destructive font-medium">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('checkoutPhone')}
                </label>
                <Input {...form.register('phone')} />
                {form.formState.errors.phone && (
                  <p className="text-[0.8rem] text-destructive font-medium">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('checkoutDistrict')}
                  </label>
                  <Input {...form.register('district')} />
                  {form.formState.errors.district && (
                    <p className="text-[0.8rem] text-destructive font-medium">
                      {form.formState.errors.district.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('checkoutSector')}
                  </label>
                  <Input {...form.register('sector')} />
                  {form.formState.errors.sector && (
                    <p className="text-[0.8rem] text-destructive font-medium">
                      {form.formState.errors.sector.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('checkoutInstructions')}
                  </label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGetLocation} 
                    disabled={isLocating}
                    className="h-8 gap-1.5 text-[#FF8800] border-[#FF8800] hover:bg-[#FF8800]/10"
                  >
                    {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                    {t('checkoutLiveLocation')}
                  </Button>
                </div>
                <Textarea placeholder={t('checkoutInstructionsPlaceholder')} {...form.register('instructions')} rows={4} />
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
                {t('checkoutProceed')}
              </Button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-muted p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-semibold mb-6">{t('checkoutOrderSummary')}</h2>
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
                    <p className="text-muted-foreground text-sm">{t('checkoutQty')}: {item.quantity}</p>
                    <p className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString('en-US')} RWF</p>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-muted-foreground text-center py-4">{t('emptyCart')}</p>
              )}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('checkoutSubtotal')}</span>
                <span>{total.toLocaleString('en-US')} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('checkoutDelivery')}</span>
                <span>{t('checkoutDeliveryCalc')}</span>
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

