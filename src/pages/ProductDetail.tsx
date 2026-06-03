import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductCatalog } from '../store/catalogStore';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';
import { useReviewStore } from '../store/reviewStore';
import { Star, ArrowLeft, Download, Shield, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = useProductCatalog((state) => state.getProductById(id ?? ''));
  const addToCart = useStore((state) => state.addToCart);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { reviews, fetchReviews, submitReview, getAverageRating, getReviewCount } = useReviewStore();
  const [selectedLicense, setSelectedLicense] = useState<string>('standard');
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(0);

  useEffect(() => {
    if (id) fetchReviews(id);
  }, [id, fetchReviews]);

  useEffect(() => {
    if (product) {
      setSelectedLicense(product.licenseType === 'free' ? 'free' : product.licenseType);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Product not found</h1>
        <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
      </div>
    );
  }

  const avgRating = product.ratings ?? getAverageRating(product.id);
  const reviewCount = product.reviewCount ?? getReviewCount(product.id);
  const isFree = product.licenseType === 'free' || product.isFree;
  const allImages = [product.thumbnailUrl, ...(product.previewImages || [])];

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    addToCart({ product, quantity: 1, licenseType: selectedLicense as any });
    toast.success(`${product.name} added to cart`);
  };

  const handleSubmitReview = async () => {
    if (!user) { toast.error('Please login to submit a review.'); return; }
    if (userRating === 0) { toast.error('Please select a rating.'); return; }
    setSubmitting(true);
    try {
      await submitReview(product.id, user.id, userRating, userComment);
      toast.success('Review submitted');
      setUserRating(0);
      setUserComment('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Back */}
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition">
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>

      {/* Main */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <img src={allImages[selectedPreview]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {allImages.length > 1 && (
            <div className="mt-3 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPreview(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                    selectedPreview === i ? 'border-amber-500/80' : 'border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="text-[10px] text-amber-400/70 uppercase tracking-[0.25em] mb-2 font-medium">{product.category}</div>
            <h1 className="text-2xl font-bold text-white">{product.name}</h1>
            <p className="mt-3 text-white/40 leading-relaxed">{product.shortDescription || product.description}</p>
          </div>

          {avgRating > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                ))}
              </div>
              <span className="text-white/40">{avgRating.toFixed(1)} · {reviewCount} reviews</span>
            </div>
          )}

          <div className="text-3xl font-bold text-white">
            {isFree ? 'Free' : `₹${product.price}`}
          </div>

          {/* Licenses */}
          {!isFree && (
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em]">License</div>
              {[
                { key: 'standard', label: 'Standard', desc: 'Single end product', price: product.price },
                ...(product.licenseType !== 'exclusive' ? [{ key: 'extended', label: 'Extended', desc: 'Unlimited end products', price: Math.round(product.price * 1.5) }] : []),
                ...(product.licenseType !== 'standard' ? [{ key: 'exclusive', label: 'Exclusive', desc: 'Sole ownership', price: Math.round(product.price * 3) }] : []),
              ].map((lic) => (
                <label
                  key={lic.key}
                  className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition ${
                    selectedLicense === lic.key
                      ? 'border-amber-500/40 bg-amber-500/[0.05]'
                      : 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="license"
                      checked={selectedLicense === lic.key}
                      onChange={() => setSelectedLicense(lic.key)}
                      className="h-4 w-4 text-amber-500 accent-amber-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-white/80">{lic.label}</div>
                      <div className="text-xs text-white/30">{lic.desc}</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white/80">₹{lic.price}</span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-gray-950 transition hover:bg-white/90 shadow-lg shadow-white/10"
          >
            {isFree ? 'Download Free' : 'Add to Cart'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Download, label: 'Instant download' },
              { icon: Shield, label: 'Secure checkout' },
              { icon: FileCheck, label: 'License included' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-center">
                <Icon className="h-4 w-4 text-white/25" />
                <span className="text-[10px] text-white/30">{label}</span>
              </div>
            ))}
          </div>

          {/* Files */}
          {product.files.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-3">Includes</div>
              <div className="space-y-2">
                {product.files.map((file: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm">
                    <span className="text-white/60">{file.name}</span>
                    <span className="text-white/25 text-xs">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-white/35">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviewsEnabled !== false && (
        <section>
          <h2 className="text-lg font-bold text-white mb-6">Reviews ({reviewCount})</h2>

          {user && (
            <div className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-sm font-medium text-white/70 mb-3">Write a review</h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setUserRating(star)}>
                    <Star className={`h-5 w-5 transition ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-white/10 hover:text-white/30'}`} />
                  </button>
                ))}
              </div>
              <textarea
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/20 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                rows={3}
                placeholder="Share your thoughts..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
              />
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="mt-3 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-gray-950 transition hover:bg-white/90 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-white/[0.06] pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-medium text-white/50">
                      {(review.username ?? 'A')[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-white/50">{review.username ?? 'Anonymous'}</span>
                    <div className="flex gap-0.5 ml-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/20 ml-auto">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="text-sm text-white/40 mt-1.5 ml-8">{review.comment}</p>}
                </div>
              ))
            ) : (
              <p className="text-sm text-white/25">No reviews yet.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
