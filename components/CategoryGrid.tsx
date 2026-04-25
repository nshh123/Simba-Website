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
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-8 pb-12 px-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t('categories')}</h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-y-6 gap-x-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="flex flex-col items-center gap-3 group transition-all"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 ${cat.bg} dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-transparent group-hover:border-primary/20 group-hover:shadow-md transition-all group-active:scale-95`}>
              <cat.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${cat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors text-center px-1">
              {t(cat.labelKey)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
