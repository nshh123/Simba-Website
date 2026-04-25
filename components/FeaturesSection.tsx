'use client';

import { useTranslation } from 'react-i18next';
import { Truck, Clock, ShieldCheck, Zap } from 'lucide-react';

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      desc: 'On all orders above 10,000 RWF',
      color: 'bg-orange-500'
    },
    {
      icon: Clock,
      title: 'Open 24/7',
      desc: 'Shop anytime, we never close',
      color: 'bg-blue-500'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      desc: 'MTN MoMo & Card supported',
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: 'Quick Pickup',
      desc: 'Ready in 30 mins at any branch',
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className={`${f.color} p-3 rounded-2xl text-white shadow-lg`}>
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
