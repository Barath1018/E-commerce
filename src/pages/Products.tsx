import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { Heart, HeartOff, Search } from 'lucide-react';
import { useProductCatalog } from '../store/catalogStore';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Video Effects', 'Web Development', 'Audio', 'Motion Graphics', 'Courses'];

function Products() {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const products = useProductCatalog((state) => state.products);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [freeOnly, setFreeOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const isFreeProduct = product.licenseType === 'free' || product.isFree;
      const matchesFree = !freeOnly || isFreeProduct;
      return matchesSearch && matchesCategory && matchesFree;
    });
  }, [products, search, selectedCategory, freeOnly]);

  const freeCount = useMemo(
    () => products.filter((p) => p.licenseType === 'free' || p.isFree).length,
    [products]
  );

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.product.id === productId);

  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.error(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({ product });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <p className="mt-2 text-white/35">{products.length} products available</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm transition ${
              freeOnly
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 font-medium'
                : 'border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/70'
            }`}
          >
            Free {freeCount > 0 && <span className="ml-1 text-[10px] opacity-70">({freeCount})</span>}
          </button>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${
                  selectedCategory === cat
                    ? 'bg-white text-gray-950 font-medium'
                    : 'text-white/40 hover:bg-white/[0.06] hover:text-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-white/25">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const isFree = product.licenseType === 'free' || product.isFree;
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.06] transition group-hover:border-white/[0.12]">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                  />
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute right-3 top-3 rounded-full bg-black/40 backdrop-blur-sm p-1.5 opacity-0 transition group-hover:opacity-100 hover:bg-black/60"
                  >
                    {isInWishlist(product.id) ? (
                      <HeartOff className="h-3.5 w-3.5 text-red-400" />
                    ) : (
                      <Heart className="h-3.5 w-3.5 text-white/60" />
                    )}
                  </button>
                  {isFree && (
                    <span className="absolute left-3 top-3 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-gray-950 tracking-wide uppercase">
                      Free
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-[10px] text-white/25 uppercase tracking-widest mb-1">{product.category}</div>
                  <h3 className="text-sm font-medium text-white/80 group-hover:text-white transition">{product.name}</h3>
                  <p className="mt-1 text-xs text-white/30 line-clamp-1">{product.shortDescription || product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/90">
                      {isFree ? 'Free' : `₹${product.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!user) { navigate('/login'); return; }
                        addToCart({ product, quantity: 1, licenseType: product.licenseType });
                        toast.success(`${product.name} added to cart`);
                      }}
                      className="text-xs font-medium text-white/60 rounded-lg border border-white/[0.08] px-3 py-1 transition hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]"
                    >
                      {isFree ? 'Get' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;
