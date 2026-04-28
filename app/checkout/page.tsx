'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useStore, CartItem } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BranchSelector, BRANCHES, Branch } from '@/components/BranchSelector';
import {
  Loader2,
  CheckCircle,
  Printer,
  User,
  Phone,
  MapPin,
  Clock,
  Smartphone,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import Confetti from 'react-confetti';

// ─── Types ────────────────────────────────────────────────────────────────────

const personalSchema = z.object({
  fullName: z.string().min(0),
  phone: z.string().min(0),
});

type PersonalValues = z.infer<typeof personalSchema>;
type CheckoutStep = 'info' | 'branch' | 'deposit' | 'success';

const DEPOSIT_AMOUNT = 500; // RWF

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: CheckoutStep }) {
  const { t } = useTranslation();
  const steps = [
    { key: 'info',    label: t('stepInfo', { defaultValue: 'Your Info' }),  icon: User },
    { key: 'branch',  label: t('stepBranch', { defaultValue: 'Branch' }),     icon: MapPin },
    { key: 'deposit', label: t('stepDeposit', { defaultValue: 'Deposit' }),    icon: Smartphone },
  ];
  const activeIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = i < activeIdx || step === 'success';
        const active = i === activeIdx;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'bg-primary border-primary text-primary-foreground'
                    : active
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-muted text-muted-foreground bg-background'
                }`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  active ? 'text-primary' : done ? 'text-primary/70' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-28 mx-1 mb-5 transition-all ${
                  i < activeIdx ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary({
  cart,
  deposit,
  showDeposit,
}: {
  cart: CartItem[];
  deposit: number;
  showDeposit: boolean;
}) {
  const { t } = useTranslation();
  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  return (
    <div className="bg-muted/40 border rounded-2xl p-6 sticky top-24">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" />
        {t('checkoutOrderSummary')}
      </h2>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-background border">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">
                {t(`products.${item.id}.name`, { defaultValue: item.name })}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × {item.price.toLocaleString()} RWF
              </p>
            </div>
            <span className="text-sm font-semibold shrink-0">
              {(item.price * item.quantity).toLocaleString()} RWF
            </span>
          </div>
        ))}
        {cart.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">{t('emptyCart')}</p>
        )}
      </div>

      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('checkoutSubtotal')}</span>
          <span>{subtotal.toLocaleString()} RWF</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('delivery', { defaultValue: 'Delivery' })}
          </span>
          <span className="text-green-600 font-medium">
            {t('free', { defaultValue: 'FREE (Pick-Up)' })}
          </span>
        </div>
        {showDeposit && (
          <div className="flex justify-between text-amber-600">
            <span>{t('momoDeposit', { defaultValue: 'MoMo Deposit' })}</span>
            <span className="font-medium">{deposit.toLocaleString()} RWF</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t">
          <span>{t('total')}</span>
          <span>{subtotal.toLocaleString()} RWF</span>
        </div>
        {showDeposit && (
          <p className="text-xs text-muted-foreground leading-tight">
            {t('depositNote', {
              defaultValue: `The ${deposit} RWF deposit is collected now to confirm your order. The remaining balance is paid at pick-up.`,
              deposit,
            })}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cart, clearCart, addOrder } = useStore();

  const [step, setStep] = useState<CheckoutStep>('info');
  const [personalData, setPersonalData] = useState<PersonalValues>({ fullName: '', phone: '' });
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);
  const [depositDone, setDepositDone] = useState(false);
  const [momoPhone, setMomoPhone] = useState('0780000000');
  const [momoError, setMomoError] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    const onResize = () =>
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const form = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    mode: 'onChange',
    defaultValues: { fullName: 'Test User', phone: '0780000000' },
  });

  // ── Step 1: Personal Info ──────────────────────────────────────────────────

  const onPersonalSubmit = (data: PersonalValues) => {
    setPersonalData(data);
    setStep('branch');
  };

  // Branch step: always allow proceeding — auto-select first branch/time if nothing chosen
  const canProceedToBranch = true;
  const handleBranchContinue = () => {
    if (!selectedBranch) {
      setSelectedBranch(BRANCHES[0]);
    }
    if (!selectedTime) {
      setSelectedTime('10:00');
    }
    setStep('deposit');
  };

  // ── Step 3: MoMo Deposit ───────────────────────────────────────────────────

  const handleDepositConfirm = () => {
    // Accept any input — auto-fill phone if empty
    const phone = momoPhone.trim() || '0780000000';
    setMomoPhone(phone);
    setMomoError('');
    setIsProcessingDeposit(true);

    // Simulate MoMo push delay
    setTimeout(() => {
      setDepositDone(true);
      setTimeout(() => {
        const id = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setOrderId(id);
        addOrder({
          id,
          date: new Date().toISOString(),
          total: subtotal,
          deposit: DEPOSIT_AMOUNT,
          items: [...cart],
          status: 'Processing',
          branch: selectedBranch!.name,
          branchId: selectedBranch!.id,
          pickupTime: selectedTime,
          customerName: personalData.fullName,
          customerPhone: personalData.phone,
        });
        useStore.getState().decreaseInventory(selectedBranch!.id, cart);
        clearCart();
        setStep('success');
      }, 1200);
    }, 3500);
  };

  // ── Success ────────────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="print:hidden">
          {windowDimensions.width > 0 && (
            <Confetti
              width={windowDimensions.width}
              height={windowDimensions.height}
              recycle={false}
              numberOfPieces={450}
            />
          )}
        </div>
        <CheckCircle className="h-24 w-24 text-green-500 mb-6 animate-in zoom-in duration-500" />
        <h1 className="text-4xl font-bold mb-2">{t('checkoutSuccess')}</h1>
        <p className="text-muted-foreground text-lg mb-1">{t('checkoutThankYou')}</p>
        <p className="font-semibold text-base mb-6">
          {t('checkoutOrderNumber')}: <span className="font-bold text-primary">{orderId}</span>
        </p>

        {/* Pickup summary card */}
        <div className="bg-card border rounded-2xl p-6 max-w-sm w-full mb-8 text-left space-y-3 shadow-md">
          <h3 className="font-bold text-base border-b pb-2 mb-3">
            {t('pickupDetails', { defaultValue: 'Pick-Up Details' })}
          </h3>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{t('brandName')} {selectedBranch?.name}</p>
              <p className="text-muted-foreground">{selectedBranch?.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <p>
              {t('pickupTime', { defaultValue: 'Pick-Up Time' })}:{' '}
              <span className="font-semibold">{selectedTime}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Smartphone className="h-4 w-4 text-primary shrink-0" />
            <p>
              {t('depositPaid', { defaultValue: 'Deposit Paid' })}:{' '}
              <span className="font-semibold text-green-600">
                {DEPOSIT_AMOUNT.toLocaleString()} RWF
              </span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t">
            {t('pickupReminder', {
              defaultValue:
                'Please bring this order number when you arrive at the branch. Your order will be ready for pick-up.',
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-center print:hidden">
          <Button
            render={<Link href="/" />}
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => window.dispatchEvent(new Event('resetFilters'))}
          >
            {t('checkoutReturnHome', { defaultValue: 'Return Home' })}
          </Button>
          <Button size="lg" onClick={() => window.print()} className="font-bold gap-2">
            <Printer className="h-5 w-5" />
            {t('checkoutPrintReceipt', { defaultValue: 'Print Receipt' })}
          </Button>
        </div>
      </div>
    );
  }

  // ── MoMo Processing Screen ─────────────────────────────────────────────────

  if (isProcessingDeposit) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] max-w-md text-center">
        {depositDone ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mb-6 animate-in zoom-in duration-300" />
            <h2 className="text-2xl font-bold mb-2">
              {t('depositConfirmed', { defaultValue: 'Deposit Confirmed!' })}
            </h2>
            <p className="text-muted-foreground">
              {t('placingOrder', { defaultValue: 'Placing your order...' })}
            </p>
          </>
        ) : (
          <>
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                <Smartphone className="h-10 w-10 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {t('checkoutProcessing', { defaultValue: 'Processing MoMo Deposit' })}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              {t('momoPrompt', {
                defaultValue:
                  'A push notification has been sent to your MoMo account. Please check your phone and enter your PIN to confirm the 500 RWF deposit.',
              })}
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-primary mt-8" />
          </>
        )}
      </div>
    );
  }

  // ── Main Form ──────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">{t('checkout')}</h1>
      <p className="text-muted-foreground mb-8">
        {t('pickupOnlyNotice', {
          defaultValue: 'Pick-up from your nearest Simba branch — free, fast, and fresh.',
        })}
      </p>

      <StepIndicator step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* ── Left panel ────────────────────────────────────────────────── */}
        <div>
          {/* Step 1: Personal info */}
          {step === 'info' && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('yourInfo', { defaultValue: 'Your Information' })}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('infoDesc', { defaultValue: 'We need your name and phone to confirm your order.' })}
              </p>

              <form onSubmit={form.handleSubmit(onPersonalSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {t('checkoutFullName')}
                  </label>
                  <Input
                    {...form.register('fullName')}
                    placeholder={t('placeholderName', { defaultValue: 'e.g. Jean de Dieu Uwimana' })}
                    className="h-11"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-[0.8rem] text-destructive">
                      {t('errorFullNameShort', { defaultValue: form.formState.errors.fullName.message })}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {t('checkoutPhone')}
                  </label>
                  <Input
                    {...form.register('phone')}
                    placeholder={t('placeholderPhone', { defaultValue: 'e.g. 0783456789' })}
                    className="h-11"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-[0.8rem] text-destructive">
                      {t('errorPhoneInvalid', { defaultValue: form.formState.errors.phone.message })}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                >
                  {t('continueToPickup', { defaultValue: 'Continue to Branch Selection' })}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Branch + time slot */}
          {step === 'branch' && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t('chooseBranch', { defaultValue: 'Choose Your Branch' })}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('branchDesc', {
                  defaultValue:
                    'Select the Simba branch closest to you, then pick a convenient time slot.',
                })}
              </p>

              <BranchSelector
                selectedBranchId={selectedBranch?.id ?? ''}
                selectedTime={selectedTime}
                onBranchSelect={setSelectedBranch}
                onTimeSelect={setSelectedTime}
              />

              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => setStep('info')}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('back', { defaultValue: 'Back' })}
                </Button>
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleBranchContinue}
                >
                  {t('continueToDeposit', { defaultValue: 'Continue to Deposit' })}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: MoMo Deposit */}
          {step === 'deposit' && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                {t('momoDepositTitle', { defaultValue: 'Confirm with MoMo Deposit' })}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('depositDesc', {
                  defaultValue:
                    'A small non-refundable deposit of 500 RWF is required via MTN Mobile Money to confirm your order and reserve staff time.',
                })}
              </p>

              {/* Order summary card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 space-y-2">
                <p className="font-semibold text-sm text-amber-800 dark:text-amber-200">
                  {t('yourOrderSummary', { defaultValue: 'Your Order at a Glance' })}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">{t('brandName')} {selectedBranch?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>
                    {t('pickupTime', { defaultValue: 'Pick-Up Time' })}: <strong>{selectedTime}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-amber-600" />
                  <span>{personalData.fullName} — {personalData.phone}</span>
                </div>
              </div>

              {/* Deposit amount callout */}
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('depositAmount', { defaultValue: 'Deposit Amount' })}
                  </p>
                  <p className="text-3xl font-black text-primary">
                    {DEPOSIT_AMOUNT.toLocaleString()} RWF
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('nonRefundable', { defaultValue: 'Non-refundable • Credited to your order at pick-up' })}
                  </p>
                </div>
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center text-3xl">
                  📱
                </div>
              </div>

              {/* MoMo phone input */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5" />
                  {t('momoNumber', { defaultValue: 'MTN MoMo Number' })}
                </label>
                <Input
                  value={momoPhone}
                  onChange={(e) => {
                    setMomoPhone(e.target.value);
                    setMomoError('');
                  }}
                  placeholder={t('placeholderPhone', { defaultValue: 'e.g. 0783456789' })}
                  className="h-11"
                />
                {momoError && (
                  <p className="text-[0.8rem] text-destructive">{momoError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('momoHint', {
                    defaultValue:
                      'You will receive a MoMo push notification. Enter your PIN to confirm.',
                  })}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => setStep('branch')}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('back', { defaultValue: 'Back' })}
                </Button>
                <Button
                  size="lg"
                  className="flex-1 gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  onClick={handleDepositConfirm}
                  disabled={cart.length === 0}
                >
                  <Smartphone className="h-4 w-4" />
                  {t('payDepositNow', { defaultValue: 'Pay 500 RWF Deposit via MoMo' })}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ───────────────────────────────────────── */}
        <OrderSummary
          cart={cart}
          deposit={DEPOSIT_AMOUNT}
          showDeposit={step === 'deposit'}
        />
      </div>
    </div>
  );
}
