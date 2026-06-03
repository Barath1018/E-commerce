import { supabase } from '../supabase/client';

export const saveOrderToSupabase = async (userId: string, cart: any[], totalPrice: number) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total: totalPrice,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = cart.map((item: any) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    license_type: item.licenseType || 'standard',
    download_limit: 5,
    downloads_used: 0,
    files: item.product.files?.map((f: any) => ({
      name: f.name,
      url: f.url,
      size: f.size,
      type: f.type,
    })) || [],
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};
