import { create } from 'zustand';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import type { Product } from '../types';

export type ProductFile = {
  name: string;
  url: string;
  size: string;
  type: string;
  source?: 'url' | 'upload';
  storage_path?: string;
};

export type CatalogProduct = Product & {
  previewImages: string[];
  files: ProductFile[];
  uniqueCodeEnabled?: boolean;
  uniqueCodePrefix?: string;
  reviewsEnabled?: boolean;
};

type CatalogProductInput = Omit<CatalogProduct, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProductCatalogState = {
  products: CatalogProduct[];
  loading: boolean;
  addProduct: (product: CatalogProductInput) => Promise<CatalogProduct>;
  updateProduct: (productId: string, patch: Partial<CatalogProduct>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  incrementDownloadCount: (productId: string) => Promise<void>;
  getProductById: (productId: string) => CatalogProduct | undefined;
  fetchProducts: () => Promise<void>;
};

const dbProductToCatalog = (row: any, files: any[]): CatalogProduct => ({
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
  files: files.map((f: any) => ({
    name: f.name,
    url: f.url,
    size: f.size ?? '',
    type: f.mime_type ?? 'application/octet-stream',
    source: 'upload' as const,
    storage_path: f.storage_path,
  })),
});

export const useProductCatalog = create<ProductCatalogState>()((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    console.log('[Catalog] Fetching products...');

    // Fetch directly from products table (view not exposed via PostgREST)
    const { data: productRows, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !productRows) {
      console.error('[Catalog] fetchProducts error:', error);
      set({ loading: false });
      return;
    }

    console.log('[Catalog] Fetched products:', productRows.length, 'rows');

    // Fetch reviews to compute stats
    const productIds = productRows.map((p: any) => p.id);
    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('product_id, rating')
      .in('product_id', productIds);

    const statsMap = new Map<string, { avg: number; count: number }>();
    (reviewRows ?? []).forEach((r: any) => {
      const existing = statsMap.get(r.product_id) || { avg: 0, count: 0 };
      existing.avg = ((existing.avg * existing.count) + r.rating) / (existing.count + 1);
      existing.count += 1;
      statsMap.set(r.product_id, existing);
    });

    const productsWithStats = productRows.map((row: any) => {
      const stats = statsMap.get(row.id);
      return {
        ...row,
        avg_rating: stats ? Math.round(stats.avg * 100) / 100 : 0,
        review_count: stats?.count ?? 0,
      };
    });

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

    const products = productsWithStats.map((row: any) =>
      dbProductToCatalog(row, filesByProduct.get(row.id) ?? [])
    );

    set({ products, loading: false });
  },

  addProduct: async (product) => {
    const { files: productFiles, ...productData } = product;

    const dbRow = {
      name: productData.name,
      description: productData.description,
      short_description: productData.shortDescription,
      price: productData.price,
      is_free: productData.isFree ?? productData.licenseType === 'free',
      category: productData.category,
      tags: productData.tags,
      thumbnail_url: productData.thumbnailUrl,
      preview_images: productData.previewImages,
      license_type: productData.licenseType,
      is_featured: productData.isFeatured ?? false,
      is_best_seller: productData.isBestSeller ?? false,
      unique_code_enabled: productData.uniqueCodeEnabled ?? false,
      unique_code_prefix: productData.uniqueCodePrefix ?? 'AESTHIFY',
      reviews_enabled: productData.reviewsEnabled ?? true,
      download_count: productData.downloadCount ?? 0,
    };

    const { data: inserted, error } = await supabase
      .from('products')
      .insert(dbRow)
      .select()
      .single();

    if (error || !inserted) throw error;

    if (productFiles?.length) {
      const fileRows = productFiles.map((f, i) => ({
        product_id: inserted.id,
        name: f.name,
        url: f.url,
        storage_path: f.storage_path,
        size: f.size,
        mime_type: f.type,
        position: i,
      }));
      await supabase.from('product_files').insert(fileRows);
    }

    const catalogProduct = dbProductToCatalog(
      { ...inserted, avg_rating: 0, review_count: 0 },
      productFiles ?? []
    );

    set((state) => ({
      products: [catalogProduct, ...state.products],
    }));

    return catalogProduct;
  },

  updateProduct: async (productId, patch) => {
    const dbPatch: any = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.description !== undefined) dbPatch.description = patch.description;
    if (patch.shortDescription !== undefined) dbPatch.short_description = patch.shortDescription;
    if (patch.price !== undefined) dbPatch.price = patch.price;
    if (patch.isFree !== undefined) dbPatch.is_free = patch.isFree;
    if (patch.category !== undefined) dbPatch.category = patch.category;
    if (patch.tags !== undefined) dbPatch.tags = patch.tags;
    if (patch.thumbnailUrl !== undefined) dbPatch.thumbnail_url = patch.thumbnailUrl;
    if (patch.previewImages !== undefined) dbPatch.preview_images = patch.previewImages;
    if (patch.licenseType !== undefined) dbPatch.license_type = patch.licenseType;
    if (patch.isFeatured !== undefined) dbPatch.is_featured = patch.isFeatured;
    if (patch.isBestSeller !== undefined) dbPatch.is_best_seller = patch.isBestSeller;
    if (patch.uniqueCodeEnabled !== undefined) dbPatch.unique_code_enabled = patch.uniqueCodeEnabled;
    if (patch.uniqueCodePrefix !== undefined) dbPatch.unique_code_prefix = patch.uniqueCodePrefix;
    if (patch.reviewsEnabled !== undefined) dbPatch.reviews_enabled = patch.reviewsEnabled;
    if (patch.downloadCount !== undefined) dbPatch.download_count = patch.downloadCount;

    if (Object.keys(dbPatch).length > 0) {
      await supabase.from('products').update(dbPatch).eq('id', productId);
    }

    if (patch.files) {
      await supabase.from('product_files').delete().eq('product_id', productId);
      if (patch.files.length) {
        const fileRows = patch.files.map((f, i) => ({
          product_id: productId,
          name: f.name,
          url: f.url,
          storage_path: (f as any).storage_path,
          size: f.size,
          mime_type: f.type,
          position: i,
        }));
        await supabase.from('product_files').insert(fileRows);
      }
    }

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deleteProduct: async (productId) => {
    await supabase.from('products').delete().eq('id', productId);
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
  },

  incrementDownloadCount: async (productId) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;

    const newCount = (product.downloadCount ?? 0) + 1;
    await supabase
      .from('products')
      .update({ download_count: newCount })
      .eq('id', productId);

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, downloadCount: newCount } : p
      ),
    }));
  },

  getProductById: (productId) => get().products.find((p) => p.id === productId),
}));

export const createAccessCode = (product: CatalogProduct, orderId: string) => {
  // 32-character code format with fixed positions:
  // 1:A 2:E 3:S 4:T 5:H 6:I 9:2 10:K 11:6 13:X 16:4 20:9 22:F 25:7 27:M 29:3 32:P
  // Remaining positions are random alphanumeric (A-Z, 0-9)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const code = new Array(32);
  const fixed: Record<number, string> = {
    1: 'A', 2: 'E', 3: 'S', 4: 'T', 5: 'H', 6: 'I',
    9: '2', 10: 'K', 11: '6', 13: 'X', 16: '4',
    20: '9', 22: 'F', 25: '7', 27: 'M', 29: '3', 32: 'P',
  };

  for (let i = 1; i <= 32; i++) {
    if (fixed[i]) {
      code[i - 1] = fixed[i];
    } else {
      code[i - 1] = chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return code.join('');
};

let channel: RealtimeChannel | null = null;

export const subscribeToProducts = () => {
  if (channel) return;

  channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        useProductCatalog.getState().fetchProducts();
      }
    )
    .subscribe();
};

export const unsubscribeFromProducts = () => {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
};
