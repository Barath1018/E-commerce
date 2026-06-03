import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrderStore } from '../store/orderStore';
import { Package, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user } = useAuth();
  const orders = useOrderStore((state) => state.getOrdersForUser(user?.id ?? ''));
  const fetchOrdersForUser = useOrderStore((state) => state.fetchOrdersForUser);
  const registerDownload = useOrderStore((state) => state.registerDownload);

  useEffect(() => {
    if (user?.id) fetchOrdersForUser(user.id);
  }, [user?.id, fetchOrdersForUser]);

  const handleDownload = async (orderId: string, productId: string, fileUrl: string, productName: string) => {
    const allowed = await registerDownload(orderId, productId);
    if (!allowed) { toast.error(`Download limit reached for ${productName}`); return; }
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.click();
    toast.success(`Download started for ${productName}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Order History</h1>

      {orders.length === 0 ? (
        <div className="py-24 text-center">
          <Package className="mx-auto h-12 w-12 text-white/10 mb-4" />
          <p className="text-white/40">No orders yet.</p>
          <Link to="/products" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white/80">#{order.id.slice(0, 8)}</span>
                  <span className="text-xs text-white/25">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    order.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-white/[0.06] text-white/40'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-white">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {order.items.map((item, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-white/70">{item.productName}</span>
                        <span className="text-sm text-white/25 ml-2">×{item.quantity}</span>
                        {item.accessCode && (
                          <span className="block text-xs text-white/20 font-mono mt-0.5">{item.accessCode}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/25 mb-1.5">{item.downloadsUsed}/{item.downloadLimit} downloads</div>
                        <div className="flex gap-1.5">
                          {item.files.map((file) => (
                            <button
                              key={file.name}
                              onClick={() => handleDownload(order.id, item.productId, file.url, item.productName)}
                              disabled={item.downloadsUsed >= item.downloadLimit}
                              className="inline-flex items-center gap-1 text-xs rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                              <Download className="h-3 w-3" />
                              {file.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
