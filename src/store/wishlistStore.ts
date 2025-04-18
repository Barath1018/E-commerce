// store/wishlistStore.ts
import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  thumbnail_url: string;
}

interface WishlistItem {
  product: Product;
}

interface WishlistState {
  wishlist: WishlistItem[];
  fetchWishlist: (userId: string) => Promise<void>;
  removeFromWishlist: (userId: string, productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  fetchWishlist: async (userId) => {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      const mapped = data.map((item) => ({
        product: {
          id: item.product_id,
          name: item.name,
          price: item.price,
          description: item.description,
          thumbnail_url: item.thumbnail_url,
        },
      }));
      set({ wishlist: mapped });
    }
  },
  removeFromWishlist: async (userId, productId) => {
    await supabase
      .from('wishlist')
      .delete()
      .match({ user_id: userId, product_id: productId });

    set((state) => ({
      wishlist: state.wishlist.filter(
        (item) => item.product.id !== productId
      ),
    }));
  },
}));
