// src/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const existing = get().cart.find((item) => item.id === product.id);
        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ cart: [...get().cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },
    }),
    {
      name: 'cart-storage', // This is the localStorage key
      getStorage: () => localStorage, // Ensures it's saving in localStorage
    }
  )
);
