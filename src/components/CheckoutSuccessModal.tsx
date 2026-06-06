import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Download, Copy, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { StoredOrder } from '../store/orderStore';

type Props = {
  order: StoredOrder;
  onClose: () => void;
};

export default function CheckoutSuccessModal({ order, onClose }: Props) {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, itemId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Access key copied!');
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.click();
    toast.success(`Downloading ${fileName}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-gray-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/30 hover:text-white/70 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="h-6 w-6 text-gray-950" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Purchase successful!</h2>
            <p className="text-xs text-white/40 font-mono">Order #{order.id.slice(0, 8)}</p>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.productName}</p>
                  <p className="text-xs text-white/30 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs text-white/40">
                  {item.downloadsUsed}/{item.downloadLimit} DL
                </span>
              </div>

              {item.accessCode && (
                <div className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
                    Access Key
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono tracking-wider text-white/90 select-all">
                      {item.accessCode}
                    </code>
                    <button
                      onClick={() => copyCode(item.accessCode!, item.productId)}
                      className="shrink-0 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/60 hover:border-white/[0.2] hover:text-white transition"
                    >
                      {copiedId === item.productId ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {item.files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => handleDownload(file.url, file.name)}
                    disabled={item.downloadsUsed >= item.downloadLimit}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/60 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {file.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 text-sm font-medium text-white/70 hover:border-white/[0.2] hover:text-white transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => { onClose(); navigate('/order-history'); }}
            className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-gray-950 hover:bg-white/90 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}
