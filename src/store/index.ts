import { create } from 'zustand';
import { User, CartItem, WishlistItem } from '../types';
export { useCartStore } from './cartStore';

// 🧠 Load from localStorage helpers
const getCartFromLocalStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem('cartItems');
  const cart = storedCart ? JSON.parse(storedCart) : [];
  console.log('Loaded cart from localStorage:', cart);  // Debugging line
  return cart;
};

const getWishlistFromLocalStorage = (): WishlistItem[] => {
  const storedWishlist = localStorage.getItem('wishlistItems');
  const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  console.log('Loaded wishlist from localStorage:', wishlist);  // Debugging line
  return wishlist;
};

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
  clearWishlist: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  cart: getCartFromLocalStorage(),
  wishlist: getWishlistFromLocalStorage(),

  setUser: (userData) => set({ user: userData }),

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
      console.log('Updated cart in localStorage:', updatedCart);  // Debugging line
      return { cart: updatedCart };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => item.product.id !== productId
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      console.log('Updated cart after removal in localStorage:', updatedCart);  // Debugging line
      return { cart: updatedCart };
    }),

  addToWishlist: (item) =>
    set((state) => {
      const updatedWishlist = [...state.wishlist, item];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      console.log('Updated wishlist in localStorage:', updatedWishlist);  // Debugging line
      return { wishlist: updatedWishlist };
    }),

  removeFromWishlist: (productId) =>
    set((state) => {
      const updatedWishlist = state.wishlist.filter(
        (item) => item.product.id !== productId
      );
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      console.log('Updated wishlist after removal in localStorage:', updatedWishlist);  // Debugging line
      return { wishlist: updatedWishlist };
    }),

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cart: [] });
    console.log('Cart cleared from localStorage');  // Debugging line
  },

  clearWishlist: () => {
    localStorage.removeItem('wishlistItems');
    set({ wishlist: [] });
    console.log('Wishlist cleared from localStorage');  // Debugging line
  },
}));
