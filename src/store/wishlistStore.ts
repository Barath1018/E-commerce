// store/wishlistStore.ts
import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { CatalogProduct } from './catalogStore';

interface WishlistItem {
  product: CatalogProduct;
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  fetchWishlist: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, product: CatalogProduct) => Promise<void>;
  removeFromWishlist: (userId: string, productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  loading: false,

  fetchWishlist: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', userId);

    if (error || !data?.length) {
      set({ wishlist: [], loading: false });
      return;
    }

    const productIds = data.map((item) => item.product_id);

    const { data: productRows } = await supabase
      .from('products_with_stats')
      .select('*')
      .in('id', productIds);

    const { data: fileRows } = await supabase
      .from('product_files')
      .select('*')
      .in('product_id', productIds);

    const filesByProduct = new Map<string, any[]>();
    (fileRows ?? []).forEach((f: any) => {
      const list = filesByProduct.get(f.product_id) ?? [];
      list.push(f);
      filesByProduct.set(f.product_id, list);
    });

    const wishlist: WishlistItem[] = (productRows ?? []).map((row: any) => ({
      product: {
        id: row.id,
        name: row.name,
        description: row.description,
        shortDescription: row.short_description,
        price: row.price,
        isFree: row.is_free,
        category: row.category,
        tags: row.tags ?? [],
        thumbnailUrl: row.thumbnail_url,
        previewImages: row.preview_images ?? [],
        licenseType: row.license_type,
        ratings: row.avg_rating ?? 0,
        reviewCount: row.review_count ?? 0,
        reviewsEnabled: row.reviews_enabled,
        isFeatured: row.is_featured,
        isBestSeller: row.is_best_seller,
        uniqueCodeEnabled: row.unique_code_enabled,
        uniqueCodePrefix: row.unique_code_prefix,
        downloadCount: row.download_count ?? 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        files: (filesByProduct.get(row.id) ?? []).map((f: any) => ({
          name: f.name,
          url: f.url,
          size: f.size ?? '',
          type: f.mime_type ?? 'application/octet-stream',
          source: 'upload' as const,
        })),
      } as CatalogProduct,
    }));

    set({ wishlist, loading: false });
  },

  addToWishlist: async (userId, product) => {
    const { error } = await supabase.from('wishlist').insert({
      user_id: userId,
      product_id: product.id,
    });

    if (!error) {
      set((state) => ({
        wishlist: [...state.wishlist, { product }],
      }));
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

  isInWishlist: (productId) =>
    get().wishlist.some((item) => item.product.id === productId),
}));
