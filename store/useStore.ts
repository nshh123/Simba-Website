import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  theme: 'light' | 'dark';
  language: 'en' | 'fr' | 'rw';
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'fr' | 'rw') => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      cart: [],
      theme: 'light',
      language: 'en',
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addToCart: (product, qty = 1) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              ),
              isCartOpen: true,
            };
          }
          return { cart: [...state.cart, { ...product, quantity: qty }], isCartOpen: true };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleTheme: () =>
        set((state) => {
          if (typeof window !== 'undefined') localStorage.setItem('theme-user-choice', 'true');
          return { theme: state.theme === 'light' ? 'dark' : 'light' };
        }),
      setTheme: (theme) => {
        if (typeof window !== 'undefined') localStorage.setItem('theme-user-choice', 'true');
        set({ theme });
      },
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'simba-store',
      partialize: (state) => ({ cart: state.cart, language: state.language, theme: state.theme }),
    }
  )
);
