'use client';

import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { UserProfile } from '@clerk/nextjs';
import { Package, Clock, CheckCircle, User, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { orders, addReview } = useStore();
  const [activeTab, setActiveTab] = useState<'account' | 'orders'>('account');

  return (
    <div className="container mx-auto px-4 py-8 lg:max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium border ${
                activeTab === 'account' 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-card border-transparent hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-5 h-5" />
              {t('myAccount')}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium border ${
                activeTab === 'orders' 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-card border-transparent hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="w-5 h-5" />
              {t('orderHistory')}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'orders' ? (
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">{t('orderHistory')}</h2>
              </div>
              {orders.length > 0 && (
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              )}
            </div>
            
            {orders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Package className="h-12 w-12 opacity-20 mb-4" />
                <p>{t('noOrders')}</p>
                <Link href="/#products-section" className="text-primary font-medium mt-2 hover:underline">
                  {t('startShopping')}
                </Link>
              </div>
            ) : (
              <div className="divide-y pb-6">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-muted/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-bold text-lg">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/10 text-primary dark:bg-primary/20'
                        }`}>
                          {order.status === 'Completed' ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          {order.status}
                        </span>
                        <p className="font-bold text-lg whitespace-nowrap">{order.total.toLocaleString('en-US')} RWF</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x mb-4">
                      {order.items.map((item, i) => (
                        <div key={`${item.id}-${i}`} className="snap-start shrink-0 flex items-center gap-3 bg-card p-2 rounded-lg border min-w-[240px] shadow-sm">
                          <div className="h-14 w-14 bg-muted rounded-md shrink-0 relative overflow-hidden">
                             {item.imageUrl ? (
                               <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                             ) : (
                               <div className="w-full h-full bg-muted" />
                             )}
                          </div>
                          <div className="pr-4">
                            <p className="text-sm font-semibold line-clamp-1" title={item.name}>{t(`products.${item.id}.name`, { defaultValue: item.name })}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{t('checkoutQty')}: {item.quantity} × {item.price.toLocaleString()} RWF</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Rating Widget */}
                    {!order.review ? (
                      <div className="mt-4 pt-4 pb-4 px-5 border rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-amber-900 dark:text-amber-400 flex items-center gap-2">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            {t('rateBranchTitle', { defaultValue: 'Rate Your Experience!' })}
                          </p>
                          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 max-w-md">
                            {t('rateBranchDesc', { 
                              defaultValue: order.branch 
                                ? `How was your pickup at ${order.branch}?` 
                                : 'How was your shopping experience today?'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-background/80 p-2 rounded-lg border border-amber-200 dark:border-amber-700/50 shadow-sm shrink-0">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => addReview(order.id, star)}
                              className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                            >
                              <Star className="h-7 w-7 text-amber-200 dark:text-amber-700/30 hover:fill-amber-500 hover:text-amber-500 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {t('rateBranch', { defaultValue: 'You rated your experience' })}
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                (order.review || 0) >= star
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          ) : (
            <div className="overflow-hidden rounded-xl border shadow-sm bg-card flex justify-center w-full">
              <UserProfile 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full max-w-none flex justify-center",
                    cardBox: "w-full max-w-none shadow-none border-none",
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
