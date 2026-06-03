import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { Review } from '../types';

type ReviewState = {
  reviews: Review[];
  loading: boolean;
  fetchReviews: (productId: string) => Promise<void>;
  submitReview: (productId: string, userId: string, rating: number, comment?: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getReviewsForProduct: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
  getReviewCount: (productId: string) => number;
};

export const useReviewStore = create<ReviewState>()((set, get) => ({
  reviews: [],
  loading: false,

  fetchReviews: async (productId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles:user_id(username)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const reviews: Review[] = data.map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        userId: r.user_id,
        rating: r.rating,
        comment: r.comment,
        username: r.profiles?.username ?? 'Anonymous',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
      set({ reviews, loading: false });
    } else {
      set({ loading: false });
    }
  },

  submitReview: async (productId, userId, rating, comment) => {
    // Check if review already exists
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: userId,
        rating,
        comment,
      });
      if (error) throw error;
    }

    await get().fetchReviews(productId);
  },

  deleteReview: async (reviewId) => {
    const review = get().reviews.find((r) => r.id === reviewId);
    await supabase.from('reviews').delete().eq('id', reviewId);

    if (review) {
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== reviewId),
      }));
    }
  },

  getReviewsForProduct: (productId) =>
    get().reviews.filter((r) => r.productId === productId),

  getAverageRating: (productId) => {
    const reviews = get().reviews.filter((r) => r.productId === productId);
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  getReviewCount: (productId) =>
    get().reviews.filter((r) => r.productId === productId).length,
}));
