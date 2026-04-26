'use client';

import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { 
  Milk, 
  Coffee, 
  Apple, 
  ShoppingBag, 
  Cookie, 
  Beef, 
  ChefHat, 
  IceCream,
  Baby,
  Home
} from 'lucide-react';

interface CategoryItem {
  id: string;
  labelKey: string;
  icon: any;
  color: string;
  bg: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'Beverages', labelKey: 'beverages', icon: Coffee, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'Dairy', labelKey: 'dairy', icon: Milk, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'Produce', labelKey: 'produce', icon: Apple, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'Pantry', labelKey: 'pantry', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'Snacks', labelKey: 'snacks', icon: Cookie, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'Meat', labelKey: 'meat', icon: Beef, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'Bakery', labelKey: 'bakery', icon: ChefHat, color: 'text-stone-600', bg: 'bg-stone-50' },
  { id: 'Frozen', labelKey: 'frozen', icon: IceCream, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'Baby', labelKey: 'baby', icon: Baby, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'Home', labelKey: 'homeCare', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export function CategoryGrid() {
  const { t } = useTranslation();
  const { setSelectedCategory, setSearchQuery } = useStore();

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
    setSearchQuery('');
    
    // Smooth scroll to product section with offset for header
    const element = document.getElementById('products-section');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-2 pb-2 md:pb-8 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4 px-4 text-gray-800 dark:text-gray-100">{t('categories')}</h2>

      {/* Mobile: horizontal scroll that bleeds to screen edges */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex flex-row gap-4 pb-2 w-max snap-x snap-mandatory">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center gap-2 group transition-all w-16 shrink-0 snap-start"
            >
              <div className={`w-12 h-12 ${cat.bg} dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-transparent group-hover:border-primary/20 group-hover:shadow-md transition-all group-active:scale-95`}>
                <cat.icon className={`w-6 h-6 ${cat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <span className="text-[10px] leading-snug font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors text-center w-full">
                {t(cat.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:grid md:grid-cols-5 lg:flex lg:flex-row lg:justify-between gap-6 px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="flex flex-col items-center gap-3 group transition-all w-full lg:w-24"
          >
            <div className={`w-16 h-16 ${cat.bg} dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-transparent group-hover:border-primary/20 group-hover:shadow-md transition-all group-active:scale-95`}>
              <cat.icon className={`w-8 h-8 ${cat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <span className="text-[13px] leading-snug font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors text-center w-full px-1">
              {t(cat.labelKey)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
