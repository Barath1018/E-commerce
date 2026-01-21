import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your Supabase project details)
const supabase = createClient('supabaseUrl', 'supabaseKey');

// Function to save the order to Supabase
export const saveOrderToSupabase = async (userId: string, cart: any[], totalPrice: number) => {
  // Prepare the order data
  const orderData = {
    user_id: userId,
    items: JSON.stringify(cart), // Store cart items as a JSON string
    total_price: totalPrice,
    status: 'pending', // You can track the order status (e.g., pending, completed)
    created_at: new Date().toISOString(),
  };

  try {
    // Insert order data into the 'orders' table in Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) {
      throw new Error(error.message);
    }

    // Optionally, save each order item in a separate table for details (optional)
    await saveOrderItemsToSupabase(data[0].id, cart); // Passing the order ID

    return true; // Successfully saved order
  } catch (error) {
    console.error('Error saving order to Supabase:', error);
    return false;
  }
};

// Function to save order items to Supabase (optional)
export const saveOrderItemsToSupabase = async (orderId: number, cart: any[]) => {
  const orderItems = cart.map((item) => ({
    order_id: orderId,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  try {
    const { error } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error saving order items to Supabase:', error);
    return false;
  }
};
