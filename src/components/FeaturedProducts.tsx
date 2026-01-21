import React from 'react';
import featured, { Product } from '../data/featured';
import { useStore } from '../store';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

function FeaturedProducts() {
  const addToCart = useStore((state) => state.addToCart);
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featured.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
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
    </section>
  );
};

export default FeaturedProducts;
