'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#FF8800] rounded-full p-0.5 h-10 w-10 flex items-center justify-center shrink-0">
                <Image src="/logo.jpg" alt="Simba Logo" width={36} height={36} className="rounded-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Simba Supermarket</span>
                <span className="text-xs text-muted-foreground mt-0.5">Online Shopping</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footerAbout')}
            </p>
          </div>

          {/* Store Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {t('footerHours')}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t('footerAlwaysOpen')}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t('footerContact')}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                KG 7 Ave, Kigali, Rwanda
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                +250 795 306 295
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                info@simbasupermarket.rw
              </p>
            </div>
          </div>

          {/* Social / Payment */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">MTN MoMo</span>
              <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">Airtel Money</span>
              <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">Visa</span>
              <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">Mastercard</span>
              <span className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium">Cash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {year} Simba Supermarket. {t('footerRights')}</p>
          <p>
            Created by{' '}
            <a href="https://github.com/nshh123" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              @nshh123
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
