// src/data/FeaturedProducts.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const featured: Product[] = [
  {
    id: 1,
    name: "Transition Pack",
    description: "Enhance your videos with this professional Transitions pack.",
    image: "https://source.unsplash.com/random/400x300?transition", // Replace with your actual image
    price: 29.99,
  },
  {
    id: 2,
    name: "Sound FX Pack",
    description: "Level up your audio with this sound effect pack.",
    image: "https://source.unsplash.com/random/400x300?sound", // Replace with your actual image
    price: 14.99,
  },
  {
    id: 3,
    name: "After Effects Presets",
    description: "Smooth transitions and effects for AE users.",
    image: "https://source.unsplash.com/random/400x300?aftereffects",
    price: 24.99,
  },
];

export default featured;
