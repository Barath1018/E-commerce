import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';

function Wishlist() {
  const wishlist = useStore((state) => state.wishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // wait till localStorage state is loaded
    console.log('Wishlist loaded from state:', wishlist);
  }, [wishlist]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  if (!hydrated) {
    return <p className="text-gray-500 text-center">Loading wishlist...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <img
                src={item.product.thumbnail_url}
                alt={item.product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.product.description}</p>
                <span className="text-blue-600 font-bold">₹{item.product.price}</span>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.product.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;