// src/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  isFree?: boolean;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  previewImages?: string[];
  files: {
    name: string;
    url: string;
    size: string;
    type: string;
    source?: 'url' | 'upload';
  }[];
  licenseType: 'free' | 'standard' | 'extended' | 'exclusive';
  ratings?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  downloadCount?: number;
  uniqueCodeEnabled?: boolean;
  uniqueCodePrefix?: string;
  reviewsEnabled?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  licenseType: Product['licenseType'];
}

export interface WishlistItem {
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    licenseType: Product['licenseType'];
    downloadLimit: number;
    downloadsUsed: number;
    accessCode?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  downloadLinks?: Array<{
    productId: string;
    productName: string;
    fileName: string;
    url: string;
    expiresAt: string;
  }>;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  products: Product[];
  joinDate: string;
}
