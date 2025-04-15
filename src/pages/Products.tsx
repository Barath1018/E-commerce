// src/pages/Products.tsx
import React from 'react';
import products, { Product } from '../data/products';
import { useStore } from '../store';
import toast from 'react-hot-toast';

function Products() {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
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
