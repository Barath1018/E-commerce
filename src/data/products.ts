// src/data/products.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Transition Pack",
    description: "Enhance your videos with this professional Transitions pack.",
    image: "https://drive.google.com/drive/folders/13aOrGaRELZGYxE54FC4U1h46-WSHu8s5?usp=drive_link",
    price: 29.99,
  },
  {
    id: 2,
    name: "React Starter Template",
    description: "Kickstart your dev projects with this template.",
    image: "https://source.unsplash.com/random/400x300?code",
    price: 19.99,
  },
  {
    id: 3,
    name: "Sound FX Pack",
    description: "Level up your audio with this sound effect pack.",
    image: "https://drive.google.com/drive/folders/1sicMBT6lhTqWHPQP_pdv9WeOa1ZDSifV?usp=drive_link",
    price: 14.99,
  },
  {
    id: 4,
    name: "After Effects Presets",
    description: "Smooth transitions and effects for AE users.",
    image: "https://source.unsplash.com/random/400x300?aftereffects",
    price: 24.99,
  },
];

export default products;
