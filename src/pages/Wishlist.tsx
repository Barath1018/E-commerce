// src/pages/Wishlist.tsx
import React from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useStore();

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
                    onClick={() => {
                      removeFromWishlist(item.product.id);
                      toast.error('Removed from wishlist');
                    }}
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
