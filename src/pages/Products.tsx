// src/pages/Products.tsx
import React from 'react';
import products from '../data/products';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { Heart, HeartOff } from 'lucide-react';

function Products() {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.product.id === productId);

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.error(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({ product });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {isInWishlist(product.id) ? (
                <HeartOff className="w-5 h-5 text-red-500" />
              ) : (
                <Heart className="w-5 h-5 text-red-500" />
              )}
            </button>

            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-600">₹{product.price}</span>
                <button
                  onClick={() => {
                    addToCart({ product, quantity: 1 });
                    toast.success(`${product.name} added to cart!`);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
