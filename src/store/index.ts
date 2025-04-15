import { create } from 'zustand';
import { User, CartItem, WishlistItem } from '../types';
export { useCartStore } from './cartStore';

interface StoreState {
  user: User | null;
  cart: CartItem[];
  wishlist: WishlistItem[];
  setUser: (user: User | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  cart: [],
  wishlist: [],
  setUser: (userData) => set({ user: userData }),
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.product.id === item.product.id
      );
      if (existingItem) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.product.id === item.product.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  addToWishlist: (item) =>
    set((state) => ({
      wishlist: [...state.wishlist, item],
    })),
  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ cart: [] }),
}));