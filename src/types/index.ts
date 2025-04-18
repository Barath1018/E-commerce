// src/store/index.ts
import { create } from 'zustand';
// src/types/index.ts
import  Product  from '../data/products';

export interface WishlistItem {
  product: Product;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
}

interface StoreState {
  cart: { product: Product; quantity: number }[];
  wishlist: Product[];
  user: null | object;
  addToCart: (item: { product: Product; quantity: number }) => void;
  addToWishlist: (product: Product) => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  wishlist: [],
  user: null,
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
  addToWishlist: (product) =>
    set((state) => ({
      wishlist: [...state.wishlist, product],
    })),
}));
