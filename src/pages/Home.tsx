import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import FeaturedProducts from '../components/FeaturedProducts';
import { useProductCatalog } from '../store/catalogStore';

export default function Home() {
  const products = useProductCatalog((state) => state.products);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-24">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/[0.04] blur-[150px]" />
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.03] blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="pt-20 pb-8 text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 mb-8">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium text-white/50 tracking-wide">Premium Digital Assets</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Elevate your
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            creative vision
          </span>
        </h1>
        <p className="mt-6 text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
          Curated templates, presets, and resources crafted for creators who refuse to compromise on quality.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/products"
            className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 transition hover:bg-white/90 shadow-lg shadow-white/10"
          >
            Browse Products
          </Link>
          <Link
            to="/products"
            className="rounded-xl border border-white/[0.12] bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white"
          >
            View Free Assets
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-[0.25em] mb-8 text-center">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-8 text-center transition hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition">{cat}</span>
              <span className="mt-1.5 block text-xs text-white/25">
                {products.filter((p) => p.category === cat).length} products
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <FeaturedProducts />

      {/* CTA */}
      <section className="text-center pb-8 relative">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-white/[0.02] to-transparent" />
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Start creating today</h2>
        <p className="mt-3 text-white/35">Browse the full collection and find exactly what you need.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 transition hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white"
        >
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
