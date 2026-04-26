'use client';

import { useTranslation } from 'react-i18next';
import { Truck, Clock, ShieldCheck, Zap } from 'lucide-react';

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Truck,
      title: t('feature_delivery_title'),
      desc: t('feature_delivery_desc'),
      color: 'bg-orange-500'
    },
    {
      icon: Clock,
      title: t('feature_hours_title'),
      desc: t('feature_hours_desc'),
      color: 'bg-blue-500'
    },
    {
      icon: ShieldCheck,
      title: t('feature_secure_title'),
      desc: t('feature_secure_desc'),
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: t('feature_pickup_title'),
      desc: t('feature_pickup_desc'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-2 w-full overflow-hidden">
      <div className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 p-3 md:p-4 bg-white dark:bg-gray-800/60 rounded-2xl shadow-sm border border-orange-100 dark:border-gray-800 hover:shadow-md transition-shadow min-w-0">
              <div className={`${f.color} p-2.5 rounded-xl text-white shadow-sm shrink-0`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 w-full">
                <h3 className="font-bold text-xs md:text-base text-gray-900 dark:text-gray-100 leading-tight">{f.title}</h3>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
