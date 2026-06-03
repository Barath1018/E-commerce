import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProductCatalog } from '../store/catalogStore';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

function FeaturedProducts() {
  const addToCart = useStore((state) => state.addToCart);
  const { user } = useAuth();
  const navigate = useNavigate();
  const featuredProducts = useProductCatalog((state) =>
    state.products.filter((product) => product.isFeatured)
  );

  if (featuredProducts.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-[0.25em] mb-2">Featured</h2>
          <p className="text-2xl font-bold text-white">Editor's picks</p>
        </div>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.slice(0, 4).map((product) => {
          const isFree = product.licenseType === 'free' || product.isFree;
          return (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.06] transition group-hover:border-white/[0.12]">
                <img
                  src={product.thumbnailUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-white/80 group-hover:text-white transition">{product.name}</h3>
                <p className="mt-0.5 text-xs text-white/30 line-clamp-1">{product.shortDescription}</p>
                <div className="mt-2.5 flex items-center justify-between">
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
                    Add to cart
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedProducts;
