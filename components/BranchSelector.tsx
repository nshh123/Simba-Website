'use client';

import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  hours: string;
}

export const BRANCHES: Branch[] = [
  { id: 'remera',      name: 'Simba Supermarket Remera',      area: 'Remera',      address: 'KG 11 Ave, Remera, Kigali',        hours: '7AM–10PM' },
  { id: 'kimironko',  name: 'Simba Supermarket Kimironko',  area: 'Kimironko',  address: 'KG 563 St, Kimironko, Kigali',     hours: '7AM–10PM' },
  { id: 'kacyiru',    name: 'Simba Supermarket Kacyiru',    area: 'Kacyiru',    address: 'KG 7 Ave, Kacyiru, Kigali',        hours: '7AM–10PM' },
  { id: 'nyamirambo', name: 'Simba Supermarket Nyamirambo', area: 'Nyamirambo', address: 'KN 4 Ave, Nyamirambo, Kigali',     hours: '7AM–10PM' },
  { id: 'gikondo',    name: 'Simba Supermarket Gikondo',    area: 'Gikondo',    address: 'KK 15 Rd, Gikondo, Kigali',        hours: '7AM–10PM' },
  { id: 'kanombe',    name: 'Simba Supermarket Kanombe',    area: 'Kanombe',    address: 'KK 200 St, Kanombe, Kigali',       hours: '7AM–9PM'  },
  { id: 'kinyinya',   name: 'Simba Supermarket Kinyinya',   area: 'Kinyinya',   address: 'KG 770 St, Kinyinya, Kigali',     hours: '7AM–9PM'  },
  { id: 'kibagabaga', name: 'Simba Supermarket Kibagabaga', area: 'Kibagabaga', address: 'KG 236 St, Kibagabaga, Kigali',   hours: '7AM–9PM'  },
  { id: 'nyanza',     name: 'Simba Supermarket Nyanza',     area: 'Nyanza',     address: 'NZ Rd, Nyanza, Southern Province', hours: '8AM–8PM'  },
];

// Generate pick-up time slots: every 30 mins for the next 4 hours
export function generateTimeSlots(t: any): string[] {
  const slots: string[] = [];
  const now = new Date();
  // Round up to the next 30-min block + 45 min lead time
  now.setMinutes(now.getMinutes() + 45);
  const startMin = Math.ceil(now.getMinutes() / 30) * 30;
  now.setMinutes(startMin, 0, 0);

  let currentSlot = new Date(now.getTime());
  const todayDate = new Date().getDate();

  while (slots.length < 18) {
    const h = currentSlot.getHours();
    if (h >= 8 && h <= 20) {
      const isTomorrow = currentSlot.getDate() !== todayDate;
      const prefix = isTomorrow ? t('tomorrow', { defaultValue: 'Tomorrow' }) + ' ' : '';
      const m = currentSlot.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      slots.push(`${prefix}${h12}:${m} ${ampm}`);
    }
    currentSlot = new Date(currentSlot.getTime() + 30 * 60 * 1000);
    if (currentSlot.getTime() - now.getTime() > 3 * 24 * 60 * 60 * 1000) break;
  }
  return slots;
}

interface BranchSelectorProps {
  selectedBranchId: string;
  selectedTime: string;
  onBranchSelect: (branch: Branch) => void;
  onTimeSelect: (time: string) => void;
}

export function BranchSelector({
  selectedBranchId,
  selectedTime,
  onBranchSelect,
  onTimeSelect,
}: BranchSelectorProps) {
  const { t } = useTranslation();
  const { orders } = useStore();
  const timeSlots = generateTimeSlots(t);

  // Compute per-branch average rating from completed orders with reviews
  const branchRatings: Record<string, { avg: number; count: number }> = {};
  for (const order of orders) {
    if (order.branchId && (order as any).review) {
      const r = (order as any).review as number;
      if (!branchRatings[order.branchId]) branchRatings[order.branchId] = { avg: 0, count: 0 };
      const entry = branchRatings[order.branchId];
      entry.avg = (entry.avg * entry.count + r) / (entry.count + 1);
      entry.count += 1;
    }
  }

  return (
    <div className="space-y-6">
      {/* Branch cards */}
      <div>
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {t('selectBranch', { defaultValue: 'Select a Branch' })}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BRANCHES.map((branch) => {
            const rating = branchRatings[branch.id];
            const isSelected = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => onBranchSelect(branch)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm leading-tight ${isSelected ? 'text-primary' : ''}`}>
                      {branch.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{branch.address}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 shrink-0" /> {branch.hours}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    {rating ? (
                      <span className="text-xs flex items-center gap-0.5 text-amber-500 font-medium">
                        <Star className="h-3 w-3 fill-amber-500" />
                        {rating.avg.toFixed(1)}
                        <span className="text-muted-foreground font-normal">({rating.count})</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">New</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slot picker — shows once a branch is selected */}
      {selectedBranchId && (
        <div>
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {t('selectPickupTime', { defaultValue: 'Select Pick-Up Time' })}
          </h3>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onTimeSelect(slot)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-150 ${
                  selectedTime === slot
                    ? 'border-primary bg-primary text-primary-foreground shadow'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
