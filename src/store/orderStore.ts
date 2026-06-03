import { create } from 'zustand';
import { supabase } from '../supabase/client';
import { createAccessCode, useProductCatalog, CatalogProduct } from './catalogStore';

export type OrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  licenseType: string;
  downloadLimit: number;
  downloadsUsed: number;
  accessCode?: string;
  files: { name: string; url: string; size: string; type: string }[];
};

export type StoredOrder = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
};

type CreateOrderInput = {
  userId: string;
  items: Array<{
    product: CatalogProduct;
    quantity: number;
    licenseType: CatalogProduct['licenseType'];
  }>;
  total: number;
  paymentId?: string;
};

type OrderStoreState = {
  orders: StoredOrder[];
  loading: boolean;
  createOrder: (input: CreateOrderInput) => Promise<StoredOrder>;
  fetchOrdersForUser: (userId: string) => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  getOrdersForUser: (userId: string) => StoredOrder[];
  registerDownload: (orderId: string, productId: string) => Promise<boolean>;
};

const DOWNLOAD_LIMIT = 5;

const dbOrderToStored = (orderRow: any, itemRows: any[]): StoredOrder => ({
  id: orderRow.id,
  userId: orderRow.user_id,
  createdAt: orderRow.created_at,
  updatedAt: orderRow.updated_at,
  status: orderRow.status,
  total: orderRow.total,
  items: itemRows.map((item: any) => ({
    productId: item.product_id,
    productName: item.product_name,
    price: item.price,
    quantity: item.quantity,
    licenseType: item.license_type,
    downloadLimit: item.download_limit,
    downloadsUsed: item.downloads_used,
    accessCode: item.access_code,
    files: item.files ?? [],
  })),
});

export const useOrderStore = create<OrderStoreState>()((set, get) => ({
  orders: [],
  loading: false,

  createOrder: async ({ userId, items, total, paymentId }) => {
    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        status: 'completed',
        payment_id: paymentId,
      })
      .select()
      .single();

    if (orderError || !orderRow) throw orderError;

    const orderItems = items.map(({ product, quantity, licenseType }) => ({
      order_id: orderRow.id,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      license_type: licenseType,
      download_limit: DOWNLOAD_LIMIT,
      downloads_used: 0,
      access_code: product.uniqueCodeEnabled ? createAccessCode(product, orderRow.id) : undefined,
      files: product.files.map((f) => ({ name: f.name, url: f.url, size: f.size, type: f.type })),
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    for (const { product } of items) {
      await useProductCatalog.getState().incrementDownloadCount(product.id);
    }

    const storedOrder: StoredOrder = {
      id: orderRow.id,
      userId: orderRow.user_id,
      createdAt: orderRow.created_at,
      updatedAt: orderRow.updated_at,
      status: orderRow.status,
      total: orderRow.total,
      items: orderItems.map((item) => ({
        productId: item.product_id,
        productName: item.product_name,
        price: item.price,
        quantity: item.quantity,
        licenseType: item.license_type,
        downloadLimit: item.download_limit,
        downloadsUsed: item.downloads_used,
        accessCode: item.access_code,
        files: item.files,
      })),
    };

    set((state) => ({ orders: [storedOrder, ...state.orders] }));
    return storedOrder;
  },

  fetchOrdersForUser: async (userId) => {
    set({ loading: true });
    const { data: orderRows } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!orderRows?.length) {
      set({ orders: [], loading: false });
      return;
    }

    const orderIds = orderRows.map((o: any) => o.id);
    const { data: itemRows } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    const itemsByOrder = new Map<string, any[]>();
    (itemRows ?? []).forEach((item: any) => {
      const list = itemsByOrder.get(item.order_id) ?? [];
      list.push(item);
      itemsByOrder.set(item.order_id, list);
    });

    const orders = orderRows.map((row: any) =>
      dbOrderToStored(row, itemsByOrder.get(row.id) ?? [])
    );

    set({ orders, loading: false });
  },

  fetchAllOrders: async () => {
    set({ loading: true });
    const { data: orderRows } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!orderRows?.length) {
      set({ orders: [], loading: false });
      return;
    }

    const orderIds = orderRows.map((o: any) => o.id);
    const { data: itemRows } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    const itemsByOrder = new Map<string, any[]>();
    (itemRows ?? []).forEach((item: any) => {
      const list = itemsByOrder.get(item.order_id) ?? [];
      list.push(item);
      itemsByOrder.set(item.order_id, list);
    });

    const orders = orderRows.map((row: any) =>
      dbOrderToStored(row, itemsByOrder.get(row.id) ?? [])
    );

    set({ orders, loading: false });
  },

  getOrdersForUser: (userId) => get().orders.filter((order) => order.userId === userId),

  registerDownload: async (orderId, productId) => {
    const { data: item } = await supabase
      .from('order_items')
      .select('downloads_used, download_limit')
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .single();

    if (!item || item.downloads_used >= item.download_limit) return false;

    const { error } = await supabase
      .from('order_items')
      .update({ downloads_used: item.downloads_used + 1 })
      .eq('order_id', orderId)
      .eq('product_id', productId);

    if (error) return false;

    await useProductCatalog.getState().incrementDownloadCount(productId);

    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((i) =>
            i.productId === productId ? { ...i, downloadsUsed: i.downloadsUsed + 1 } : i
          ),
        };
      }),
    }));

    return true;
  },
}));
