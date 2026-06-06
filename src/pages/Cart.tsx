import { useState } from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrderStore, StoredOrder } from '../store/orderStore';
import toast from 'react-hot-toast';
import useRazorpayScript from '../hooks/useRazorpayScript';
import CheckoutSuccessModal from '../components/CheckoutSuccessModal';

export default function Cart() {
  const [completedOrder, setCompletedOrder] = useState<StoredOrder | null>(null);
  const { cart, clearCart, removeFromCart } = useStore();
  const { user } = useAuth();
  const createOrder = useOrderStore((state) => state.createOrder);
  const navigate = useNavigate();
  useRazorpayScript();

  const total = cart.reduce((sum, item) => {
    if (item.licenseType === 'free') return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }

    const freeItems = cart.filter((i) => i.licenseType === 'free');
    const paidItems = cart.filter((i) => i.licenseType !== 'free');

    if (freeItems.length > 0 && paidItems.length === 0) {
      try {
        const order = await createOrder({
          userId: user.id,
          items: freeItems.map((i) => ({ product: i.product, quantity: i.quantity, licenseType: i.licenseType })),
          total: 0,
        });
        clearCart();
        setCompletedOrder(order);
      } catch (err: any) { toast.error(err.message); }
      return;
    }

    const keyId = (import.meta.env.VITE_RAZORPAY_KEY_ID as string)?.replace(/['"]/g, '').trim();
    if (!keyId) { toast.error('Razorpay key missing.'); return; }
    if (!window.Razorpay) { toast.error('Razorpay SDK loading.'); return; }

    const razorpay = new window.Razorpay({
      key: keyId,
      amount: Math.round(total * 100),
      currency: 'INR',
      name: 'Aesthify Studio',
      description: `${paidItems.length} item(s)`,
      handler: async () => {
        try {
          const order = await createOrder({
            userId: user.id,
            items: [...paidItems, ...freeItems].map((i) => ({ product: i.product, quantity: i.quantity, licenseType: i.licenseType })),
            total,
          });
          clearCart();
          setCompletedOrder(order);
        } catch (err: any) { toast.error(err.message); }
      },
      prefill: { name: user.user_metadata?.full_name ?? '', email: user.email ?? '' },
      theme: { color: '#ffffff' },
      modal: { ondismiss: () => toast('Payment cancelled') },
    });
    razorpay.open();
  };

  if (completedOrder) {
    return <CheckoutSuccessModal order={completedOrder} onClose={() => setCompletedOrder(null)} />;
  }

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-white/10 mb-4" />
        <p className="text-white/40 mb-4">Your cart is empty.</p>
        <Link to="/products" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Cart</h1>
      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item.product.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.1]">
            <img src={item.product.thumbnailUrl} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-white/[0.05]" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white/80 truncate">{item.product.name}</div>
              <div className="text-xs text-white/30 mt-0.5">Qty: {item.quantity}</div>
            </div>
            <div className="text-sm font-semibold text-white/90">
              {item.licenseType === 'free' ? 'Free' : `₹${item.product.price}`}
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="text-white/20 hover:text-red-400 transition p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-white/[0.06] pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-white/40">Total</span>
          <span className="text-xl font-bold text-white">₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-gray-950 transition hover:bg-white/90 shadow-lg shadow-white/10"
        >
          {total === 0 ? 'Download Free' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}
