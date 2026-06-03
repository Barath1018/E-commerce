import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import { Trash2, Heart } from 'lucide-react';

function Wishlist() {
  const wishlist = useStore((state) => state.wishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);

  if (wishlist.length === 0) {
    return (
      <div className="py-24 text-center">
        <Heart className="mx-auto h-12 w-12 text-white/10 mb-4" />
        <p className="text-white/40 mb-4">Your wishlist is empty.</p>
        <Link to="/products" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {wishlist.map((item) => (
          <Link
            key={item.product.id}
            to={`/products/${item.product.id}`}
            className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <img src={item.product.thumbnailUrl} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover bg-white/[0.05]" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white/80 truncate">{item.product.name}</div>
              <div className="text-sm text-white/30">
                {item.product.licenseType === 'free' ? 'Free' : `₹${item.product.price}`}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromWishlist(item.product.id);
                toast.success('Removed from wishlist');
              }}
              className="text-white/20 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
