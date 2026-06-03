import { create } from 'zustand';
import type { CartItem, WishlistItem } from '../types';
export { useCartStore } from './cartStore';

const getCartFromLocalStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
};

const getWishlistFromLocalStorage = (): WishlistItem[] => {
  const storedWishlist = localStorage.getItem('wishlistItems');
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearCart: () => void;
  clearWishlist: () => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: getCartFromLocalStorage(),
  wishlist: getWishlistFromLocalStorage(),

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.product.id === item.product.id
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((cartItem) =>
          cartItem.product.id === item.product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...state.cart, item];
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => item.product.id !== productId
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  addToWishlist: (item) =>
    set((state) => {
      const updatedWishlist = [...state.wishlist, item];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      return { wishlist: updatedWishlist };
    }),

  removeFromWishlist: (productId) =>
    set((state) => {
      const updatedWishlist = state.wishlist.filter(
        (item) => item.product.id !== productId
      );
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      return { wishlist: updatedWishlist };
    }),

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cart: [] });
  },

  clearWishlist: () => {
    localStorage.removeItem('wishlistItems');
    set({ wishlist: [] });
  },
}));
