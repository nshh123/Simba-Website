import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  deposit: number;
  items: CartItem[];
  status: 'Processing' | 'Assigned' | 'Ready for Pick-Up' | 'Completed';
  branch: string;
  branchId: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  assignedTo?: string;
  review?: number;
}

interface StoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
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
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], assignedTo?: string) => void;
  addReview: (orderId: string, rating: number) => void;
  branchInventory: Record<string, Record<string, number>>;
  decreaseInventory: (branchId: string, items: CartItem[]) => void;
  isEvaluationMode: boolean;
  setEvaluationMode: (val: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedCategory: 'All',
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      cart: [],
      theme: 'light',
      language: 'en',
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      isEvaluationMode: false,
      setEvaluationMode: (isEvaluationMode) => set({ isEvaluationMode }),
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
            };
          }
          return { cart: [...state.cart, { ...product, quantity: qty }] };
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
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status, assignedTo) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status, ...(assignedTo !== undefined ? { assignedTo } : {}) } : o
          ),
        })),
      addReview: (orderId, rating) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, review: rating } : o
          ),
        })),
      branchInventory: {},
      decreaseInventory: (branchId, items) =>
        set((state) => {
          const currentBranchInv = state.branchInventory[branchId] || {};
          const newBranchInv = { ...currentBranchInv };
          items.forEach((item) => {
            const currentStock = newBranchInv[item.id] ?? 50; // default 50 stock if undefined
            newBranchInv[item.id] = Math.max(0, currentStock - item.quantity);
          });
          return {
            branchInventory: { ...state.branchInventory, [branchId]: newBranchInv }
          };
        }),
    }),
    {
      name: 'simba-store',
      partialize: (state) => ({
        cart: state.cart,
        language: state.language,
        theme: state.theme,
        wishlist: state.wishlist,
        orders: state.orders,
        branchInventory: state.branchInventory
      }),
    }
  )
);
