'use client';

import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { UserProfile } from '@clerk/nextjs';
import { Package, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { t } = useTranslation();
  const orders = useStore((state) => state.orders) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col gap-12">
        {/* Orders Section */}
        <div className="w-full">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-muted/30 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Order History</h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Package className="h-12 w-12 opacity-20 mb-4" />
                <p>You have not placed any orders yet.</p>
                <Link href="/#products-section" className="text-primary font-medium mt-2 hover:underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y overflow-auto max-h-[800px] hide-scrollbar">
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
                    
                    <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
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
                            <p className="text-sm font-semibold line-clamp-1" title={item.name}>{item.name}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">Qty: {item.quantity} × {item.price.toLocaleString()} RWF</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clerk Profile Components */}
        <div className="w-full">
          <div className="overflow-hidden rounded-xl border shadow-sm bg-card">
            <UserProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-none",
                  cardBox: "w-full max-w-none shadow-none border-none",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
