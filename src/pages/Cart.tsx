// src/pages/Cart.tsx
import React from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import useRazorpayScript from '../hooks/useRazorpayScript';

export default function Cart() {
  const { cart, removeFromCart } = useStore();
  useRazorpayScript(); // Load Razorpay script

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    const options = {
      key: 'rzp_test_reQV4DJMcIRq0J', // 🔁 Replace with your Razorpay test key
      amount: total * 100, // in paise (without tax)
      currency: 'INR',
      name: 'Aesthify Studio',
      description: 'Order Payment',
      image: 'https://your-logo-url.com/logo.png',
      handler: function (response: any) {
        alert(`Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);
        // You can redirect or save payment status here
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#2563eb', // Tailwind blue-600
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 p-4 border-b last:border-b-0"
              >
                <img
                  src={item.product.thumbnail_url}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-gray-600 text-sm">{item.product.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-blue-600 font-semibold">
                      ₹{item.product.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500">Quantity: {item.quantity}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-600 p-2"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
