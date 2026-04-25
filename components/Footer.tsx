'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { BRANCHES } from './BranchSelector';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 print:hidden">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#FF8800] rounded-full p-0.5 h-10 w-10 flex items-center justify-center shrink-0">
                <Image src="/logo.jpg" alt="Simba Logo" width={36} height={36} className="rounded-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Simba Supermarket</span>
                <span className="text-xs text-muted-foreground mt-0.5">{t('tagline')}</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footerAbout')}
            </p>
          </div>

          {/* Store Hours */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              {t('footerHours')}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{t('footerAlwaysOpen')}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
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

          {/* Our Branches */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              {t('ourBranches', { defaultValue: 'Our Branches' })}
            </h3>
            <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 transition-colors">
              {BRANCHES.map((branch) => (
                <div key={branch.id} className="group">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{branch.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{branch.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {year} Simba Supermarket. {t('footerRights')}</p>
          <p>
            {t('createdBy')}{' '}
            <a href="https://github.com/nshh123" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              @nshh123
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
