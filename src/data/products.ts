// src/data/products.ts
import type { Product } from '../types';

const products: Product[] = [
  {
    id: "1",
    name: "Transition Pack",
    description: "Enhance your videos with this professional Transitions pack.",
    shortDescription: "Professional video transitions for Premiere Pro and After Effects",
    price: 29.99,
    category: "Video Effects",
    tags: ["transitions", "video", "premiere", "after effects"],
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    previewImages: [
      "https://source.unsplash.com/random/800x600?transition1",
      "https://source.unsplash.com/random/800x600?transition2"
    ],
    files: [
      {
        name: "Transition Pack.zip",
        url: "https://example.com/downloads/transition-pack.zip",
        size: "45 MB",
        type: "application/zip"
      }
    ],
    licenseType: "standard",
    ratings: 0,
    reviewCount: 0,
    sellerId: "seller1",
    sellerName: "CreativeAssets",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    isFeatured: true,
    isBestSeller: true,
    downloadCount: 0
  },
  {
    id: "2",
    name: "React Starter Template",
    description: "Kickstart your dev projects with this template.",
    shortDescription: "Modern React template with TypeScript, Tailwind, and Zustand",
    price: 19.99,
    category: "Web Development",
    tags: ["react", "template", "typescript", "tailwind"],
    thumbnailUrl: "https://source.unsplash.com/random/400x300?code",
    previewImages: [
      "https://source.unsplash.com/random/800x600?react1",
      "https://source.unsplash.com/random/800x600?react2"
    ],
    files: [
      {
        name: "React-Starter-Template.zip",
        url: "https://example.com/downloads/react-starter.zip",
        size: "12 MB",
        type: "application/zip"
      }
    ],
    licenseType: "standard",
    ratings: 0,
    reviewCount: 0,
    sellerId: "seller2",
    sellerName: "DevTemplates",
    createdAt: "2025-02-01T14:20:00Z",
    updatedAt: "2025-02-01T14:20:00Z",
    isFeatured: true,
    downloadCount: 0
  },
  {
    id: "3",
    name: "Sound FX Pack",
    description: "Level up your audio with this sound effect pack.",
    shortDescription: "100+ professional sound effects for video and game production",
    price: 14.99,
    category: "Audio Effects",
    tags: ["sound effects", "audio", "sfx", "game audio"],
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    previewImages: [
      "https://source.unsplash.com/random/800x600?sound1",
      "https://source.unsplash.com/random/800x600?sound2"
    ],
    files: [
      {
        name: "Sound-FX-Pack.zip",
        url: "https://example.com/downloads/sound-fx.zip",
        size: "28 MB",
        type: "application/zip"
      }
    ],
    licenseType: "standard",
    ratings: 0,
    reviewCount: 0,
    sellerId: "seller3",
    sellerName: "AudioMasters",
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-01-20T09:15:00Z",
    downloadCount: 0
  },
  {
    id: "4",
    name: "After Effects Presets",
    description: "Smooth transitions and effects for AE users.",
    shortDescription: "Professional After Effects presets for motion graphics",
    price: 24.99,
    category: "Motion Graphics",
    tags: ["after effects", "presets", "motion graphics", "animation"],
    thumbnailUrl: "https://source.unsplash.com/random/400x300?aftereffects",
    previewImages: [
      "https://source.unsplash.com/random/800x600?ae1",
      "https://source.unsplash.com/random/800x600?ae2"
    ],
    files: [
      {
        name: "AE-Presets.zip",
        url: "https://example.com/downloads/ae-presets.zip",
        size: "18 MB",
        type: "application/zip"
      }
    ],
    licenseType: "standard",
    ratings: 0,
    reviewCount: 0,
    sellerId: "seller1",
    sellerName: "CreativeAssets",
    createdAt: "2025-01-25T16:45:00Z",
    updatedAt: "2025-01-25T16:45:00Z",
    isBestSeller: true,
    downloadCount: 0
  },
  {
    id: "5",
    name: "Ultimate Video Bundle",
    description: "Complete package for video creators - transitions, effects, and sound design.",
    shortDescription: "All-in-one video production bundle",
    price: 79.99,
    category: "Video Production",
    tags: ["bundle", "video", "transitions", "effects", "sound"],
    thumbnailUrl: "https://source.unsplash.com/random/400x300?video",
    previewImages: [
      "https://source.unsplash.com/random/800x600?bundle1",
      "https://source.unsplash.com/random/800x600?bundle2"
    ],
    files: [
      {
        name: "Ultimate-Video-Bundle.zip",
        url: "https://example.com/downloads/video-bundle.zip",
        size: "156 MB",
        type: "application/zip"
      }
    ],
    licenseType: "extended",
    ratings: 0,
    reviewCount: 0,
    sellerId: "seller4",
    sellerName: "ProVideoTools",
    createdAt: "2025-03-10T11:30:00Z",
    updatedAt: "2025-03-10T11:30:00Z",
    isFeatured: true,
    downloadCount: 0
  }
];

export default products;