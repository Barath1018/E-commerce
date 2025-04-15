import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../store';

interface ProductProps {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function ProductCard({ id, name, image, price }: ProductProps) {
  const { addToWishlist } = useStore();

  return (
    <div className="relative group border rounded-lg p-4 shadow hover:shadow-md transition">
      {/* Wishlist button - visible on hover */}
      <button
        onClick={() => addToWishlist({ id, name, image, price })}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
        title="Add to Wishlist"
      >
        <Heart className="w-5 h-5 text-red-500" />
      </button>

      <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-3" />
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600">${price}</p>
    </div>
  );
}
